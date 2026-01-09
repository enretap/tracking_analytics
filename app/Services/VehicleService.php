<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class VehicleService
{
    /**
     * Get all vehicles for a user's account across all platforms
     *
     * @param User $user
     * @return array
     */
    public function getAllVehicles(User $user): array
    {
        $vehicles = [];

        // Get all platforms for the user's account
        $account = $user->account;
        
        if (!$account) {
            return $vehicles;
        }

        $platforms = $account->platforms()->where('is_active', true)->get();

        foreach ($platforms as $platform) {
            $apiUrl = $platform->pivot->api_url;
            $apiToken = $platform->pivot->api_token;
            $httpMethod = strtoupper($platform->pivot->http_method ?? 'GET');
            $tokenType = $platform->pivot->token_type ?? 'bearer';
            $tokenKey = $platform->pivot->token_key;
            $additionalParams = $platform->pivot->additional_params 
                ? json_decode($platform->pivot->additional_params, true) 
                : [];

            if (!$apiUrl || !$apiToken) {
                Log::warning("Missing API credentials for platform: {$platform->name}");
                continue;
            }
            
            // Add specific endpoint for TARGA TELEMATICS vehicles
            if ($platform->slug === 'targa-telematics') {
                $apiUrl = rtrim($apiUrl, '/') . '/json/getVehicles';
            }
            
            // Add specific endpoint for CTRACK vehicles
            if ($platform->slug === 'ctrack') {
                $apiUrl = 'https://comafrique-ctrack.online/api/units/list';
                Log::info("CTRACK Platform detected", [
                    'platform_name' => $platform->name,
                    'api_url' => $apiUrl,
                    'reference_ctrack' => $account->reference_ctrack ?? 'NOT SET',
                    'has_token' => !empty($apiToken),
                ]);
            }

            try {
                // Build HTTP request based on configuration
                $httpClient = Http::timeout(30);
                
                // Configure authentication based on token_type
                switch ($tokenType) {
                    case 'bearer':
                        $httpClient = $httpClient->withToken($apiToken);
                        break;
                        
                    case 'header':
                        if ($tokenKey) {
                            $httpClient = $httpClient->withHeaders([
                                $tokenKey => $apiToken
                            ]);
                        }
                        break;
                        
                    case 'body':
                        // Token will be added to body for POST requests
                        if ($tokenKey) {
                            $additionalParams[$tokenKey] = $apiToken;
                        }
                        break;
                }
                
                // Execute request based on HTTP method
                if ($httpMethod === 'POST') {
                    $response = $httpClient->post($apiUrl, $additionalParams);
                } else {
                    // GET request with query parameters
                    $response = $httpClient->get($apiUrl, $additionalParams);
                }

                if ($response->successful()) {
                    $data = $response->json();
                    
                    // Check if data is null or not an array
                    if (!is_array($data)) {
                        Log::warning("Invalid response data from {$platform->name}", [
                            'data_type' => gettype($data),
                            'response_body' => $response->body(),
                        ]);
                        continue;
                    }
                    
                    // Log CTRACK raw response for debugging
                    if ($platform->slug === 'ctrack') {
                        Log::info("CTRACK Raw Response", [
                            'total_vehicles' => is_array($data) ? count($data['data'] ?? $data) : 0,
                            'has_data_key' => isset($data['data']),
                            'sample_vehicle' => isset($data['data'][0]) ? $data['data'][0] : (isset($data[0]) ? $data[0] : null),
                        ]);
                    }
                    
                    // Filter CTRACK vehicles by company_id if reference_ctrack is set
                    if ($platform->slug === 'ctrack' && $account->reference_ctrack && is_array($data)) {
                        $data = $this->filterCtrackVehicles($data, $account->reference_ctrack);
                        
                        Log::info("CTRACK Filtered Response", [
                            'reference_ctrack' => $account->reference_ctrack,
                            'filtered_count' => is_array($data) ? count($data['data'] ?? $data) : 0,
                        ]);
                    }
                    
                    // Map the vehicles based on platform slug
                    $mappedVehicles = $this->mapVehicles($data, $platform->slug, $platform->id);
                    $vehicles = array_merge($vehicles, $mappedVehicles);
                } else {
                    Log::error("Failed to fetch vehicles from {$platform->name}: " . $response->status(), [
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);
                }
            } catch (Exception $e) {
                Log::error("Error fetching vehicles from {$platform->name}: " . $e->getMessage());
            }
        }

        return $vehicles;
    }

    /**
     * Map vehicle data based on platform slug
     *
     * @param array $data
     * @param string $slug
     * @param int $platformId
     * @return array
     */
    private function mapVehicles(array $data, string $slug, int $platformId): array
    {
        $mapper = $this->getMapper($slug);
        
        if (!$mapper) {
            Log::warning("No mapper found for platform slug: {$slug}");
            return [];
        }

        return array_map(function ($vehicle) use ($mapper, $platformId, $slug) {
            return $mapper($vehicle, $platformId, $slug);
        }, $this->extractVehiclesArray($data, $slug));
    }

    /**
     * Extract vehicles array from API response based on platform
     *
     * @param array $data
     * @param string $slug
     * @return array
     */
    private function extractVehiclesArray(array $data, string $slug): array
    {
        // Different platforms might return data in different structures
        // Adjust these based on your actual API responses
        return match ($slug) {
            'gps-tracker' => $data['vehicles'] ?? $data['data'] ?? $data,
            'fleet-manager' => $data['fleet'] ?? $data['vehicles'] ?? $data,
            'track-pro' => $data['units'] ?? $data['devices'] ?? $data,
            'targa-telematics' => $data['vehicles'] ?? $data['data'] ?? $data,
            'ctrack' => $data['data']['units'] ?? $data['units'] ?? $data['data'] ?? $data,
            default => $data['vehicles'] ?? $data['data'] ?? $data,
        };
    }

    /**
     * Get the appropriate mapper for a platform
     *
     * @param string $slug
     * @return callable|null
     */
    private function getMapper(string $slug): ?callable
    {
        return match ($slug) {
            'gps-tracker' => $this->gpsTrackerMapper(...),
            'fleet-manager' => $this->fleetManagerMapper(...),
            'track-pro' => $this->trackProMapper(...),
            'targa-telematics' => $this->targaMapper(...),
            'ctrack' => $this->ctrackMapper(...),
            default => null,
        };
    }

    /**
     * Mapper for GPS Tracker platform
     */
    private function gpsTrackerMapper(array $vehicle, int $platformId, string $slug): array
    {
        return [
            'id' => 'vehicle-' . ($vehicle['id'] ?? $vehicle['vehicle_id'] ?? uniqid()),
            'platform_id' => $platformId,
            'platform_slug' => $slug,
            'name' => $vehicle['name'] ?? $vehicle['vehicle_name'] ?? 'N/A',
            'plate' => $vehicle['plate'] ?? $vehicle['license_plate'] ?? $vehicle['registration'] ?? 'N/A',
            'status' => $this->normalizeStatus($vehicle['status'] ?? $vehicle['state'] ?? 'unknown'),
            'distance' => (int) ($vehicle['distance'] ?? $vehicle['odometer'] ?? $vehicle['mileage'] ?? 0),
            'latitude' => (float) ($vehicle['latitude'] ?? $vehicle['lat'] ?? 0),
            'longitude' => (float) ($vehicle['longitude'] ?? $vehicle['lng'] ?? $vehicle['lon'] ?? 0),
            'speed' => (int) ($vehicle['speed'] ?? $vehicle['velocity'] ?? 0),
            'lastUpdate' => $this->normalizeDate($vehicle['last_update'] ?? $vehicle['updated_at'] ?? $vehicle['timestamp'] ?? now()),
        ];
    }

    /**
     * Mapper for Fleet Manager platform
     */
    private function fleetManagerMapper(array $vehicle, int $platformId, string $slug): array
    {
        return [
            'id' => 'vehicle-' . ($vehicle['vehicleId'] ?? $vehicle['id'] ?? uniqid()),
            'platform_id' => $platformId,
            'platform_slug' => $slug,
            'name' => $vehicle['vehicleName'] ?? $vehicle['name'] ?? 'N/A',
            'plate' => $vehicle['plateNumber'] ?? $vehicle['plate'] ?? 'N/A',
            'status' => $this->normalizeStatus($vehicle['status'] ?? $vehicle['vehicleStatus'] ?? 'unknown'),
            'distance' => (int) ($vehicle['totalDistance'] ?? $vehicle['distance'] ?? 0),
            'latitude' => (float) ($vehicle['position']['latitude'] ?? $vehicle['lat'] ?? 0),
            'longitude' => (float) ($vehicle['position']['longitude'] ?? $vehicle['lng'] ?? 0),
            'speed' => (int) ($vehicle['currentSpeed'] ?? $vehicle['speed'] ?? 0),
            'lastUpdate' => $this->normalizeDate($vehicle['lastPositionTime'] ?? $vehicle['lastUpdate'] ?? now()),
        ];
    }

    /**
     * Mapper for Track Pro platform
     */
    private function trackProMapper(array $vehicle, int $platformId, string $slug): array
    {
        return [
            'id' => 'vehicle-' . ($vehicle['unitId'] ?? $vehicle['deviceId'] ?? $vehicle['id'] ?? uniqid()),
            'platform_id' => $platformId,
            'platform_slug' => $slug,
            'name' => $vehicle['unitName'] ?? $vehicle['deviceName'] ?? $vehicle['name'] ?? 'N/A',
            'plate' => $vehicle['licensePlate'] ?? $vehicle['plate'] ?? 'N/A',
            'status' => $this->normalizeStatus($vehicle['online'] ?? $vehicle['status'] ?? 'unknown'),
            'distance' => (int) ($vehicle['totalKm'] ?? $vehicle['distance'] ?? 0),
            'latitude' => (float) ($vehicle['gps']['lat'] ?? $vehicle['latitude'] ?? 0),
            'longitude' => (float) ($vehicle['gps']['lon'] ?? $vehicle['longitude'] ?? 0),
            'speed' => (int) ($vehicle['currentSpeed'] ?? $vehicle['speed'] ?? 0),
            'lastUpdate' => $this->normalizeDate($vehicle['lastSeen'] ?? $vehicle['lastUpdate'] ?? now()),
        ];
    }

    /**
     * Filter CTRACK vehicles by company_id
     *
     * @param array $data
     * @param string $referenceCtrack
     * @return array
     */
    private function filterCtrackVehicles(array $data, string $referenceCtrack): array
    {
        // Extract units from the CTRACK response structure: {"data": {"units": [...]}}
        $units = $data['data']['units'] ?? $data['units'] ?? $data['data'] ?? $data;
        
        if (!is_array($units)) {
            Log::warning('CTRACK filterCtrackVehicles: units is not an array', [
                'data_type' => gettype($units),
                'reference_ctrack' => $referenceCtrack,
            ]);
            return ['data' => ['units' => []]];
        }
        
        // Filter by company_id matching reference_ctrack
        $filteredUnits = array_filter($units, function ($unit) use ($referenceCtrack) {
            $companyId = (string)($unit['company_id'] ?? '');
            $matches = $companyId === (string)$referenceCtrack;
            
            if (!$matches) {
                Log::debug('CTRACK vehicle filtered out', [
                    'vehicle_name' => $unit['name'] ?? 'N/A',
                    'vehicle_company_id' => $companyId,
                    'expected_reference_ctrack' => $referenceCtrack,
                ]);
            }
            
            return $matches;
        });
        
        $filteredCount = count($filteredUnits);
        Log::info("CTRACK vehicles filtered", [
            'total_units' => count($units),
            'filtered_units' => $filteredCount,
            'reference_ctrack' => $referenceCtrack,
        ]);
        
        // Return in the expected structure
        return ['data' => ['units' => array_values($filteredUnits)]];
    }

    /**
     * Mapper for CTRACK platform
     */
    private function ctrackMapper(array $vehicle, int $platformId, string $slug): array
    {
        // Parse additional_info to get vehicle details
        $additionalInfo = [];
        if (isset($vehicle['additional_info'])) {
            $additionalInfo = is_string($vehicle['additional_info']) 
                ? json_decode($vehicle['additional_info'], true) ?? []
                : $vehicle['additional_info'];
        }
        
        // Extract vehicle plate from additional_info.vehicle_info.vehicle_plate
        $vehiclePlate = $additionalInfo['vehicle_info']['vehicle_plate'] ?? $vehicle['name'] ?? 'N/A';
        
        // Extract mileage from efficiency_mileage (primary) or counter_parameters (fallback)
        $mileage = (int) ($vehicle['efficiency_mileage'] ?? 0);
        if ($mileage === 0 && isset($additionalInfo['efficiency_parameters']['efficiency_mileage'])) {
            $mileage = (int) $additionalInfo['efficiency_parameters']['efficiency_mileage'];
        }
        
        // Get vehicle brand and model
        $brand = $additionalInfo['vehicle_info']['vehicle_brand'] ?? '';
        $model = $additionalInfo['vehicle_info']['vehicle_model'] ?? '';
        $vehicleName = trim(($brand ? ucfirst($brand) . ' ' : '') . ($model ? ucfirst($model) : ''));
        if (empty($vehicleName)) {
            $vehicleName = $vehicle['name'] ?? 'N/A';
        }
        
        // Determine status: 1 = active, 0 or other = inactive
        $status = $this->normalizeStatus($vehicle['status'] ?? '0');
        
        // Get company name
        $companyName = $vehicle['company_name'] ?? ($vehicle['users_general']['company_name'] ?? 'N/A');
        
        // Get last active timestamp
        $lastActive = $vehicle['last_active'] ?? 'Unknown';
        
        return [
            'id' => 'ctrack-' . ($vehicle['id'] ?? uniqid()),
            'platform_id' => $platformId,
            'platform_slug' => $slug,
            'name' => $vehicleName,
            'plate' => $vehiclePlate,
            'status' => $status,
            'distance' => $mileage,
            'latitude' => 0, // CTRACK doesn't include position in units list
            'longitude' => 0,
            'address' => '',
            'speed' => 0,
            'lastUpdate' => $this->normalizeDate($vehicle['updated_at'] ?? now()),
            'last_active' => $lastActive,
            'active' => $status === 'active',
            'device_id' => $vehicle['device_id'] ?? null,
            'uid' => $vehicle['uid'] ?? null,
            'company_id' => $vehicle['company_id'] ?? null,
            'company_name' => $companyName,
            'unit_group_name' => $vehicle['unit_group_name'] ?? null,
            'device' => $vehicle['device'] ?? null,
            'type' => $vehicle['type'] ?? 'vehicle',
        ];
    }

    /**
     * Mapper for TARGA TELEMATICS platform
     */
    private function targaMapper(array $vehicle, int $platformId, string $slug): array
    {
        // Determine status based on multiple fields
        $status = 'unknown';
        if (isset($vehicle['active'])) {
            if (!$vehicle['active']) {
                $status = 'inactive';
            } elseif (isset($vehicle['status'])) {
                // TARGA status: 1 = Moving, 2 = Stopped, 3 = Offline
                $status = match ((int) $vehicle['status']) {
                    1 => 'active',      // Moving
                    2 => 'inactive',    // Stopped
                    3 => 'inactive',    // Offline
                    default => 'unknown',
                };
            } else {
                $status = 'active';
            }
        }
        
        return [
            'id' => 'V/'.$platformId.'/' . $vehicle['id'],
            'platform_id' => $platformId,
            'platform_slug' => $slug,
            'name' => ($vehicle['brand'] ?? '') . ' ' . ($vehicle['model'] ?? ''),
            'plate' => $vehicle['plateNumber'] ?? $vehicle['name'] ?? 'N/A',
            'status' => $status,
            'distance' => (int) ($vehicle['totalDistance'] ?? 0),
            'latitude' => (float) ($vehicle['position']['latitude'] ?? 0),
            'longitude' => (float) ($vehicle['position']['longitude'] ?? 0),
            'address' => ($vehicle['address']['country'] ?? '') . ' ' . ($vehicle['address']['city'] ?? '').' ' . ($vehicle['address']['street'] ?? ''),
            'speed' => (int) ($vehicle['speed'] ?? 0),
            'lastUpdate' => $this->normalizeDate($vehicle['lastUpdateTime'] ?? now()),
            'active' => $vehicle['active'] ?? false,
        ];
    }

    /**
     * Normalize vehicle status
     */
    private function normalizeStatus($status): string
    {
        if (is_bool($status)) {
            return $status ? 'active' : 'inactive';
        }

        $status = strtolower((string) $status);

        return match (true) {
            in_array($status, ['active', 'online', 'running', 'moving', '1', 'true']) => 'active',
            in_array($status, ['inactive', 'offline', 'stopped', 'parked', '0', 'false']) => 'inactive',
            in_array($status, ['maintenance', 'repair']) => 'maintenance',
            default => 'unknown',
        };
    }

    /**
     * Normalize date format
     */
    private function normalizeDate($date): string
    {
        try {
            if ($date instanceof \DateTimeInterface) {
                return $date->format('Y-m-d H:i:s');
            }
            
            return \Carbon\Carbon::parse($date)->format('Y-m-d H:i:s');
        } catch (Exception $e) {
            return now()->format('Y-m-d H:i:s');
        }
    }
}
