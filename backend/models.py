from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

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

    # Relation avec les articles
    articles = db.relationship('Article', backref='project', lazy=True)

    # Relation avec les utilisateurs
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

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
            "date_provisoire": self.date_provisoire.isoformat(),
            "user_id": self.user_id
        }

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
    
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firebase_uid = db.Column(db.String(128), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(10), nullable=False)  # "physique" ou "morale"
    nom = db.Column(db.String(100), nullable=True)  # Nom pour personne physique ou représentant
    prenom = db.Column(db.String(100), nullable=True)  # Prénom pour personne physique
    denomination = db.Column(db.String(150), nullable=True)  # Dénomination pour personne morale
    telephone = db.Column(db.String(15), nullable=False)
    adresse = db.Column(db.String(200), nullable=False)

    # Relation avec les projets
    projects = db.relationship('Project', backref='user', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "firebase_uid": self.firebase_uid,
            "email": self.email,
            "type": self.type,
            "nom": self.nom,
            "prenom": self.prenom,
            "denomination": self.denomination,
            "telephone": self.telephone,
            "adresse": self.adresse
        }

