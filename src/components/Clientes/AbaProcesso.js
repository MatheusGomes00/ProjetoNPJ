import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Estilo para a tabela de processos
const TabelaProcessos = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: "Arial", sans-serif;
  font-size: 14px;
  color: #2c3e50;
  grid-column: span 2;
  

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const TabelaCabecalho = styled.th`
  background: #007bff;
  color: #fff;
  padding: 10px;
  text-align: left;
  border-bottom: 2px solid #e0e4e8;
`;

const TabelaLinha = styled.tr`
  &:nth-child(even) {
    background: #f8fbff;
  }
  &:hover {
    background: #e6f0ff;
    cursor: pointer;
  }
`;

const TabelaCelula = styled.td`
  padding: 10px;
  border-bottom: 1px solid #e0e4e8;
`;

// Estilo para mensagens
const Mensagem = styled.p`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin: 20px 0;
  grid-column: span 2;

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

// Estilo para o botão Criar Processo
const BotaoCriarProcesso = styled.button`
  background: #28a745;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-family: "Arial", sans-serif;
  font-size: 14px;
  cursor: pointer;
  
  grid-column: span 2;
  text-align: center;

  &:hover {
    background: #218838;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const AbaProcessos = ({ fetchAuthenticated, id, abaAtiva }) => {
  const [processos, setProcessos] = useState([]);
  const [isLoadingProcessos, setIsLoadingProcessos] = useState(false);
  const [mensagemErroProcessos, setMensagemErroProcessos] = useState("");
  const [hasFetchedProcessos, setHasFetchedProcessos] = useState(false);
  const [clientName, setClientName] = useState("");
  const [isLoadingClient, setIsLoadingClient] = useState(true);
  const navigate = useNavigate();

  // Fetch client name
  const fetchClientName = useCallback(async () => {
    try {
      const response = await fetchAuthenticated(`http://localhost:8080/cad/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar nome do cliente.");
      }

      const data = await response.json();
      const cliente = data.find((c) => c.id === id);
      setClientName(cliente ? cliente.cliente.nome : "Cliente Desconhecido");
    } catch (error) {
      console.error("Erro ao buscar nome do cliente:", error);
      setClientName("Cliente Desconhecido");
    } finally {
      setIsLoadingClient(false);
    }
  }, [fetchAuthenticated, id]);

  // Fetch processos vinculados
  useEffect(() => {
    const buscarProcessos = async () => {
      if (abaAtiva !== "processos" || hasFetchedProcessos) return;

      setIsLoadingProcessos(true);
      setMensagemErroProcessos("");
      setHasFetchedProcessos(true);

      try {
        const response = await fetchAuthenticated(
          `http://localhost:8080/proc/porNome/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Nenhum processo encontrado para este cliente.");
          } else if (response.status === 401) {
            throw new Error("Sessão expirada. Faça login novamente.");
          }
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        setProcessos(data);
        if (data.length === 0) {
          setMensagemErroProcessos("Nenhum processo vinculado encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar processos:", error);
        setMensagemErroProcessos(error.message || "Erro ao carregar os processos.");
        setProcessos([]);
      } finally {
        setIsLoadingProcessos(false);
      }
    };

    fetchClientName();
    buscarProcessos();
  }, [id, fetchAuthenticated, abaAtiva, hasFetchedProcessos, fetchClientName]);

  return (
    <>
      <BotaoCriarProcesso
        onClick={() =>
          navigate("/clientes/criarProc", {
            state: { clientId: id, clientName },
          })
        }
        disabled={isLoadingClient || !clientName}
      >
        Criar Processo
      </BotaoCriarProcesso>
      {isLoadingProcessos ? (
        <Mensagem>Carregando processos...</Mensagem>
      ) : mensagemErroProcessos ? (
        <Mensagem>{mensagemErroProcessos}</Mensagem>
      ) : processos.length > 0 ? (
        <TabelaProcessos>
          <thead>
            <tr>
              <TabelaCabecalho>Número do Processo</TabelaCabecalho>
              <TabelaCabecalho>Situação</TabelaCabecalho>
              <TabelaCabecalho>Tipo de Ação/Classe</TabelaCabecalho>
              <TabelaCabecalho>Vara</TabelaCabecalho>
              <TabelaCabecalho>Representante Legal</TabelaCabecalho>
              <TabelaCabecalho>Requerido</TabelaCabecalho>
            </tr>
          </thead>
          <tbody>
            {processos.map((processo) => (
              <TabelaLinha
                key={processo.id}
                onClick={() => navigate(`/processos/${processo.id}`)}
                style={{ cursor: isLoadingProcessos ? "not-allowed" : "pointer" }}
              >
                <TabelaCelula>
                  {processo.numeroProcesso || "Não informado"}
                </TabelaCelula>
                <TabelaCelula>{processo.situacao || "Não informado"}</TabelaCelula>
                <TabelaCelula>
                  {processo.tipoAcaoClasse || "Não informado"}
                </TabelaCelula>
                <TabelaCelula>{processo.vara || "Não informado"}</TabelaCelula>
                <TabelaCelula>
                  {processo.representanteLegal || "Não informado"}
                </TabelaCelula>
                <TabelaCelula>{processo.requerido || "Não informado"}</TabelaCelula>
              </TabelaLinha>
            ))}
          </tbody>
        </TabelaProcessos>
      ) : (
        <Mensagem>Nenhum processo vinculado encontrado.</Mensagem>
      )}
    </>
  );
};

export default AbaProcessos;