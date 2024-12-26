// ProjectList.js
import React from "react";
import { useNavigate } from "react-router-dom";  // Importation du hook useNavigate

const ProjectList = ({ projects, onDelete }) => {
  const navigate = useNavigate(); // Hook de navigation

  const handleEdit = (projectId) => {
    navigate(`/edit/${projectId}`);  // Redirige vers la page d'édition du projet
  };

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Adresse</th>
          <th>Téléphone</th>
          <th>Nom du projet</th>
          <th>Statut</th>
          <th>Date de création</th>
          <th>Date provisoire</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id}>
            <td>{project.id}</td>
            <td>{project.nom}</td>
            <td>{project.prenom}</td>
            <td>{project.adresse}</td>
            <td>{project.telephone}</td>
            <td>{project.nom_projet}</td>
            <td>{project.status}</td>
            <td>{project.date_creation}</td>
            <td>{project.date_provisoire}</td>
            <td>
              <button onClick={() => handleEdit(project.id)}>Modifier</button>
              <button onClick={() => onDelete(project.id)}>Supprimer</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProjectList;
