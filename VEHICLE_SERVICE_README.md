# Service de Gestion des Véhicules

## Vue d'ensemble

Ce service permet de récupérer et d'unifier les données de véhicules provenant de différentes plateformes de tracking GPS via leurs APIs respectives.

## Architecture

### Backend (Laravel)

#### 1. Migration de la base de données

Une nouvelle migration ajoute les colonnes nécessaires à la table pivot `account_platform` :
- `api_url` : L'URL de l'API de la plateforme
- `api_token` : Le token d'authentification pour l'API

```bash
php artisan migrate
```

#### 2. Service VehicleService

Localisation : `app/Services/VehicleService.php`

**Méthode principale :**
```php
public function getAllVehicles(User $user): array
```

Cette méthode :
1. Récupère toutes les plateformes actives liées au compte de l'utilisateur
2. Pour chaque plateforme, effectue un appel API pour récupérer les véhicules
3. Mappe les données selon le `slug` de la plateforme
4. Retourne un tableau unifié de véhicules

**Mappers disponibles :**
- `gpsTrackerMapper` : Pour les plateformes avec slug `gps-tracker`
- `fleetManagerMapper` : Pour les plateformes avec slug `fleet-manager`
- `trackProMapper` : Pour les plateformes avec slug `track-pro`

**Format de sortie standardisé :**
```php
[
    'id' => 'vehicle-123',
    'platform_id' => 1,
    'platform_slug' => 'gps-tracker',
    'name' => 'Camion Renault Master',
    'plate' => 'AB-234-CF',
    'status' => 'active', // active, inactive, maintenance, unknown
    'distance' => 12450, // en mètres
    'latitude' => 48.858844,
    'longitude' => 2.294351,
    'speed' => 65, // en km/h
    'lastUpdate' => '2025-12-19 09:10:45',
]
```

#### 3. Contrôleur VehicleController

Localisation : `app/Http/Controllers/VehicleController.php`

**Endpoints disponibles :**

- `GET /api/vehicles` : Retourne les véhicules au format JSON
  ```json
  {
    "success": true,
    "data": [...],
    "count": 10
  }
  ```

- `GET /vehicles` : Affiche la page Inertia avec les véhicules

#### 4. Routes

Ajoutées dans `routes/web.php` :
```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/api/vehicles', [VehicleController::class, 'index']);
    Route::get('/vehicles', [VehicleController::class, 'page']);
});
```

### Frontend (React/TypeScript)

#### 1. Hook personnalisé useVehicles

Localisation : `resources/js/hooks/useVehicles.ts`

```typescript
import { useVehicles } from '@/hooks/useVehicles';

const { vehicles, loading, error, refetch } = useVehicles();
```

**Retourne :**
- `vehicles`: Tableau des véhicules
- `loading`: État de chargement
- `error`: Message d'erreur éventuel
- `refetch`: Fonction pour recharger les données

#### 2. Interface TypeScript

```typescript
interface Vehicle {
  id: string;
  platform_id: number;
  platform_slug: string;
  name: string;
  plate: string;
  status: 'active' | 'inactive' | 'maintenance' | 'unknown';
  distance: number;
  latitude: number;
  longitude: number;
  speed: number;
  lastUpdate: string;
}
```

#### 3. Composants

**Page Vehicles** : `resources/js/pages/Vehicles.tsx`
- Affiche tous les véhicules sous forme de cartes
- Permet le rafraîchissement des données
- Gère les états de chargement et d'erreur

**Dashboard** : `resources/js/pages/dashboard.tsx`
- Intègre les véhicules via le hook `useVehicles`
- Utilise les données réelles si disponibles, sinon utilise les mocks

## Configuration

### Étape 1 : Configurer les plateformes

Dans votre base de données, ajoutez vos plateformes :

```sql
INSERT INTO platforms (name, slug, is_active) VALUES
('GPS Tracker Pro', 'gps-tracker', true),
('Fleet Manager', 'fleet-manager', true),
('Track Pro', 'track-pro', true);
```

### Étape 2 : Lier les plateformes aux comptes

Pour chaque compte, ajoutez les informations API dans la table pivot :

```sql
INSERT INTO account_platform (account_id, platform_id, api_url, api_token) VALUES
(1, 1, 'https://api.gps-tracker.com/v1/vehicles', 'your-api-token-here'),
(1, 2, 'https://api.fleet-manager.com/vehicles', 'your-api-token-here');
```

### Étape 3 : Ajouter de nouveaux mappers

Pour ajouter une nouvelle plateforme :

1. Ajoutez un case dans `extractVehiclesArray()` :
```php
return match ($slug) {
    'nouvelle-plateforme' => $data['items'] ?? $data,
    // ...
};
```

2. Ajoutez un case dans `getMapper()` :
```php
return match ($slug) {
    'nouvelle-plateforme' => $this->nouvellePlateformeMapper(...),
    // ...
};
```

3. Créez le mapper :
```php
private function nouvellePlateformeMapper(array $vehicle, int $platformId, string $slug): array
{
    return [
        'id' => 'vehicle-' . $vehicle['id'],
        'platform_id' => $platformId,
        'platform_slug' => $slug,
        'name' => $vehicle['nom'],
        'plate' => $vehicle['immatriculation'],
        'status' => $this->normalizeStatus($vehicle['etat']),
        'distance' => (int) $vehicle['distance_totale'],
        'latitude' => (float) $vehicle['position']['lat'],
        'longitude' => (float) $vehicle['position']['lon'],
        'speed' => (int) $vehicle['vitesse'],
        'lastUpdate' => $this->normalizeDate($vehicle['derniere_maj']),
    ];
}
```

## Utilisation dans les pages

### Exemple simple

```tsx
import { useVehicles } from '@/hooks/useVehicles';

export default function MyPage() {
  const { vehicles, loading, error } = useVehicles();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div>
      <h1>Mes véhicules ({vehicles.length})</h1>
      {vehicles.map(vehicle => (
        <div key={vehicle.id}>
          {vehicle.name} - {vehicle.plate}
        </div>
      ))}
    </div>
  );
}
```

### Avec actualisation

```tsx
const { vehicles, loading, refetch } = useVehicles();

<Button onClick={() => refetch()}>
  Actualiser
</Button>
```

## Logs et Debugging

Les erreurs sont loguées automatiquement dans `storage/logs/laravel.log` :
- Échecs de requêtes API
- Plateformes sans credentials
- Mappers manquants

## Sécurité

- Les tokens API sont stockés dans la colonne `api_token` (type TEXT)
- Les requêtes API utilisent un timeout de 30 secondes
- L'authentification est requise pour tous les endpoints

## Performance

- Les requêtes vers les différentes plateformes sont effectuées séquentiellement
- Pensez à implémenter un système de cache si nécessaire
- Les données sont rafraîchies à chaque appel (pas de cache par défaut)

## Tests

Pour tester le service :

```bash
# Tester l'endpoint API
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost/api/vehicles

# Ou via tinker
php artisan tinker
>>> $user = User::find(1);
>>> $service = new \App\Services\VehicleService();
>>> $vehicles = $service->getAllVehicles($user);
```
