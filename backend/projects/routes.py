from flask import Blueprint, jsonify, request
from models import db, Project,Article
from datetime import datetime

# Définir un Blueprint pour les routes des projets
projects_bp = Blueprint('projects', __name__)

# Route pour récupérer tous les projets
@projects_bp.route('/projects', methods=['GET'])
def get_projects():
    """
    Récupère la liste de tous les projets.
    """
    projects = Project.query.all()  # Requête pour récupérer tous les projets
    return jsonify([project.to_dict() for project in projects])  # Retourner les projets en format JSON

# Route pour récupérer un projet spécifique
@projects_bp.route('/projects/<int:id>', methods=['GET'])
def get_project(id):
    """
    Récupère un projet spécifique par son ID.
    """
    project = Project.query.get(id)  # Recherche du projet par son ID
    if project is None:
        return jsonify({"error": "Projet non trouvé"}), 404  # Si le projet n'est pas trouvé, renvoyer une erreur
    return jsonify(project.to_dict())  # Retourner le projet trouvé en format JSON

# Route pour ajouter un nouveau projet
@projects_bp.route('/projects', methods=['POST'])
def add_project():
    """
    Ajoute un nouveau projet à la base de données.
    """
    data = request.json  # Récupère les données JSON envoyées par le client

    # Vérifier que tous les champs requis sont présents
    required_fields = ['nom', 'prenom', 'adresse', 'telephone', 'nomProjet', 'status', 'dateCreation', 'dateProvisoire']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Tous les champs requis doivent être fournis"}), 400

    try:
        # Créer une nouvelle instance de Project avec les données reçues
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
        db.session.add(new_project)  # Ajouter le projet à la session de la base de données
        db.session.commit()  # Enregistrer les changements dans la base
        return jsonify(new_project.to_dict()), 201  # Retourner le projet ajouté avec un code HTTP 201
    except Exception as e:
        return jsonify({"error": f"Erreur lors de l'ajout du projet : {str(e)}"}), 500


# Route pour mettre à jour un projet existant
@projects_bp.route('/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    """
    Met à jour les informations d'un projet spécifique.
    """
    data = request.json  # Récupère les données JSON envoyées par le client

    try:
        # Rechercher le projet par ID, retourne 404 si non trouvé
        project = Project.query.get_or_404(project_id)

        # Mettre à jour les champs si présents dans les données envoyées
        project.nom = data.get('nom', project.nom)
        project.prenom = data.get('prenom', project.prenom)
        project.adresse = data.get('adresse', project.adresse)
        project.telephone = data.get('telephone', project.telephone)
        project.nom_projet = data.get('nomProjet', project.nom_projet)
        project.status = data.get('status', project.status)
        project.date_creation = datetime.strptime(data.get('dateCreation', project.date_creation.isoformat()), '%Y-%m-%d').date()
        project.date_provisoire = datetime.strptime(data.get('dateProvisoire', project.date_provisoire.isoformat()), '%Y-%m-%d').date()

        db.session.commit()  # Enregistrer les changements
        return jsonify(project.to_dict()), 200  # Retourner le projet mis à jour
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la mise à jour du projet : {str(e)}"}), 500


@projects_bp.route('/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    """
    Supprime un projet spécifique de la base de données.
    """
    try:
        # Rechercher le projet
        project = Project.query.get_or_404(project_id)

        # Vérifier et supprimer les articles liés si nécessaire
        related_articles = Article.query.filter_by(project_id=project_id).all()
        for article in related_articles:
            db.session.delete(article)

        # Supprimer le projet
        db.session.delete(project)
        db.session.commit()

        return jsonify({"message": "Projet supprimé avec succès"}), 200
    except Exception as e:
        #app.logger.error(f"Erreur lors de la suppression du projet {project_id}: {e}")
        return jsonify({"error": "Erreur serveur", "details": str(e)}), 500