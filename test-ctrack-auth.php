<?php

require __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\Http;

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Test d'authentification CTRACK ===\n\n";

$apiUrl = 'https://comafrique-ctrack.online/api/units/list';
$token = 'VOTRE_TOKEN_ICI'; // Remplacer par le vrai token complet

echo "URL: $apiUrl\n";
echo "Token: $token\n\n";

// Test 1: Bearer Token (méthode actuelle)
echo "Test 1: Authorization Bearer Token\n";
echo "-----------------------------------\n";
try {
    $response = Http::timeout(30)
        ->withToken($token)
        ->get($apiUrl);
    
    echo "Status: " . $response->status() . "\n";
    echo "Headers: " . json_encode($response->headers(), JSON_PRETTY_PRINT) . "\n";
    
    if ($response->successful()) {
        echo "✓ Succès!\n";
        $data = $response->json();
        echo "Type de réponse: " . gettype($data) . "\n";
        echo "Nombre de véhicules: " . (is_array($data) ? count($data['data'] ?? $data) : 'N/A') . "\n";
    } else {
        echo "✗ Échec\n";
        $body = substr($response->body(), 0, 500);
        echo "Corps (premiers 500 caractères): $body\n";
    }
} catch (Exception $e) {
    echo "✗ Erreur: " . $e->getMessage() . "\n";
}

echo "\n\n";

// Test 2: API Key dans les headers
echo "Test 2: X-API-Key Header\n";
echo "------------------------\n";
try {
    $response = Http::timeout(30)
        ->withHeaders([
            'X-API-Key' => $token,
            'Accept' => 'application/json',
        ])
        ->get($apiUrl);
    
    echo "Status: " . $response->status() . "\n";
    
    if ($response->successful()) {
        echo "✓ Succès!\n";
        $data = $response->json();
        echo "Type de réponse: " . gettype($data) . "\n";
        echo "Nombre de véhicules: " . (is_array($data) ? count($data['data'] ?? $data) : 'N/A') . "\n";
    } else {
        echo "✗ Échec\n";
        $body = substr($response->body(), 0, 500);
        echo "Corps (premiers 500 caractères): $body\n";
    }
} catch (Exception $e) {
    echo "✗ Erreur: " . $e->getMessage() . "\n";
}

echo "\n\n";

// Test 3: Token dans l'URL
echo "Test 3: Token dans l'URL (query parameter)\n";
echo "--------------------------------------------\n";
try {
    $response = Http::timeout(30)
        ->get($apiUrl, ['api_token' => $token]);
    
    echo "Status: " . $response->status() . "\n";
    
    if ($response->successful()) {
        echo "✓ Succès!\n";
        $data = $response->json();
        echo "Type de réponse: " . gettype($data) . "\n";
        echo "Nombre de véhicules: " . (is_array($data) ? count($data['data'] ?? $data) : 'N/A') . "\n";
    } else {
        echo "✗ Échec\n";
        $body = substr($response->body(), 0, 500);
        echo "Corps (premiers 500 caractères): $body\n";
    }
} catch (Exception $e) {
    echo "✗ Erreur: " . $e->getMessage() . "\n";
}

echo "\n\n";

// Test 4: Authorization header avec format différent
echo "Test 4: Authorization: Token\n";
echo "----------------------------\n";
try {
    $response = Http::timeout(30)
        ->withHeaders([
            'Authorization' => 'Token ' . $token,
            'Accept' => 'application/json',
        ])
        ->get($apiUrl);
    
    echo "Status: " . $response->status() . "\n";
    
    if ($response->successful()) {
        echo "✓ Succès!\n";
        $data = $response->json();
        echo "Type de réponse: " . gettype($data) . "\n";
        echo "Nombre de véhicules: " . (is_array($data) ? count($data['data'] ?? $data) : 'N/A') . "\n";
    } else {
        echo "✗ Échec\n";
        $body = substr($response->body(), 0, 500);
        echo "Corps (premiers 500 caractères): $body\n";
    }
} catch (Exception $e) {
    echo "✗ Erreur: " . $e->getMessage() . "\n";
}

echo "\n=== Fin des tests ===\n";
