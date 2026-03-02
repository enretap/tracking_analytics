<?php

namespace App\Services;

use App\Models\Account;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Exception;

class CtrackEcoDrivingService
{
    /**
     * Fetch eco-driving data from CTRACK platform
     *
     * @param Account $account
     * @param string|null $startDate Format: m/d/Y
     * @param string|null $endDate Format: m/d/Y
     * @return array
     */
    public function fetchEcoDrivingData(Account $account, ?string $startDate = null, ?string $endDate = null): array
    {
        try {
            // Get CTRACK platform configuration
            $platform = $account->platforms()
                ->where('slug', 'ctrack')
                ->orWhere('name', 'LIKE', '%CTRACK%')
                ->first();

            if (!$platform) {
                Log::warning("CTRACK platform not configured for account {$account->id}");
                return $this->getEmptyData();
            }

            $apiUrl = 'https://comafrique-ctrack.online';
            $apiToken = $platform->pivot->api_token;
            $ctrackAccountId = $account->reference_ctrack ?? null;

            if (!$apiUrl || !$apiToken) {
                Log::warning("Missing API credentials for CTRACK on account {$account->id}");
                return $this->getEmptyData();
            }

            // Vérifier que reference_ctrack est défini pour filtrer les données
            if (!$ctrackAccountId) {
                Log::warning("Missing reference_ctrack for account {$account->id}. Data will not be filtered by account.");
            } else {
                Log::info("Filtering CTRACK data by account ID: {$ctrackAccountId}");
            }

            // Default date range: today
            if (!$startDate) {
                $startDate = now()->format('m/d/Y');
            }
            if (!$endDate) {
                $endDate = now()->format('m/d/Y');
            }

            // Cache key for this request
            $cacheKey = "ctrack_eco_driving_{$account->id}_{$startDate}_{$endDate}";
            if ($ctrackAccountId) {
                $cacheKey .= "_{$ctrackAccountId}";
            }

            // Try to get from cache (5 minutes TTL)
            return Cache::remember($cacheKey, 300, function () use ($apiUrl, $apiToken, $ctrackAccountId, $startDate, $endDate) {
                return $this->callEcoDrivingEndpoint($apiUrl, $apiToken, $ctrackAccountId, $startDate, $endDate);
            });

        } catch (Exception $e) {
            Log::error("Error fetching CTRACK eco-driving data: " . $e->getMessage(), [
                'account_id' => $account->id,
                'trace' => $e->getTraceAsString()
            ]);
            return $this->getEmptyData();
        }
    }

    /**
     * Call the CTRACK ecoDriving endpoint
     *
     * @param string $apiUrl Base URL (e.g., https://comafrique-ctrack.online)
     * @param string $apiToken Bearer token
     * @param string|null $ctrackAccountId Référence CTRACK du compte (reference_ctrack)
     * @param string $startDate Format: m/d/Y
     * @param string $endDate Format: m/d/Y
     * @return array
     */
    protected function callEcoDrivingEndpoint(string $apiUrl, string $apiToken, ?string $ctrackAccountId, string $startDate, string $endDate): array
    {
        // Build full endpoint URL with query parameters
        $endpoint = $apiUrl . '/api/units/ecoDriving';

        // Build query parameters
        $params = [
            'begin' => $startDate,
            'end' => $endDate,
        ];

        // Add CTRACK account ID filter if provided (from account.reference_ctrack)
        if ($ctrackAccountId) {
            $params['accountId'] = $ctrackAccountId;
        }

        Log::info("Calling CTRACK eco-driving endpoint", [
            'url' => $endpoint,
            'params' => $params,
            'has_account_filter' => !empty($ctrackAccountId)
        ]);

        $response = Http::timeout(30)
            ->withToken($apiToken)
            ->get($endpoint, $params);

        if ($response->failed()) {
            $statusCode = $response->status();
            $body = $response->body();
            
            Log::error("CTRACK API request failed", [
                'status' => $statusCode,
                'body' => $body,
            ]);

            throw new Exception("API request failed with status {$statusCode}");
        }

        $data = $response->json();

        if (!$data || !is_array($data)) {
            Log::warning("Unexpected response format from CTRACK", [
                'response' => $data
            ]);
            return $this->getEmptyData();
        }

        // Transform the API response to match our EcoDrivingData interface
        return $this->transformApiResponse($data, $ctrackAccountId);
    }

    /**
     * Transform CTRACK API response to match EcoDrivingData interface
     *
     * @param array $apiData Array of eco-driving records
     * @param string|null $ctrackAccountId Filter by company_id if provided
     * @return array
     */
    protected function transformApiResponse(array $apiData, ?string $ctrackAccountId = null): array
    {
        Log::info("CTRACK API Response received", [
            'total_records' => count($apiData),
            'filter_company_id' => $ctrackAccountId
        ]);

        // Filtrer les données par company_id si reference_ctrack est fourni
        if ($ctrackAccountId !== null) {
            $beforeFilter = count($apiData);
            
            $apiData = array_filter($apiData, function($record) use ($ctrackAccountId) {
                return isset($record['company_id']) && $record['company_id'] == $ctrackAccountId;
            });
            
            // Réindexer le tableau après filtrage
            $apiData = array_values($apiData);
            
            Log::info("Filtered CTRACK data by company_id", [
                'company_id' => $ctrackAccountId,
                'filtered_records' => count($apiData)
            ]);
        }

        // Initialize metrics
        $totalVehicles = count($apiData);
        $activeVehicles = 0;
        $totalDistance = 0;
        $totalViolations = 0;
        $totalDrivingTime = 0;
        $driverSet = [];

        $vehicleDetails = [];

        foreach ($apiData as $record) {
            $distance = (float) ($record['distance'] ?? 0);
            $drivingTimeSeconds = (int) ($record['driving_time'] ?? 0);
            $idleTimeSeconds = (int) ($record['idle_time'] ?? 0);
            
            // Count violations
            $harshBraking = (int) ($record['harsh_braking'] ?? 0);
            $harshAcceleration = (int) ($record['harsh_acceleration'] ?? 0);
            $dangerousTurns = (int) ($record['dangerous_turns'] ?? 0);
            $speedViolations = (int) ($record['speed_violations'] ?? 0);
            $drivingTimeViolations = (int) ($record['driving_time_violations'] ?? 0);
            $totalViolationsVehicle = (int) ($record['total_violations'] ?? 0);

            // Accumulate metrics - un véhicule est actif uniquement si distance > 0
            if ($distance > 0) {
                $activeVehicles++;
            }
            $totalDistance += $distance;
            $totalViolations += $totalViolationsVehicle;
            $totalDrivingTime += $drivingTimeSeconds;

            // Track unique drivers
            $driver = $record['driver'] ?? null;
            if ($driver) {
                $driverSet[$driver] = true;
            }

            // Extraire les informations supplémentaires du champ driver
            $driverParts = $driver ? explode('_', $driver) : [];
            $zoneAgence = $driverParts[1] ?? null;
            $zoneRattachement = $driverParts[2] ?? null;
            $nomDistributeur = $driverParts[3] ?? null;
            $decoupageDistributeur = $driverParts[4] ?? null;
            $chefMission = $driverParts[5] ?? null;

            // Add to vehicle details (keep the same format as CTRACK returns)
            $vehicleDetails[] = [
                'immatriculation' => $record['immatriculation'] ?? 'N/A',
                'driver' => $driver,
                'project' => $record['project'] ?? null,
                'max_speed' => (int) ($record['max_speed'] ?? 0),
                'distance' => round($distance, 2),
                'driving_time' => $drivingTimeSeconds,
                'idle_time' => $idleTimeSeconds,
                'harsh_braking' => $harshBraking,
                'harsh_acceleration' => $harshAcceleration,
                'dangerous_turns' => $dangerousTurns,
                'speed_violations' => $speedViolations,
                'driving_time_violations' => $drivingTimeViolations,
                'total_violations' => $totalViolationsVehicle,
                'zone_agence' => $zoneAgence,
                'zone_rattachement' => $zoneRattachement,
                'nom_distributeur' => $nomDistributeur,
                'decoupage_distributeur' => $decoupageDistributeur,
                'chef_mission' => $chefMission,
            ];
        }

        // Count unique drivers
        $totalDrivers = count($driverSet);

        Log::info("Transformation complete", [
            'total_vehicles' => $totalVehicles,
            'active_vehicles' => $activeVehicles,
            'total_drivers' => $totalDrivers,
            'total_distance' => $totalDistance,
            'total_violations' => $totalViolations
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
            'average_driver_score' => $totalViolations > 0 && $totalVehicles > 0 
                ? max(0, 100 - ($totalViolations / $totalVehicles)) 
                : 100,
            
            // Métriques opérationnelles
            'total_trips' => $activeVehicles, // Approximate as active vehicles
            'average_trip_distance' => $activeVehicles > 0 ? round($totalDistance / $activeVehicles, 2) : 0,
            'operating_hours' => round($totalDrivingTime / 3600, 2),
            
            // Métriques de carburant (not provided by CTRACK)
            'total_fuel_consumption' => 0,
            'average_fuel_efficiency' => 0,
            'fuel_cost' => 0,
            
            // Métriques de maintenance (not provided by CTRACK)
            'scheduled_maintenances' => 0,
            'completed_maintenances' => 0,
            'pending_maintenances' => 0,
            'maintenance_cost' => 0,
            
            // Alertes et incidents
            'total_alerts' => (int) $totalViolations,
            'critical_alerts' => array_reduce($vehicleDetails, function ($carry, $v) {
                return $carry + (($v['total_violations'] ?? 0) > 5 ? 1 : 0);
            }, 0),
            'resolved_alerts' => 0,
            
            // Performance
            'compliance_rate' => $totalVehicles > 0 
                ? max(0, 100 - (($totalViolations / $totalVehicles) * 10)) 
                : 100,
            'on_time_delivery' => 0,
            
            // Période (will be set by caller)
            'period_start' => null,
            'period_end' => null,
            
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
        // Clear all CTRACK eco-driving cache for this account
        Cache::flush();
        
        Log::info("Cleared CTRACK eco-driving cache for account {$account->id}");
    }

    /**
     * Fetch fleet activity data grouped by distributor/project
     *
     * @param Account $account
     * @param string|null $startDate Format: Y-m-d
     * @param string|null $endDate Format: Y-m-d
     * @return array
     */
    public function fetchFleetActivityData(Account $account, ?string $startDate = null, ?string $endDate = null): array
    {
        try {
            // Convert dates from Y-m-d to m/d/Y format for CTRACK API (American format)
            $formattedStartDate = $startDate ? date('m/d/Y', strtotime($startDate)) : now()->format('m/d/Y');
            $formattedEndDate = $endDate ? date('m/d/Y', strtotime($endDate)) : now()->format('m/d/Y');
            
            // Get base eco-driving data
            $ecoData = $this->fetchEcoDrivingData($account, $formattedStartDate, $formattedEndDate);
            
            if (!isset($ecoData['vehicle_details']) || empty($ecoData['vehicle_details'])) {
                return $this->getEmptyFleetActivityData();
            }
            
            return $this->transformToFleetActivityData($ecoData, $startDate, $endDate);
        } catch (Exception $e) {
            Log::error("Error fetching CTRACK fleet activity data: " . $e->getMessage(), [
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
        
        // Group vehicles by nom_distributeur (extracted from driver field)
        $distributorGroups = [];
        foreach ($vehicleDetails as $vehicle) {
            // Extraire nom_distributeur du champ driver
            $nomDistributeur = $vehicle['nom_distributeur'] ?? 'Non défini';
            
            if (!isset($distributorGroups[$nomDistributeur])) {
                $distributorGroups[$nomDistributeur] = [
                    'name' => $nomDistributeur,
                    'zone_agence' => $vehicle['zone_agence'] ?? null,
                    'zone_rattachement' => $vehicle['zone_rattachement'] ?? null,
                    'decoupage_distributeur' => $vehicle['decoupage_distributeur'] ?? null,
                    'chef_mission' => $vehicle['chef_mission'] ?? null,
                    'vehicles' => [],
                    'active_vehicles' => 0,
                    'inactive_vehicles' => 0,
                    'distance' => 0,
                    'trips' => 0,
                    'total_driving_time' => 0, // en secondes
                ];
            }
            
            $distributorGroups[$nomDistributeur]['vehicles'][] = $vehicle;
            
            $vehicleDistance = $vehicle['distance'] ?? 0;
            $drivingTime = $vehicle['driving_time'] ?? 0;
            
            // Compter les véhicules actifs (ceux qui ont parcouru une distance)
            if ($vehicleDistance > 0) {
                $distributorGroups[$nomDistributeur]['active_vehicles']++;
            } else {
                $distributorGroups[$nomDistributeur]['inactive_vehicles']++;
            }
            
            $distributorGroups[$nomDistributeur]['distance'] += $vehicleDistance;
            $distributorGroups[$nomDistributeur]['total_driving_time'] += $drivingTime;
            
            // Estimer le nombre de trajets (1 trajet par véhicule actif)
            if ($vehicleDistance > 0) {
                $distributorGroups[$nomDistributeur]['trips']++;
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
            // driving_time est en secondes dans CTRACK
            $totalDurationSeconds += ($vehicle['driving_time'] ?? 0);
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
            'period_start' => $startDate,
            'period_end' => $endDate,
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
