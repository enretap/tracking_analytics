<?php

/**
 * Test API endpoints for events
 * 
 * Usage: php test-events-api.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

echo "=== Testing Event API Endpoints ===\n\n";

// 1. Check if routes are registered
echo "1. Checking registered API routes...\n";
$routes = collect(Route::getRoutes())->filter(function ($route) {
    return str_starts_with($route->uri(), 'api/events');
});

if ($routes->isEmpty()) {
    echo "❌ No API routes found for /api/events\n";
    exit(1);
}

echo "✅ Found " . $routes->count() . " event API routes:\n";
foreach ($routes as $route) {
    echo "   - {$route->methods()[0]} /{$route->uri()}\n";
}
echo "\n";

// 2. Find a user to authenticate
echo "2. Finding a user for authentication...\n";
$user = \App\Models\User::whereNotNull('account_id')->first();

if (!$user) {
    echo "❌ No user found with an account\n";
    exit(1);
}

echo "✅ Found user: {$user->name} (Account: {$user->account->name})\n\n";

// 3. Test the API endpoint (simulate authenticated request)
echo "3. Testing /api/events endpoint...\n";

// Authenticate the user
Auth::login($user);

// Create a test request
$request = Request::create('/api/events', 'GET', [
    'start_date' => '2025-12-01',
    'end_date' => '2025-12-31',
]);

// Set the authenticated user on the request
$request->setUserResolver(function () use ($user) {
    return $user;
});

try {
    $controller = new \App\Http\Controllers\Api\EventController(
        new \App\Services\EventHistoryService()
    );
    
    $response = $controller->index($request);
    $data = $response->getData(true);
    
    echo "Status: " . $response->status() . "\n";
    
    if ($response->status() === 200) {
        echo "✅ API endpoint is working!\n\n";
        
        if (isset($data['success']) && $data['success']) {
            echo "=== Response Data ===\n";
            echo "Total events: " . ($data['stats']['total_events'] ?? 0) . "\n";
            echo "Unique vehicles: " . ($data['stats']['unique_vehicles'] ?? 0) . "\n";
            
            if (!empty($data['stats']['events_by_type'])) {
                echo "\nEvents by type:\n";
                foreach ($data['stats']['events_by_type'] as $type => $count) {
                    echo "   {$type}: {$count}\n";
                }
            }
        } else {
            echo "⚠️  No events found (this is normal if there are no events in the period)\n";
        }
    } else {
        echo "❌ API returned status " . $response->status() . "\n";
        print_r($data);
    }
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}

echo "\n=== Available API Endpoints ===\n";
echo "GET  /api/events                           - Get all events\n";
echo "GET  /api/events/stats                     - Get event statistics\n";
echo "GET  /api/events/type/{eventType}          - Get events by type\n";
echo "GET  /api/events/vehicle/{vehicleRef}      - Get events by vehicle\n";
echo "\nQuery parameters:\n";
echo "  - start_date (optional): Y-m-d format\n";
echo "  - end_date (optional): Y-m-d format\n";
echo "  - event_type (optional): Filter by event type\n";
echo "  - vehicle_reference (optional): Filter by vehicle reference\n";
echo "\n=== Test completed! ===\n";
