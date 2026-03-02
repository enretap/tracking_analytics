<?php

/**
 * Test de récupération des données depuis l'endpoint CTRACK ecoDriving
 * pour le rapport Fleet Activity
 */

require __DIR__ . '/vendor/autoload.php';

use App\Models\Account;
use App\Services\CtrackEcoDrivingService;
use Illuminate\Support\Facades\Cache;

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "========================================\n";
echo "TEST: CTRACK EcoDriving Endpoint\n";
echo "========================================\n\n";

// Configuration du test
$testStartDate = '01/01/2026';  // Format: dd/mm/yyyy
$testEndDate = '23/02/2026';    // Format: dd/mm/yyyy

echo "📅 Période de test:\n";
echo "   Début: {$testStartDate}\n";
echo "   Fin: {$testEndDate}\n\n";

// Rechercher un compte avec CTRACK configuré
echo "🔍 Recherche d'un compte avec CTRACK configuré...\n";
$accounts = Account::whereHas('platforms', function ($query) {
    $query->where('slug', 'ctrack')
          ->orWhere('name', 'LIKE', '%CTRACK%');
})->get();

if ($accounts->isEmpty()) {
    echo "❌ Aucun compte avec CTRACK configuré trouvé.\n";
    echo "\nConfigurez un compte avec les informations suivantes:\n";
    echo "  - Platform: CTRACK\n";
    echo "  - API URL: https://comafrique-ctrack.online\n";
    echo "  - API Token: Votre token d'authentification\n";
    exit(1);
}

$account = $accounts->first();
echo "✅ Compte trouvé: {$account->name} (ID: {$account->id})\n";
if ($account->reference_ctrack) {
    echo "   ✅ Référence CTRACK: {$account->reference_ctrack}\n";
} else {
    echo "   ⚠️ Référence CTRACK: Non configurée\n";
}
echo "\n";

// Récupérer les informations de la plateforme
$platform = $account->platforms()
    ->where('slug', 'ctrack')
    ->orWhere('name', 'LIKE', '%CTRACK%')
    ->first();

$apiUrl = rtrim($platform->pivot->api_url ?? '', '/');
$apiToken = $platform->pivot->api_token;
$ctrackAccountId = $account->reference_ctrack ?? null;

echo "🔧 Configuration de la plateforme:\n";
echo "   API URL: {$apiUrl}\n";
echo "   Token: " . substr($apiToken, 0, 20) . "...\n";
if ($ctrackAccountId) {
    echo "   ✅ Référence CTRACK (account.reference_ctrack): {$ctrackAccountId}\n";
    echo "   Endpoint complet: {$apiUrl}/api/units/ecoDriving?begin={$testStartDate}&end={$testEndDate}&accountId={$ctrackAccountId}\n\n";
} else {
    echo "   ⚠️ Référence CTRACK: Non configurée\n";
    echo "   💡 Pour configurer: UPDATE accounts SET reference_ctrack = 'VOTRE_REF' WHERE id = {$account->id};\n";
    echo "   Endpoint complet: {$apiUrl}/api/units/ecoDriving?begin={$testStartDate}&end={$testEndDate}\n\n";
}

// Vider le cache pour forcer une nouvelle requête
echo "🗑️  Vidage du cache...\n";
$cacheKey = "ctrack_eco_driving_{$account->id}_{$testStartDate}_{$testEndDate}";
if ($ctrackAccountId) {
    $cacheKey .= "_{$ctrackAccountId}";
}
Cache::forget($cacheKey);
echo "   Cache key: {$cacheKey}\n\n";

// Test 1: Appel direct à l'API (sans passer par le service)
echo "========================================\n";
echo "TEST 1: Appel direct à l'API\n";
echo "========================================\n\n";

try {
    // Build query parameters
    $apiParams = [
        'begin' => $testStartDate,
        'end' => $testEndDate,
    ];
    
    // Add account filter if configured (from account.reference_ctrack)
    if ($ctrackAccountId) {
        $apiParams['accountId'] = $ctrackAccountId;
        echo "🔍 Filtrage par référence CTRACK: {$ctrackAccountId}\n\n";
    }
    
    $response = \Illuminate\Support\Facades\Http::timeout(30)
        ->withToken($apiToken)
        ->get($apiUrl . '/api/units/ecoDriving', $apiParams);

    echo "📡 Statut de la réponse: {$response->status()}\n";
    
    if ($response->successful()) {
        $data = $response->json();
        echo "✅ Requête réussie!\n\n";
        
        echo "📊 Résumé des données reçues:\n";
        echo "   Type: " . (is_array($data) ? 'Array' : gettype($data)) . "\n";
        
        if (is_array($data)) {
            echo "   Nombre d'enregistrements: " . count($data) . "\n\n";
            
            if (count($data) > 0) {
                echo "📝 Premier enregistrement:\n";
                $first = $data[0];
                echo "   Immatriculation: " . ($first['immatriculation'] ?? 'N/A') . "\n";
                echo "   Conducteur: " . ($first['driver'] ?? 'N/A') . "\n";
                echo "   Projet/Distributeur: " . ($first['project'] ?? 'N/A') . "\n";
                echo "   Distance: " . ($first['distance'] ?? 0) . " km\n";
                echo "   Vitesse max: " . ($first['max_speed'] ?? 0) . " km/h\n";
                echo "   Violations totales: " . ($first['total_violations'] ?? 0) . "\n\n";
                
                // Grouper par projet pour voir les distributeurs
                $projectGroups = [];
                foreach ($data as $vehicle) {
                    $project = $vehicle['project'] ?? 'Non assigné';
                    if (!isset($projectGroups[$project])) {
                        $projectGroups[$project] = 0;
                    }
                    $projectGroups[$project]++;
                }
                
                echo "📦 Véhicules par distributeur/projet:\n";
                foreach ($projectGroups as $project => $count) {
                    echo "   {$project}: {$count} véhicule(s)\n";
                }
                echo "\n";
                
                echo "📋 Échantillon des données (premiers 3 véhicules):\n";
                echo json_encode(array_slice($data, 0, 3), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n";
            } else {
                echo "⚠️  Aucune donnée retournée pour cette période.\n\n";
            }
        } else {
            echo "⚠️  Format de réponse inattendu.\n";
            echo "Données reçues:\n";
            echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n";
        }
    } else {
        echo "❌ Erreur lors de la requête:\n";
        echo "   Statut: {$response->status()}\n";
        echo "   Message: {$response->body()}\n\n";
    }
} catch (Exception $e) {
    echo "❌ Exception lors de l'appel direct:\n";
    echo "   " . $e->getMessage() . "\n\n";
}

// Test 2: Utilisation du service CtrackEcoDrivingService
echo "========================================\n";
echo "TEST 2: Via CtrackEcoDrivingService\n";
echo "========================================\n\n";

try {
    $service = new CtrackEcoDrivingService();
    
    echo "🔄 Appel du service fetchEcoDrivingData...\n";
    $result = $service->fetchEcoDrivingData($account, $testStartDate, $testEndDate);
    
    echo "✅ Service appelé avec succès!\n\n";
    
    echo "📊 Structure des données retournées:\n";
    echo "   total_vehicles: " . ($result['total_vehicles'] ?? 0) . "\n";
    echo "   active_vehicles: " . ($result['active_vehicles'] ?? 0) . "\n";
    echo "   inactive_vehicles: " . ($result['inactive_vehicles'] ?? 0) . "\n";
    echo "   total_distance: " . ($result['total_distance'] ?? 0) . " km\n";
    echo "   total_violations: " . ($result['total_violations'] ?? 0) . "\n";
    echo "   compliance_rate: " . ($result['compliance_rate'] ?? 0) . "%\n\n";
    
    if (isset($result['vehicle_details']) && !empty($result['vehicle_details'])) {
        echo "📝 Détails véhicules (nombre): " . count($result['vehicle_details']) . "\n";
        
        // Afficher quelques exemples
        echo "\n📋 Exemples de véhicules:\n";
        foreach (array_slice($result['vehicle_details'], 0, 5) as $idx => $vehicle) {
            echo "   " . ($idx + 1) . ". {$vehicle['immatriculation']} - ";
            echo "Projet: " . ($vehicle['project'] ?? 'N/A') . " - ";
            echo "{$vehicle['distance']} km\n";
        }
    }
    
    echo "\n";
} catch (Exception $e) {
    echo "❌ Exception lors de l'utilisation du service:\n";
    echo "   " . $e->getMessage() . "\n\n";
}

// Test 3: Utilisation du service avec transformation pour Fleet Activity
echo "========================================\n";
echo "TEST 3: FleetActivity Data (groupé par distributeur)\n";
echo "========================================\n\n";

try {
    $service = new CtrackEcoDrivingService();
    
    // Vérifier si la méthode fetchFleetActivityData existe
    if (method_exists($service, 'fetchFleetActivityData')) {
        echo "🔄 Appel du service fetchFleetActivityData...\n";
        
        // Convertir les dates au format Y-m-d pour cette méthode
        $startDateYmd = date('Y-m-d', strtotime(str_replace('/', '-', $testStartDate)));
        $endDateYmd = date('Y-m-d', strtotime(str_replace('/', '-', $testEndDate)));
        
        $result = $service->fetchFleetActivityData($account, $startDateYmd, $endDateYmd);
        
        echo "✅ Service appelé avec succès!\n\n";
        
        echo "📊 KPIs Fleet Activity:\n";
        echo "   Total véhicules: " . ($result['total_vehicles'] ?? 0) . "\n";
        echo "   Véhicules inactifs: " . ($result['inactive_vehicles'] ?? 0) . "\n";
        echo "   Véhicules avec trajets: " . ($result['vehicles_with_trips'] ?? 0) . "\n";
        echo "   Nombre de distributeurs: " . ($result['distributors_count'] ?? 0) . "\n";
        echo "   Total trajets: " . ($result['total_trips'] ?? 0) . "\n";
        echo "   Distance totale: " . ($result['total_distance'] ?? 0) . " km\n";
        echo "   Durée totale: " . ($result['total_duration'] ?? '0:00:00') . "\n\n";
        
        if (isset($result['distributors']) && !empty($result['distributors'])) {
            echo "📦 Données par distributeur:\n";
            foreach ($result['distributors'] as $distributor) {
                echo "\n   🏢 {$distributor['name']}:\n";
                echo "      Véhicules actifs: {$distributor['active_vehicles']}\n";
                echo "      Véhicules inactifs: {$distributor['inactive_vehicles']}\n";
                echo "      Distance: " . round($distributor['distance'], 2) . " km\n";
                echo "      Trajets: {$distributor['trips']}\n";
            }
        } else {
            echo "⚠️  Aucun distributeur trouvé.\n";
        }
        
        echo "\n";
    } else {
        echo "⚠️  La méthode fetchFleetActivityData n'existe pas encore dans CtrackEcoDrivingService.\n";
        echo "   Seule la méthode fetchEcoDrivingData est disponible.\n\n";
    }
} catch (Exception $e) {
    echo "❌ Exception lors du test Fleet Activity:\n";
    echo "   " . $e->getMessage() . "\n\n";
}

echo "========================================\n";
echo "✅ Tests terminés!\n";
echo "========================================\n";
