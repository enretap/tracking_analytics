<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Services\VehicleService;
use App\Models\User;

echo "Testing VehicleService with TARGA TELEMATICS...\n\n";

// Get user from account ID 2
$user = User::where('account_id', 2)->first();

if (!$user) {
    echo "❌ User not found!\n";
    exit(1);
}

echo "✓ User found: {$user->name}\n";
echo "  Account: {$user->account->name}\n\n";

// Test the service
$service = new VehicleService();

echo "Fetching vehicles...\n";

try {
    $vehicles = $service->getAllVehicles($user);
    
    echo "✓ Vehicles fetched successfully!\n\n";
    echo "Total vehicles: " . count($vehicles) . "\n\n";
    
    if (count($vehicles) > 0) {
        echo "First 3 vehicles:\n";
        foreach (array_slice($vehicles, 0, 3) as $i => $vehicle) {
            echo "\n" . ($i + 1) . ". {$vehicle['name']}\n";
            echo "   - Plate: {$vehicle['plate']}\n";
            echo "   - Status: {$vehicle['status']}\n";
            echo "   - Speed: {$vehicle['speed']} km/h\n";
            echo "   - Distance: {$vehicle['distance']} km\n";
            echo "   - Position: ({$vehicle['latitude']}, {$vehicle['longitude']})\n";
            echo "   - Last Update: {$vehicle['lastUpdate']}\n";
        }
        
        // Count by status
        echo "\n\nVehicles by status:\n";
        $statusCounts = [];
        foreach ($vehicles as $vehicle) {
            $status = $vehicle['status'];
            if (!isset($statusCounts[$status])) {
                $statusCounts[$status] = 0;
            }
            $statusCounts[$status]++;
        }
        
        foreach ($statusCounts as $status => $count) {
            echo "  - {$status}: {$count}\n";
        }
    }
    
    echo "\n✅ Test completed successfully!\n";
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\nStack trace:\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}
