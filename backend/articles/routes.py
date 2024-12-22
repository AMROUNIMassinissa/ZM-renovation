from flask import Blueprint, jsonify, request
from models import db, Article,Project

# Définir un Blueprint pour les routes des articles
articles_bp = Blueprint('articles', __name__)

# Route pour ajouter des articles à un projet
@articles_bp.route('/projects/<int:project_id>/articles', methods=['POST'])
def save_articles(project_id):
    """
    Ajoute plusieurs articles pour un projet donné.
    """
    data = request.get_json()  # Récupérer les données envoyées par le client

    # Vérifier que les données sont une liste
    if not isinstance(data, list):
        return jsonify({"error": "Les données doivent être une liste d'articles."}), 400

    try:
        for article in data:
            # Créer un nouvel article
            new_article = Article(
                description=article['description'],
                quantity=article['quantity'],
                unit_price=article['unit_price'],
                total_price=article['quantity'] * article['unit_price'],
                project_id=project_id
            )
            db.session.add(new_article)  # Ajouter l'article à la session

        db.session.commit()  # Enregistrer les articles dans la base
        return jsonify({"message": "Articles ajoutés avec succès"}), 201
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la sauvegarde des articles : {str(e)}"}), 500


# Route pour mettre à jour un article
@articles_bp.route('/articles/<int:article_id>', methods=['PUT'])
def update_article(article_id):
    """
    Met à jour un article spécifique.
    """
    article = Article.query.get_or_404(article_id)  # Rechercher l'article
    data = request.get_json()  # Récupérer les données envoyées

    try:
        # Mettre à jour les champs de l'article
        article.description = data['description']
        article.quantity = data['quantity']
        article.unit_price = data['unit_price']
        article.total_price = article.quantity * article.unit_price

        db.session.commit()  # Enregistrer les changements
        return jsonify({"message": "Article mis à jour avec succès"}), 200
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la mise à jour de l'article : {str(e)}"}), 500


# Route pour supprimer un article
@articles_bp.route('/articles/<int:article_id>', methods=['DELETE'])
def delete_article(article_id):
    """
    Supprime un article spécifique.
    """
    article = Article.query.get_or_404(article_id)  # Rechercher l'article

    try:
        db.session.delete(article)  # Supprimer l'article
        db.session.commit()  # Enregistrer les changements
        return jsonify({"message": "Article supprimé avec succès"}), 200
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la suppression de l'article : {str(e)}"}), 500

# Route pour récupérer les articles d'un projet spécifique
@articles_bp.route('/projects/<int:project_id>/articles', methods=['GET'])
def get_articles(project_id):
    # Récupérer le projet à partir de l'ID
    project = Project.query.get_or_404(project_id)
    
    # Récupérer tous les articles associés à ce projet
    articles = project.articles  # Utilisation de la relation définie dans le modèle
    
    # Retourner les articles sous forme de liste de dictionnaires
    return jsonify([article.to_dict() for article in articles]), 200