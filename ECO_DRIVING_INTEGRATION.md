# Intégration TARGA TELEMATICS - Données d'Éco-conduite

## Vue d'ensemble

Ce document explique comment le système récupère et affiche les données d'éco-conduite depuis la plateforme TARGA TELEMATICS via l'endpoint `getDailyVehicleEcoSummary`.

## Architecture

### 1. Service Backend (`EcoDrivingService.php`)

Le service `App\Services\EcoDrivingService` gère la communication avec l'API TARGA TELEMATICS.

**Fonctionnalités principales :**
- ✅ Récupération des données via `getDailyVehicleEcoSummary`
- ✅ Authentification automatique avec le token du compte
- ✅ Mise en cache des résultats (5 minutes TTL)
- ✅ Transformation des données API vers le format `EcoDrivingData`
- ✅ Gestion des erreurs et logs détaillés

**Utilisation dans le code :**

```php
use App\Services\EcoDrivingService;

$ecoDrivingService = app(EcoDrivingService::class);
$data = $ecoDrivingService->fetchEcoDrivingData(
    $account,
    $startDate, // Format: 'Y-m-d' (optionnel)
    $endDate    // Format: 'Y-m-d' (optionnel)
);
```

### 2. Route du Dashboard

Le dashboard charge automatiquement les données lors de l'affichage :

```php
// routes/web.php
Route::get('dashboard', function () {
    $user = auth()->user();
    $account = $user->account;
    
    $ecoData = [];
    if ($account) {
        $ecoDrivingService = app(\App\Services\EcoDrivingService::class);
        $ecoData = $ecoDrivingService->fetchEcoDrivingData($account);
    }
    
    return Inertia::render('dashboard', [
        'eco_data' => $ecoData,
    ]);
});
```

### 3. API Endpoint

Un endpoint API est disponible pour récupérer les données en temps réel :

**URL:** `GET /api/eco-driving`

**Paramètres de requête :**
- `start_date` (optionnel) : Date de début au format `YYYY-MM-DD`
- `end_date` (optionnel) : Date de fin au format `YYYY-MM-DD`
- `force_refresh` (optionnel) : `true` pour forcer le rafraîchissement du cache

**Exemple de requête :**

```bash
GET /api/eco-driving?start_date=2025-12-01&end_date=2025-12-31&force_refresh=true
```

**Réponse :**

```json
{
    "success": true,
    "data": {
        "total_vehicles": 50,
        "active_vehicles": 42,
        "total_distance": 12450.5,
        "total_drivers": 35,
        "vehicle_details": [
            {
                "immatriculation": "AB-123-CD",
                "driver": "Jean Dupont",
                "max_speed": 125,
                "distance": 245.8,
                "driving_time": "8h 45min",
                "harsh_braking": 12,
                "harsh_acceleration": 8,
                "speed_violations": 5,
                "total_violations": 25
            }
        ]
    }
}
```

### 4. Hook React (`useEcoDriving`)

Un hook personnalisé facilite l'utilisation des données dans les composants React :

```typescript
import { useEcoDriving } from '@/hooks/useEcoDriving';

function MyComponent() {
    const { data, loading, error, refetch } = useEcoDriving({
        startDate: '2025-12-01',
        endDate: '2025-12-31',
        autoRefresh: true,      // Rafraîchissement automatique
        refreshInterval: 300000 // 5 minutes
    });

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error}</div>;

    return (
        <div>
            <h2>Total véhicules: {data.total_vehicles}</h2>
            <button onClick={() => refetch(true)}>
                Rafraîchir
            </button>
        </div>
    );
}
```

## Configuration Requise

### 1. Compte TARGA TELEMATICS

Le compte utilisateur doit avoir une plateforme TARGA TELEMATICS configurée avec :

**Dans la table `account_platform` :**
```sql
INSERT INTO account_platform (account_id, platform_id, api_url, api_token, token_type, token_key)
VALUES (
    1,                                          -- ID du compte
    (SELECT id FROM platforms WHERE name = 'TARGA TELEMATICS'),
    'https://fleet.securysat.com',             -- Base URL
    'VOTRE_TOKEN_API',                         -- Token du compte
    'body',                                     -- Type d'authentification
    'sessionId'                                 -- Clé du token dans le body
);
```

### 2. Mapping des Données

Le service transforme automatiquement les données de l'API TARGA vers le format `EcoDrivingData` :

| Champ TARGA                | Champ EcoDrivingData        | Description                    |
|---------------------------|----------------------------|--------------------------------|
| `vehicleName`             | `immatriculation`          | Nom/plaque du véhicule         |
| `driverName`              | `driver`                   | Nom du conducteur              |
| `distance`                | `distance`                 | Distance parcourue (km)        |
| `maxSpeed`                | `max_speed`                | Vitesse maximale (km/h)        |
| `drivingTime`             | `driving_time`             | Temps de conduite              |
| `idleTime`                | `idle_time`                | Temps au ralenti               |
| `harshBraking`            | `harsh_braking`            | Freinages brusques             |
| `harshAcceleration`       | `harsh_acceleration`       | Accélérations brusques         |
| `dangerousTurns`          | `dangerous_turns`          | Virages dangereux              |
| `speedingEvents`          | `speed_violations`         | Excès de vitesse               |
| `drivingTimeViolations`   | `driving_time_violations`  | Violations temps de conduite   |

## Format de Réponse TARGA TELEMATICS

### Requête

```json
POST https://fleet.securysat.com/json/getDailyVehicleEcoSummary

{
    "sessionId": "VOTRE_TOKEN",
    "startDate": "2025-12-01",
    "endDate": "2025-12-31"
}
```

### Réponse attendue

```json
{
    "result": {
        "data": [
            {
                "vehicleName": "AB-123-CD",
                "driverName": "Jean Dupont",
                "project": "Livraison Nord",
                "distance": 245.8,
                "maxSpeed": 125,
                "drivingTime": "8h 45min",
                "idleTime": "1h 20min",
                "harshBraking": 12,
                "harshAcceleration": 8,
                "dangerousTurns": 3,
                "speedingEvents": 5,
                "drivingTimeViolations": 2
            }
        ]
    },
    "startDate": "2025-12-01",
    "endDate": "2025-12-31"
}
```

## Utilisation dans le Dashboard

Le composant Dashboard reçoit automatiquement les données via Inertia :

```typescript
// dashboard.tsx
interface Props {
    eco_data: EcoDrivingData;
}

export default function Dashboard({ eco_data }: Props) {
    // Les données sont directement disponibles
    console.log(eco_data.total_vehicles);
    console.log(eco_data.vehicle_details);
    
    // Affichage des graphiques avec les données réelles
    return (
        <div>
            {eco_data.vehicle_details?.map((vehicle) => (
                <div key={vehicle.immatriculation}>
                    {vehicle.driver} - {vehicle.total_violations} violations
                </div>
            ))}
        </div>
    );
}
```

## Gestion du Cache

Le système met en cache les données pendant 5 minutes pour améliorer les performances :

**Clé de cache :** `eco_driving_{account_id}_{start_date}_{end_date}`

**Forcer le rafraîchissement :**

```php
// Backend
$ecoDrivingService->clearCache($account);

// Via API
GET /api/eco-driving?force_refresh=true
```

## Logs et Débogage

Le service enregistre des logs détaillés pour faciliter le débogage :

```bash
# Consulter les logs Laravel
tail -f storage/logs/laravel.log | grep "TARGA TELEMATICS"
```

**Types de logs :**
- ✅ Appels API réussis
- ⚠️ Erreurs de configuration
- ❌ Échecs de requête API
- 📊 Réponses inattendues

## Gestion des Erreurs

Le service gère gracieusement les erreurs et retourne des données vides en cas de problème :

```php
// En cas d'erreur, retourne une structure vide
[
    'total_vehicles' => 0,
    'vehicle_details' => [],
    // ...autres champs à 0
]
```

## Performance

### Optimisations implémentées :
1. ✅ **Cache** : Réduction des appels API (TTL 5 min)
2. ✅ **Timeout** : 30 secondes max par requête
3. ✅ **Lazy loading** : Données chargées à la demande
4. ✅ **Transformation efficace** : Mapping optimisé des données

### Métriques attendues :
- **Premier chargement** : ~2-5 secondes
- **Chargements suivants (avec cache)** : <100ms
- **Auto-refresh** : Toutes les 5 minutes (optionnel)

## Sécurité

- ✅ Token d'API stocké de manière sécurisée dans la BDD
- ✅ Authentification requise (`auth` middleware)
- ✅ Isolation par compte (chaque utilisateur voit uniquement ses données)
- ✅ Validation des paramètres de date
- ✅ Logs des accès API

## Prochaines Étapes

Pour étendre les fonctionnalités :

1. **Ajouter d'autres endpoints TARGA** :
   - `getEventHistoryReport` pour l'historique détaillé
   - `getStopReport` pour les arrêts

2. **Améliorer le cache** :
   - Implémenter un système de tags de cache
   - Ajouter une stratégie de cache différenciée par type de données

3. **Ajouter des webhooks** :
   - Notification en temps réel des violations
   - Alertes sur dépassements de seuils

## Support

Pour toute question ou problème :
- Consulter les logs : `storage/logs/laravel.log`
- Vérifier la configuration de la plateforme dans la BDD
- Tester l'endpoint directement avec Postman/curl
