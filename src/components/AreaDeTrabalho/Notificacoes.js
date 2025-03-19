import React from "react";
import styled from "styled-components";

// Container principal das notificações
const NotificacoesContainer = styled.div`
  position: absolute;
  top: 420px; /* 400px (altura do Tarefas) + 20px de espaço */
  left: 33px; /* Alinhado com o início do Tarefas */
  width: 678px; 
  max-height: 150px; 
  padding: 20px;
  background: #ffffff;
  border: 1px solid #dfe6e9;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  overflow-y: auto;
`;

const TituloNotificacoes = styled.h2`
  grid-column: span 2;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const NotificacaoCard = styled.div`
  background: #f9fbfc;
  padding: 15px;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const NotificacaoTitulo = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #34495e;
  margin: 0 0 5px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const NotificacaoMensagem = styled.p`
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
`;

const BotaoMostrarTudo = styled.button`
  grid-column: span 2;
  padding: 12px;
  margin-top: 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #0056b3;
    transform: translateY(-2px);
  }

  &:active {
    background: #004085;
    transform: translateY(0);
  }
`;

const notificacoes = [
  { id: 1, titulo: "Novo Cliente", mensagem: "Novo cliente interessado." },
  { id: 2, titulo: "Pagamento Recebido", mensagem: "Pagamento confirmado." },
  { id: 3, titulo: "Novo Pedido", mensagem: "Novo pedido realizado." },
  { id: 4, titulo: "Atualização de Sistema", mensagem: "Sistema atualizado com sucesso." },
  { id: 5, titulo: "Alerta de Segurança", mensagem: "Nova vulnerabilidade identificada." },
  { id: 6, titulo: "Promoção Especial", mensagem: "Desconto de 20% em todos os produtos." },
];

const Notificacoes = () => {
  return (
    <NotificacoesContainer>
      <TituloNotificacoes>🔔 Suas Notificações</TituloNotificacoes>
      {notificacoes.map((notificacao) => (
        <NotificacaoCard key={notificacao.id}>
          <NotificacaoTitulo>🔔 {notificacao.titulo}</NotificacaoTitulo>
          <NotificacaoMensagem>{notificacao.mensagem}</NotificacaoMensagem>
        </NotificacaoCard>
      ))}
      <BotaoMostrarTudo>Mostrar Tudo: ➕</BotaoMostrarTudo>
    </NotificacoesContainer>
  );
};

export default Notificacoes;