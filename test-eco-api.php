<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Services\EcoDrivingService;
use App\Models\Account;

echo "Testing TARGA TELEMATICS Eco-Driving API...\n\n";

// Get account ID 5 (or change to your account ID)
$account = Account::find(2);

if (!$account) {
    echo "❌ Account not found!\n";
    exit(1);
}

echo "✓ Account found: {$account->name}\n";

// Check platform configuration
$platform = $account->platforms()
    ->where('name', 'TARGA TELEMATICS')
    ->first();

if (!$platform) {
    echo "❌ TARGA TELEMATICS platform not configured!\n";
    exit(1);
}

echo "✓ Platform found: {$platform->name}\n";
echo "  - API URL: {$platform->pivot->api_url}\n";
echo "  - Token (first 10 chars): " . substr($platform->pivot->api_token, 0, 10) . "...\n";
echo "  - Token Type: {$platform->pivot->token_type}\n";
echo "  - Token Key: {$platform->pivot->token_key}\n\n";

// Test the service
$service = new EcoDrivingService();

echo "Fetching eco-driving data...\n";

$startDate = '2025-12-01';
$endDate = '2025-12-31';

echo "  - Start Date: {$startDate}\n";
echo "  - End Date: {$endDate}\n\n";

try {
    $data = $service->fetchEcoDrivingData($account, $startDate, $endDate);
    
    echo "✓ Data fetched successfully!\n\n";
    echo "Summary:\n";
    echo "  - Total Vehicles: {$data['total_vehicles']}\n";
    echo "  - Active Vehicles: {$data['active_vehicles']}\n";
    echo "  - Total Distance: {$data['total_distance']} km\n";
    echo "  - Total Violations: {$data['total_alerts']}\n";
    echo "  - Vehicle Details Count: " . count($data['vehicle_details']) . "\n\n";
    
    if (count($data['vehicle_details']) > 0) {
        echo "First vehicle detail:\n";
        $firstVehicle = $data['vehicle_details'][0];
        echo "  - Immatriculation: {$firstVehicle['immatriculation']}\n";
        echo "  - Driver: {$firstVehicle['driver']}\n";
        echo "  - Distance: {$firstVehicle['distance']} km\n";
        echo "  - Max Speed: {$firstVehicle['max_speed']} km/h\n";
        echo "  - Driving Time: {$firstVehicle['driving_time']}\n";
        echo "  - Total Violations: {$firstVehicle['total_violations']}\n";
    }
    
    echo "\n✅ Test completed successfully!\n";
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\nStack trace:\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}
