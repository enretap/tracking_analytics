<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Account;
use App\Models\Platform;
use Illuminate\Support\Facades\DB;

echo "=== Diagnostic des plateformes TARGA TELEMATICS ===\n\n";

// 1. Vérifier si la plateforme existe
echo "1. Recherche de la plateforme TARGA TELEMATICS...\n";
$targaPlatform = Platform::where('name', 'TARGA TELEMATICS')->first();

if (!$targaPlatform) {
    echo "❌ Plateforme TARGA TELEMATICS non trouvée\n";
    echo "\n📋 Pour créer la plateforme:\n";
    echo "   \$platform = Platform::create([\n";
    echo "       'name' => 'TARGA TELEMATICS',\n";
    echo "       'slug' => 'targa-telematics',\n";
    echo "       'provider' => 'TARGA',\n";
    echo "       'is_active' => true,\n";
    echo "   ]);\n\n";
} else {
    echo "✅ Plateforme trouvée: {$targaPlatform->name} (ID: {$targaPlatform->id})\n";
    echo "   Slug: {$targaPlatform->slug}\n";
    echo "   Provider: {$targaPlatform->provider}\n";
    echo "   Active: " . ($targaPlatform->is_active ? 'Oui' : 'Non') . "\n\n";
}

// 2. Vérifier les comptes associés
echo "2. Comptes associés à TARGA TELEMATICS:\n";
if ($targaPlatform) {
    $accounts = DB::table('account_platform')
        ->join('accounts', 'account_platform.account_id', '=', 'accounts.id')
        ->where('account_platform.platform_id', $targaPlatform->id)
        ->select('accounts.id', 'accounts.name', 'account_platform.*')
        ->get();
    
    if ($accounts->isEmpty()) {
        echo "⚠️  Aucun compte associé\n\n";
    } else {
        foreach ($accounts as $acc) {
            echo "   - Compte #{$acc->id}: {$acc->name}\n";
            echo "     API URL: {$acc->api_url}\n";
            echo "     Token: " . (empty($acc->api_token) ? '❌ Non configuré' : '✅ Configuré') . "\n";
            echo "     Active: " . ($acc->is_active ? 'Oui' : 'Non') . "\n\n";
        }
    }
}

// 3. Vérifier le compte 3 spécifiquement
echo "3. Configuration du compte #3:\n";
$account3 = Account::find(3);

if (!$account3) {
    echo "❌ Compte #3 non trouvé\n\n";
} else {
    echo "   Nom: {$account3->name}\n";
    
    $platforms = $account3->platforms;
    echo "   Plateformes associées: {$platforms->count()}\n";
    
    foreach ($platforms as $platform) {
        echo "   - {$platform->name}\n";
        echo "     API URL: {$platform->pivot->api_url}\n";
        echo "     Token: " . (empty($platform->pivot->api_token) ? '❌ Non configuré' : '✅ Configuré') . "\n";
    }
    
    if ($platforms->isEmpty()) {
        echo "   ⚠️  Aucune plateforme configurée pour ce compte\n";
    }
    
    // Vérifier si TARGA est configuré
    $hasTarga = $platforms->where('name', 'TARGA TELEMATICS')->first();
    if (!$hasTarga) {
        echo "\n   ❌ TARGA TELEMATICS n'est pas configuré pour le compte #3\n";
        echo "\n   📋 Pour associer TARGA au compte #3:\n";
        if ($targaPlatform) {
            echo "   \$account = Account::find(3);\n";
            echo "   \$account->platforms()->attach({$targaPlatform->id}, [\n";
            echo "       'api_url' => 'https://fleet.securysat.com',\n";
            echo "       'api_token' => 'VOTRE_TOKEN_ICI',\n";
            echo "       'is_active' => true,\n";
            echo "   ]);\n\n";
        }
    } else {
        echo "\n   ✅ TARGA TELEMATICS est configuré\n";
    }
}

echo "\n=== Fin du diagnostic ===\n";
