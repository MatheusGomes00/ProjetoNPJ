import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaCalendarAlt, FaUsers, FaUserTie, FaFileAlt, FaTasks, FaFolder, FaHome } from "react-icons/fa";

// Sidebar estilizada
const SidebarContainer = styled.div`
  position: relative;
  top: 0;
  left: 0;
  height: 100vh;
  width: 198px;
  background-color: #ffffff;
  
  box-shadow: 2px 0 5px rgba(158, 78, 78, 0.1);
  padding: 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: auto;
  z-index: 100;

  @media (max-width: 900px) {
    width: 60px;
    padding: 1rem 0.2rem;
    align-items: center;
  }

  @media (max-width: 600px) {
    width: 48px;
    padding: 0.5rem 0.1rem;
  }
`;


// Botão estilizado
const SidebarButton = styled.button`
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 16px;
  padding: 12px;
  margin: 10px 0;
  background-color: white;
  color: black;
  text-decoration: none;
  border-radius: 4px;
  border: 1px solid #ccc;
  transition: background-color 0.3s, border 0.3s, transform 0.2s;
  box-sizing: border-box;
  height: 50px;
  cursor: pointer;
  gap: 8px;

  &:hover {
    background: rgba(0, 15, 221, 0.1);
    transform: scale(1.05);
    border-color: rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 900px) {
    justify-content: center;
    font-size: 0;
    padding: 10px 0;
    height: 44px;
    gap: 0;
  }
`;

const SidebarIcon = styled.span`
  font-size: 20px;
  margin-right: 8px;

  @media (max-width: 900px) {
    margin-right: 0;
    font-size: 22px;
  }
`;

const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 68px 0 0 0; 
  width: 100%;
`;

const SidebarItem = styled.li`
  margin: 6px 0;
`;

const CornerLabel = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  font-family: Arial, sans-serif;
  color: #333;
  font-size: clamp(20px, 1vw, 18px);
  line-height: 1.1;
  pointer-events: none;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;

  @media (max-width: 800px) {
    font-size: clamp(10px, 0.8vw, 14px);
    top: 6px;
    left: 6px;
    min-height: 28px;
  }

  @media (max-width: 600px) {
    font-size: clamp(8px, 0.6vw, 12px);
    top: 4px;
    left: 4px;
    min-height: 20px;
  }

  @media (min-width: 1440px) {
    font-size: clamp(14px, 1.5vw, 22px);
    top: 16px;
    left: 16px;
    min-height: 48px;
  }
`;


function Sidebar({ onAdvogadosClick }) {
  return (
    <SidebarContainer>
      <CornerLabel>
        <span>NPJ ANHANGUERA</span>
      </CornerLabel>
      <SidebarList>
        <SidebarItem>
          <Link to="/workspace">
            <SidebarButton>
              <SidebarIcon><FaHome /></SidebarIcon>
              Área de Trabalho
            </SidebarButton>
          </Link>
        </SidebarItem>
        <SidebarItem>
          <SidebarButton>
            <SidebarIcon><FaCalendarAlt /></SidebarIcon>
            Agenda
          </SidebarButton>
        </SidebarItem>
        <SidebarItem>
        <Link to="/clientes">
            <SidebarButton>
              <SidebarIcon><FaUsers /></SidebarIcon>
              Clientes
            </SidebarButton>
          </Link>
        </SidebarItem>
        <SidebarItem>
          <Link to="/advogados">
            <SidebarButton>
              <SidebarIcon><FaUserTie /></SidebarIcon>
              Advogados
            </SidebarButton>
          </Link>
        </SidebarItem>
        <SidebarItem>
          <Link to="/processos">
          <SidebarButton>
            <SidebarIcon><FaFileAlt /></SidebarIcon>
            Processos
          </SidebarButton>
          </Link>
        </SidebarItem>
        <SidebarItem>
          <SidebarButton>
            <SidebarIcon><FaFolder /></SidebarIcon>
            Documentos
          </SidebarButton>
        </SidebarItem>
        <SidebarItem>
            <Link to="/tarefas">
        <SidebarButton>
            <SidebarIcon><FaTasks /></SidebarIcon>
            Tarefas
        </SidebarButton>
      </Link>
</SidebarItem>
      </SidebarList>
    </SidebarContainer>
  );
}

export default Sidebar;
