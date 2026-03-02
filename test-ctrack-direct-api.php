<?php

require __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\Http;

// Configuration
$apiUrl = 'https://comafrique-ctrack.online';
$apiToken = 'VOTRE_TOKEN_ICI'; // Remplacez par votre token
$accountId = '118';
$startDate = '24/01/2026';
$endDate = '24/02/2026';

echo "🔍 Test direct de l'API CTRACK\n";
echo "=====================================\n\n";

// Appel API
$endpoint = $apiUrl . '/api/units/ecoDriving';
$params = [
    'begin' => $startDate,
    'end' => $endDate,
    'accountId' => $accountId
];

echo "📡 Endpoint: {$endpoint}\n";
echo "📅 Période: {$startDate} -> {$endDate}\n";
echo "🏢 Account ID: {$accountId}\n\n";

try {
    $response = file_get_contents($endpoint . '?' . http_build_query($params), false, stream_context_create([
        'http' => [
            'header' => "Authorization: Bearer {$apiToken}\r\n"
        ]
    ]));
    
    $data = json_decode($response, true);
    
    echo "✅ Total enregistrements: " . count($data) . "\n\n";
    
    // Filtrer par company_id
    $filtered = array_filter($data, function($record) use ($accountId) {
        return isset($record['company_id']) && $record['company_id'] == $accountId;
    });
    
    echo "🔍 Enregistrements filtrés (company_id={$accountId}): " . count($filtered) . "\n\n";
    
    // Compter ceux avec distance > 0
    $withDistance = array_filter($filtered, function($record) {
        return ($record['distance'] ?? 0) > 0;
    });
    
    echo "🚗 Véhicules avec distance > 0: " . count($withDistance) . "\n\n";
    
    // Afficher les 3 premiers
    echo "📊 Premiers enregistrements filtrés:\n";
    echo "=====================================\n";
    $i = 0;
    foreach ($filtered as $record) {
        if ($i >= 3) break;
        echo "\n" . ($i+1) . ". " . ($record['immatriculation'] ?? 'N/A') . "\n";
        echo "   Company ID: " . ($record['company_id'] ?? 'N/A') . "\n";
        echo "   Distance: " . ($record['distance'] ?? 0) . " km\n";
        echo "   Max Speed: " . ($record['max_speed'] ?? 0) . " km/h\n";
        echo "   Driving Time: " . ($record['driving_time'] ?? 0) . " s\n";
        echo "   Violations: " . ($record['total_violations'] ?? 0) . "\n";
        $i++;
    }
    
    // Statistiques
    echo "\n📈 Statistiques pour company_id={$accountId}:\n";
    echo "=====================================\n";
    $totalDistance = 0;
    $totalViolations = 0;
    foreach ($filtered as $record) {
        $totalDistance += ($record['distance'] ?? 0);
        $totalViolations += ($record['total_violations'] ?? 0);
    }
    echo "Distance totale: " . round($totalDistance, 2) . " km\n";
    echo "Violations totales: {$totalViolations}\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
