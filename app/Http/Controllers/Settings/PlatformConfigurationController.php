<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Platform;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PlatformConfigurationController extends Controller
{
    /**
     * Display the platform configuration page
     * Permet la configuration de toutes les plateformes pour tous les comptes
     */
    public function index(Request $request): Response
    {
        Log::info('PlatformConfiguration: Method called');
        $user = $request->user();
        Log::info('PlatformConfiguration: User', ['user_id' => $user->id, 'email' => $user->email]);
        
        // Récupérer toutes les plateformes actives
        $platforms = Platform::where('is_active', true)
            ->orderBy('name')
            ->get();

        if ($platforms->isEmpty()) {
            return Inertia::render('settings/platform-configuration', [
                'platforms' => [],
                'error' => 'Aucune plateforme active disponible. Veuillez créer une plateforme d\'abord.',
            ]);
        }

        // Récupérer tous les comptes
        $allAccounts = Account::orderBy('name')->get();

        // Pour chaque plateforme, récupérer les configurations de tous les comptes
        $platformsWithAccounts = $platforms->map(function ($platform) use ($allAccounts) {
            $accountsWithConfig = $allAccounts->map(function ($account) use ($platform) {
                $config = DB::table('account_platform')
                    ->where('account_id', $account->id)
                    ->where('platform_id', $platform->id)
                    ->first();

                return [
                    'id' => $account->id,
                    'name' => $account->name,
                    'configured' => $config !== null,
                    'api_url' => $config?->api_url,
                    'api_token' => $config?->api_token,
                    'http_method' => $config?->http_method ?? 'GET',
                    'token_type' => $config?->token_type ?? 'bearer',
                    'token_key' => $config?->token_key,
                    'additional_params' => $config?->additional_params,
                    'configured_at' => $config?->updated_at,
                ];
            });

            return [
                'id' => $platform->id,
                'name' => $platform->name,
                'slug' => $platform->slug,
                'provider' => $platform->provider,
                'accounts' => $accountsWithConfig,
            ];
        });

        return Inertia::render('settings/platform-configuration', [
            'platforms' => $platformsWithAccounts,
        ]);
    }

    /**
     * Configure or update a platform for the account
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'platform_id' => 'required|exists:platforms,id',
            'api_url' => 'required|url|max:500',
            'api_token' => 'required|string|max:1000',
            'http_method' => 'nullable|in:GET,POST',
            'token_type' => 'nullable|in:bearer,header,body',
            'token_key' => 'nullable|string|max:50',
            'additional_params' => 'nullable|json',
        ]);

        // Vérifier que la plateforme existe
        $platform = Platform::find($validated['platform_id']);
        if (!$platform) {
            return back()->withErrors(['error' => 'Plateforme introuvable']);
        }

        $account = Account::find($validated['account_id']);

        if (!$account) {
            return back()->withErrors(['error' => 'Compte introuvable']);
        }

        // Vérifier si la configuration existe déjà
        $exists = DB::table('account_platform')
            ->where('account_id', $account->id)
            ->where('platform_id', $validated['platform_id'])
            ->exists();

        if ($exists) {
            // Mettre à jour
            DB::table('account_platform')
                ->where('account_id', $account->id)
                ->where('platform_id', $validated['platform_id'])
                ->update([
                    'api_url' => $validated['api_url'],
                    'api_token' => $validated['api_token'],
                    'http_method' => $validated['http_method'] ?? 'GET',
                    'token_type' => $validated['token_type'] ?? 'bearer',
                    'token_key' => $validated['token_key'] ?? null,
                    'additional_params' => $validated['additional_params'] ?? null,
                    'updated_at' => now(),
                ]);

            return back()->with('success', 'Configuration mise à jour avec succès pour ' . $account->name);
        } else {
            // Créer
            $account->platforms()->attach($validated['platform_id'], [
                'api_url' => $validated['api_url'],
                'api_token' => $validated['api_token'],
                'http_method' => $validated['http_method'] ?? 'GET',
                'token_type' => $validated['token_type'] ?? 'bearer',
                'token_key' => $validated['token_key'] ?? null,
                'additional_params' => $validated['additional_params'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return back()->with('success', 'Plateforme configurée avec succès pour ' . $account->name);
        }
    }

    /**
     * Remove a platform configuration
     */
    public function destroy(Request $request, int $platformId)
    {
        $validated = $request->validate([
            'account_id' => 'required|exists:accounts,id',
        ]);

        $account = Account::find($validated['account_id']);

        if (!$account) {
            return back()->withErrors(['error' => 'Compte introuvable']);
        }

        // Vérifier que la plateforme existe
        $platform = Platform::find($platformId);
        if (!$platform) {
            return back()->withErrors(['error' => 'Plateforme introuvable']);
        }

        // Détacher la plateforme
        $account->platforms()->detach($platformId);

        return back()->with('success', 'Configuration supprimée avec succès pour ' . $account->name);
    }

    /**
     * Test the API connection
     */
    public function test(Request $request)
    {
        $validated = $request->validate([
            'api_url' => 'required|url',
            'api_token' => 'required|string',
            'http_method' => 'nullable|in:GET,POST',
            'token_type' => 'nullable|in:bearer,header,body',
            'token_key' => 'nullable|string',
            'additional_params' => 'nullable|json',
        ]);

        try {
            $httpMethod = strtoupper($validated['http_method'] ?? 'GET');
            $tokenType = $validated['token_type'] ?? 'bearer';
            $tokenKey = $validated['token_key'] ?? null;
            $additionalParams = [];
            
            if (!empty($validated['additional_params'])) {
                $additionalParams = json_decode($validated['additional_params'], true) ?? [];
            }

            // Build HTTP request based on configuration
            $httpClient = \Illuminate\Support\Facades\Http::timeout(10);
            
            // Configure authentication based on token_type
            switch ($tokenType) {
                case 'bearer':
                    $httpClient = $httpClient->withToken($validated['api_token']);
                    break;
                    
                case 'header':
                    if ($tokenKey) {
                        $httpClient = $httpClient->withHeaders([
                            $tokenKey => $validated['api_token']
                        ]);
                    }
                    break;
                    
                case 'body':
                    // Token will be added to body for POST requests
                    if ($tokenKey) {
                        $additionalParams[$tokenKey] = $validated['api_token'];
                    }
                    break;
            }
            
            // Execute request based on HTTP method
            if ($httpMethod === 'POST') {
                $response = $httpClient->post($validated['api_url'], $additionalParams);
            } else {
                // GET request with query parameters
                $response = $httpClient->get($validated['api_url'], $additionalParams);
            }

            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Connexion réussie - API opérationnelle',
                    'status' => $response->status(),
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Échec de la connexion (Code: ' . $response->status() . ')',
                    'status' => $response->status(),
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de connexion: ' . $e->getMessage(),
            ], 500);
        }
    }
}
