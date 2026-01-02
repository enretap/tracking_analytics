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
                    
                    // Map the vehicles based on platform slug
                    $mappedVehicles = $this->mapVehicles($data, $platform->slug, $platform->id);
                    $vehicles = array_merge($vehicles, $mappedVehicles);
                } else {
                    Log::error("Failed to fetch vehicles from {$platform->name}: " . $response->status());
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
            'speed' => (int) ($vehicle['speed'] ?? 0),
            'lastUpdate' => $this->normalizeDate($vehicle['lastUpdateTime'] ?? now()),
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
