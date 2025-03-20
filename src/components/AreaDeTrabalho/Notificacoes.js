// Notificacoes.js
import React from "react";
import styled from "styled-components";

// Estilo do container de notificações
const NotificacoesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  width: 100%;
  height: 53vh;
  border: 1px solid #000000;
  background: white;
  overflow-y: auto;
  box-sizing: border-box;
`;

// Estilo de cada item de notificação
const NotificacaoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  font-size: 14px;
`;

function Notificacoes() {
  // Exemplo de dados de notificações (você pode substituir por dados reais)
  const notificacoes = [
    { id: 1, mensagem: "Nova tarefa atribuída: Reunião com Bárbara", data: "10/03/2025, 14:30:00" },
    { id: 2, mensagem: "Processo 101 finalizado", data: "10/03/2025, 07:00:00" },
    { id: 3, mensagem: "Atualização no Processo 303", data: "09/03/2025, 19:15:00" },
    { id: 1, mensagem: "Nova tarefa atribuída: Reunião com Bárbara", data: "10/03/2025, 14:30:00" },
    { id: 2, mensagem: "Processo 101 finalizado", data: "10/03/2025, 07:00:00" },
    { id: 3, mensagem: "Atualização no Processo 303", data: "09/03/2025, 19:15:00" },
    { id: 1, mensagem: "Nova tarefa atribuída: Reunião com Bárbara", data: "10/03/2025, 14:30:00" },
    { id: 2, mensagem: "Processo 101 finalizado", data: "10/03/2025, 07:00:00" },
    { id: 3, mensagem: "Atualização no Processo 303", data: "09/03/2025, 19:15:00" },
  ];

  return (
    <NotificacoesContainer>
      {notificacoes.length > 0 ? (
        notificacoes.map((notificacao) => (
          <NotificacaoItem key={notificacao.id}>
            <span>{notificacao.mensagem}</span>
            <span>{notificacao.data}</span>
          </NotificacaoItem>
        ))
      ) : (
        <p>Nenhuma notificação disponível.</p>
      )}
    </NotificacoesContainer>
  );
}

export default Notificacoes;