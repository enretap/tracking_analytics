<?php

/**
 * Script de démonstration des paramètres envoyés aux endpoints
 * 
 * Ce script montre exactement quels paramètres sont construits et envoyés
 * à chaque endpoint TARGE TELEMATICS
 * 
 * Usage: php demo-request-parameters.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Report;
use App\Models\Platform;
use App\Models\ReportPlatformEndpoint;

echo "═══════════════════════════════════════════════════════════════════\n";
echo "  Démonstration des Paramètres Envoyés aux Endpoints\n";
echo "═══════════════════════════════════════════════════════════════════\n\n";

// Configuration d'exemple
$exampleConfig = [
    'account' => 'APM',
    'platform' => 'TARGE TELEMATICS',
    'base_url' => 'https://fleet.securysat.com',
    'api_token' => 'exemple-session-id-token-123456',
    'start_date' => '2025-12-01',
    'end_date' => '2025-12-24',
];

echo "📋 Configuration d'exemple:\n";
echo "   Compte: {$exampleConfig['account']}\n";
echo "   Plateforme: {$exampleConfig['platform']}\n";
echo "   Base URL: {$exampleConfig['base_url']}\n";
echo "   Token/SessionId: " . substr($exampleConfig['api_token'], 0, 30) . "...\n";
echo "   Période: {$exampleConfig['start_date']} → {$exampleConfig['end_date']}\n";
echo "\n";

// Récupérer les endpoints configurés
$report = Report::where('name', 'Rapport de Synthèse')->first();
$platform = Platform::where('slug', 'targe-telematics')->first();

if (!$report || !$platform) {
    echo "❌ Rapport ou plateforme non trouvé\n";
    echo "   Exécutez: php artisan db:seed --class=ReportPlatformEndpointSeeder\n\n";
    exit(1);
}

$endpoints = ReportPlatformEndpoint::where('report_id', $report->id)
    ->where('platform_id', $platform->id)
    ->orderBy('order')
    ->get();

if ($endpoints->isEmpty()) {
    echo "❌ Aucun endpoint configuré\n\n";
    exit(1);
}

echo "═══════════════════════════════════════════════════════════════════\n";
echo "  Requêtes qui seront envoyées\n";
echo "═══════════════════════════════════════════════════════════════════\n\n";

foreach ($endpoints as $index => $endpoint) {
    $endpointNumber = $index + 1;
    
    echo "Endpoint #{$endpointNumber} : {$endpoint->data_key}\n";
    echo "─────────────────────────────────────────────────────────────────\n";
    
    // URL complète
    $fullUrl = $exampleConfig['base_url'] . $endpoint->endpoint_path;
    echo "URL: {$endpoint->http_method} {$fullUrl}\n\n";
    
    // Paramètres de l'endpoint (additional_params)
    $endpointParams = $endpoint->additional_params ?? [];
    if (is_string($endpointParams)) {
        $endpointParams = json_decode($endpointParams, true) ?? [];
    }
    
    // Paramètres requis (ajoutés automatiquement par le service)
    $requiredParams = [
        'sessionId' => $exampleConfig['api_token'],
        'startDate' => $exampleConfig['start_date'],
        'endDate' => $exampleConfig['end_date'],
    ];
    
    // Fusion (comme dans ReportDataService)
    $allParams = array_merge($endpointParams, $requiredParams);
    
    // Afficher le body JSON
    echo "Body (JSON):\n";
    echo json_encode($allParams, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    echo "\n\n";
    
    // Détails des paramètres
    echo "Détails des paramètres:\n";
    foreach ($allParams as $key => $value) {
        $source = '';
        if (in_array($key, ['sessionId', 'startDate', 'endDate'])) {
            $source = '(automatique - ReportDataService)';
        } elseif (isset($endpointParams[$key])) {
            $source = '(specific - additional_params)';
        }
        
        $displayValue = is_numeric($value) ? $value : "\"$value\"";
        echo "   • {$key}: {$displayValue} {$source}\n";
    }
    
    echo "\n";
    
    // Exemple avec cURL
    echo "Exemple cURL équivalent:\n";
    echo "curl -X {$endpoint->http_method} '{$fullUrl}' \\\n";
    echo "  -H 'Content-Type: application/json' \\\n";
    echo "  -d '" . json_encode($allParams, JSON_UNESCAPED_UNICODE) . "'\n";
    
    echo "\n";
    if ($endpointNumber < $endpoints->count()) {
        echo "═══════════════════════════════════════════════════════════════════\n\n";
    }
}

// Résumé
echo "═══════════════════════════════════════════════════════════════════\n";
echo "  Résumé\n";
echo "═══════════════════════════════════════════════════════════════════\n\n";

echo "✅ {$endpoints->count()} endpoint(s) configuré(s)\n";
echo "✅ Chaque endpoint reçoit automatiquement:\n";
echo "   • sessionId (depuis account_platform.api_token)\n";
echo "   • startDate (depuis params['start_date'])\n";
echo "   • endDate (depuis params['end_date'])\n\n";

// Vérifier si des paramètres additionnels existent
$hasAdditionalParams = $endpoints->filter(function ($e) {
    return !empty($e->additional_params);
})->count() > 0;

if ($hasAdditionalParams) {
    echo "ℹ️  Certains endpoints ont des paramètres additionnels:\n";
    foreach ($endpoints as $endpoint) {
        if (!empty($endpoint->additional_params)) {
            echo "   • {$endpoint->data_key}: " . json_encode($endpoint->additional_params) . "\n";
        }
    }
    echo "\n";
}

echo "📚 Documentation complète: REQUEST_PARAMETERS.md\n";
echo "\n";

echo "═══════════════════════════════════════════════════════════════════\n";
echo "  Comment tester avec de vraies données\n";
echo "═══════════════════════════════════════════════════════════════════\n\n";

echo "1. Configurez le vrai token API:\n";
echo "   \$> php artisan tinker\n";
echo "   >>> DB::table('account_platform')->insert([\n";
echo "       'account_id' => 5,\n";
echo "       'platform_id' => 6,\n";
echo "       'api_url' => 'https://fleet.securysat.com',\n";
echo "       'api_token' => 'VOTRE-VRAI-SESSION-ID',\n";
echo "       'http_method' => 'POST',\n";
echo "       'token_type' => 'body',\n";
echo "       'created_at' => now(),\n";
echo "       'updated_at' => now(),\n";
echo "   ]);\n\n";

echo "2. Testez le service:\n";
echo "   \$> php test-report-data-service.php\n\n";

echo "3. Le service enverra exactement les paramètres montrés ci-dessus\n";
echo "   mais avec votre vrai token au lieu de l'exemple.\n\n";

echo "Bon test ! 🚀\n";
