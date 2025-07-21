import React from "react";
import styled from "styled-components";
import Sidebar from "../ComponentesPadroes/Sidebar";
import SearchBarTop from "../ComponentesPadroes/SearchBarTop";
import IconeLogOut from "../botoesTelaImovel/IconeLogOut";
import IconeNotificacoes from "../botoesTelaImovel/IconeNotificacoes";
import IconeNovaTarefa from "../botoesTelaImovel/IconeNovaTarefa";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Altura da TopBar
const TOPBAR_HEIGHT = 100;
const SIDEBAR_WIDTH = 200;

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const SidebarArea = styled.div`
  width: ${SIDEBAR_WIDTH}px;
  height: 100vh;
  background: #fff;
  box-shadow: 2px 0 8px rgba(0,0,0,0.04);
  z-index: 10;
  position: relative;
`;

const MainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TopBarArea = styled.div`
  height: ${TOPBAR_HEIGHT}px;
  background: #f8f9fa;
  border-bottom: 2px solid #eee;
  display: flex;
  align-items: center;
  padding: 0 32px;
  
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
`;

const TopRightIcons = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-left: auto;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: auto;
  background: #f5f6fa;
  padding: 24px; 
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
`;



const ComponentesFixos = ({ children }) => {
  
  return (
    <LayoutContainer>
      <SidebarArea>
        <Sidebar />
      </SidebarArea>
      <MainArea>
        <TopBarArea>
          <SearchBarTop />
          <TopRightIcons>
            <IconeNotificacoes />
            <IconeLogOut />
            <IconeNovaTarefa />
          </TopRightIcons>
        </TopBarArea>

        <MainContent>
          {children}
        </MainContent>

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{ zIndex: 10000 }}
        />
      </MainArea>
    </LayoutContainer>
  );
};

export default ComponentesFixos;