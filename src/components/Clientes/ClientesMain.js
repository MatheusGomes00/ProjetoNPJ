import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import useAuth from "../Seguranca/UseAuth";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../Seguranca/AuthContext';
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
} from "./EstilosClientes";

// Função de debounce
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const ClientesMain = () => {
  const { fetchAuthenticated } = useAuth();
  const [clientesOriginais, setClientesOriginais] = useState([]);
  const [clientesBuscados, setClientesBuscados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [nomeBusca, setNomeBusca] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState(null); // "ativos", "inativos", ou null
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 6; // 12 clientes por página
  const { isSessionInvalid } = useAuthContext(); // Verifica se a sessão é inválida

  const navigate = useNavigate(); // Hook para navegação

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
  const aplicarFiltros = (clientesData, status, nome) => {
    let clientesFiltrados = [...clientesData];

    // Filtro por nome
    if (nome) {
      clientesFiltrados = clientesFiltrados.filter((cliente) =>
        cliente.cliente.nome.toLowerCase().includes(nome.toLowerCase())
      );
    }

    // Filtro por status
    if (status) {
      clientesFiltrados = clientesFiltrados.filter((cliente) =>
        status === "ativos" ? cliente.status : !cliente.status
      );
    }

    return clientesFiltrados;
  };

  // Função para buscar clientes
  const buscarClientes = useCallback(
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
       
        const clientesDoCache = cacheRef.current[cacheKey];
        if (nome) {
          setClientesBuscados(clientesDoCache);
        } else {
          setClientesOriginais(clientesDoCache);
        }
        setMensagemErro("");
        return;
      }

      if (isLoading) {
       
        return;
      }

      setIsLoading(true);
      setMensagemErro("");

      if (isSessionInvalid) return;

      try {
        const url = nome
          ? `/cad/nome/${encodeURIComponent(nome)}`
          : `/cad/get`;

        const response = await fetchAuthenticated(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setMensagemErro(
              nome ? "Nenhum cliente encontrado com esse nome." : "Nenhum cliente cadastrado."
            );
            if (nome) {
              setClientesBuscados([]);
            } else {
              setClientesOriginais([]);
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
            nome ? "Nenhum cliente encontrado com esse nome." : "Nenhum cliente cadastrado."
          );
          if (nome) {
            setClientesBuscados([]);
          } else {
            setClientesOriginais([]);
          }
          setTotalPages(1);
          cacheRef.current[cacheKey] = [];
          return;
        }

        // Normalizar o status de cada cliente
        data = data.map((cliente) => ({
          ...cliente,
          status: normalizeStatus(cliente.status),
        }));

        // Paginação no frontend
        const startIndex = currentPage * PAGE_SIZE;
        const paginatedData = data.slice(startIndex, startIndex + PAGE_SIZE);
        const calculatedTotalPages = Math.ceil(data.length / PAGE_SIZE) || 1;

        if (nome) {
          setClientesBuscados(paginatedData);
        } else {
          setClientesOriginais(paginatedData);
        }
        setTotalPages(calculatedTotalPages);
        setMensagemErro("");
        lastFetchTimeRef.current = now;
        cacheRef.current[cacheKey] = paginatedData;
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        setMensagemErro(error.message || "Erro ao carregar os clientes. Tente novamente.");
        if (nome) {
          setClientesBuscados([]);
        } else {
          setClientesOriginais([]);
        }
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    },
    [isSessionInvalid, fetchAuthenticated, isLoading, currentPage]
  );

  // Memoizar clientes filtrados
  const clientesFiltrados = useMemo(() => {
    let baseClientes = isSearching && nomeBusca.length >= 4 ? clientesBuscados : clientesOriginais;
    return aplicarFiltros(baseClientes, filtroStatus, nomeBusca);
  }, [clientesOriginais, clientesBuscados, isSearching, filtroStatus, nomeBusca]);

  // Carregar clientes ao mudar a página
  useEffect(() => {
    if (isSessionInvalid) return;
    buscarClientes("");
  }, [isSessionInvalid, currentPage, buscarClientes]);

  // Debounce para busca
  const handleBuscaDebounced = useMemo(
    () =>
      debounce((nome) => {
        if (nome.length >= 4) {
          setIsSearching(true);
          buscarClientes(nome, true);
        } else {
          setIsSearching(false);
          setMensagemErro("");
          setCurrentPage(0);
        }
      }, 500),
    [buscarClientes]
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
      buscarClientes(nomeBusca, true);
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

  const handleAdicionarCliente = () => {
    navigate("/clientes/criar"); // Navega para a tela de criação de cliente
  };

  // Função para lidar com o clique no card
  const handleClienteClick = (clienteId, clienteNome) => {
    navigate(`/clientes/${clienteId}`, {
      state: { clientId: clienteId, clientName: clienteNome },
    }); // Navega para a tela de detalhes com clientId e clientName
  };

  return (
    <ComponentesFixos>
      <MainContainer>
        <Header>
          <Titulo>Gerenciamento de Clientes</Titulo>
          <BotaoAdicionar onClick={handleAdicionarCliente}>Adicionar Cliente</BotaoAdicionar>
        </Header>

        <CampoBusca
          type="text"
          value={nomeBusca}
          onChange={handleBusca}
          placeholder="Buscar por nome do cliente..."
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
            <Mensagem>Carregando clientes...</Mensagem>
          ) : mensagemErro ? (
            <Mensagem>{mensagemErro}</Mensagem>
          ) : clientesFiltrados.length === 0 && nomeBusca.length >= 4 ? (
            <Mensagem>Nenhum cliente encontrado.</Mensagem>
          ) : clientesFiltrados.length === 0 ? (
            <Mensagem>Nenhum cliente corresponde aos filtros selecionados.</Mensagem>
          ) : (
            <>
              <ClientesList>
                {clientesFiltrados.map((cliente) => (
                  <ClienteCard
                    key={cliente.id}
                    onClick={() => handleClienteClick(cliente.id, cliente.cliente.nome)}
                    style={{ cursor: "pointer" }}
                  >
                    <ClienteNome>{cliente.cliente.nome}</ClienteNome>
                    <Status $ativo={cliente.status}>
                      Status: {cliente.status ? "Ativo" : "Inativo"}
                    </Status>
                  </ClienteCard>
                ))}
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

export default ClientesMain;