import axios from "axios";

export const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des détails utilisateur :", error);
      throw error;
    }
  };

  export const updateUserDetails = async (userId, userData) => {
    try {
      await axios.put(`http://localhost:5000/users/${userId}`, userData);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des détails utilisateur :", error);
      throw error;
    }
  };
  
  