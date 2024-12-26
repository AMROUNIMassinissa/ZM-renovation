import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase"; // Assurez-vous que Firebase est bien configuré ici
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [validationMessage, setValidationMessage] = useState(""); // Nouveau state pour message de validation
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Réinitialiser les erreurs
    setValidationMessage(""); // Réinitialiser le message de validation

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Vérifier si l'utilisateur a validé son email
      if (!user.emailVerified) {
        // Si l'email n'est pas validé, on affiche un message
        setValidationMessage("Veuillez valider votre email pour continuer.");
        await user.sendEmailVerification(); // Optionnel : Renvoyer l'email de validation
        return; // Arrêter le processus de connexion si l'email n'est pas validé
      }

      // Si l'email est validé, rediriger vers la page principale
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error.message);
      setError("Erreur : Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="login-container">
      <h1>Connexion</h1>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>

        <button type="submit" className="login-button">Se connecter</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {validationMessage && <p className="validation-message">{validationMessage}</p>}

      <p>
        Vous n'avez pas de compte ? <a href="/register" className="register-link">Inscrivez-vous ici</a>.
      </p>
    </div>
  );
};

export default LoginPage;
