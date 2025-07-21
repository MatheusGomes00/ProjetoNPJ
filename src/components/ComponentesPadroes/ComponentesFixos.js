import React from "react";
import styled from "styled-components";
import Sidebar from "../ComponentesPadroes/Sidebar";
import SearchBarTop from "../ComponentesPadroes/SearchBarTop";
import IconeLogOut from "../botoesTelaImovel/IconeLogOut";
import IconeNotificacoes from "../botoesTelaImovel/IconeNotificacoes";
import IconeNovaTarefa from "../botoesTelaImovel/IconeNovaTarefa";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  overflow: auto;
`;

const TopRightIcons = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 1000;
`;


const ComponentesFixos = ({ children }) => {
  return (
    <FixedGridContainer>
      <GridSearchBar />
      <TopRightIcons>
        <IconeNotificacoes />
        <IconeLogOut />
        <IconeNovaTarefa />
      </TopRightIcons>
      <GridSidebar />
      <MainContent>{children}</MainContent>
      <ToastContainer
        position="top-center"
        autoClose={7000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 10000 }}
      />
    </FixedGridContainer> //aa
  );
};

export default ComponentesFixos;