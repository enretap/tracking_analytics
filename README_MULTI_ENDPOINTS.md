# 🎯 Système Multi-Endpoints pour Rapports - Récapitulatif

## ✅ Ce qui a été créé

### 1. Base de données
- ✅ **Migration** : `2025_12_24_000001_create_report_platform_endpoints_table.php`
  - Table `report_platform_endpoints` pour configurer plusieurs endpoints par rapport/plateforme

### 2. Modèles Laravel
- ✅ **ReportPlatformEndpoint** : Modèle pour gérer les endpoints
- ✅ **Report** : Ajout des relations `platformEndpoints()` et `platforms()`
- ✅ **Platform** : Ajout des relations `reportEndpoints()` et `reports()`

### 3. Services
- ✅ **ReportDataService** : Service pour récupérer les données depuis plusieurs endpoints
  - `fetchReportData()` : Récupère les données d'un rapport depuis une plateforme
  - `fetchFromMultiplePlatforms()` : Récupère depuis plusieurs plateformes
  - `executeEndpointRequest()` : Exécute une requête vers un endpoint spécifique

### 4. Contrôleurs
- ✅ **ReportEndpointConfigurationController** : Gestion de la configuration des endpoints
- ✅ **SummaryReportController** : Exemple d'utilisation pour le Rapport de Synthèse

### 5. Seeders et Scripts
- ✅ **ReportPlatformEndpointSeeder** : Configure l'exemple TARGE TELEMATICS
- ✅ **test-report-data-service.php** : Script de test du service
- ✅ **show-endpoints.php** : Affiche la configuration actuelle
- ✅ **configure-apm-targe-telematics.sql** : Script SQL pour configurer APM

### 6. Documentation
- ✅ **MULTI_ENDPOINT_REPORTS.md** : Documentation complète du système
- ✅ **README_MULTI_ENDPOINTS.md** : Ce fichier

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     RAPPORT DE SYNTHÈSE                         │
│                    (Report: "summary")                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ hasMany
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│             report_platform_endpoints                           │
│                                                                 │
│  • /json/getEventHistoryReport     → events                    │
│  • /json/getDailyVehicleEcoSummary → eco_summary               │
│  • /json/getStopReport             → stops                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ belongsTo
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   TARGE TELEMATICS                              │
│                  (Platform: "targe-telematics")                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ belongsToMany (account_platform)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      COMPTE APM                                 │
│                                                                 │
│  Configuration globale:                                         │
│  • Base URL: https://fleet.securysat.com                       │
│  • Token: xxxxxxxxxx                                            │
│  • HTTP Method: POST                                            │
│  • Token Type: bearer                                           │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Installation

### Étape 1 : Migration
```bash
php artisan migrate
```

### Étape 2 : Configuration des endpoints
```bash
php artisan db:seed --class=ReportPlatformEndpointSeeder
```

### Étape 3 : Vérification
```bash
php show-endpoints.php
```

Résultat attendu :
```
Rapport: Rapport de Synthèse
Plateforme: TARGE TELEMATICS
─────────────────────────────────────────────────────────────────
  Ordre: 1
  Méthode: POST
  Chemin: /json/getEventHistoryReport
  Clé de données: events
  Obligatoire: Oui
  ...
```

### Étape 4 : Configuration du compte APM (exemple)

Option A - Via SQL :
```bash
# Éditez database/configure-apm-targe-telematics.sql
# Remplacez 'VOTRE-TOKEN-ICI' par le vrai token
# Puis exécutez le script
```

Option B - Via l'interface web :
```
Accédez à /settings/platform-api
Sélectionnez APM et TARGE TELEMATICS
Configurez :
  - URL: https://fleet.securysat.com
  - Token: votre-token-api
```

### Étape 5 : Test
```bash
php test-report-data-service.php
```

## 💡 Utilisation

### Dans un contrôleur

```php
use App\Services\ReportDataService;

class ReportController extends Controller
{
    public function generate(Request $request)
    {
        $service = new ReportDataService();
        
        $report = Report::find($request->report_id);
        $account = $request->user()->account;
        $platform = Platform::find($request->platform_id);
        
        $result = $service->fetchReportData(
            $report,
            $account,
            $platform,
            [
                'start_date' => '2025-12-01',
                'end_date' => '2025-12-24',
            ]
        );
        
        if ($result['success']) {
            // Données récupérées avec succès
            $events = $result['data']['events'];
            $ecoSummary = $result['data']['eco_summary'];
            $stops = $result['data']['stops'];
            
            return view('reports.summary', compact('events', 'ecoSummary', 'stops'));
        }
    }
}
```

### Structure de la réponse

```php
[
    'success' => true,
    'data' => [
        'events' => [
            // Données de /json/getEventHistoryReport
        ],
        'eco_summary' => [
            // Données de /json/getDailyVehicleEcoSummary
        ],
        'stops' => [
            // Données de /json/getStopReport
        ],
    ],
    'errors' => [
        // Erreurs non bloquantes (endpoints optionnels)
    ],
    'platform' => 'TARGE TELEMATICS',
    'account' => 'APM',
]
```

## 🔑 Concepts clés

### 1. Configuration à deux niveaux

**Niveau 1 : Configuration globale (account_platform)**
- Base URL de l'API
- Token d'authentification
- Méthode HTTP par défaut
- Type d'authentification

**Niveau 2 : Configuration par rapport (report_platform_endpoints)**
- Chemins spécifiques (endpoints)
- Clés de données
- Paramètres additionnels
- Ordre d'exécution

### 2. Endpoints obligatoires vs optionnels

```sql
-- Obligatoire : Si échoue, tout le rapport échoue
is_required = true

-- Optionnel : Si échoue, on continue quand même
is_required = false
```

### 3. Ordre d'exécution

Les endpoints sont appelés dans l'ordre défini par `order` :
```
1. events       (order: 1)
2. eco_summary  (order: 2)
3. stops        (order: 3)
```

## 📝 Exemple complet : Rapport de Synthèse APM

### Configuration actuelle

**Rapport** : Rapport de Synthèse  
**Plateforme** : TARGE TELEMATICS  
**Compte** : APM

**Endpoints configurés** :
1. `POST https://fleet.securysat.com/json/getEventHistoryReport`
   - Clé : `events`
   - Obligatoire : Oui
   
2. `POST https://fleet.securysat.com/json/getDailyVehicleEcoSummary`
   - Clé : `eco_summary`
   - Obligatoire : Oui
   
3. `POST https://fleet.securysat.com/json/getStopReport`
   - Clé : `stops`
   - Obligatoire : Non

### Flux d'exécution

1. **Récupération de la config** : Lit `account_platform` pour APM + TARGE TELEMATICS
2. **Liste des endpoints** : Lit `report_platform_endpoints` pour le Rapport de Synthèse
3. **Exécution séquentielle** :
   - Appel à `getEventHistoryReport` → stocke dans `data['events']`
   - Appel à `getDailyVehicleEcoSummary` → stocke dans `data['eco_summary']`
   - Appel à `getStopReport` → stocke dans `data['stops']`
4. **Retour** : Toutes les données agrégées dans un seul objet

## 🎨 Ajouter de nouveaux endpoints

### Pour le même rapport

```php
ReportPlatformEndpoint::create([
    'report_id' => $report->id,
    'platform_id' => $platform->id,
    'endpoint_path' => '/json/getMaintenanceReport',
    'http_method' => 'POST',
    'data_key' => 'maintenance',
    'order' => 4,
    'is_required' => false,
    'description' => 'Rapport de maintenance',
]);
```

### Pour un nouveau rapport

1. Créez le rapport dans `reports`
2. Ajoutez les endpoints dans `report_platform_endpoints`
3. Créez un contrôleur spécifique
4. Créez un template React/Inertia pour l'affichage

## 📚 Fichiers de référence

- **Documentation** : [MULTI_ENDPOINT_REPORTS.md](MULTI_ENDPOINT_REPORTS.md)
- **Migration** : `database/migrations/2025_12_24_000001_create_report_platform_endpoints_table.php`
- **Service** : `app/Services/ReportDataService.php`
- **Modèle** : `app/Models/ReportPlatformEndpoint.php`
- **Exemple contrôleur** : `app/Http/Controllers/Reports/SummaryReportController.php`
- **Seeder** : `database/seeders/ReportPlatformEndpointSeeder.php`

## 🚀 Prochaines étapes suggérées

1. [ ] Configurer le token API réel pour APM
2. [ ] Tester avec des données réelles
3. [ ] Créer l'interface web de gestion des endpoints
4. [ ] Ajouter d'autres rapports (maintenance, carburant, etc.)
5. [ ] Implémenter la génération PDF/Excel
6. [ ] Ajouter le cache pour les requêtes API fréquentes

## ❓ Support

Pour toute question sur l'implémentation :
- Consultez [MULTI_ENDPOINT_REPORTS.md](MULTI_ENDPOINT_REPORTS.md)
- Exécutez `php show-endpoints.php` pour voir la config
- Utilisez `php test-report-data-service.php` pour tester
