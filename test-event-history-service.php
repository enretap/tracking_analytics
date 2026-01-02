<?php

/**
 * Test script for EventHistoryService
 * 
 * This script tests the new EventHistoryService that fetches event history data
 * from TARGA TELEMATICS API (getEventHistoryReport endpoint)
 * 
 * Usage: php test-event-history-service.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Services\EventHistoryService;
use App\Models\Account;
use Illuminate\Support\Facades\Log;

echo "=== TARGA TELEMATICS - Event History Service Test ===\n\n";

// 1. Find an account with TARGA TELEMATICS configured
echo "1. Searching for account with TARGA TELEMATICS platform...\n";

$account = Account::whereHas('platforms', function ($query) {
    $query->where('platforms.name', 'TARGA TELEMATICS');
})->first();

if (!$account) {
    echo "❌ No account found with TARGA TELEMATICS platform configured.\n";
    echo "\nPlease configure an account with:\n";
    echo "   1. Créer ou utiliser un compte existant\n";
    echo "   2. Lier la plateforme 'TARGA TELEMATICS'\n";
    echo "   3. Configurer api_url='https://fleet.securysat.com'\n";
    echo "   4. Configurer api_token avec votre sessionId\n";
    exit(1);
}

echo "✅ Found account: {$account->name} (ID: {$account->id})\n\n";

// 2. Check platform configuration
echo "2. Checking platform configuration...\n";
$platform = $account->platforms()
    ->where('platforms.name', 'TARGA TELEMATICS')
    ->first();

if (!$platform) {
    echo "❌ TARGA TELEMATICS platform not found for this account\n";
    exit(1);
}

$apiUrl = $platform->pivot->api_url ?? null;
$apiToken = $platform->pivot->api_token ?? null;

echo "   Platform: {$platform->name}\n";
echo "   API URL: " . ($apiUrl ?: 'NOT CONFIGURED') . "\n";
echo "   API Token: " . ($apiToken ? '***' . substr($apiToken, -4) : 'NOT CONFIGURED') . "\n\n";

if (!$apiUrl || !$apiToken) {
    echo "❌ Missing API credentials. Please configure api_url and api_token in account_platform table.\n";
    exit(1);
}

// 3. Test EventHistoryService
echo "3. Testing EventHistoryService...\n\n";

$service = new EventHistoryService();

// Test with last 7 days (recent period more likely to have events)
$startDate = now()->subDays(7)->format('Y-m-d');
$endDate = now()->format('Y-m-d');

echo "   Date range: {$startDate} to {$endDate}\n";
echo "   Fetching event history data...\n\n";

// Disable caching for testing
\Illuminate\Support\Facades\Cache::forget("event_history_{$account->id}_{$startDate}_{$endDate}_" . md5(json_encode([])));

try {
    $result = $service->fetchEventHistoryData($account, $startDate, $endDate);
    
    if (!$result['success']) {
        echo "⚠️  No events found for the specified period\n";
        echo "   This is normal if there were no events during this period.\n";
        echo "   You can try with a different date range.\n\n";
        
        // Test with a specific date range that has events
        echo "   Trying with December 2025 date range...\n";
        $startDate = '2025-12-01';
        $endDate = '2025-12-31';
        
        \Illuminate\Support\Facades\Cache::forget("event_history_{$account->id}_{$startDate}_{$endDate}_" . md5(json_encode([])));
        $result = $service->fetchEventHistoryData($account, $startDate, $endDate);
        
        if (!$result['success']) {
            echo "❌ Still no events found. The platform may not have event data available.\n";
            exit(0); // Exit gracefully, not an error
        }
    }
    
    echo "✅ Successfully fetched event history data!\n\n";
    
    // Display statistics
    echo "=== Statistics ===\n";
    echo "Total events: {$result['stats']['total_events']}\n";
    echo "Unique vehicles: {$result['stats']['unique_vehicles']}\n";
    echo "Date range: " . ($result['stats']['date_range']['start'] ?? 'N/A') . " to " . ($result['stats']['date_range']['end'] ?? 'N/A') . "\n\n";
    
    // Display events by type
    echo "=== Events by Type ===\n";
    foreach ($result['stats']['events_by_type'] as $type => $count) {
        echo "   {$type}: {$count} events\n";
    }
    echo "\n";
    
    // Display events by vehicle
    echo "=== Events by Vehicle (Top 5) ===\n";
    $vehicleStats = $result['stats']['events_by_vehicle'];
    arsort($vehicleStats);
    $topVehicles = array_slice($vehicleStats, 0, 5, true);
    foreach ($topVehicles as $vehicleRef => $count) {
        $vehicleInfo = $result['events_by_vehicle'][$vehicleRef] ?? null;
        $vehicleName = $vehicleInfo ? $vehicleInfo['vehicle'] : $vehicleRef;
        echo "   {$vehicleName}: {$count} events\n";
    }
    echo "\n";
    
    // Display sample events
    echo "=== Sample Events (First 5) ===\n";
    $sampleEvents = array_slice($result['events'], 0, 5);
    foreach ($sampleEvents as $index => $event) {
        echo "Event " . ($index + 1) . ":\n";
        echo "   Vehicle: {$event['vehicle']} ({$event['plate_number']})\n";
        echo "   Event: {$event['event_name']} ({$event['event_type']})\n";
        echo "   Time: {$event['event_time']}\n";
        echo "   Speed: {$event['speed']} km/h\n";
        echo "   Location: {$event['address']}\n";
        echo "   Driver: {$event['driver']}\n";
        echo "\n";
    }
    
    // Test getEventsByType
    echo "=== Testing getEventsByType('SPEED') ===\n";
    $speedEvents = $service->getEventsByType($account, 'SPEED', $startDate, $endDate);
    if ($speedEvents['success']) {
        echo "✅ Found {$speedEvents['total']} SPEED events\n\n";
    } else {
        echo "❌ Failed to get SPEED events\n\n";
    }
    
    // Test getEventsByVehicle (use first vehicle)
    if (!empty($result['events_by_vehicle'])) {
        $firstVehicleRef = array_key_first($result['events_by_vehicle']);
        $firstVehicle = $result['events_by_vehicle'][$firstVehicleRef];
        
        echo "=== Testing getEventsByVehicle('{$firstVehicleRef}') ===\n";
        $vehicleEvents = $service->getEventsByVehicle($account, $firstVehicleRef, $startDate, $endDate);
        if ($vehicleEvents['success']) {
            $eventsCount = count($vehicleEvents['vehicle']['events']);
            echo "✅ Found {$eventsCount} events for vehicle {$firstVehicle['vehicle']}\n\n";
        } else {
            echo "❌ Failed to get events for vehicle\n\n";
        }
    }
    
    echo "=== Test completed successfully! ===\n";
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}
