from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///stock_management.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'votre_cle_secrete_ici'

db = SQLAlchemy(app)

# Modèle de base de données pour les produits
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    quantity = db.Column(db.Integer, default=0)
    price = db.Column(db.Float, default=0.0)
    min_stock = db.Column(db.Integer, default=10)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'quantity': self.quantity,
            'price': self.price,
            'min_stock': self.min_stock,
            'is_low_stock': self.quantity <= self.min_stock,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M')
        }

# Modèle pour l'historique des mouvements de stock
class StockMovement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    movement_type = db.Column(db.String(10), nullable=False)  # 'in' ou 'out'
    quantity = db.Column(db.Integer, nullable=False)
    reason = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    product = db.relationship('Product', backref=db.backref('movements', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'product_name': self.product.name,
            'movement_type': self.movement_type,
            'quantity': self.quantity,
            'reason': self.reason,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M')
        }

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/products', methods=['GET'])
def get_products():
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    
    query = Product.query
    
    if search:
        query = query.filter(Product.name.contains(search))
    if category:
        query = query.filter(Product.category == category)
    
    products = query.all()
    return jsonify([product.to_dict() for product in products])

@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.get_json()
    
    product = Product(
        name=data['name'],
        description=data.get('description', ''),
        category=data.get('category', ''),
        quantity=data.get('quantity', 0),
        price=data.get('price', 0.0),
        min_stock=data.get('min_stock', 10)
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify(product.to_dict()), 201

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    
    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.category = data.get('category', product.category)
    product.price = data.get('price', product.price)
    product.min_stock = data.get('min_stock', product.min_stock)
    product.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify(product.to_dict())

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    
    return '', 204

@app.route('/api/products/<int:product_id>/stock', methods=['POST'])
def update_stock(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    
    movement_type = data['type']  # 'in' ou 'out'
    quantity = int(data['quantity'])
    reason = data.get('reason', '')
    
    if movement_type == 'in':
        product.quantity += quantity
    elif movement_type == 'out':
        if product.quantity < quantity:
            return jsonify({'error': 'Stock insuffisant'}), 400
        product.quantity -= quantity
    
    # Enregistrer le mouvement
    movement = StockMovement(
        product_id=product_id,
        movement_type=movement_type,
        quantity=quantity,
        reason=reason
    )
    
    product.updated_at = datetime.utcnow()
    db.session.add(movement)
    db.session.commit()
    
    return jsonify(product.to_dict())

@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = db.session.query(Product.category).distinct().filter(Product.category != '').all()
    return jsonify([cat[0] for cat in categories if cat[0]])

@app.route('/api/low-stock', methods=['GET'])
def get_low_stock():
    products = Product.query.filter(Product.quantity <= Product.min_stock).all()
    return jsonify([product.to_dict() for product in products])

@app.route('/api/movements', methods=['GET'])
def get_movements():
    movements = StockMovement.query.order_by(StockMovement.created_at.desc()).limit(50).all()
    return jsonify([movement.to_dict() for movement in movements])

@app.route('/api/stats', methods=['GET'])
def get_stats():
    total_products = Product.query.count()
    low_stock_count = Product.query.filter(Product.quantity <= Product.min_stock).count()
    total_value = db.session.query(db.func.sum(Product.quantity * Product.price)).scalar() or 0
    
    return jsonify({
        'total_products': total_products,
        'low_stock_count': low_stock_count,
        'total_value': round(total_value, 2)
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Ajouter des données de test si la base est vide
        if Product.query.count() == 0:
            sample_products = [
                Product(name="Ordinateur portable", description="Dell Inspiron 15", category="Informatique", quantity=25, price=899.99, min_stock=5),
                Product(name="Souris sans fil", description="Logitech MX Master", category="Informatique", quantity=50, price=79.99, min_stock=10),
                Product(name="Clavier mécanique", description="Corsair K70", category="Informatique", quantity=15, price=149.99, min_stock=8),
                Product(name="Écran 24 pouces", description="Samsung Full HD", category="Informatique", quantity=8, price=199.99, min_stock=5),
                Product(name="Smartphone", description="iPhone 14", category="Téléphonie", quantity=12, price=999.99, min_stock=3),
                Product(name="Chargeur USB-C", description="Chargeur rapide 65W", category="Accessoires", quantity=3, price=29.99, min_stock=15),
            ]
            
            for product in sample_products:
                db.session.add(product)
            db.session.commit()
    
    app.run(debug=True, host='0.0.0.0', port=5000)