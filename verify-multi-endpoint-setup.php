<?php

/**
 * Script de vérification de la configuration complète du système multi-endpoints
 * 
 * Usage: php verify-multi-endpoint-setup.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Report;
use App\Models\Platform;
use App\Models\Account;
use App\Models\ReportPlatformEndpoint;
use Illuminate\Support\Facades\DB;

$errors = [];
$warnings = [];
$success = [];

echo "═══════════════════════════════════════════════════════════════════\n";
echo "  Vérification de la Configuration Multi-Endpoints\n";
echo "═══════════════════════════════════════════════════════════════════\n\n";

// 1. Vérifier que la table existe
echo "1️⃣  Vérification de la base de données...\n";
try {
    $tableExists = \Illuminate\Support\Facades\Schema::hasTable('report_platform_endpoints');
    if ($tableExists) {
        $success[] = "✅ Table 'report_platform_endpoints' existe";
        echo "   ✅ Table 'report_platform_endpoints' existe\n";
    } else {
        $errors[] = "❌ Table 'report_platform_endpoints' n'existe pas";
        echo "   ❌ Table 'report_platform_endpoints' n'existe pas\n";
        echo "      → Exécutez: php artisan migrate\n";
    }
} catch (Exception $e) {
    $errors[] = "❌ Erreur de connexion à la base de données";
    echo "   ❌ Erreur de connexion à la base de données\n";
}
echo "\n";

// 2. Vérifier les rapports
echo "2️⃣  Vérification des rapports...\n";
$summaryReport = Report::where('type', 'summary')->orWhere('name', 'Rapport de Synthèse')->first();
if ($summaryReport) {
    $success[] = "✅ Rapport de Synthèse trouvé (ID: {$summaryReport->id})";
    echo "   ✅ Rapport de Synthèse trouvé (ID: {$summaryReport->id})\n";
} else {
    $warnings[] = "⚠️  Rapport de Synthèse non trouvé";
    echo "   ⚠️  Rapport de Synthèse non trouvé\n";
    echo "      → Exécutez: php artisan db:seed --class=ReportPlatformEndpointSeeder\n";
}
echo "\n";

// 3. Vérifier les plateformes
echo "3️⃣  Vérification des plateformes...\n";
$targetPlatform = Platform::where('slug', 'targe-telematics')->first();
if ($targetPlatform) {
    $success[] = "✅ Plateforme TARGE TELEMATICS trouvée (ID: {$targetPlatform->id})";
    echo "   ✅ Plateforme TARGE TELEMATICS trouvée (ID: {$targetPlatform->id})\n";
} else {
    $warnings[] = "⚠️  Plateforme TARGE TELEMATICS non trouvée";
    echo "   ⚠️  Plateforme TARGE TELEMATICS non trouvée\n";
    echo "      → Exécutez: php artisan db:seed --class=ReportPlatformEndpointSeeder\n";
}
echo "\n";

// 4. Vérifier les endpoints configurés
echo "4️⃣  Vérification des endpoints configurés...\n";
if ($summaryReport && $targetPlatform) {
    $endpoints = ReportPlatformEndpoint::where('report_id', $summaryReport->id)
        ->where('platform_id', $targetPlatform->id)
        ->orderBy('order')
        ->get();
    
    if ($endpoints->count() > 0) {
        $success[] = "✅ {$endpoints->count()} endpoint(s) configuré(s)";
        echo "   ✅ {$endpoints->count()} endpoint(s) configuré(s):\n";
        foreach ($endpoints as $endpoint) {
            echo "      • [{$endpoint->http_method}] {$endpoint->endpoint_path} → {$endpoint->data_key}\n";
        }
        
        // Vérifier les clés de données recommandées
        $expectedKeys = ['events', 'eco_summary', 'stops'];
        $actualKeys = $endpoints->pluck('data_key')->toArray();
        $missingKeys = array_diff($expectedKeys, $actualKeys);
        
        if (empty($missingKeys)) {
            $success[] = "✅ Toutes les clés de données recommandées sont présentes";
            echo "   ✅ Toutes les clés de données recommandées sont présentes\n";
        } else {
            $warnings[] = "⚠️  Clés de données manquantes: " . implode(', ', $missingKeys);
            echo "   ⚠️  Clés de données manquantes: " . implode(', ', $missingKeys) . "\n";
        }
    } else {
        $errors[] = "❌ Aucun endpoint configuré";
        echo "   ❌ Aucun endpoint configuré\n";
        echo "      → Exécutez: php artisan db:seed --class=ReportPlatformEndpointSeeder\n";
    }
} else {
    echo "   ⏭️  Vérification ignorée (rapport ou plateforme manquant)\n";
}
echo "\n";

// 5. Vérifier les comptes
echo "5️⃣  Vérification des comptes...\n";
$accounts = Account::all();
if ($accounts->count() > 0) {
    $success[] = "✅ {$accounts->count()} compte(s) trouvé(s)";
    echo "   ✅ {$accounts->count()} compte(s) trouvé(s):\n";
    foreach ($accounts as $account) {
        echo "      • {$account->name} (ID: {$account->id})\n";
    }
} else {
    $warnings[] = "⚠️  Aucun compte trouvé";
    echo "   ⚠️  Aucun compte trouvé\n";
    echo "      → Créez un compte dans la base de données\n";
}
echo "\n";

// 6. Vérifier les configurations account_platform
echo "6️⃣  Vérification des configurations API (account_platform)...\n";
if ($targetPlatform) {
    $configs = DB::table('account_platform')
        ->join('accounts', 'account_platform.account_id', '=', 'accounts.id')
        ->where('account_platform.platform_id', $targetPlatform->id)
        ->select(
            'accounts.name as account_name',
            'account_platform.api_url',
            'account_platform.api_token'
        )
        ->get();
    
    if ($configs->count() > 0) {
        $success[] = "✅ {$configs->count()} configuration(s) API trouvée(s)";
        echo "   ✅ {$configs->count()} configuration(s) API trouvée(s):\n";
        foreach ($configs as $config) {
            $tokenPreview = substr($config->api_token, 0, 20) . '...';
            echo "      • {$config->account_name}:\n";
            echo "        - URL: {$config->api_url}\n";
            echo "        - Token: {$tokenPreview}\n";
        }
    } else {
        $warnings[] = "⚠️  Aucune configuration API pour TARGE TELEMATICS";
        echo "   ⚠️  Aucune configuration API pour TARGE TELEMATICS\n";
        echo "      → Configurez via /settings/platform-api\n";
        echo "      → Ou exécutez: database/configure-apm-targe-telematics.sql\n";
    }
} else {
    echo "   ⏭️  Vérification ignorée (plateforme manquante)\n";
}
echo "\n";

// 7. Vérifier les fichiers importants
echo "7️⃣  Vérification des fichiers du système...\n";
$files = [
    'Migration' => 'database/migrations/2025_12_24_000001_create_report_platform_endpoints_table.php',
    'Modèle' => 'app/Models/ReportPlatformEndpoint.php',
    'Service' => 'app/Services/ReportDataService.php',
    'Contrôleur' => 'app/Http/Controllers/Reports/SummaryReportController.php',
    'Seeder' => 'database/seeders/ReportPlatformEndpointSeeder.php',
];

foreach ($files as $name => $path) {
    if (file_exists(__DIR__ . '/' . $path)) {
        $success[] = "✅ $name existe";
        echo "   ✅ $name existe\n";
    } else {
        $errors[] = "❌ $name manquant: $path";
        echo "   ❌ $name manquant: $path\n";
    }
}
echo "\n";

// 8. Résumé final
echo "═══════════════════════════════════════════════════════════════════\n";
echo "  Résumé de la Vérification\n";
echo "═══════════════════════════════════════════════════════════════════\n\n";

echo "✅ Succès: " . count($success) . "\n";
echo "⚠️  Avertissements: " . count($warnings) . "\n";
echo "❌ Erreurs: " . count($errors) . "\n\n";

if (count($errors) > 0) {
    echo "Erreurs à corriger:\n";
    foreach ($errors as $error) {
        echo "  $error\n";
    }
    echo "\n";
}

if (count($warnings) > 0) {
    echo "Avertissements:\n";
    foreach ($warnings as $warning) {
        echo "  $warning\n";
    }
    echo "\n";
}

// 9. Recommandations
echo "═══════════════════════════════════════════════════════════════════\n";
echo "  Prochaines Étapes\n";
echo "═══════════════════════════════════════════════════════════════════\n\n";

if (count($errors) === 0 && count($warnings) === 0) {
    echo "🎉 Tout est configuré correctement !\n\n";
    echo "Vous pouvez maintenant:\n";
    echo "  1. Tester le service: php test-report-data-service.php\n";
    echo "  2. Voir les endpoints: php show-endpoints.php\n";
    echo "  3. Utiliser le service dans vos contrôleurs\n\n";
    exit(0);
} else {
    if (count($errors) > 0) {
        echo "❌ Configuration incomplète. Suivez les instructions ci-dessus.\n\n";
        exit(1);
    } else {
        echo "⚠️  Configuration partielle. Complétez les éléments manquants:\n\n";
        
        if (in_array("⚠️  Rapport de Synthèse non trouvé", $warnings)) {
            echo "  • Créer le rapport et les endpoints:\n";
            echo "    php artisan db:seed --class=ReportPlatformEndpointSeeder\n\n";
        }
        
        if (in_array("⚠️  Aucune configuration API pour TARGE TELEMATICS", $warnings)) {
            echo "  • Configurer l'API:\n";
            echo "    - Via l'interface: /settings/platform-api\n";
            echo "    - Via SQL: database/configure-apm-targe-telematics.sql\n\n";
        }
        
        exit(0);
    }
}
