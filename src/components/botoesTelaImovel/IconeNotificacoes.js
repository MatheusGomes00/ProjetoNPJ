import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaBell } from "react-icons/fa";
import useAuth from "../Seguranca/UseAuth";
import ModalTarefa from "../Tarefas/ModalTarefasDetalhes";
import ModalEdicao from "../Tarefas/Modais/ModalEdicao";
import { useAuthContext } from '../Seguranca/AuthContext';

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
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(-10px)'};
  pointer-events: ${props => props.$isVisible ? 'auto' : 'none'};
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

const MensagemSucesso = styled.div`
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  color: #15803d;
  text-align: center;
  padding: 12px;
  background: #f0fdf4;
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
  const { fetchAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState(""); // "success" ou "error"
  const [selectedTarefa, setSelectedTarefa] = useState(null);
  const [, setSelectedNotificacaoId] = useState(null);
  const [tarefaParaEditar, setTarefaParaEditar] = useState(null);
  const [notificacoesFetch, setNotificacoesFetch] = useState([]);
  const mensagemTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const hasLoadedRef = useRef(false);
  const location = useLocation();
  const { isSessionInvalid, notificacoes, setNotificacoes, processedNotificationIds, isMountedRef } = useAuthContext();
  const totalNaoLidas = new Set([
    ...notificacoesFetch.map(n => n.id),
    ...notificacoes.map(n => n.id)
  ]).size;

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

  // Função para carregar notificações não lidas
  const carregarNotificacoes = useCallback(async () => {
    if (!isMountedRef.current || isLoading) return;
    if (isSessionInvalid) return;

    setIsLoading(true);
    setMensagem("");
    setTipoMensagem("");

    try {
      const response = await fetchAuthenticated(
        `/notificacao/getNaoLida`,
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
          processedNotificationIds.current.add(notificacao.id);
        });
        setNotificacoesFetch(uniqueNotificacoes.length > 0 ? uniqueNotificacoes : []);
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error("Erro ao buscar notificações:", error);
        setMensagem(`Erro ao carregar notificações: ${error.message}`);
        setTipoMensagem("error");
        limparMensagem();
        if (error.message.includes("401")) {
          setMensagem("Sessão expirada. Redirecionando para login...");
          setTipoMensagem("error");
          setTimeout(2000);
        }
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [isSessionInvalid, fetchAuthenticated, isLoading, limparMensagem, processedNotificationIds, setNotificacoesFetch, isMountedRef]);

  // Função para marcar notificação como lida
  const marcarComoLida = useCallback(
    async (notificacaoId) => {
      if (!isMountedRef.current || !notificacaoId) {
        console.warn("marcarComoLida aborted: Invalid notificacaoId or component unmounted");
        return;
      }

      try {
        const response = await fetchAuthenticated(
          `/notificacao/end/${notificacaoId}`,
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
            return updated;
          });
          processedNotificationIds.current.delete(notificacaoId);
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.error("Erro ao marcar notificação como lida:", error);
          setMensagem(`Erro ao marcar notificação como lida: ${error.message}`);
          setTipoMensagem("error");
          limparMensagem();
          if (error.message.includes("401")) {
            setMensagem("Sessão expirada. Redirecionando para login...");
            setTipoMensagem("error");
            setTimeout( 2000);
          }
        }
      }
    },
    [fetchAuthenticated, limparMensagem, processedNotificationIds, setNotificacoes, isMountedRef]
  );

  // Função para buscar detalhes da tarefa
  const fetchTarefa = useCallback(
    async (tarefaId, notificacaoId) => {
      if (!isMountedRef.current || !tarefaId) return;

      setMensagem("");
      setTipoMensagem("");

      try {
        const response = await fetchAuthenticated(
          `/task/${tarefaId}`,
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
          setSelectedNotificacaoId(notificacaoId);
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
    [fetchAuthenticated, limparMensagem, isMountedRef]
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
          `/task/end/${tarefaId}`,
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
          console.log("Tarefa finalizada com sucesso:", tarefaId); // Debugging
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
            setTimeout(2000);
          }
        }
      }
    },
    [fetchAuthenticated, carregarNotificacoes, limparMensagem, isMountedRef]
  );

  // Função para reativar tarefa
  const reativarTarefa = useCallback(
    async (tarefaId) => {
      if (!isMountedRef.current || !tarefaId) {
        console.warn("Tarefa ID inválido ou componente desmontado:", tarefaId);
        return;
      }

      setMensagem("");
      setTipoMensagem("");

      try {
        const response = await fetchAuthenticated(
          `/task/reopen/${tarefaId}`,
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
          console.log("Tarefa reativada com sucesso:", tarefaId); // Debugging
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
          if (error.message.includes("401")) {
            setMensagem("Sessão expirada. Redirecionando para login...");
            setTipoMensagem("error");
            setTimeout(2000);
          }
        }
      }
    },
    [fetchAuthenticated, carregarNotificacoes, limparMensagem, isMountedRef]
  );

  // Função para editar tarefa
  const editarTarefa = useCallback((tarefa) => {
    setTarefaParaEditar(tarefa);
  }, []);

  // Função para fechar o modal de detalhes
  const closeModal = useCallback(() => {
    setSelectedTarefa(null);
    setSelectedNotificacaoId(null);
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

  // Função para carregar tarefas (placeholder)
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
  }, [location.pathname, carregarNotificacoes, isSessionInvalid, isMountedRef]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    if (isSessionInvalid) return;
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
  }, [isSessionInvalid]);


  // Toggle do dropdown
  const toggleDropdown = useCallback(() => {
    setShowDropdown((prev) => !prev);
  }, []);

  // Abrir modal e marcar notificação como lida ao clicar na notificação
  const handleNotificacaoClick = useCallback(
    (notificacao) => {
      if (!notificacao?.id) {
        console.warn("Notificação inválida:", notificacao);
        return;
      }
      if (notificacao.tarefaID) {
        fetchTarefa(notificacao.tarefaID, notificacao.id);
        marcarComoLida(notificacao.id);
      } else {
        console.warn("Notificação sem tarefaID:", notificacao);
      }
    },
    [fetchTarefa, marcarComoLida]
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
      {totalNaoLidas > 0 && <Badge>{Math.min(totalNaoLidas, 99)}</Badge>}
      <Dropdown ref={dropdownRef} $isVisible={showDropdown}>
        <DropdownHeader>Notificações</DropdownHeader>
        {isLoading ? (
          <MensagemCarregando>Carregando...</MensagemCarregando>
        ) : mensagem ? (
          tipoMensagem === "success" ? (
            <MensagemSucesso>{mensagem}</MensagemSucesso>
          ) : (
            <MensagemErro>{mensagem}</MensagemErro>
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
};

export default IconeNotificacoes;