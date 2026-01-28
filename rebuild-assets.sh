#!/usr/bin/env bash

set -e

echo "🔧 Reconstruction des assets Vite"
echo "================================="
echo ""

# 1. Nettoyer le build précédent
echo "1️⃣ Nettoyage du build précédent..."
rm -rf public/build
rm -rf public/hot
echo "✅ Build précédent supprimé"
echo ""

# 2. Nettoyer node_modules si nécessaire
read -p "Voulez-vous aussi nettoyer node_modules ? (o/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Oo]$ ]]; then
    echo "   Suppression de node_modules..."
    rm -rf node_modules
    echo "✅ node_modules supprimé"
fi
echo ""

# 3. Installer les dépendances
echo "2️⃣ Installation des dépendances npm..."
npm ci
echo "✅ Dépendances installées"
echo ""

# 4. Construire les assets
echo "3️⃣ Construction des assets avec SSR..."
npm run build:ssr
echo "✅ Assets construits"
echo ""

# 5. Vérifier le manifeste
echo "4️⃣ Vérification du manifeste..."
if [ -f "public/build/manifest.json" ]; then
    echo "✅ manifest.json créé"
    
    if grep -q "accept-invitation" public/build/manifest.json; then
        echo "✅ accept-invitation trouvé dans le manifeste"
    else
        echo "⚠️  accept-invitation NON TROUVÉ dans le manifeste"
        echo "   Vérification des pages auth présentes:"
        grep -o '"resources/js/Pages/auth/[^"]*"' public/build/manifest.json
    fi
else
    echo "❌ manifest.json NON CRÉÉ - Le build a échoué"
    exit 1
fi
echo ""

# 6. Nettoyer les caches Laravel
echo "5️⃣ Nettoyage des caches Laravel..."
php artisan optimize:clear
echo "✅ Caches nettoyés"
echo ""

echo "================================="
echo "✅ Reconstruction terminée avec succès!"
echo ""
echo "📋 Vérification finale:"
cat public/build/manifest.json | grep -A5 "accept-invitation" || echo "⚠️  Fichier non trouvé dans le manifeste"
