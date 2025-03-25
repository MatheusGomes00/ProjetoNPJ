import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import useAuth from "../Seguranca/UseAuth";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import ModalTarefasDetalhes from "./ModalTarefasDetalhes";
import ModalEdicao from "./Modais/ModalEdicao";
// Estilo do container principal
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

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Estilo do grid de tarefas
const TarefasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
`;

// Estilo de cada card de tarefa
const TarefaCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(240, 5, 5, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.2s ease;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;

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

// Função de debounce manual
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const TarefasMain = () => {
  const { fetchAuthenticated } = useAuth();
  const [tarefas, setTarefas] = useState([]); // Todas as tarefas (carregamento inicial)
  const [tarefasFiltradas, setTarefasFiltradas] = useState([]); // Tarefas exibidas (filtradas pela busca)
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [isLoadingFinalizar, setIsLoadingFinalizar] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [nomeBusca, setNomeBusca] = useState("");
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [showModalEdicao, setShowModalEdicao] = useState(false);
  const [tarefaParaEditar, setTarefaParaEditar] = useState(null);
  const [isSearching, setIsSearching] = useState(false); // Novo estado para indicar busca ativa

  // Cache para armazenar resultados de busca
  const [cache, setCache] = useState({});

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

      // Verificar se os dados estão no cache e não é uma busca forçada
      const cacheKey = nome || "all";
      if (!forceRefresh && cache[cacheKey] && now - lastFetchTime < minInterval) {
        console.log(`Usando dados do cache para: ${cacheKey}`);
        if (nome) {
          setTarefasFiltradas(cache[cacheKey]); // Usar o cache para busca
          console.log("Tarefas filtradas (cache):", cache[cacheKey]);
        } else if (!isSearching) {
          // Só atualizar tarefas iniciais se não houver busca ativa
          setTarefas(cache[cacheKey]); // Usar o cache para carregamento inicial
          setTarefasFiltradas(cache[cacheKey]); // Atualizar tarefas exibidas
          console.log("Tarefas iniciais (cache):", cache[cacheKey]);
        }
        setMensagemErro("");
        return;
      }

      // Evitar requisições simultâneas
      if (isLoading) {
        console.log("Requisição já em andamento, aguardando...");
        return;
      }

      setIsLoading(true);
      setMensagemErro(""); // Limpar mensagem de erro antes de iniciar a busca

      try {
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
          if (response.status === 404) {
            setMensagemErro("Nenhuma tarefa encontrada com esse nome.");
            setTarefasFiltradas([]); // Limpar as tarefas exibidas
            setCache((prev) => ({ ...prev, [cacheKey]: [] }));
            console.log("Tarefas filtradas (404): []");
            return;
          } else if (response.status === 500) {
            throw new Error("Erro interno no servidor. Tente novamente mais tarde.");
          }
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();

        if (!data || data.length === 0) {
          setMensagemErro(nome ? "Nenhuma tarefa encontrada com esse nome." : "Nenhuma tarefa cadastrada.");
          setTarefasFiltradas([]); // Limpar as tarefas exibidas
          if (!nome) {
            setTarefas([]); // Limpar as tarefas iniciais se não houver dados
          }
          setCache((prev) => ({ ...prev, [cacheKey]: [] }));
          console.log("Tarefas filtradas (vazio): []");
          return;
        }

        if (nome) {
          setTarefasFiltradas(data); // Atualizar apenas as tarefas filtradas
          console.log("Tarefas filtradas (busca):", data);
        } else if (!isSearching) {
          // Só atualizar tarefas iniciais se não houver busca ativa
          setTarefas(data); // Atualizar todas as tarefas (carregamento inicial)
          setTarefasFiltradas(data); // Atualizar tarefas exibidas
          console.log("Tarefas iniciais (carregamento):", data);
        }
        setMensagemErro("");
        setLastFetchTime(now);
        setCache((prev) => ({ ...prev, [cacheKey]: data }));
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        setMensagemErro(error.message);
        setTarefasFiltradas([]); // Limpar as tarefas exibidas em caso de erro
        if (!nome) {
          setTarefas([]); // Limpar as tarefas iniciais em caso de erro
        }
        console.log("Tarefas filtradas (erro): []");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAuthenticated, isLoading, isSearching] // Removido lastFetchTime e cache das dependências
  );

  // Função para finalizar a tarefa
  const finalizarTarefa = async (id) => {
    const confirmacao = window.confirm("Tem certeza que deseja finalizar a tarefa?");
    if (!confirmacao) return;

    setIsLoadingFinalizar(true);
    setMensagemErro("");
    setMensagemSucesso("");

    try {
      const url = `http://localhost:8080/task/end/${id}`;

      const response = await fetchAuthenticated(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const tarefaAtualizada = await response.json();

      setTarefas((tarefasAntigas) =>
        tarefasAntigas.map((tarefa) => (tarefa.id === id ? tarefaAtualizada : tarefa))
      );

      if (tarefaSelecionada && tarefaSelecionada.id === id) {
        setTarefaSelecionada(tarefaAtualizada);
      }

      setMensagemSucesso("Tarefa finalizada com sucesso!");
      setTimeout(() => setMensagemSucesso(""), 3000);

      // Limpar o cache após finalizar uma tarefa
      setCache({});
      await buscarTarefasPorNome("", true); // Forçar recarregamento de todas as tarefas
    } catch (error) {
      console.error("Erro ao finalizar a tarefa:", error);
      setMensagemErro(error.message || "Erro ao finalizar a tarefa. Tente novamente mais tarde.");
    } finally {
      setIsLoadingFinalizar(false);
    }
  };

  // Função para abrir o modal de edição
  const abrirModalEdicao = (tarefa) => {
    setTarefaParaEditar(tarefa);
    setShowModalEdicao(true);
  };

  // Função para fechar o modal de edição
  const fecharModalEdicao = () => {
    setShowModalEdicao(false);
    setTarefaParaEditar(null);
    setCache({}); // Limpar o cache após edição
    buscarTarefasPorNome("", true); // Forçar recarregamento de todas as tarefas
  };

  // Carregar todas as tarefas ao montar o componente
  useEffect(() => {
    buscarTarefasPorNome("");
  }, [buscarTarefasPorNome]);

  // Função de busca com debounce
  const handleBuscaDebounced = useMemo(
    () =>
      debounce((nome) => {
        // Só buscar se o termo tiver 4 ou mais letras
        if (nome.length >= 4) {
          setIsSearching(true); // Indicar que uma busca está ativa
          buscarTarefasPorNome(nome, true);
        } else {
          // Se o termo tiver menos de 4 letras, mostrar todas as tarefas
          setIsSearching(false); // Busca não está ativa
          setTarefasFiltradas(tarefas);
          setMensagemErro("");
          console.log("Tarefas filtradas (menos de 4 letras):", tarefas);
        }
      }, 500),
    [buscarTarefasPorNome, tarefas]
  );

  // Função para lidar com a busca
  const handleBusca = (e) => {
    const nome = e.target.value;
    setNomeBusca(nome);
    handleBuscaDebounced(nome);
  };

  // Função para abrir o modal com os detalhes da tarefa
  const abrirModalDetalhes = (tarefa) => {
    setTarefaSelecionada(tarefa);
  };

  // Função para fechar o modal de detalhes
  const fecharModal = () => {
    setTarefaSelecionada(null);
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
          placeholder="Buscar tarefa por nome (mínimo 4 letras)..."
        />

        {isLoading ? (
          <Mensagem>Carregando tarefas...</Mensagem>
        ) : mensagemErro ? (
          <Mensagem>{mensagemErro}</Mensagem>
        ) : tarefasFiltradas.length === 0 && nomeBusca.length >= 4 ? (
          <Mensagem>Nenhuma tarefa encontrada.</Mensagem>
        ) : (
          <TarefasGrid>
            {tarefasFiltradas.map((tarefa) => (
              <TarefaCard
                key={tarefa.id}
                onClick={() => abrirModalDetalhes(tarefa)}
              >
                <h3>{tarefa.nomeTarefa}</h3>
                <p>Status: {tarefa.status ? "Ativa" : "Finalizada"}</p>
                <p>Prazo: {formatarData(tarefa.prazoLimite)}</p>
              </TarefaCard>
            ))}
          </TarefasGrid>
        )}

        {/* Modal de detalhes da tarefa */}
        {tarefaSelecionada && (
          <ModalTarefasDetalhes
            tarefa={tarefaSelecionada}
            onClose={fecharModal}
            onFinalizar={finalizarTarefa}
            onEditar={abrirModalEdicao}
          />
        )}

        {/* Modal de edição */}
        {showModalEdicao && tarefaParaEditar && (
          <ModalEdicao
            tarefa={tarefaParaEditar}
            onClose={fecharModalEdicao}
            carregarTarefas={buscarTarefasPorNome}
          />
        )}
      </MainContainer>
    </ComponentesFixos>
  );
};

export default TarefasMain;