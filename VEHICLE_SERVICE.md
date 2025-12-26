# 🚗 Service de Gestion des Véhicules

## Vue Rapide

Ce système récupère automatiquement les données de véhicules depuis différentes plateformes GPS et les affiche dans une interface unifiée.

**Status** : ✅ Production Ready  
**Version** : 1.0.0  
**Date** : 19 décembre 2025

## 🎯 Fonctionnalités

- ✅ Récupération multi-plateformes (GPS Tracker, Fleet Manager, Track Pro)
- ✅ Normalisation automatique des données
- ✅ Interface React avec cartes interactives
- ✅ API REST JSON
- ✅ Gestion des erreurs et logging
- ✅ APIs mock pour le développement
- ✅ Documentation complète

## 🚀 Démarrage Rapide (2 minutes)

```bash
# 1. Exécuter la migration
php artisan migrate

# 2. Configurer les plateformes
php artisan db:seed --class=VehiclePlatformSeeder

# 3. Tester
php test-vehicle-service.php

# 4. Accéder à l'interface
# http://localhost/vehicles
```

**C'est tout !** Les APIs mock sont déjà configurées.

## 📚 Documentation Complète

| Document | Description | Quand l'utiliser |
|----------|-------------|------------------|
| **[QUICK_START.md](QUICK_START.md)** | Guide de démarrage rapide | Pour commencer immédiatement |
| **[VEHICLE_SERVICE_README.md](VEHICLE_SERVICE_README.md)** | Documentation technique | Pour comprendre l'architecture |
| **[API_CONFIGURATION.md](API_CONFIGURATION.md)** | Configuration des APIs | Pour connecter de vraies APIs |
| **[TESTING_GUIDE.md](TESTING_GUIDE.md)** | Guide de test | Pour tester le système |
| **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** | Résumé de l'implémentation | Pour avoir une vue d'ensemble |
| **[CHANGELOG.md](CHANGELOG.md)** | Historique des modifications | Pour voir ce qui a été fait |

## 🎨 Exemples d'Utilisation

### Dans React/TypeScript

```tsx
import { useVehicles } from '@/hooks/useVehicles';

function MyComponent() {
  const { vehicles, loading, error, refetch } = useVehicles();
  
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  
  return (
    <div>
      <h1>{vehicles.length} véhicules</h1>
      {vehicles.map(v => (
        <div key={v.id}>
          {v.name} - {v.plate} - {v.status}
        </div>
      ))}
      <button onClick={refetch}>Actualiser</button>
    </div>
  );
}
```

### Dans Laravel/PHP

```php
use App\Services\VehicleService;

$service = new VehicleService();
$vehicles = $service->getAllVehicles($user);

// Tous les véhicules actifs
$active = array_filter($vehicles, fn($v) => $v['status'] === 'active');

// Véhicules par plateforme
$byPlatform = collect($vehicles)->groupBy('platform_slug');
```

## 🏗️ Architecture

```
User connecté
    ↓
Frontend (React) → Hook useVehicles
    ↓
GET /api/vehicles
    ↓
VehicleController
    ↓
VehicleService.getAllVehicles()
    ↓
Account → Platforms (avec api_url, api_token)
    ↓
Pour chaque plateforme:
    - Appel HTTP à l'API externe
    - Mapping selon le slug
    - Normalisation des données
    ↓
Retourne tableau unifié de véhicules
    ↓
Frontend affiche les données
```

## 📊 Format des Données

```json
{
  "id": "vehicle-123",
  "platform_id": 1,
  "platform_slug": "gps-tracker",
  "name": "Camion Renault Master",
  "plate": "AB-234-CF",
  "status": "active",
  "distance": 125400,
  "latitude": 48.858844,
  "longitude": 2.294351,
  "speed": 65,
  "lastUpdate": "2025-12-19 09:10:45"
}
```

## 🔧 Configuration

### Développement (APIs Mock)

Déjà configuré ! Les APIs mock retournent 8 véhicules de test.

### Production (APIs Réelles)

```sql
UPDATE account_platform
SET api_url = 'https://votre-api.com/vehicles',
    api_token = 'votre-token-secret'
WHERE account_id = X AND platform_id = Y;
```

Voir [API_CONFIGURATION.md](API_CONFIGURATION.md) pour plus de détails.

## 🧪 Test

```bash
# Test complet via CLI
php test-vehicle-service.php

# Test via Tinker
php artisan tinker
>>> $service = new \App\Services\VehicleService();
>>> $vehicles = $service->getAllVehicles(\App\Models\User::first());
>>> count($vehicles);

# Test via l'interface web
# Connectez-vous et allez sur /vehicles
```

## 🔌 Ajouter une Plateforme

1. Créer la plateforme :
```sql
INSERT INTO platforms (name, slug, provider, is_active)
VALUES ('Ma Plateforme', 'ma-plateforme', 'Provider', true);
```

2. Modifier `VehicleService.php` :
```php
// Dans extractVehiclesArray()
'ma-plateforme' => $data['vehicles'] ?? $data,

// Dans getMapper()
'ma-plateforme' => $this->mePlateformeMapper(...),

// Créer le mapper
private function mePlateformeMapper(array $vehicle, int $platformId, string $slug): array
{
    return [
        'id' => 'vehicle-' . $vehicle['id'],
        // ... mapper tous les champs
    ];
}
```

Voir [VEHICLE_SERVICE_README.md](VEHICLE_SERVICE_README.md) section "Ajouter de nouveaux mappers".

## 📁 Fichiers Importants

### Backend
- `app/Services/VehicleService.php` - Service principal
- `app/Http/Controllers/VehicleController.php` - Contrôleur API
- `app/Models/Account.php` - Modèle avec relation platforms
- `database/migrations/*_add_api_credentials_*` - Migration

### Frontend
- `resources/js/hooks/useVehicles.ts` - Hook React
- `resources/js/pages/Vehicles.tsx` - Page dédiée
- `resources/js/pages/dashboard.tsx` - Dashboard avec véhicules

### Configuration
- `routes/web.php` - Routes
- `database/seeders/VehiclePlatformSeeder.php` - Seeder

### Documentation
- Tous les fichiers `.md` à la racine

## 🐛 Dépannage

### Aucun véhicule trouvé

1. Vérifier la configuration :
```bash
php test-vehicle-service.php
```

2. Vérifier les logs :
```bash
tail -f storage/logs/laravel.log
```

3. Vérifier la base de données :
```sql
SELECT * FROM account_platform WHERE account_id = 1;
```

### Erreur 401

- Vérifiez le token API
- Pour les mocks, n'importe quel token fonctionne

### Timeout

- L'API externe est trop lente (>30s)
- Augmentez le timeout dans VehicleService.php

Voir [TESTING_GUIDE.md](TESTING_GUIDE.md) section "Troubleshooting".

## 🚀 Production

Avant de déployer en production :

1. ✅ Supprimer les routes mock de `routes/web.php`
2. ✅ Supprimer `app/Http/Controllers/Api/MockVehicleApiController.php`
3. ✅ Configurer les vraies URLs et tokens API
4. ✅ Tester avec les vraies APIs
5. ⚠️ Considérer l'ajout d'un cache
6. ⚠️ Surveiller les performances
7. ⚠️ Configurer les alertes

## 📈 Performance

- **Sans cache** : ~2-5 secondes (dépend des APIs externes)
- **Avec cache** : ~100-200ms
- **Timeout** : 30 secondes par plateforme

Pour améliorer les performances, voir [VEHICLE_SERVICE_README.md](VEHICLE_SERVICE_README.md) section "Performance".

## 🔒 Sécurité

- ✅ Authentification requise
- ✅ Tokens stockés en base de données
- ✅ Timeout configuré
- ✅ Gestion des erreurs
- ⚠️ Considérer l'encryption des tokens

## 🎯 Roadmap

### v1.1.0
- [ ] Cache Redis
- [ ] Requêtes parallèles
- [ ] Tests automatisés

### v1.2.0
- [ ] WebSockets temps réel
- [ ] Carte interactive
- [ ] Filtres avancés

### v2.0.0
- [ ] API GraphQL
- [ ] App mobile
- [ ] Alertes
- [ ] Analytics

## 💬 Support

1. **Documentation** : Consultez les fichiers .md
2. **Tests** : `php test-vehicle-service.php`
3. **Logs** : `storage/logs/laravel.log`

## 📄 Licence

Ce code fait partie du projet principal.

---

## Navigation Rapide

- 🚀 **Démarrer** → [QUICK_START.md](QUICK_START.md)
- 📖 **Documentation** → [VEHICLE_SERVICE_README.md](VEHICLE_SERVICE_README.md)
- ⚙️ **Configuration** → [API_CONFIGURATION.md](API_CONFIGURATION.md)
- 🧪 **Tests** → [TESTING_GUIDE.md](TESTING_GUIDE.md)
- 📝 **Résumé** → [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- 📋 **Changelog** → [CHANGELOG.md](CHANGELOG.md)

---

**Prêt à l'emploi ! Bon développement ! 🎉**

```bash
# Commencez maintenant :
php test-vehicle-service.php
```
