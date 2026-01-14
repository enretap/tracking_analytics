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
     * @param string|null $startDate Format: d/m/Y
     * @param string|null $endDate Format: d/m/Y
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

            $apiUrl = rtrim($platform->pivot->api_url ?? '', '/');
            $apiToken = $platform->pivot->api_token;

            if (!$apiUrl || !$apiToken) {
                Log::warning("Missing API credentials for CTRACK on account {$account->id}");
                return $this->getEmptyData();
            }

            // Default date range: today
            if (!$startDate) {
                $startDate = now()->format('d/m/Y');
            }
            if (!$endDate) {
                $endDate = now()->format('d/m/Y');
            }

            // Cache key for this request
            $cacheKey = "ctrack_eco_driving_{$account->id}_{$startDate}_{$endDate}";

            // Try to get from cache (5 minutes TTL)
            return Cache::remember($cacheKey, 300, function () use ($apiUrl, $apiToken, $startDate, $endDate) {
                return $this->callEcoDrivingEndpoint($apiUrl, $apiToken, $startDate, $endDate);
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
     * @param string $startDate Format: d/m/Y
     * @param string $endDate Format: d/m/Y
     * @return array
     */
    protected function callEcoDrivingEndpoint(string $apiUrl, string $apiToken, string $startDate, string $endDate): array
    {
        // Build full endpoint URL with query parameters
        $endpoint = $apiUrl . '/api/units/ecoDriving';

        Log::info("Calling CTRACK eco-driving endpoint", [
            'url' => $endpoint,
            'begin' => $startDate,
            'end' => $endDate,
        ]);

        $response = Http::timeout(30)
            ->withToken($apiToken)
            ->get($endpoint, [
                'begin' => $startDate,
                'end' => $endDate,
            ]);

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
        return $this->transformApiResponse($data);
    }

    /**
     * Transform CTRACK API response to match EcoDrivingData interface
     *
     * @param array $apiData Array of eco-driving records
     * @return array
     */
    protected function transformApiResponse(array $apiData): array
    {
        Log::info("CTRACK API Response received", [
            'total_records' => count($apiData),
            'sample' => count($apiData) > 0 ? $apiData[0] : null
        ]);

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

            // Accumulate metrics
            if ($distance > 0 || $drivingTimeSeconds > 0) {
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
            ];
        }

        // Count unique drivers
        $totalDrivers = count($driverSet);

        Log::info("Transformation complete", [
            'total_vehicles' => $totalVehicles,
            'active_vehicles' => $activeVehicles,
            'total_drivers' => $totalDrivers,
            'total_distance' => $totalDistance,
            'total_violations' => $totalViolations,
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
}
