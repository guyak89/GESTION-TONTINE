// Variables globales
let products = [];
let filteredProducts = [];
let categories = [];
let movements = [];
let isLowStockFilter = false;

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCategories();
    loadMovements();
    loadStats();
    setupEventListeners();
});

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Recherche en temps réel
    document.getElementById('searchInput').addEventListener('input', filterProducts);
    
    // Filtre par catégorie
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    
    // Formulaire de produit
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    
    // Formulaire de mouvement de stock
    document.getElementById('stockForm').addEventListener('submit', handleStockSubmit);
    
    // Fermeture des modales en cliquant à l'extérieur
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Chargement des produits
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        filteredProducts = [...products];
        renderProducts();
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        showNotification('Erreur lors du chargement des produits', 'error');
    }
}

// Chargement des catégories
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        categories = await response.json();
        renderCategoryFilter();
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
    }
}

// Chargement des mouvements
async function loadMovements() {
    try {
        const response = await fetch('/api/movements');
        movements = await response.json();
        renderMovements();
    } catch (error) {
        console.error('Erreur lors du chargement des mouvements:', error);
    }
}

// Chargement des statistiques
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        
        document.getElementById('totalProducts').textContent = stats.total_products;
        document.getElementById('lowStockCount').textContent = stats.low_stock_count;
        document.getElementById('totalValue').textContent = `${stats.total_value.toLocaleString('fr-FR')}€`;
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
    }
}

// Rendu des produits
function renderProducts() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        
        const statusBadge = product.is_low_stock 
            ? '<span class="status-badge status-low">Stock Faible</span>'
            : '<span class="status-badge status-ok">OK</span>';
        
        row.innerHTML = `
            <td>
                <div>
                    <strong>${product.name}</strong>
                    ${product.description ? `<br><small style="color: #666;">${product.description}</small>` : ''}
                </div>
            </td>
            <td>${product.category || '-'}</td>
            <td><strong>${product.quantity}</strong></td>
            <td>${product.price.toLocaleString('fr-FR')}€</td>
            <td>${product.min_stock}</td>
            <td>${statusBadge}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-success btn-sm" onclick="showStockModal(${product.id})">
                        <i class="fas fa-exchange-alt"></i> Stock
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="showEditProductModal(${product.id})">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    if (filteredProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #666; padding: 2rem;">Aucun produit trouvé</td></tr>';
    }
}

// Rendu des mouvements
function renderMovements() {
    const tbody = document.getElementById('movementsTableBody');
    tbody.innerHTML = '';
    
    movements.forEach(movement => {
        const row = document.createElement('tr');
        
        const typeIcon = movement.movement_type === 'in' 
            ? '<i class="fas fa-arrow-up" style="color: #51cf66;"></i>' 
            : '<i class="fas fa-arrow-down" style="color: #ff6b6b;"></i>';
        
        const typeText = movement.movement_type === 'in' ? 'Entrée' : 'Sortie';
        
        row.innerHTML = `
            <td>${movement.created_at}</td>
            <td>${movement.product_name}</td>
            <td>${typeIcon} ${typeText}</td>
            <td><strong>${movement.quantity}</strong></td>
            <td>${movement.reason || '-'}</td>
        `;
        
        tbody.appendChild(row);
    });
    
    if (movements.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666; padding: 2rem;">Aucun mouvement trouvé</td></tr>';
    }
}

// Rendu du filtre de catégories
function renderCategoryFilter() {
    const select = document.getElementById('categoryFilter');
    select.innerHTML = '<option value="">Toutes les catégories</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}

// Filtrage des produits
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedCategory = document.getElementById('categoryFilter').value;
    
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            (product.description && product.description.toLowerCase().includes(searchTerm));
        
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        
        const matchesLowStock = !isLowStockFilter || product.is_low_stock;
        
        return matchesSearch && matchesCategory && matchesLowStock;
    });
    
    renderProducts();
}

// Basculer le filtre de stock faible
function toggleLowStockFilter() {
    isLowStockFilter = !isLowStockFilter;
    const button = event.target.closest('button');
    
    if (isLowStockFilter) {
        button.classList.add('btn-warning');
        button.classList.remove('btn-secondary');
        button.innerHTML = '<i class="fas fa-filter"></i> Stock Faible (Actif)';
    } else {
        button.classList.add('btn-secondary');
        button.classList.remove('btn-warning');
        button.innerHTML = '<i class="fas fa-filter"></i> Stock Faible';
    }
    
    filterProducts();
}

// Gestion des onglets
function showTab(tabName) {
    // Cacher tous les onglets
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Retirer la classe active de tous les boutons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Afficher l'onglet sélectionné
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
    
    // Recharger les données si nécessaire
    if (tabName === 'movements') {
        loadMovements();
    }
}

// Affichage des modales
function showAddProductModal() {
    document.getElementById('modalTitle').textContent = 'Ajouter un Produit';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModal').style.display = 'block';
}

function showEditProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('modalTitle').textContent = 'Modifier le Produit';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productCategory').value = product.category || '';
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productQuantity').value = product.quantity;
    document.getElementById('productMinStock').value = product.min_stock;
    
    document.getElementById('productModal').style.display = 'block';
}

function showStockModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('stockProductId').value = product.id;
    document.getElementById('stockProductInfo').innerHTML = `
        <strong>${product.name}</strong><br>
        Stock actuel: <strong>${product.quantity}</strong><br>
        Stock minimum: ${product.min_stock}
    `;
    
    document.getElementById('stockForm').reset();
    document.getElementById('stockProductId').value = product.id;
    document.querySelector('input[name="movementType"][value="in"]').checked = true;
    
    document.getElementById('stockModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Gestion des formulaires
async function handleProductSubmit(event) {
    event.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value) || 0,
        quantity: parseInt(document.getElementById('productQuantity').value) || 0,
        min_stock: parseInt(document.getElementById('productMinStock').value) || 10
    };
    
    try {
        let response;
        if (productId) {
            // Modification
            response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        } else {
            // Ajout
            response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        }
        
        if (response.ok) {
            closeModal('productModal');
            loadProducts();
            loadCategories();
            loadStats();
            showNotification(productId ? 'Produit modifié avec succès' : 'Produit ajouté avec succès', 'success');
        } else {
            throw new Error('Erreur lors de l\'enregistrement');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de l\'enregistrement du produit', 'error');
    }
}

async function handleStockSubmit(event) {
    event.preventDefault();
    
    const productId = document.getElementById('stockProductId').value;
    const movementType = document.querySelector('input[name="movementType"]:checked').value;
    const quantity = parseInt(document.getElementById('stockQuantity').value);
    const reason = document.getElementById('stockReason').value;
    
    const stockData = {
        type: movementType,
        quantity: quantity,
        reason: reason
    };
    
    try {
        const response = await fetch(`/api/products/${productId}/stock`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stockData)
        });
        
        if (response.ok) {
            closeModal('stockModal');
            loadProducts();
            loadMovements();
            loadStats();
            showNotification('Mouvement de stock enregistré avec succès', 'success');
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors du mouvement de stock');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification(error.message, 'error');
    }
}

// Suppression d'un produit
async function deleteProduct(productId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadProducts();
            loadStats();
            showNotification('Produit supprimé avec succès', 'success');
        } else {
            throw new Error('Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la suppression du produit', 'error');
    }
}

// Système de notifications
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; font-size: 1.2rem; cursor: pointer; margin-left: 1rem;">&times;</button>
        </div>
    `;
    
    // Styles pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem;
        border-radius: 8px;
        color: white;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    if (type === 'success') {
        notification.style.background = '#51cf66';
    } else if (type === 'error') {
        notification.style.background = '#ff6b6b';
    } else {
        notification.style.background = '#667eea';
    }
    
    document.body.appendChild(notification);
    
    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Ajouter les styles CSS pour les animations des notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`;
document.head.appendChild(style);