# Guide de Test - Service de Véhicules

## APIs Mock pour le Développement

Des APIs mock ont été créées pour faciliter le développement sans dépendre d'APIs externes.

### Endpoints Mock Disponibles

1. **GPS Tracker** : `GET /mock-api/gps-tracker/vehicles`
2. **Fleet Manager** : `GET /mock-api/fleet-manager/vehicles`
3. **Track Pro** : `GET /mock-api/track-pro/units`

## Configuration pour les Tests

### Option 1 : Via le Seeder

```bash
# Exécuter le seeder pour créer les plateformes et les lier à un compte
php artisan db:seed --class=VehiclePlatformSeeder
```

Ensuite, mettez à jour les URLs pour utiliser les APIs mock :

```sql
UPDATE account_platform 
SET api_url = 'http://localhost/mock-api/gps-tracker/vehicles',
    api_token = 'test-token-123'
WHERE platform_id = (SELECT id FROM platforms WHERE slug = 'gps-tracker');

UPDATE account_platform 
SET api_url = 'http://localhost/mock-api/fleet-manager/vehicles',
    api_token = 'test-token-456'
WHERE platform_id = (SELECT id FROM platforms WHERE slug = 'fleet-manager');

UPDATE account_platform 
SET api_url = 'http://localhost/mock-api/track-pro/units',
    api_token = 'test-token-789'
WHERE platform_id = (SELECT id FROM platforms WHERE slug = 'track-pro');
```

### Option 2 : Configuration Manuelle via Tinker

```bash
php artisan tinker
```

```php
// Créer ou récupérer un compte
$account = \App\Models\Account::first();

// Créer les plateformes
$gpsTracker = \App\Models\Platform::firstOrCreate(
    ['slug' => 'gps-tracker'],
    [
        'name' => 'GPS Tracker Pro',
        'provider' => 'Mock Provider',
        'is_active' => true
    ]
);

$fleetManager = \App\Models\Platform::firstOrCreate(
    ['slug' => 'fleet-manager'],
    [
        'name' => 'Fleet Manager',
        'provider' => 'Mock Provider',
        'is_active' => true
    ]
);

$trackPro = \App\Models\Platform::firstOrCreate(
    ['slug' => 'track-pro'],
    [
        'name' => 'Track Pro',
        'provider' => 'Mock Provider',
        'is_active' => true
    ]
);

// Lier les plateformes avec les URLs mock
$account->platforms()->syncWithoutDetaching([
    $gpsTracker->id => [
        'api_url' => 'http://localhost/mock-api/gps-tracker/vehicles',
        'api_token' => 'test-token-123'
    ],
    $fleetManager->id => [
        'api_url' => 'http://localhost/mock-api/fleet-manager/vehicles',
        'api_token' => 'test-token-456'
    ],
    $trackPro->id => [
        'api_url' => 'http://localhost/mock-api/track-pro/units',
        'api_token' => 'test-token-789'
    ]
]);
```

## Tests

### 1. Tester les APIs Mock Directement

```bash
# GPS Tracker Mock
curl -H "Authorization: Bearer test-token" http://localhost/mock-api/gps-tracker/vehicles

# Fleet Manager Mock
curl -H "Authorization: Bearer test-token" http://localhost/mock-api/fleet-manager/vehicles

# Track Pro Mock
curl -H "Authorization: Bearer test-token" http://localhost/mock-api/track-pro/units
```

### 2. Tester le Service via Tinker

```bash
php artisan tinker
```

```php
// Récupérer un utilisateur
$user = \App\Models\User::first();

// Créer une instance du service
$service = new \App\Services\VehicleService();

// Récupérer tous les véhicules
$vehicles = $service->getAllVehicles($user);

// Afficher le nombre de véhicules
echo "Nombre de véhicules: " . count($vehicles) . "\n";

// Afficher les détails
foreach ($vehicles as $vehicle) {
    echo "{$vehicle['name']} ({$vehicle['plate']}) - {$vehicle['status']}\n";
}
```

### 3. Tester via l'Endpoint API

Une fois connecté dans votre application :

```bash
# Obtenir votre session cookie depuis le navigateur
# Puis tester l'endpoint

curl http://localhost/api/vehicles \
  -H "Accept: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  --cookie "laravel_session=YOUR_SESSION_COOKIE"
```

### 4. Tester via l'Interface Web

1. Connectez-vous à l'application
2. Allez sur `/vehicles` pour voir la page dédiée
3. Ou consultez le dashboard `/dashboard` qui affiche aussi les véhicules

## Données Mock Disponibles

### GPS Tracker (3 véhicules)
- Camion Renault Master (active)
- Fourgon Mercedes Sprinter (active)
- Utilitaire Peugeot Partner (maintenance)

### Fleet Manager (2 véhicules)
- Camionnette Ford Transit (online)
- Fourgon Renault Trafic (offline)

### Track Pro (3 véhicules)
- Camion Iveco Daily (online)
- Fourgon Volkswagen Crafter (online)
- Utilitaire Citroën Jumper (offline)

**Total : 8 véhicules simulés**

## Scénarios de Test

### Scénario 1 : Tous les véhicules d'un compte

```php
$user = \App\Models\User::find(1);
$service = new \App\Services\VehicleService();
$vehicles = $service->getAllVehicles($user);

// Devrait retourner 8 véhicules si les 3 plateformes sont configurées
assert(count($vehicles) === 8);
```

### Scénario 2 : Filtrer par statut

```php
$user = \App\Models\User::find(1);
$service = new \App\Services\VehicleService();
$vehicles = $service->getAllVehicles($user);

// Filtrer les véhicules actifs
$activeVehicles = array_filter($vehicles, fn($v) => $v['status'] === 'active');
echo "Véhicules actifs: " . count($activeVehicles);
```

### Scénario 3 : Véhicules par plateforme

```php
$user = \App\Models\User::find(1);
$service = new \App\Services\VehicleService();
$vehicles = $service->getAllVehicles($user);

// Grouper par plateforme
$byPlatform = [];
foreach ($vehicles as $vehicle) {
    $slug = $vehicle['platform_slug'];
    if (!isset($byPlatform[$slug])) {
        $byPlatform[$slug] = [];
    }
    $byPlatform[$slug][] = $vehicle;
}

// Afficher le résultat
foreach ($byPlatform as $slug => $vehicleList) {
    echo "$slug: " . count($vehicleList) . " véhicules\n";
}
```

### Scénario 4 : Gestion des erreurs

```php
// Tester avec une mauvaise URL
DB::table('account_platform')
    ->where('platform_id', 1)
    ->update(['api_url' => 'http://invalid-url.local/api']);

$user = \App\Models\User::find(1);
$service = new \App\Services\VehicleService();
$vehicles = $service->getAllVehicles($user);

// Le service devrait continuer avec les autres plateformes
// et logger l'erreur
```

## Tests Automatisés

Créez un test PHPUnit :

```bash
php artisan make:test VehicleServiceTest
```

Exemple de test :

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Services\VehicleService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class VehicleServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_vehicle_service_returns_vehicles()
    {
        // Créer un utilisateur avec un compte
        $user = User::factory()->create();
        
        // TODO: Setup platforms and account_platform relations
        
        $service = new VehicleService();
        $vehicles = $service->getAllVehicles($user);
        
        $this->assertIsArray($vehicles);
    }
    
    public function test_vehicle_has_required_fields()
    {
        $user = User::factory()->create();
        
        // TODO: Setup platforms
        
        $service = new VehicleService();
        $vehicles = $service->getAllVehicles($user);
        
        if (count($vehicles) > 0) {
            $vehicle = $vehicles[0];
            
            $this->assertArrayHasKey('id', $vehicle);
            $this->assertArrayHasKey('name', $vehicle);
            $this->assertArrayHasKey('plate', $vehicle);
            $this->assertArrayHasKey('status', $vehicle);
            $this->assertArrayHasKey('latitude', $vehicle);
            $this->assertArrayHasKey('longitude', $vehicle);
        }
    }
}
```

Exécuter les tests :

```bash
php artisan test
# ou
./vendor/bin/pest
```

## Monitoring et Debugging

### Activer le mode debug

Dans `.env` :
```
APP_DEBUG=true
LOG_LEVEL=debug
```

### Voir les logs en temps réel

```bash
tail -f storage/logs/laravel.log
```

### Vérifier les requêtes HTTP

Le service VehicleService log automatiquement :
- Les plateformes sans credentials
- Les erreurs de connexion API
- Les plateformes sans mapper

Recherchez dans les logs :
```bash
grep "VehicleService" storage/logs/laravel.log
```

## Performance

### Mesurer le temps d'exécution

```php
use Illuminate\Support\Facades\Log;

$start = microtime(true);

$service = new \App\Services\VehicleService();
$vehicles = $service->getAllVehicles($user);

$duration = microtime(true) - $start;
Log::info("Vehicle fetch took {$duration} seconds");
```

### Optimisation

Si vous avez beaucoup de plateformes, considérez :
1. Mettre en cache les résultats
2. Faire les requêtes en parallèle (avec Guzzle Promises)
3. Limiter le nombre de véhicules par plateforme

## Nettoyage après les Tests

```sql
-- Supprimer les données de test
DELETE FROM account_platform WHERE api_url LIKE '%mock-api%';
```

## ⚠️ Important en Production

**N'oubliez pas de :**
1. Supprimer les routes mock de `routes/web.php`
2. Supprimer le contrôleur `MockVehicleApiController.php`
3. Remplacer les URLs mock par les vraies URLs d'API
4. Utiliser de vrais tokens API
