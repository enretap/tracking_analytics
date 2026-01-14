# Intégration de l'Endpoint CTRACK EcoDriving

## 📋 Vue d'ensemble

Ce document décrit l'intégration de l'endpoint **EcoDriving** de CTRACK dans le système de rapports multi-endpoints.

## 🔗 Endpoint

- **URL**: `https://comafrique-ctrack.online/api/units/ecoDriving`
- **Méthode HTTP**: `GET`
- **Authentification**: Bearer Token
- **Paramètres**:
  - `begin`: Date de début (format: `dd/mm/yyyy`, ex: `01/09/2026`)
  - `end`: Date de fin (format: `dd/mm/yyyy`, ex: `01/09/2026`)

## 📊 Structure de la Réponse

L'API retourne un tableau d'objets avec les données d'éco-conduite par véhicule :

```json
[
    {
        "immatriculation": "CEDRIC",
        "driver": "CEDRIC EGNANKOU",
        "project": null,
        "max_speed": 84,
        "distance": 62.14,
        "driving_time": 6361,
        "idle_time": 161,
        "harsh_braking": 0,
        "harsh_acceleration": 0,
        "dangerous_turns": 0,
        "speed_violations": 1,
        "driving_time_violations": 0,
        "total_violations": 1
    }
]
```

### Champs

| Champ | Type | Description |
|-------|------|-------------|
| `immatriculation` | string | Numéro d'immatriculation du véhicule |
| `driver` | string/null | Nom du conducteur |
| `project` | string/null | Projet associé |
| `max_speed` | integer | Vitesse maximale atteinte (km/h) |
| `distance` | float | Distance parcourue (km) |
| `driving_time` | integer | Temps de conduite (secondes) |
| `idle_time` | integer | Temps à l'arrêt moteur allumé (secondes) |
| `harsh_braking` | integer | Nombre de freinages brusques |
| `harsh_acceleration` | integer | Nombre d'accélérations brusques |
| `dangerous_turns` | integer | Nombre de virages dangereux |
| `speed_violations` | integer | Nombre d'excès de vitesse |
| `driving_time_violations` | integer | Violations de temps de conduite |
| `total_violations` | integer | Total des violations |

## 🏗️ Architecture

### 1. Service créé

**Fichier**: `app/Services/CtrackEcoDrivingService.php`

Ce service gère:
- Récupération des données depuis l'API CTRACK
- Transformation des données au format standard
- Mise en cache (TTL: 5 minutes)
- Gestion des erreurs

**Méthodes principales**:
- `fetchEcoDrivingData(Account $account, ?string $startDate, ?string $endDate): array`
- `clearCache(Account $account): void`

### 2. Configuration dans le Seeder

**Fichier**: `database/seeders/ReportPlatformEndpointSeeder.php`

L'endpoint a été ajouté pour la plateforme CTRACK :

```php
[
    'endpoint_path' => '/api/units/ecoDriving',
    'http_method' => 'GET',
    'data_key' => 'eco_driving',
    'description' => 'Données d\'éco-conduite CTRACK avec violations et métriques de conduite',
    'order' => 1,
    'is_required' => true,
]
```

## 📝 Configuration

### Étape 1: Exécuter le Seeder

```bash
php artisan db:seed --class=ReportPlatformEndpointSeeder
```

Cela va:
- Créer/mettre à jour la plateforme CTRACK
- Configurer l'endpoint EcoDriving pour le "Rapport de Synthèse"

### Étape 2: Configurer les Credentials API

Dans la table `account_platform`, configurez:

```sql
-- Exemple pour un compte
INSERT INTO account_platform (account_id, platform_id, api_url, api_token, created_at, updated_at)
VALUES (
    1,  -- ID du compte
    (SELECT id FROM platforms WHERE slug = 'ctrack'),
    'https://comafrique-ctrack.online',
    'VOTRE_TOKEN_CTRACK',
    NOW(),
    NOW()
);
```

Ou via l'interface web : `/settings/platform-api`

### Étape 3: Tester l'Intégration

```bash
php test-ctrack-eco-driving.php
```

Le script de test va:
1. Vérifier la configuration
2. Récupérer les données d'aujourd'hui
3. Récupérer les données sur 7 jours
4. Tester le système de cache

## 🔍 Utilisation

### Via le Service Directement

```php
use App\Services\CtrackEcoDrivingService;
use App\Models\Account;

$service = new CtrackEcoDrivingService();
$account = Account::find(1);

// Données d'aujourd'hui
$data = $service->fetchEcoDrivingData($account);

// Données pour une période spécifique
$data = $service->fetchEcoDrivingData(
    $account, 
    '01/01/2026',  // Date début (format dd/mm/yyyy)
    '31/01/2026'   // Date fin (format dd/mm/yyyy)
);

// Résultat
echo "Total véhicules: {$data['total_vehicles']}\n";
echo "Distance totale: {$data['total_distance']} km\n";
echo "Violations: {$data['total_alerts']}\n";
```

### Via le Système de Rapports Multi-Endpoints

L'endpoint sera automatiquement appelé lors de la génération du "Rapport de Synthèse" pour les comptes ayant CTRACK configuré.

Les données seront disponibles sous la clé `eco_driving` dans le résultat du rapport.

## 📦 Données Transformées

Le service transforme les données CTRACK en un format standardisé:

```php
[
    // Métriques de flotte
    'total_vehicles' => 16,
    'active_vehicles' => 10,
    'inactive_vehicles' => 6,
    'total_distance' => 203.93,
    
    // Métriques conducteurs
    'total_drivers' => 12,
    'active_drivers' => 12,
    'average_driver_score' => 93.75,
    
    // Métriques opérationnelles
    'total_trips' => 10,
    'average_trip_distance' => 20.39,
    'operating_hours' => 16.63,
    
    // Alertes
    'total_alerts' => 3,
    'critical_alerts' => 0,
    'compliance_rate' => 98.13,
    
    // Détails par véhicule
    'vehicle_details' => [
        [
            'immatriculation' => 'CEDRIC',
            'driver' => 'CEDRIC EGNANKOU',
            'max_speed' => 84,
            'distance' => 62.14,
            'driving_time' => 6361,
            'total_violations' => 1,
            // ...
        ]
    ]
]
```

## 🔧 Différences avec TARGA TELEMATICS

| Aspect | CTRACK | TARGA TELEMATICS |
|--------|--------|------------------|
| **Format de date** | `dd/mm/yyyy` | `yyyy-mm-dd` |
| **Méthode HTTP** | GET (query params) | POST (body) |
| **Auth param** | Bearer Token | `sessionId` dans body |
| **Structure retour** | Array direct | Object avec clés |
| **Temps** | Secondes | Secondes |

## ✅ Checklist de Vérification

- [x] Service `CtrackEcoDrivingService` créé
- [x] Endpoint configuré dans le seeder
- [x] Plateforme CTRACK créée
- [x] Script de test créé
- [ ] Configuration API dans `account_platform`
- [ ] Test avec données réelles
- [ ] Intégration dans le dashboard

## 🐛 Dépannage

### Erreur 401 Unauthorized
- Vérifiez que le token API est correct
- Vérifiez que le token n'a pas expiré

### Aucune donnée retournée
- Vérifiez la période de dates
- Vérifiez que les véhicules ont bien des données pour cette période
- Consultez les logs: `storage/logs/laravel.log`

### Timeout
- Augmentez le timeout dans `CtrackEcoDrivingService.php` (ligne avec `Http::timeout(30)`)
- Vérifiez la connectivité réseau

## 📚 Fichiers Créés/Modifiés

1. **Créés**:
   - `app/Services/CtrackEcoDrivingService.php`
   - `test-ctrack-eco-driving.php`
   - `CTRACK_ECO_DRIVING_INTEGRATION.md`

2. **Modifiés**:
   - `database/seeders/ReportPlatformEndpointSeeder.php`

## 🚀 Prochaines Étapes

1. Configurer les credentials CTRACK dans `account_platform`
2. Exécuter le script de test
3. Intégrer les données dans le dashboard
4. Créer des visualisations pour les métriques d'éco-conduite
