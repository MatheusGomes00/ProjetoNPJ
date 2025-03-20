import React from "react";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap');
`;

const ProcessosContainer = styled.div`
  display: flex;
  flex-direction: column; /* Mudado para flex para incluir o título */
  gap: 15px;
  padding: 20px;
  width: 29vw;
  height: 49vw;
  border: none;
  background: white;
  overflow-y: auto;
`;

const ProcessosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
`;

const ProcessosTitle = styled.h2`
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #333;
  margin: 0 0 10px 0; /* Espaço abaixo do título */
  text-align: left;
`;

const ProcessoCard = styled.div`
  background:rgba(232, 234, 236, 0.42);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 150px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: #f9faff;
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
`;

const Status = styled.div`
  align-self: flex-start;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  background: ${(props) => {
    switch (props.status) {
      case "Em andamento":
        return "#1890ff";
      case "Finalizado":
        return "#52c41a";
      case "Aguardando resposta":
        return "#faad14";
      default:
        return "#d9d9d9";
    }
  }};
`;

const ProcessoNome = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-align: left;
`;

const UltimaAtualizacao = styled.div`
  font-size: 11px;
  color: #666;
  text-align: left;
`;

const processos = [
  { id: 1, nome: "Processo 101", status: "Em andamento", ultimaAtualizacao: "2025-03-12T14:30:00Z" },
  { id: 2, nome: "Processo 202", status: "Finalizado", ultimaAtualizacao: "2025-03-10T10:00:00Z" },
  { id: 3, nome: "Processo 303", status: "Aguardando resposta", ultimaAtualizacao: "2025-03-11T12:15:00Z" },
  { id: 4, nome: "Processo 404", status: "Em andamento", ultimaAtualizacao: "2025-03-12T16:45:00Z" },
];

const ProcessosAreaDeTrabalho = () => {
  return (
    <ProcessosContainer>
      <ProcessosTitle>Seus Processos/Casos</ProcessosTitle>
      <ProcessosGrid>
        {processos.map((processo) => (
          <ProcessoCard key={processo.id} onClick={() => alert(`Clicou em ${processo.nome}`)}>
            <Status status={processo.status}>{processo.status}</Status>
            <ProcessoNome>{processo.nome}</ProcessoNome>
            <UltimaAtualizacao>
              Última atualização: {new Date(processo.ultimaAtualizacao).toLocaleString()}
            </UltimaAtualizacao>
          </ProcessoCard>
        ))}
      </ProcessosGrid>
    </ProcessosContainer>
  );
};

export default ProcessosAreaDeTrabalho;