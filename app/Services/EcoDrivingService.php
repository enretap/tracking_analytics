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
            $project = null;
            
            foreach ($summaries as $summary) {
                $vehicleName = $summary['vehicle'] ?? 'N/A';
                // Essayer d'extraire le project de différents champs possibles
                if (!$project) {
                    $project = $summary['project'] ?? $summary['vehicleProjectName'] ?? $summary['projectName'] ?? null;
                }
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
                'project' => $project,
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

    /**
     * Fetch fleet activity data grouped by distributor/project
     *
     * @param Account $account
     * @param string|null $startDate
     * @param string|null $endDate
     * @return array
     */
    public function fetchFleetActivityData(Account $account, ?string $startDate = null, ?string $endDate = null): array
    {
        try {
            // Get base eco-driving data
            $ecoData = $this->fetchEcoDrivingData($account, $startDate, $endDate);
            
            if (!isset($ecoData['vehicle_details']) || empty($ecoData['vehicle_details'])) {
                return $this->getEmptyFleetActivityData();
            }
            
            return $this->transformToFleetActivityData($ecoData, $startDate, $endDate);
        } catch (Exception $e) {
            Log::error("Error fetching fleet activity data: " . $e->getMessage(), [
                'account_id' => $account->id,
                'trace' => $e->getTraceAsString()
            ]);
            return $this->getEmptyFleetActivityData();
        }
    }

    /**
     * Transform eco-driving data to fleet activity format with distributor grouping
     *
     * @param array $ecoData
     * @param string|null $startDate
     * @param string|null $endDate
     * @return array
     */
    protected function transformToFleetActivityData(array $ecoData, ?string $startDate, ?string $endDate): array
    {
        $vehicleDetails = $ecoData['vehicle_details'] ?? [];
        
        // Group vehicles by project/distributor
        $distributorGroups = [];
        foreach ($vehicleDetails as $vehicle) {
            $project = $vehicle['project'] ?? 'Non assigné';
            
            if (!isset($distributorGroups[$project])) {
                $distributorGroups[$project] = [
                    'name' => $project,
                    'vehicles' => [],
                    'active_vehicles' => 0,
                    'inactive_vehicles' => 0,
                    'distance' => 0,
                    'trips' => 0,
                ];
            }
            
            $distributorGroups[$project]['vehicles'][] = $vehicle;
            
            // Compter les véhicules actifs (ceux qui ont parcouru une distance)
            if (($vehicle['distance'] ?? 0) > 0) {
                $distributorGroups[$project]['active_vehicles']++;
            } else {
                $distributorGroups[$project]['inactive_vehicles']++;
            }
            
            $distributorGroups[$project]['distance'] += ($vehicle['distance'] ?? 0);
            // Estimer le nombre de trajets basé sur les données (pour l'instant, on utilise 1 trajet par véhicule actif)
            // Dans une vraie implémentation, ces données viendraient d'un autre endpoint
            if (($vehicle['distance'] ?? 0) > 0) {
                $distributorGroups[$project]['trips']++;
            }
        }
        
        // Convertir en array de distributeurs
        $distributors = array_values($distributorGroups);
        
        // Calculer les totaux
        $totalVehicles = count($vehicleDetails);
        $activeVehicles = array_sum(array_column($distributors, 'active_vehicles'));
        $inactiveVehicles = $totalVehicles - $activeVehicles;
        $totalDistance = array_sum(array_column($distributors, 'distance'));
        $totalTrips = array_sum(array_column($distributors, 'trips'));
        
        // Calculer la durée totale depuis les vehicle_details
        $totalDurationSeconds = 0;
        foreach ($vehicleDetails as $vehicle) {
            // Extraire les heures et minutes du format "Xh XXmin"
            $drivingTime = $vehicle['driving_time'] ?? '0h 00min';
            if (preg_match('/(\d+)h\s*(\d+)min/', $drivingTime, $matches)) {
                $hours = (int)$matches[1];
                $minutes = (int)$matches[2];
                $totalDurationSeconds += ($hours * 3600) + ($minutes * 60);
            }
        }
        
        // Convertir en format HH:MM:SS
        $hours = floor($totalDurationSeconds / 3600);
        $minutes = floor(($totalDurationSeconds % 3600) / 60);
        $seconds = $totalDurationSeconds % 60;
        $totalDuration = sprintf('%d:%02d:%02d', $hours, $minutes, $seconds);
        
        // Compter les distributeurs concernés
        $distributorsCount = count($distributors);
        
        // Véhicules avec trajets
        $vehiclesWithTrips = $activeVehicles;
        
        return [
            // KPIs principaux
            'total_vehicles' => $totalVehicles,
            'inactive_vehicles' => $inactiveVehicles,
            'vehicles_with_trips' => $vehiclesWithTrips,
            'distributors_count' => $distributorsCount,
            'total_trips' => $totalTrips,
            'total_distance' => round($totalDistance, 2),
            'total_duration' => $totalDuration,
            
            // Données par distributeur
            'distributors' => $distributors,
            
            // Données héritées pour compatibilité
            'active_vehicles' => $activeVehicles,
            'total_alerts' => $ecoData['total_alerts'] ?? 0,
            'compliance_rate' => $ecoData['compliance_rate'] ?? 95,
            'operating_hours' => $hours,
            'period_start' => $ecoData['period_start'] ?? $startDate,
            'period_end' => $ecoData['period_end'] ?? $endDate,
        ];
    }

    /**
     * Get empty fleet activity data structure
     *
     * @return array
     */
    protected function getEmptyFleetActivityData(): array
    {
        return [
            'total_vehicles' => 0,
            'inactive_vehicles' => 0,
            'vehicles_with_trips' => 0,
            'distributors_count' => 0,
            'total_trips' => 0,
            'total_distance' => 0,
            'total_duration' => '0:00:00',
            'distributors' => [],
            'active_vehicles' => 0,
            'total_alerts' => 0,
            'compliance_rate' => 0,
            'operating_hours' => 0,
            'period_start' => null,
            'period_end' => null,
        ];
    }
}

