import React, { useState } from "react";

const ProjectForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    adresse: "",
    telephone: "",
    nomProjet: "",
    status: "Planifié", // Valeur par défaut
    dateCreation: "",
    dateProvisoire: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      nom: "",
      prenom: "",
      adresse: "",
      telephone: "",
      nomProjet: "",
      status: "Planifié",
      dateCreation: "",
      dateProvisoire: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
            <div>
        <label>Nom du Projet :</label>
        <input
          type="text"
          name="nomProjet"
          value={formData.nomProjet}
          onChange={handleChange}
          placeholder="Entrez le nom du projet"
          required
        />
      </div>
      <div>
        <label>Statut :</label>
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
      </div>
      <div>
        <label>Nom :</label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Entrez le nom"
          required
        />
      </div>
      <div>
        <label>Prénom :</label>
        <input
          type="text"
          name="prenom"
          value={formData.prenom}
          onChange={handleChange}
          placeholder="Entrez le prénom"
          required
        />
      </div>
      <div>
        <label>Adresse :</label>
        <input
          type="text"
          name="adresse"
          value={formData.adresse}
          onChange={handleChange}
          placeholder="Entrez l'adresse"
          required
        />
      </div>
      <div>
        <label>Téléphone :</label>
        <input
          type="tel"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          placeholder="Entrez le numéro de téléphone"
          pattern="[0-9]{10}"
          required
        />
      </div>
      <div>
        <label>Date de Création :</label>
        <input
          type="date"
          name="dateCreation"
          value={formData.dateCreation}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Date Provisoire pour finir le Projet :</label>
        <input
          type="date"
          name="dateProvisoire"
          value={formData.dateProvisoire}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Créer Projet</button>
    </form>
  );
};

export default ProjectForm;