<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\VehicleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VehicleDebugController extends Controller
{
    protected VehicleService $vehicleService;

    public function __construct(VehicleService $vehicleService)
    {
        $this->vehicleService = $vehicleService;
    }

    /**
     * Test endpoint to debug vehicle retrieval
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $account = $user->account;

        if (!$account) {
            return response()->json([
                'success' => false,
                'error' => 'No account found for user',
            ], 404);
        }

        // Get account information
        $accountInfo = [
            'id' => $account->id,
            'name' => $account->name,
            'reference_ctrack' => $account->reference_ctrack,
            'has_reference_ctrack' => !empty($account->reference_ctrack),
        ];

        // Get platforms information
        $platforms = $account->platforms()
            ->wherePivot('account_platform.is_active', true)
            ->where('platforms.is_active', true)
            ->get();
        $platformsInfo = $platforms->map(function ($platform) {
            return [
                'id' => $platform->id,
                'name' => $platform->name,
                'slug' => $platform->slug,
                'provider' => $platform->provider,
                'api_url' => $platform->pivot->api_url,
                'has_token' => !empty($platform->pivot->api_token),
                'token_preview' => $platform->pivot->api_token ? substr($platform->pivot->api_token, 0, 10) . '...' : null,
                'http_method' => $platform->pivot->http_method,
                'token_type' => $platform->pivot->token_type,
            ];
        })->toArray();

        // Get vehicles using the service
        $vehicles = $this->vehicleService->getAllVehicles($user);

        // Test CTRACK directly if configured
        $ctrackTest = null;
        $ctrackPlatform = $platforms->firstWhere('slug', 'ctrack');
        
        if ($ctrackPlatform) {
            try {
                $apiUrl = 'https://comafrique-ctrack.online/api/units/list';
                $apiToken = $ctrackPlatform->pivot->api_token;
                
                $response = Http::timeout(30)
                    ->withToken($apiToken)
                    ->get($apiUrl);

                if ($response->successful()) {
                    $data = $response->json();
                    
                    // Check if data is valid
                    if (!is_array($data)) {
                        $ctrackTest = [
                            'success' => false,
                            'error' => 'Invalid JSON response',
                            'response_type' => gettype($data),
                            'response_body' => $response->body(),
                        ];
                    } else {
                        // Extract units from CTRACK response structure: {"data": {"units": [...]}}
                        $allVehicles = $data['data']['units'] ?? $data['units'] ?? $data['data'] ?? $data;
                        
                        if (!is_array($allVehicles)) {
                            $ctrackTest = [
                                'success' => false,
                                'error' => 'Vehicles data is not an array',
                                'data_structure' => $data,
                            ];
                        } else {
                            $ctrackTest = [
                                'success' => true,
                                'total_vehicles' => count($allVehicles),
                                'has_data_key' => isset($data['data']),
                                'has_units_key' => isset($data['data']['units']),
                                'response_keys' => array_keys($data),
                                'data_keys' => isset($data['data']) && is_array($data['data']) ? array_keys($data['data']) : null,
                                'sample_vehicle' => isset($allVehicles[0]) ? $allVehicles[0] : null,
                            ];

                            // Filter by company_id
                            if ($account->reference_ctrack) {
                                $filtered = array_filter($allVehicles, function($v) use ($account) {
                                    return isset($v['company_id']) && (string)$v['company_id'] === (string)$account->reference_ctrack;
                                });

                                $ctrackTest['filtering'] = [
                                    'reference_ctrack' => $account->reference_ctrack,
                                    'filtered_count' => count($filtered),
                                    'sample_filtered_vehicle' => !empty($filtered) ? array_values($filtered)[0] : null,
                                ];

                                // Show all unique company_ids for debugging
                                $companyIds = array_unique(array_map(fn($v) => $v['company_id'] ?? 'N/A', $allVehicles));
                                $ctrackTest['filtering']['all_company_ids'] = array_values($companyIds);
                            }
                        }
                    }
                } else {
                    $ctrackTest = [
                        'success' => false,
                        'error' => 'HTTP ' . $response->status(),
                        'body' => $response->body(),
                    ];
                }
            } catch (\Exception $e) {
                $ctrackTest = [
                    'success' => false,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return response()->json([
            'success' => true,
            'account' => $accountInfo,
            'platforms' => $platformsInfo,
            'vehicles_count' => count($vehicles),
            'vehicles' => $vehicles,
            'ctrack_direct_test' => $ctrackTest,
        ]);
    }

    /**
     * Test CTRACK connection directly
     */
    public function testCtrack(Request $request)
    {
        $user = $request->user();
        $account = $user->account;

        if (!$account) {
            return response()->json([
                'success' => false,
                'error' => 'No account found',
            ], 404);
        }

        $ctrackPlatform = $account->platforms()
            ->where('platforms.slug', 'ctrack')
            ->wherePivot('account_platform.is_active', true)
            ->where('platforms.is_active', true)
            ->first();

        if (!$ctrackPlatform) {
            return response()->json([
                'success' => false,
                'error' => 'CTRACK platform not configured or not active',
            ], 404);
        }

        $apiUrl = 'https://comafrique-ctrack.online/api/units/list';
        $apiToken = $ctrackPlatform->pivot->api_token;

        try {
            Log::info('Testing CTRACK connection', [
                'account' => $account->name,
                'reference_ctrack' => $account->reference_ctrack,
                'api_url' => $apiUrl,
            ]);

            $response = Http::timeout(30)
                ->withToken($apiToken)
                ->get($apiUrl);

            if ($response->successful()) {
                $data = $response->json();
                $vehicles = $data['data'] ?? $data;

                // Filter by company_id
                $filtered = [];
                if ($account->reference_ctrack && is_array($vehicles)) {
                    $filtered = array_filter($vehicles, function($v) use ($account) {
                        return isset($v['company_id']) && (string)$v['company_id'] === (string)$account->reference_ctrack;
                    });
                }

                return response()->json([
                    'success' => true,
                    'account_name' => $account->name,
                    'reference_ctrack' => $account->reference_ctrack,
                    'total_vehicles' => is_array($vehicles) ? count($vehicles) : 0,
                    'filtered_vehicles' => count($filtered),
                    'all_company_ids' => is_array($vehicles) 
                        ? array_values(array_unique(array_map(fn($v) => $v['company_id'] ?? 'N/A', $vehicles)))
                        : [],
                    'vehicles' => array_values($filtered),
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'error' => 'API request failed',
                    'status' => $response->status(),
                    'body' => $response->body(),
                ], $response->status());
            }
        } catch (\Exception $e) {
            Log::error('CTRACK test failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
