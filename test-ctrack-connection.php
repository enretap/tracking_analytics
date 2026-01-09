<?php

require __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\Http;

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Test de connexion CTRACK ===\n\n";

// Configuration CTRACK - À MODIFIER avec vos vraies valeurs
$apiUrl = 'https://comafrique-ctrack.online/api/units/list';
$apiToken = 'VOTRE_TOKEN_CTRACK'; // À remplacer par le vrai token
$referenceCtrack = 'VOTRE_COMPANY_ID'; // À remplacer par le company_id à filtrer

echo "URL: $apiUrl\n";
echo "Token: " . substr($apiToken, 0, 10) . "...\n";
echo "Reference CTRACK (company_id à filtrer): $referenceCtrack\n\n";

try {
    echo "Envoi de la requête...\n";
    
    $response = Http::timeout(30)
        ->withToken($apiToken)
        ->get($apiUrl);
    
    if ($response->successful()) {
        $data = $response->json();
        
        echo "✓ Requête réussie!\n\n";
        echo "Structure de la réponse:\n";
        echo "- Clés principales: " . implode(', ', array_keys($data)) . "\n";
        
        $vehicles = $data['data'] ?? $data;
        $totalVehicles = is_array($vehicles) ? count($vehicles) : 0;
        
        echo "- Nombre total de véhicules: $totalVehicles\n\n";
        
        if ($totalVehicles > 0) {
            echo "Premier véhicule (exemple):\n";
            print_r($vehicles[0]);
            
            echo "\n\nFiltrage par company_id = $referenceCtrack...\n";
            $filtered = array_filter($vehicles, function($v) use ($referenceCtrack) {
                return isset($v['company_id']) && (string)$v['company_id'] === (string)$referenceCtrack;
            });
            
            echo "Véhicules filtrés: " . count($filtered) . "\n\n";
            
            if (count($filtered) > 0) {
                echo "Premier véhicule filtré:\n";
                print_r(array_values($filtered)[0]);
            } else {
                echo "⚠ Aucun véhicule ne correspond au company_id $referenceCtrack\n";
                echo "\nCompany IDs trouvés:\n";
                $companyIds = array_unique(array_map(fn($v) => $v['company_id'] ?? 'N/A', $vehicles));
                print_r($companyIds);
            }
        } else {
            echo "⚠ Aucun véhicule retourné\n";
        }
        
    } else {
        echo "✗ Échec de la requête\n";
        echo "Code HTTP: " . $response->status() . "\n";
        echo "Corps de la réponse:\n";
        echo $response->body() . "\n";
    }
    
} catch (Exception $e) {
    echo "✗ Erreur: " . $e->getMessage() . "\n";
    echo "Trace:\n" . $e->getTraceAsString() . "\n";
}

echo "\n=== Fin du test ===\n";
