import axios from "axios";



export const saveProject = async (projectId, formData) => {
  await axios.put(`http://localhost:5000/projects/${projectId}`, formData);
};
// projectService.js

const API_URL = "http://localhost:5000/projects";

// Récupérer tous les projets
export const fetchProjects = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
    throw error;
  }
};

// Créer un nouveau projet
export const createProject = async (project) => {
  try {
    await axios.post(API_URL, project);
  } catch (error) {
    console.error("Erreur lors de la création du projet :", error);
    throw error;
  }
};

// Supprimer un projet
export const deleteProject = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Erreur lors de la suppression du projet :", error);
    throw error;
  }
};

// Mettre à jour un projet (si besoin)
export const updateProject = async (id, project) => {
  try {
    await axios.put(`${API_URL}/${id}`, project);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet :", error);
    throw error;
  }
};

