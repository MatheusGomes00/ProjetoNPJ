import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import useAuth from "../../Seguranca/UseAuth";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600&display=swap');
`;

const ProcessosContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 22px;
  width: 27vw;
  height: 55vw;
  overflow-y: auto;
  border: none;
  background: linear-gradient(145deg, #f8fbff 0%, #e6f0fa 100%);
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
  border-radius: 12px;

  @media (max-width: 768px) {
    width: 100%;
    max-height: none;
  }
`;

const ProcessosTitle = styled.h2`
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 18px;
  background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 10px 0;
  text-align: left;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ProcessosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 15px;
`;

const ProcessoCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(230, 240, 250, 0.85) 100%);
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 120px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(245, 250, 255, 1) 100%);
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
`;

const Status = styled.div`
  align-self: center;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  color: #fff;
  background: ${(props) => {
    switch (props.status) {
      case "Em andamento":
        return "linear-gradient(90deg, #1890ff 0%, #40c4ff 100%)";
      case "Finalizado":
        return "linear-gradient(90deg, #52c41a 0%, #76ff03 100%)";
      case "Aguardando resposta":
        return "linear-gradient(90deg, #faad14 0%, #ffd740 100%)";
      case "Iniciado":
        return "linear-gradient(90deg, #722ed1 0%, #a855f7 100%)";
      default:
        return "#d9d9d9";
    }
  }};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ProcessoNome = styled.div`
  font-size: 14px;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  color: #1e3c72;
  text-align: center;
`;

const NumeroProcesso = styled.div`
  font-size: 12px;
  font-family: "Poppins", sans-serif;
  color: #5a6a8a;
  text-align: center;
`;

const ClienteNome = styled.div`
  font-size: 12px;
  font-family: "Poppins", sans-serif;
  color: #5a6a8a;
  text-align: center;
`;

const Mensagem = styled.p`
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  color: #7f8c8d;
  text-align: center;
  margin: 20px 0;
`;

const ProcessosAreaDeTrabalho = () => {
  const { fetchAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [processos, setProcessos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const hasFetched = useRef(false);

  useEffect(() => {
    console.log("Componente ProcessosAreaDeTrabalho montado");
    if (hasFetched.current) {
      console.log("Fetch já realizado, ignorando");
      return;
    }

    const buscarProcessos = async () => {
      console.log("Iniciando fetch para http://localhost:8080/proc/get/auth");
      setIsLoading(true);
      setMensagemErro("");
      try {
        const response = await fetchAuthenticated("http://localhost:8080/proc/get/auth", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Status da resposta:", response.status);
        if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
        const data = await response.json();
        console.log("Dados recebidos:", data);

        const processosMapeados = data.map((proc) => {
          const mapped = {
            id: proc.id || "N/A",
            nome: `Processo ${proc.numeroProcesso || "N/A"}`,
            numeroProcesso: proc.numeroProcesso || "N/A",
            status: mapearStatus(proc.situacao),
            clienteNome: (proc.clienteNome || []).join(", ") || "N/A",
          };
          return mapped;
        });
        console.log("Processos mapeados:", processosMapeados);

        setProcessos(processosMapeados);
        if (processosMapeados.length === 0) {
          setMensagemErro("Nenhum processo encontrado para este advogado.");
        }
      } catch (error) {
        console.error("Erro ao buscar processos:", error);
        setMensagemErro("Erro ao carregar processos. Tente novamente.");
        setProcessos([]);
      } finally {
        setIsLoading(false);
        hasFetched.current = true;
      }
    };

    buscarProcessos();

    return () => {
      console.log("Componente ProcessosAreaDeTrabalho desmontado");
    };
  }, []); // Dependência vazia para rodar apenas na montagem

  const mapearStatus = (situacao) => {
    switch (situacao) {
      case "INICIADO":
        return "Iniciado";
      case "EM ANDAMENTO":
        return "Em andamento";
      case "FINALIZADO":
        return "Finalizado";
      case "AGUARDANDO RESPOSTA":
        return "Aguardando resposta";
      default:
        return "Desconhecido";
    }
  };

  return (
    <>
      <GlobalStyle />
      <ProcessosContainer>
        <ProcessosTitle>Seus Processos/Casos</ProcessosTitle>
        {isLoading ? (
          <Mensagem>Carregando processos...</Mensagem>
        ) : mensagemErro ? (
          <Mensagem>{mensagemErro}</Mensagem>
        ) : processos.length === 0 ? (
          <Mensagem>Nenhum processo encontrado.</Mensagem>
        ) : (
          <ProcessosGrid>
            {processos.map((processo) => (
              <ProcessoCard
                key={processo.id}
                onClick={() => navigate(`/processos/${processo.id}`)}
              >
                <Status status={processo.status}>{processo.status}</Status>
                <ProcessoNome>{processo.nome}</ProcessoNome>
                <NumeroProcesso>Nº: {processo.numeroProcesso}</NumeroProcesso>
                <ClienteNome>Cliente: {processo.clienteNome}</ClienteNome>
              </ProcessoCard>
            ))}
          </ProcessosGrid>
        )}
      </ProcessosContainer>
    </>
  );
};

export default ProcessosAreaDeTrabalho;