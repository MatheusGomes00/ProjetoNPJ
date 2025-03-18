import React from "react";
import styled from "styled-components";
import Sidebar from "../ComponentesPadroes/Sidebar";
import SearchBarTop from "../ComponentesPadroes/SearchBarTop";
import IconeLogOut from "../botoesTelaImovel/IconeLogOut";
import IconeNotificacoes from "../botoesTelaImovel/IconeNotificacoes";
import IconeNovaTarefa from "../botoesTelaImovel/IconeNovaTarefa";

// Contêiner principal com CSS Grid
const FixedGridContainer = styled.div`
  display: grid;
  grid-template-areas:
    "searchbar searchbar searchbar"
    "sidebar main main"
    "sidebar main main";
  grid-template-rows: 100px 1fr 1fr;
  grid-template-columns: 200px 1fr 1fr;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
`;

const GridSearchBar = styled(SearchBarTop)`
  grid-area: searchbar;
`;

const GridSidebar = styled(Sidebar)`
  grid-area: sidebar;
`;

const MainContent = styled.div`
  grid-area: main;
  position: relative;
  overflow: auto; /* Permite rolagem se o conteúdo for grande */
`;

const TopRightIcons = styled.div`
  position: absolute;
  top: 20px; /* Distância do topo da tela */
  right: 20px; /* Distância da direita da tela */
  display: flex;
  gap: 10px;
  z-index: 1000; /* Garante que fique acima de outros elementos */
`;



const CornerLabel = styled.div`
  position: absolute;
  top: 10px; /* Canto superior esquerdo */
  left: 10px;
  font-family: Arial, sans-serif;
  z-index: 1000; /* Acima do Sidebar e SearchBarTop */
  color: #333;
`;

const ComponentesFixos = ({ children }) => {
  return (
    <FixedGridContainer>
      <GridSearchBar />
      <CornerLabel>
        <span className="corner-label-npj">NPJ</span>
        <br />
        <span className="corner-label-anhanguera">ANHANGUERA</span>
      </CornerLabel>
      <TopRightIcons>
        <IconeNotificacoes />
        <IconeLogOut />
        <IconeNovaTarefa />
      </TopRightIcons>
      <GridSidebar />
      <MainContent>
        
        {children} {/* Aqui vai o conteúdo dinâmico, como Tarefas */}
      </MainContent>
    </FixedGridContainer>
  );
};

export default ComponentesFixos;