// App.js
import React, { useState, useEffect } from "react";
import {
  fetchProjects,
  createProject,
  deleteProject,
} from "./services/projectService";
import ProjectList from "./components/ProjectList";
import ProjectForm from "./components/ProjectForm";
import EditProjectPage from "./components/EditProjectPage";
import "./App.css";

const App = () => {
  const [projects, setProjects] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false); // Pour gérer la visibilité du formulaire
  const [editProject, setEditProject] = useState(null);

  // Récupérer les projets au chargement du composant
  useEffect(() => {
    loadProjects();
  }, []);

  // Fonction pour charger les projets via l'API
  const loadProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (error) {
      console.error("Erreur lors du chargement des projets :", error);
    }
  };

  // Gérer la création d'un projet
  const handleCreate = async (project) => {
    try {
      await createProject(project);
      loadProjects();
      setIsFormVisible(false);
    } catch (error) {
      console.error("Erreur lors de la création du projet :", error);
    }
  };

  // Gérer la suppression d'un projet
  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      loadProjects();
    } catch (error) {
      console.error("Erreur lors de la suppression du projet :", error);
    }
  };

  // Gérer l'édition d'un projet
  const handleEdit = (project) => {
    setEditProject(project);
  };

  const handleSave = () => {
    setEditProject(null);
    loadProjects();
  };

  return (
    <div className="App">
      <h1>ZM Rénovation - Gestion des Projets</h1>

      {editProject ? (
        <EditProjectPage project={editProject} onSave={handleSave} />
      ) : (
        <>
          <button onClick={() => setIsFormVisible(!isFormVisible)}>
            {isFormVisible ? "Masquer le formulaire" : "Créer un Nouveau Projet"}
          </button>

          {isFormVisible && (
            <div className="project-form-container">
              <h2>Créer un Nouveau Projet</h2>
              <ProjectForm
                onSubmit={handleCreate}
                onCancel={() => setIsFormVisible(false)}
              />
            </div>
          )}

          <ProjectList
            projects={projects}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </>
      )}
    </div>
  );
};

export default App;