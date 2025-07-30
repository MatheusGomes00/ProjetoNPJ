import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import useAuth from "../Seguranca/UseAuth";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import ModalTarefa from "./ModalTarefasDetalhes";
import ModalEdicao from "./Modais/ModalEdicao";
import CriarTarefa from "./Modais/CriarTarefa";
import { useAuthContext } from '../Seguranca/AuthContext';
import * as Ts from "./TarefasStyles"


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
  const [currentPage, setCurrentPage] = useState(0); // Página atual, começa em 0
  const [totalPages, setTotalPages] = useState(1); // Total de páginas, começa em 1
  const PAGE_SIZE = 12; // Tamanho da página fixo (12 tarefas por página)
  const { isSessionInvalid } = useAuthContext();

  // Usar useRef para cache e lastFetchTime
  const cacheRef = useRef({});
  const lastFetchTimeRef = useRef(0);

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
      const cacheKey = nome ? `${nome}_search` : `all_tasks`;

      if (!forceRefresh && cacheRef.current[cacheKey] && now - lastFetchTimeRef.current < minInterval) {
        const tarefasDoCache = cacheRef.current[cacheKey];
        if (nome) {
          setTarefasBuscadas(tarefasDoCache);
          setTotalPages(Math.ceil(tarefasDoCache.length / PAGE_SIZE) || 1);
        } else {
          setTarefasOriginais(tarefasDoCache);
          setTotalPages(Math.ceil(tarefasDoCache.length / PAGE_SIZE) || 1);
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
        let url = nome
          ? `/task/search/${encodeURIComponent(nome)}`
          : `/task/get`;

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
              setTotalPages(1);
            }
            cacheRef.current[cacheKey] = [];
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
            setTotalPages(1);
          } else {
            setTarefasOriginais([]);
            setTotalPages(1);
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
          // /task/get returns a flat list
          setTarefasOriginais(data);
          setTotalPages(Math.ceil(data.length / PAGE_SIZE) || 1);
          cacheRef.current[cacheKey] = data;
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
          setTotalPages(1);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAuthenticated, isLoading]
  );

  // Memoizar as tarefas filtradas com paginação no lado do cliente
  const tarefasFiltradas = useMemo(() => {
    let baseTarefas = isSearching ? tarefasBuscadas : tarefasOriginais;
    let tarefas = aplicarFiltros(baseTarefas, filtroStatus, filtroPrioridade);

    // Aplicar paginação no lado do cliente
    const startIndex = currentPage * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return tarefas.slice(startIndex, endIndex);
  }, [tarefasOriginais, tarefasBuscadas, isSearching, filtroStatus, filtroPrioridade, currentPage]);

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
    if (isSessionInvalid) return;
    if (!isSearching) {
      buscarTarefasPorNome("");
    }
  }, [isSessionInvalid, buscarTarefasPorNome, isSearching]);

  // atualiza ModalTarefa com novos dados
  const atualizarTarefa = useCallback((tarefaAtualizada) => {
    setTarefaSelecionada(tarefaAtualizada); 
  }, []);

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

  // Calcular totalPages com base nas tarefas filtradas
  const filteredTotalPages = useMemo(() => {
    const baseTarefas = isSearching ? tarefasBuscadas : tarefasOriginais;
    const tarefas = aplicarFiltros(baseTarefas, filtroStatus, filtroPrioridade);
    return Math.ceil(tarefas.length / PAGE_SIZE) || 1;
  }, [tarefasOriginais, tarefasBuscadas, isSearching, filtroStatus, filtroPrioridade]);

  return (
    <ComponentesFixos>
      <Ts.MainContainer>
        <Ts.Header>
          <Ts.Titulo>Suas Tarefas</Ts.Titulo>
          <CriarTarefa carregarTarefas={buscarTarefasPorNome} />
        </Ts.Header>

        <Ts.BuscaContainer>
          <Ts.CampoBusca
            type="text"
            value={nomeBusca}
            onChange={handleBusca}
            placeholder="Buscar tarefa por nome..."
          />
          <Ts.BotaoBusca onClick={handleBotaoBusca}>Procurar</Ts.BotaoBusca>
        </Ts.BuscaContainer>

        {/* Filtros */}
        <Ts.FiltrosContainer>
          <div>
            <span>Mostrar apenas: </span>
            <Ts.BotaoFiltroStatus
              $ativo={filtroStatus === "ativas"}
              onClick={() => handleFiltroStatus("ativas")}
            >
              Ativas
            </Ts.BotaoFiltroStatus>
            <Ts.BotaoFiltroStatus
              $ativo={filtroStatus === "inativas"}
              onClick={() => handleFiltroStatus("inativas")}
            >
              Inativas
            </Ts.BotaoFiltroStatus>
          </div>
          <div>
            <span>Prioridade: </span>
            <Ts.SelectPrioridade
              value={filtroPrioridade || "todas"}
              onChange={handleFiltroPrioridade}
            >
              <option value="todas">Todas</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </Ts.SelectPrioridade>
          </div>
          <Ts.LegendaPrioridades>
            <Ts.TagLegenda>
              <Ts.CorTag $cor="#ff3b30" />
              <span>Alta</span>
            </Ts.TagLegenda>
            <Ts.TagLegenda>
              <Ts.CorTag $cor="#ffca28" />
              <span>Média</span>
            </Ts.TagLegenda>
            <Ts.TagLegenda>
              <Ts.CorTag $cor="#34c759" />
              <span>Baixa</span>
            </Ts.TagLegenda>
          </Ts.LegendaPrioridades>
        </Ts.FiltrosContainer>

        {isLoading ? (
          <Ts.Mensagem>Carregando tarefas...</Ts.Mensagem>
        ) : mensagemErro ? (
          <Ts.Mensagem>{mensagemErro}</Ts.Mensagem>
        ) : mensagemSucesso ? (
          <Ts.Mensagem style={{ color: "green" }}>{mensagemSucesso}</Ts.Mensagem>
        ) : tarefasFiltradas.length === 0 && isSearching ? (
          <Ts.Mensagem>Nenhuma tarefa encontrada.</Ts.Mensagem>
        ) : tarefasFiltradas.length === 0 ? (
          <Ts.Mensagem>Nenhuma tarefa corresponde aos filtros selecionados.</Ts.Mensagem>
        ) : (
          <>
            <Ts.TarefasGrid>
              {tarefasFiltradas.map((tarefa) => (
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
            </Ts.TarefasGrid>

            {/* Controles de Navegação */}
            <Ts.NavegacaoContainer>
              <Ts.BotaoNavegacao onClick={handlePreviousPage} disabled={currentPage === 0}>
                ⬅️
              </Ts.BotaoNavegacao>
              <span>Página {currentPage + 1} de {filteredTotalPages}</span>
              <Ts.BotaoNavegacao onClick={handleNextPage} disabled={currentPage === filteredTotalPages - 1}>
                ➡️
              </Ts.BotaoNavegacao>
            </Ts.NavegacaoContainer>
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
            atualizarTarefa={atualizarTarefa}
          />
        )}
      </Ts.MainContainer>
    </ComponentesFixos>
  );
};

export default TarefasMain;