import React from "react";
import styled from "styled-components";

const ProcessosContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 20px;
  width: 445px;
  height: 595px;
  border: 1px solid #000000;
  border-radius: 5px;
  background: white;
  overflow-y: auto;
`;

const ProcessoCard = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #000000;
  text-align: center;
  font-weight: bold;
  color: #000000;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
  height: 150px;
  cursor: pointer;

  &:hover {
    background-color: #f0f8ff;
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
`;

const Status = styled.div`
  font-size: 20px;
  margin-top: 10px;
  font-weight: normal;
  color: ${(props) => {
    switch (props.status) {
      case "Em andamento":
        return "green";
      case "Finalizado":
        return "red";
      case "Aguardando resposta":
        return "yellow";
      default:
        return "black";
    }
  }};
`;

const UltimaAtualizacao = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 5px;
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
      {processos.map((processo) => (
        <ProcessoCard key={processo.id} onClick={() => alert(`Clicou em ${processo.nome}`)}>
          <div>{processo.nome}</div>
          <Status status={processo.status}>{processo.status}</Status>
          <UltimaAtualizacao>
            Última atualização: {new Date(processo.ultimaAtualizacao).toLocaleString()}
          </UltimaAtualizacao>
        </ProcessoCard>
      ))}
    </ProcessosContainer>
  );
};

export default ProcessosAreaDeTrabalho;