import React from "react";
import Tarefas from "./Tarefas";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import styled from "styled-components";

// Grid interno para o conteúdo principal
const GridContainer = styled.div`
  display: flex; /* Mudamos de grid para flex para simplificar com 1 item */
  justify-content: center; /* Centraliza o GridItem */
  align-items: center; /* Centraliza verticalmente */
  padding: 20px;
  height: calc(100% - 20px); /* Respeita o espaço do MainContent */
  width: calc(100% - 20px); /* Respeita o espaço do MainContent */
  overflow: auto; /* Rolagem se necessário */
`;

const GridItem = styled.div`
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 10px;
  width: 700px; /* Tamanho fixo do Tarefas */
  height: 350px; /* Tamanho fixo do Tarefas */
  display: flex;
  justify-content: center; /* Centraliza o Tarefas dentro do GridItem */
  align-items: center;
  box-sizing: border-box; /* Garante que padding não expanda o tamanho */
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