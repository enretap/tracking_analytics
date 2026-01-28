#!/usr/bin/env bash

echo "🔍 Diagnostic Vite Manifest - Tracking Dashboard"
echo "================================================"
echo ""

# 1. Vérifier le répertoire actuel
echo "1️⃣ Répertoire actuel:"
pwd
echo ""

# 2. Vérifier si les fichiers sources existent
echo "2️⃣ Fichiers sources d'invitation:"
if [ -f "resources/js/Pages/auth/accept-invitation.tsx" ]; then
    echo "✅ accept-invitation.tsx existe"
else
    echo "❌ accept-invitation.tsx MANQUANT"
fi

if [ -f "resources/js/Pages/auth/invitation-expired.tsx" ]; then
    echo "✅ invitation-expired.tsx existe"
else
    echo "❌ invitation-expired.tsx MANQUANT"
fi
echo ""

# 3. Vérifier si le manifeste existe
echo "3️⃣ Manifeste Vite:"
if [ -f "public/build/manifest.json" ]; then
    echo "✅ manifest.json existe"
    echo "   Taille: $(du -h public/build/manifest.json | cut -f1)"
    echo ""
    echo "   Recherche de accept-invitation:"
    grep -c "accept-invitation" public/build/manifest.json || echo "   ⚠️  Pas trouvé dans le manifeste"
    echo ""
    echo "   Entrées dans le manifeste:"
    grep -o '"resources/js/Pages/[^"]*"' public/build/manifest.json | head -20
else
    echo "❌ manifest.json MANQUANT"
fi
echo ""

# 4. Vérifier le dossier build
echo "4️⃣ Contenu du dossier build:"
if [ -d "public/build" ]; then
    echo "   Nombre de fichiers: $(find public/build -type f | wc -l)"
    echo "   Assets JS:"
    find public/build/assets -name "*.js" | grep -i invitation || echo "   ⚠️  Aucun fichier invitation trouvé"
else
    echo "❌ Dossier public/build MANQUANT"
fi
echo ""

# 5. Vérifier Node et npm
echo "5️⃣ Versions:"
echo "   Node: $(node --version)"
echo "   npm: $(npm --version)"
echo ""

# 6. Vérifier package.json
echo "6️⃣ Script build:ssr dans package.json:"
grep -A1 '"build:ssr"' package.json || echo "❌ Script build:ssr non trouvé"
echo ""

# 7. Vérifier node_modules
echo "7️⃣ node_modules:"
if [ -d "node_modules" ]; then
    echo "✅ node_modules existe"
    echo "   Taille: $(du -sh node_modules | cut -f1)"
else
    echo "❌ node_modules MANQUANT"
fi
echo ""

# 8. Dernier déploiement
echo "8️⃣ Informations Git:"
echo "   Branche: $(git branch --show-current)"
echo "   Dernier commit: $(git log -1 --oneline)"
echo ""

# 9. Vérifier les logs
echo "9️⃣ Dernières erreurs dans les logs Laravel (si disponibles):"
if [ -f "storage/logs/laravel.log" ]; then
    tail -20 storage/logs/laravel.log | grep -i "vite\|manifest\|error" || echo "   Aucune erreur Vite récente"
else
    echo "   ⚠️  Fichier de log non trouvé"
fi
echo ""

echo "================================================"
echo "🔍 Diagnostic terminé"
echo ""
echo "📋 Actions suggérées:"
echo "   Si manifest.json manque ou est incomplet:"
echo "   → npm ci"
echo "   → npm run build:ssr"
echo "   → php artisan optimize:clear"
