<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Mail;

try {
    echo "Envoi d'un email de test...\n";
    
    Mail::raw('Ceci est un email de test depuis le tracking dashboard.', function ($message) {
        $message->to('norepplynorepply753@gmail.com')
                ->subject('Test Email - Tracking Dashboard');
    });
    
    echo "✅ Email envoyé avec succès !\n";
    echo "Vérifiez votre boîte mail : norepplynorepply753@gmail.com\n";
    
} catch (Exception $e) {
    echo "❌ Erreur lors de l'envoi : " . $e->getMessage() . "\n";
    echo "Détails : " . $e->getTraceAsString() . "\n";
}
