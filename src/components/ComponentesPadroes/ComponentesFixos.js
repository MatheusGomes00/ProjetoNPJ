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
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
`;

const HorizontalLine = styled.div`
  position: absolute;
  top: 100px;
  left: 200px;
  right: 0;
  height: 1px;
  background-color: #000;
`;

const CornerLabel = styled.div`
  position: absolute;
  bottom: 10px;
  left: 210px;
  font-family: Arial, sans-serif;
`;

const ComponentesFixos = ({ children }) => {
  return (
    <FixedGridContainer>
      <GridSearchBar />
      <GridSidebar />
      <MainContent>
        <TopRightIcons>
          <IconeNotificacoes />
          <IconeLogOut />
          <IconeNovaTarefa />
        </TopRightIcons>
       
        <CornerLabel>
          <span className="corner-label-npj">NPJ</span>
          <br />
          <span className="corner-label-anhanguera">ANHANGUERA</span>
        </CornerLabel>
        {children} {/* Aqui vai o conteúdo dinâmico, como Tarefas */}
      </MainContent>
    </FixedGridContainer>
  );
};

export default ComponentesFixos;