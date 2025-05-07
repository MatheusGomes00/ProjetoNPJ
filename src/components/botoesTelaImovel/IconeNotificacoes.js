import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { FaBell } from "react-icons/fa";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../Seguranca/UseAuth";
import ModalTarefa from "../Tarefas/ModalTarefasDetalhes";

// Estilos
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

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
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
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
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
  transition: opacity 0.2s ease, transform 0.2s ease;
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: ${props => props.isVisible ? 'translateY(0)' : 'translateY(-10px)'};
  pointer-events: ${props => props.isVisible ? 'auto' : 'none'};
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
  cursor: pointer;

  &:hover {
    background: #eff6ff;
  }

  &:last-child {
    margin-bottom: 0;
  }

  &:focus {
    outline: 2px solid #3b82f6;
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
  const [selectedTarefa, setSelectedTarefa] = useState(null);
  const [selectedNotificacaoId, setSelectedNotificacaoId] = useState(null);
  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const dropdownRef = useRef(null);
  const isMountedRef = useRef(true);
  const hasLoadedRef = useRef(false);
  const processedNotificationIds = useRef(new Set());

  // Função para formatar a data
  const formatarData = useCallback((dataString) => {
    if (!dataString) return "Sem data";
    const data = new Date(dataString);
    if (isNaN(data.getTime())) return "Data inválida";
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");
    const segundos = String(data.getSeconds()).padStart(2, "0");
    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
  }, []);

  // Função para carregar notificações não lidas
  const carregarNotificacoes = useCallback(async () => {
    if (!isMountedRef.current || isLoading) return;

    setIsLoading(true);
    setMensagemErro("");

    try {
      const response = await fetchAuthenticated(
        `http://localhost:8080/notificacao/getNaoLida`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      if (isMountedRef.current) {
        const uniqueNotificacoes = data.filter(
          (notificacao) => !processedNotificationIds.current.has(notificacao.id)
        );
        uniqueNotificacoes.forEach((notificacao) => {
          console.log(`Fetched notification: ${notificacao.id}, tarefaID: ${notificacao.tarefaID}`);
          processedNotificationIds.current.add(notificacao.id);
        });
        setNotificacoes(uniqueNotificacoes.length > 0 ? uniqueNotificacoes : []);
        setMensagemErro(
          uniqueNotificacoes.length === 0
            ? "Nenhuma notificação não lida disponível."
            : ""
        );
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error("Erro ao buscar notificações:", error);
        setMensagemErro(`Erro ao carregar notificações: ${error.message}`);
        setNotificacoes([]);
        if (error.message.includes("401")) {
          setMensagemErro("Sessão expirada. Redirecionando...");
          setTimeout(logoutWithRedirect, 2000);
        }
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetchAuthenticated, isLoading, logoutWithRedirect]);

  // Função para marcar notificação como lida
  const marcarComoLida = useCallback(
    async (notificacaoId) => {
      if (!isMountedRef.current || !notificacaoId) {
        console.warn("marcarComoLida aborted: Invalid notificacaoId or component unmounted");
        return;
      }

      try {
        const response = await fetchAuthenticated(
          `http://localhost:8080/notificacao/end/${notificacaoId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        if (isMountedRef.current) {
          setNotificacoes((prev) => {
            const updated = prev.filter((n) => n.id !== notificacaoId);
            console.log(`Notificação ${notificacaoId} marcada como lida. Notificações restantes: ${updated.length}`);
            return updated;
          });
          processedNotificationIds.current.delete(notificacaoId);
          toast.success("Notificação marcada como lida!", {
            position: "top-right",
            autoClose: 3000,
            toastId: `success-${notificacaoId}`,
          });
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.error("Erro ao marcar notificação como lida:", error);
          toast.error(`Erro ao marcar notificação: ${error.message}`, {
            position: "top-right",
            autoClose: 5000,
            toastId: `error-${notificacaoId}`,
          });
          if (error.message.includes("401")) {
            setMensagemErro("Sessão expirada. Redirecionando...");
            setTimeout(logoutWithRedirect, 2000);
          }
        }
      }
    },
    [fetchAuthenticated, logoutWithRedirect]
  );

  // Função para buscar detalhes da tarefa
  const fetchTarefa = useCallback(
    async (tarefaId, notificacaoId) => {
      if (!isMountedRef.current || !tarefaId) return;

      try {
        const response = await fetchAuthenticated(
          `http://localhost:8080/task/${tarefaId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        if (isMountedRef.current) {
          console.log(`Tarefa fetched: ${tarefaId}`, data);
          setSelectedTarefa(data);
          setSelectedNotificacaoId(notificacaoId);
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.error("Erro ao buscar tarefa:", error);
          toast.error(`Erro ao carregar tarefa: ${error.message}`, {
            position: "top-right",
            autoClose: 5000,
            toastId: `error-tarefa-${tarefaId}`,
          });
        }
      }
    },
    [fetchAuthenticated]
  );

  // Função para finalizar tarefa
  const finalizarTarefa = useCallback(
    async (tarefaId) => {
      if (!isMountedRef.current || !tarefaId) return;

      try {
        const response = await fetchAuthenticated(
          `http://localhost:8080/tarefas/finalizar/${tarefaId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        if (isMountedRef.current) {
          setSelectedTarefa(null);
          if (selectedNotificacaoId) {
            await marcarComoLida(selectedNotificacaoId);
          }
          toast.success("Tarefa finalizada com sucesso!", {
            position: "top-right",
            autoClose: 3000,
            toastId: `success-tarefa-${tarefaId}`,
          });
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.error("Erro ao finalizar tarefa:", error);
          toast.error(`Erro ao finalizar tarefa: ${error.message}`, {
            position: "top-right",
            autoClose: 5000,
            toastId: `error-tarefa-${tarefaId}`,
          });
        }
      }
    },
    [fetchAuthenticated, marcarComoLida, selectedNotificacaoId]
  );

  // Função para reativar tarefa
  const reativarTarefa = useCallback(
    async (tarefaId) => {
      if (!isMountedRef.current || !tarefaId) return;

      try {
        const response = await fetchAuthenticated(
          `http://localhost:8080/tarefas/reativar/${tarefaId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        if (isMountedRef.current) {
          setSelectedTarefa(null);
          toast.success("Tarefa reativada com sucesso!", {
            position: "top-right",
            autoClose: 3000,
            toastId: `success-reativar-${tarefaId}`,
          });
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.error("Erro ao reativar tarefa:", error);
          toast.error(`Erro ao reativar tarefa: ${error.message}`, {
            position: "top-right",
            autoClose: 5000,
            toastId: `error-reativar-${tarefaId}`,
          });
        }
      }
    },
    [fetchAuthenticated]
  );

  // Função para editar tarefa (placeholder)
  const editarTarefa = useCallback((tarefa) => {
    console.log("Editar tarefa:", tarefa);
    toast.info("Funcionalidade de edição ainda não implementada.", {
      position: "top-right",
      autoClose: 3000,
      toastId: `info-editar-${tarefa.id}`,
    });
  }, []);

  // Carregar notificações iniciais
  useEffect(() => {
    isMountedRef.current = true;
    if (!hasLoadedRef.current) {
      carregarNotificacoes();
      hasLoadedRef.current = true;
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [carregarNotificacoes]);

  // Configurar WebSocket
  const setupWebSocket = useCallback(() => {
    const userId = getId();
    if (!userId) {
      setMensagemErro("Usuário não autenticado.");
      console.error("No userId found for WebSocket subscription");
      return;
    }

    if (stompClientRef.current?.connected) {
      console.log("WebSocket already connected, skipping setup");
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
      console.log(`✅ Conectado ao WebSocket para userId: ${userId}`);

      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        console.log("Unsubscribed previous WebSocket subscription");
      }

      subscriptionRef.current = client.subscribe(`/topic/notificacoes/${userId}`, (message) => {
        if (!isMountedRef.current) return;
        try {
          const novaNotificacao = JSON.parse(message.body);
          console.log(`Received WebSocket notification: ${novaNotificacao.id}, tarefaID: ${novaNotificacao.tarefaID}, lida: ${novaNotificacao.lida}`);
          if (!novaNotificacao.lida && !processedNotificationIds.current.has(novaNotificacao.id)) {
            processedNotificationIds.current.add(novaNotificacao.id);
            setNotificacoes((prev) => {
              if (prev.some((n) => n.id === novaNotificacao.id)) {
                console.log(`Notificação ${novaNotificacao.id} já existe, ignorando`);
                return prev;
              }
              console.log(`Adicionando nova notificação: ${novaNotificacao.id}`);
              return [novaNotificacao, ...prev];
            });
            toast.info(novaNotificacao.mensagem, {
              position: "top-right",
              autoClose: 5000,
              toastId: `info-${novaNotificacao.id}`,
              onClose: () => console.log(`Toast ${novaNotificacao.id} closed`),
            });
          } else {
            console.log(`Ignoring notification: ${novaNotificacao.id} (lida: ${novaNotificacao.lida}, processed: ${processedNotificationIds.current.has(novaNotificacao.id)})`);
          }
        } catch (error) {
          console.error("Erro ao processar mensagem WebSocket:", error);
        }
      });
      stompClientRef.current = client;
    };

    client.onStompError = (frame) => {
      if (!isMountedRef.current) return;
      console.error("Erro no STOMP:", frame);
      setMensagemErro("Erro na conexão de notificações.");
    };

    client.onWebSocketClose = () => {
      if (!isMountedRef.current) return;
      console.log("🔌 Conexão WebSocket fechada");
      stompClientRef.current = null;
      subscriptionRef.current = null;
    };

    client.activate();

    return () => {
      if (client?.connected) {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
          console.log("Unsubscribed WebSocket subscription on cleanup");
        }
        client.deactivate();
        console.log("🔌 WebSocket desconectado");
        stompClientRef.current = null;
        subscriptionRef.current = null;
      }
    };
  }, [getId]);

  useEffect(() => {
    const cleanup = setupWebSocket();
    return cleanup;
  }, [setupWebSocket]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest("svg")
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle do dropdown
  const toggleDropdown = useCallback(() => {
    setShowDropdown((prev) => !prev);
  }, []);

  // Fechar modal
  const closeModal = useCallback(() => {
    setSelectedTarefa(null);
    setSelectedNotificacaoId(null);
  }, []);

  // Abrir modal ao clicar na notificação
  const handleNotificacaoClick = useCallback(
    (notificacao) => {
      if (notificacao.tarefaID) {
        console.log(`Opening modal for tarefaID: ${notificacao.tarefaID}, notificacaoId: ${notificacao.id}`);
        fetchTarefa(notificacao.tarefaID, notificacao.id);
      } else {
        console.warn("Notificação sem tarefaID:", notificacao);
        toast.error("Não foi possível carregar a tarefa.", {
          position: "top-right",
          autoClose: 5000,
          toastId: `error-no-tarefa-${notificacao.id}`,
        });
      }
    },
    [fetchTarefa]
  );

  return (
    <NotificacoesContainer>
      <SinoIcon
        onClick={toggleDropdown}
        onKeyDown={(e) => e.key === "Enter" && toggleDropdown()}
        tabIndex={0}
        role="button"
        aria-label="Toggle notificações"
      />
      {notificacoes.length > 0 && <Badge>{Math.min(notificacoes.length, 99)}</Badge>}
      <Dropdown ref={dropdownRef} isVisible={showDropdown}>
        <DropdownHeader>Notificações</DropdownHeader>
        {isLoading ? (
          <MensagemCarregando>Carregando...</MensagemCarregando>
        ) : notificacoes.length > 0 ? (
          notificacoes.map((notificacao) => (
            <NotificacaoItem
              key={notificacao.id}
              onClick={() => handleNotificacaoClick(notificacao)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleNotificacaoClick(notificacao)}
              role="button"
              aria-label={`Ver detalhes da tarefa: ${notificacao.mensagem}`}
            >
              <NotificacaoIcon aria-hidden="true">🔔</NotificacaoIcon>
              <NotificacaoContent>
                <NotificacaoMensagem>{notificacao.mensagem}</NotificacaoMensagem>
                <NotificacaoData>{formatarData(notificacao.dataCriacao)}</NotificacaoData>
              </NotificacaoContent>
            </NotificacaoItem>
          ))
        ) : (
          <MensagemErro>Nenhuma notificação não lida disponível.</MensagemErro>
        )}
      </Dropdown>
      {selectedTarefa && (
        <ModalTarefa
          tarefa={selectedTarefa}
          onClose={closeModal}
          onFinalizar={finalizarTarefa}
          onReabrir={reativarTarefa}
          onEditar={editarTarefa}
          marcarComoLida={() => selectedNotificacaoId && marcarComoLida(selectedNotificacaoId)}
        />
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </NotificacoesContainer>
  );
};

export default IconeNotificacoes;