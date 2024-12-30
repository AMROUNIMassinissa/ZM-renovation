import React, { useState, useEffect } from "react";
import { fetchUserDetails, updateUserDetails } from "../services/userService"; // Backend services
import { updateEmail, updatePassword } from "firebase/auth"; // Firebase auth services
import { auth } from "../services/firebase";
import "./SettingsPage.css";

const CompanySettingsPage = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: "",
    email: "",
    type: "",
    nom: "",
    prenom: "",
    denomination: "",
    telephone: "",
    adresse: "",
    password: "", // Pour le mot de passe
  });

  // Récupérer les données utilisateur
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDetails = await fetchUserDetails(userId);
        setUser(userDetails);

        // Pré-remplir les champs avec les données de l'utilisateur
        setFormData({
          id: userDetails.id,
          email: userDetails.email,
          type: userDetails.type,
          nom: userDetails.nom || "",
          prenom: userDetails.prenom || "",
          denomination: userDetails.denomination || "",
          telephone: userDetails.telephone,
          adresse: userDetails.adresse,
          password: "", // Vide par défaut
        });
      } catch (error) {
        console.error("Erreur lors du chargement des informations utilisateur :", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadUserData();
    }
  }, [userId]);

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Sauvegarde des modifications
  const handleSave = async () => {
    try {
      const { email, password, ...otherDetails } = formData;
      console.log("Nouvelles informations utilisateur :", auth.currentUser.email);
      // 1. Mise à jour dans Firebase
      if (email !== auth.currentUser.email) {
          await updateEmail(auth.currentUser, email);
      }
      if (password) {
        await updatePassword(auth.currentUser, password);
      }

      // 2. Mise à jour dans le backend
      await updateUserDetails(userId, formData);
      console.log("Informations utilisateur !",formData);

      alert("Informations utilisateur mises à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour des informations utilisateur :", error);
      alert("Erreur lors de la mise à jour des informations utilisateur.");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Paramètres de l'utilisateur</h2>
      <form>
        {/* ID (readonly) */}
        <div>
          <label>ID :</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            readOnly
            className="readonly-field"
          />
        </div>

        {/* Email */}
        <div>
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Type (readonly) */}
        <div>
          <label>Type :</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            readOnly
            className="readonly-field"
          />
        </div>

        {/* Nom et Prénom ou Dénomination */}
        {formData.type === "morale" ? (
          <div>
            <label>Dénomination :</label>
            <input
              type="text"
              name="denomination"
              value={formData.denomination}
              onChange={handleChange}
            />
          </div>
        ) : (
          <>
            <div>
              <label>Nom :</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Prénom :</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {/* Téléphone */}
        <div>
          <label>Téléphone :</label>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
          />
        </div>

        {/* Adresse */}
        <div>
          <label>Adresse :</label>
          <input
            type="text"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label>Nouveau mot de passe :</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Laissez vide pour ne pas changer"
          />
        </div>

        <button type="button" onClick={handleSave}>
          Sauvegarder
        </button>
      </form>
    </div>
  );
};

export default CompanySettingsPage;