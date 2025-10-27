# 🚀 Démarrage Rapide - Application de Gestion de Stock

## Lancement Ultra-Rapide

1. **Ouvrez un terminal** dans le dossier du projet
2. **Lancez le script automatique** :
   ```bash
   ./run.sh
   ```
3. **Ouvrez votre navigateur** sur : http://localhost:5000

C'est tout ! 🎉

## Alternative Manuelle

Si le script ne fonctionne pas, utilisez ces commandes :

```bash
# 1. Créer l'environnement virtuel (première fois seulement)
python3 -m venv venv

# 2. Activer l'environnement virtuel
source venv/bin/activate

# 3. Installer les dépendances (première fois seulement)
pip install -r requirements.txt

# 4. Lancer l'application
python app.py
```

## Premiers Pas

### ✅ L'application démarre avec des données d'exemple :
- 6 produits pré-configurés
- Différentes catégories (Informatique, Téléphonie, Accessoires)
- Certains produits en stock faible pour tester les alertes

### 🎯 Fonctionnalités principales à tester :

1. **Ajouter un produit** : Cliquez sur "➕ Nouveau Produit"
2. **Modifier le stock** : Cliquez sur "📈 Stock" sur un produit
3. **Rechercher** : Utilisez la barre de recherche
4. **Filtrer** : Par catégorie ou stock faible
5. **Voir l'historique** : Onglet "🔄 Mouvements"

### 🚨 Alertes de Stock Faible
- Les produits avec un stock ≤ au stock minimum sont signalés en rouge
- Le tableau de bord affiche le nombre de produits en stock faible
- Utilisez le filtre "Stock Faible" pour les voir rapidement

### 💡 Conseils d'utilisation :
- **Stock minimum** : Définissez-le lors de la création du produit
- **Motifs** : Ajoutez toujours un motif lors des mouvements de stock
- **Catégories** : Utilisez des noms cohérents pour faciliter le filtrage

## Arrêter l'Application

Appuyez sur `Ctrl + C` dans le terminal pour arrêter l'application.

## Support

Si vous rencontrez des problèmes :
1. Vérifiez que Python 3.7+ est installé : `python3 --version`
2. Vérifiez les permissions du script : `chmod +x run.sh`
3. Consultez le README.md complet pour plus de détails

---

**🎉 Bon usage de votre nouvelle application de gestion de stock !**