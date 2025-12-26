<?php

/**
 * Script de test rapide pour le VehicleService
 * 
 * Usage: php test-vehicle-service.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Services\VehicleService;

echo "==============================================\n";
echo "Test du Service de Véhicules\n";
echo "==============================================\n\n";

// Récupérer le premier utilisateur
$user = User::first();

if (!$user) {
    echo "❌ Aucun utilisateur trouvé dans la base de données.\n";
    echo "   Veuillez créer un utilisateur d'abord.\n";
    exit(1);
}

echo "✅ Utilisateur trouvé: {$user->name} (ID: {$user->id})\n";

// Vérifier le compte
if (!$user->account) {
    echo "❌ Cet utilisateur n'a pas de compte associé.\n";
    exit(1);
}

echo "✅ Compte: {$user->account->name} (ID: {$user->account->id})\n\n";

// Vérifier les plateformes
$platforms = $user->account->platforms;
echo "📊 Plateformes configurées: " . $platforms->count() . "\n";

if ($platforms->count() === 0) {
    echo "⚠️  Aucune plateforme configurée pour ce compte.\n";
    echo "   Exécutez: php artisan db:seed --class=VehiclePlatformSeeder\n\n";
} else {
    foreach ($platforms as $platform) {
        $hasUrl = !empty($platform->pivot->api_url);
        $hasToken = !empty($platform->pivot->api_token);
        $status = ($hasUrl && $hasToken) ? '✅' : '⚠️';
        
        echo "   {$status} {$platform->name} ({$platform->slug})\n";
        if ($hasUrl) {
            echo "      URL: {$platform->pivot->api_url}\n";
        }
        if (!$hasUrl || !$hasToken) {
            echo "      ⚠️  Credentials manquants\n";
        }
    }
    echo "\n";
}

// Tester le service
echo "🚀 Test du VehicleService...\n";
$service = new VehicleService();

try {
    $vehicles = $service->getAllVehicles($user);
    
    echo "✅ Service exécuté avec succès!\n";
    echo "📊 Véhicules trouvés: " . count($vehicles) . "\n\n";
    
    if (count($vehicles) > 0) {
        echo "==============================================\n";
        echo "Détails des Véhicules\n";
        echo "==============================================\n\n";
        
        foreach ($vehicles as $vehicle) {
            echo "🚗 {$vehicle['name']}\n";
            echo "   Plaque: {$vehicle['plate']}\n";
            echo "   Status: {$vehicle['status']}\n";
            echo "   Plateforme: {$vehicle['platform_slug']}\n";
            echo "   Position: {$vehicle['latitude']}, {$vehicle['longitude']}\n";
            echo "   Vitesse: {$vehicle['speed']} km/h\n";
            echo "   Distance: " . number_format($vehicle['distance'] / 1000, 2) . " km\n";
            echo "   Dernière mise à jour: {$vehicle['lastUpdate']}\n";
            echo "\n";
        }
        
        echo "==============================================\n";
        echo "Statistiques\n";
        echo "==============================================\n";
        
        $byPlatform = [];
        $byStatus = [];
        
        foreach ($vehicles as $vehicle) {
            $slug = $vehicle['platform_slug'];
            $status = $vehicle['status'];
            
            if (!isset($byPlatform[$slug])) {
                $byPlatform[$slug] = 0;
            }
            if (!isset($byStatus[$status])) {
                $byStatus[$status] = 0;
            }
            
            $byPlatform[$slug]++;
            $byStatus[$status]++;
        }
        
        echo "\nPar plateforme:\n";
        foreach ($byPlatform as $slug => $count) {
            echo "   {$slug}: {$count} véhicule(s)\n";
        }
        
        echo "\nPar statut:\n";
        foreach ($byStatus as $status => $count) {
            echo "   {$status}: {$count} véhicule(s)\n";
        }
        
        echo "\n✅ Test réussi!\n";
    } else {
        echo "⚠️  Aucun véhicule trouvé.\n";
        echo "\nVérifications suggérées:\n";
        echo "1. Les plateformes sont-elles configurées avec api_url et api_token?\n";
        echo "2. Si vous utilisez les APIs mock, le serveur est-il démarré?\n";
        echo "3. Consultez les logs: storage/logs/laravel.log\n";
    }
    
} catch (Exception $e) {
    echo "❌ Erreur lors de l'exécution du service:\n";
    echo "   {$e->getMessage()}\n";
    echo "\n📝 Stacktrace:\n";
    echo $e->getTraceAsString();
    exit(1);
}

echo "\n==============================================\n";
echo "Test terminé avec succès!\n";
echo "==============================================\n";
