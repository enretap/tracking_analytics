# Event History Service - Documentation

## Vue d'ensemble

Le service `EventHistoryService` permet de récupérer l'historique des événements depuis l'API TARGA TELEMATICS via l'endpoint `getEventHistoryReport`.

## Configuration

### Endpoint API

- **URL**: `https://fleet.securysat.com/json/getEventHistoryReport`
- **Méthode HTTP**: `POST`
- **Type**: Endpoint TARGA TELEMATICS

### Configuration du Seeder

L'endpoint est déjà configuré dans `ReportPlatformEndpointSeeder.php`:

```php
[
    'endpoint_path' => '/json/getEventHistoryReport',
    'http_method' => 'POST',
    'data_key' => 'events',
    'description' => 'Historique des événements du véhicule (alertes, violations, etc.)',
    'order' => 1,
    'is_required' => true,
]
```

Pour activer cette configuration:
```bash
php artisan db:seed --class=ReportPlatformEndpointSeeder
```

### Configuration du Compte

Assurez-vous que le compte a la plateforme TARGA TELEMATICS configurée dans la table `account_platform`:

```sql
-- Vérifier la configuration
SELECT 
    a.name as account,
    p.name as platform,
    ap.api_url,
    CONCAT('***', RIGHT(ap.api_token, 4)) as token
FROM accounts a
JOIN account_platform ap ON a.id = ap.account_id
JOIN platforms p ON ap.platform_id = p.id
WHERE p.name = 'TARGA TELEMATICS';
```

## Structure des Données

### Requête

```php
[
    'sessionId' => 'your-session-id',
    'startDate' => '2025-12-01',  // Format: Y-m-d
    'endDate' => '2025-12-31'      // Format: Y-m-d
]
```

### Réponse de l'API

```json
{
    "eventHistoryReportEntries": [
        {
            "id": 0,
            "vehicle": "NISSAN NAVARA AA-154-BQ",
            "reference": "350612070785660",
            "plateNumber": "AA-154-BQ",
            "satId": "350612070785660",
            "driver": " ",
            "eventTime": "2025-12-02T20:41:43.000+00:00",
            "label": null,
            "address": {
                "street": "Nzuessi",
                "streetNumber": "",
                "zipCode": "",
                "locality": null,
                "city": "Yamoussoukro",
                "country": "CI",
                "poiName": "",
                "addressRegion": null,
                "poiAndReplaceAddress": 0,
                "isPoi": false,
                "replacePoiByAddress": false,
                "poiId": 0
            },
            "poiName": "",
            "isPOI": "N",
            "eventName": "2HS_Between 20h and 04h",
            "event": "SPEED",
            "position": {
                "id": 0,
                "latitude": 6.8150883,
                "longitude": -5.2608633
            },
            "speed": 14.0,
            "assetName": null,
            "initiator": " ",
            "additionalInformation": null,
            "comment": null,
            "validationDate": null,
            "validatorName": "",
            "creationDateTime": "2025-12-02T20:41:49.000+00:00",
            "messageBody": ""
        }
    ]
}
```

### Données Transformées par le Service

```php
[
    'success' => true,
    'events' => [
        [
            'id' => 0,
            'vehicle' => 'NISSAN NAVARA AA-154-BQ',
            'plate_number' => 'AA-154-BQ',
            'reference' => '350612070785660',
            'driver' => 'Non assigné',
            'event_time' => '2025-12-02T20:41:43.000+00:00',
            'event_name' => '2HS_Between 20h and 04h',
            'event_type' => 'SPEED',
            'speed' => 14.0,
            'position' => [
                'latitude' => 6.8150883,
                'longitude' => -5.2608633
            ],
            'address' => 'Nzuessi, Yamoussoukro, CI',
            'poi_name' => '',
            'is_poi' => false,
            'initiator' => null,
            'additional_info' => null,
            'comment' => null,
            'creation_date' => '2025-12-02T20:41:49.000+00:00'
        ]
    ],
    'events_by_type' => [
        'SPEED' => [ /* array of speed events */ ]
    ],
    'events_by_vehicle' => [
        '350612070785660' => [
            'vehicle' => 'NISSAN NAVARA AA-154-BQ',
            'plate_number' => 'AA-154-BQ',
            'events' => [ /* array of events for this vehicle */ ]
        ]
    ],
    'events_by_date' => [
        '2025-12-02' => [ /* array of events for this date */ ]
    ],
    'stats' => [
        'total_events' => 5,
        'events_by_type' => ['SPEED' => 5],
        'events_by_vehicle' => ['350612070785660' => 2, ...],
        'unique_vehicles' => 4,
        'date_range' => [
            'start' => '2025-12-02T20:41:43.000+00:00',
            'end' => '2025-12-21T11:29:52.000+00:00'
        ]
    ],
    'raw_total' => 5
]
```

## Utilisation

### Méthode de Base

```php
use App\Services\EventHistoryService;
use App\Models\Account;

$service = new EventHistoryService();
$account = Account::find(1);

// Récupérer les événements des 7 derniers jours
$data = $service->fetchEventHistoryData($account);

// Avec une plage de dates spécifique
$data = $service->fetchEventHistoryData(
    account: $account,
    startDate: '2025-12-01',
    endDate: '2025-12-31'
);

// Avec des filtres additionnels
$data = $service->fetchEventHistoryData(
    account: $account,
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    filters: ['eventType' => 'SPEED']
);
```

### Filtrer par Type d'Événement

```php
$speedEvents = $service->getEventsByType(
    account: $account,
    eventType: 'SPEED',
    startDate: '2025-12-01',
    endDate: '2025-12-31'
);

// Résultat
[
    'success' => true,
    'event_type' => 'SPEED',
    'events' => [ /* filtered events */ ],
    'total' => 5
]
```

### Filtrer par Véhicule

```php
$vehicleEvents = $service->getEventsByVehicle(
    account: $account,
    vehicleReference: '350612070785660',
    startDate: '2025-12-01',
    endDate: '2025-12-31'
);

// Résultat
[
    'success' => true,
    'vehicle' => [
        'vehicle' => 'NISSAN NAVARA AA-154-BQ',
        'plate_number' => 'AA-154-BQ',
        'events' => [ /* events for this vehicle */ ]
    ]
]
```

## Utilisation avec ReportDataService

Le `EventHistoryService` fonctionne automatiquement avec le `ReportDataService` multi-endpoints :

```php
use App\Services\ReportDataService;
use App\Models\Report;
use App\Models\Account;
use App\Models\Platform;

$reportService = new ReportDataService();

// Récupérer un rapport avec tous les endpoints configurés
$report = Report::where('name', 'Rapport de Synthèse')->first();
$account = Account::find(1);
$platform = Platform::where('name', 'TARGA TELEMATICS')->first();

$data = $reportService->fetchReportData(
    report: $report,
    account: $account,
    platform: $platform,
    params: [
        'start_date' => '2025-12-01',
        'end_date' => '2025-12-31'
    ]
);

// Résultat contient les données de tous les endpoints
[
    'success' => true,
    'data' => [
        'events' => [ /* données getEventHistoryReport */ ],
        'eco_summary' => [ /* données getDailyVehicleEcoSummary */ ],
        'stops' => [ /* données getStopReport */ ]
    ],
    'errors' => [],
    'platform' => 'TARGA TELEMATICS',
    'account' => 'ORANGE CI'
]
```

## Cache

Le service utilise un cache de **5 minutes** pour éviter les appels API répétés :

```php
// Clé de cache
$cacheKey = "event_history_{$accountId}_{$startDate}_{$endDate}_{$filtersHash}";

// Forcer le rafraîchissement
Cache::forget($cacheKey);
$data = $service->fetchEventHistoryData($account, $startDate, $endDate);
```

## Tests

### Test du Service

```bash
php test-event-history-service.php
```

### Test Direct de l'API

```bash
php test-event-api-direct.php
```

### Avec Artisan Tinker

```php
php artisan tinker

$service = new App\Services\EventHistoryService();
$account = App\Models\Account::find(1);
$data = $service->fetchEventHistoryData($account, '2025-12-01', '2025-12-31');
print_r($data['stats']);
```

## Types d'Événements

Exemples de types d'événements retournés par l'API :

- `SPEED` - Excès de vitesse
- `HARSH_ACCELERATION` - Accélération brusque
- `HARSH_BRAKING` - Freinage brusque
- `HARSH_CORNERING` - Virage brusque
- `IDLE` - Ralenti excessif
- `GEOFENCE` - Entrée/Sortie de zone
- Et autres selon la configuration TARGA TELEMATICS

## Logs

Les logs sont disponibles dans `storage/logs/laravel.log` :

```bash
# Voir les derniers logs
tail -f storage/logs/laravel.log

# Ou avec PowerShell
Get-Content storage\logs\laravel.log -Tail 50
```

## Dépannage

### Aucun événement retourné

1. Vérifier que la plage de dates contient des événements
2. Vérifier les credentials dans `account_platform`
3. Vérifier les logs pour les erreurs API
4. Tester avec l'API directement via `test-event-api-direct.php`

### Erreur de connexion API

1. Vérifier que l'URL est correcte: `https://fleet.securysat.com`
2. Vérifier que le sessionId est valide
3. Augmenter le timeout si nécessaire (30s par défaut)

### Cache obsolète

```php
// Vider tout le cache des événements
Cache::flush();

// Ou spécifiquement pour un compte
Cache::forget("event_history_{$accountId}_{$startDate}_{$endDate}_" . md5(json_encode($filters)));
```

## Fichiers Créés

- `app/Services/EventHistoryService.php` - Service principal
- `test-event-history-service.php` - Tests du service
- `test-event-api-direct.php` - Tests directs de l'API
- `EVENT_HISTORY_SERVICE.md` - Cette documentation

## Intégration dans le Dashboard

Le service peut être intégré dans le dashboard via un nouveau composant ou une route API :

```php
// Dans routes/web.php ou routes/api.php
Route::get('/api/events', function(Request $request) {
    $account = Auth::user()->account;
    $service = new \App\Services\EventHistoryService();
    
    return $service->fetchEventHistoryData(
        account: $account,
        startDate: $request->input('start_date'),
        endDate: $request->input('end_date')
    );
});
```

## Prochaines Étapes

1. Ajouter un contrôleur dédié pour les événements
2. Créer des composants React/Vue pour afficher les événements
3. Ajouter des filtres avancés (type, véhicule, zone, etc.)
4. Créer des visualisations (graphiques, cartes, etc.)
5. Ajouter l'export en PDF/Excel
