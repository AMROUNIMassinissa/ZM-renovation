from flask import Blueprint, jsonify, request
from models import db, User
from werkzeug.security import generate_password_hash

users_bp = Blueprint('auth', __name__)

# Route pour ajouter un utilisateur
@users_bp.route('/register', methods=['POST'])
def register_user():
    """
    Enregistre un nouvel utilisateur.
    """
    data = request.json  # Récupère les données JSON envoyées par le client

    # Vérifier que tous les champs requis sont présents
    required_fields = ['firebase_uid','email', 'password', 'type', 'telephone', 'adresse']
    if data['type'] == 'morale' and 'denomination' not in data:
        return jsonify({"error": "Le champ 'denomination' est requis pour un utilisateur de type 'morale'"}), 400

    if not all(field in data for field in required_fields):
        return jsonify({"error": "Tous les champs requis doivent être fournis"}), 400


    try:
        # Créer une nouvelle instance de User avec les données reçues
        hashed_password = generate_password_hash(data['password'])
        new_user = User(
            firebase_uid=data['firebase_uid'],
            email=data['email'],
            password = hashed_password, 
            type=data['type'],
            nom=data.get('nom'),
            prenom=data.get('prenom'),
            denomination=data.get('denomination'),  # Le champ denomination peut être optionnel
            telephone=data['telephone'],
            adresse=data['adresse']
        )

        db.session.add(new_user)  # Ajouter l'utilisateur à la session de la base de données
        db.session.commit()  # Enregistrer les changements dans la base
        return jsonify(new_user.to_dict()), 201  # Retourner l'utilisateur ajouté avec un code HTTP 201

    except Exception as e:
        return jsonify({"error": f"Erreur lors de l'ajout de l'utilisateur : {str(e)}"}), 500

@users_bp.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()  # Récupère tous les utilisateurs
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@users_bp.route('/users/uid/<firebase_uid>', methods=['GET'])
def get_user_by_uid(firebase_uid):
    """
    Récupère un utilisateur par son UID Firebase.
    """
    try:
        user = User.query.filter_by(firebase_uid=firebase_uid).first()
        if not user:
            return jsonify({"error": "Utilisateur non trouvé"}), 404
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@users_bp.route('/users/<id>', methods=['GET'])
def get_user_by_uid_(id):
    print(id)
    """
    Récupère un utilisateur par son UID Firebase.
    """
    try:
        user = User.query.filter_by(id=id).first()
        if not user:
            return jsonify({"error": "Utilisateur non trouvé"}), 404
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@users_bp.route('/users/<id>', methods=['PUT'])
def update_user(id):
    """
    Met à jour les informations d'un utilisateur par son ID.
    """
    try:
        data = request.json  # Récupère les données JSON envoyées par le client

        # Vérification des données reçues
        if not data:
            return jsonify({"error": "Aucune donnée reçue"}), 400

        # Récupérer l'utilisateur existant dans la base de données
        user = User.query.filter_by(id=id).first()
        if not user:
            return jsonify({"error": "Utilisateur non trouvé"}), 404

        # Mettre à jour les champs modifiables
        if 'email' in data:
            user.email = data['email']
        if 'nom' in data:
            user.nom = data['nom']
        if 'prenom' in data:
            user.prenom = data['prenom']
        if 'denomination' in data:
            user.denomination = data['denomination']
        if 'telephone' in data:
            user.telephone = data['telephone']
        if 'adresse' in data:
            user.adresse = data['adresse']
        if 'password' in data:
            hashed_password = generate_password_hash(data['password'])
            user.password = hashed_password

        # Sauvegarder les modifications dans la base de données
        db.session.commit()

        return jsonify(user.to_dict()), 200

    except Exception as e:
        db.session.rollback()  # Annuler les modifications en cas d'erreur
        return jsonify({"error": f"Erreur lors de la mise à jour de l'utilisateur : {str(e)}"}), 500