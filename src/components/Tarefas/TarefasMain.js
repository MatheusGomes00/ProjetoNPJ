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

// Estilo do container de busca
const BuscaContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 350px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

// Estilo do campo de busca
const CampoBusca = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Estilo do botão de busca
const BotaoBusca = styled.button`
  background:rgb(4, 0, 255);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.3s ease;

  &:hover {
    background: #218838;
  }

  &:active {
    background: #1e7e34;
  }

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

// Estilo do container de navegação
const NavegacaoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #2c3e50;
`;

// Estilo dos botões de navegação
const BotaoNavegacao = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  color: ${({ disabled }) => (disabled ? "#ccc" : "#007bff")};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ disabled }) => (disabled ? "#ccc" : "#0056b3")};
  }
`;

const NomeTarefa = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limita a 2 linhas */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2em; /* Altura da linha para consistência */
  max-height: 2.4em; /* 2 linhas x 1.2em */
  word-wrap: break-word; /* Quebra palavras longas */
`;

const TarefasMain = () => {
  const { fetchAuthenticated } = useAuth();
  const [tarefasOriginais, setTarefasOriginais] = useState([]);
  const [tarefasBuscadas, setTarefasBuscadas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);  
  const [mensagemErro, setMensagemErro] = useState("");
  const [ setMensagemSucesso] = useState("");
  const [ setIsLoadingFinalizar] = useState(false);
  const [nomeBusca, setNomeBusca] = useState("");
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [showModalEdicao, setShowModalEdicao] = useState(false);
  const [tarefaParaEditar, setTarefaParaEditar] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState(null); // "ativas", "inativas", ou null
  const [filtroPrioridade, setFiltroPrioridade] = useState(null); // "alta", "media", "baixa", ou null
  const [currentPage, setCurrentPage] = useState(0); // Página atual, começa em 0
  const [totalPages, setTotalPages] = useState(1); // Total de páginas, começa em 1
  const PAGE_SIZE = 12; // Tamanho da página fixo (12 tarefas por página)

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

  // Função para aplicar os filtros localmente (status → prioridade)
  const aplicarFiltros = (tarefasData, status, prioridade) => {
    let tarefasFiltradas = [...tarefasData];

    // Filtro por status
    if (status) {
      tarefasFiltradas = tarefasFiltradas.filter((tarefa) =>
        status === "ativas" ? tarefa.status : !tarefa.status
      );
    }

    // Filtro por prioridade
    if (prioridade) {
      tarefasFiltradas = tarefasFiltradas.filter(
        (tarefa) => tarefa.prioridade.toLowerCase() === prioridade.toLowerCase()
      );
    }

    return tarefasFiltradas;
  };

  // Função para buscar tarefas no servidor
  const buscarTarefasPorNome = useCallback(
    async (nome = "", forceRefresh = false) => {
      const now = Date.now();
      const minInterval = 5000;
      const cacheKey = nome ? `${nome}_search` : `all_page${currentPage}`;

      if (!forceRefresh && cacheRef.current[cacheKey] && now - lastFetchTimeRef.current < minInterval) {
        const tarefasDoCache = cacheRef.current[cacheKey];
        if (nome) {
          setTarefasBuscadas(tarefasDoCache);
          setTotalPages(Math.ceil(tarefasDoCache.length / PAGE_SIZE) || 1);
        } else {
          setTarefasOriginais(tarefasDoCache);
        }
        setMensagemErro("");
        return;
      }

      if (isLoading) {
        return;
      }

      setIsLoading(true);
      setMensagemErro("");

      try {
        let url;
        if (nome) {
          url = `http://localhost:8080/task/search/${encodeURIComponent(nome)}`;
        } else {
          url = `http://localhost:8080/task/page?page=${currentPage}&size=${PAGE_SIZE}&sort=nomeTarefa,asc`;
        }

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
              setTotalPages(1);
            } else {
              setTarefasOriginais([]);
            }
            cacheRef.current[cacheKey] = [];
            return;
          } else if (response.status === 500) {
            throw new Error("Erro interno no servidor. Tente novamente mais tarde.");
          }
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();

        if (!data || (nome && data.length === 0) || (!nome && !data.content)) {
          setMensagemErro(nome ? "Nenhuma tarefa encontrada com esse nome." : "Nenhuma tarefa cadastrada.");
          if (nome) {
            setTarefasBuscadas([]);
            setTotalPages(1);
          } else {
            setTarefasOriginais([]);
          }
          cacheRef.current[cacheKey] = [];
          return;
        }

        if (nome) {
          // Search returns a flat list
          setTarefasBuscadas(data);
          setTotalPages(Math.ceil(data.length / PAGE_SIZE) || 1);
          cacheRef.current[cacheKey] = data;
        } else {
          // Non-search returns a paginated response
          setTarefasOriginais(data.content);
          setTotalPages(data.totalPages || 1);
          cacheRef.current[cacheKey] = data.content;
        }

        setMensagemErro("");
        lastFetchTimeRef.current = now;
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        setMensagemErro(error.message);
        if (nome) {
          setTarefasBuscadas([]);
          setTotalPages(1);
        } else {
          setTarefasOriginais([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAuthenticated, isLoading, currentPage]
  );

  // Memoizar as tarefas filtradas com paginação no lado do cliente para busca
  const tarefasFiltradas = useMemo(() => {
    let baseTarefas = isSearching ? tarefasBuscadas : tarefasOriginais;
    let tarefas = aplicarFiltros(baseTarefas, filtroStatus, filtroPrioridade);

    // Aplicar paginação no lado do cliente para resultados de busca
    if (isSearching) {
      const startIndex = currentPage * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      return tarefas.slice(startIndex, endIndex);
    }

    return tarefas;
  }, [tarefasOriginais, tarefasBuscadas, isSearching, filtroStatus, filtroPrioridade, currentPage]);

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

  // Carregar tarefas sempre que a página atual mudar (apenas para não-busca)
  useEffect(() => {
    if (!isSearching) {
      buscarTarefasPorNome("");
    }
  }, [currentPage, buscarTarefasPorNome, isSearching]);

  const handleBusca = (e) => {
    setNomeBusca(e.target.value);
  };

  const handleBotaoBusca = () => {
    if (nomeBusca.trim()) {
      setIsSearching(true);
      setCurrentPage(0); // Resetar para a primeira página
      buscarTarefasPorNome(nomeBusca.trim(), true);
    } else {
      setIsSearching(false);
      setCurrentPage(0);
      buscarTarefasPorNome("", true);
    }
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
    setCurrentPage(0); // Resetar página ao mudar filtro
  };

  const handleFiltroPrioridade = (e) => {
    const prioridade = e.target.value === "todas" ? null : e.target.value;
    setFiltroPrioridade(prioridade);
    setCurrentPage(0); // Resetar página ao mudar filtro
  };

  // Funções de navegação entre páginas
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <ComponentesFixos>
      <MainContainer>
        <Header>
          <Titulo>Tarefas Principais</Titulo>
          <CriarTarefa carregarTarefas={buscarTarefasPorNome} />
        </Header>

        <BuscaContainer>
          <CampoBusca
            type="text"
            value={nomeBusca}
            onChange={handleBusca}
            placeholder="Buscar tarefa por nome..."
          />
          <BotaoBusca onClick={handleBotaoBusca}>Procurar</BotaoBusca>
        </BuscaContainer>

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
        ) : tarefasFiltradas.length === 0 && isSearching ? (
          <Mensagem>Nenhuma tarefa encontrada.</Mensagem>
        ) : tarefasFiltradas.length === 0 ? (
          <Mensagem>Nenhuma tarefa corresponde aos filtros selecionados.</Mensagem>
        ) : (
          <>
            <TarefasGrid>
              {tarefasFiltradas.map((tarefa) => (
                <TarefaCard
                  key={tarefa.id}
                  onClick={() => abrirModalDetalhes(tarefa)}
                >
                  <StatusTag prioridade={tarefa.prioridade} />
                  <NomeTarefa>{tarefa.nomeTarefa}</NomeTarefa>
                  <div>Status: {tarefa.status ? "Ativa" : "Finalizada"}</div>
                  <div>Prazo: {formatarData(tarefa.prazoLimite)}</div>
                </TarefaCard>
              ))}
            </TarefasGrid>

            {/* Controles de Navegação */}
            <NavegacaoContainer>
              <BotaoNavegacao onClick={handlePreviousPage} disabled={currentPage === 0}>
                ⬅️
              </BotaoNavegacao>
              <span>Página {currentPage + 1} de {totalPages}</span>
              <BotaoNavegacao onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
                ➡️
              </BotaoNavegacao>
            </NavegacaoContainer>
          </>
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