<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

echo "\n=== 🔍 Vérification de l'URL API CTRACK ===\n\n";

// Récupérer la plateforme CTRACK
$platform = DB::table('platforms')
    ->where('slug', 'ctrack')
    ->first();

if (!$platform) {
    echo "❌ Plateforme CTRACK non trouvée\n";
    exit(1);
}

echo "✅ Plateforme CTRACK trouvée (ID: {$platform->id})\n\n";

// Récupérer les configurations account_platform
$configs = DB::table('account_platform')
    ->where('platform_id', $platform->id)
    ->get(['account_id', 'api_url', 'api_token']);

if ($configs->isEmpty()) {
    echo "⚠️  Aucune configuration CTRACK trouvée\n";
    exit(0);
}

echo "📋 Configurations trouvées : " . $configs->count() . "\n\n";

$needsFix = false;

foreach ($configs as $config) {
    echo "Account ID: {$config->account_id}\n";
    echo "URL actuelle: {$config->api_url}\n";
    
    // Check if URL contains path segments
    $parsed = parse_url($config->api_url);
    $hasPath = !empty($parsed['path']) && $parsed['path'] !== '/';
    
    if ($hasPath) {
        echo "❌ PROBLÈME: L'URL contient un path spécifique\n";
        echo "   Path trouvé: {$parsed['path']}\n";
        
        // Propose the fix
        $baseUrl = $parsed['scheme'] . '://' . $parsed['host'];
        if (!empty($parsed['port'])) {
            $baseUrl .= ':' . $parsed['port'];
        }
        
        echo "   URL corrigée: {$baseUrl}\n";
        echo "   📝 Commande SQL pour corriger:\n";
        echo "   UPDATE account_platform SET api_url = '{$baseUrl}' WHERE account_id = {$config->account_id} AND platform_id = {$platform->id};\n\n";
        
        $needsFix = true;
    } else {
        echo "✅ URL correcte (pas de path spécifique)\n\n";
    }
}

if ($needsFix) {
    echo "\n🔧 CORRECTION AUTOMATIQUE\n\n";
    echo "Voulez-vous corriger automatiquement les URLs ? (y/n): ";
    $handle = fopen("php://stdin", "r");
    $line = fgets($handle);
    $answer = trim($line);
    
    if (strtolower($answer) === 'y' || strtolower($answer) === 'yes') {
        echo "\n⏳ Correction en cours...\n\n";
        
        foreach ($configs as $config) {
            $parsed = parse_url($config->api_url);
            $hasPath = !empty($parsed['path']) && $parsed['path'] !== '/';
            
            if ($hasPath) {
                $baseUrl = $parsed['scheme'] . '://' . $parsed['host'];
                if (!empty($parsed['port'])) {
                    $baseUrl .= ':' . $parsed['port'];
                }
                
                DB::table('account_platform')
                    ->where('account_id', $config->account_id)
                    ->where('platform_id', $platform->id)
                    ->update(['api_url' => $baseUrl]);
                
                echo "✅ Account {$config->account_id}: {$config->api_url} → {$baseUrl}\n";
            }
        }
        
        echo "\n✅ Correction terminée !\n";
        echo "🧹 N'oubliez pas de vider le cache:\n";
        echo "   php artisan cache:clear\n\n";
    } else {
        echo "\n⏭️  Correction annulée. Vous pouvez utiliser les commandes SQL ci-dessus.\n\n";
    }
} else {
    echo "\n✅ Toutes les URLs sont correctes !\n\n";
}

echo "\n=== 📝 RAPPEL ===\n";
echo "L'URL de base doit être juste le domaine (ex: https://comafrique-ctrack.online)\n";
echo "Les endpoints spécifiques sont ajoutés par le code du service.\n\n";
