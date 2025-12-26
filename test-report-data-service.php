<?php

/**
 * Script d'exemple pour tester le service ReportDataService
 * 
 * Usage: php test-report-data-service.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Report;
use App\Models\Platform;
use App\Services\ReportDataService;

echo "═══════════════════════════════════════════════════════════════════\n";
echo "  Test du Service de Récupération de Données pour Rapports\n";
echo "═══════════════════════════════════════════════════════════════════\n\n";

// 1. Récupérer un utilisateur avec un compte
$user = User::with('account')->first();

if (!$user || !$user->account) {
    echo "❌ Aucun utilisateur avec compte trouvé\n";
    echo "   Créez un utilisateur d'abord ou exécutez les seeders\n\n";
    exit(1);
}

echo "✅ Utilisateur: {$user->name}\n";
echo "✅ Compte: {$user->account->name} (ID: {$user->account->id})\n\n";

// 2. Récupérer le rapport de synthèse
$summaryReport = Report::where('type', 'summary')
    ->orWhere('name', 'Rapport de Synthèse')
    ->first();

if (!$summaryReport) {
    echo "❌ Rapport de Synthèse non trouvé\n";
    echo "   Exécutez: php artisan db:seed --class=ReportPlatformEndpointSeeder\n\n";
    exit(1);
}

echo "✅ Rapport: {$summaryReport->name} (ID: {$summaryReport->id})\n\n";

// 3. Vérifier les endpoints configurés
$platforms = $summaryReport->platforms()->get();

if ($platforms->isEmpty()) {
    echo "❌ Aucun endpoint configuré pour ce rapport\n";
    echo "   Exécutez: php artisan db:seed --class=ReportPlatformEndpointSeeder\n\n";
    exit(1);
}

echo "📊 Plateformes avec endpoints configurés:\n";
foreach ($platforms as $platform) {
    $endpoints = $summaryReport->getEndpointsForPlatform($platform->id);
    echo "   • {$platform->name} ({$endpoints->count()} endpoints)\n";
    
    foreach ($endpoints as $endpoint) {
        echo "     - [{$endpoint->http_method}] {$endpoint->endpoint_path}\n";
        echo "       ↳ data_key: {$endpoint->data_key}\n";
        echo "       ↳ required: " . ($endpoint->is_required ? 'Oui' : 'Non') . "\n";
    }
}
echo "\n";

// 4. Vérifier la configuration account_platform
$targetPlatform = $platforms->first();
$platformConfig = $user->account->platforms()
    ->where('platform_id', $targetPlatform->id)
    ->first();

if (!$platformConfig) {
    echo "❌ Configuration API non trouvée pour la plateforme {$targetPlatform->name}\n";
    echo "   Configurez l'URL et le token dans /settings/platform-api\n\n";
    echo "Exemple de configuration SQL:\n";
    echo "INSERT INTO account_platform (account_id, platform_id, api_url, api_token, created_at, updated_at)\n";
    echo "VALUES (\n";
    echo "    {$user->account->id},  -- ID du compte: {$user->account->name}\n";
    echo "    {$targetPlatform->id},  -- ID de la plateforme: {$targetPlatform->name}\n";
    echo "    'https://fleet.securysat.com',  -- Base URL\n";
    echo "    'votre-token-api',  -- Token d'authentification\n";
    echo "    NOW(),\n";
    echo "    NOW()\n";
    echo ");\n\n";
    exit(1);
}

echo "✅ Configuration API trouvée:\n";
echo "   Base URL: {$platformConfig->pivot->api_url}\n";
echo "   Token: " . substr($platformConfig->pivot->api_token, 0, 20) . "...\n";
echo "   HTTP Method: {$platformConfig->pivot->http_method}\n";
echo "   Token Type: {$platformConfig->pivot->token_type}\n\n";

// 5. Tester le service
echo "═══════════════════════════════════════════════════════════════════\n";
echo "  Test de Récupération des Données\n";
echo "═══════════════════════════════════════════════════════════════════\n\n";

$reportDataService = new ReportDataService();

// Paramètres de test (exemple avec plage de dates)
$params = [
    'start_date' => now()->subDays(7)->format('Y-m-d'),
    'end_date' => now()->format('Y-m-d'),
    'vehicle_id' => 'TEST001', // Remplacez par un ID de véhicule valide
];

echo "Paramètres de requête:\n";
foreach ($params as $key => $value) {
    echo "   • {$key}: {$value}\n";
}
echo "\n";

echo "Récupération des données...\n\n";

try {
    $result = $reportDataService->fetchReportData(
        $summaryReport,
        $user->account,
        $targetPlatform,
        $params
    );

    if ($result['success']) {
        echo "✅ Données récupérées avec succès!\n\n";
        
        echo "Résumé des données:\n";
        foreach ($result['data'] as $dataKey => $dataValue) {
            if (is_array($dataValue)) {
                $count = count($dataValue);
                echo "   • {$dataKey}: {$count} éléments\n";
            } else {
                echo "   • {$dataKey}: " . gettype($dataValue) . "\n";
            }
        }
        
        if (!empty($result['errors'])) {
            echo "\n⚠️  Erreurs non bloquantes:\n";
            foreach ($result['errors'] as $error) {
                echo "   • {$error['endpoint']}: {$error['error']}\n";
            }
        }
        
        echo "\n📦 Structure complète:\n";
        echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        echo "\n";
        
    } else {
        echo "❌ Échec de la récupération des données\n";
        echo "   Erreur: {$result['error']}\n\n";
        
        if (!empty($result['partial_data'])) {
            echo "Données partielles récupérées:\n";
            foreach ($result['partial_data'] as $dataKey => $dataValue) {
                echo "   • {$dataKey}\n";
            }
        }
    }
    
} catch (Exception $e) {
    echo "❌ Exception: " . $e->getMessage() . "\n";
    echo "   Trace: " . $e->getTraceAsString() . "\n\n";
}

echo "\n═══════════════════════════════════════════════════════════════════\n";
echo "  Fin du test\n";
echo "═══════════════════════════════════════════════════════════════════\n";
