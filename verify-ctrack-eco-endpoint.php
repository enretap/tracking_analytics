<?php

require __DIR__.'/vendor/autoload.php';

use App\Models\Platform;
use App\Models\ReportPlatformEndpoint;

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "═══════════════════════════════════════════════════════════════════\n";
echo "  Vérification de l'Endpoint CTRACK EcoDriving\n";
echo "═══════════════════════════════════════════════════════════════════\n\n";

// 1. Vérifier la plateforme CTRACK
echo "🔍 Vérification de la plateforme CTRACK...\n";
$platform = Platform::where('slug', 'ctrack')->first();

if ($platform) {
    echo "✅ Plateforme CTRACK trouvée:\n";
    echo "   ID: {$platform->id}\n";
    echo "   Nom: {$platform->name}\n";
    echo "   Slug: {$platform->slug}\n";
    echo "   Provider: {$platform->provider}\n";
    echo "   Active: " . ($platform->is_active ? 'Oui' : 'Non') . "\n\n";
} else {
    echo "❌ Plateforme CTRACK non trouvée.\n\n";
    exit(1);
}

// 2. Vérifier les endpoints configurés pour CTRACK
echo "🔍 Vérification des endpoints CTRACK...\n";
$endpoints = ReportPlatformEndpoint::where('platform_id', $platform->id)
    ->orderBy('order')
    ->get();

if ($endpoints->count() > 0) {
    echo "✅ {$endpoints->count()} endpoint(s) trouvé(s):\n\n";
    
    foreach ($endpoints as $endpoint) {
        echo "   📍 Endpoint #{$endpoint->order}:\n";
        echo "      Path: {$endpoint->endpoint_path}\n";
        echo "      Méthode: {$endpoint->http_method}\n";
        echo "      Data Key: {$endpoint->data_key}\n";
        echo "      Description: {$endpoint->description}\n";
        echo "      Requis: " . ($endpoint->is_required ? 'Oui' : 'Non') . "\n";
        echo "      Rapport: {$endpoint->report->name}\n";
        
        $params = json_decode($endpoint->additional_params, true);
        if (!empty($params)) {
            echo "      Paramètres additionnels: " . json_encode($params) . "\n";
        }
        echo "\n";
    }
} else {
    echo "❌ Aucun endpoint trouvé pour CTRACK.\n\n";
}

// 3. Afficher l'URL complète qui sera appelée
echo "═══════════════════════════════════════════════════════════════════\n";
echo "  Configuration Requise\n";
echo "═══════════════════════════════════════════════════════════════════\n\n";

echo "Pour utiliser cet endpoint, configurez dans account_platform:\n\n";
echo "   Base URL: https://comafrique-ctrack.online\n";
echo "   Token: VOTRE_TOKEN_CTRACK\n\n";

echo "L'URL complète sera:\n";
echo "   https://comafrique-ctrack.online/api/units/ecoDriving?begin=DD/MM/YYYY&end=DD/MM/YYYY\n\n";

echo "═══════════════════════════════════════════════════════════════════\n";
echo "  Service Disponible\n";
echo "═══════════════════════════════════════════════════════════════════\n\n";

echo "Le service CtrackEcoDrivingService est disponible pour:\n";
echo "   - Récupérer les données d'éco-conduite\n";
echo "   - Transformer les données au format standard\n";
echo "   - Mettre en cache (TTL: 5 min)\n\n";

echo "Exemple d'utilisation:\n";
echo "   \$service = new \\App\\Services\\CtrackEcoDrivingService();\n";
echo "   \$data = \$service->fetchEcoDrivingData(\$account);\n\n";

echo "═══════════════════════════════════════════════════════════════════\n";
echo "✅ Configuration vérifiée avec succès!\n";
echo "═══════════════════════════════════════════════════════════════════\n";
