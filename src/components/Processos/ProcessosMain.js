// src/components/Processos/ProcessosMain.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
// Estilo do container principal, ajustado para ficar dentro da MainContent
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

// Estilo do botão de criar processo (placeholder)
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

// Estilo para mensagens
const Mensagem = styled.p`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin: 20px 0;
`;

const ProcessosMain = () => {
  const [processosOriginais, setProcessosOriginais] = useState([]);
  const [processosBuscados, setProcessosBuscados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [numeroBusca, setNumeroBusca] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filtroSituacao, setFiltroSituacao] = useState(null);

  // Dados fictícios
  const mockProcessos = [
    {
      id: "67edd644e73f677075437884",
      situacao: "INICIADO",
      numeroProcesso: "1007217-37.2024.8.26.0196",
      pasta: "Distribuído",
      tipoAcaoClasse: "Procedimento Comum Cível - Guarda",
      requerente: "João Silva Pereira",
      representanteLegal: "CAROLYNE GUIMARÃES LOPES DA COSTA",
      requerido: "WELLIGTON RODRIGUES MOREIRA",
      npjRepresentando: "NPJ XYZ",
      vara: "3ª Vara de Família e das Sucessões",
      valorCausa: "R$ 8.472,00",
      responsaveisId: ["67abe806104c212f07b1dc5c"],
      responsaveisNome: ["Dr. Pedro Almeida"],
      clienteId: ["67edd609e73f677075437883"],
      clienteNome: ["João Silva Pereira"],
    },
    {
      id: "67edd644e73f677075437885",
      situacao: "EM ANDAMENTO",
      numeroProcesso: "2001234-12.2024.8.26.0100",
      pasta: "Em Análise",
      tipoAcaoClasse: "Ação Trabalhista",
      requerente: "Maria Oliveira",
      representanteLegal: "FERNANDA COSTA SILVA",
      requerido: "EMPRESA ABC LTDA",
      npjRepresentando: "NPJ ABC",
      vara: "2ª Vara Trabalhista",
      valorCausa: "R$ 15.000,00",
      responsaveisId: ["67abe806104c212f07b1dc5d"],
      responsaveisNome: ["Dra. Ana Souza"],
      clienteId: ["67edd609e73f677075437884"],
      clienteNome: ["Maria Oliveira"],
    },
  ];

  // Função para aplicar filtros
  const aplicarFiltros = (processosData, situacao, numero) => {
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
  };

  // Carregar dados iniciais
  useEffect(() => {
    setProcessosOriginais(mockProcessos);
  }, []);

  // Função de busca simulada
  const buscarProcessosPorNumero = useCallback((numero) => {
    setIsLoading(true);
    setMensagemErro("");
    setTimeout(() => {
      const filtrados = mockProcessos.filter((processo) =>
        processo.numeroProcesso.toLowerCase().includes(numero.toLowerCase())
      );
      setProcessosBuscados(filtrados);
      setIsLoading(false);
      if (filtrados.length === 0) {
        setMensagemErro("Nenhum processo encontrado com esse número.");
      }
    }, 500);
  }, []);

  // Memoizar processos filtrados
  const processosFiltrados = useMemo(() => {
    const baseProcessos = isSearching && numeroBusca.length >= 4 ? processosBuscados : processosOriginais;
    return aplicarFiltros(baseProcessos, filtroSituacao, numeroBusca);
  }, [processosOriginais, processosBuscados, isSearching, filtroSituacao, numeroBusca]);

  // Manipuladores de eventos
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

  return (
    <ComponentesFixos>
      <MainContainer>
        <Header>
          <Titulo>Gerenciamento de Processos</Titulo>
          <BotaoCriar>Criar Processo</BotaoCriar>
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
        ) : processosFiltrados.length === 0 && numeroBusca.length >= 4 ? (
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
              {processosFiltrados.map((processo) => (
                <TableRow key={processo.id}>
                  <TableCell>{processo.numeroProcesso}</TableCell>
                  <TableCell>{processo.situacao}</TableCell>
                  <TableCell>{processo.tipoAcaoClasse}</TableCell>
                  <TableCell>{processo.clienteNome.join(", ")}</TableCell>
                  <TableCell>{processo.responsaveisNome.join(", ")}</TableCell>
                  <TableCell>{processo.vara}</TableCell>
                  <TableCell>{processo.valorCausa}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </ProcessosTable>
        )}
      </MainContainer>
    </ComponentesFixos>
  );
};

export default ProcessosMain;