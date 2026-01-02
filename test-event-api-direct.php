<?php

/**
 * Direct API test for getEventHistoryReport endpoint
 * Tests the raw API call to TARGA TELEMATICS
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Http;

echo "=== Direct TARGA TELEMATICS API Test ===\n\n";

// Configuration
$apiUrl = 'https://fleet.securysat.com';
$endpoint = '/json/getEventHistoryReport';

// Get session ID from account
$account = \App\Models\Account::find(1);
if (!$account) {
    echo "❌ Account not found\n";
    exit(1);
}

$platform = $account->platforms()->where('name', 'TARGA TELEMATICS')->first();
if (!$platform) {
    echo "❌ TARGA TELEMATICS platform not found\n";
    exit(1);
}

$sessionId = $platform->pivot->api_token;

echo "Testing endpoint: {$apiUrl}{$endpoint}\n";
echo "Session ID: ***" . substr($sessionId, -4) . "\n\n";

// Test with the exact dates from your example (December 2025)
$startDate = '2025-12-02'; // First event date
$endDate = '2025-12-21';   // Last event date

echo "Date range: {$startDate} to {$endDate}\n";
echo "Making API request...\n\n";

$payload = [
    'sessionId' => $sessionId,
    'startDate' => $startDate,
    'endDate' => $endDate,
];

try {
    $response = Http::timeout(30)->post($apiUrl . $endpoint, $payload);
    
    echo "Status Code: " . $response->status() . "\n";
    
    if ($response->failed()) {
        echo "❌ Request failed\n";
        echo "Response: " . $response->body() . "\n";
        exit(1);
    }
    
    $data = $response->json();
    
    if ($data === null) {
        echo "❌ Invalid JSON response\n";
        echo "Response: " . $response->body() . "\n";
        exit(1);
    }
    
    echo "✅ Request successful!\n\n";
    
    // Display response structure
    echo "=== Response Structure ===\n";
    echo "Keys: " . implode(', ', array_keys($data)) . "\n\n";
    
    // Display events
    if (isset($data['eventHistoryReportEntries'])) {
        $events = $data['eventHistoryReportEntries'];
        echo "Total events: " . count($events) . "\n\n";
        
        if (count($events) > 0) {
            echo "=== Sample Events (First 3) ===\n";
            foreach (array_slice($events, 0, 3) as $index => $event) {
                echo "\nEvent " . ($index + 1) . ":\n";
                echo "   Vehicle: {$event['vehicle']} ({$event['plateNumber']})\n";
                echo "   Event: {$event['eventName']} ({$event['event']})\n";
                echo "   Time: {$event['eventTime']}\n";
                echo "   Speed: {$event['speed']} km/h\n";
                echo "   City: {$event['address']['city']}\n";
            }
            
            echo "\n✅ API is working correctly!\n";
        } else {
            echo "⚠️  No events in response\n";
        }
    } else {
        echo "⚠️  'eventHistoryReportEntries' key not found in response\n";
        echo "Response: " . json_encode($data, JSON_PRETTY_PRINT) . "\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Exception: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}
