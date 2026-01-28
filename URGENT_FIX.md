# 🚨 Solution d'urgence - Erreur Vite Manifest persistante

## Problème

L'erreur `Unable to locate file in Vite manifest: resources/js/Pages/auth/accept-invitation.tsx` persiste malgré les déploiements.

**Cause probable** : Le script `npm run build:ssr` échoue silencieusement sur le serveur, ou les assets ne sont pas générés correctement.

## Solution immédiate (via SSH)

### Étape 1 : Diagnostic

Connectez-vous au serveur et exécutez le script de diagnostic :

```bash
# SSH vers le serveur
ssh forge@tracking-dashboard.on-forge.com

# Aller dans le répertoire
cd /home/forge/tracking-dashboard.on-forge.com/current

# Rendre le script exécutable et l'exécuter
chmod +x diagnose-vite.sh
./diagnose-vite.sh
```

Le script affichera :
- ✅ Si les fichiers sources existent
- ✅ Si le manifeste contient `accept-invitation`
- ❌ Les éléments manquants

### Étape 2 : Correction

Si le diagnostic montre des problèmes, exécutez le script de reconstruction :

```bash
# Dans le même répertoire
chmod +x rebuild-assets.sh
./rebuild-assets.sh
```

Répondez `N` (non) à la question sur node_modules sauf si vous suspectez un problème de dépendances.

### Étape 3 : Vérification manuelle

Si les scripts ne fonctionnent pas, exécutez manuellement :

```bash
cd /home/forge/tracking-dashboard.on-forge.com/current

# Nettoyer
rm -rf public/build public/hot

# Reconstruire
npm ci
npm run build:ssr

# Vérifier
cat public/build/manifest.json | grep accept-invitation

# Nettoyer les caches
php artisan optimize:clear
```

**Résultat attendu** :
```json
"resources/js/Pages/auth/accept-invitation.tsx": {
  "file": "assets/accept-invitation-XXXXX.js",
  ...
}
```

## Alternative : Débogage du script .forge-deploy

Le script `.forge-deploy` peut échouer silencieusement. Vérifiez les logs Forge :

1. Allez sur Laravel Forge → Votre site → Deployments
2. Cliquez sur le dernier déploiement
3. Vérifiez les logs pour les erreurs npm

### Erreurs courantes

#### ❌ npm ci échoue
```
npm ERR! lockfileVersion@2 expected
```
**Solution** : Mettre à jour package-lock.json localement et pousser

#### ❌ Mémoire insuffisante
```
JavaScript heap out of memory
```
**Solution** : Augmenter la mémoire Node
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build:ssr
```

#### ❌ Permissions insuffisantes
```
EACCES: permission denied
```
**Solution** : Vérifier les permissions du dossier public/build

## Vérification post-correction

Testez l'URL :
```
https://tracking-dashboard.on-forge.com/invitation/accept/TOKEN
```

Devrait afficher la page au lieu de l'erreur 500.

## Prévention future

### Option 1 : Ajouter des logs dans .forge-deploy

Modifiez `.forge-deploy` pour capturer les erreurs :

```bash
# Build assets with SSR
echo "Building assets..."
npm ci 2>&1 | tee npm-ci.log
npm run build:ssr 2>&1 | tee npm-build.log

# Vérifier que le manifeste est créé
if [ ! -f "public/build/manifest.json" ]; then
    echo "ERROR: manifest.json not created!"
    cat npm-build.log
    exit 1
fi

echo "Build successful. Manifest entries:"
wc -l public/build/manifest.json
```

### Option 2 : Notifications Forge

Activez les notifications Slack/Discord dans Forge pour être alerté en cas d'échec de déploiement.

### Option 3 : Script de santé post-déploiement

Ajoutez à la fin de `.forge-deploy` :

```bash
# Health check
if ! grep -q "accept-invitation" public/build/manifest.json; then
    echo "WARNING: accept-invitation.tsx not in manifest!"
    exit 1
fi
```

## Contact d'urgence

Si le problème persiste après toutes ces étapes :

1. Vérifiez que les fichiers existent dans Git :
   ```bash
   git ls-files | grep accept-invitation
   ```

2. Tentez un déploiement complètement propre :
   ```bash
   # Sur le serveur
   cd /home/forge
   rm -rf tracking-dashboard.on-forge.com
   # Puis redéployez depuis Forge
   ```

3. Vérifiez les versions Node :
   ```bash
   node --version  # Devrait être >= 18
   npm --version   # Devrait être >= 9
   ```
