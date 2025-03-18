import React from "react";
import Tarefas from "./Tarefas";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import styled from "styled-components";

// Grid interno para o conteúdo principal
const GridContainer = styled.div`
  height: calc(100% - 20px); /* Respeita o espaço do MainContent */
  width: calc(100% - 20px); /* Respeita o espaço do MainContent */
  position: relative; /* Referência para o GridItem absoluto */
  padding: 0; /* Sem padding no container */
`;

const GridItem = styled.div`
  background-color:rgb(226, 0, 0);
  position: absolute;
  top: 100px; /* Logo abaixo do SearchBarTop */
  left: 200px; /* Logo ao lado do Sidebar */
  width: 720px; /* Mesmo tamanho do Tarefas */
  height: 400px; /* Mesmo tamanho do Tarefas */
  top: 0px; /* Logo abaixo do SearchBarTop (100px) */
  left: 32px;
`;

function AreaDeTrabalho() {
  return (
    <ComponentesFixos>
      <GridContainer>
        <GridItem>
          <Tarefas />
        </GridItem>
      </GridContainer>
    </ComponentesFixos>
  );
}

export default AreaDeTrabalho;