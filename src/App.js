import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { fetchProjects, createProject, deleteProject } from "./services/projectService";
import ProjectList from "./components/ProjectList";
import ProjectForm from "./components/ProjectForm";
import EditProjectPage from "./components/EditProjectPage";
import RegisterPage from "./Login/RegisterPage";
import LoginPage from "./Login/LoginPage";
import { auth } from "./services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import "./App.css";
import CompanySettingsPage from "./components/ComapanySettingsPage";

const App = () => {
  const [projects, setProjects] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const response = await axios.get(`http://localhost:5000/users/uid/${currentUser.uid}`);
          const userData = response.data;
          setUserId(userData.id);
          setUser(currentUser);

          // Rediriger vers `/users/<id>/projects` si connecté
          navigate(`/users/${userData.id}/projects`);
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur :", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      console.log(userId);
      loadProjects();
    }
  }, [userId]);

  const loadProjects = async () => {
    try {
      console.log("Fetching projects for user: app", userId);
      const data = await fetchProjects(userId);
      setProjects(data);
    } catch (error) {
      console.error("Erreur lors du chargement des projets :", error);
    }
  };

  const handleCreate = async (project) => {
    try {
      console.log("Creating project for user:", project);
      await createProject(userId,project);
      loadProjects();
      setIsFormVisible(false);
    } catch (error) {
      console.error("Erreur lors de la création du projet :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(userId,id);
      loadProjects();
    } catch (error) {
      console.error("Erreur lors de la suppression du projet :", error);
    }
  };

  const handleEdit = (projectId) => {
    navigate(`users/${userId}/edit/${projectId}`);
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        setUser(null);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion :", error);
      });
  };

  const ProtectedRoute = ({ element }) => {
    if (loading) {
      return <div>Chargement...</div>;
    }
    return user ? element : <Navigate to="/login" />;
  };

  const handleNavigation = () => {
    if (location.pathname === `/users/${userId}/settings`) {
      navigate(`/users/${userId}/projects`);
    } else {
      navigate(`/users/${userId}/settings`);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>ZM Rénovation - Gestion des Projets</h1>
        {user && (
          <div className="header-buttons">
            <button className="settings-button" onClick={handleNavigation}>
              {location.pathname === `/users/${userId}/settings` ? "Accueil" : "Paramètres"}
            </button>
            <button className="logout-button" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        )}
      </header>

      <Routes>
        {/* Route principale */}
        <Route
          path="/"
          element={user ? <Navigate to={`/users/${userId}/projects`} /> : <Navigate to="/login" />}
        />

        {/* Page de connexion */}
        <Route path="/login" element={<LoginPage />} />

        {/* Page d'inscription */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Page des paramètres (protégée) */}
        <Route
          path="/users/:id/settings"
          element={<ProtectedRoute element={<CompanySettingsPage />} />}
        />

        {/* Page principale des projets (protégée) */}
        <Route
          path="/users/:id/projects"
          element={
            <ProtectedRoute
              element={
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
              }
            />
          }
        />

        {/* Page pour éditer un projet (protégée) */}
        <Route
          path="/users/:user_id/edit/:id"
          element={<ProtectedRoute element={<EditProjectPage onSave={loadProjects} userId={userId} />} />}
        />
      </Routes>
    </div>
  );
};

export default App;
