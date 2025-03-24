import React from "react";
import styled from "styled-components";

// Estilo do overlay do modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Fundo escurecido */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// Estilo do container do modal
const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  width: 500px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
`;

// Estilo do botão de fechar
const BotaoFechar = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.3s ease;

  &:hover {
    color: #2c3e50;
  }
`;

// Estilo do título do modal
const ModalTitulo = styled.h2`
  font-family: "Arial", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 20px 0;
`;

// Estilo dos detalhes
const DetalheItem = styled.p`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #2c3e50;
  margin: 10px 0;
`;

// Estilo do botão de finalizar
const BotaoFinalizar = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #c0392b;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

// Função para formatar a data
const formatarData = (dataString) => {
  if (!dataString) return "Sem prazo";
  const data = new Date(dataString);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, "0");
  const minutos = String(data.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
};

const ModalTarefa = ({ tarefa, onClose, onFinalizar }) => {
  if (!tarefa) return null; // Não renderiza o modal se não houver tarefa

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <BotaoFechar onClick={onClose}>×</BotaoFechar>
        <ModalTitulo>Detalhes da Tarefa</ModalTitulo>
        <DetalheItem>
          <strong>Nome:</strong> {tarefa.nomeTarefa}
        </DetalheItem>
        <DetalheItem>
          <strong>Status:</strong> {tarefa.status ? "Ativa" : "Finalizada"}
        </DetalheItem>
        <DetalheItem>
          <strong>Prazo:</strong> {formatarData(tarefa.prazoLimite)}
        </DetalheItem>
        <DetalheItem>
          <strong>Descrição:</strong> {tarefa.descricao || "Sem descrição"}
        </DetalheItem>
        <DetalheItem>
          <strong>Prioridade:</strong> {tarefa.prioridade || "Não especificada"}
        </DetalheItem>
        <DetalheItem>
          <strong>Data de Criação:</strong> {formatarData(tarefa.dataCriacao)}
        </DetalheItem>
        <DetalheItem>
          <strong>Criador:</strong> {tarefa.criador || "Desconhecido"}
        </DetalheItem>
        <DetalheItem>
          <strong>Responsáveis:</strong>{" "}
          {tarefa.responsaveisNome && tarefa.responsaveisNome.length > 0
            ? tarefa.responsaveisNome.join(", ")
            : "Nenhum responsável atribuído"}
        </DetalheItem>
        {!tarefa.status && (
          <>
            <DetalheItem>
              <strong>Finalizado Por:</strong>{" "}
              {tarefa.advogadoFinalizadorId || "Desconhecido"}
            </DetalheItem>
            <DetalheItem>
              <strong>Data de Finalização:</strong>{" "}
              {formatarData(tarefa.dataFinalizacao)}
            </DetalheItem>
          </>
        )}
        {tarefa.status && (
          <BotaoFinalizar onClick={() => onFinalizar(tarefa.id)}>
            Finalizar Tarefa
          </BotaoFinalizar>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ModalTarefa;