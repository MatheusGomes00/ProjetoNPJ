import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { FaBell } from "react-icons/fa";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../Seguranca/UseAuth";

// Estilos
const NotificacoesContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const SinoIcon = styled(FaBell)`
  font-size: 24px;
  color: #2c3e50;

  &:hover {
    color: #007bff;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #dfe6e9;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 10px;
`;

const NotificacaoItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #f1f1f1;
  font-size: 14px;
  color: #2d3436;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fbfc;
  }
`;

const MensagemErro = styled.p`
  color: red;
  font-weight: bold;
  text-align: center;
  font-size: 14px;
  margin: 10px 0;
`;

const IconeNotificacoes = () => {
  const { fetchAuthenticated, usuario, loading } = useAuth();
  const [notificacoes, setNotificacoes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [mensagemErro, setMensagemErro] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Função para buscar notificações
  const fetchNotificacoes = useCallback(
    async (forceRefresh = false) => {
      if (!usuario?.id) {
        console.log("Usuário não está autenticado ou ID não está disponível.");
        setMensagemErro("Usuário não autenticado.");
        return;
      }

      const now = Date.now();
      const minInterval = 5000;

      if (!forceRefresh && now - lastFetchTime < minInterval && notificacoes.length > 0) {
        console.log("Usando notificações em memória, evitando requisição desnecessária.");
        return;
      }

      setIsLoading(true);
      setMensagemErro("");

      try {
        console.log("Buscando notificações para usuario.id:", usuario.id);
        const token = localStorage.getItem("token");
        console.log("Token sendo enviado:", token);

        const response = await fetchAuthenticated(
          `http://localhost:8080/notificacao/${usuario.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Status da resposta:", response.status);
        console.log("Cabeçalhos da resposta:", response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao buscar notificações: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("Notificações recebidas:", data);

        if (!data || data.length === 0) {
          setMensagemErro("Nenhuma notificação encontrada.");
          setNotificacoes([]);
        } else {
          setNotificacoes(data);
          setMensagemErro("");
        }

        setLastFetchTime(now);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
        setMensagemErro("Erro ao carregar notificações: " + error.message);
        setNotificacoes([]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAuthenticated, usuario?.id, lastFetchTime, notificacoes.length]
  );

  // Carregar notificações iniciais
  useEffect(() => {
    const loadData = async () => {
      if (!isInitialLoad || loading || !usuario?.id) {
        console.log("Aguardando autenticação ou carregamento inicial.");
        return;
      }

      setIsLoading(true);
      try {
        await fetchNotificacoes(true);
        setIsInitialLoad(false);
      } catch (error) {
        console.error("Erro no carregamento inicial:", error);
        setMensagemErro("Erro ao carregar notificações.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isInitialLoad, loading, usuario?.id, fetchNotificacoes]);

  // Configurar WebSocket
  useEffect(() => {
    if (loading || !usuario?.id) {
      console.log("Aguardando autenticação para iniciar WebSocket.");
      return;
    }

    const token = localStorage.getItem("token");
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      debug: (str) => {
        console.log("WebSocket debug:", str);
      },
    });

    client.onConnect = () => {
      console.log("WebSocket conectado para usuario.id:", usuario.id);
      client.subscribe(`/topic/notificacoes/${usuario.id}`, (message) => {
        const notificacao = JSON.parse(message.body);
        console.log("Nova notificação recebida via WebSocket:", notificacao);
        setNotificacoes((prev) => [notificacao, ...prev]);
        toast.info(notificacao.mensagem, {
          position: "top-right",
          autoClose: 5000,
        });
      });
    };

    client.onStompError = (frame) => {
      console.error("Erro no STOMP:", frame);
      toast.error("Erro na conexão com notificações.");
    };

    client.activate();
    setStompClient(client);

    return () => {
      if (client.active) {
        console.log("Desconectando WebSocket...");
        client.deactivate();
      }
    };
  }, [usuario?.id, loading]);

  // Toggle do dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <NotificacoesContainer>
      <SinoIcon onClick={toggleDropdown} />
      {notificacoes.length > 0 && <Badge>{notificacoes.length}</Badge>}
      {mensagemErro && <MensagemErro>{mensagemErro}</MensagemErro>}
      {showDropdown && (
        <Dropdown>
          {isLoading ? (
            <NotificacaoItem>Carregando...</NotificacaoItem>
          ) : notificacoes.length > 0 ? (
            notificacoes.map((notificacao) => (
              <NotificacaoItem key={notificacao.id}>
                {notificacao.mensagem}
              </NotificacaoItem>
            ))
          ) : (
            <NotificacaoItem>Sem notificações.</NotificacaoItem>
          )}
        </Dropdown>
      )}
      <ToastContainer />
    </NotificacoesContainer>
  );
};

export default IconeNotificacoes;