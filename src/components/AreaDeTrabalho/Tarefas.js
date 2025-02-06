import React from "react";
import styled from "styled-components";

// Container principal das tarefas
const TarefasContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #fff;
`;

// Título da seção
const TituloTarefas = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 15px;
`;

// Área onde os cards das tarefas ficarão organizados
const ListaTarefas = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  max-width: 900px; /* Limita o espaço total que pode ocupar */
  max-height: 300px; /* Delimita a altura total */
  overflow-y: auto; /* Adiciona rolagem caso ultrapasse o limite */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

// Card de cada tarefa
const TarefaCard = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  width: 150px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

// Indicadores de prioridade
const Indicadores = styled.div`
  display: flex;
  gap: 5px;
  justify-content: center;
`;

// Cada indicador de prioridade
const Indicador = styled.span`
  width: 40px;
  height: 15px;
  border-radius: 8px;
  background-color: ${({ prioridade }) => {
    switch (prioridade) {
      case "baixa":
        return "green";
      case "media":
        return "yellow";
      case "alta":
        return "orange";
      case "maxima":
        return "red";
      default:
        return "gray";
    }
  }};
`;

function Tarefas() {
  const tarefas = [
    { id: 1, titulo: "Tarefa 1", descricao: "Descrição da primeira tarefa", prioridade: "maxima" },
    { id: 2, titulo: "Tarefa 2", descricao: "Descrição da segunda tarefa", prioridade: "media" },
    { id: 3, titulo: "Tarefa 3", descricao: "Descrição da terceira tarefa", prioridade: "baixa" },
    { id: 4, titulo: "Tarefa 4", descricao: "Descrição da quarta tarefa", prioridade: "alta" },
    { id: 5, titulo: "Tarefa 5", descricao: "Outra tarefa qualquer", prioridade: "media" },
    { id: 6, titulo: "Tarefa 6", descricao: "Mais uma tarefa", prioridade: "alta" },
    { id: 7, titulo: "Tarefa 7", descricao: "Tarefa extra", prioridade: "maxima" },
    { id: 8, titulo: "Tarefa 8", descricao: "Última tarefa", prioridade: "baixa" },
  ];

  return (
    <TarefasContainer>
      <TituloTarefas>Tarefas e prazos que expiram hoje</TituloTarefas>
      <ListaTarefas>
        {tarefas.map((tarefa) => (
          <TarefaCard key={tarefa.id}>
            <h2>{tarefa.titulo}</h2>
            <p>{tarefa.descricao}</p>
            <Indicadores>
              <Indicador prioridade={tarefa.prioridade} />
            </Indicadores>
          </TarefaCard>
        ))}
      </ListaTarefas>
    </TarefasContainer>
  );
}

export default Tarefas;
