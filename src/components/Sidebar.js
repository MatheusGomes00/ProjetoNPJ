import React from 'react';
import { FaCalendarAlt, FaUsers, FaUserTie, FaFileAlt, FaTasks, FaFolder } from 'react-icons/fa'; // Importando ícones do react-icons

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Atalhos</h2>
      <ul>
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
          <button className="sidebar-button">
            <FaUserTie /> Advogados
          </button>
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
