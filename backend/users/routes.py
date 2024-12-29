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