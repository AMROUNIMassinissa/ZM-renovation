import React, { useState, useEffect } from "react";
import axios from "axios";
import ProjectList from "./components/ProjectList";
import ProjectForm from "./components/ProjectForm";
import EditProjectPage from "./components/EditProjectPage";

import "./App.css";

const App = () => {
  const [projects, setProjects] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false); // Pour gérer la visibilité du formulaire
  const [editProject, setEditProject] = useState(null);

  // Récupérer les projets automatiquement au démarrage
  useEffect(() => {
    fetchProjects();
  }, []); // Ne s'exécute qu'une seule fois au montage du composant

  // Fonction pour récupérer les projets depuis l'API
  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/projects"); // URL de l'API
      setProjects(response.data); // Met à jour l'état avec les projets récupérés
    } catch (error) {
      console.error("Erreur lors de la récupération des projets :", error);
    }
  };

  // Fonction pour créer un projet
  const handleCreate = async (project) => {
    try {
      await axios.post("http://localhost:5000/projects", project); // Crée un nouveau projet
      fetchProjects(); // Rafraîchit la liste des projets
      setIsFormVisible(false); // Cache le formulaire après la création
    } catch (error) {
      console.error("Erreur lors de la création du projet :", error);
    }
  };

  // Fonction pour supprimer un projet
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/projects/${id}`); // Supprime le projet par ID
      fetchProjects(); // Rafraîchit la liste des projets après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression du projet :", error);
    }
  };

  //Fonction pour modifier un projet
  const handleEdit = (project) => {
    setEditProject(project);
  };

  const handleSave = () => {
    setEditProject(null);
    fetchProjects();
  };

  return (
    <div className="App">
      <h1>ZM Rénovation - Gestion des Projets</h1>

      {/* Vérifie si on est en mode édition */}
      {editProject ? (
        <EditProjectPage project={editProject} onSave={handleSave} />
      ) : (
        <>
          {/* Bouton pour afficher ou masquer le formulaire */}
          <button onClick={() => setIsFormVisible(!isFormVisible)}>
            {isFormVisible ? "Masquer le formulaire" : "Créer un Nouveau Projet"}
          </button>

          {/* Affichage du formulaire de création */}
          {isFormVisible && (
            <div className="project-form-container">
              <h2>Créer un Nouveau Projet</h2>
              <ProjectForm
                onSubmit={handleCreate} // Gère la soumission du formulaire
                onCancel={() => setIsFormVisible(false)} // Cache le formulaire
              />
            </div>
          )}

          {/* Affichage de la liste des projets */}
          <ProjectList projects={projects} onDelete={handleDelete} onEdit={handleEdit} />
        </>
      )}
    </div>
  );
};

export default App;
