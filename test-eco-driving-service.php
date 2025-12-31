<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Services\EcoDrivingService;
use App\Models\Account;
use Illuminate\Support\Facades\DB;

/**
 * Script de test pour l'intégration TARGA TELEMATICS
 * 
 * Usage: php test-eco-driving-service.php
 */

echo "=== Test du Service EcoDriving ===\n\n";

// Bootstrap Laravel
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    // 1. Vérifier qu'il y a au moins un compte avec TARGA TELEMATICS configuré
    echo "1. Recherche d'un compte avec TARGA TELEMATICS...\n";
    
    $account = Account::whereHas('platforms', function ($query) {
        $query->where('name', 'LIKE', '%TARGA%')
              ->orWhere('base_api_url', 'LIKE', '%fleet.securysat.com%');
    })->first();
    
    if (!$account) {
        echo "❌ Aucun compte avec TARGA TELEMATICS trouvé.\n";
        echo "\n📋 Pour configurer un compte:\n";
        echo "   1. Créer une plateforme TARGA TELEMATICS si elle n'existe pas\n";
        echo "   2. Associer la plateforme au compte dans account_platform\n";
        echo "   3. Configurer api_url='https://fleet.securysat.com'\n";
        echo "   4. Configurer api_token avec votre token\n";
        exit(1);
    }
    
    echo "✅ Compte trouvé: {$account->name} (ID: {$account->id})\n\n";
    
    // 2. Vérifier la configuration de la plateforme
    echo "2. Vérification de la configuration...\n";
    
    $platformConfig = DB::table('account_platform')
        ->join('platforms', 'account_platform.platform_id', '=', 'platforms.id')
        ->where('account_platform.account_id', $account->id)
        ->where(function ($query) {
            $query->where('platforms.name', 'LIKE', '%TARGA%')
                  ->orWhere('platforms.base_api_url', 'LIKE', '%fleet.securysat.com%');
        })
        ->select('account_platform.*', 'platforms.name as platform_name')
        ->first();
    
    if (!$platformConfig) {
        echo "❌ Configuration de plateforme introuvable.\n";
        exit(1);
    }
    
    echo "   Platform: {$platformConfig->platform_name}\n";
    echo "   API URL: {$platformConfig->api_url}\n";
    echo "   Token: " . (substr($platformConfig->api_token, 0, 10) . '...') . "\n";
    echo "   Token Type: {$platformConfig->token_type}\n";
    echo "   Token Key: {$platformConfig->token_key}\n";
    echo "✅ Configuration valide\n\n";
    
    // 3. Tester le service EcoDriving
    echo "3. Test du service EcoDrivingService...\n";
    
    $service = new EcoDrivingService();
    
    // Dates de test: 7 derniers jours
    $startDate = now()->subDays(7)->format('Y-m-d');
    $endDate = now()->format('Y-m-d');
    
    echo "   Période: {$startDate} au {$endDate}\n";
    echo "   Appel de l'API en cours...\n";
    
    $data = $service->fetchEcoDrivingData($account, $startDate, $endDate);
    
    // 4. Afficher les résultats
    echo "\n4. Résultats:\n";
    echo "   =====================================\n";
    echo "   📊 MÉTRIQUES DE LA FLOTTE\n";
    echo "   =====================================\n";
    echo "   Total véhicules:      {$data['total_vehicles']}\n";
    echo "   Véhicules actifs:     {$data['active_vehicles']}\n";
    echo "   Véhicules inactifs:   {$data['inactive_vehicles']}\n";
    echo "   Distance totale:      " . number_format($data['total_distance'], 2) . " km\n";
    echo "\n";
    echo "   =====================================\n";
    echo "   👨‍✈️ MÉTRIQUES DES CONDUCTEURS\n";
    echo "   =====================================\n";
    echo "   Total conducteurs:    {$data['total_drivers']}\n";
    echo "   Score moyen:          " . number_format($data['average_driver_score'], 2) . "%\n";
    echo "\n";
    echo "   =====================================\n";
    echo "   ⚠️ ALERTES ET INCIDENTS\n";
    echo "   =====================================\n";
    echo "   Total alertes:        {$data['total_alerts']}\n";
    echo "   Alertes critiques:    {$data['critical_alerts']}\n";
    echo "\n";
    
    // 5. Afficher quelques détails de véhicules
    if (!empty($data['vehicle_details'])) {
        echo "   =====================================\n";
        echo "   🚗 DÉTAILS DES VÉHICULES (Top 5)\n";
        echo "   =====================================\n";
        
        $topVehicles = array_slice($data['vehicle_details'], 0, 5);
        
        foreach ($topVehicles as $vehicle) {
            echo "\n";
            echo "   Véhicule:             {$vehicle['immatriculation']}\n";
            echo "   Conducteur:           {$vehicle['driver']}\n";
            echo "   Distance:             " . number_format($vehicle['distance'], 2) . " km\n";
            echo "   Vitesse max:          {$vehicle['max_speed']} km/h\n";
            echo "   Temps de conduite:    {$vehicle['driving_time']}\n";
            echo "   Temps au ralenti:     {$vehicle['idle_time']}\n";
            echo "   Freinages brusques:   {$vehicle['harsh_braking']}\n";
            echo "   Accélérations:        {$vehicle['harsh_acceleration']}\n";
            echo "   Virages dangereux:    {$vehicle['dangerous_turns']}\n";
            echo "   Excès de vitesse:     {$vehicle['speed_violations']}\n";
            echo "   Total infractions:    {$vehicle['total_violations']}\n";
            echo "   -----------------------------------\n";
        }
        
        $totalCount = count($data['vehicle_details']);
        if ($totalCount > 5) {
            echo "\n   ... et " . ($totalCount - 5) . " autres véhicules\n";
        }
    } else {
        echo "\n   ⚠️ Aucun détail de véhicule disponible\n";
    }
    
    echo "\n";
    echo "✅ Test terminé avec succès!\n";
    
    // 6. Test du cache
    echo "\n5. Test du cache...\n";
    echo "   Deuxième appel (devrait utiliser le cache)...\n";
    
    $startTime = microtime(true);
    $cachedData = $service->fetchEcoDrivingData($account, $startDate, $endDate);
    $endTime = microtime(true);
    
    $duration = ($endTime - $startTime) * 1000;
    
    echo "   ✅ Durée: " . number_format($duration, 2) . "ms (avec cache)\n";
    echo "   ✅ Données identiques: " . ($data === $cachedData ? 'Oui' : 'Non') . "\n";
    
    // 7. Suggestions
    echo "\n";
    echo "=====================================\n";
    echo "📝 PROCHAINES ÉTAPES\n";
    echo "=====================================\n";
    echo "1. Vérifier que le dashboard affiche bien ces données\n";
    echo "2. Tester l'endpoint API: GET /api/eco-driving\n";
    echo "3. Utiliser le hook useEcoDriving() dans vos composants React\n";
    echo "4. Consulter la documentation: ECO_DRIVING_INTEGRATION.md\n";
    echo "\n";
    
} catch (Exception $e) {
    echo "\n❌ ERREUR: " . $e->getMessage() . "\n";
    echo "\n📋 Trace:\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}
