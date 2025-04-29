import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import useAuth from "../Seguranca/UseAuth";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// 🎨 Estilos (mantidos exatamente como você forneceu)
const NotificacoesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  width: 100%;
  height: 50vh;
  border: 1px solid #000000;
  background: white;
  box-sizing: border-box;
`;

const NotificacoesList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NotificacoesTitle = styled.h2`
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #333;
  margin: 0 0 10px 0;
  text-align: left;
`;

const NotificacaoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  font-size: 14px;
`;

const MensagemErro = styled.p`
  color: red;
  font-weight: bold;
  text-align: center;
  font-size: 14px;
  margin: 10px 0;
`;

const MensagemCarregando = styled.p`
  color: #666;
  text-align: center;
  font-size: 14px;
  margin: 10px 0;
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
      <NotificacoesTitle>🔔 Suas notificações:</NotificacoesTitle>

      <button onClick={carregarNotificacoes}>🔄 Atualizar manualmente</button>

      <NotificacoesList>
        {isLoading ? (
          <MensagemCarregando>Carregando notificações...</MensagemCarregando>
        ) : mensagemErro ? (
          <MensagemErro>{mensagemErro}</MensagemErro>
        ) : notificacoes.length > 0 ? (
          notificacoes.map((notificacao) => (
            <NotificacaoItem key={notificacao.id}>
              <span>{notificacao.mensagem}</span>
              <span>{formatarData(notificacao.dataCriacao)}</span>
            </NotificacaoItem>
          ))
        ) : (
          <MensagemErro>Nenhuma notificação disponível.</MensagemErro>
        )}
      </NotificacoesList>
    </NotificacoesContainer>
  );
}

export default Notificacoes;