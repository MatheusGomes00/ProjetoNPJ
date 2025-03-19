import React from "react";
import Tarefas from "./Tarefas";
import ProcessosAreaDeTrabalho from "./ProcessosAreaDeTrabalho";
import Notificacoes from "./Notificacoes";
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
  width: 102vh;
  height: 400px;
`;

const GridItemProcessos = styled.div`
  position: absolute;
  top: 0px;
  left: 106vh; /* 720px (largura do Tarefas) + 32px (esquerda do Tarefas) */
  width: 10vw; /* Atualizado para refletir o novo tamanho */
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
            <ProcessosAreaDeTrabalho></ProcessosAreaDeTrabalho>
          </GridItemProcessos>
        {/* Se quiser adicionar Notificações em algum lugar, pode criar um novo GridItem */}
      </GridContainer>
    </ComponentesFixos>
  );
}

export default AreaDeTrabalho;