# 📡 Format des Requêtes Envoyées aux Endpoints

## 🎯 Paramètres Automatiques

Chaque endpoint TARGE TELEMATICS reçoit automatiquement ces 3 paramètres :

```json
{
    "sessionId": "",
    "startDate": "",
    "endDate": ""
}
```

### Comment ça fonctionne ?

Le **ReportDataService** ajoute automatiquement ces paramètres à chaque requête :

```php
// Dans ReportDataService.php - ligne 135
$requiredParams = [
    'sessionId' => $apiToken,              // Provient de account_platform.api_token
    'startDate' => $params['start_date'],  // Provient de la requête utilisateur
    'endDate' => $params['end_date'],      // Provient de la requête utilisateur
];
```

---

## 📋 Exemples de Requêtes Réelles

### Endpoint 1 : getEventHistoryReport

**URL Complète** :
```
POST https://fleet.securysat.com/json/getEventHistoryReport
```

**Body envoyé** :
```json
{
    "sessionId": "votre-token-api-ici",
    "startDate": "2025-12-01",
    "endDate": "2025-12-24"
}
```

---

### Endpoint 2 : getDailyVehicleEcoSummary

**URL Complète** :
```
POST https://fleet.securysat.com/json/getDailyVehicleEcoSummary
```

**Body envoyé** :
```json
{
    "sessionId": "votre-token-api-ici",
    "startDate": "2025-12-01",
    "endDate": "2025-12-24"
}
```

---

### Endpoint 3 : getStopReport

**URL Complète** :
```
POST https://fleet.securysat.com/json/getStopReport
```

**Body envoyé** :
```json
{
    "sessionId": "votre-token-api-ici",
    "startDate": "2025-12-01",
    "endDate": "2025-12-24",
    "min_duration": 300
}
```

> ⚠️ **Note** : Ce endpoint a un paramètre supplémentaire `min_duration` configuré dans `additional_params`

---

## 🔧 Configuration dans le Code

### 1. Dans account_platform (Configuration globale)

```sql
INSERT INTO account_platform (account_id, platform_id, api_url, api_token, ...)
VALUES (
    5,  -- APM
    6,  -- TARGE TELEMATICS
    'https://fleet.securysat.com',  -- Base URL
    'VOTRE-SESSION-ID-TOKEN',       -- ⚠️ Ce token sera utilisé comme sessionId
    ...
);
```

### 2. Dans report_platform_endpoints (Par endpoint)

```sql
-- Endpoint sans paramètres additionnels
{
    "endpoint_path": "/json/getEventHistoryReport",
    "additional_params": {}  -- sessionId, startDate, endDate ajoutés auto
}

-- Endpoint avec paramètres additionnels
{
    "endpoint_path": "/json/getStopReport",
    "additional_params": {
        "min_duration": 300  -- Paramètre spécifique en plus
    }
}
```

---

## 💻 Utilisation depuis le Code

### Appel du Service

```php
use App\Services\ReportDataService;

$service = new ReportDataService();

$result = $service->fetchReportData(
    $report,
    $account,
    $platform,
    [
        'start_date' => '2025-12-01',  // ← Devient startDate dans la requête
        'end_date' => '2025-12-24',    // ← Devient endDate dans la requête
    ]
);
```

### Ce qui est envoyé à chaque endpoint

```json
{
    "sessionId": "valeur-de-api_token-dans-account_platform",
    "startDate": "2025-12-01",
    "endDate": "2025-12-24"
}
```

---

## 🎨 Ajouter des Paramètres Supplémentaires

### Paramètres globaux (pour tous les endpoints d'un rapport)

Passez-les dans l'appel à `fetchReportData()` :

```php
$result = $service->fetchReportData(
    $report,
    $account,
    $platform,
    [
        'start_date' => '2025-12-01',
        'end_date' => '2025-12-24',
        'vehicle_id' => 'VEH001',        // ← Paramètre supplémentaire
        'include_details' => true,       // ← Paramètre supplémentaire
    ]
);
```

Tous les endpoints recevront :
```json
{
    "sessionId": "...",
    "startDate": "2025-12-01",
    "endDate": "2025-12-24",
    "vehicle_id": "VEH001",
    "include_details": true
}
```

### Paramètres spécifiques à un endpoint

Configurez-les dans `additional_params` :

```php
ReportPlatformEndpoint::create([
    'report_id' => 7,
    'platform_id' => 6,
    'endpoint_path' => '/json/getStopReport',
    'additional_params' => json_encode([
        'min_duration' => 300,
        'include_address' => true,
    ]),
]);
```

Cet endpoint recevra :
```json
{
    "sessionId": "...",
    "startDate": "2025-12-01",
    "endDate": "2025-12-24",
    "min_duration": 300,
    "include_address": true
}
```

---

## 🔄 Ordre de Fusion des Paramètres

```
Paramètres finaux = 
    additional_params (config endpoint)
    + requiredParams (sessionId, startDate, endDate)
    + params (de la requête utilisateur)
```

**Exemple concret** :

```php
// 1. Params de l'endpoint (additional_params)
["min_duration" => 300]

// 2. Params requis (ajoutés automatiquement)
["sessionId" => "xxx", "startDate" => "2025-12-01", "endDate" => "2025-12-24"]

// 3. Params de la requête
["start_date" => "2025-12-01", "end_date" => "2025-12-24", "vehicle_id" => "VEH001"]

// ↓ FUSION ↓

// Résultat final envoyé
{
    "min_duration": 300,
    "sessionId": "xxx",
    "startDate": "2025-12-01",
    "endDate": "2025-12-24",
    "start_date": "2025-12-01",
    "end_date": "2025-12-24",
    "vehicle_id": "VEH001"
}
```

> ⚠️ **Note** : `start_date` et `startDate` coexistent. Si vous voulez seulement `startDate`, ne passez pas `start_date` dans params.

---

## ✅ Vérification

Pour vérifier que les paramètres sont bien envoyés, consultez les logs dans le service :

```php
// Dans ReportDataService.php - ligne 161
Log::info("Executing {$httpMethod} request to {$fullUrl}", [
    'data_key' => $endpoint->data_key,
    'params' => array_keys($allParams),  // ← Affiche les clés des paramètres
]);
```

Vous verrez dans les logs :
```
Executing POST request to https://fleet.securysat.com/json/getEventHistoryReport
data_key: events
params: ['sessionId', 'startDate', 'endDate']
```

---

## 📊 Résumé

| Paramètre | Source | Valeur |
|-----------|--------|--------|
| `sessionId` | `account_platform.api_token` | Token configuré pour le compte |
| `startDate` | `params['start_date']` | Date de début passée à la requête |
| `endDate` | `params['end_date']` | Date de fin passée à la requête |
| Autres | `additional_params` ou `params` | Paramètres spécifiques |

**Tous les endpoints TARGE TELEMATICS reçoivent automatiquement `sessionId`, `startDate`, `endDate` !**

---

## 🚀 Prochaines Étapes

1. ✅ Les paramètres sont configurés automatiquement
2. ✅ Testez avec : `php test-report-data-service.php`
3. ✅ Vérifiez les logs pour voir les paramètres envoyés
4. ⏳ Configurez le vrai token API comme sessionId
