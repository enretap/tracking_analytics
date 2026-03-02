# Configuration de la Référence CTRACK du Compte

## 📋 Vue d'ensemble

Pour filtrer les données par compte spécifique dans l'API CTRACK, vous devez configurer la référence CTRACK dans le champ `reference_ctrack` de la table `accounts`.

Ce champ existe déjà dans votre base de données (ajouté par la migration `2026_01_06_141125_add_domain_reference_ctrack_logo_to_accounts_table.php`).

## 🔧 Configuration

### 1. Via la base de données

Mettez à jour la table `accounts` pour ajouter la référence CTRACK :

```sql
-- Configurer la référence CTRACK pour un compte
UPDATE accounts
SET reference_ctrack = 'VOTRE_REFERENCE_CTRACK'
WHERE id = 1;  -- ID du compte à configurer
```

### 2. Vérifier la configuration

```sql
SELECT 
    id,
    name,
    reference_ctrack,
    CASE 
        WHEN reference_ctrack IS NOT NULL THEN '✅ Configuré'
        ELSE '⚠️ Non configuré'
    END as status
FROM accounts;
```

## 🚀 Utilisation

### Requête API automatique

Lorsque `reference_ctrack` est configuré sur le compte, le service `CtrackEcoDrivingService` ajoutera automatiquement le paramètre `accountId` à toutes les requêtes API :

**Sans filtre** :
```
GET https://comafrique-ctrack.online/api/units/ecoDriving?begin=01/01/2026&end=23/02/2026
```

**Avec filtre** (si account.reference_ctrack est configuré) :
```
GET https://comafrique-ctrack.online/api/units/ecoDriving?begin=01/01/2026&end=23/02/2026&accountId=VOTRE_REFERENCE
```

### Test

Exécutez le test pour vérifier la configuration :

```bash
php test-fleet-activity-ctrack.php
```

Le test affichera :
- ✅ Si la référence CTRACK est configurée dans le compte
- ⚠️ Si la référence n'est pas configurée (optionnel)
- 💡 Une commande SQL pour la configurer

## 📊 Comportement

### Avec reference_ctrack configuré

- ✅ Les données sont filtrées par le compte spécifique CTRACK
- ✅ Seuls les véhicules de cette référence sont retournés
- ✅ Cache séparé par compte

### Sans reference_ctrack

- ⚠️ Toutes les données accessibles au token sont retournées
- ⚠️ Peut inclure plusieurs comptes si le token a accès
- ⚠️ Cache global pour le token

## 🔍 Exemple complet

```php
use App\Models\Account;
use App\Services\CtrackEcoDrivingService;

// Récupérer le compte
$account = Account::find(1);

// Configurer la référence CTRACK (si pas déjà fait)
$account->reference_ctrack = 'CLIENT_12345';
$account->save();

// Utiliser le service - le filtre sera appliqué automatiquement
$service = new CtrackEcoDrivingService();
$data = $service->fetchEcoDrivingData($account, '01/01/2026', '23/02/2026');

// Les données retournées sont filtrées par accountId=CLIENT_12345
```

## 🎯 Avantages

1. **Isolation des données** : Chaque compte ne voit que ses propres véhicules
2. **Performance** : Moins de données à traiter et filtrer
3. **Cache optimisé** : Cache séparé par référence CTRACK
4. **Sécurité** : Évite les fuites de données entre comptes
5. **Simplicité** : La référence est directement sur le compte (account.reference_ctrack)

## 📝 Notes

- Le champ `reference_ctrack` est **optionnel**
- Si non configuré, l'API retournera toutes les données accessibles au token
- Compatible avec le token Bearer du compte configuré dans `account_platform`
- Utilisé dans le rapport Fleet Activity pour grouper par distributeur

## ❓ Obtenir votre référence CTRACK

Contactez votre administrateur CTRACK ou consultez la documentation de l'API CTRACK pour obtenir votre référence de compte.
