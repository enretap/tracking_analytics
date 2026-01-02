<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Http;

echo "Testing TARGA TELEMATICS getVehicles API...\n\n";

$apiUrl = 'https://fleet.securysat.com/json/getVehicles';
$sessionId = '5eb7f54e-c913-466c-88d7-a0540fb2749a'; // Account ID 2

echo "Endpoint: {$apiUrl}\n";
echo "Session ID: " . substr($sessionId, 0, 20) . "...\n\n";

try {
    // Test with sessionId in body (POST)
    echo "Method 1: POST with sessionId in body\n";
    $response = Http::timeout(30)->post($apiUrl, [
        'sessionId' => $sessionId
    ]);
    
    if ($response->successful()) {
        $data = $response->json();
        echo "✓ Success!\n";
        echo "Response structure:\n";
        echo json_encode(array_keys($data), JSON_PRETTY_PRINT) . "\n\n";
        
        if (isset($data['vehicles']) && is_array($data['vehicles'])) {
            echo "Vehicles count: " . count($data['vehicles']) . "\n\n";
            if (count($data['vehicles']) > 0) {
                echo "First vehicle sample:\n";
                echo json_encode($data['vehicles'][0], JSON_PRETTY_PRINT) . "\n";
            }
        } else {
            echo "Full response:\n";
            echo json_encode($data, JSON_PRETTY_PRINT) . "\n";
        }
    } else {
        echo "❌ Failed with status: " . $response->status() . "\n";
        echo "Body: " . $response->body() . "\n\n";
        
        // Try with sessionId in header
        echo "Method 2: POST with sessionId in header\n";
        $response2 = Http::timeout(30)
            ->withHeaders(['sessionId' => $sessionId])
            ->post($apiUrl);
        
        if ($response2->successful()) {
            $data = $response2->json();
            echo "✓ Success with header!\n";
            echo json_encode($data, JSON_PRETTY_PRINT) . "\n";
        } else {
            echo "❌ Also failed: " . $response2->status() . "\n";
        }
    }
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
