import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import styled from "styled-components";
import useAuth from "../Seguranca/UseAuth";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";

// Estilo do contêiner principal
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

// Estilo do botão de adicionar cliente
const BotaoAdicionar = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
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

// Estilo do contêiner da lista de clientes
const ClientesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

// Estilo da lista de clientes
const ClientesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

// Estilo de cada card de cliente
const ClienteCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(200, 210, 230, 0.3);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Estilo para o nome do cliente
const ClienteNome = styled.div`
  font-family: "Arial", sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1e3c72;
  grid-column: span 2;
  display: flex;
  align-items: center;
  gap: 8px;

  &:before {
    content: "👤";
    font-size: 18px;
  }

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

// Estilo para o status
const Status = styled.div`
  font-family: "Arial", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.ativo ? "#52c41a" : "#ff4d4f")};
  display: flex;
  align-items: center;
  gap: 8px;

  &:before {
    content: "●";
    font-size: 12px;
    color: ${(props) => (props.ativo ? "#52c41a" : "#ff4d4f")};
  }
`;

// Estilo para mensagens
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
  const PAGE_SIZE = 12; // 12 clientes por página

  // Cache e controle de tempo
  const cacheRef = useRef({});
  const lastFetchTimeRef = useRef(0);

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
        console.log(`Usando dados do cache para: ${cacheKey}`);
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
        console.log("Requisição já em andamento, aguardando...");
        return;
      }

      setIsLoading(true);
      setMensagemErro("");

      try {
        const url = nome
          ? `http://localhost:8080/cad/nome/${encodeURIComponent(nome)}`
          : `http://localhost:8080/cad/get`;

        const response = await fetchAuthenticated(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setMensagemErro(nome ? "Nenhum cliente encontrado com esse nome." : "Nenhum cliente cadastrado.");
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

        const data = await response.json();

        if (!data || data.length === 0) {
          setMensagemErro(nome ? "Nenhum cliente encontrado com esse nome." : "Nenhum cliente cadastrado.");
          if (nome) {
            setClientesBuscados([]);
          } else {
            setClientesOriginais([]);
          }
          setTotalPages(1);
          cacheRef.current[cacheKey] = [];
          return;
        }

        // Paginação no frontend (caso o backend não suporte)
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
    [fetchAuthenticated, isLoading, currentPage]
  );

  // Memoizar clientes filtrados
  const clientesFiltrados = useMemo(() => {
    let baseClientes = isSearching && nomeBusca.length >= 4 ? clientesBuscados : clientesOriginais;
    return aplicarFiltros(baseClientes, filtroStatus, nomeBusca);
  }, [clientesOriginais, clientesBuscados, isSearching, filtroStatus, nomeBusca]);

  // Carregar clientes ao mudar a página
  useEffect(() => {
    buscarClientes("");
  }, [currentPage, buscarClientes]);

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
    alert("Funcionalidade de adicionar cliente será implementada!");
  };

  return (
    <ComponentesFixos>
      <MainContainer>
        <Header>
          <Titulo>Gerenciamento de Clientes</Titulo>
          <BotaoAdicionar onClick={handleAdicionarCliente}>
            Adicionar Cliente
          </BotaoAdicionar>
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
              ativo={filtroStatus === "ativos"}
              onClick={() => handleFiltroStatus("ativos")}
            >
              Ativos
            </BotaoFiltroStatus>
            <BotaoFiltroStatus
              ativo={filtroStatus === "inativos"}
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
                  <ClienteCard key={cliente.id}>
                    <ClienteNome>{cliente.cliente.nome}</ClienteNome>
                    <Status ativo={cliente.status}>
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