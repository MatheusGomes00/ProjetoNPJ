import React, { useState, useEffect } from "react";
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

const AbaProcessos = ({ fetchAuthenticated, id, abaAtiva }) => {
  const [processos, setProcessos] = useState([]);
  const [isLoadingProcessos, setIsLoadingProcessos] = useState(false);
  const [mensagemErroProcessos, setMensagemErroProcessos] = useState("");
  const [hasFetchedProcessos, setHasFetchedProcessos] = useState(false);

  // Buscar processos vinculados
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

    buscarProcessos();
  }, [id, fetchAuthenticated, abaAtiva, hasFetchedProcessos]);

  return (
    <>
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
              <TabelaLinha key={processo.id}>
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