import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import useAuth from "../Seguranca/UseAuth";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import { useAuthContext } from '../Seguranca/AuthContext';
import { useNavigate } from "react-router-dom";
import {
  MainContainer,
  Header,
  Titulo,
  BotaoAdicionar,
  CampoBusca,
  FiltrosContainer,
  BotaoFiltroStatus,
  ClientesContainer,
  ClientesList,
  ClienteCard,
  ClienteNome,
  Status,
  Mensagem,
  NavegacaoContainer,
  BotaoNavegacao,
} from "../Clientes/EstilosClientes";

// Função de debounce
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const AdvogadosMain = () => {
  const { fetchAuthenticated, getId, getRole } = useAuth();
  const [advogadosOriginais, setAdvogadosOriginais] = useState([]);
  const [advogadosBuscados, setAdvogadosBuscados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [nomeBusca, setNomeBusca] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState(null); 
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 6; 
  const { isSessionInvalid } = useAuthContext();

  const navigate = useNavigate();

  // Cache e controle de tempo
  const cacheRef = useRef({});
  const lastFetchTimeRef = useRef(0);

  // Função para normalizar o status
  const normalizeStatus = (status) => {
    if (typeof status === "boolean") return status;
    if (typeof status === "string") {
      const lowerStatus = status.toLowerCase();
      return lowerStatus === "ativo" || lowerStatus === "true";
    }
    return !!status; // Fallback para outros tipos
  };

  // Função para aplicar filtros (status)
  const aplicarFiltros = (advogadosData, status, nome) => {
    let advogadosFiltrados = [...advogadosData];

    // Filtro por nome
    if (nome) {
      advogadosFiltrados = advogadosFiltrados.filter((advogado) =>
        advogado.nome.toLowerCase().includes(nome.toLowerCase())
      );
    }

    // Filtro por status
    if (status) {
      advogadosFiltrados = advogadosFiltrados.filter((advogado) =>
        status === "ativos" ? advogado.status : !advogado.status
      );
    }

    return advogadosFiltrados;
  };

  // Função para buscar advogados
  const buscarAdvogados = useCallback(
    async (nome = "", forceRefresh = false) => {
      const now = Date.now();
      const minInterval = 5000; // 5 segundos
      const cacheKey = nome ? `${nome}_page${currentPage}` : `all_page${currentPage}`;

      // Verificar cache
      if (
        !forceRefresh &&
        cacheRef.current[cacheKey] &&
        now - lastFetchTimeRef.current < minInterval
      ) {
        console.log(`Usando dados do cache para: ${cacheKey}`);
        const clientesDoCache = cacheRef.current[cacheKey];
        if (nome) {
          setAdvogadosBuscados(clientesDoCache);
        } else {
          setAdvogadosOriginais(clientesDoCache);
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
          ? `/adv/buscanome/${encodeURIComponent(nome)}`
          : `/adv/buscarTodos`;

        const response = await fetchAuthenticated(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setMensagemErro(
              nome ? "Nenhum advogado encontrado com esse nome." : "Nenhum advogado cadastrado."
            );
            if (nome) {
              setAdvogadosBuscados([]);
            } else {
              setAdvogadosOriginais([]);
            }
            setTotalPages(1);
            cacheRef.current[cacheKey] = [];
            return;
          } else if (response.status === 401) {
            throw new Error("Sessão expirada. Faça login novamente.");
          }
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        let data = await response.json();

        if (!data || data.length === 0) {
          setMensagemErro(
            nome ? "Nenhum advogado encontrado com esse nome." : "Nenhum advogado cadastrado."
          );
          if (nome) {
            setAdvogadosBuscados([]);
          } else {
            setAdvogadosOriginais([]);
          }
          setTotalPages(1);
          cacheRef.current[cacheKey] = [];
          return;
        }

        // Normalizar o status de cada cliente
        data = data.map((advogado) => ({
          ...advogado,
          status: normalizeStatus(advogado.status),
        }));

        // Paginação no frontend
        const startIndex = currentPage * PAGE_SIZE;
        const paginatedData = data.slice(startIndex, startIndex + PAGE_SIZE);
        const calculatedTotalPages = Math.ceil(data.length / PAGE_SIZE) || 1;

        if (nome) {
          setAdvogadosBuscados(paginatedData);
        } else {
          setAdvogadosOriginais(paginatedData);
        }
        setTotalPages(calculatedTotalPages);
        setMensagemErro("");
        lastFetchTimeRef.current = now;
        cacheRef.current[cacheKey] = paginatedData;
      } catch (error) {
        console.error("Erro ao buscar advogados:", error);
        setMensagemErro(error.message || "Erro ao carregar os advogados. Tente novamente.");
        if (nome) {
          setAdvogadosBuscados([]);
        } else {
          setAdvogadosOriginais([]);
        }
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAuthenticated, isLoading, currentPage]
  );

  // Memoizar clientes filtrados
  const advogadosFiltrados = useMemo(() => {
    let baseAdvogados = isSearching && nomeBusca.length >= 4 ? advogadosBuscados : advogadosOriginais;
    return aplicarFiltros(baseAdvogados, filtroStatus, nomeBusca);
  }, [advogadosOriginais, advogadosBuscados, isSearching, filtroStatus, nomeBusca]);

  // Carregar clientes ao mudar a página
  useEffect(() => {
    if (isSessionInvalid) return;
    buscarAdvogados("");
  }, [currentPage, buscarAdvogados, isSessionInvalid]);

  // Debounce para busca
  const handleBuscaDebounced = useMemo(
    () =>
      debounce((nome) => {
        if (nome.length >= 4) {
          setIsSearching(true);
          buscarAdvogados(nome, true);
        } else {
          setIsSearching(false);
          setMensagemErro("");
          setCurrentPage(0);
        }
      }, 500),
    [buscarAdvogados]
  );

  const handleBusca = (e) => {
    const nome = e.target.value;
    setNomeBusca(nome);
    handleBuscaDebounced(nome);
  };

  const handleFiltroStatus = (status) => {
    setFiltroStatus((prev) => (prev === status ? null : status));
    if (nomeBusca.length >= 4) {
      setIsSearching(true);
      buscarAdvogados(nomeBusca, true);
    } else {
      setIsSearching(false);
    }
  };

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

  const handleAdicionarAdvogado = () => {
    navigate("/advogados/criar"); 
  };

  // Função para lidar com o clique no card
  const handleClienteClick = (advogadoId, advogadoNome) => {
    navigate(`/advogados/${advogadoId}`, {
      state: { id: advogadoId, nome: advogadoNome },
    });
  };

  return (
    <ComponentesFixos>
      <MainContainer>
        <Header>
          <Titulo>Gerenciamento de Andvogados</Titulo>
          {getRole() === 'ADVOGADO' && (
            <BotaoAdicionar onClick={handleAdicionarAdvogado}>Adicionar Advogados</BotaoAdicionar>
          )}
        </Header>

        <CampoBusca
          type="text"
          value={nomeBusca}
          onChange={handleBusca}
          placeholder="Buscar por nome do advogado..."
        />

        <FiltrosContainer>
          <div>
            <span>Mostrar apenas: </span>
            <BotaoFiltroStatus
              $ativo={filtroStatus === "ativos"}
              onClick={() => handleFiltroStatus("ativos")}
            >
              Ativos
            </BotaoFiltroStatus>
            <BotaoFiltroStatus
              $ativo={filtroStatus === "inativos"}
              onClick={() => handleFiltroStatus("inativos")}
            >
              Inativos
            </BotaoFiltroStatus>
          </div>
        </FiltrosContainer>

        <ClientesContainer>
          {isLoading ? (
            <Mensagem>Carregando advogados...</Mensagem>
          ) : mensagemErro ? (
            <Mensagem>{mensagemErro}</Mensagem>
          ) : advogadosFiltrados.length === 0 && nomeBusca.length >= 4 ? (
            <Mensagem>Nenhum advogado encontrado.</Mensagem>
          ) : advogadosFiltrados.length === 0 ? (
            <Mensagem>Nenhum advogado corresponde aos filtros selecionados.</Mensagem>
          ) : (
            <>
              <ClientesList>
                {advogadosFiltrados.map((advogado) => {
                  const isAuthenticatedUser = advogado.id === getId();
                  return (
                    <ClienteCard
                      key={advogado.id}
                      onClick={() => handleClienteClick(advogado.id, advogado.nome)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: isAuthenticatedUser ? '#e3f2fd' : 'transparent',
                        border: isAuthenticatedUser ? '2px solid #1976d2' : '1px solid #ccc',
                      }}
                    >
                      <ClienteNome>{advogado.nome}</ClienteNome>
                      <Status $ativo={advogado.status}>
                        Status: {advogado.status ? 'Ativo' : 'Inativo'}
                      </Status>
                    </ClienteCard>
                  );
                })}
              </ClientesList>

              <NavegacaoContainer>
                <BotaoNavegacao onClick={handlePreviousPage} disabled={currentPage === 0}>
                  ⬅️
                </BotaoNavegacao>
                <span>Página {currentPage + 1} de {totalPages}</span>
                <BotaoNavegacao
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                >
                  ➡️
                </BotaoNavegacao>
              </NavegacaoContainer>
            </>
          )}
        </ClientesContainer>
      </MainContainer>
    </ComponentesFixos>
  );
};

export default AdvogadosMain;