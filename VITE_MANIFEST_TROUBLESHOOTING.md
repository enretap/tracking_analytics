# 🔧 Dépannage - Erreur Vite Manifest

## Symptôme

```
ViteException: Unable to locate file in Vite manifest: resources/js/Pages/auth/accept-invitation.tsx
```

## Causes possibles

### 1. Assets non reconstruits sur le serveur ⚠️

Le problème le plus fréquent : les fichiers sources existent dans Git mais les assets n'ont pas été reconstruits sur le serveur de production.

**Solution** :
1. Vérifier que le déploiement Forge s'est bien exécuté
2. Forcer un nouveau déploiement via Forge UI (bouton "Deploy Now")
3. Ou pousser un commit vide : `git commit --allow-empty -m "rebuild" && git push origin master`

### 2. Échec du build npm sur le serveur 🚫

Le build Vite a peut-être échoué pendant le déploiement.

**Diagnostic** :
```bash
# Via SSH sur le serveur
cd /home/forge/tracking-dashboard.on-forge.com/current
cat storage/logs/laravel.log
# Vérifier les logs Forge pour les erreurs npm
```

**Solution** :
- Vérifier que `package.json` et `package-lock.json` sont à jour dans Git
- S'assurer que `npm ci` ne rencontre pas d'erreurs
- Vérifier que la commande `npm run build:ssr` existe et fonctionne

### 3. Problème de casse (Windows vs Linux) 🔤

Les noms de fichiers peuvent différer entre Windows (insensible à la casse) et Linux (sensible).

**Vérification locale** :
```bash
# Vérifier les fichiers dans Git (respecte la casse)
git ls-files resources/js/Pages/auth/

# Résultat attendu :
# resources/js/Pages/auth/accept-invitation.tsx  ✅
# resources/js/Pages/auth/invitation-expired.tsx ✅
```

**Solution** :
- Utiliser **kebab-case** pour les pages : `accept-invitation.tsx`
- Utiliser **PascalCase** pour les composants : `Button.tsx`

### 4. Cache Blade/Inertia sur le serveur 💾

Le cache peut contenir d'anciens chemins.

**Solution via SSH** :
```bash
cd /home/forge/tracking-dashboard.on-forge.com/current
php artisan view:clear
php artisan config:clear
php artisan cache:clear
php artisan optimize
```

### 5. Fichier manifest manquant ou corrompu 📄

Le fichier `public/build/manifest.json` n'existe pas ou est incomplet.

**Vérification via SSH** :
```bash
cd /home/forge/tracking-dashboard.on-forge.com/current
cat public/build/manifest.json | grep "accept-invitation"
```

**Résultat attendu** :
```json
"resources/js/Pages/auth/accept-invitation.tsx": {
  "file": "assets/accept-invitation-XXXXX.js",
  ...
}
```

**Solution** :
```bash
npm run build:ssr
```

## Checklist de dépannage

- [ ] Les fichiers sources existent bien dans Git : `git ls-files resources/js/Pages/auth/accept-invitation.tsx`
- [ ] Le script `.forge-deploy` contient `npm run build:ssr`
- [ ] Le déploiement Forge s'est exécuté sans erreur (vérifier les logs Forge)
- [ ] Le cache Laravel a été vidé : `php artisan optimize:clear`
- [ ] Le manifeste Vite contient l'entrée : `cat public/build/manifest.json | grep accept-invitation`

## Script de déploiement recommandé

Le fichier `.forge-deploy` doit contenir :

```bash
#!/usr/bin/env bash
set -e

echo "Deployment started..."

(php artisan down) || true

git pull origin master

composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Nettoyer tous les caches
php artisan clear-compiled
php artisan view:clear
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Recréer le cache
php artisan config:cache
php artisan route:cache
php artisan optimize

# Installer et construire les assets
npm ci
npm run build:ssr  # ⚠️ Crucial !

php artisan migrate --force

php artisan up

echo "Deployment finished!"
```

## Solution rapide

Si le problème persiste après un déploiement :

```bash
# 1. Forcer un nouveau déploiement
git commit --allow-empty -m "Force rebuild"
git push origin master

# 2. OU via SSH sur le serveur
cd /home/forge/tracking-dashboard.on-forge.com/current
npm ci
npm run build:ssr
php artisan optimize:clear
```

## Prévention

1. **Toujours tester le build localement avant de pousser** :
   ```bash
   npm run build:ssr
   ```

2. **Vérifier que les fichiers sont dans le manifeste** :
   ```bash
   cat public/build/manifest.json | grep "votre-page"
   ```

3. **Respecter les conventions de nommage** :
   - Pages : kebab-case (`my-page.tsx`)
   - Composants : PascalCase (`MyComponent.tsx`)
   - Layouts : kebab-case (`my-layout.tsx`)

4. **Surveiller les logs de déploiement Forge** pour détecter les erreurs npm
