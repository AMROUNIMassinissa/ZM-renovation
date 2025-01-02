from flask import Flask
from flask_cors import CORS
from models import db
from projects.routes import projects_bp
from articles.routes import articles_bp
from users.routes import users_bp
from Facture.facture import facture_bp
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///projects.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Enregistrer les Blueprints
app.register_blueprint(projects_bp)
app.register_blueprint(articles_bp)
app.register_blueprint(users_bp)
app.register_blueprint(facture_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
