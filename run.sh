#!/bin/bash

# Script de lancement de l'application de gestion de stock
echo "🚀 Démarrage de l'application de gestion de stock..."

# Vérifier si l'environnement virtuel existe
if [ ! -d "venv" ]; then
    echo "📦 Création de l'environnement virtuel..."
    python3 -m venv venv
fi

# Activer l'environnement virtuel
echo "🔧 Activation de l'environnement virtuel..."
source venv/bin/activate

# Installer les dépendances si nécessaire
echo "📚 Vérification des dépendances..."
pip install -r requirements.txt

# Lancer l'application
echo "✨ Lancement de l'application..."
echo "🌐 L'application sera disponible sur : http://localhost:5000"
echo "📋 Appuyez sur Ctrl+C pour arrêter l'application"
echo ""

python app.py