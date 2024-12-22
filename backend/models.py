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
