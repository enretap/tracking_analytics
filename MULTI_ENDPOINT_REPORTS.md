# Configuration des Endpoints Multiples par Rapport

## Vue d'ensemble

Ce système permet de configurer **plusieurs endpoints API** pour chaque rapport sur chaque plateforme. Cela est nécessaire lorsqu'un rapport nécessite de combiner des données provenant de plusieurs sources API.

## Cas d'usage : Rapport de Synthèse avec TARGE TELEMATICS

### Contexte

Le **Rapport de Synthèse** pour le compte **APM** sur la plateforme **TARGE TELEMATICS** nécessite de récupérer des données depuis 3 endpoints différents :

1. **getEventHistoryReport** : Historique des événements
2. **getDailyVehicleEcoSummary** : Résumé de l'éco-conduite
3. **getStopReport** : Rapport des arrêts

Toutes ces routes partagent :
- La même **base URL** : `https://fleet.securysat.com`
- Le même **token d'authentification** (configuré dans `account_platform`)

Mais chaque endpoint a :
- Son propre **chemin** (ex: `/json/getEventHistoryReport`)
- Sa propre **clé de données** (ex: `events`, `eco_summary`, `stops`)
- Ses propres **paramètres additionnels**

## Architecture

### 1. Table `report_platform_endpoints`

Cette table lie les rapports aux plateformes avec les configurations d'endpoints spécifiques.

```sql
CREATE TABLE report_platform_endpoints (
    id BIGINT PRIMARY KEY,
    report_id BIGINT,  -- Le rapport (ex: "Rapport de Synthèse")
    platform_id BIGINT,  -- La plateforme (ex: "TARGE TELEMATICS")
    endpoint_path VARCHAR(255),  -- Chemin relatif (ex: "/json/getEventHistoryReport")
    http_method VARCHAR(10),  -- GET ou POST
    data_key VARCHAR(100),  -- Clé pour identifier les données (ex: "events")
    additional_params TEXT,  -- JSON avec paramètres supplémentaires
    order INT,  -- Ordre d'exécution
    is_required BOOLEAN,  -- Si l'endpoint est obligatoire pour le rapport
    description TEXT,  -- Description de l'endpoint
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 2. Relations entre les modèles

```
Report (Rapport de Synthèse)
  ↓ hasMany
ReportPlatformEndpoint (3 endpoints)
  ↓ belongsTo
Platform (TARGE TELEMATICS)
```

```
Account (APM)
  ↓ belongsToMany (account_platform)
Platform (TARGE TELEMATICS)
  → Configuration globale : base URL + token
```

### 3. Service `ReportDataService`

Ce service gère la récupération des données :

1. Récupère la configuration de base (URL + token) depuis `account_platform`
2. Récupère tous les endpoints configurés pour le rapport sur cette plateforme
3. Exécute chaque requête dans l'ordre défini
4. Agrège les résultats avec leurs clés respectives

## Installation et Configuration

### Étape 1 : Exécuter les migrations

```bash
php artisan migrate
```

### Étape 2 : Configurer les endpoints pour votre rapport

```bash
php artisan db:seed --class=ReportPlatformEndpointSeeder
```

Ou manuellement en SQL :

```sql
-- 1. Créer le rapport (si nécessaire)
INSERT INTO reports (name, description, type, is_enabled, created_at, updated_at)
VALUES ('Rapport de Synthèse', 'Rapport synthétique complet', 'summary', true, NOW(), NOW());

-- 2. Créer la plateforme (si nécessaire)
INSERT INTO platforms (name, slug, provider, is_active, created_at, updated_at)
VALUES ('TARGE TELEMATICS', 'targe-telematics', 'Securysat', true, NOW(), NOW());

-- 3. Configurer les endpoints
INSERT INTO report_platform_endpoints 
(report_id, platform_id, endpoint_path, http_method, data_key, description, `order`, is_required, created_at, updated_at)
VALUES 
(
    (SELECT id FROM reports WHERE name = 'Rapport de Synthèse'),
    (SELECT id FROM platforms WHERE slug = 'targe-telematics'),
    '/json/getEventHistoryReport',
    'POST',
    'events',
    'Historique des événements',
    1,
    true,
    NOW(),
    NOW()
),
(
    (SELECT id FROM reports WHERE name = 'Rapport de Synthèse'),
    (SELECT id FROM platforms WHERE slug = 'targe-telematics'),
    '/json/getDailyVehicleEcoSummary',
    'POST',
    'eco_summary',
    'Résumé éco-conduite',
    2,
    true,
    NOW(),
    NOW()
),
(
    (SELECT id FROM reports WHERE name = 'Rapport de Synthèse'),
    (SELECT id FROM platforms WHERE slug = 'targe-telematics'),
    '/json/getStopReport',
    'POST',
    'stops',
    'Rapport des arrêts',
    3,
    false,
    NOW(),
    NOW()
);
```

### Étape 3 : Configurer l'URL de base et le token pour le compte

```sql
-- Configuration dans account_platform
INSERT INTO account_platform (account_id, platform_id, api_url, api_token, created_at, updated_at)
VALUES (
    (SELECT id FROM accounts WHERE name = 'APM'),
    (SELECT id FROM platforms WHERE slug = 'targe-telematics'),
    'https://fleet.securysat.com',  -- Base URL (sans le chemin)
    'votre-token-api-ici',
    NOW(),
    NOW()
);
```

### Étape 4 : Tester le service

```bash
php test-report-data-service.php
```

## Utilisation dans le code

### Exemple simple

```php
use App\Services\ReportDataService;
use App\Models\Report;
use App\Models\Account;
use App\Models\Platform;

$service = new ReportDataService();

$report = Report::where('name', 'Rapport de Synthèse')->first();
$account = Account::where('name', 'APM')->first();
$platform = Platform::where('slug', 'targe-telematics')->first();

$params = [
    'start_date' => '2025-12-01',
    'end_date' => '2025-12-24',
    'vehicle_id' => 'VEH001',
];

$result = $service->fetchReportData($report, $account, $platform, $params);

if ($result['success']) {
    $events = $result['data']['events'];
    $ecoSummary = $result['data']['eco_summary'];
    $stops = $result['data']['stops'];
    
    // Traiter les données...
}
```

### Structure de la réponse

```php
[
    'success' => true,
    'data' => [
        'events' => [/* données de getEventHistoryReport */],
        'eco_summary' => [/* données de getDailyVehicleEcoSummary */],
        'stops' => [/* données de getStopReport */],
    ],
    'errors' => [
        // Erreurs non bloquantes (endpoints avec is_required = false)
    ],
    'platform' => 'TARGE TELEMATICS',
    'account' => 'APM',
]
```

### Utilisation dans un contrôleur

```php
use App\Services\ReportDataService;

class ReportController extends Controller
{
    protected $reportDataService;
    
    public function __construct(ReportDataService $reportDataService)
    {
        $this->reportDataService = $reportDataService;
    }
    
    public function generate(Request $request)
    {
        $user = $request->user();
        $report = Report::find($request->report_id);
        $platform = Platform::find($request->platform_id);
        
        $result = $this->reportDataService->fetchReportData(
            $report,
            $user->account,
            $platform,
            $request->all()
        );
        
        if (!$result['success']) {
            return response()->json(['error' => $result['error']], 500);
        }
        
        // Passer les données au template
        return Inertia::render('reports/View', [
            'reportData' => $result['data'],
        ]);
    }
}
```

## Récupération depuis plusieurs plateformes

Si un compte a plusieurs plateformes configurées pour le même rapport :

```php
$platformIds = [1, 2, 3]; // TARGE TELEMATICS, GPS Tracker, etc.

$results = $service->fetchFromMultiplePlatforms(
    $report,
    $account,
    $platformIds,
    $params
);

// Résultat :
[
    'targe-telematics' => [
        'success' => true,
        'data' => [...],
    ],
    'gps-tracker' => [
        'success' => true,
        'data' => [...],
    ],
]
```

## Gestion des erreurs

### Endpoints obligatoires vs optionnels

- **is_required = true** : Si l'endpoint échoue, tout le rapport échoue
- **is_required = false** : L'erreur est enregistrée mais ne bloque pas le rapport

### Exemple

```php
// getEventHistoryReport est requis
is_required = true

// getStopReport est optionnel (bonus)
is_required = false
```

Si `getStopReport` échoue, le rapport sera quand même généré avec les données de `events` et `eco_summary`.

## Paramètres additionnels par endpoint

Chaque endpoint peut avoir ses propres paramètres via `additional_params` :

```sql
UPDATE report_platform_endpoints
SET additional_params = '{"min_duration": 300, "format": "json"}'
WHERE data_key = 'stops';
```

Ces paramètres sont automatiquement ajoutés à la requête.

## Ordre d'exécution

Les endpoints sont exécutés dans l'ordre défini par la colonne `order` :

```
1. events (order: 1)
2. eco_summary (order: 2)
3. stops (order: 3)
```

Cela permet de gérer les dépendances si nécessaire.

## Avantages de cette architecture

✅ **Flexible** : Chaque rapport peut avoir ses propres endpoints  
✅ **Réutilisable** : Les credentials (URL + token) sont partagés  
✅ **Maintenable** : Facile d'ajouter ou retirer des endpoints  
✅ **Robuste** : Gestion des erreurs avec endpoints optionnels  
✅ **Scalable** : Support de multiples plateformes par rapport  

## Prochaines étapes

1. ✅ Migration et modèles créés
2. ✅ Service de récupération de données
3. ✅ Seeder avec exemple TARGE TELEMATICS
4. ⏳ Interface web pour gérer les endpoints (optionnel)
5. ⏳ Intégration dans le système de génération de rapports
