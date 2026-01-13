<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Account;

echo "=== Vérification Configuration CTRACK ===\n\n";

// Vérifier tous les comptes avec CTRACK
$accounts = Account::with(['platforms' => function($q) {
    $q->where('platforms.slug', 'ctrack');
}])->get();

foreach ($accounts as $account) {
    $ctrack = $account->platforms->where('slug', 'ctrack')->first();
    
    if ($ctrack) {
        // Recharger avec is_active from pivot
        $isActive = DB::table('account_platform')
            ->where('account_id', $account->id)
            ->where('platform_id', $ctrack->id)
            ->value('is_active');
            
        echo "Compte: {$account->name} (ID: {$account->id})\n";
        echo "  reference_ctrack: " . ($account->reference_ctrack ?? 'NOT SET') . "\n";
        echo "  Platform: {$ctrack->name}\n";
        echo "  Is Active: " . ($isActive ? 'YES' : 'NO') . " (value: {$isActive})\n";
        echo "  Has Token: " . (!empty($ctrack->pivot->api_token) ? 'YES (length: ' . strlen($ctrack->pivot->api_token) . ')' : 'NO') . "\n";
        echo "  API URL: {$ctrack->pivot->api_url}\n";
        echo "\n";
    }
}

echo "=== Fin ===\n";
