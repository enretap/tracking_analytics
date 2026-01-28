<?php

namespace App\Services;

use App\Models\Account;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Exception;

class EcoDrivingService
{
    /**
     * Fetch eco-driving data from TARGA TELEMATICS platform
     *
     * @param Account $account
     * @param string|null $startDate Format: Y-m-d
     * @param string|null $endDate Format: Y-m-d
     * @return array
     */
    public function fetchEcoDrivingData(Account $account, ?string $startDate = null, ?string $endDate = null): array
    {
        try {
            // Get TARGA TELEMATICS platform configuration
            $platform = $account->platforms()
                ->where('name', 'TARGA TELEMATICS')
                ->first();

            if (!$platform) {
                Log::warning("TARGA TELEMATICS platform not configured for account {$account->id}");
                return $this->getEmptyData();
            }

            $apiUrl = rtrim($platform->pivot->api_url ?? '', '/');
            $apiToken = $platform->pivot->api_token;

            if (!$apiUrl || !$apiToken) {
                Log::warning("Missing API credentials for TARGA TELEMATICS on account {$account->id}");
                return $this->getEmptyData();
            }

            // Default date range: last 7 days
            if (!$startDate) {
                $startDate = now()->subDays(7)->format('Y-m-d');
            }
            if (!$endDate) {
                $endDate = now()->format('Y-m-d');
            }

            // Cache key for this request
            $cacheKey = "eco_driving_{$account->id}_{$startDate}_{$endDate}";

            // Try to get from cache (5 minutes TTL)
            return Cache::remember($cacheKey, 300, function () use ($apiUrl, $apiToken, $startDate, $endDate) {
                return $this->callEcoDrivingEndpoint($apiUrl, $apiToken, $startDate, $endDate);
            });

        } catch (Exception $e) {
            Log::error("Error fetching eco-driving data: " . $e->getMessage(), [
                'account_id' => $account->id,
                'trace' => $e->getTraceAsString()
            ]);
            return $this->getEmptyData();
        }
    }

    /**
     * Call the getDailyVehicleEcoSummary endpoint
     *
     * @param string $apiUrl
     * @param string $apiToken
     * @param string $startDate
     * @param string $endDate
     * @return array
     */
    protected function callEcoDrivingEndpoint(string $apiUrl, string $apiToken, string $startDate, string $endDate): array
    {
        $endpoint = $apiUrl . '/json/getDailyVehicleEcoSummary';

        $payload = [
            'sessionId' => $apiToken,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ];

        Log::info("Calling TARGA TELEMATICS eco-driving endpoint", [
            'url' => $endpoint,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);

        $response = Http::timeout(30)
            ->post($endpoint, $payload);

        if ($response->failed()) {
            $statusCode = $response->status();
            $body = $response->body();
            
            Log::error("TARGA TELEMATICS API request failed", [
                'status' => $statusCode,
                'body' => $body,
            ]);

            throw new Exception("API request failed with status {$statusCode}");
        }

        $data = $response->json();

        if (!$data || !isset($data['dailyEcoSummaries'])) {
            Log::warning("Unexpected response format from TARGA TELEMATICS", [
                'response' => $data
            ]);
            return $this->getEmptyData();
        }

        // Transform the API response to match our EcoDrivingData interface
        return $this->transformApiResponse($data);
    }

    /**
     * Transform TARGA TELEMATICS API response to match EcoDrivingData interface
     *
     * @param array $apiData
     * @return array
     */
    protected function transformApiResponse(array $apiData): array
    {
        $dailyEcoSummaries = $apiData['dailyEcoSummaries'] ?? [];

        Log::info("TARGA API Response received", [
            'total_summaries' => count($dailyEcoSummaries),
            'sample' => count($dailyEcoSummaries) > 0 ? $dailyEcoSummaries[0] : null
        ]);

        // Group by vehicleId and aggregate data
        $vehicleGroups = [];
        foreach ($dailyEcoSummaries as $summary) {
            $vehicleId = $summary['vehicleId'];
            
            if (!isset($vehicleGroups[$vehicleId])) {
                $vehicleGroups[$vehicleId] = [];
            }
            
            $vehicleGroups[$vehicleId][] = $summary;
        }

        Log::info("Grouped vehicles", [
            'total_groups' => count($vehicleGroups),
            'vehicle_ids' => array_keys($vehicleGroups)
        ]);

        // Initialize metrics
        $totalVehicles = count($vehicleGroups);
        $activeVehicles = 0;
        $totalDistance = 0;
        $totalViolations = 0;
        $driverSet = [];

        $vehicleDetails = [];

        foreach ($vehicleGroups as $vehicleId => $summaries) {
            // Aggregate data for this vehicle across all days
            $totalRealMileage = 0;
            $totalRealDuration = 0;
            $totalIdleTime = 0;
            $maxSpeedOverall = 0;
            $totalAcceleration = 0;
            $totalBraking = 0;
            $totalTurns = 0;
            $totalOverspeed = 0;
            $totalViolationsVehicle = 0;
            
            $vehicleName = '';
            
            foreach ($summaries as $summary) {
                $vehicleName = $summary['vehicle'] ?? 'N/A';
                $totalRealMileage += (float) ($summary['realMileage'] ?? 0);
                $totalRealDuration += (int) ($summary['realDuration'] ?? 0);
                $totalIdleTime += (int) ($summary['idleTime'] ?? 0);
                
                $currentMaxSpeed = (float) ($summary['maxSpeed'] ?? 0);
                if ($currentMaxSpeed > $maxSpeedOverall) {
                    $maxSpeedOverall = $currentMaxSpeed;
                }
                
                // Handle violations (-1 means not measured, treat as 0)
                $accel = (int) ($summary['dailyViolationAcceleration'] ?? 0);
                $brake = (int) ($summary['dailyViolationBreak'] ?? 0);
                $turn = (int) ($summary['dailyViolationTurn'] ?? 0);
                $overspeed = (int) ($summary['dailyViolationOverspeed'] ?? 0);
                
                $totalAcceleration += max(0, $accel);
                $totalBraking += max(0, $brake);
                $totalTurns += max(0, $turn);
                $totalOverspeed += max(0, $overspeed);
                
                $totalViolationsVehicle += (float) ($summary['totalViolations'] ?? 0);
            }

            // Convert durations from seconds to "Xh XXmin" format
            $drivingTime = $this->secondsToHourMinFormat($totalRealDuration);
            $idleTime = $this->secondsToHourMinFormat($totalIdleTime);
            
            // Extract driver name from project or use default
            $driver = 'Non assigné'; // TARGA API doesn't provide driver in this endpoint

            // Accumulate metrics
            if ($totalRealMileage > 0) {
                $activeVehicles++;
            }
            $totalDistance += $totalRealMileage;
            $totalViolations += $totalViolationsVehicle;

            // Add to vehicle details
            $vehicleDetails[] = [
                'immatriculation' => $vehicleName,
                'driver' => $driver,
                'project' => null,
                'max_speed' => (int) $maxSpeedOverall,
                'distance' => round($totalRealMileage, 2),
                'driving_time' => $drivingTime,
                'idle_time' => $idleTime,
                'harsh_braking' => $totalBraking,
                'harsh_acceleration' => $totalAcceleration,
                'dangerous_turns' => $totalTurns,
                'speed_violations' => $totalOverspeed,
                'driving_time_violations' => 0, // Not provided by API
                'total_violations' => (int) $totalViolationsVehicle,
            ];
        }

        // Count unique drivers (not available in this API, use vehicle count as proxy)
        $totalDrivers = $totalVehicles;

        Log::info("Transformation complete", [
            'total_vehicles' => $totalVehicles,
            'vehicle_details_count' => count($vehicleDetails),
            'first_vehicle' => count($vehicleDetails) > 0 ? $vehicleDetails[0]['immatriculation'] : null
        ]);

        return [
            // Métriques de la flotte
            'total_vehicles' => $totalVehicles,
            'active_vehicles' => $activeVehicles,
            'inactive_vehicles' => $totalVehicles - $activeVehicles,
            'total_distance' => round($totalDistance, 2),
            
            // Métriques des conducteurs
            'total_drivers' => $totalDrivers,
            'active_drivers' => $totalDrivers,
            'average_driver_score' => $totalViolations > 0 ? max(0, 100 - ($totalViolations / $totalVehicles)) : 100,
            
            // Métriques opérationnelles
            'total_trips' => 0,
            'average_trip_distance' => $activeVehicles > 0 ? round($totalDistance / $activeVehicles, 2) : 0,
            'operating_hours' => 0,
            
            // Métriques de carburant
            'total_fuel_consumption' => 0,
            'average_fuel_efficiency' => 0,
            'fuel_cost' => 0,
            
            // Métriques de maintenance
            'scheduled_maintenances' => 0,
            'completed_maintenances' => 0,
            'pending_maintenances' => 0,
            'maintenance_cost' => 0,
            
            // Alertes et incidents
            'total_alerts' => (int) $totalViolations,
            'critical_alerts' => array_reduce($vehicleDetails, function ($carry, $v) {
                return $carry + (($v['total_violations'] ?? 0) > 50 ? 1 : 0);
            }, 0),
            'resolved_alerts' => 0,
            
            // Performance
            'compliance_rate' => $totalVehicles > 0 ? max(0, 100 - (($totalViolations / $totalVehicles) * 10)) : 100,
            'on_time_delivery' => 0,
            
            // Période
            'period_start' => isset($dailyEcoSummaries[0]['datum']) ? $dailyEcoSummaries[0]['datum'] : null,
            'period_end' => isset($dailyEcoSummaries[count($dailyEcoSummaries) - 1]['datum']) 
                ? $dailyEcoSummaries[count($dailyEcoSummaries) - 1]['datum'] 
                : null,
            
            // Détails véhicules/conducteurs
            'vehicle_details' => $vehicleDetails,
        ];
    }

    /**
     * Convert seconds to "Xh XXmin" format
     *
     * @param int $seconds
     * @return string
     */
    protected function secondsToHourMinFormat(int $seconds): string
    {
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        
        return sprintf('%dh %02dmin', $hours, $minutes);
    }

    /**
     * Get empty data structure
     *
     * @return array
     */
    protected function getEmptyData(): array
    {
        return [
            'total_vehicles' => 0,
            'active_vehicles' => 0,
            'inactive_vehicles' => 0,
            'total_distance' => 0,
            'total_drivers' => 0,
            'active_drivers' => 0,
            'average_driver_score' => 0,
            'total_trips' => 0,
            'average_trip_distance' => 0,
            'operating_hours' => 0,
            'total_fuel_consumption' => 0,
            'average_fuel_efficiency' => 0,
            'fuel_cost' => 0,
            'scheduled_maintenances' => 0,
            'completed_maintenances' => 0,
            'pending_maintenances' => 0,
            'maintenance_cost' => 0,
            'total_alerts' => 0,
            'critical_alerts' => 0,
            'resolved_alerts' => 0,
            'compliance_rate' => 0,
            'on_time_delivery' => 0,
            'period_start' => null,
            'period_end' => null,
            'vehicle_details' => [],
        ];
    }

    /**
     * Clear cached eco-driving data for an account
     *
     * @param Account $account
     * @return void
     */
    public function clearCache(Account $account): void
    {
        // Clear specific cache keys for this account
        // Generate all possible cache keys for the last year
        $dates = [];
        $start = now()->subYear();
        $end = now()->addMonth();
        
        while ($start <= $end) {
            $dates[] = $start->format('Y-m-d');
            $start->addDay();
        }
        
        // Clear cache for common date ranges
        foreach ($dates as $i => $startDate) {
            for ($j = $i; $j < count($dates) && $j < $i + 400; $j++) {
                $endDate = $dates[$j];
                $cacheKey = "eco_driving_{$account->id}_{$startDate}_{$endDate}";
                Cache::forget($cacheKey);
            }
        }
        
        // Also flush entire cache as fallback
        Cache::flush();
        
        Log::info("Cleared eco-driving cache for account {$account->id}");
    }
}
