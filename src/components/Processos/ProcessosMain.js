// src/components/Processos/ProcessosMain.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import useAuth from "../Seguranca/UseAuth";

// Estilo do container principal
const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
  background: #f4f7fa;
`;

// Estilo do cabeçalho
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

// Estilo do botão de criar processo
const BotaoCriar = styled.button`
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
`;

// Estilo do container de filtros
const FiltrosContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

// Estilo dos botões de filtro de situação
const BotaoFiltroSituacao = styled.button`
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

// Estilo da tabela de processos
const ProcessosTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  padding: 12px;
  background-color: #f5f5f5;
  border-bottom: 2px solid #ddd;
  text-align: left;
  font-weight: bold;
  color: #333;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #fafafa;
  }
  &:hover {
    background-color: #f0f0f0;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
  color: #555;
`;

// Estilo para o valor borrado e o botão de visibilidade
const ValorCausaContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ValorCausa = styled.span`
  filter: ${({ visivel }) => (visivel ? "none" : "blur(4px)")};
  transition: filter 0.2s ease;
`;

const BotaoVisibilidade = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  padding: 0;
  margin-left: 5px;

  &:hover {
    color: #007bff;
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

const ProcessosMain = () => {
  const { fetchAuthenticated } = useAuth();
  const [processosOriginais, setProcessosOriginais] = useState([]);
  const [processosBuscados, setProcessosBuscados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [busca, setBusca] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filtroSituacao, setFiltroSituacao] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [valoresVisiveis, setValoresVisiveis] = useState({});

  const buscarTodosProcessos = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();
      const minInterval = 5000;

      if (!forceRefresh && now - lastFetchTime < minInterval && processosOriginais.length > 0) {
        console.log("Usando dados em memória, evitando requisição desnecessária.");
        return;
      }

      setIsLoading(true);
      setMensagemErro("");
      try {
        const response = await fetchAuthenticated("http://localhost:8080/proc/findAll", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
        const data = await response.json();
        console.log("Dados de /proc/findAll:", data);
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
            headers: { "Content-Type": "application/json" },
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
        console.log("Dados de /proc/searchProc:", data);
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

  const buscarProcessosPorNomeCliente = useCallback(
    async (nome) => {
      setIsLoading(true);
      setMensagemErro("");
      try {
        const response = await fetchAuthenticated(
          `http://localhost:8080/proc/porNome/${encodeURIComponent(nome)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) {
          if (response.status === 404) {
            setMensagemErro("Nenhum processo encontrado com esse cliente.");
            setProcessosBuscados([]);
            return;
          }
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        const data = await response.json();
        console.log("Dados de /proc/porNome:", data);
        setProcessosBuscados(data);
        if (data.length === 0) setMensagemErro("Nenhum processo encontrado com esse cliente.");
      } catch (error) {
        console.error("Erro ao buscar processos por nome do cliente:", error);
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
  }, [isInitialLoad, buscarTodosProcessos]);

  const aplicarFiltros = useCallback((processosData, situacao, termoBusca) => {
    let processosFiltrados = [...processosData];
    if (termoBusca) {
      if (/^[0-9-]+$/.test(termoBusca)) {
        processosFiltrados = processosFiltrados.filter((processo) =>
          processo.numeroProcesso.includes(termoBusca)
        );
      } else {
        processosFiltrados = processosFiltrados.filter((processo) =>
          (processo.clienteNome || []).some((n) => n.toLowerCase().includes(termoBusca.toLowerCase()))
        );
      }
    }
    if (situacao) {
      processosFiltrados = processosFiltrados.filter(
        (processo) => processo.situacao === situacao
      );
    }
    return processosFiltrados;
  }, []);

  const processosFiltrados = useMemo(() => {
    const baseProcessos = isSearching && busca.length >= 3 ? processosBuscados : processosOriginais;
    return aplicarFiltros(baseProcessos, filtroSituacao, busca);
  }, [processosOriginais, processosBuscados, isSearching, filtroSituacao, busca, aplicarFiltros]);

  const handleBusca = (e) => {
    const termo = e.target.value;
    setBusca(termo);
    if (termo.length >= 3) {
      setIsSearching(true);
      if (/^[0-9-]+$/.test(termo)) {
        buscarProcessosPorNumero(termo);
      } else {
        buscarProcessosPorNomeCliente(termo);
      }
    } else {
      setIsSearching(false);
      setMensagemErro("");
    }
  };

  const handleFiltroSituacao = (situacao) => {
    setFiltroSituacao((prev) => (prev === situacao ? null : situacao));
  };

  const toggleVisibilidadeValor = (id) => {
    setValoresVisiveis((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <ComponentesFixos>
      <MainContainer>
        <Header>
          <Titulo>Gerenciamento de Processos</Titulo>
          <BotaoCriar>Criar Processo</BotaoCriar>
        </Header>

        <CampoBusca
          type="text"
          value={busca}
          onChange={handleBusca}
          placeholder="Buscar por número ou nome do cliente..."
        />

        <FiltrosContainer>
          <div>
            <span>Filtrar por Situação: </span>
            <BotaoFiltroSituacao
              ativo={filtroSituacao === "INICIADO"}
              onClick={() => handleFiltroSituacao("INICIADO")}
            >
              Iniciado
            </BotaoFiltroSituacao>
            <BotaoFiltroSituacao
              ativo={filtroSituacao === "EM ANDAMENTO"}
              onClick={() => handleFiltroSituacao("EM ANDAMENTO")}
            >
              Em Andamento
            </BotaoFiltroSituacao>
          </div>
        </FiltrosContainer>

        {isLoading ? (
          <Mensagem>Carregando processos...</Mensagem>
        ) : mensagemErro ? (
          <Mensagem>{mensagemErro}</Mensagem>
        ) : processosFiltrados.length === 0 && busca.length >= 3 ? (
          <Mensagem>Nenhum processo encontrado.</Mensagem>
        ) : processosFiltrados.length === 0 ? (
          <Mensagem>Nenhum processo corresponde aos filtros selecionados.</Mensagem>
        ) : (
          <ProcessosTable>
            <thead>
              <tr>
                <TableHeader>Número do Processo</TableHeader>
                <TableHeader>Situação</TableHeader>
                <TableHeader>Tipo de Ação</TableHeader>
                <TableHeader>Cliente</TableHeader>
                <TableHeader>Responsável</TableHeader>
                <TableHeader>Vara</TableHeader>
                <TableHeader>Valor da Causa</TableHeader>
              </tr>
            </thead>
            <tbody>
              {processosFiltrados.map((processo) => {
                const visivel = valoresVisiveis[processo.id] || false;
                return (
                  <TableRow key={processo.id}>
                    <TableCell>{processo.numeroProcesso || "N/A"}</TableCell>
                    <TableCell>{processo.situacao || "N/A"}</TableCell>
                    <TableCell>{processo.tipoAcaoClasse || "N/A"}</TableCell>
                    <TableCell>{(processo.clienteNome || []).join(", ") || "N/A"}</TableCell>
                    <TableCell>{(processo.responsaveisNome || []).join(", ") || "N/A"}</TableCell>
                    <TableCell>{processo.vara || "N/A"}</TableCell>
                    <TableCell>
                      <ValorCausaContainer>
                        <ValorCausa visivel={visivel}>
                          {processo.valorCausa || "N/A"}
                        </ValorCausa>
                        <BotaoVisibilidade onClick={() => toggleVisibilidadeValor(processo.id)}>
                          {visivel ? "👁️‍🗨️" : "👁️"}
                        </BotaoVisibilidade>
                      </ValorCausaContainer>
                    </TableCell>
                  </TableRow>
                );
              })}
            </tbody>
          </ProcessosTable>
        )}
      </MainContainer>
    </ComponentesFixos>
  );
};

export default ProcessosMain;