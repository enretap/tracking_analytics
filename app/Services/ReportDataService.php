<?php

namespace App\Services;

use App\Models\Report;
use App\Models\Account;
use App\Models\Platform;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class ReportDataService
{
    /**
     * Fetch data for a report from all configured endpoints of a platform
     *
     * @param Report $report
     * @param Account $account
     * @param Platform $platform
     * @param array $params Additional parameters (date range, filters, etc.)
     * @return array
     */
    public function fetchReportData(Report $report, Account $account, Platform $platform, array $params = []): array
    {
        $data = [];
        $errors = [];

        // Get account platform configuration (base URL and token)
        $platformConfig = $account->platforms()
            ->where('platform_id', $platform->id)
            ->first();

        if (!$platformConfig) {
            Log::warning("No platform configuration found for account {$account->id} and platform {$platform->id}");
            return [
                'success' => false,
                'error' => 'Configuration de plateforme non trouvée',
            ];
        }

        $baseApiUrl = rtrim($platformConfig->pivot->api_url ?? '', '/');
        $apiToken = $platformConfig->pivot->api_token;
        $defaultTokenType = $platformConfig->pivot->token_type ?? 'bearer';
        $defaultTokenKey = $platformConfig->pivot->token_key;

        if (!$baseApiUrl || !$apiToken) {
            Log::warning("Missing API credentials for platform {$platform->name}");
            return [
                'success' => false,
                'error' => 'Credentials API manquants',
            ];
        }

        // Get all endpoints for this report and platform
        $endpoints = $report->getEndpointsForPlatform($platform->id);

        if ($endpoints->isEmpty()) {
            Log::info("No endpoints configured for report {$report->id} on platform {$platform->id}");
            return [
                'success' => false,
                'error' => 'Aucun endpoint configuré pour ce rapport',
            ];
        }

        // Execute each endpoint request
        foreach ($endpoints as $endpoint) {
            try {
                $endpointData = $this->executeEndpointRequest(
                    baseUrl: $baseApiUrl,
                    endpoint: $endpoint,
                    apiToken: $apiToken,
                    tokenType: $defaultTokenType,
                    tokenKey: $defaultTokenKey,
                    params: $params
                );

                // Store the data with its key
                $dataKey = $endpoint->data_key ?? 'data_' . $endpoint->id;
                $data[$dataKey] = $endpointData;

            } catch (Exception $e) {
                $errorMessage = "Error fetching data from {$endpoint->endpoint_path}: " . $e->getMessage();
                Log::error($errorMessage);

                // If the endpoint is required, fail the entire request
                if ($endpoint->is_required) {
                    return [
                        'success' => false,
                        'error' => $errorMessage,
                        'partial_data' => $data,
                    ];
                }

                // Otherwise, just log the error and continue
                $errors[] = [
                    'endpoint' => $endpoint->endpoint_path,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return [
            'success' => true,
            'data' => $data,
            'errors' => $errors,
            'platform' => $platform->name,
            'account' => $account->name,
        ];
    }

    /**
     * Execute a single endpoint request
     *
     * @param string $baseUrl
     * @param \App\Models\ReportPlatformEndpoint $endpoint
     * @param string $apiToken
     * @param string $tokenType
     * @param string|null $tokenKey
     * @param array $params
     * @return array
     */
    protected function executeEndpointRequest(
        string $baseUrl,
        $endpoint,
        string $apiToken,
        string $tokenType,
        ?string $tokenKey,
        array $params
    ): array {
        // Build full URL
        $fullUrl = $baseUrl . '/' . ltrim($endpoint->endpoint_path, '/');

        // Merge additional params from endpoint config with request params
        $endpointParams = $endpoint->additional_params ?? [];
        
        // S'assurer que endpointParams est un tableau (peut être JSON string ou null)
        if (is_string($endpointParams)) {
            $endpointParams = json_decode($endpointParams, true) ?? [];
        }
        if (!is_array($endpointParams)) {
            $endpointParams = [];
        }
        
        // Préparer les paramètres requis pour TARGE TELEMATICS
        $requiredParams = [
            'sessionId' => $apiToken, // Le token sert de sessionId
            'startDate' => $params['start_date'] ?? '',
            'endDate' => $params['end_date'] ?? '',
        ];
        
        // Fusionner dans l'ordre : params endpoint -> params requis -> params requête
        // Les params de requête écrasent les params requis si présents
        $allParams = array_merge($endpointParams, $requiredParams, $params);

        // Build HTTP request
        // Timeout par défaut : 30s, mais peut être augmenté pour certains endpoints lents
        $timeout = 30;
        if (isset($allParams['timeout'])) {
            $timeout = (int) $allParams['timeout'];
            unset($allParams['timeout']); // Retirer du body de la requête
        }
        $httpClient = Http::timeout($timeout);

        // Configure authentication
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
                if ($tokenKey) {
                    $allParams[$tokenKey] = $apiToken;
                }
                break;
        }

        // Execute request based on HTTP method
        $httpMethod = strtoupper($endpoint->http_method ?? 'GET');
        
        Log::info("Executing {$httpMethod} request to {$fullUrl}", [
            'data_key' => $endpoint->data_key,
            'params' => array_keys($allParams),
        ]);

        $response = match ($httpMethod) {
            'POST' => $httpClient->post($fullUrl, $allParams),
            'GET' => $httpClient->get($fullUrl, $allParams),
            default => throw new Exception("Unsupported HTTP method: {$httpMethod}"),
        };

        // Check response
        if ($response->failed()) {
            throw new Exception("HTTP {$response->status()}: " . $response->body());
        }

        $responseData = $response->json();

        if ($responseData === null) {
            throw new Exception("Invalid JSON response from endpoint");
        }

        return $responseData;
    }

    /**
     * Fetch data from multiple platforms for a report
     *
     * @param Report $report
     * @param Account $account
     * @param array $platformIds
     * @param array $params
     * @return array
     */
    public function fetchFromMultiplePlatforms(
        Report $report,
        Account $account,
        array $platformIds,
        array $params = []
    ): array {
        $results = [];

        foreach ($platformIds as $platformId) {
            $platform = Platform::find($platformId);
            if (!$platform) {
                continue;
            }

            $results[$platform->slug] = $this->fetchReportData($report, $account, $platform, $params);
        }

        return $results;
    }
}
