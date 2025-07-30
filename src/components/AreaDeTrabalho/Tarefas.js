import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import useAuth from "../Seguranca/UseAuth";
import ModalTarefa from "../Tarefas/ModalTarefasDetalhes";
import ModalEdicao from "../Tarefas/Modais/ModalEdicao";
import CriarTarefa from "../Tarefas/Modais/CriarTarefa";
import { useAuthContext } from '../Seguranca/AuthContext';
import * as Ts from "../Tarefas/TarefasStyles";


const TarefasContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0;
  border: 0;
  background: #fff;
  box-sizing: border-box;
`;

const ListaTarefas = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  flex: 1; 
  overflow-y: auto;
  min-height: 0; 
  gap: 20px;
  box-sizing: border-box;
`;

const LegendaPrioridades = styled.div`
  display: flex;
  margin-top: 20px;
  margin-bottom: 10px;
  gap: 10px;
  font-size: 14px;
  color: #666;
  flex-shrink: 0; 
`;

const TagLegenda = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const CorTag = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ $cor }) => $cor};
`;

function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [showModalEdicao, setShowModalEdicao] = useState(false);
  const { fetchAuthenticated } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFinalizar, setIsLoadingFinalizar] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const { isSessionInvalid } = useAuthContext();
  const [tarefaParaEditar, setTarefaParaEditar] = useState(null);

  const formatarData = (dataString) => {
    if (!dataString) return "Sem prazo";
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  };

  const carregarTarefas = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();
      const minInterval = 5000;

      if (!forceRefresh && now - lastFetchTime < minInterval && tarefas.length > 0) {
       
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetchAuthenticated("/task/get", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar tarefas");
        }

        const data = await response.json();

        if (!data || data.length === 0) {
          setMensagemErro("Nenhuma tarefa cadastrada.");
          setTarefas([]);
          return;
        }

        const tarefasAtivas = data.filter((tarefa) => tarefa.status === true);
        setTarefas(tarefasAtivas);

        if (tarefaSelecionada) {
          const updatedTarefa = tarefasAtivas.find((t) => t.id === tarefaSelecionada.id);
          if (updatedTarefa) {
            setTarefaSelecionada(updatedTarefa);
          } else {
            setTarefaSelecionada(null);
          }
        }

        setMensagemErro("");
        setLastFetchTime(now);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        setMensagemErro("Erro ao carregar tarefas. Tente novamente mais tarde.");
        setTarefas([]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAuthenticated, lastFetchTime, tarefaSelecionada, tarefas.length]
  );

  const finalizarTarefa = async (id) => {
    const confirmacao = window.confirm("Tem certeza que deseja finalizar a tarefa?");
    if (!confirmacao) return;

    setIsLoadingFinalizar(true);
    setMensagemErro("");
    setMensagemSucesso("");

    try {
      const url = `/task/end/${id}`;

      const response = await fetchAuthenticated(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Erro na requisição: ${response.status} - ${errorData || "Sem detalhes"}`);
      }

      const tarefaAtualizada = await response.json();

      setTarefas((tarefasAntigas) =>
        tarefasAntigas.map((tarefa) => (tarefa.id === id ? tarefaAtualizada : tarefa))
      );

      if (tarefaSelecionada && tarefaSelecionada.id === id) {
        setTarefaSelecionada(tarefaAtualizada);
      }

      setMensagemSucesso("Tarefa finalizada com sucesso!");
      setTimeout(() => setMensagemSucesso(""), 1000);
      await carregarTarefas("", true)

    } catch (error) {
      console.error("Erro ao finalizar a tarefa:", error);
      setMensagemErro(error.message || "Erro ao finalizar a tarefa. Tente novamente mais tarde.");
    } finally {
      setIsLoadingFinalizar(false);
    }
  };

  const reabrirTarefa = async (id) => {
    const confirmacao = window.confirm("Tem certeza que deseja reabrir a tarefa?");
    if (!confirmacao) return;

    setIsLoadingFinalizar(true);
    setMensagemErro("");
    setMensagemSucesso("");

    try {
      const url = `/task/reopen/${id}`;

      const response = await fetchAuthenticated(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Erro na requisição: ${response.status} - ${errorData || "Sem detalhes"}`);
      }

      const tarefaAtualizada = await response.json();

      setTarefas((tarefasAntigas) =>
        tarefasAntigas.map((tarefa) => (tarefa.id === id ? tarefaAtualizada : tarefa))
      );

      if (tarefaSelecionada && tarefaSelecionada.id === id) {
        setTarefaSelecionada(tarefaAtualizada);
      }

      setMensagemSucesso("Tarefa reaberta com sucesso!");
      setTimeout(() => setMensagemSucesso(""), 1000);
      
      await carregarTarefas("", true);
    } catch (error) {
      console.error("Erro ao reabrir a tarefa:", error);
      setMensagemErro(error.message || "Erro ao reabrir a tarefa. Tente novamente mais tarde.");
    } finally {
      setIsLoadingFinalizar(false);
    }
  };

  const abrirModalEdicao = (tarefa) => {
    setTarefaParaEditar(tarefa);
    setShowModalEdicao(true);
  };

  const fecharModalEdicao = () => {
    setShowModalEdicao(false);
    setTarefaParaEditar(null);
    carregarTarefas("", true);
  };

  const abrirModalDetalhes = (tarefa) => {
    setTarefaSelecionada(tarefa);
  };

  const fecharModal = () => {
    setTarefaSelecionada(null);
  };

  useEffect(() => {
    if (isSessionInvalid) return;

    const loadData = async () => {
      if (!isInitialLoad) return;
      setIsLoading(true);
      try {
        await carregarTarefas();
        setIsInitialLoad(false);
      } catch (error) {
        console.error("Erro no carregamento inicial:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [isInitialLoad, carregarTarefas, isSessionInvalid]);

  // atualiza ModalTarefa com novos dados
  const atualizarTarefa = useCallback((tarefaAtualizada) => {
    setTarefaSelecionada(tarefaAtualizada); 
  }, []);

  return (
    <TarefasContainer>
      <Ts.Header>
        <Ts.Titulo>Suas Tarefas</Ts.Titulo>
        <CriarTarefa carregarTarefas={carregarTarefas} />
      </Ts.Header>
      {isLoading ? (
        <Ts.Mensagem>Carregando tarefas...</Ts.Mensagem>
      ) : mensagemErro ? (
        <Ts.Mensagem>{mensagemErro}</Ts.Mensagem>
      ) : mensagemSucesso ? (
        <Ts.Mensagem style={{ color: "green" }}>{mensagemSucesso}</Ts.Mensagem>
      ) : (
        <>
          <ListaTarefas>
            {tarefas.map((tarefa) => (
              <Ts.TarefaCard
                key={tarefa.id}
                onClick={() => abrirModalDetalhes(tarefa)}
              >
                <Ts.StatusTag $prioridade={tarefa.prioridade} />
                <Ts.NomeTarefa>{tarefa.nomeTarefa}</Ts.NomeTarefa>
                <div>Status: {tarefa.status ? "Ativa" : "Finalizada"}</div>
                <div>Prazo: {formatarData(tarefa.prazoLimite)}</div>
              </Ts.TarefaCard>
            ))}
          </ListaTarefas>
        </>
      )}
      <LegendaPrioridades>
        <div>Prioridade: </div>
        <TagLegenda>
          <CorTag $cor="#ff3b30" />
          <span>Alta</span>
        </TagLegenda>
        <TagLegenda>
          <CorTag $cor="#ffca28" />
          <span>Média</span>
        </TagLegenda>
        <TagLegenda>
          <CorTag $cor="#34c759" />
          <span>Baixa</span>
        </TagLegenda>
      </LegendaPrioridades>

      {tarefaSelecionada && (
        <ModalTarefa
          tarefa={tarefaSelecionada}
          onClose={fecharModal}
          onFinalizar={finalizarTarefa}
          onReabrir={reabrirTarefa}
          onEditar={abrirModalEdicao}
        />
      )}

      {showModalEdicao && tarefaParaEditar && (
        <ModalEdicao
          tarefa={tarefaParaEditar}
          onClose={fecharModalEdicao}
          carregarTarefas={carregarTarefas}
          atualizarTarefa={atualizarTarefa}
        />
      )}
    </TarefasContainer>
  );
}

export default Tarefas;