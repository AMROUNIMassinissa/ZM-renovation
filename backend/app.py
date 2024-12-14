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
        new_project = Project(
            nom=data['nom'],
            prenom=data['prenom'],
            adresse=data['adresse'],
            telephone=data['telephone'],
            nom_projet=data['nomProjet'],
            status=data['status'],
            date_creation=datetime.strptime(data['dateCreation'], '%Y-%m-%d'),
            date_provisoire=datetime.strptime(data['dateProvisoire'], '%Y-%m-%d')
        )
        db.session.add(new_project)
        db.session.commit()
        return jsonify(new_project.to_dict()), 201
    except Exception as e:
        print(f"Erreur: {e}")
        return jsonify({"error": "Erreur lors de l'ajout du projet"}), 500
    
# Route pour supprimer un projet
@app.route('/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    try:
        project = Project.query.get(project_id)
        if not project:
            return jsonify({"error": "Projet non trouvé"}), 404
        db.session.delete(project)
        db.session.commit()
        return jsonify({"message": "Projet supprimé avec succès"}), 200
    except Exception as e:
        print(f"Erreur: {e}")
        return jsonify({"error": "Erreur lors de la suppression du projet"}), 500


@app.route('/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    data = request.json
    try:
        project = Project.query.get(project_id)
        if not project:
            return jsonify({"error": "Projet non trouvé"}), 404
        
        # Mise à jour des champs
        project.nom = data.get('nom', project.nom)
        project.prenom = data.get('prenom', project.prenom)
        project.adresse = data.get('adresse', project.adresse)
        project.telephone = data.get('telephone', project.telephone)
        project.nom_projet = data.get('nomProjet', project.nom_projet)
        project.status = data.get('status', project.status)
        project.date_creation = datetime.strptime(data.get('dateCreation', project.date_creation.isoformat()), '%Y-%m-%d')
        project.date_provisoire = datetime.strptime(data.get('dateProvisoire', project.date_provisoire.isoformat()), '%Y-%m-%d')

        db.session.commit()
        return jsonify(project.to_dict()), 200
    except Exception as e:
        print(f"Erreur: {e}")
        return jsonify({"error": "Erreur lors de la mise à jour du projet"}), 500

if __name__ == '__main__':
    # Créer la base de données et la table si elles n'existent pas déjà
    with app.app_context():
        db.create_all()
    
    app.config['DEBUG'] = True
    app.run(debug=True)
