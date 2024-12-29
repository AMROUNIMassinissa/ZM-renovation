import axios from "axios";
import { use } from "react";

// Base URL
const API_URL = "http://localhost:5000/users";

// Récupérer tous les projets d'un utilisateur
export const fetchProjects = async (userId) => {
  try {
    console.log("Fetching projects for user:", userId);
    const response = await axios.get(`${API_URL}/${userId}/projects`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
    throw error;
  }
};

// Récupérer un projet spécifique pour un utilisateur
export const fetchProject = async (userId, projectId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du projet :", error);
    throw error;
  }
};

// Créer un nouveau projet pour un utilisateur
export const createProject = async (userId, project) => {
  try {
    console.log("Creating project for user:", userId);

    // Renommer les clés pour correspondre aux attentes du backend
    const payload = {
      nom: project.nom,
      prenom: project.prenom,
      adresse: project.adresse,
      telephone: project.telephone,
      nom_projet: project.nomProjet, // Mapping correct
      status: project.status,
      date_creation: project.dateCreation, // Mapping correct
      date_provisoire: project.dateProvisoire, // Mapping correct
      user_id: userId, // Inclure le userId
    };

    console.log("Payload envoyé :", payload); // Log pour débogage
    await axios.post(`${API_URL}/${userId}/projects`, payload);
  } catch (error) {
    console.error("Erreur lors de la création du projet :", error.response?.data || error.message);
    throw error;
  }
};


// Supprimer un projet spécifique d'un utilisateur
export const deleteProject = async (userId, projectId) => {
  try {
    await axios.delete(`${API_URL}/${userId}/projects/${projectId}`);
  } catch (error) {
    console.error("Erreur lors de la suppression du projet :", error);
    throw error;
  }
};

// Mettre à jour un projet spécifique pour un utilisateur
export const updateProject = async (userId, projectId, project) => {
  try {
    await axios.put(`${API_URL}/${userId}/projects/${projectId}`, project);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet :", error);
    throw error;
  }
};

// Sauvegarder un projet existant
export const saveProject = async (userId, projectId, formData) => {
  try {
    await axios.put(`${API_URL}/${userId}/projects/${projectId}`, formData);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du projet :", error);
    throw error;
  }
};
