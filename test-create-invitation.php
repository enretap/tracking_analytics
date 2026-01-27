<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\UserInvitation;
use Illuminate\Support\Str;

try {
    // Créer une invitation de test
    $invitation = UserInvitation::create([
        'email' => 'test@example.com',
        'name' => 'Test User',
        'account_id' => 1, // Utiliser un account_id existant
        'role' => 'agent',
        'token' => Str::random(64),
        'expires_at' => now()->addDays(7),
    ]);
    
    $url = url('/invitation/accept/' . $invitation->token);
    
    echo "✅ Invitation créée avec succès !\n\n";
    echo "URL de test : {$url}\n";
    echo "Email : {$invitation->email}\n";
    echo "Nom : {$invitation->name}\n";
    echo "Token : {$invitation->token}\n";
    echo "Expire le : {$invitation->expires_at}\n";
    
} catch (Exception $e) {
    echo "❌ Erreur : " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
