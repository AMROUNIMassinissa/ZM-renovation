from flask import Blueprint, jsonify, request
from models import db, Project, Article, User
from datetime import datetime

# Définir un Blueprint pour les routes des projets
projects_bp = Blueprint('projects', __name__)

# Route pour récupérer les projets d'un utilisateur spécifique
@projects_bp.route('/users/<int:user_id>/projects', methods=['GET'])
def get_user_projects(user_id):
    """
    Récupère la liste des projets d'un utilisateur spécifique.
    """
    try:
        projects = Project.query.filter_by(user_id=user_id).all()  # Filtrer les projets par user_id
        return jsonify([project.to_dict() for project in projects]), 200
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la récupération des projets : {str(e)}"}), 500
    
@projects_bp.route('/users/uid/<string:firebase_uid>', methods=['GET'])
def get_user_by_uid(firebase_uid):
    user = User.query.filter_by(firebase_uid=firebase_uid).first()
    if user:
        return jsonify({"id": user.id, "name": user.nom, "email": user.email})
    else:
        return jsonify({"error": "User not found"}), 404

# Route pour récupérer un projet spécifique pour un utilisateur
@projects_bp.route('/users/<int:user_id>/projects/<int:project_id>', methods=['GET'])
def get_user_project(user_id, project_id):
    """
    Récupère un projet spécifique par son ID pour un utilisateur donné.
    """
    try:
        project = Project.query.filter_by(user_id=user_id, id=project_id).first()
        if not project:
            return jsonify({"error": "Projet non trouvé pour cet utilisateur"}), 404
        return jsonify(project.to_dict()), 200
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la récupération du projet : {str(e)}"}), 500


# Route pour ajouter un nouveau projet pour un utilisateur spécifique
@projects_bp.route('/users/<int:user_id>/projects', methods=['POST'])
def add_user_project(user_id):
    """
    Ajoute un nouveau projet pour un utilisateur spécifique.
    """
    print(request.json)
    data = request.json  # Récupère les données JSON envoyées par le client

    # Vérifier que tous les champs requis sont présents
    required_fields = ['nom', 'prenom', 'adresse', 'telephone', 'nom_projet', 'status', 'date_creation', 'date_provisoire', 'user_id']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Tous les champs requis doivent être fournis"}), 400

    try:
        # Vérifier si l'utilisateur existe
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Utilisateur non trouvé"}), 404

        # Créer une nouvelle instance de Project avec les données reçues
        new_project = Project(
            nom=data['nom'],
            prenom=data['prenom'],
            adresse=data['adresse'],
            telephone=data['telephone'],
            nom_projet=data['nom_projet'],
            status=data['status'],
            date_creation=datetime.strptime(data['date_creation'], '%Y-%m-%d').date(),
            date_provisoire=datetime.strptime(data['date_provisoire'], '%Y-%m-%d').date(),
            user_id=user_id  # Lien avec l'utilisateur
        )
        db.session.add(new_project)  # Ajouter le projet à la session de la base de données
        db.session.commit()  # Enregistrer les changements dans la base
        return jsonify(new_project.to_dict()), 201
    except Exception as e:
        return jsonify({"error": f"Erreur lors de l'ajout du projet : {str(e)}"}), 500


# Route pour mettre à jour un projet d'un utilisateur spécifique
@projects_bp.route('/users/<int:user_id>/projects/<int:project_id>', methods=['PUT'])
def update_user_project(user_id, project_id):
    """
    Met à jour les informations d'un projet spécifique pour un utilisateur donné.
    """
    data = request.json  # Récupère les données JSON envoyées par le client

    try:
        # Rechercher le projet par ID et user_id, retourne 404 si non trouvé
        project = Project.query.filter_by(user_id=user_id, id=project_id).first()
        if not project:
            return jsonify({"error": "Projet non trouvé pour cet utilisateur"}), 404

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
        return jsonify(project.to_dict()), 200
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la mise à jour du projet : {str(e)}"}), 500


# Route pour supprimer un projet d'un utilisateur spécifique
@projects_bp.route('/users/<int:user_id>/projects/<int:project_id>', methods=['DELETE'])
def delete_user_project(user_id, project_id):
    """
    Supprime un projet spécifique d'un utilisateur donné.
    """
    try:
        # Rechercher le projet par ID et user_id
        project = Project.query.filter_by(user_id=user_id, id=project_id).first()
        if not project:
            return jsonify({"error": "Projet non trouvé pour cet utilisateur"}), 404

        # Vérifier et supprimer les articles liés si nécessaire
        related_articles = Article.query.filter_by(project_id=project_id).all()
        for article in related_articles:
            db.session.delete(article)

        # Supprimer le projet
        db.session.delete(project)
        db.session.commit()

        return jsonify({"message": "Projet supprimé avec succès"}), 200
    except Exception as e:
        return jsonify({"error": f"Erreur serveur : {str(e)}"}), 500