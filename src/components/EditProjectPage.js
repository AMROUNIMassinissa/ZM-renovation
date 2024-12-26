// EditProjectPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Importer useParams pour récupérer l'ID du projet
import { fetchProject, saveProject } from "../services/projectService"; // Importer la fonction de récupération du projet
import ArticlesTable from "./ArticlesTable";
import { saveArticle, getArticles } from "../services/articleService";

const EditProjectPage = ({ onSave }) => {
  const { id } = useParams(); // Récupérer l'ID du projet depuis l'URL
  const [project, setProject] = useState(null); // État pour stocker les données du projet
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    adresse: "",
    telephone: "",
    nomProjet: "",
    status: "Planifié",  // Valeur par défaut
    dateCreation: "",
    dateProvisoire: "",
  });
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);  // Indicateur de chargement

  // Récupérer les données du projet et les articles associés via l'ID
  useEffect(() => {
    const fetchProjectAndArticles = async () => {
      try {
        // Récupérer les données du projet avec l'ID
        const fetchedProject = await fetchProject(id); // Remplacez avec votre fonction pour récupérer un projet par son ID
        setProject(fetchedProject);

        // Pré-remplir le formulaire avec les données du projet
        setFormData({
          nom: fetchedProject.nom,
          prenom: fetchedProject.prenom,
          adresse: fetchedProject.adresse,
          telephone: fetchedProject.telephone,
          nomProjet: fetchedProject.nom_projet,
          status: fetchedProject.status || "Planifié",  // Assurez-vous que la valeur existe dans le projet
          dateCreation: fetchedProject.date_creation,
          dateProvisoire: fetchedProject.date_provisoire,
        });

        // Récupérer les articles associés au projet
        const articlesWithTotal = await getArticles(id);
        setArticles(articlesWithTotal);
      } catch (error) {
        console.error("Erreur lors du chargement du projet ou des articles :", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectAndArticles();
    }
  }, [id]); // Re-exécuter lorsque l'ID change

  const handleSaveProject = async () => {
    try {
      await saveProject(id, formData);
      alert("Projet sauvegardé avec succès !");
      onSave(); // Appeler la fonction onSave après l'enregistrement du projet
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
      await saveArticle(article, index, id, articles, setArticles);
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

  // Si le projet est null ou non chargé, afficher un message d'erreur
  if (!project) {
    return <p>Projet non trouvé.</p>;
  }

  return (
    <div>
      <h2>Modifier le Projet</h2>
      <form>
        <input
          type="text"
          name="nom"
          value={formData.nom || project.nom}
          onChange={handleChange}
          placeholder="Nom"
        />
        <input
          type="text"
          name="prenom"
          value={formData.prenom || project.prenom}
          onChange={handleChange}
          placeholder="Prénom"
        />
        <input
          type="text"
          name="adresse"
          value={formData.adresse || project.adresse}
          onChange={handleChange}
          placeholder="Adresse"
        />
        <input
          type="text"
          name="telephone"
          value={formData.telephone || project.telephone}
          onChange={handleChange}
          placeholder="Téléphone"
        />
        <input
          type="text"
          name="nomProjet"
          value={formData.nomProjet || project.nom_projet}
          onChange={handleChange}
          placeholder="Nom du Projet"
        />
        <select
          name="status"
          value={formData.status || project.status}
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
          value={formData.dateCreation || project.date_creation}
          onChange={handleChange}
        />
        <input
          type="date"
          name="dateProvisoire"
          value={formData.dateProvisoire || project.date_provisoire}
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
        projectId={id}
      />
    </div>
  );
};

export default EditProjectPage;
