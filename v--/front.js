"import React, { useState, useEffect } from "react";
import axios from "axios";

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
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          http://localhost:5000/projects/${project.id}/articles
        );
        const articlesWithTotal = response.data.map((article) => ({
          ...article,
          totalPrice: article.quantity * article.unit_price, // Correction des noms
        }));
        setArticles(articlesWithTotal);
      } catch (error) {
        console.error("Erreur lors du chargement des articles :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [project.id]);

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

  const addArticle = () => {
    setArticles([
      ...articles,
      { description: "", quantity: 0, unit_price: 0, totalPrice: 0 },
    ]);
  };

  const removeArticle = async (id) => {
    try {
      await axios.delete(http://localhost:5000/articles/${id});
      setArticles(articles.filter((article) => article.id !== id));
      alert("Article supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article :", error);
      alert("Erreur lors de la suppression de l'article.");
    }
  };

  const handleSaveProject = async () => {
    try {
      console.log("date ",formData.dateCreation);
      await axios.put(http://localhost:5000/projects/${project.id}, formData);
      alert("Projet sauvegardé avec succès !",project.dateCreation);
      onSave();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du projet :", error);
      alert("Erreur lors de la sauvegarde du projet.");
    }
  };


  const saveSingleArticle = async (article, index) => {
    try {
      // Validation de l'article avant l'envoi
      if (!article.description || article.quantity <= 0 || article.unit_price <= 0) {
        alert("Veuillez remplir tous les champs de l'article correctement.");
        return;
      }
  
      // Préparer les données de l'article pour le backend
      const articleData = {
        description: article.description,
        quantity: article.quantity,
        unit_price: article.unit_price,
        total_price: article.totalPrice, // Facultatif si calculé backend
      };
  
      // Créer un tableau contenant l'article pour envoyer une liste
      const articlesData = [articleData]; // Encapsuler dans un tableau
  
      // Vérifier si l'article a déjà un ID (modification) ou non (nouvel article)
      if (article.id) {
        // Article existant : PUT pour mettre à jour
        await axios.put(http://localhost:5000/articles/${article.id}, articleData);
        alert("Article mis à jour avec succès !");
      } else {
        // Nouvel article : POST pour créer
        const response = await axios.post(
          http://localhost:5000/projects/${project.id}/articles,
          articlesData // Envoyer le tableau contenant l'article
        );
        // Met à jour l'ID de l'article localement avec celui renvoyé par le backend
        const updatedArticles = [...articles];
        updatedArticles[index].id = response.data.id;
        setArticles(updatedArticles);
        alert("Nouvel article sauvegardé avec succès !");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.error) {
          alert(data.error); // Afficher l'erreur renvoyée par le backend
        } else {
          alert("Une erreur inconnue est survenue.");
        }
      } else {
        alert("Erreur réseau ou serveur.");
      }
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
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantité</th>
            <th>Prix Unitaire</th>
            <th>Prix Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article, index) => (
            <tr key={article.id || index}>
              <td>
                <input
                  type="text"
                  value={article.description}
                  onChange={(e) =>
                    handleArticleChange(index, "description", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={article.quantity}
                  min="0"
                  onChange={(e) =>
                    handleArticleChange(index, "quantity", Number(e.target.value))
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={article.unit_price}
                  min="0"
                  step="0.01"
                  onChange={(e) =>
                    handleArticleChange(index, "unit_price", Number(e.target.value))
                  }
                />
              </td>
              <td>{article.totalPrice.toFixed(2)}</td>
              <td>
                {/* Si l'article a un ID, afficher "Modifier", sinon "Sauvegarder" */}
              <button
              type="button"
              onClick={() => saveSingleArticle(article, index)} // Sauvegarder ou modifier selon l'article
              >
              {article.id ? "Modifier" : "Sauvegarder"}
              </button>
                {article.id ? (
                  <button type="button" onClick={() => removeArticle(article.id)}>
                    Supprimer
                  </button>
                ) : (
                  <button type="button" onClick={() => addArticle()}>
                    Nouveau
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addArticle}>
        Ajouter un Article
      </button>
    </div>
  );
};

export default EditProjectPage;"

ChatGPT a dit :
ChatGPT