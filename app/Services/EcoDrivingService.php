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
                ->orWhere('base_api_url', 'LIKE', '%fleet.securysat.com%')
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

        if (!$data || !isset($data['result'])) {
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
        $result = $apiData['result'] ?? [];
        $vehicles = $result['data'] ?? [];

        // Initialize metrics
        $totalVehicles = count($vehicles);
        $activeVehicles = 0;
        $totalDistance = 0;
        $totalFuelConsumption = 0;
        $totalViolations = 0;
        $totalDrivers = 0;
        $driverSet = [];

        $vehicleDetails = [];

        foreach ($vehicles as $vehicle) {
            // Extract vehicle data
            $immatriculation = $vehicle['vehicleName'] ?? $vehicle['plate'] ?? 'N/A';
            $driver = $vehicle['driverName'] ?? 'Non assigné';
            $distance = (float) ($vehicle['distance'] ?? 0);
            $maxSpeed = (int) ($vehicle['maxSpeed'] ?? 0);
            
            // Driving times
            $drivingTime = $vehicle['drivingTime'] ?? '0h 00min';
            $idleTime = $vehicle['idleTime'] ?? '0h 00min';
            
            // Violations/Events
            $harshBraking = (int) ($vehicle['harshBraking'] ?? 0);
            $harshAcceleration = (int) ($vehicle['harshAcceleration'] ?? 0);
            $dangerousTurns = (int) ($vehicle['dangerousTurns'] ?? 0);
            $speedViolations = (int) ($vehicle['speedingEvents'] ?? 0);
            $drivingTimeViolations = (int) ($vehicle['drivingTimeViolations'] ?? 0);
            
            $vehicleTotalViolations = $harshBraking + $harshAcceleration + $dangerousTurns + $speedViolations + $drivingTimeViolations;

            // Accumulate metrics
            if ($distance > 0) {
                $activeVehicles++;
            }
            $totalDistance += $distance;
            $totalViolations += $vehicleTotalViolations;
            
            if ($driver !== 'Non assigné' && !in_array($driver, $driverSet)) {
                $driverSet[] = $driver;
                $totalDrivers++;
            }

            // Add to vehicle details
            $vehicleDetails[] = [
                'immatriculation' => $immatriculation,
                'driver' => $driver,
                'project' => $vehicle['project'] ?? null,
                'max_speed' => $maxSpeed,
                'distance' => $distance,
                'driving_time' => $drivingTime,
                'idle_time' => $idleTime,
                'harsh_braking' => $harshBraking,
                'harsh_acceleration' => $harshAcceleration,
                'dangerous_turns' => $dangerousTurns,
                'speed_violations' => $speedViolations,
                'driving_time_violations' => $drivingTimeViolations,
                'total_violations' => $vehicleTotalViolations,
            ];
        }

        // Calculate average fuel efficiency if available
        $averageFuelEfficiency = $totalVehicles > 0 ? ($totalFuelConsumption / $totalVehicles) : 0;

        return [
            // Métriques de la flotte
            'total_vehicles' => $totalVehicles,
            'active_vehicles' => $activeVehicles,
            'inactive_vehicles' => $totalVehicles - $activeVehicles,
            'total_distance' => $totalDistance,
            
            // Métriques des conducteurs
            'total_drivers' => $totalDrivers,
            'active_drivers' => $totalDrivers, // Assuming all listed drivers are active
            'average_driver_score' => $totalViolations > 0 ? (100 - min(100, $totalViolations / $totalVehicles)) : 100,
            
            // Métriques opérationnelles
            'total_trips' => 0, // Not available in this endpoint
            'average_trip_distance' => $activeVehicles > 0 ? ($totalDistance / $activeVehicles) : 0,
            'operating_hours' => 0, // Calculate from driving times if needed
            
            // Métriques de carburant
            'total_fuel_consumption' => $totalFuelConsumption,
            'average_fuel_efficiency' => $averageFuelEfficiency,
            'fuel_cost' => 0, // Not available
            
            // Métriques de maintenance
            'scheduled_maintenances' => 0,
            'completed_maintenances' => 0,
            'pending_maintenances' => 0,
            'maintenance_cost' => 0,
            
            // Alertes et incidents
            'total_alerts' => $totalViolations,
            'critical_alerts' => array_reduce($vehicleDetails, function ($carry, $v) {
                return $carry + (($v['total_violations'] ?? 0) > 50 ? 1 : 0);
            }, 0),
            'resolved_alerts' => 0,
            
            // Performance
            'compliance_rate' => $totalViolations > 0 ? (100 - min(100, ($totalViolations / $totalVehicles) * 10)) : 100,
            'on_time_delivery' => 0,
            
            // Période
            'period_start' => $apiData['startDate'] ?? null,
            'period_end' => $apiData['endDate'] ?? null,
            
            // Détails véhicules/conducteurs
            'vehicle_details' => $vehicleDetails,
        ];
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
        $pattern = "eco_driving_{$account->id}_*";
        
        // Note: This is a simple implementation. For production, you may want to use
        // a more sophisticated cache tagging system
        Cache::flush();
        
        Log::info("Cleared eco-driving cache for account {$account->id}");
    }
}
