import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useAuth from "../../Seguranca/UseAuth";
import { useAuthContext } from '../../Seguranca/AuthContext';


const ProcessosContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 22px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  
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
  text-align: center;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ProcessosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 15px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-right: 8px;

  /* Estilização da barra de rolagem para consistência */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #b0b8c5;
    border-radius: 4px;
    &:hover {
      background: #8892a3;
    }
  }
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

const getStatusGradient = (status) => {
  const key = status
    ?.normalize("NFD") // Remove acentos
    .replace(/[\u0300-\u036f]/g, "") // Regex para acentos
    .toUpperCase()
    .replace(/\s/g, "_");

  switch (key) {
    case "INICIADO":
      return "linear-gradient(90deg, #52c41a 0%, #7ed957 100%)"; // verde suave
    case "EM_ANDAMENTO":
      return "linear-gradient(90deg, #1890ff 0%, #40c4ff 100%)"; // azul
    case "FINALIZADO":
      return "linear-gradient(90deg, #180000ff 0%, #bfbfbf 100%)"; // cinza
    case "ARQUIVADO":
      return "linear-gradient(90deg, #585858ff 0%, #f0f0f0 100%)"; // cinza claro
    case "SUSPENSO":
      return "linear-gradient(90deg, #faad14 0%, #ffd666 100%)"; // laranja
    case "AGUARDANDO_DISTRIBUICAO":
      return "linear-gradient(90deg, #fa8c16 0%, #ffc069 100%)"; // laranja forte
    case "EM_RECURSO":
      return "linear-gradient(90deg, #722ed1 0%, #9254de 100%)"; // roxo
    default:
      return "linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%)"; // vermelho padrão
  }
};

const Status = styled.div`
  align-self: center;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  color: #fff;
  background: ${({ $status }) => getStatusGradient($status)};
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

const MostrarTodosButton = styled.button`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: #fff;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  margin-top: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #0056b3 0%, #003d82 100%);
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
`;

const ProcessosAreaDeTrabalho = () => {
  const { fetchAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [processos, setProcessos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");
  const hasFetched = useRef(false);
  const { isSessionInvalid } = useAuthContext();

  const mapearStatus = (situacao) => {
    switch (situacao) {
      case "INICIADO":
        return "Iniciado";
      case "EM_ANDAMENTO":
        return "Em andamento";
      case "FINALIZADO":
        return "Finalizado";
      case "ARQUIVADO":
        return "Arquivado";
      case "SUSPENSO":
        return "Suspenso";
      case "AGUARDANDO_DISTRIBUICAO":
        return "Aguardando distribuição";
      case "EM_RECURSO":
        return "Em recurso";
      default:
        return "Desconhecido";
    }
  };

  const loadInitialData = useCallback(async () => {
    
    setIsLoading(true);
    setMensagemErro("");
    try {
      const response = await fetchAuthenticated("/proc/get/auth", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
      const data = await response.json();

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
  }, [fetchAuthenticated]);

  useEffect(() => {
    if (isSessionInvalid) return;
    const loadData = async () => {
      if (!isInitialLoad) return;
      setIsLoading(true);
      try {
        await loadInitialData();
        setIsInitialLoad(false);
      } catch (error) {
        console.error("Erro no carregamento inicial:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
    
  }, [loadInitialData, isLoading, isInitialLoad, isSessionInvalid]);


  return (
    <>
      <ProcessosContainer>
        <ProcessosTitle>Seus Processos/Casos</ProcessosTitle>
        {isLoading ? (
          <Mensagem>Carregando processos...</Mensagem>
        ) : mensagemErro ? (
          <Mensagem>{mensagemErro}</Mensagem>
        ) : processos.length === 0 ? (
          <Mensagem>Nenhum processo encontrado.</Mensagem>
        ) : (
          <>
            <ProcessosGrid>
              {processos.slice(0, 4).map((processo) => (
                <ProcessoCard
                  key={processo.id}
                  onClick={() => navigate(`/processos/${processo.id}`)}
                >
                  <Status $status={processo.status}>{processo.status}</Status>
                  <ProcessoNome>{processo.nome}</ProcessoNome>
                  <NumeroProcesso>Nº: {processo.numeroProcesso}</NumeroProcesso>
                  <ClienteNome>Cliente: {processo.clienteNome}</ClienteNome>
                </ProcessoCard>
              ))}
            </ProcessosGrid>
            {processos.length > 4 && (
              <MostrarTodosButton onClick={() => navigate("/processos")}>
                Mostrar Todos
              </MostrarTodosButton>
            )}
          </>
        )}
      </ProcessosContainer>
    </>
  );
};

export default ProcessosAreaDeTrabalho;