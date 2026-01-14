<?php

require __DIR__.'/vendor/autoload.php';

use App\Models\Account;
use App\Services\CtrackEcoDrivingService;

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "═══════════════════════════════════════════════════════════════════\n";
echo "  Test du Service CTRACK Eco-Driving\n";
echo "═══════════════════════════════════════════════════════════════════\n\n";

// 1. Trouver un compte avec CTRACK configuré
echo "🔍 Recherche d'un compte avec CTRACK configuré...\n";

$account = Account::whereHas('platforms', function ($query) {
    $query->where('slug', 'ctrack')
          ->orWhere('name', 'LIKE', '%CTRACK%');
})->first();

if (!$account) {
    echo "❌ Aucun compte trouvé avec CTRACK configuré.\n";
    echo "\n💡 Pour configurer CTRACK:\n";
    echo "   1. Assurez-vous que la plateforme CTRACK existe\n";
    echo "   2. Configurez account_platform avec:\n";
    echo "      - api_url: https://comafrique-ctrack.online\n";
    echo "      - api_token: VOTRE_TOKEN_CTRACK\n";
    exit(1);
}

echo "✅ Compte trouvé: {$account->name} (ID: {$account->id})\n\n";

// 2. Vérifier la configuration de la plateforme
$platform = $account->platforms()
    ->where('slug', 'ctrack')
    ->orWhere('name', 'LIKE', '%CTRACK%')
    ->first();

if (!$platform) {
    echo "❌ Plateforme CTRACK non trouvée.\n";
    exit(1);
}

echo "📋 Configuration CTRACK:\n";
echo "   Platform: {$platform->name}\n";
echo "   API URL: {$platform->pivot->api_url}\n";
echo "   Token: " . substr($platform->pivot->api_token ?? '', 0, 20) . "...\n\n";

// 3. Tester le service avec différentes périodes
$service = new CtrackEcoDrivingService();

// Test 1: Données d'aujourd'hui
echo "═══════════════════════════════════════════════════════════════════\n";
echo "  Test 1: Données d'aujourd'hui\n";
echo "═══════════════════════════════════════════════════════════════════\n";

$today = now()->format('d/m/Y');
echo "📅 Période: {$today}\n\n";

try {
    $result = $service->fetchEcoDrivingData($account, $today, $today);
    
    echo "✅ Résultat obtenu:\n";
    echo "   Véhicules totaux: {$result['total_vehicles']}\n";
    echo "   Véhicules actifs: {$result['active_vehicles']}\n";
    echo "   Distance totale: {$result['total_distance']} km\n";
    echo "   Conducteurs: {$result['total_drivers']}\n";
    echo "   Violations totales: {$result['total_alerts']}\n";
    echo "   Taux de conformité: {$result['compliance_rate']}%\n";
    echo "   Heures d'opération: {$result['operating_hours']} h\n\n";
    
    if (!empty($result['vehicle_details'])) {
        echo "📊 Détails des véhicules (premiers 5):\n";
        $count = 0;
        foreach ($result['vehicle_details'] as $vehicle) {
            if ($count >= 5) break;
            echo "\n   {$vehicle['immatriculation']}:\n";
            echo "      Conducteur: " . ($vehicle['driver'] ?? 'N/A') . "\n";
            echo "      Distance: {$vehicle['distance']} km\n";
            echo "      Vitesse max: {$vehicle['max_speed']} km/h\n";
            echo "      Temps de conduite: {$vehicle['driving_time']}s\n";
            echo "      Violations: {$vehicle['total_violations']}\n";
            echo "         - Freinages brusques: {$vehicle['harsh_braking']}\n";
            echo "         - Accélérations brusques: {$vehicle['harsh_acceleration']}\n";
            echo "         - Virages dangereux: {$vehicle['dangerous_turns']}\n";
            echo "         - Excès de vitesse: {$vehicle['speed_violations']}\n";
            $count++;
        }
    } else {
        echo "ℹ️  Aucun détail de véhicule disponible.\n";
    }
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    echo "   Trace: " . $e->getTraceAsString() . "\n";
}

echo "\n";

// Test 2: Données sur une semaine
echo "═══════════════════════════════════════════════════════════════════\n";
echo "  Test 2: Données sur 7 jours\n";
echo "═══════════════════════════════════════════════════════════════════\n";

$startDate = now()->subDays(7)->format('d/m/Y');
$endDate = now()->format('d/m/Y');
echo "📅 Période: {$startDate} → {$endDate}\n\n";

try {
    $result = $service->fetchEcoDrivingData($account, $startDate, $endDate);
    
    echo "✅ Résultat obtenu:\n";
    echo "   Véhicules totaux: {$result['total_vehicles']}\n";
    echo "   Véhicules actifs: {$result['active_vehicles']}\n";
    echo "   Distance totale: {$result['total_distance']} km\n";
    echo "   Violations totales: {$result['total_alerts']}\n";
    echo "   Alertes critiques: {$result['critical_alerts']}\n\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 3: Vérifier le cache
echo "═══════════════════════════════════════════════════════════════════\n";
echo "  Test 3: Vérification du cache\n";
echo "═══════════════════════════════════════════════════════════════════\n";

echo "🔄 Premier appel (va mettre en cache)...\n";
$start = microtime(true);
$result1 = $service->fetchEcoDrivingData($account, $today, $today);
$time1 = round((microtime(true) - $start) * 1000, 2);
echo "   Temps: {$time1}ms\n\n";

echo "🔄 Deuxième appel (devrait venir du cache)...\n";
$start = microtime(true);
$result2 = $service->fetchEcoDrivingData($account, $today, $today);
$time2 = round((microtime(true) - $start) * 1000, 2);
echo "   Temps: {$time2}ms\n\n";

if ($time2 < $time1 / 2) {
    echo "✅ Le cache fonctionne correctement! (2ème appel {$time2}ms < {$time1}ms)\n";
} else {
    echo "⚠️  Le cache pourrait ne pas fonctionner (temps similaires)\n";
}

echo "\n";
echo "═══════════════════════════════════════════════════════════════════\n";
echo "  Test terminé!\n";
echo "═══════════════════════════════════════════════════════════════════\n";
