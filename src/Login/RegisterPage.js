import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [successModal, setSuccessModal] = useState(false); // État pour afficher/masquer le modal
  const [error, setError] = useState(""); // Stocke les erreurs
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Envoi de l'email de vérification
      await sendEmailVerification(userCredential.user);

      // Afficher le modal de succès
      setSuccessModal(true);
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
