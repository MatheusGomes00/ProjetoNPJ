import React from "react";
import Tarefas from "./Tarefas";
import ProcessosAreaDeTrabalho from "./ProcessosAreaDeTrabalho";
import Notificacoes from "./Notificacoes"; // Novo import
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import styled from "styled-components";

// Grid interno para o conteúdo principal
const GridContainer = styled.div`
  height: calc(100% - 20px); /* Respeita o espaço do MainContent */
  width: calc(100% - 20px); /* Respeita o espaço do MainContent */
  position: relative; /* Referência para os GridItems absolutos */
  padding: 0; /* Sem padding no container */
`;

const GridItemTarefas = styled.div`
  background-color: rgb(226, 0, 0);
  position: absolute;
  top: 0px;
  left: 32px;
  width: 720px;
  height: 400px;
`;

const GridItemProcessos = styled.div`
  position: absolute;
  top: 0px;
  left: 752px; /* 720px (largura do Tarefas) + 32px (esquerda do Tarefas) */
  width: 445px; /* Atualizado para refletir o novo tamanho */
  height: 595px; /* Atualizado para refletir o novo tamanho */
`;

function AreaDeTrabalho() {
  return (
    <ComponentesFixos>
      <GridContainer>
        <GridItemTarefas>
          <Tarefas />
        </GridItemTarefas>
        <GridItemProcessos>
          <ProcessosAreaDeTrabalho />
        </GridItemProcessos>
        <Notificacoes /> {/* Adicionado diretamente, pois já é posicionado */}
      </GridContainer>
    </ComponentesFixos>
  );
}

export default AreaDeTrabalho;