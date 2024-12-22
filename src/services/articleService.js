import axios from "axios";

// Fonction pour sauvegarder ou mettre à jour un article
export const saveArticle = async (article, index, articles, setArticles, projectId) => {
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

    if (article.id) {
      // Article existant : PUT pour mettre à jour
      await axios.put(`http://localhost:5000/articles/${article.id}`, articleData);
      alert("Article mis à jour avec succès !");
    } else {
      // Nouvel article : POST pour créer
      const response = await axios.post(
        `http://localhost:5000/projects/${projectId}/articles`,
        [articleData] // Envoyer le tableau contenant l'article
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

export const removeArticle = async (id,articles,setArticles) => {
  try {
    await axios.delete(`http://localhost:5000/articles/${id}`);
    setArticles(articles.filter((article) => article.id !== id));
    alert("Article supprimé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article :", error);
    alert("Erreur lors de la suppression de l'article.");
  }
};

export const getArticles = async (projectId) => {
  const response = await axios.get(`http://localhost:5000/projects/${projectId}/articles`);
  return response.data.map((article) => ({
    ...article,
    totalPrice: article.quantity * article.unit_price,
  }));
};
