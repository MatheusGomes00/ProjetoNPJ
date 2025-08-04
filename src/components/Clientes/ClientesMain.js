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
  CpfCliente,
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
  const [buscaTexto, setBuscaTexto] = useState("");
  const [nomeBusca, setNomeBusca] = useState("");
  const [cpfBusca, setCpfBusca] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState(null); // "ativos", "inativos", ou null
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 6; // 12 clientes por página
  const { isSessionInvalid } = useAuthContext(); // Verifica se a sessão é inválida
  const navigate = useNavigate(); // Hook para navegação
  const limparCpf = (texto) => texto.replace(/[^\d]/g, '');

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

  const isCpfParcial = useCallback((texto) => {
    const textoLimpo = limparCpf(texto);
    const primeirosDigitos = textoLimpo.slice(0, 4);
    return primeirosDigitos.length >= 3 && /^[0-9]+$/.test(primeirosDigitos);
  }, []);

  // Função para aplicar filtros (status)
  const aplicarFiltros = useCallback((clientesData, status, termobusca) => {
    let clientesFiltrados = [...clientesData];

    // Filtro por nome
    if (termobusca) {
      const termo = termobusca.toLowerCase().trim();
      
      const cpfLimpo = limparCpf(termo);
      const isCpf = /^\d{11}$/.test(cpfLimpo);

      if (isCpf) {
        // Filtrar pelo CPF completo (comparação exata ou includes, se quiser parcial)
        clientesFiltrados = clientesFiltrados.filter((cliente) =>
          cliente.cliente.cpf.includes(cpfLimpo)
        );
      } else {
        // Filtrar pelo nome (includes case-insensitive)
        clientesFiltrados = clientesFiltrados.filter((cliente) =>
          cliente.cliente.nome.toLowerCase().includes(termo)
        );
      }
    }

    // Filtro por status
    if (status) {
      clientesFiltrados = clientesFiltrados.filter((cliente) =>
        status === "ativos" ? cliente.status : !cliente.status
      );
    }

    return clientesFiltrados;
  }, []);

  // Função para buscar clientes
  const buscarClientes = useCallback(
    async (nome = "", cpf = "", forceRefresh = false) => {
           
      const now = Date.now();
      const minInterval = 5000; // 5 segundos
      const cacheKey = nome 
        ? `nome_${nome}_page${currentPage}` 
        : cpf
        ? `cpf_${cpf}_page${currentPage}`
        : `all_page${currentPage}`;

      // Verificar cache
      if (
        !forceRefresh &&
        cacheRef.current[cacheKey] &&
        now - lastFetchTimeRef.current < minInterval
      ) {
       
        const clientesDoCache = cacheRef.current[cacheKey];
        if (nome || cpf) {
          setClientesBuscados(clientesDoCache);
        } else {
          setClientesOriginais(clientesDoCache);
        }
        setMensagemErro("");
        return;
      }

      if (isLoading || isSessionInvalid) return;

      setIsLoading(true);
      setMensagemErro("");

      try {
        let response;
        if (nome) {
          response = await fetchAuthenticated(`/cad/nome/${encodeURIComponent(nome)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
        } else if (cpf) {
          response = await fetchAuthenticated("/cad/cpf", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({cpf: cpf})
          });
        } else {
          response = await fetchAuthenticated("/cad/get", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
        }

        if (!response.ok) {
          if (response.status === 404) {
            const msg = nome
              ? "Nenhum cliente encontrado com esse nome."
              : cpf
              ? "Nenhum cliente encontrado com esse CPF."
              : "Nenhum cliente localizado.";
            setMensagemErro(msg);
            setClientesBuscados([]);
            setClientesOriginais([]);
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
          setMensagemErro("Nenhum cliente encontrado.");
          setClientesBuscados([]);
          setClientesOriginais([]);
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

        if (nome || cpf) {
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
        setClientesBuscados([]);
        setClientesOriginais([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    },
    [isSessionInvalid, fetchAuthenticated, isLoading, currentPage]
  );

  // Memoizar clientes filtrados
  const clientesFiltrados = useMemo(() => {
    let baseClientes = isSearching && buscaTexto.length >= 4 ? clientesBuscados : clientesOriginais;
    return aplicarFiltros(baseClientes, filtroStatus, buscaTexto);
  }, [clientesOriginais, clientesBuscados, isSearching, filtroStatus, buscaTexto, aplicarFiltros]);

  // Carregar clientes ao mudar a página
  useEffect(() => {
    if (isSessionInvalid) return;
    buscarClientes("");
  }, [isSessionInvalid, currentPage, buscarClientes]);

  // Debounce para busca
  const handleBuscaDebounced = useMemo(
    () =>
      debounce((valor) => {
        const texto = valor.trim();
        const cpfLimpo = limparCpf(texto);
        const isCpf = /^\d{11}$/.test(cpfLimpo); // CPF deve ter exatamente 11 dígitos
        const isNome = texto.length >= 4 && /\D/.test(texto); // Nome com 4+ letras e pelo menos um caractere não numérico
        const cpfIncompleto = isCpfParcial(texto)

        setIsSearching(true);
        setCurrentPage(0);
        

        if (isCpf) {
          setCpfBusca(cpfLimpo);
          setNomeBusca("");
          buscarClientes("", cpfLimpo, true);
        } else if (isNome && !cpfIncompleto) {
          setNomeBusca(valor);
          setCpfBusca("");
          buscarClientes(valor, "", true);
        } else {
          setIsSearching(false);
          setMensagemErro("");
          setCpfBusca("");
          setNomeBusca("");
        }
      }, 3000),
    [buscarClientes, isCpfParcial]
  );

  const handleBusca = (e) => {
    const valor = e.target.value;
    setBuscaTexto(valor);
    handleBuscaDebounced(valor);
  };

  const handleFiltroStatus = (status) => {
    setFiltroStatus((prev) => (prev === status ? null : status));
    if (nomeBusca.length >= 4 || /^\d{11}$/.test(cpfBusca)) {
      setIsSearching(true);
      buscarClientes(nomeBusca, cpfBusca, true);
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
          value={buscaTexto}
          onChange={handleBusca}
          placeholder="Buscar por nome ou cpf do cliente..."
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
                    <CpfCliente>CPF: {cliente.cliente.cpf}</CpfCliente>
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