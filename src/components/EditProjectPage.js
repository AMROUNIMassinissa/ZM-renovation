import React, { useState } from "react";
import axios from "axios";

const EditProjectPage = ({ project, onSave }) => {
  const [formData, setFormData] = useState({
    nom: project.nom,
    prenom: project.prenom,
    adresse: project.adresse,
    telephone: project.telephone,
    nomProjet: project.nom_projet,
    status: project.status,
    dateCreation: project.date_creation,
    dateProvisoire: project.date_provisoire,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/projects/${project.id}`, formData);
      onSave(); // Action après la sauvegarde
    } catch (error) {
      console.error("Erreur lors de la modification du projet :", error);
    }
  };

  return (
    <div>
      <h2>Modifier le Projet</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nom" value={formData.nom} onChange={handleChange} />
        <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} />
        <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} />
        <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} />
        <input type="text" name="nomProjet" value={formData.nomProjet} onChange={handleChange} />
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
        <input type="date" name="dateCreation" value={formData.dateCreation} onChange={handleChange} />
        <input type="date" name="dateProvisoire" value={formData.dateProvisoire} onChange={handleChange} />
        <button type="submit">Sauvegarder</button>
      </form>
    </div>
  );
};

export default EditProjectPage;
