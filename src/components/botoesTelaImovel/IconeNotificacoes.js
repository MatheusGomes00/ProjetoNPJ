import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { FaBell } from "react-icons/fa";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../Seguranca/UseAuth";

// Estilos (novo design para dropdown)
const NotificacoesContainer = styled.div`
  position: relative;
  cursor: pointer;
  z-index: 1000;
`;

const SinoIcon = styled(FaBell)`
  font-size: 28px;
  color: #1f2937;
  transition: color 0.2s ease, transform 0.2s ease;
  pointer-events: auto;

  &:hover {
    color: #3b82f6;
    transform: scale(1.1);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -10px;
  right: -10px;
  background: #e11d48;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 48px;
  right: -16px;
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  padding: 16px;
  transform: translateZ(0);
`;

const DropdownHeader = styled.div`
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  color: #1f2937;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 12px;
`;

const NotificacaoItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background 0.2s ease;
  font-family: "Inter", sans-serif;

  &:hover {
    background: #eff6ff;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const NotificacaoIcon = styled.span`
  font-size: 1.2rem;
  color: #3b82f6;
  margin-right: 12px;
`;

const NotificacaoContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NotificacaoMensagem = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
  color: #1f2937;
`;

const NotificacaoData = styled.div`
  font-weight: 400;
  font-size: 0.75rem;
  color: #6b7280;
`;

const MensagemErro = styled.div`
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  color: #e11d48;
  text-align: center;
  padding: 12px;
  background: #fff1f2;
  border-radius: 8px;
  margin: 8px 0;
`;

const MensagemCarregando = styled.div`
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  color: #4b5563;
  text-align: center;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 8px;
  margin: 8px 0;
`;

const IconeNotificacoes = () => {
  const { fetchAuthenticated, getId, logoutWithRedirect } = useAuth();
  const [notificacoes, setNotificacoes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const stompClientRef = useRef(null);
  const isMountedRef = useRef(true);
  const hasLoadedRef = useRef(false);

  // Função para formatar a data (idêntica ao Notificacoes.jsx)
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

  // Função para carregar notificações (idêntica ao Notificacoes.jsx)
  const carregarNotificacoes = useCallback(async () => {
    if (!isMountedRef.current || isLoading) return;

    setIsLoading(true);
    setMensagemErro("");

    try {
      const response = await fetchAuthenticated(
        `http://localhost:8080/notificacao/getNaoLida`,
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

  // Carregar notificações iniciais (idêntico ao Notificacoes.jsx)
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

  // Configurar WebSocket (idêntico ao Notificacoes.jsx)
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
        toast.info(novaNotificacao.mensagem, {
          position: "top-right",
          autoClose: 5000,
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

  // Toggle do dropdown
  const toggleDropdown = () => {
    console.log("Toggle dropdown chamado, novo estado:", !showDropdown);
    setShowDropdown(!showDropdown);
  };

  return (
    <NotificacoesContainer>
      <SinoIcon onClick={toggleDropdown} />
      {notificacoes.length > 0 && <Badge>{notificacoes.length}</Badge>}
      {mensagemErro && !showDropdown && <MensagemErro>{mensagemErro}</MensagemErro>}
      {showDropdown && (
        <Dropdown>
          {console.log("Renderizando dropdown, notificacoes:", notificacoes)}
          <DropdownHeader>Notificações</DropdownHeader>
          {isLoading ? (
            <MensagemCarregando>Carregando...</MensagemCarregando>
          ) : notificacoes.length > 0 ? (
            notificacoes.map((notificacao) => (
              <NotificacaoItem key={notificacao.id}>
                <NotificacaoIcon>🔔</NotificacaoIcon>
                <NotificacaoContent>
                  <NotificacaoMensagem>{notificacao.mensagem}</NotificacaoMensagem>
                  <NotificacaoData>{formatarData(notificacao.dataCriacao)}</NotificacaoData>
                </NotificacaoContent>
              </NotificacaoItem>
            ))
          ) : (
            <MensagemErro>Nenhuma notificação disponível.</MensagemErro>
          )}
        </Dropdown>
      )}
      <ToastContainer />
    </NotificacoesContainer>
  );
};

export default IconeNotificacoes;