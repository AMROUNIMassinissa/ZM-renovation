from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Configuration de la base de données SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///projects.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialiser SQLAlchemy
db = SQLAlchemy(app)

# Modèle de la table Project
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100), nullable=False)
    adresse = db.Column(db.String(200), nullable=False)
    telephone = db.Column(db.String(15), nullable=False)
    nom_projet = db.Column(db.String(150), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    date_creation = db.Column(db.Date, nullable=False)
    date_provisoire = db.Column(db.Date, nullable=False)

    articles = db.relationship('Article', backref='project', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "nom": self.nom,
            "prenom": self.prenom,
            "adresse": self.adresse,
            "telephone": self.telephone,
            "nom_projet": self.nom_projet,
            "status": self.status,
            "date_creation": self.date_creation.isoformat(),
            "date_provisoire": self.date_provisoire.isoformat()
        }

# Modèle de la table Article
class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "description": self.description,
            "quantity": self.quantity,
            "unit_price": self.unit_price,
            "total_price": self.total_price,
            "project_id": self.project_id
        }

# Route pour obtenir tous les projets
@app.route('/projects', methods=['GET'])
def get_projects():
    projects = Project.query.all()
    return jsonify([project.to_dict() for project in projects])

# Route pour ajouter un projet
@app.route('/projects', methods=['POST'])
def add_project():
    data = request.json
    try:
        required_fields = ['nom', 'prenom', 'adresse', 'telephone', 'nomProjet', 'status', 'dateCreation', 'dateProvisoire']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Tous les champs requis doivent être fournis"}), 400

        new_project = Project(
            nom=data['nom'],
            prenom=data['prenom'],
            adresse=data['adresse'],
            telephone=data['telephone'],
            nom_projet=data['nomProjet'],
            status=data['status'],
            date_creation=datetime.strptime(data['dateCreation'], '%Y-%m-%d').date(),
            date_provisoire=datetime.strptime(data['dateProvisoire'], '%Y-%m-%d').date()
        )
        db.session.add(new_project)
        db.session.commit()
        return jsonify(new_project.to_dict()), 201
    except Exception as e:
        print(f"Erreur: {e}")
        return jsonify({"error": "Erreur lors de l'ajout du projet"}), 500

# Route pour mettre à jour un projet
@app.route('/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    data = request.json
    try:
        project = Project.query.get_or_404(project_id)

        project.nom = data.get('nom', project.nom)
        project.prenom = data.get('prenom', project.prenom)
        project.adresse = data.get('adresse', project.adresse)
        project.telephone = data.get('telephone', project.telephone)
        project.nom_projet = data.get('nomProjet', project.nom_projet)
        project.status = data.get('status', project.status)
        project.date_creation = datetime.strptime(data.get('dateCreation', project.date_creation.isoformat()), '%Y-%m-%d').date()
        project.date_provisoire = datetime.strptime(data.get('dateProvisoire', project.date_provisoire.isoformat()), '%Y-%m-%d').date()

        db.session.commit()
        return jsonify(project.to_dict()), 200
    except Exception as e:
        print(f"Erreur: {e}")
        return jsonify({"error": "Erreur lors de la mise à jour du projet"}), 500

# Route pour supprimer un projet
@app.route('/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    try:
        project = Project.query.get_or_404(project_id)
        db.session.delete(project)
        db.session.commit()
        return jsonify({"message": "Projet supprimé avec succès"}), 200
    except Exception as e:
        print(f"Erreur: {e}")
        return jsonify({"error": "Erreur lors de la suppression du projet"}), 500

# Route pour ajouter des articles à un projet
# Exemple backend générique
@app.route('/projects/<int:project_id>/articles', methods=['POST'])
def save_articles(project_id):
    # Récupérer les données envoyées par le frontend
    data = request.get_json()

    # Vérifier que les données sont bien une liste
    if not isinstance(data, list):
        return jsonify({"error": "Les données doivent être une liste d'articles."}), 400

    for article in data:
        # Vérifier que les champs nécessaires sont présents et valides
        if not article.get('description'):
            return jsonify({"error": "La description de l'article est requise."}), 400
        if not isinstance(article.get('quantity'), (int, float)) or article['quantity'] <= 0:
            return jsonify({"error": "La quantité de l'article doit être un nombre positif."}), 400
        if not isinstance(article.get('unit_price'), (int, float)) or article['unit_price'] <= 0:
            return jsonify({"error": "Le prix unitaire de l'article doit être un nombre positif."}), 400
        
        # Vérifier si l'article existe déjà pour ce projet
        existing_article = db.session.query(Article).filter(
            Article.description == article['description'],
            Article.project_id == project_id
        ).first()

        if existing_article:
            return jsonify({"error": f"Article '{article['description']}' déjà existant pour ce projet."}), 400

        # Calculer le total_price si ce n'est pas déjà fait
        total_price = article.get('total_price') or (article['quantity'] * article['unit_price'])

        # Créer un nouvel article avec les données validées
        new_article = Article(
            description=article['description'],
            quantity=article['quantity'],
            unit_price=article['unit_price'],
            total_price=total_price,  # Utilisation de total_price calculé ou passé dans la requête
            project_id=project_id
        )
        
        # Ajouter l'article à la session de la base de données
        db.session.add(new_article)

    # Committer les changements dans la base de données
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()  # En cas d'erreur, annuler les changements
        print("am here")
        return jsonify({"error": "Erreur lors de la sauvegarde des articles.", "details": str(e)}), 500

    # Retourner une réponse de succès
    return jsonify({"message": "Articles ajoutés avec succès"}), 201

@app.route('/articles/<int:article_id>', methods=['PUT'])
def update_article(article_id):
    # Récupérer l'article existant dans la base de données
    article = db.session.query(Article).get(article_id)
    
    if not article:
        return jsonify({"error": "Article non trouvé."}), 404

    # Récupérer les données envoyées par le frontend
    data = request.get_json()

    # Vérifier que les champs nécessaires sont valides
    if not data.get('description'):
        return jsonify({"error": "La description de l'article est requise."}), 400
    if not isinstance(data.get('quantity'), (int, float)) or data['quantity'] <= 0:
        return jsonify({"error": "La quantité de l'article doit être un nombre positif."}), 400
    if not isinstance(data.get('unit_price'), (int, float)) or data['unit_price'] <= 0:
        return jsonify({"error": "Le prix unitaire de l'article doit être un nombre positif."}), 400

    # Mettre à jour l'article dans la base de données
    article.description = data['description']
    article.quantity = data['quantity']
    article.unit_price = data['unit_price']
    article.total_price = article.quantity * article.unit_price  # Recalculer le total_price

    # Committer les changements dans la base de données
    try:
        db.session.commit()
        return jsonify({"message": "Article mis à jour avec succès."}), 200
    except Exception as e:
        db.session.rollback()  # En cas d'erreur, annuler les changements
        return jsonify({"error": "Erreur lors de la mise à jour de l'article.", "details": str(e)}), 500

# Route pour récupérer les articles d'un projet
@app.route('/projects/<int:project_id>/articles', methods=['GET'])
def get_articles(project_id):
    project = Project.query.get_or_404(project_id)
    return jsonify([article.to_dict() for article in project.articles])

# Route pour supprimer un article
@app.route('/articles/<int:id>', methods=['DELETE'])
def delete_article(id):
    try:
        article = Article.query.get_or_404(id)
        db.session.delete(article)
        db.session.commit()
        return jsonify({"message": "Article supprimé avec succès"}), 200
    except Exception as e:
        print(f"Erreur: {e}")
        return jsonify({"error": "Erreur lors de la suppression de l'article"}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
"