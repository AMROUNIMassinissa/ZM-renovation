import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { fetchProjects, createProject, deleteProject } from "./services/projectService";
import ProjectList from "./components/ProjectList";
import ProjectForm from "./components/ProjectForm";
import EditProjectPage from "./components/EditProjectPage";
import RegisterPage from "./Login/RegisterPage";
import LoginPage from "./Login/LoginPage";
import { auth } from "./services/firebase"; // Import Firebase Auth
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import "./App.css";

const App = () => {
  const [projects, setProjects] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [user, setUser] = useState(null); // État pour l'utilisateur connecté
  const [loading, setLoading] = useState(true); // Pour gérer l'état de chargement de l'utilisateur

  // Vérifier si l'utilisateur est authentifié au montage du composant
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Si l'utilisateur est authentifié, mettez-le à jour dans l'état
      } else {
        setUser(null); // Sinon, réinitialisez l'état utilisateur
      }
      setLoading(false); // Une fois que la vérification est terminée, arrêtez le chargement
    });

    // Nettoyez l'abonnement à la fin
    return () => unsubscribe();
  }, []);

  // Charger les projets si l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (error) {
      console.error("Erreur lors du chargement des projets :", error);
    }
  };

  const handleCreate = async (project) => {
    try {
      await createProject(project);
      loadProjects();
      setIsFormVisible(false);
    } catch (error) {
      console.error("Erreur lors de la création du projet :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      loadProjects();
    } catch (error) {
      console.error("Erreur lors de la suppression du projet :", error);
    }
  };

  const handleEdit = (projectId) => {
    Navigate(`/edit/${projectId}`);
  };

  // Gestion de la déconnexion
  const handleLogout = () => {
    setUser(null); // Réinitialiser l'utilisateur
  };

  // Composant pour protéger les routes
  const ProtectedRoute = ({ element }) => {
    if (loading) {
      return <div>Chargement...</div>; // Afficher un écran de chargement tant que l'état de l'utilisateur est en cours de récupération
    }

    return user ? element : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>ZM Rénovation - Gestion des Projets</h1>
        {user && (
          <button className="logout-button" onClick={handleLogout}>
            Déconnexion
          </button>
        )}
      </header>

      <Routes>
        {/* Page de connexion */}
        <Route path="/login" element={<LoginPage />} />

        {/* Page d'inscription */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Page principale (protégée) */}
        <Route
          path="/"
          element={
            <ProtectedRoute
              element={
                <>
                  <button onClick={() => setIsFormVisible(!isFormVisible)}>
                    {isFormVisible
                      ? "Masquer le formulaire"
                      : "Créer un Nouveau Projet"}
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
              }
            />
          }
        />

        {/* Page pour éditer un projet (protégée) */}
        <Route
          path="/edit/:id"
          element={<ProtectedRoute element={<EditProjectPage onSave={loadProjects} />} />}
        />
      </Routes>
    </div>
  );
};

export default App;
