import React from "react";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600&display=swap');
`;

const ProcessosContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  width: 28vw;
  height: 50vw;
  border: none;
  background: linear-gradient(145deg, #f8fbff 0%, #e6f0fa 100%);
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  border-radius: 12px;
`;

const ProcessosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 15px;
`;

const ProcessosTitle = styled.h2`
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 18px;
  background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 10px 0;
  text-align: left;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ProcessoCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(230, 240, 250, 0.85) 100%);
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 150px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(245, 250, 255, 1) 100%);
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
`;

const Status = styled.div`
  align-self: center; /* Centralizado */
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  color: #fff;
  background: ${(props) => {
    switch (props.status) {
      case "Em andamento":
        return "linear-gradient(90deg, #1890ff 0%, #40c4ff 100%)";
      case "Finalizado":
        return "linear-gradient(90deg, #52c41a 0%, #76ff03 100%)";
      case "Aguardando resposta":
        return "linear-gradient(90deg, #faad14 0%, #ffd740 100%)";
      default:
        return "#d9d9d9";
    }
  }};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
`;

const ProcessoNome = styled.div`
  font-size: 14px;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  color: #1e3c72;
  text-align: center; /* Centralizado */
`;

const UltimaAtualizacao = styled.div`
  font-size: 11px;
  font-family: "Poppins", sans-serif;
  color: #5a6a8a;
  text-align: center; /* Centralizado */
`;

const Responsavel = styled.div`
  font-size: 11px;
  font-family: "Poppins", sans-serif;
  color: #5a6a8a;
  text-align: center; /* Centralizado */
`;

const PrazoFinal = styled.div`
  font-size: 11px;
  font-family: "Poppins", sans-serif;
  color: #5a6a8a;
  text-align: center; /* Centralizado */
`;

const Prioridade = styled.div`
  font-size: 11px;
  font-family: "Poppins", sans-serif;
  color: ${(props) => {
    switch (props.nivel) {
      case "Alta":
        return "#ff4d4f";
      case "Média":
        return "#faad14";
      case "Baixa":
        return "#52c41a";
      default:
        return "#5a6a8a";
    }
  }};
  text-align: center; /* Centralizado */
`;

const Progresso = styled.div`
  font-size: 11px;
  font-family: "Poppins", sans-serif;
  color: #5a6a8a;
  text-align: center; /* Centralizado */
`;

const processos = [
  {
    id: 1,
    nome: "Processo 101",
    status: "Em andamento",
    ultimaAtualizacao: "2025-03-12T14:30:00Z",
    responsavel: "João Silva",
    prazoFinal: "2025-03-20T18:00:00Z",
    prioridade: "Alta",
    progresso: "75%",
  },
  {
    id: 2,
    nome: "Processo 202",
    status: "Finalizado",
    ultimaAtualizacao: "2025-03-10T10:00:00Z",
    responsavel: "Maria Oliveira",
    prazoFinal: "2025-03-15T12:00:00Z",
    prioridade: "Média",
    progresso: "100%",
  },
  {
    id: 3,
    nome: "Processo 303",
    status: "Aguardando resposta",
    ultimaAtualizacao: "2025-03-11T12:15:00Z",
    responsavel: "Carlos Souza",
    prazoFinal: "2025-03-25T09:00:00Z",
    prioridade: "Baixa",
    progresso: "30%",
  },
  {
    id: 4,
    nome: "Processo 404",
    status: "Em andamento",
    ultimaAtualizacao: "2025-03-12T16:45:00Z",
    responsavel: "Ana Pereira",
    prazoFinal: "2025-03-22T14:00:00Z",
    prioridade: "Média",
    progresso: "50%",
  },
];

const ProcessosAreaDeTrabalho = () => {
  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <>
      <GlobalStyle />
      <ProcessosContainer>
        <ProcessosTitle>Seus Processos/Casos</ProcessosTitle>
        <ProcessosGrid>
          {processos.map((processo) => (
            <ProcessoCard key={processo.id} onClick={() => alert(`Clicou em ${processo.nome}`)}>
              <Status status={processo.status}>{processo.status}</Status>
              <ProcessoNome>{processo.nome}</ProcessoNome>
              <Responsavel>Responsável: {processo.responsavel}</Responsavel>
              <PrazoFinal>Prazo: {formatarData(processo.prazoFinal)}</PrazoFinal>
              <Prioridade nivel={processo.prioridade}>Prioridade: {processo.prioridade}</Prioridade>
              <Progresso>Progresso: {processo.progresso}</Progresso>
              <UltimaAtualizacao>
                Última atualização: {formatarData(processo.ultimaAtualizacao)}
              </UltimaAtualizacao>
            </ProcessoCard>
          ))}
        </ProcessosGrid>
      </ProcessosContainer>
    </>
  );
};

export default ProcessosAreaDeTrabalho;