import React from "react";
import Tarefas from "./Tarefas";
import ProcessosAreaDeTrabalho from "./ProcessosArea/ProcessosAreaDeTrabalho";
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
  width: calc(106vh - 32px);
  height: 400px;
`;

const GridItemProcessos = styled.div`
  position: absolute;
  top: 0px;
  left: 107vh; 
  width: calc(100% - 107vh); /* Atualizado para refletir o novo tamanho */
  height: 595px; /* Atualizado para refletir o novo tamanho */
`;

const GridItemNotificacoes = styled.div`
  position: absolute;
  top: 401px; /* 400px (altura do GridItemTarefas) + 20px (espaço) */
  left: 32px; /* Mesmo left que o GridItemTarefas */
  width: calc(106vh - 32px); /* Largura até encostar no GridItemProcessos */
  height: 215px; /* Altura da telinha de notificações (ajuste conforme necessário) */
  box-sizing: border-box;
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