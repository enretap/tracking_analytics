# ✅ Configuration des Paramètres - Mise à Jour

## 📋 Ce qui a été fait

J'ai configuré le système pour qu'**automatiquement**, chaque endpoint TARGE TELEMATICS reçoive les 3 paramètres requis :

```json
{
    "sessionId": "",
    "startDate": "",
    "endDate": ""
}
```

---

## 🔧 Modifications Apportées

### 1. Service ReportDataService (déjà fait)

Le service ajoute automatiquement ces paramètres à chaque requête :

```php
// Ligne 135 dans app/Services/ReportDataService.php
$requiredParams = [
    'sessionId' => $apiToken,              // Depuis account_platform.api_token
    'startDate' => $params['start_date'],  // Depuis la requête
    'endDate' => $params['end_date'],      // Depuis la requête
];
```

### 2. Seeder mis à jour

Les endpoints sont maintenant configurés sans paramètres redondants :

```php
'additional_params' => json_encode([
    // sessionId, startDate, endDate ajoutés automatiquement
])
```

---

## 📡 Résultat : Requêtes Envoyées

### Endpoint 1 : getEventHistoryReport
```bash
POST https://fleet.securysat.com/json/getEventHistoryReport
Content-Type: application/json

{
    "sessionId": "votre-token-api",
    "startDate": "2025-12-01",
    "endDate": "2025-12-24"
}
```

### Endpoint 2 : getDailyVehicleEcoSummary
```bash
POST https://fleet.securysat.com/json/getDailyVehicleEcoSummary
Content-Type: application/json

{
    "sessionId": "votre-token-api",
    "startDate": "2025-12-01",
    "endDate": "2025-12-24"
}
```

### Endpoint 3 : getStopReport
```bash
POST https://fleet.securysat.com/json/getStopReport
Content-Type: application/json

{
    "min_duration": 300,
    "sessionId": "votre-token-api",
    "startDate": "2025-12-01",
    "endDate": "2025-12-24"
}
```

---

## 🎯 D'où Viennent les Valeurs ?

| Paramètre | Source | Configuration |
|-----------|--------|---------------|
| **sessionId** | `account_platform.api_token` | Token configuré dans la BDD |
| **startDate** | `params['start_date']` | Passé lors de l'appel au service |
| **endDate** | `params['end_date']` | Passé lors de l'appel au service |

---

## 💻 Utilisation

### Dans votre code

```php
use App\Services\ReportDataService;

$service = new ReportDataService();

$result = $service->fetchReportData(
    $report,
    $account,
    $platform,
    [
        'start_date' => '2025-12-01',  // ← Devient startDate
        'end_date' => '2025-12-24',    // ← Devient endDate
    ]
);

// Les 3 endpoints recevront automatiquement :
// {
//     "sessionId": "token-de-account_platform",
//     "startDate": "2025-12-01",
//     "endDate": "2025-12-24"
// }
```

---

## 🧪 Scripts de Test

### 1. Voir la configuration
```bash
php show-endpoints.php
```

### 2. Démonstration des paramètres
```bash
php demo-request-parameters.php
```

Ce script montre **exactement** ce qui sera envoyé à chaque endpoint avec exemples cURL.

### 3. Test réel (après configuration du token)
```bash
php test-report-data-service.php
```

---

## 📚 Documentation

- **[REQUEST_PARAMETERS.md](REQUEST_PARAMETERS.md)** - Documentation complète des paramètres
- **[SUMMARY_FR.md](SUMMARY_FR.md)** - Vue d'ensemble du système
- **[demo-request-parameters.php](demo-request-parameters.php)** - Démonstration interactive

---

## ⚙️ Configuration Requise

Pour que ça fonctionne, configurez le token dans `account_platform` :

```sql
INSERT INTO account_platform (account_id, platform_id, api_url, api_token, http_method, token_type, created_at, updated_at)
VALUES (
    5,  -- APM
    6,  -- TARGE TELEMATICS
    'https://fleet.securysat.com',
    'VOTRE-SESSION-ID-TOKEN',  -- ⚠️ Ce sera utilisé comme sessionId
    'POST',
    'body',  -- Important : 'body' pour envoyer le token dans le body, pas en header
    NOW(),
    NOW()
);
```

> ⚠️ **Important** : Le `token_type` doit être `'body'` pour que le sessionId soit envoyé dans le body de la requête, pas dans les headers.

---

## ✅ Vérification

Exécutez le script de démonstration pour voir exactement ce qui sera envoyé :

```bash
php demo-request-parameters.php
```

Output attendu :
```
Endpoint #1 : events
─────────────────────────────────────────────────────────────────
URL: POST https://fleet.securysat.com/json/getEventHistoryReport

Body (JSON):
{
    "sessionId": "exemple-session-id-token-123456",
    "startDate": "2025-12-01",
    "endDate": "2025-12-24"
}
```

---

## 🎉 Résumé

✅ **Tous les endpoints reçoivent automatiquement sessionId, startDate, endDate**  
✅ **Le sessionId provient du token configuré dans account_platform**  
✅ **Les dates proviennent des paramètres passés au service**  
✅ **Aucune configuration supplémentaire nécessaire par endpoint**  
✅ **Scripts de démonstration disponibles**  

**Le système est prêt ! Il suffit de configurer le vrai token API.**

---

Bon développement ! 🚀
