import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import useAuth from "../Seguranca/UseAuth";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import ModalTarefa from "./ModalTarefasDetalhes";
import ModalEdicao from "./Modais/ModalEdicao";
import CriarTarefa from "./Modais/CriarTarefa";

// Estilo do container principal
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 34px;
  width: calc(100% - 34px);
  min-height: 100vh;
  background: #f4f7fa;
  padding: 30px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

// Estilo do cabeçalho
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
`;

// Estilo do título
const Titulo = styled.h1`
  font-family: "Arial", sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
`;

// Estilo do campo de busca
const CampoBusca = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  width: 300px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Estilo do grid de tarefas
const TarefasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
`;

// Estilo de cada card de tarefa
const TarefaCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(240, 5, 5, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.2s ease;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

// Estilo para mensagens de loading ou erro
const Mensagem = styled.p`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin: 20px 0;
`;

// Função de debounce manual
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const TarefasMain = () => {
  const { fetchAuthenticated } = useAuth();
  const [tarefas, setTarefas] = useState([]);
  const [tarefasFiltradas, setTarefasFiltradas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [isLoadingFinalizar, setIsLoadingFinalizar] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [nomeBusca, setNomeBusca] = useState("");
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [showModalEdicao, setShowModalEdicao] = useState(false);
  const [tarefaParaEditar, setTarefaParaEditar] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [cache, setCache] = useState({});

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

  const buscarTarefasPorNome = useCallback(
    async (nome, forceRefresh = false) => {
      const now = Date.now();
      const minInterval = 5000;

      const cacheKey = nome || "all";
      if (!forceRefresh && cache[cacheKey] && now - lastFetchTime < minInterval) {
        console.log(`Usando dados do cache para: ${cacheKey}`);
        if (nome) {
          setTarefasFiltradas(cache[cacheKey]);
          console.log("Tarefas filtradas (cache):", cache[cacheKey]);
        } else if (!isSearching) {
          setTarefas(cache[cacheKey]);
          setTarefasFiltradas(cache[cacheKey]);
          console.log("Tarefas iniciais (cache):", cache[cacheKey]);
        }
        setMensagemErro("");
        return;
      }

      if (isLoading) {
        console.log("Requisição já em andamento, aguardando...");
        return;
      }

      setIsLoading(true);
      setMensagemErro("");

      try {
        const url = nome
          ? `http://localhost:8080/task/search/${encodeURIComponent(nome)}`
          : "http://localhost:8080/task/get";

        const response = await fetchAuthenticated(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setMensagemErro("Nenhuma tarefa encontrada com esse nome.");
            setTarefasFiltradas([]);
            setCache((prev) => ({ ...prev, [cacheKey]: [] }));
            console.log("Tarefas filtradas (404): []");
            return;
          } else if (response.status === 500) {
            throw new Error("Erro interno no servidor. Tente novamente mais tarde.");
          }
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();

        if (!data || data.length === 0) {
          setMensagemErro(nome ? "Nenhuma tarefa encontrada com esse nome." : "Nenhuma tarefa cadastrada.");
          setTarefasFiltradas([]);
          if (!nome) {
            setTarefas([]);
          }
          setCache((prev) => ({ ...prev, [cacheKey]: [] }));
          console.log("Tarefas filtradas (vazio): []");
          return;
        }

        if (nome) {
          setTarefasFiltradas(data);
          console.log("Tarefas filtradas (busca):", data);
        } else if (!isSearching) {
          setTarefas(data);
          setTarefasFiltradas(data);
          console.log("Tarefas iniciais (carregamento):", data);
        }
        setMensagemErro("");
        setLastFetchTime(now);
        setCache((prev) => ({ ...prev, [cacheKey]: data }));
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        setMensagemErro(error.message);
        setTarefasFiltradas([]);
        if (!nome) {
          setTarefas([]);
        }
        console.log("Tarefas filtradas (erro): []");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAuthenticated, isLoading, isSearching, lastFetchTime, cache]
  );

  const finalizarTarefa = async (id) => {
    const confirmacao = window.confirm("Tem certeza que deseja finalizar a tarefa?");
    if (!confirmacao) return;

    setIsLoadingFinalizar(true);
    setMensagemErro("");
    setMensagemSucesso("");

    try {
      const url = `http://localhost:8080/task/end/${id}`;

      const response = await fetchAuthenticated(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const tarefaAtualizada = await response.json();

      setTarefas((tarefasAntigas) =>
        tarefasAntigas.map((tarefa) => (tarefa.id === id ? tarefaAtualizada : tarefa))
      );

      if (tarefaSelecionada && tarefaSelecionada.id === id) {
        setTarefaSelecionada(tarefaAtualizada);
      }

      setMensagemSucesso("Tarefa finalizada com sucesso!");
      setTimeout(() => setMensagemSucesso(""), 3000);

      setCache({});
      await buscarTarefasPorNome("", true);
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
      const url = `http://localhost:8080/task/reopen/${id}`;

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
      setTimeout(() => setMensagemSucesso(""), 3000);

      setCache({});
      await buscarTarefasPorNome("", true);
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
    setCache({});
    buscarTarefasPorNome("", true);
  };

  useEffect(() => {
    buscarTarefasPorNome("");
  }, [buscarTarefasPorNome]);

  const handleBuscaDebounced = useMemo(
    () =>
      debounce((nome) => {
        if (nome.length >= 4) {
          setIsSearching(true);
          buscarTarefasPorNome(nome, true);
        } else {
          setIsSearching(false);
          setTarefasFiltradas(tarefas);
          setMensagemErro("");
          console.log("Tarefas filtradas (menos de 4 letras):", tarefas);
        }
      }, 500),
    [buscarTarefasPorNome, tarefas]
  );

  const handleBusca = (e) => {
    const nome = e.target.value;
    setNomeBusca(nome);
    handleBuscaDebounced(nome);
  };

  const abrirModalDetalhes = (tarefa) => {
    setTarefaSelecionada(tarefa);
  };

  const fecharModal = () => {
    setTarefaSelecionada(null);
  };

  return (
    <ComponentesFixos>
      <MainContainer>
        <Header>
          <Titulo>Tarefas Principais</Titulo>
          <CriarTarefa carregarTarefas={buscarTarefasPorNome} />
        </Header>

        <CampoBusca
          type="text"
          value={nomeBusca}
          onChange={handleBusca}
          placeholder="Buscar tarefa por nome (mínimo 4 letras)..."
        />

        {isLoading ? (
          <Mensagem>Carregando tarefas...</Mensagem>
        ) : mensagemErro ? (
          <Mensagem>{mensagemErro}</Mensagem>
        ) : tarefasFiltradas.length === 0 && nomeBusca.length >= 4 ? (
          <Mensagem>Nenhuma tarefa encontrada.</Mensagem>
        ) : (
          <TarefasGrid>
            {tarefasFiltradas.map((tarefa) => (
              <TarefaCard
                key={tarefa.id}
                onClick={() => abrirModalDetalhes(tarefa)}
              >
                <h3>{tarefa.nomeTarefa}</h3>
                <p>Status: {tarefa.status ? "Ativa" : "Finalizada"}</p>
                <p>Prazo: {formatarData(tarefa.prazoLimite)}</p>
              </TarefaCard>
            ))}
          </TarefasGrid>
        )}

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
            carregarTarefas={buscarTarefasPorNome}
          />
        )}
      </MainContainer>
    </ComponentesFixos>
  );
};

export default TarefasMain;