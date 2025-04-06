import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
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

// Estilo do container de filtros
const FiltrosContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

// Estilo dos botões de filtro de status
const BotaoFiltroStatus = styled.button`
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: ${({ ativo }) => (ativo ? "#007bff" : "#fff")};
  color: ${({ ativo }) => (ativo ? "#fff" : "#333")};
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: ${({ ativo }) => (ativo ? "#0056b3" : "#f0f0f0")};
  }
`;

// Estilo do dropdown de prioridade
const SelectPrioridade = styled.select`
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  background-color: #fff;
  color: #333;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

// Estilo do grid de tarefas
const TarefasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
`;

// Estilo de cada card de tarefa
const TarefaCard = styled.div`
  font-size: 15px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  width: 120px;
  height: 120px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

// Estilo da tag de prioridade
const StatusTag = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 10px;
  height: 20px;
  background-color: ${({ prioridade }) => {
    const prioridadeLower = prioridade.toLowerCase();
    return prioridadeLower === "baixa"
      ? "green"
      : prioridadeLower === "média" || prioridadeLower === "media"
      ? "yellow"
      : "red";
  }};
  border-radius: 30%;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
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
  const [tarefasOriginais, setTarefasOriginais] = useState([]);
  const [tarefasBuscadas, setTarefasBuscadas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [isLoadingFinalizar, setIsLoadingFinalizar] = useState(false);
  const [nomeBusca, setNomeBusca] = useState("");
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [showModalEdicao, setShowModalEdicao] = useState(false);
  const [tarefaParaEditar, setTarefaParaEditar] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState(null); // "ativas", "inativas", ou null
  const [filtroPrioridade, setFiltroPrioridade] = useState(null); // "alta", "media", "baixa", ou null

  // Usar useRef para cache e lastFetchTime
  const cacheRef = useRef({});
  const lastFetchTimeRef = useRef(0);

  const formatarData = (dataString) => {
    if (!dataString) return "Sem prazo";
    const data = new Date(dataString);
    const dia = String(data.getUTCDate()).padStart(2, "0");
    const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
    const ano = data.getUTCFullYear();
    const horas = String(data.getUTCHours()).padStart(2, "0");
    const minutos = String(data.getUTCMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  };

  // Função para aplicar os filtros localmente (nome → status → prioridade)
  const aplicarFiltros = (tarefasData, status, prioridade, nome) => {
    let tarefasFiltradas = [...tarefasData];

    // 1. Filtro por nome (case-insensitive)
    if (nome) {
      tarefasFiltradas = tarefasFiltradas.filter((tarefa) =>
        tarefa.nomeTarefa.toLowerCase().includes(nome.toLowerCase())
      );
    }

    // 2. Filtro por status
    if (status) {
      tarefasFiltradas = tarefasFiltradas.filter((tarefa) =>
        status === "ativas" ? tarefa.status : !tarefa.status
      );
    }

    // 3. Filtro por prioridade
    if (prioridade) {
      tarefasFiltradas = tarefasFiltradas.filter(
        (tarefa) => tarefa.prioridade.toLowerCase() === prioridade.toLowerCase()
      );
    }

    return tarefasFiltradas;
  };

  // Função para buscar tarefas no servidor
  const buscarTarefasPorNome = useCallback(
    async (nome, forceRefresh = false) => {
      const now = Date.now();
      const minInterval = 5000;
      const cacheKey = nome || "all";

      if (!forceRefresh && cacheRef.current[cacheKey] && now - lastFetchTimeRef.current < minInterval) {
        console.log(`Usando dados do cache para: ${cacheKey}`);
        const tarefasDoCache = cacheRef.current[cacheKey];
        if (nome) {
          setTarefasBuscadas(tarefasDoCache);
          console.log("Tarefas buscadas (cache):", tarefasDoCache);
        } else {
          setTarefasOriginais(tarefasDoCache);
          console.log("Tarefas iniciais (cache):", tarefasDoCache);
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
            if (nome) {
              setTarefasBuscadas([]);
            } else {
              setTarefasOriginais([]);
            }
            cacheRef.current[cacheKey] = [];
            console.log("Tarefas buscadas (404): []");
            return;
          } else if (response.status === 500) {
            throw new Error("Erro interno no servidor. Tente novamente mais tarde.");
          }
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();

        if (!data || data.length === 0) {
          setMensagemErro(nome ? "Nenhuma tarefa encontrada com esse nome." : "Nenhuma tarefa cadastrada.");
          if (nome) {
            setTarefasBuscadas([]);
          } else {
            setTarefasOriginais([]);
          }
          cacheRef.current[cacheKey] = [];
          console.log("Tarefas buscadas (vazio): []");
          return;
        }

        if (nome) {
          setTarefasBuscadas(data);
          console.log("Tarefas buscadas (servidor):", data);
        } else {
          setTarefasOriginais(data);
          console.log("Tarefas iniciais (carregamento):", data);
        }
        setMensagemErro("");
        lastFetchTimeRef.current = now;
        cacheRef.current[cacheKey] = data;
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        setMensagemErro(error.message);
        if (nome) {
          setTarefasBuscadas([]);
        } else {
          setTarefasOriginais([]);
        }
        console.log("Tarefas buscadas (erro): []");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAuthenticated, isLoading]
  );

  // Memoizar as tarefas filtradas, aplicando todos os filtros (nome → status → prioridade)
  const tarefasFiltradas = useMemo(() => {
    let baseTarefas = isSearching && nomeBusca.length >= 4 ? tarefasBuscadas : tarefasOriginais;
    return aplicarFiltros(baseTarefas, filtroStatus, filtroPrioridade, nomeBusca);
  }, [tarefasOriginais, tarefasBuscadas, isSearching, filtroStatus, filtroPrioridade, nomeBusca]);

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

      setTarefasOriginais((tarefasAntigas) =>
        tarefasAntigas.map((tarefa) => (tarefa.id === id ? tarefaAtualizada : tarefa))
      );

      if (tarefaSelecionada && tarefaSelecionada.id === id) {
        setTarefaSelecionada(tarefaAtualizada);
      }

      setMensagemSucesso("Tarefa finalizada com sucesso!");
      setTimeout(() => setMensagemSucesso(""), 3000);

      cacheRef.current = {};
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

      setTarefasOriginais((tarefasAntigas) =>
        tarefasAntigas.map((tarefa) => (tarefa.id === id ? tarefaAtualizada : tarefa))
      );

      if (tarefaSelecionada && tarefaSelecionada.id === id) {
        setTarefaSelecionada(tarefaAtualizada);
      }

      setMensagemSucesso("Tarefa reaberta com sucesso!");
      setTimeout(() => setMensagemSucesso(""), 3000);

      cacheRef.current = {};
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
    cacheRef.current = {};
    buscarTarefasPorNome("", true);
  };

  // Carregar tarefas apenas uma vez ao montar o componente
  useEffect(() => {
    buscarTarefasPorNome("");
  }, []); // Sem dependências

  const handleBuscaDebounced = useMemo(
    () =>
      debounce((nome) => {
        if (nome.length >= 4) {
          setIsSearching(true);
          buscarTarefasPorNome(nome, true);
        } else {
          setIsSearching(false);
          setMensagemErro("");
          console.log("Tarefas filtradas (menos de 4 letras):", tarefasOriginais);
        }
      }, 500),
    [buscarTarefasPorNome, tarefasOriginais]
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

  // Funções para manipular os filtros
  const handleFiltroStatus = (status) => {
    setFiltroStatus((prev) => (prev === status ? null : status));
    // Reavaliar a busca com o novo filtro de status
    if (nomeBusca.length >= 4) {
      setIsSearching(true);
      buscarTarefasPorNome(nomeBusca, true);
    } else {
      setIsSearching(false);
    }
  };

  const handleFiltroPrioridade = (e) => {
    const prioridade = e.target.value === "todas" ? null : e.target.value;
    setFiltroPrioridade(prioridade);
    // Sempre reavaliar a busca ao mudar a prioridade
    if (nomeBusca.length >= 4) {
      setIsSearching(true);
      buscarTarefasPorNome(nomeBusca, true);
    } else {
      setIsSearching(false);
    }
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
          placeholder="Buscar tarefa por nome..."
        />

        {/* Filtros */}
        <FiltrosContainer>
          <div>
            <span>Mostrar apenas: </span>
            <BotaoFiltroStatus
              ativo={filtroStatus === "ativas"}
              onClick={() => handleFiltroStatus("ativas")}
            >
              Ativas
            </BotaoFiltroStatus>
            <BotaoFiltroStatus
              ativo={filtroStatus === "inativas"}
              onClick={() => handleFiltroStatus("inativas")}
            >
              Inativas
            </BotaoFiltroStatus>
          </div>
          <div>
            <span>Prioridade: </span>
            <SelectPrioridade
              value={filtroPrioridade || "todas"}
              onChange={handleFiltroPrioridade}
            >
              <option value="todas">Todas</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </SelectPrioridade>
          </div>
        </FiltrosContainer>

        {isLoading ? (
          <Mensagem>Carregando tarefas...</Mensagem>
        ) : mensagemErro ? (
          <Mensagem>{mensagemErro}</Mensagem>
        ) : tarefasFiltradas.length === 0 && nomeBusca.length >= 4 ? (
          <Mensagem>Nenhuma tarefa encontrada.</Mensagem>
        ) : tarefasFiltradas.length === 0 ? (
          <Mensagem>Nenhuma tarefa corresponde aos filtros selecionados.</Mensagem>
        ) : (
          <TarefasGrid>
            {tarefasFiltradas.map((tarefa) => (
              <TarefaCard
                key={tarefa.id}
                onClick={() => abrirModalDetalhes(tarefa)}
              >
                <StatusTag prioridade={tarefa.prioridade} />
                <div>{tarefa.nomeTarefa}</div>
                <div>Status: {tarefa.status ? "Ativa" : "Finalizada"}</div>
                <div>Prazo: {formatarData(tarefa.prazoLimite)}</div>
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