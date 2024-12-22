import React, { useState, useEffect } from "react";
import ArticlesTable from "./ArticlesTable";
import {  saveProject } from "../services/projectService";
import { saveArticle, getArticles } from "../services/articleService";

const EditProjectPage = ({ project, onSave }) => {
  const [formData, setFormData] = useState({
    nom: project.nom || "",
    prenom: project.prenom || "",
    adresse: project.adresse || "",
    telephone: project.telephone || "",
    nomProjet: project.nom_projet || "",
    status: project.status || "Planifié",
    dateCreation: project.date_creation || "",
    dateProvisoire: project.date_provisoire || "",
  });

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesWithTotal = await getArticles(project.id);
        setArticles(articlesWithTotal);
      } catch (error) {
        console.error("Erreur lors du chargement des articles :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [project.id]);

  const handleSaveProject = async () => {
    try {
      await saveProject(project.id, formData);
      alert("Projet sauvegardé avec succès !");
      onSave();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du projet :", error);
      alert("Erreur lors de la sauvegarde du projet.");
    }
  };

  const handleArticleChange = (index, field, value) => {
    const updatedArticles = [...articles];
    updatedArticles[index][field] = value;

    if (field === "quantity" || field === "unit_price") {
      const quantity = updatedArticles[index].quantity || 0;
      const unitPrice = updatedArticles[index].unit_price || 0;
      updatedArticles[index].totalPrice = quantity * unitPrice;
    }

    setArticles(updatedArticles);
  };

  const saveSingleArticle = async (article, index) => {
    try {
      await saveArticle(article, index, project.id, articles, setArticles);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'article :", error);
      alert("Erreur lors de la sauvegarde de l'article.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Modifier le Projet</h2>
      <form>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Nom"
        />
        <input
          type="text"
          name="prenom"
          value={formData.prenom}
          onChange={handleChange}
          placeholder="Prénom"
        />
        <input
          type="text"
          name="adresse"
          value={formData.adresse}
          onChange={handleChange}
          placeholder="Adresse"
        />
        <input
          type="text"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          placeholder="Téléphone"
        />
        <input
          type="text"
          name="nomProjet"
          value={formData.nomProjet}
          onChange={handleChange}
          placeholder="Nom du Projet"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="Planifié">Planifié</option>
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
        </select>
        <input
          type="date"
          name="dateCreation"
          value={formData.dateCreation}
          onChange={handleChange}
        />
        <input
          type="date"
          name="dateProvisoire"
          value={formData.dateProvisoire}
          onChange={handleChange}
        />
      </form>
      <button type="button" onClick={handleSaveProject}>
        Sauvegarder le Projet
      </button>

      <h3>Articles Utilisés</h3>
      <ArticlesTable
        articles={articles}
        onArticleChange={handleArticleChange}
        onSaveArticle={saveSingleArticle}
        projectId = {project.id}
      />
    </div>
  );
};

export default EditProjectPage;