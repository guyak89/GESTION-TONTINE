# 📦 Application de Gestion de Stock

Une application web moderne et intuitive pour gérer efficacement votre inventaire de produits.

## ✨ Fonctionnalités

### 🎯 Gestion des Produits
- ➕ Ajouter de nouveaux produits avec toutes les informations nécessaires
- ✏️ Modifier les détails des produits existants
- 🗑️ Supprimer des produits (avec confirmation)
- 🔍 Recherche en temps réel par nom ou description
- 🏷️ Filtrage par catégorie
- ⚠️ Filtrage des produits en stock faible

### 📊 Gestion des Stocks
- 📈 Entrées de stock (approvisionnement, retours, ajustements)
- 📉 Sorties de stock (ventes, pertes, transferts)
- 📝 Historique complet des mouvements avec motifs
- 🚨 Alertes automatiques pour les stocks faibles
- ✅ Vérification des quantités disponibles lors des sorties

### 📈 Tableau de Bord
- 📦 Nombre total de produits
- ⚠️ Compteur des produits en stock faible
- 💰 Valeur totale du stock
- 📊 Statistiques en temps réel

### 🎨 Interface Utilisateur
- 🌟 Design moderne et responsive
- 📱 Compatible mobile et desktop
- 🎯 Navigation par onglets (Produits / Mouvements)
- 🔔 Notifications en temps réel
- ⚡ Interactions fluides et animations

## 🚀 Installation et Lancement

### Prérequis
- Python 3.7 ou plus récent
- pip (gestionnaire de paquets Python)

### Installation

1. **Cloner ou télécharger le projet**
   ```bash
   cd /workspace
   ```

2. **Installer les dépendances**
   ```bash
   pip install -r requirements.txt
   ```

3. **Lancer l'application**
   ```bash
   python app.py
   ```

4. **Accéder à l'application**
   Ouvrez votre navigateur et allez à : http://localhost:5000

## 📖 Utilisation

### Premier Démarrage
L'application est livrée avec des données d'exemple comprenant :
- Ordinateurs portables
- Souris et claviers
- Écrans
- Smartphones
- Chargeurs

### Ajouter un Produit
1. Cliquez sur le bouton "➕ Nouveau Produit"
2. Remplissez le formulaire :
   - **Nom** (obligatoire)
   - **Description** (optionnel)
   - **Catégorie** (optionnel)
   - **Prix** (en euros)
   - **Quantité initiale**
   - **Stock minimum** (pour les alertes)
3. Cliquez sur "Enregistrer"

### Gérer les Stocks
1. Dans la liste des produits, cliquez sur "📈 Stock"
2. Choisissez le type de mouvement :
   - **Entrée** : Ajouter du stock (livraison, retour client, etc.)
   - **Sortie** : Retirer du stock (vente, perte, etc.)
3. Indiquez la quantité
4. Ajoutez un motif (optionnel mais recommandé)
5. Validez

### Rechercher et Filtrer
- **Recherche** : Tapez dans la barre de recherche pour filtrer par nom ou description
- **Catégorie** : Utilisez le menu déroulant pour filtrer par catégorie
- **Stock faible** : Cliquez sur le bouton "⚠️ Stock Faible" pour voir uniquement les produits nécessitant un réapprovisionnement

### Consulter l'Historique
1. Cliquez sur l'onglet "🔄 Mouvements"
2. Consultez la liste chronologique des 50 derniers mouvements
3. Informations affichées : date, produit, type, quantité, motif

## 🛠️ Structure du Projet

```
/
├── app.py                 # Application Flask principale
├── requirements.txt       # Dépendances Python
├── templates/
│   └── index.html        # Interface utilisateur HTML
├── static/
│   ├── css/
│   │   └── style.css     # Styles CSS
│   └── js/
│       └── app.js        # JavaScript frontend
└── README.md             # Ce fichier
```

## 💾 Base de Données

L'application utilise SQLite avec deux tables principales :

### Products
- Informations des produits (nom, description, catégorie, prix, stock, etc.)
- Timestamps de création et modification
- Stock minimum configurable

### StockMovements
- Historique des mouvements (entrées/sorties)
- Liaison avec les produits
- Motifs et timestamps

## 🎨 Personnalisation

### Couleurs et Thème
Modifiez le fichier `static/css/style.css` pour personnaliser :
- Couleurs principales (variables CSS en début de fichier)
- Typographie
- Espacements
- Animations

### Fonctionnalités
Ajoutez de nouvelles fonctionnalités en :
1. Créant de nouvelles routes dans `app.py`
2. Ajoutant les appels API dans `static/js/app.js`
3. Modifiant l'interface dans `templates/index.html`

## 🔧 API Endpoints

### Produits
- `GET /api/products` - Liste des produits (avec filtres)
- `POST /api/products` - Créer un produit
- `PUT /api/products/{id}` - Modifier un produit
- `DELETE /api/products/{id}` - Supprimer un produit

### Stock
- `POST /api/products/{id}/stock` - Mouvement de stock

### Utilitaires
- `GET /api/categories` - Liste des catégories
- `GET /api/low-stock` - Produits en stock faible
- `GET /api/movements` - Historique des mouvements
- `GET /api/stats` - Statistiques globales

## 📝 Notes Techniques

- **Base de données** : SQLite (fichier `stock_management.db` créé automatiquement)
- **Framework** : Flask avec SQLAlchemy
- **Frontend** : Vanilla JavaScript (pas de framework externe)
- **Styles** : CSS3 avec Flexbox et Grid
- **Icons** : Font Awesome 6.0
- **Responsive** : Mobile-first design

## 🤝 Contribution

Cette application est conçue pour être facilement extensible. Vous pouvez :
- Ajouter de nouveaux types de rapports
- Implémenter des rôles utilisateur
- Ajouter l'import/export de données
- Intégrer des codes-barres
- Connecter des APIs externes

## 📄 Licence

Ce projet est libre d'utilisation et de modification selon vos besoins.

---

💡 **Astuce** : Pour un usage en production, pensez à changer la clé secrète dans `app.py` et à utiliser une base de données plus robuste comme PostgreSQL.