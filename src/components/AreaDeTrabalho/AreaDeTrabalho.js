import React from "react";
import Tarefas from "./Tarefas";
import ProcessosAreaDeTrabalho from "./ProcessosArea/ProcessosAreaDeTrabalho";
import Notificacoes from "./Notificacoes";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import styled from "styled-components";


// Grid interno para o conteúdo principal
const GridContainer = styled.div`
  display: grid;
  grid-template-areas:
    "tarefas processos"
    "notificacoes processos";
  grid-template-columns: 2fr 1.2fr;
  grid-template-rows: 400px 215px;
  gap: 16px;
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  padding: 24px;
  box-sizing: border-box;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "tarefas"
      "processos"
      "notificacoes";
    grid-template-rows: auto;
  }
`;

const GridItemTarefas = styled.div`
  grid-area: tarefas;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  overflow: hidden;
`;

const GridItemProcessos = styled.div`
  grid-area: processos;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  overflow: hidden;
`;

const GridItemNotificacoes = styled.div`
  grid-area: notificacoes;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  overflow: hidden;
`;


function AreaDeTrabalho() {
  return (
    <ComponentesFixos>
      <GridContainer>
        <GridItemTarefas>
          <Tarefas />
        </GridItemTarefas>
          <GridItemProcessos>
            <ProcessosAreaDeTrabalho></ProcessosAreaDeTrabalho>
          </GridItemProcessos>
          <GridItemNotificacoes>
          <Notificacoes />
        </GridItemNotificacoes>
       
      </GridContainer>
    </ComponentesFixos>
  );
}

export default AreaDeTrabalho;