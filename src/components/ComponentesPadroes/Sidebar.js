import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaCalendarAlt, FaUsers, FaUserTie, FaFileAlt, FaTasks, FaFolder, FaHome } from "react-icons/fa";

// Sidebar estilizada
const SidebarContainer = styled.div`
  position: absolute;
  top: 100px;
  left: 0;
  height: 605px;
  width: 200px;
  background-color: #ffffff;
  border-right: 1px solid #000000;
  box-shadow: 2px 0 5px rgba(158, 78, 78, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

// Estilo do título
const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 1rem;
  text-transform: uppercase;
  font-weight: bold;
  border-bottom: 2px solid rgba(255, 255, 255, 0.4);
 
  color: #333;
`;

// Botão estilizado
const SidebarButton = styled.button`
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 16px;
  padding: 12px;
  margin: 5px 0;
  background-color: white;
  color: black;
  text-decoration: none;
  border-radius: 4px;
  border: 1px solid #ccc;
  transition: background-color 0.3s, border 0.3s;
  box-sizing: border-box;
  height: 50px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 15, 221, 0.4);
    transform: scale(1.05);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

// Lista estilizada
const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;

const SidebarItem = styled.li`
  margin: 6px 0;
`;

function Sidebar({ onAdvogadosClick }) {
  return (
    <SidebarContainer>
      <Title>Atalhos</Title>
      <SidebarList>
        <SidebarItem>
          <Link to="/workspace">
            <SidebarButton>
              <FaHome /> Área de Trabalho
            </SidebarButton>
          </Link>
        </SidebarItem>
        <SidebarItem>
          <SidebarButton>
            <FaCalendarAlt /> Agenda
          </SidebarButton>
        </SidebarItem>
        <SidebarItem>
          <SidebarButton>
            <FaUsers /> Clientes
          </SidebarButton>
        </SidebarItem>
        <SidebarItem>
          <Link to="/advogados">
            <SidebarButton>
              <FaUserTie /> Advogados
            </SidebarButton>
          </Link>
        </SidebarItem>
        <SidebarItem>
          <SidebarButton>
            <FaFileAlt /> Processos
          </SidebarButton>
        </SidebarItem>
        <SidebarItem>
          <SidebarButton>
            <FaFolder /> Documentos
          </SidebarButton>
        </SidebarItem>
        <SidebarItem>
            <Link to="/tarefas">
        <SidebarButton>
            <FaTasks /> Tarefas
        </SidebarButton>
      </Link>
</SidebarItem>
      </SidebarList>
    </SidebarContainer>
  );
}

export default Sidebar;
