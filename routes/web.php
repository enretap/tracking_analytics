<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

// Public invitation routes
Route::get('/invitation/accept/{token}', [\App\Http\Controllers\Auth\InvitationController::class, 'show'])->name('invitation.show');
Route::post('/invitation/accept/{token}', [\App\Http\Controllers\Auth\InvitationController::class, 'accept'])->name('invitation.accept');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        $account = $user->account;
        
        // Récupérer les données d'éco-conduite depuis TARGA TELEMATICS
        $ecoData = [];
        if ($account) {
            $ecoDrivingService = app(\App\Services\EcoDrivingService::class);
            
            // Récupérer les paramètres de date depuis la requête (optionnel)
            // Par défaut: du 1er au 31 décembre 2025
            $startDate = request('start_date', '2025-12-01');
            $endDate = request('end_date', '2025-12-31');
            $forceRefresh = request('force_refresh', false);
            
            // Vider le cache si demandé
            if ($forceRefresh) {
                $ecoDrivingService->clearCache($account);
            }
            
            $ecoData = $ecoDrivingService->fetchEcoDrivingData($account, $startDate, $endDate);
        }
        
        // Récupérer les données d'événements depuis TARGA TELEMATICS
        $eventData = [];
        if ($account) {
            $eventHistoryService = app(\App\Services\EventHistoryService::class);
            
            // Utiliser les mêmes dates que pour l'éco-conduite
            $startDate = request('start_date', '2025-12-01');
            $endDate = request('end_date', '2025-12-31');
            $forceRefresh = request('force_refresh', false);
            
            // Vider le cache si demandé
            if ($forceRefresh) {
                $eventHistoryService->clearCache($account);
            }
            
            $eventData = $eventHistoryService->fetchEventHistoryData($account, $startDate, $endDate);
        }
        
        // Déterminer le tableau de bord à afficher en fonction du domaine du compte
        $dashboardView = 'dashboard'; // Par défaut
        if ($account && $account->domain === 'Leasing') {
            $dashboardView = 'leasingDashboard';
        }
        
        return Inertia::render($dashboardView, [
            'eco_data' => $ecoData,
            'event_data' => $eventData,
        ]);
    })->name('dashboard');

    // Vehicles routes
    Route::get('/api/vehicles', [\App\Http\Controllers\VehicleController::class, 'index'])->name('api.vehicles.index');
    Route::get('/vehicles', [\App\Http\Controllers\VehicleController::class, 'page'])->name('vehicles.page');

    // Eco-driving data API endpoint
    Route::get('/api/eco-driving', function () {
        $user = auth()->user();
        $account = $user->account;
        
        if (!$account) {
            return response()->json([
                'success' => false,
                'error' => 'Compte non trouvé',
                'data' => []
            ], 404);
        }
        
        $ecoDrivingService = app(\App\Services\EcoDrivingService::class);
        
        // Récupérer les paramètres de date depuis la requête
        $startDate = request('start_date');
        $endDate = request('end_date');
        $forceRefresh = request('force_refresh', false);
        
        // Clear cache if force refresh
        if ($forceRefresh) {
            $ecoDrivingService->clearCache($account);
        }
        
        $data = $ecoDrivingService->fetchEcoDrivingData($account, $startDate, $endDate);
        
        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    })->name('api.eco-driving');

    // Daily Vehicle Eco Summary API endpoint
    Route::get('/api/getDailyVehicleEcoSummary', function () {
        $user = auth()->user();
        $account = $user->account;
        
        if (!$account) {
            return response()->json([
                'success' => false,
                'error' => 'Compte non trouvé',
            ], 404);
        }
        
        $ecoDrivingService = app(\App\Services\EcoDrivingService::class);
        
        // Récupérer les paramètres de date depuis la requête
        $startDate = request('start_date');
        $endDate = request('end_date');
        $forceRefresh = request('force_refresh', false);
        
        // Clear cache if force refresh
        if ($forceRefresh) {
            $ecoDrivingService->clearCache($account);
        }
        
        $data = $ecoDrivingService->fetchEcoDrivingData($account, $startDate, $endDate);
        
        return response()->json($data);
    })->name('api.getDailyVehicleEcoSummary');

    // Event History Report API endpoint
    Route::get('/api/getEventHistoryReport', function () {
        $user = auth()->user();
        $account = $user->account;
        
        if (!$account) {
            return response()->json([
                'success' => false,
                'error' => 'Compte non trouvé',
            ], 404);
        }
        
        $eventHistoryService = app(\App\Services\EventHistoryService::class);
        
        // Récupérer les paramètres de date depuis la requête
        $startDate = request('start_date');
        $endDate = request('end_date');
        $forceRefresh = request('force_refresh', false);
        
        // Clear cache if force refresh
        if ($forceRefresh) {
            $eventHistoryService->clearCache($account);
        }
        
        $data = $eventHistoryService->fetchEventHistoryData($account, $startDate, $endDate);
        
        return response()->json($data);
    })->name('api.getEventHistoryReport');

    // Reports routes
    Route::get('/api/reports', function () {
        $user = auth()->user();
        
        if (!$user || !$user->account_id) {
            return response()->json(['success' => false, 'data' => [], 'total' => 0]);
        }

        $query = \App\Models\Report::whereHas('accounts', function ($query) use ($user) {
                $query->where('accounts.id', $user->account_id);
            });
        
        $total = $query->count();
        $reports = $query->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'name', 'description', 'type', 'created_at']);

        return response()->json(['success' => true, 'data' => $reports, 'total' => $total]);
    })->name('api.reports.index');

    // All reports route
    Route::get('/api/reports/all', function () {
        $user = auth()->user();
        
        if (!$user || !$user->account_id) {
            return response()->json(['success' => false, 'data' => []]);
        }

        $reports = \App\Models\Report::whereHas('accounts', function ($query) use ($user) {
                $query->where('accounts.id', $user->account_id);
            })
            ->orderBy('created_at', 'desc')
            ->get(['id', 'name', 'description', 'type', 'created_at']);

        return response()->json(['success' => true, 'data' => $reports]);
    })->name('api.reports.all');

    // Report detail route
    Route::get('/reports/{id}', function ($id) {
        $user = auth()->user();
        
        if (!$user || !$user->account_id) {
            return redirect()->route('dashboard');
        }

        $report = \App\Models\Report::whereHas('accounts', function ($query) use ($user) {
                $query->where('accounts.id', $user->account_id);
            })
            ->find($id);

        if (!$report) {
            return redirect()->route('dashboard')->with('error', 'Rapport introuvable');
        }

        // Générer les données selon le type de rapport
        $reportData = [
            'id' => $report->id,
            'name' => $report->name,
            'description' => $report->description,
            'type' => $report->type,
            'created_at' => $report->created_at,
            'preview_image' => $report->preview_image ?? null,
        ];

        // Générer des données KPI spécifiques selon le type
        switch ($report->type) {
            case 'fleet_activity':
                $reportData['data'] = [
                    'total_distance' => rand(10000, 50000),
                    'total_vehicles' => rand(10, 25),
                    'active_vehicles' => rand(8, 20),
                    'alerts' => rand(0, 15),
                    'average_speed' => rand(50, 85),
                    'fuel_consumption' => rand(65, 110) / 10,
                    'trip_count' => rand(100, 300),
                    'operating_time' => rand(200, 600),
                ];
                break;

            case 'driver_behavior':
                $reportData['data'] = [
                    'total_drivers' => rand(10, 30),
                    'excellent_drivers' => rand(5, 20),
                    'harsh_braking_events' => rand(10, 50),
                    'harsh_acceleration_events' => rand(8, 40),
                    'speeding_violations' => rand(5, 30),
                    'average_score' => rand(75, 95),
                    'total_driving_time' => rand(300, 800),
                    'safe_driving_percentage' => rand(80, 98),
                ];
                break;

            case 'maintenance':
                $reportData['data'] = [
                    'total_maintenances' => rand(20, 60),
                    'scheduled_maintenances' => rand(15, 40),
                    'urgent_maintenances' => rand(2, 10),
                    'completed_maintenances' => rand(15, 50),
                    'total_cost' => rand(5000, 25000),
                    'average_cost' => rand(200, 800),
                    'vehicles_due' => rand(2, 8),
                    'upcoming_maintenances' => rand(5, 15),
                ];
                break;

            case 'fuel_consumption':
                $reportData['data'] = [
                    'total_fuel' => rand(2000, 8000),
                    'total_cost' => rand(3000, 12000),
                    'average_consumption' => rand(65, 95) / 10,
                    'best_vehicle_consumption' => rand(55, 70) / 10,
                    'worst_vehicle_consumption' => rand(90, 120) / 10,
                    'fuel_savings' => rand(200, 1500),
                    'total_distance' => rand(15000, 60000),
                    'co2_emissions' => rand(3000, 12000),
                ];
                break;

            case 'eco_driving':
            case 'driver_eco_driving':
            case 'summary':
                // Utiliser le vrai service EcoDrivingService au lieu de données factices
                $ecoDrivingService = app(\App\Services\EcoDrivingService::class);
                
                // Récupérer les dates depuis la requête ou utiliser les valeurs par défaut (30 derniers jours)
                $defaultEndDate = now()->format('Y-m-d');
                $defaultStartDate = now()->subDays(30)->format('Y-m-d');
                $startDate = request('start_date', $defaultStartDate);
                $endDate = request('end_date', $defaultEndDate);
                $forceRefresh = request('force_refresh', false);
                
                // Vider le cache si demandé
                if ($forceRefresh) {
                    $ecoDrivingService->clearCache($user->account);
                }
                
                // Récupérer les vraies données de l'API
                $reportData['data'] = $ecoDrivingService->fetchEcoDrivingData($user->account, $startDate, $endDate);
                $reportData['period_start'] = $reportData['data']['period_start'] ?? $startDate;
                $reportData['period_end'] = $reportData['data']['period_end'] ?? $endDate;
                break;
            
            case 'geo_eco_driving':
                // Utiliser les services EcoDrivingService et EventHistoryService
                $ecoDrivingService = app(\App\Services\EcoDrivingService::class);
                $eventHistoryService = app(\App\Services\EventHistoryService::class);
                
                // Récupérer les dates depuis la requête ou utiliser les valeurs par défaut (30 derniers jours)
                $defaultEndDate = now()->format('Y-m-d');
                $defaultStartDate = now()->subDays(30)->format('Y-m-d');
                $startDate = request('start_date', $defaultStartDate);
                $endDate = request('end_date', $defaultEndDate);
                $forceRefresh = request('force_refresh', false);
                
                // Vider le cache si demandé
                if ($forceRefresh) {
                    $ecoDrivingService->clearCache($user->account);
                    $eventHistoryService->clearCache($user->account);
                }
                
                // Récupérer les données d'éco-conduite
                $ecoData = $ecoDrivingService->fetchEcoDrivingData($user->account, $startDate, $endDate);
                
                // Récupérer les données d'événements
                $eventData = $eventHistoryService->fetchEventHistoryData($user->account, $startDate, $endDate);
                
                // Combiner les données
                $reportData['data'] = $eventData; // Utiliser les données d'événements comme données principales
                $reportData['eco_data'] = $ecoData; // Ajouter les données d'éco-conduite si nécessaire
                $reportData['period_start'] = $startDate;
                $reportData['period_end'] = $endDate;
                break;

            default:
                // Données par défaut pour les rapports sans type spécifique
                $reportData['data'] = [
                    'total_distance' => rand(10000, 50000),
                    'total_vehicles' => rand(10, 25),
                    'active_vehicles' => rand(8, 20),
                    'alerts' => rand(0, 15),
                    'average_speed' => rand(50, 85),
                    'fuel_consumption' => rand(65, 110) / 10,
                    'trip_count' => rand(100, 300),
                    'operating_time' => rand(200, 600),
                ];
        }

        return Inertia::render('reports/detail', ['report' => $reportData]);
    })->name('reports.detail');

    // Send report by email
    Route::post('/reports/{id}/send-email', function ($id) {
        $request = request();
        
        $request->validate([
            'emails' => 'required|array',
            'emails.*' => 'required|email',
            'pdf' => 'required|string',
            'report_name' => 'required|string',
        ]);
        
        try {
            $fileName = Str::slug($request->report_name) . '_' . date('Y-m-d') . '.pdf';
            
            // Dispatcher le job en arrière-plan
            \App\Jobs\SendReportEmail::dispatch(
                $request->emails,
                $request->pdf,
                $request->report_name,
                $fileName
            );
            
            return back()->with('success', 'Le rapport est en cours d\'envoi. Vous recevrez une confirmation par email.');
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la mise en file du rapport: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Une erreur est survenue lors de la mise en file du rapport.']);
        }
    })->name('reports.send-email');

    // Platform API Configuration routes (réservé aux super-admins)
    Route::prefix('settings')->middleware('super-admin')->group(function () {
        Route::get('/platform-api', [\App\Http\Controllers\Settings\PlatformConfigurationController::class, 'index'])->name('settings.platform-api.index');
        Route::post('/platform-api', [\App\Http\Controllers\Settings\PlatformConfigurationController::class, 'store'])->name('settings.platform-api.store');
        Route::delete('/platform-api/{platform}', [\App\Http\Controllers\Settings\PlatformConfigurationController::class, 'destroy'])->name('settings.platform-api.destroy');
        Route::post('/platform-api/test', [\App\Http\Controllers\Settings\PlatformConfigurationController::class, 'test'])->name('settings.platform-api.test');
    });
});

// Mock API endpoints for development/testing (remove in production)
Route::prefix('mock-api')->group(function () {
    Route::get('/gps-tracker/vehicles', [\App\Http\Controllers\Api\MockVehicleApiController::class, 'gpsTracker']);
    Route::get('/fleet-manager/vehicles', [\App\Http\Controllers\Api\MockVehicleApiController::class, 'fleetManager']);
    Route::get('/track-pro/units', [\App\Http\Controllers\Api\MockVehicleApiController::class, 'trackPro']);
});

require __DIR__.'/settings.php';
