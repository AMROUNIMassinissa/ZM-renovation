import React, { useState, useEffect } from "react";
import { saveArticle,removeArticle,getArticles } from "../services/articleService";



const ArticlesTable = ({
  projectId

  
}) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
       const fetchArticles = async () => {
         try {
           const articlesWithTotal = await getArticles(projectId);
           setArticles(articlesWithTotal);
         } catch (error) {
           console.error("Erreur lors du chargement des articles :", error);
         } finally {
           setLoading(false);
         }
       };
       fetchArticles();
     }, [projectId]);
    

    const handleSaveArticle = (article, index) => {
        saveArticle(article, index, articles, setArticles, projectId); 
      };

    const handleDeleteArticle = (index)=> {
        removeArticle(index,articles,setArticles)
    }

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
  return (
    <div>
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
              <button
                type="button"
                onClick={() => handleSaveArticle(article, index)}
              >
                {article.id ? "Modifier" : "Sauvegarder"}
              </button>
              {article.id && (
                <button type="button" onClick={() => handleDeleteArticle(article.id)}>
                  Supprimer
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

export default ArticlesTable;