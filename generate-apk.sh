#!/bin/bash

# ═══════════════════════════════════════════════════════════
# Script de génération APK pour StudyFlow
# Utilise PWABuilder pour convertir la PWA en APK Android
# ═══════════════════════════════════════════════════════════

echo "🚀 Génération de l'APK StudyFlow..."
echo "=================================="

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    echo "   Téléchargez-le sur https://nodejs.org/"
    exit 1
fi

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer avec Node.js."
    exit 1
fi

echo "📦 Installation de PWABuilder CLI..."
npm install -g @pwabuilder/cli

echo "🔧 Génération de l'APK..."

SITE_URL="https://iintervilla-lab.github.io/studyflow-promo2025"

# Générer l'APK depuis l'URL déployée
pwabuilder "$SITE_URL" --apk

echo "✅ APK généré avec succès !"
echo "📱 Le fichier APK se trouve dans le dossier 'dist/android'"
echo ""
echo "📋 Instructions d'installation :"
echo "1. Transférez le fichier .apk sur votre téléphone Android"
echo "2. Autorisez l'installation d'applications inconnues dans les paramètres"
echo "3. Ouvrez le fichier .apk et installez l'application"
echo ""
echo "🎯 Fonctionnalités de l'APK :"
echo "• Mode hors ligne complet"
echo "• Synchronisation automatique des données"
echo "• Interface native Android"
echo "• Notifications push (si activées)"