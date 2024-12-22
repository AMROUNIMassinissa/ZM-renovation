import pytest
from app import app, db, Project

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app_context = app.app_context()
    app_context.push()

    # Configurer une base de données temporaire
    db.create_all()

    yield app.test_client()

    # Nettoyer après les tests
    db.session.remove()
    db.drop_all()
    app_context.pop()

def test_get_projects(client):
    # Ajouter un projet de test
    project = Project(
        nom="Test Nom",
        prenom="Test Prenom",
        adresse="Test Adresse",
        telephone="1234567890",
        nom_projet="Test Project",
        status="En cours",
        date_creation="2024-01-01",
        date_provisoire="2024-12-31"
    )
    db.session.add(project)
    db.session.commit()

    # Faire une requête GET
    response = client.get('/projects')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]['nom'] == "Test Nom"


