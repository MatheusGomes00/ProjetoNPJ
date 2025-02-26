import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Sidebar from "../ComponentesPadroes/Sidebar";
import SearchBarTop from "../ComponentesPadroes/SearchBarTop";
import { FaFolderOpen } from "react-icons/fa"; // Ícone para NPJ
import IconeLogOut from "../botoesTelaImovel/IconeLogOut";
import IconeNotificacoes from "../botoesTelaImovel/IconeNotificacoes";
import IconeNovaTarefa from "../botoesTelaImovel/IconeNovaTarefa";

// Estilos para a Lista
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 70vh;               
`;

const Content = styled.div`
  flex-grow: 1;
  margin-left: 220px; /* Garante espaço para a Sidebar */
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const NpjLabel = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #333;

  svg {
    margin-right: 8px;
    color: #007bff; /* Azul para o ícone */
  }
`;

const ListaTarefas = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 60vh;
  overflow-y: auto;
`;

const TarefaItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
  }
`;

const TarefaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TarefaNome = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const TarefaPrioridade = styled.div`
  background-color: ${({ prioridade }) =>
    prioridade === "baixa"
      ? "green"
      : prioridade === "media"
      ? "yellow"
      : "red"};
  width: 12px;
  height: 12px;
  border-radius: 50%;
`;

const TarefaDescricao = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 10px;
`;

const TarefaFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 14px;
  color: #666;
`;

const TarefaPrazo = styled.span`
  font-weight: bold;
  color: #333;
`;

const TarefaResponsavel = styled.span`
  font-style: italic;
  color: #333;
`;

const getToken = () => {
  return localStorage.getItem("token"); // Certifique-se de que o token está salvo corretamente
};

function TarefasMain() {
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    // Busca as tarefas ao carregar o componente
    const fetchTarefas = async () => {
      try {
        const token = getToken();
        const response = await axios.get("http://localhost:8080/task/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTarefas(response.data);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    };

    fetchTarefas();
  }, []);

  return (
    <Container>
      {/* Sidebar à esquerda */}
      <Sidebar />

      {/* Conteúdo Principal */}
      <Content>
        {/* Barra de Pesquisa e Label NPJ */}
        <Header>
          <SearchBarTop />
        </Header>

        {/* Lista de Tarefas */}
        <h2>Lista de Tarefas</h2>
        <div className="top-right-icons">
          <IconeLogOut />
          <IconeNotificacoes />
          <IconeNovaTarefa />
        </div>

        {/* Exibe as tarefas como uma lista*/}
        <ListaTarefas>
          {tarefas.map((tarefa) => (
            <TarefaItem key={tarefa.nomeTarefa}>
              <TarefaHeader>
                <TarefaNome>{tarefa.nomeTarefa}</TarefaNome>
                <TarefaPrioridade prioridade={tarefa.prioridade} />
              </TarefaHeader>
              <TarefaDescricao>{tarefa.descricao}</TarefaDescricao>
              <TarefaFooter>
                <TarefaPrazo>{tarefa.prazoLimite}</TarefaPrazo>
                <TarefaResponsavel>
                  {tarefa.responsavelNome}
                </TarefaResponsavel>
              </TarefaFooter>
            </TarefaItem>
          ))}
        </ListaTarefas>

        <div className="corner-label">
          <span className="corner-label-npj">NPJ</span>
          <br />
          <span className="corner-label-anhanguera">ANHANGUERA</span>
        </div>
      </Content>
    </Container>
  );
}

export default TarefasMain;
