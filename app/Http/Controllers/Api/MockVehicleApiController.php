<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Contrôleur Mock pour simuler une API externe de tracking
 * Utilisé uniquement pour le développement et les tests
 */
class MockVehicleApiController extends Controller
{
    /**
     * Simuler l'API GPS Tracker
     */
    public function gpsTracker(Request $request): JsonResponse
    {
        // Vérifier le token (optionnel en dev)
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Bearer token required'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'vehicles' => [
                [
                    'id' => 'gps-001',
                    'vehicle_name' => 'Camion Renault Master',
                    'license_plate' => 'AB-234-CF',
                    'status' => 'active',
                    'odometer' => 125400,
                    'latitude' => 48.858844,
                    'longitude' => 2.294351,
                    'speed' => 65,
                    'last_update' => now()->subMinutes(15)->toDateTimeString(),
                ],
                [
                    'id' => 'gps-002',
                    'vehicle_name' => 'Fourgon Mercedes Sprinter',
                    'license_plate' => 'CD-567-GH',
                    'status' => 'active',
                    'odometer' => 85600,
                    'latitude' => 48.870502,
                    'longitude' => 2.306546,
                    'speed' => 45,
                    'last_update' => now()->subMinutes(5)->toDateTimeString(),
                ],
                [
                    'id' => 'gps-003',
                    'vehicle_name' => 'Utilitaire Peugeot Partner',
                    'license_plate' => 'EF-890-IJ',
                    'status' => 'maintenance',
                    'odometer' => 231000,
                    'latitude' => 48.835798,
                    'longitude' => 2.329376,
                    'speed' => 0,
                    'last_update' => now()->subHours(2)->toDateTimeString(),
                ],
            ],
        ]);
    }

    /**
     * Simuler l'API Fleet Manager
     */
    public function fleetManager(Request $request): JsonResponse
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json([
                'error' => 'Unauthorized'
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'fleet' => [
                [
                    'vehicleId' => 'fm-101',
                    'vehicleName' => 'Camionnette Ford Transit',
                    'plateNumber' => 'GH-123-KL',
                    'vehicleStatus' => 'online',
                    'totalDistance' => 187650,
                    'position' => [
                        'latitude' => 48.892423,
                        'longitude' => 2.236596,
                    ],
                    'currentSpeed' => 72,
                    'lastPositionTime' => now()->subMinutes(10)->toDateTimeString(),
                ],
                [
                    'vehicleId' => 'fm-102',
                    'vehicleName' => 'Fourgon Renault Trafic',
                    'plateNumber' => 'IJ-456-MN',
                    'vehicleStatus' => 'offline',
                    'totalDistance' => 152300,
                    'position' => [
                        'latitude' => 48.826862,
                        'longitude' => 2.270044,
                    ],
                    'currentSpeed' => 0,
                    'lastPositionTime' => now()->subHours(8)->toDateTimeString(),
                ],
            ],
        ]);
    }

    /**
     * Simuler l'API Track Pro
     */
    public function trackPro(Request $request): JsonResponse
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json([
                'error' => 'Authentication required'
            ], 401);
        }

        return response()->json([
            'code' => 200,
            'units' => [
                [
                    'unitId' => 'tp-5001',
                    'unitName' => 'Camion Iveco Daily',
                    'licensePlate' => 'KL-789-OP',
                    'online' => true,
                    'totalKm' => 324500,
                    'gps' => [
                        'lat' => 48.863576,
                        'lon' => 2.327735,
                    ],
                    'currentSpeed' => 58,
                    'lastSeen' => now()->subMinutes(45)->toISOString(),
                ],
                [
                    'unitId' => 'tp-5002',
                    'unitName' => 'Fourgon Volkswagen Crafter',
                    'licensePlate' => 'MN-012-QR',
                    'online' => true,
                    'totalKm' => 289000,
                    'gps' => [
                        'lat' => 48.847894,
                        'lon' => 2.389506,
                    ],
                    'currentSpeed' => 38,
                    'lastSeen' => now()->subMinutes(20)->toISOString(),
                ],
                [
                    'unitId' => 'tp-5003',
                    'unitName' => 'Utilitaire Citroën Jumper',
                    'licensePlate' => 'OP-345-ST',
                    'online' => false,
                    'totalKm' => 412000,
                    'gps' => [
                        'lat' => 48.839654,
                        'lon' => 2.360221,
                    ],
                    'currentSpeed' => 0,
                    'lastSeen' => now()->subHours(3)->toISOString(),
                ],
            ],
        ]);
    }
}
