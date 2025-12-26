# Configuration des APIs de Tracking

## Configuration manuelle dans la base de données

### Étape 1 : Ajouter les plateformes

```sql
-- Vérifier les plateformes existantes
SELECT * FROM platforms;

-- Ajouter une nouvelle plateforme si nécessaire
INSERT INTO platforms (name, slug, provider, is_active, created_at, updated_at) 
VALUES ('Nom de la Plateforme', 'slug-plateforme', 'Fournisseur', true, NOW(), NOW());
```

### Étape 2 : Lier une plateforme à un compte avec les credentials API

```sql
-- Lister vos comptes
SELECT id, name FROM accounts;

-- Lister les plateformes
SELECT id, name, slug FROM platforms;

-- Ajouter la configuration API pour un compte spécifique
INSERT INTO account_platform (account_id, platform_id, api_url, api_token, created_at, updated_at)
VALUES (
    1,  -- ID du compte
    1,  -- ID de la plateforme
    'https://api.votre-plateforme.com/v1/vehicles',  -- URL de l'API
    'votre-token-api-secret',  -- Token d'authentification
    NOW(),
    NOW()
);
```

### Étape 3 : Vérifier la configuration

```sql
SELECT 
    a.name as account_name,
    p.name as platform_name,
    p.slug,
    ap.api_url,
    LEFT(ap.api_token, 10) as token_preview  -- Affiche uniquement les 10 premiers caractères
FROM account_platform ap
JOIN accounts a ON ap.account_id = a.id
JOIN platforms p ON ap.platform_id = p.id;
```

### Étape 4 : Mettre à jour les credentials

```sql
-- Mettre à jour l'URL de l'API
UPDATE account_platform 
SET api_url = 'https://nouvelle-url.com/api/vehicles'
WHERE account_id = 1 AND platform_id = 1;

-- Mettre à jour le token
UPDATE account_platform 
SET api_token = 'nouveau-token-secret'
WHERE account_id = 1 AND platform_id = 1;
```

## Exemples de configuration par plateforme

### GPS Tracker Pro

```sql
INSERT INTO account_platform (account_id, platform_id, api_url, api_token, created_at, updated_at)
VALUES (
    1,
    (SELECT id FROM platforms WHERE slug = 'gps-tracker'),
    'https://api.gps-tracker-pro.com/v2/vehicles',
    'Bearer gtp_live_xxxxxxxxxxxx',
    NOW(),
    NOW()
);
```

### Fleet Manager

```sql
INSERT INTO account_platform (account_id, platform_id, api_url, api_token, created_at, updated_at)
VALUES (
    1,
    (SELECT id FROM platforms WHERE slug = 'fleet-manager'),
    'https://fleet-api.example.com/fleet/vehicles',
    'fm-api-key-xxxxxxxxxx',
    NOW(),
    NOW()
);
```

### Track Pro

```sql
INSERT INTO account_platform (account_id, platform_id, api_url, api_token, created_at, updated_at)
VALUES (
    1,
    (SELECT id FROM platforms WHERE slug = 'track-pro'),
    'https://trackpro.com/api/v1/units',
    'tk_prod_xxxxxxxxxxxx',
    NOW(),
    NOW()
);
```

## Configuration via Laravel Tinker

Vous pouvez également configurer les credentials via Tinker :

```bash
php artisan tinker
```

```php
// Récupérer un compte
$account = \App\Models\Account::find(1);

// Récupérer une plateforme
$platform = \App\Models\Platform::where('slug', 'gps-tracker')->first();

// Attacher avec les credentials
$account->platforms()->attach($platform->id, [
    'api_url' => 'https://api.example.com/vehicles',
    'api_token' => 'your-secret-token',
]);

// Ou mettre à jour les credentials existants
\Illuminate\Support\Facades\DB::table('account_platform')
    ->where('account_id', $account->id)
    ->where('platform_id', $platform->id)
    ->update([
        'api_url' => 'https://new-api.example.com/vehicles',
        'api_token' => 'new-secret-token',
        'updated_at' => now(),
    ]);
```

## Tester la configuration

### Via Tinker

```bash
php artisan tinker
```

```php
// Récupérer un utilisateur
$user = \App\Models\User::first();

// Instancier le service
$service = new \App\Services\VehicleService();

// Tester la récupération des véhicules
$vehicles = $service->getAllVehicles($user);

// Afficher les résultats
dump($vehicles);
```

### Via cURL

```bash
# D'abord, obtenir un token d'authentification (si utilisant Sanctum)
# Puis tester l'endpoint

curl -X GET http://localhost/api/vehicles \
  -H "Accept: application/json" \
  -H "Cookie: XSRF-TOKEN=...; laravel_session=..."
```

## Sécurité des Tokens

⚠️ **Important** : Les tokens API sont sensibles et doivent être protégés.

### Bonnes pratiques :

1. **Jamais en clair dans le code** : Utilisez toujours la base de données
2. **Rotation régulière** : Changez les tokens périodiquement
3. **Accès limité** : Seuls les admins devraient pouvoir les voir/modifier
4. **Encryption** : Considérez l'encryption des tokens dans la base de données

### Exemple d'encryption (optionnel)

```php
// Dans le modèle Account.php, vous pouvez ajouter :

protected $casts = [
    'settings' => 'array',
    'is_active' => 'boolean',
];

// Et créer un accessor/mutator pour le token dans la relation pivot
// Ceci nécessiterait une modification du service pour déchiffrer
```

## Troubleshooting

### Les véhicules ne s'affichent pas

1. Vérifiez que les credentials sont corrects :
```sql
SELECT ap.* FROM account_platform ap
JOIN accounts a ON ap.account_id = a.id
WHERE a.id = 1;
```

2. Vérifiez les logs Laravel :
```bash
tail -f storage/logs/laravel.log
```

3. Testez l'API directement :
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.platform.com/vehicles
```

### Erreur 401 Unauthorized

- Vérifiez que le token API est correct
- Vérifiez que l'URL de l'API est correcte
- Vérifiez que le token n'a pas expiré

### Timeout

- L'API externe prend trop de temps (>30s)
- Réseau lent ou API indisponible
- Augmentez le timeout dans VehicleService.php si nécessaire
