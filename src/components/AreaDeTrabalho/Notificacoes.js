import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import useAuth from "../Seguranca/UseAuth";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// 🎨 Estilos
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
  const { fetchAuthenticated, user, loading } = useAuth();
  const [notificacoes, setNotificacoes] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [stompClient, setStompClient] = useState(null);

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

  const carregarNotificacoes = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();
      const minInterval = 5000;

      if (!forceRefresh && now - lastFetchTime < minInterval && notificacoes.length > 0) {
        return;
      }

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
          throw new Error(`Erro ao buscar notificações: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        setNotificacoes(data.length > 0 ? data : []);
        setMensagemErro(data.length === 0 ? "Nenhuma notificação disponível." : "");
        setLastFetchTime(now);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
        setMensagemErro("Erro ao carregar notificações: " + error.message);
        setNotificacoes([]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAuthenticated, lastFetchTime, notificacoes.length]
  );

  // WebSocket
  useEffect(() => {
    if (loading || !user?.id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMensagemErro("Token não encontrado. Faça login novamente.");
      return;
    }

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      debug: (str) => console.log(str),
    });

    client.onConnect = () => {
      console.log("✅ Conectado ao WebSocket");

      client.subscribe(`/topic/notificacoes/${user.id}`, (message) => {
        const novaNotificacao = JSON.parse(message.body);
        console.log("📩 Notificação recebida:", novaNotificacao);
        setNotificacoes((prev) => {
          if (prev.some((n) => n.id === novaNotificacao.id)) return prev;
          return [novaNotificacao, ...prev];
        });
      });

      setStompClient(client);
    };

    client.onStompError = (error) => {
      console.error("Erro na conexão WebSocket:", error);
      setMensagemErro("Erro ao conectar ao WebSocket.");
    };

    client.activate();

    return () => {
      if (client.connected) {
        client.deactivate();
        console.log("🔌 WebSocket desconectado");
      }
    };
  }, [user?.id, loading]);

  useEffect(() => {
    if (isInitialLoad && !loading) {
      carregarNotificacoes(true);
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, loading, carregarNotificacoes]);

  return (
    <NotificacoesContainer>
      <NotificacoesTitle>🔔 Suas notificações:</NotificacoesTitle>

      <button onClick={() => carregarNotificacoes(true)}>🔄 Atualizar manualmente</button>

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
