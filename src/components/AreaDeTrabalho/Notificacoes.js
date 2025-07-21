import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import useAuth from "../Seguranca/UseAuth";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import ModalTarefa from "../Tarefas/ModalTarefasDetalhes";
import ModalEdicao from "../Tarefas/Modais/ModalEdicao";
import { useAuthContext } from '../Seguranca/AuthContext';

// 🎨 Estilos completamente reimaginados
const NotificacoesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  height: 100%;
  padding: 24px;
  gap: 16px;
  border-radius: 0px;
  background: #fff;
  box-sizing: border-box;
`;

const NotificacoesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-shrink: 0;
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

const ClearNotificationsButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.3s ease;
  }

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.4);
  }

  &:hover:before {
    left: 100%;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    box-shadow: none;
  }
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

const MensagemSucesso = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: #f0fdf4;
  border-radius: 8px;
  color: #15803d;
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
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState(""); // "success" ou "error"
  const [isClearing, setIsClearing] = useState(false);
  const [selectedTarefa, setSelectedTarefa] = useState(null);
  const [tarefaParaEditar, setTarefaParaEditar] = useState(null);
  const mensagemTimeoutRef = useRef(null);
  const stompClientRef = useRef(null);
  const isMountedRef = useRef(true);
  const hasLoadedRef = useRef(false);
  const { isSessionInvalid } = useAuthContext();

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

  // Função para limpar a mensagem após um tempo
  const limparMensagem = useCallback(() => {
    if (mensagemTimeoutRef.current) {
      clearTimeout(mensagemTimeoutRef.current);
    }
    mensagemTimeoutRef.current = setTimeout(() => {
      setMensagem("");
      setTipoMensagem("");
    }, 3000);
  }, []);

  // Função para carregar notificações
  const carregarNotificacoes = useCallback(async () => {
    if (!isMountedRef.current || isLoading) return;

    setIsLoading(true);
    setMensagem("");
    setTipoMensagem("");

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
        if (data.length === 0) {
          setMensagem("Nenhuma notificação disponível.");
          setTipoMensagem("error");
          limparMensagem();
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error("Erro ao buscar notificações:", error);
        setMensagem(`Erro ao carregar notificações: ${error.message}`);
        setTipoMensagem("error");
        setNotificacoes([]);
        limparMensagem();
        if (error.message.includes("401")) {
          setMensagem("Sessão expirada. Redirecionando para login...");
          setTipoMensagem("error");
          logoutWithRedirect();
        }
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetchAuthenticated, isLoading, logoutWithRedirect, limparMensagem]);

  // Função para limpar notificações
  const limparNotificacoes = useCallback(async () => {
    const advogadoId = getId();
    if (!advogadoId) {
      setMensagem("Usuário não autenticado. Faça login novamente.");
      setTipoMensagem("error");
      limparMensagem();
      return;
    }

    setIsClearing(true);
    setMensagem("");
    setTipoMensagem("");

    try {
      const response = await fetchAuthenticated(
        `http://localhost:8080/notificacao/delete/${advogadoId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setMensagem("Nenhuma notificação encontrada para este advogado.");
          setTipoMensagem("error");
          limparMensagem();
          return;
        }
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      if (isMountedRef.current) {
        setNotificacoes([]);
        setMensagem("Notificações limpas com sucesso!");
        setTipoMensagem("success");
        limparMensagem();
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error("Erro ao limpar notificações:", error);
        setMensagem(`Erro ao limpar notificações: ${error.message}`);
        setTipoMensagem("error");
        limparMensagem();
      }
    } finally {
      if (isMountedRef.current) {
        setIsClearing(false);
      }
    }
  }, [fetchAuthenticated, getId, limparMensagem]);

  // Função para buscar detalhes da tarefa
  const fetchTarefa = useCallback(
    async (tarefaId) => {
      if (!isMountedRef.current || !tarefaId) return;

      setMensagem("");
      setTipoMensagem("");

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
          setSelectedTarefa(data);
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.error("Erro ao buscar tarefa:", error);
          setMensagem(`Erro ao carregar tarefa: ${error.message}`);
          setTipoMensagem("error");
          limparMensagem();
        }
      }
    },
    [fetchAuthenticated, limparMensagem]
  );

  // Função para finalizar tarefa
  const finalizarTarefa = useCallback(
    async (tarefaId) => {
      if (!isMountedRef.current || !tarefaId) {
        console.warn("Tarefa ID inválido ou componente desmontado:", tarefaId);
        return;
      }

      try {
        const response = await fetchAuthenticated(
          `http://localhost:8080/task/end/${tarefaId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        const tarefaAtualizada = await response.json();
        if (isMountedRef.current) {
          console.log("Tarefa finalizada com sucesso:", tarefaId); // Debugging
          // Atualizar o estado da tarefa para refletir a finalização
          setSelectedTarefa(tarefaAtualizada);
          setMensagem("Tarefa finalizada com sucesso!");
          setTipoMensagem("success");
          carregarNotificacoes();
          limparMensagem();
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.error("Erro ao finalizar tarefa:", error);
          setMensagem(`Erro ao finalizar tarefa: ${error.message}`);
          setTipoMensagem("error");
          limparMensagem();
          if (error.message.includes("401")) {
            setMensagem("Sessão expirada. Redirecionando para login...");
            setTipoMensagem("error");
            logoutWithRedirect();
          }
        }
      }
    },
    [fetchAuthenticated, carregarNotificacoes, logoutWithRedirect, limparMensagem]
  );

  // Função para reativar tarefa
  const reativarTarefa = useCallback(
    async (tarefaId) => {
      if (!isMountedRef.current || !tarefaId) return;

      setMensagem("");
      setTipoMensagem("");

      try {
        const response = await fetchAuthenticated(
          `http://localhost:8080/task/reopen/${tarefaId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        const tarefaAtualizada = await response.json();
        if (isMountedRef.current) {
          setSelectedTarefa(tarefaAtualizada);
          setMensagem("Tarefa reativada com sucesso!");
          setTipoMensagem("success");
          carregarNotificacoes();
          limparMensagem();
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.error("Erro ao reativar tarefa:", error);
          setMensagem(`Erro ao reativar tarefa: ${error.message}`);
          setTipoMensagem("error");
          limparMensagem();
        }
      }
    },
    [fetchAuthenticated, carregarNotificacoes, limparMensagem]
  );

  // Função para editar tarefa
  const editarTarefa = useCallback((tarefa) => {
    setTarefaParaEditar(tarefa);
  }, []);

  // Função para fechar o modal de detalhes
  const closeModal = useCallback(() => {
    setSelectedTarefa(null);
  }, []);

  // Função para fechar o modal de edição
  const closeEditModal = useCallback(() => {
    setTarefaParaEditar(null);
  }, []);

  // Função para atualizar tarefa
  const atualizarTarefa = useCallback((tarefaAtualizada) => {
    setSelectedTarefa((prevTarefa) => {
      if (prevTarefa && prevTarefa.id === tarefaAtualizada.id) {
        return { ...prevTarefa, ...tarefaAtualizada };
      }
      return prevTarefa;
    });
    setMensagem("Tarefa atualizada com sucesso!");
    setTipoMensagem("success");
    carregarNotificacoes();
    limparMensagem();
  }, [carregarNotificacoes, limparMensagem]);

  // Função para carregar tarefas
  const carregarTarefas = useCallback(async () => {
    carregarNotificacoes();
  }, [carregarNotificacoes]);

  // Carregar notificações iniciais
  useEffect(() => {
    if (isSessionInvalid) return;

    isMountedRef.current = true;
    if (!hasLoadedRef.current) {
      carregarNotificacoes();
      hasLoadedRef.current = true;
    }

    return () => {
      isMountedRef.current = false;
      if (mensagemTimeoutRef.current) {
        clearTimeout(mensagemTimeoutRef.current);
      }
    };
  }, [carregarNotificacoes, isSessionInvalid]);

  // Configurar WebSocket
  const setupWebSocket = useCallback(() => {
    const userId = getId();

    if (!userId) {
      setMensagem("Usuário não autenticado. Faça login para receber notificações.");
      setTipoMensagem("error");
      limparMensagem();
      return;
    }

    if (stompClientRef.current && stompClientRef.current.connected) {
      return;
    }

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      if (!isMountedRef.current) return;
      client.subscribe(`/topic/notificacoes/${userId}`, (message) => {
        if (!isMountedRef.current) return;
        const novaNotificacao = JSON.parse(message.body);
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
      setMensagem("Erro ao conectar ao WebSocket: " + frame.headers?.message);
      setTipoMensagem("error");
      limparMensagem();
    };

    client.onWebSocketClose = () => {
      if (!isMountedRef.current) return;
      stompClientRef.current = null;
    };

    client.activate();

    return () => {
      if (client && client.connected) {
        client.deactivate();
        stompClientRef.current = null;
      }
    };
  }, [getId, limparMensagem]);

  useEffect(() => {
    if (isSessionInvalid) return;
    const cleanup = setupWebSocket();
    return cleanup;
  }, [setupWebSocket, isSessionInvalid]);

  // Função para lidar com clique na notificação
  const handleNotificacaoClick = useCallback(
    (notificacao) => {
      if (!notificacao?.id) {
        console.warn("Notificação inválida:", notificacao);
        return;
      }
      if (notificacao.tarefaID) {
        console.log("Carregando tarefa com ID:", notificacao.tarefaID); // Debugging
        fetchTarefa(notificacao.tarefaID);
      } else {
        console.warn("Notificação sem tarefaID:", notificacao);
      }
    },
    [fetchTarefa]
  );

  return (
    <NotificacoesContainer>
      <NotificacoesHeader>
        <NotificacoesTitle>
          <span role="img" aria-label="bell">🔔</span> Notificações
        </NotificacoesTitle>
        <ClearNotificationsButton
          onClick={limparNotificacoes}
          disabled={isClearing}
        >
          {isClearing ? "Limpando..." : "Limpar Notificações"}
        </ClearNotificationsButton>
      </NotificacoesHeader>

      <NotificacoesList>
        {isLoading ? (
          <MensagemCarregando>
            <span role="img" aria-label="loading">⏳</span> Carregando...
          </MensagemCarregando>
        ) : mensagem ? (
          tipoMensagem === "success" ? (
            <MensagemSucesso>
              <span role="img" aria-label="success">✅</span> {mensagem}
            </MensagemSucesso>
          ) : (
            <MensagemErro>
              <span role="img" aria-label="error">⚠️</span> {mensagem}
            </MensagemErro>
          )
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

      {selectedTarefa && (
        <ModalTarefa
          tarefa={selectedTarefa}
          onClose={closeModal}
          onFinalizar={finalizarTarefa}
          onReabrir={reativarTarefa}
          onEditar={editarTarefa}
        />
      )}

      {tarefaParaEditar && (
        <ModalEdicao
          tarefa={tarefaParaEditar}
          onClose={closeEditModal}
          carregarTarefas={carregarTarefas}
          atualizarTarefa={atualizarTarefa}
        />
      )}
    </NotificacoesContainer>
  );
}

export default Notificacoes;