import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import useAuth from "../Seguranca/UseAuth";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";

// Estilo do container principal
const MainContainer = styled.div`
  position: absolute;
  left: 300px;
  top: 0;
  width: 150vh;
  min-height: 100vh;
  background: #f4f7fa;
  padding: 30px;
  box-sizing: border-box;
`;

// Estilo do cabeçalho
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

// Estilo do título
const Titulo = styled.h1`
  font-family: "Arial", sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
`;

// Estilo do botão de adicionar
const BotaoAdicionar = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.1s ease;

  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
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

// Estilo do grid de tarefas
const TarefasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
`;

// Estilo de cada card de tarefa
const TarefaCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

// Estilo para mensagens de loading ou erro
const Mensagem = styled.p`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin: 20px 0;
`;

const TarefasMain = () => {
  const { fetchAuthenticated } = useAuth();
  const [tarefas, setTarefas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [nomeBusca, setNomeBusca] = useState(""); // Estado para o campo de busca

  // Função para formatar a data
  const formatarData = (dataString) => {
    if (!dataString) return "Sem prazo";
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  };

  // Função para buscar tarefas por nome
  const buscarTarefasPorNome = useCallback(
    async (nome, forceRefresh = false) => {
      const now = Date.now();
      const minInterval = 5000;

      if (!forceRefresh && now - lastFetchTime < minInterval && tarefas.length > 0 && !nome) {
        console.log("Usando dados em memória, evitando requisição desnecessária.");
        return;
      }

      setIsLoading(true);

      try {
        // Se nome estiver vazio, busca todas as tarefas; caso contrário, busca por nome
        const url = nome
          ? `http://localhost:8080/task/search/${encodeURIComponent(nome)}`
          : "http://localhost:8080/task/get";
        
        const response = await fetchAuthenticated(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar tarefas");
        }

        const data = await response.json();
        console.log("Dados completos recebidos da API:", JSON.stringify(data));

        if (!data || data.length === 0) {
          setMensagemErro(nome ? "Nenhuma tarefa encontrada com esse nome." : "Nenhuma tarefa cadastrada.");
          setTarefas([]);
          return;
        }

        setTarefas(data);
        setMensagemErro("");
        setLastFetchTime(now);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        setMensagemErro("Erro ao carregar tarefas. Tente novamente mais tarde.");
        setTarefas([]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAuthenticated, lastFetchTime, tarefas.length]
  );

  // Carregar todas as tarefas ao montar o componente
  useEffect(() => {
    buscarTarefasPorNome("");
  }, [buscarTarefasPorNome]);

  // Função para lidar com a busca
  const handleBusca = (e) => {
    const nome = e.target.value;
    setNomeBusca(nome);
    buscarTarefasPorNome(nome, true); // Forçar a busca ao digitar
  };

  return (
    <ComponentesFixos>
      <MainContainer>
        <Header>
          <Titulo>Tarefas Principais</Titulo>
          <BotaoAdicionar>Adicionar Tarefa</BotaoAdicionar>
        </Header>

        <CampoBusca
          type="text"
          value={nomeBusca}
          onChange={handleBusca}
          placeholder="Buscar tarefa por nome..."
        />

        {isLoading ? (
          <Mensagem>Carregando tarefas...</Mensagem>
        ) : mensagemErro ? (
          <Mensagem>{mensagemErro}</Mensagem>
        ) : (
          <TarefasGrid>
            {tarefas.map((tarefa) => (
              <TarefaCard key={tarefa.id}>
                <h3>{tarefa.nomeTarefa}</h3>
                <p>Status: {tarefa.status ? "Ativa" : "Finalizada"}</p>
                <p>Prazo: {formatarData(tarefa.prazoLimite)}</p>
              </TarefaCard>
            ))}
          </TarefasGrid>
        )}
      </MainContainer>
    </ComponentesFixos>
  );
};

export default TarefasMain;