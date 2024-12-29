import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Pour faire des requêtes au backend
import "./RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    type: "physique", // "physique" ou "morale"
    nom: "",
    prenom: "",
    denomination: "", // Pour les utilisateurs de type "morale"
    telephone: "",
    adresse: ""
  });
  const [successModal, setSuccessModal] = useState(false); // Modal de succès
  const [error, setError] = useState(""); // Pour stocker les erreurs
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Réinitialise les erreurs

    try {
      // Créer l'utilisateur avec Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      // Envoi de l'email de vérification
      await sendEmailVerification(userCredential.user);

      const firebaseUid = userCredential.user.uid; // Récupérer l'UID Firebase
      console.log("Firebase UID:", firebaseUid);

      // Une fois l'utilisateur créé dans Firebase, envoyons les autres informations au backend
      const userData = {
        firebase_uid: firebaseUid,
        email: formData.email,
        password: formData.password,
        type: formData.type,
        nom: formData.nom,
        prenom: formData.prenom,
        denomination: formData.denomination,
        telephone: formData.telephone,
        adresse: formData.adresse
      };

      // Envoyer les données supplémentaires au backend
      const response = await axios.post("http://localhost:5000/register", userData);

      // Si l'inscription au backend est réussie
      if (response.status === 201) {
        // Afficher le modal de succès
        setSuccessModal(true);
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error.message);
      setError("Erreur : " + error.message);
    }
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      <h1>Inscription</h1>

      <form onSubmit={handleRegister}>
        <label>Email :</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <label>Mot de passe :</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />

        <label>Type d'utilisateur :</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
        >
          <option value="physique">Personne physique</option>
          <option value="morale">Personne morale</option>
        </select>

        <label>Nom :</label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleInputChange}
        />

        <label>Prénom :</label>
        <input
          type="text"
          name="prenom"
          value={formData.prenom}
          onChange={handleInputChange}
        />

        {formData.type === "morale" && (
          <>
            <label>Dénomination :</label>
            <input
              type="text"
              name="denomination"
              value={formData.denomination}
              onChange={handleInputChange}
            />
          </>
        )}

        <label>Téléphone :</label>
        <input
          type="text"
          name="telephone"
          value={formData.telephone}
          onChange={handleInputChange}
          required
        />

        <label>Adresse :</label>
        <input
          type="text"
          name="adresse"
          value={formData.adresse}
          onChange={handleInputChange}
          required
        />

        <button type="submit">S'inscrire</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <p>
        Vous avez déjà un compte ? <a href="/login">Connectez-vous ici</a>.
      </p>

      {/* Modal de succès */}
      {successModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Inscription réussie</h2>
            <p>
              Un email de validation a été envoyé à votre adresse. Veuillez vérifier
              votre boîte mail et activer votre compte avant de vous connecter.
            </p>
            <button onClick={handleGoToLogin}>Aller à la page de connexion</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
