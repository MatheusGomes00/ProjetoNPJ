import React from "react";
import { Link } from "react-router-dom"; // Para navegação entre as rotas
import { FaCalendarAlt, FaUsers, FaUserTie, FaFileAlt, FaTasks, FaFolder, FaHome } from "react-icons/fa";

function Sidebar({ onAdvogadosClick }) {
  return (
    <div className="sidebar">
      <h2>Atalhos</h2>
      <ul>
        <li>
          <Link to="/" className="sidebar-button"> {/* Link para a Área de Trabalho */}
            <FaHome /> Área de Trabalho
          </Link>
        </li>
        <li>
          <button className="sidebar-button">
            <FaCalendarAlt /> Agenda
          </button>
        </li>
        <li>
          <button className="sidebar-button">
            <FaUsers /> Clientes
          </button>
        </li>
        <li>
          <Link to="/advogados" className="sidebar-button"> {/* Link para "Advogados" */}
            <FaUserTie /> Advogados
          </Link>
        </li>
        <li>
          <button className="sidebar-button">
            <FaFileAlt /> Processos
          </button>
        </li>
        <li>
          <button className="sidebar-button">
            <FaFolder /> Documentos
          </button>
        </li>
        <li>
          <button className="sidebar-button">
            <FaTasks /> Tarefas
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
