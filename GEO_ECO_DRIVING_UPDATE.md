# Mise à jour du rapport GeoEcoDriving

## Objectif
Intégrer les données de l'endpoint `/json/getEventHistoryReport` dans le template de rapport `GeoEcoDrivingTemplate.tsx` en utilisant les interfaces `VehicleEventDetail` et `VehicleEventData`, de la même manière que dans `dashboard.tsx`.

## Modifications apportées

### 1. EventHistoryService.php
**Fichier** : `app/Services/EventHistoryService.php`

#### Ajouts :
- **Méthode `clearCache()`** : Permet de vider le cache des données d'événements pour un compte spécifique
- **Système de tracking des clés de cache** : Stocke les clés de cache générées pour faciliter leur nettoyage

```php
public function clearCache(Account $account): void
{
    $pattern = "event_history_{$account->id}_*";
    
    // Clear all cache entries matching the pattern
    $cacheKeys = Cache::get('event_history_cache_keys_' . $account->id, []);
    
    foreach ($cacheKeys as $key) {
        Cache::forget($key);
    }
    
    Cache::forget('event_history_cache_keys_' . $account->id);
    
    Log::info("Event history cache cleared for account {$account->id}");
}
```

### 2. Routes web.php
**Fichier** : `routes/web.php`

#### Modification :
Séparation du cas `geo_eco_driving` des autres types de rapports d'éco-conduite pour lui permettre d'utiliser à la fois les données d'éco-conduite et les données d'événements.

**Avant** :
```php
case 'eco_driving':
case 'driver_eco_driving':
case 'geo_eco_driving':
case 'summary':
    // Utilise uniquement EcoDrivingService
    $reportData['data'] = $ecoDrivingService->fetchEcoDrivingData($user->account, $startDate, $endDate);
    break;
```

**Après** :
```php
case 'eco_driving':
case 'driver_eco_driving':
case 'summary':
    // Utilise uniquement EcoDrivingService
    $reportData['data'] = $ecoDrivingService->fetchEcoDrivingData($user->account, $startDate, $endDate);
    break;

case 'geo_eco_driving':
    // Utilise les deux services
    $ecoDrivingService = app(\App\Services\EcoDrivingService::class);
    $eventHistoryService = app(\App\Services\EventHistoryService::class);
    
    $startDate = request('start_date', '2025-12-01');
    $endDate = request('end_date', '2025-12-31');
    $forceRefresh = request('force_refresh', false);
    
    if ($forceRefresh) {
        $ecoDrivingService->clearCache($user->account);
        $eventHistoryService->clearCache($user->account);
    }
    
    $ecoData = $ecoDrivingService->fetchEcoDrivingData($user->account, $startDate, $endDate);
    $eventData = $eventHistoryService->fetchEventHistoryData($user->account, $startDate, $endDate);
    
    // Combiner les données
    $reportData['data'] = $eventData; // Données d'événements comme données principales
    $reportData['eco_data'] = $ecoData; // Données d'éco-conduite disponibles si nécessaire
    $reportData['period_start'] = $startDate;
    $reportData['period_end'] = $endDate;
    break;
```

### 3. GeoEcoDrivingTemplate.tsx
**Fichier** : `resources/js/components/reports/templates/GeoEcoDrivingTemplate.tsx`

**Aucune modification nécessaire** : Le template utilise déjà correctement les interfaces `VehicleEventDetail` et `VehicleEventData`.

Les interfaces sont déjà définies dans le fichier :
```typescript
interface VehicleEventDetail {
    id: number;
    vehicle: string;
    plate_number: string;
    reference: string;
    driver: string;
    event_time: string;
    event_name: string;
    event_type: string;
    speed: number;
    position: {
        latitude: number | null;
        longitude: number | null;
    };
    address: string;
    poi_name: string;
    is_poi: boolean;
    initiator: string | null;
    additional_info: string | null;
    comment: string | null;
    creation_date: string;
}

interface VehicleEventData {
    success: boolean;
    events: VehicleEventDetail[];
    events_by_type: Record<string, VehicleEventDetail[]>;
    events_by_name: Record<string, VehicleEventDetail[]>;
    events_by_vehicle: Record<string, {
        vehicle: string;
        plate_number: string;
        events: VehicleEventDetail[];
    }>;
    events_by_date: Record<string, VehicleEventDetail[]>;
    stats: {
        total_events: number;
        events_by_type: Record<string, number>;
        events_by_name: Record<string, number>;
        events_by_vehicle: Record<string, number>;
        unique_vehicles: number;
        date_range: {
            start: string | null;
            end: string | null;
        };
    };
    raw_total: number;
}
```

## Structure des données

### Données reçues par le template GeoEcoDrivingTemplate

Le template reçoit maintenant via `Props` :
```typescript
interface Props {
    data: VehicleEventData; // Données de l'endpoint /json/getEventHistoryReport
}
```

### Flux de données

```
┌─────────────────────────────────────────────────────────────────┐
│                        Route: /reports/{id}                     │
│                         (routes/web.php)                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Type: geo_eco_driving
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              EcoDrivingService.fetchEcoDrivingData()            │
│                           +                                     │
│          EventHistoryService.fetchEventHistoryData()            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ API Calls
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│     TARGA TELEMATICS API                                        │
│  • /json/getDailyVehicleEcoSummary (Eco data)                  │
│  • /json/getEventHistoryReport (Event data)                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Transformed data
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Inertia Response                             │
│  report: {                                                      │
│    data: VehicleEventData,                                      │
│    eco_data: EcoDrivingData,                                    │
│    period_start: string,                                        │
│    period_end: string                                           │
│  }                                                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Props
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              GeoEcoDrivingTemplate Component                    │
│  • Affiche les événements par type                             │
│  • Visualise la distribution géographique                       │
│  • Analyse les comportements à risque                           │
└─────────────────────────────────────────────────────────────────┘
```

## Utilisation

### Visualiser un rapport geo_eco_driving

1. Créer un rapport de type `geo_eco_driving` depuis l'interface
2. Le système récupérera automatiquement :
   - Les données d'éco-conduite (distance, temps de conduite, etc.)
   - Les événements (excès de vitesse, conduite de nuit, etc.)
3. Le template affichera :
   - Un graphique en donut montrant la répartition des types d'événements
   - Les statistiques par événement
   - La possibilité d'ajouter une carte géographique

### Forcer le rafraîchissement du cache

Pour forcer le rafraîchissement des données, ajouter le paramètre `force_refresh=true` :
```
/reports/{id}?force_refresh=true
```

### Spécifier une période

```
/reports/{id}?start_date=2025-01-01&end_date=2025-01-31
```

## Avantages

1. **Cohérence** : Le rapport `geo_eco_driving` utilise maintenant les mêmes services et structures de données que le dashboard
2. **Réutilisabilité** : Les interfaces TypeScript sont partagées entre les composants
3. **Maintenabilité** : Une seule source de vérité pour les données d'événements
4. **Performance** : Système de cache avec possibilité de rafraîchissement
5. **Extensibilité** : Facile d'ajouter de nouvelles visualisations ou métriques

## Tests recommandés

1. ✅ Vérifier que les données s'affichent correctement dans le rapport
2. ✅ Tester le rafraîchissement forcé du cache
3. ✅ Vérifier les différentes périodes de dates
4. ✅ S'assurer que les statistiques sont correctement calculées
5. ✅ Tester avec un compte sans données (devrait afficher un message approprié)

## Prochaines étapes possibles

1. Ajouter une carte géographique interactive montrant la localisation des événements
2. Créer des filtres pour visualiser uniquement certains types d'événements
3. Ajouter des graphiques de tendance temporelle
4. Permettre l'export des données d'événements en CSV/Excel
5. Ajouter des alertes basées sur des seuils d'événements
