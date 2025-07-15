import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import useAuth from "../Seguranca/UseAuth";
import * as style from "../Clientes/EstilosClientes";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 24px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  gap: 20px;

`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Titulo = styled.h1`
  font-family: "Arial", sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
`;

const CampoBusca = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  width: 300px;
`;

const FiltrosContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const BotaoFiltroSituacao = styled.button`
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: ${({ $ativo }) => ($ativo ? "#007bff" : "#fff")};
  color: ${({ $ativo }) => ($ativo ? "#fff" : "#333")};
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: ${({ $ativo }) => ($ativo ? "#0056b3" : "#f0f0f0")};
  }
`;

const Mensagem = styled.p`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin: 20px 0;
`;

const ProcessosMain = () => {
  const { fetchAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [processosOriginais, setProcessosOriginais] = useState([]);
  const [processosBuscados, setProcessosBuscados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [numeroBusca, setNumeroBusca] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filtroSituacao, setFiltroSituacao] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 6;

  const buscarTodosProcessos = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();
      const minInterval = 5000;

      if (!forceRefresh && now - lastFetchTime < minInterval && processosOriginais.length > 0) {
        

        return;
      }

      setIsLoading(true);
      setMensagemErro("");
      try {
        const response = await fetchAuthenticated("http://localhost:8080/proc/findAll", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
        const data = await response.json();
        
        setProcessosOriginais(data);
        if (data.length === 0) setMensagemErro("Nenhum processo cadastrado.");
        setLastFetchTime(now);

      } catch (error) {
        console.error("Erro ao buscar processos:", error);
        setMensagemErro("Erro ao carregar processos. Tente novamente.");
        setProcessosOriginais([]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAuthenticated, lastFetchTime, processosOriginais.length]
  );

  const buscarProcessosPorNumero = useCallback(
    async (numero) => {
      setIsLoading(true);
      setMensagemErro("");
      try {
        const response = await fetchAuthenticated(
          `http://localhost:8080/proc/searchProc/${encodeURIComponent(numero)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          if (response.status === 404) {
            setMensagemErro("Nenhum processo encontrado com esse número.");
            setProcessosBuscados([]);
            return;
          }
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        const data = await response.json();
       
        setProcessosBuscados(data);
        if (data.length === 0) setMensagemErro("Nenhum processo encontrado com esse número.");
      } catch (error) {
        console.error("Erro ao buscar processos por número:", error);
        setMensagemErro("Erro ao buscar processos. Tente novamente.");
        setProcessosBuscados([]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAuthenticated]
  );

  useEffect(() => {
    const loadData = async () => {
      if (!isInitialLoad) return;
      setIsLoading(true);
      try {
        await buscarTodosProcessos();
        setIsInitialLoad(false);
      } catch (error) {
        console.error("Erro no carregamento inicial:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
    
  }, [currentPage, isInitialLoad, buscarTodosProcessos]);


  const aplicarFiltros = useCallback((processosData, situacao, numero) => {
    let processosFiltrados = [...processosData];
    if (numero) {
      processosFiltrados = processosFiltrados.filter((processo) =>
        processo.numeroProcesso.toLowerCase().includes(numero.toLowerCase())
      );
    }
    if (situacao) {
      processosFiltrados = processosFiltrados.filter(
        (processo) => processo.situacao === situacao
      );
    }
    return processosFiltrados;
  }, []);

  const processosFiltrados = useMemo(() => {
    const baseProcessos = isSearching && numeroBusca.length >= 4 ? processosBuscados : processosOriginais;
    return aplicarFiltros(baseProcessos, filtroSituacao, numeroBusca);
  }, [processosOriginais, processosBuscados, isSearching, filtroSituacao, numeroBusca, aplicarFiltros]);

  useEffect(() => {
    const total = Math.ceil(processosFiltrados.length / PAGE_SIZE) || 1;
    setTotalPages(total);

    if (currentPage >= total) {
      setCurrentPage(total - 1); // Evita página inválida ao reduzir itens
    }
  }, [processosFiltrados, currentPage]);

  const handleBusca = (e) => {
    const numero = e.target.value;
    setNumeroBusca(numero);
    if (numero.length >= 4) {
      setIsSearching(true);
      buscarProcessosPorNumero(numero);
    } else {
      setIsSearching(false);
      setMensagemErro("");
    }
  };

  const handleFiltroSituacao = (situacao) => {
    setFiltroSituacao((prev) => (prev === situacao ? null : situacao));
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

  const situacoesLabel = {
    INICIADO: "Iniciado",
    EM_ANDAMENTO: "Em Andamento",
    FINALIZADO: "Finalizado",
    ARQUIVADO: "Arquivado",
    SUSPENSO: "Suspenso",
    AGUARDANDO_DISTRIBUICAO: "Aguardando Distribuição",
    EM_RECURSO: "Em Recurso"
  };

  return (
    <ComponentesFixos>
      <MainContainer>
        <Header>
          <Titulo>Gerenciamento de Processos</Titulo>
        </Header>

        <CampoBusca
          type="text"
          value={numeroBusca}
          onChange={handleBusca}
          placeholder="Buscar por número do processo..."
        />

        <FiltrosContainer>
          <div>
            <span>Filtrar por Situação: </span>
            <BotaoFiltroSituacao
              $ativo={filtroSituacao === "INICIADO"}
              onClick={() => handleFiltroSituacao("INICIADO")}
            >
              Iniciado
            </BotaoFiltroSituacao>
            <BotaoFiltroSituacao
              $ativo={filtroSituacao === "EM_ANDAMENTO"}
              onClick={() => handleFiltroSituacao("EM_ANDAMENTO")}
            >
              Em Andamento
            </BotaoFiltroSituacao>
          </div>
        </FiltrosContainer>

        <style.ClientesContainer>
          {isLoading ? (
            <Mensagem>Carregando processos...</Mensagem>
          ) : mensagemErro ? (
            <Mensagem>{mensagemErro}</Mensagem>
          ) : processosFiltrados.length === 0 && numeroBusca.length >= 4 ? (
            <Mensagem>Nenhum processo encontrado.</Mensagem>
          ) : processosFiltrados.length === 0 ? (
            <Mensagem>Nenhum processo corresponde aos filtros selecionados.</Mensagem>
          ) : (
            <>
              <style.ClientesList>
                {processosFiltrados
                  .slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
                  .map((processo) => {  
                    return (
                      <style.ClienteCard
                        key={processo.id}
                        onClick={() => navigate(`/processos/${processo.id}`)}
                        style={{
                          cursor: 'pointer',
                        }}
                      >
                        <style.ProcNumero>
                          {processo.numeroProcesso}
                        </style.ProcNumero>
                        <style.Situacao $status={processo.situacao}>
                          Situação: {situacoesLabel[processo.situacao] || processo.situacao}
                        </style.Situacao>
                      </style.ClienteCard>
                    )
                  })
                }
              </style.ClientesList>

              <style.NavegacaoContainer>
                <style.BotaoNavegacao onClick={handlePreviousPage} disabled={currentPage === 0}>
                  ⬅️
                </style.BotaoNavegacao>
                <span>Página {currentPage + 1} de {totalPages}</span>
                <style.BotaoNavegacao
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                >
                  ➡️
                </style.BotaoNavegacao>
              </style.NavegacaoContainer>
            </>
          )}
          </style.ClientesContainer>
      </MainContainer>
    </ComponentesFixos>
  );
};

export default ProcessosMain;