import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import useAuth from "../Seguranca/UseAuth";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// 🎨 Estilos completamente reimaginados
const NotificacoesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(106vh - 32px);
  height: 31vw;
  padding: 40px;
  border: 1px solid black;
  border-radius: 0px;
  background: #fff;
  box-sizing: border-box;
`;

const NotificacoesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;
`;

const NotificacoesTitle = styled.h2`
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 1.5rem;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NotificacoesList = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #e5e7eb;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #6b7280;
    border-radius: 4px;
    &:hover {
      background: #4b5563;
    }
  }
`;

const NotificacaoItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background: #ffffff;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const NotificacaoContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NotificacaoMensagem = styled.span`
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  color: #1f2937;
`;

const NotificacaoData = styled.span`
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 0.75rem;
  color: #6b7280;
`;

const NotificacaoIcon = styled.span`
  font-size: 1.25rem;
  color: #3b82f6;
  margin-right: 12px;
`;

const MensagemErro = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: #fef2f2;
  border-radius: 8px;
  color: #dc2626;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  width: 100%;
  text-align: center;
  gap: 8px;
`;

const MensagemCarregando = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 8px;
  color: #4b5563;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  width: 100%;
  text-align: center;
  gap: 8px;
`;

function Notificacoes() {
  const { fetchAuthenticated, getId, logoutWithRedirect } = useAuth();
  const [notificacoes, setNotificacoes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const stompClientRef = useRef(null);
  const isMountedRef = useRef(true);
  const hasLoadedRef = useRef(false);

  const formatarData = (dataString) => {
    if (!dataString) return "Sem data";
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");
    const segundos = String(data.getSeconds()).padStart(2, "0");
    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
  };

  const carregarNotificacoes = useCallback(async () => {
    if (!isMountedRef.current || isLoading) return;

    setIsLoading(true);
    setMensagemErro("");

    try {
      const response = await fetchAuthenticated(
        `http://localhost:8080/notificacao/get`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      if (isMountedRef.current) {
        setNotificacoes(data.length > 0 ? data : []);
        setMensagemErro(data.length === 0 ? "Nenhuma notificação disponível." : "");
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error("Erro ao buscar notificações:", error);
        setMensagemErro(`Erro ao carregar notificações: ${error.message}`);
        setNotificacoes([]);
        if (error.message.includes("401")) {
          setMensagemErro("Sessão expirada. Redirecionando para login...");
          logoutWithRedirect();
        }
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetchAuthenticated, isLoading, logoutWithRedirect]);

  useEffect(() => {
    isMountedRef.current = true;
    if (!hasLoadedRef.current) {
      console.log("Carregando notificações iniciais");
      carregarNotificacoes();
      hasLoadedRef.current = true;
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [carregarNotificacoes]);

  const setupWebSocket = useCallback(() => {
    const userId = getId();

    if (!userId) {
      setMensagemErro("Usuário não autenticado. Faça login para receber notificações.");
      return;
    }

    if (stompClientRef.current && stompClientRef.current.connected) {
      console.log("WebSocket já conectado, ignorando nova conexão.");
      return;
    }

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      if (!isMountedRef.current) return;
      console.log("✅ Conectado ao WebSocket");
      client.subscribe(`/topic/notificacoes/${userId}`, (message) => {
        if (!isMountedRef.current) return;
        const novaNotificacao = JSON.parse(message.body);
        console.log("📩 Notificação recebida:", novaNotificacao);
        setNotificacoes((prev) => {
          if (prev.some((n) => n.id === novaNotificacao.id)) return prev;
          return [novaNotificacao, ...prev];
        });
      });
      stompClientRef.current = client;
    };

    client.onStompError = (frame) => {
      if (!isMountedRef.current) return;
      console.error("Erro no STOMP:", frame);
      setMensagemErro("Erro ao conectar ao WebSocket: " + frame.headers?.message);
    };

    client.onWebSocketClose = () => {
      if (!isMountedRef.current) return;
      console.log("🔌 Conexão WebSocket fechada");
      stompClientRef.current = null;
    };

    client.activate();

    return () => {
      if (client && client.connected) {
        client.deactivate();
        console.log("🔌 WebSocket desconectado");
        stompClientRef.current = null;
      }
    };
  }, [getId]);

  useEffect(() => {
    console.log("Configurando WebSocket");
    const cleanup = setupWebSocket();
    return cleanup;
  }, [setupWebSocket]);

  return (
    <NotificacoesContainer>
      <NotificacoesHeader>
        <NotificacoesTitle>
          <span role="img" aria-label="bell">🔔</span> Notificações
        </NotificacoesTitle>
      </NotificacoesHeader>

      <NotificacoesList>
        {isLoading ? (
          <MensagemCarregando>
            <span role="img" aria-label="loading">⏳</span> Carregando...
          </MensagemCarregando>
        ) : mensagemErro ? (
          <MensagemErro>
            <span role="img" aria-label="error">⚠️</span> {mensagemErro}
          </MensagemErro>
        ) : notificacoes.length > 0 ? (
          notificacoes.map((notificacao) => (
            <NotificacaoItem key={notificacao.id}>
              <NotificacaoIcon>📬</NotificacaoIcon>
              <NotificacaoContent>
                <NotificacaoMensagem>{notificacao.mensagem}</NotificacaoMensagem>
                <NotificacaoData>{formatarData(notificacao.dataCriacao)}</NotificacaoData>
              </NotificacaoContent>
            </NotificacaoItem>
          ))
        ) : (
          <MensagemErro>
            <span role="img" aria-label="empty">📭</span> Nenhuma notificação disponível
          </MensagemErro>
        )}
      </NotificacoesList>
    </NotificacoesContainer>
  );
}

export default Notificacoes;