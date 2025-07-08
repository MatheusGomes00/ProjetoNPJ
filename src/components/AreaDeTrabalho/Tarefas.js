import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import BotaoEditar from "./BotaoEditar";
import useAuth from "../Seguranca/UseAuth";

const TarefasContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0;
  border: 0;
  background: #fff;
  box-sizing: border-box;
`;

const TituloTarefas = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-top: -20px;
`;

const DetalheItemNome = styled.div`
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  max-height: 180px;
  min-height: 100px;
  word-wrap: break-word;
  overflow-y: auto;
  box-sizing: border-box;

`;

const TextArea = styled.textarea`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 100%;
  font-size: 16px;
  color: #333;
  transition: border-color 0.3s ease;
  resize: vertical;
  min-height: 100px;
  max-height: 200px;
  overflow-y: auto;
  box-sizing: border-box;
  background: #f8f9fa;
  cursor: default;

  &:focus {
    border-color: #007bff;
    outline: none;
  }

`;

const NomeTarefaCard = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-align: center;
  line-height: 1.2em;
  max-height: 2.4em;
`;

const ListaTarefas = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  flex: 1; 
  overflow-y: auto;
  min-height: 0; 
  gap: 30px;
  padding: 0px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const TarefaCard = styled.div`
  font-size: 15px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 15px;
  border-radius: 12px;
  min-width: 0;
  width: 100%;
  max-width: 220px;
  min-height: 120px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  font-family: "Segoe UI", Arial, sans-serif;
  font-weight: 600;
  color: #222;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  > div {
    font-size: 13px;
    color: #222;
    font-family: "Segoe UI", Arial, sans-serif;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
  }

  @media (max-width: 900px) {
    max-width: 48vw;
    min-height: 110px;
    padding: 10px;
  }

  @media (max-width: 600px) {
    max-width: 98vw;
    min-height: 80px;
    padding: 8px;
  }
`;

const StatusTag = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 12px;
  height: 12px;
  background-color: ${({ prioridade }) => {
    const prioridadeLower = prioridade.toLowerCase();
    return prioridadeLower === "baixa"
      ? "#34c759"
      : prioridadeLower === "média" || prioridadeLower === "media"
      ? "#ffca28"
      : "#ff3b30";
  }};
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
`;

const BotaoAdicionar = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  margin-top: 20px;
  border-radius: 5px;
  cursor: pointer;
  flex-shrink: 0; /* Evita que o botão seja espremido */
  align-self: center; /* Mantém o botão centralizado horizontalmente */
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background-color: #0056b3;
  }
`;

const ModalOverlay = styled.div`
  display: ${({ show }) => (show ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(6px);
  transition: opacity 0.3s ease-in-out;
  opacity: ${({ show }) => (show ? 1 : 0)};
`;

const ModalContent = styled.div`
  background: #ffffff;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 550px;
  max-height: 85vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  animation: slideIn 0.3s ease-out forwards;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(-30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h3 {
    font-size: 24px;
    font-weight: 700;
    color: #2c3e50;
    text-align: center;
    margin-bottom: 10px;
  }

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #34495e;
  margin-bottom: 5px;
  display: block;
`;

const FormInput = styled.input`
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #dfe6e9;
  width: 100%;
  font-size: 16px;
  color: #2d3436;
  background: #f9fbfc;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
    outline: none;
  }
`;

const RemoveButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: background 0.2s ease;

  &:hover {
    background: #c0392b;
  }
`;

const TarefaDetalhesModal = styled(ModalContent)`
  width: 100vh;
  height: 100vh;
  padding: 25px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-sizing: border-box;
  overflow: auto;
`;

const LegendaPrioridades = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
  width: 100%;
  font-size: 14px;
  color: #666;
  flex-shrink: 0; /* Evita que a legenda seja espremida */
`;

const TagLegenda = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const CorTag = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ cor }) => cor};
`;

const BotaoFechar = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
`;

const DetalheItem = styled.div`
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  max-height: 120px;
  word-wrap: break-word;
`;

const Label = styled.span`
  font-weight: bold;
  font-size: 14px;
  color: #666;
`;

const Valor = styled.span`
  font-size: 16px;
  color: #222;
`;

const Status = styled.span`
  font-weight: bold;
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  background: ${(props) => (props.ativo ? "#d4edda" : "#f8d7da")};
  color: ${(props) => (props.ativo ? "#155724" : "#721c24")};
  display: inline-block;
`;

const BotaoFinalizar = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: #c82333;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #bd2130;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const SelectPrioridade = styled.select`
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #dfe6e9;
  width: 100%;
  font-size: 16px;
  color: #2d3436;
  background: #f9fbfc;
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
    outline: none;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #dfe6e9;
  background: #f9fbfc;
  font-size: 16px;
  color: #2d3436;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.3s ease, background 0.3s ease;

  &:hover {
    border-color: #3498db;
    background: #eef2f5;
  }
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #dfe6e9;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 10001;
  padding: 10px;
`;

const DropdownItem = styled.label`
  display: flex;
  align-items: center;
  padding: 8px 10px;
  font-size: 14px;
  color: #2d3436;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #eef2f5;
  }

  input[type="checkbox"] {
    margin-right: 10px;
    accent-color: #3498db;
  }
`;

const ResponsaveisList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const ResponsavelTag = styled.div`
  display: flex;
  align-items: center;
  background: #ecf0f1;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  color: #2d3436;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const MensagemSucesso = styled.p`
  color: green;
  font-weight: bold;
  text-align: center;
`;

const MensagemErro = styled.p`
  color: red;
  font-weight: bold;
  text-align: center;
`;

function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [advogados, setAdvogados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const { fetchAuthenticated } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [, setIsLoading] = useState(false);
  const [isLoadingFinalizar, setIsLoadingFinalizar] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [dropdownAberto, setDropdownAberto] = useState(false);

  const formatarData = (dataString) => {
    if (!dataString) return "Sem prazo";
    const data = new Date(dataString);
    const dia = String(data.getUTCDate()).padStart(2, "0");
    const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
    const ano = data.getUTCFullYear();
    const horas = String(data.getUTCHours()).padStart(2, "0");
    const minutos = String(data.getUTCMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  };

  const [novaTarefa, setNovaTarefa] = useState({
    nomeTarefa: "",
    descricao: "",
    status: true,
    prioridade: "baixa",
    prazoLimite: "",
    dataCriacao: new Date().toISOString(),
    responsaveisId: [],
    responsaveisNome: [],
  });

  const toggleSelecionarAdvogado = (advogado) => {
    setNovaTarefa((prevTarefa) => {
      const isSelected = prevTarefa.responsaveisId.includes(advogado.id);
      if (isSelected) {
        const novosIds = prevTarefa.responsaveisId.filter((id) => id !== advogado.id);
        const novosNomes = prevTarefa.responsaveisNome.filter((nome) => nome !== advogado.nome);
        
        return {
          ...prevTarefa,
          responsaveisId: novosIds,
          responsaveisNome: novosNomes,
        };
      } else {
        return {
          ...prevTarefa,
          responsaveisId: [...prevTarefa.responsaveisId, advogado.id],
          responsaveisNome: [...prevTarefa.responsaveisNome, advogado.nome],
        };
      }
    });
  };

  const carregarTarefas = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();
      const minInterval = 5000;

      if (!forceRefresh && now - lastFetchTime < minInterval && tarefas.length > 0) {
       
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetchAuthenticated("http://localhost:8080/task/get", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar tarefas");
        }

        const data = await response.json();

        if (!data || data.length === 0) {
          setMensagemErro("Nenhuma tarefa cadastrada.");
          setTarefas([]);
          return;
        }

        const tarefasAtivas = data.filter((tarefa) => tarefa.status === true);
        setTarefas(tarefasAtivas);

        if (tarefaSelecionada) {
          const updatedTarefa = tarefasAtivas.find((t) => t.id === tarefaSelecionada.id);
          if (updatedTarefa) {
            setTarefaSelecionada(updatedTarefa);
          } else {
            setTarefaSelecionada(null);
            setShowDetalhesModal(false);
          }
        }

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
    [fetchAuthenticated, lastFetchTime, tarefaSelecionada, tarefas.length]
  );

  const buscarAdvogados = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();
      const minInterval = 5000;

      if (!forceRefresh && now - lastFetchTime < minInterval && advogados.length > 0) {
       
        return;
      }

      try {
        const response = await fetchAuthenticated("http://localhost:8080/adv/buscarTodos", {
          method: "GET",
        });
        const data = await response.json();
        setAdvogados(data);
        setLastFetchTime(now);
      } catch (error) {
        console.error("Erro ao buscar advogados:", error.response ? error.response.data : error.message);
      }
    },
    [fetchAuthenticated, advogados.length, lastFetchTime]
  );

  const finalizarTarefa = async (id) => {
    const confirmacao = window.confirm("Tem certeza que deseja finalizar a tarefa?");
    if (!confirmacao) return;

    setIsLoadingFinalizar(true);
    setMensagemErro("");
    setMensagemSucesso("");

    try {
      const url = `http://localhost:8080/task/end/${id}`;

      await fetchAuthenticated(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setTarefas((tarefasAntigas) =>
        tarefasAntigas.filter((tarefa) => tarefa.id !== id)
      );

      if (tarefaSelecionada && tarefaSelecionada.id === id) {
        setTarefaSelecionada(null);
        setShowDetalhesModal(false);
      }

      setMensagemSucesso("Tarefa finalizada com sucesso!");
      setTimeout(() => setMensagemSucesso(""), 3000);
    } catch (error) {
      console.error("Erro ao finalizar a tarefa:", error);
      setMensagemErro(error.message || "Erro ao finalizar a tarefa. Tente novamente mais tarde.");
    } finally {
      setIsLoadingFinalizar(false);
    }
  };

  const atualizarTarefa = (tarefaAtualizada) => {
    setTarefas((prevTarefas) =>
      prevTarefas.map((tarefa) =>
        tarefa.id === tarefaAtualizada.id ? tarefaAtualizada : tarefa
      )
    );

    if (tarefaSelecionada && tarefaSelecionada.id === tarefaAtualizada.id) {
      setTarefaSelecionada(tarefaAtualizada);
    }
  };

  const handlePrazoLimiteChange = (e) => {
    const inputValue = e.target.value; // Formato: YYYY-MM-DDThh:mm
    if (inputValue) {
      const [datePart] = inputValue.split("T"); // Extrai YYYY-MM-DD
      const [year] = datePart.split("-"); // Extrai o ano
      if (year.length > 4) {
        setMensagemErro("O ano deve ter exatamente 4 dígitos.");
        setTimeout(() => setMensagemErro(""), 3000);
        return; // Impede a atualização do estado
      }
    }
    setNovaTarefa({
      ...novaTarefa,
      prazoLimite: inputValue,
    });
  };

  const handleSubmit = async () => {
    if (
      !novaTarefa.nomeTarefa.trim() ||
      !novaTarefa.descricao.trim() ||
      !novaTarefa.prioridade ||
      !novaTarefa.prazoLimite ||
      novaTarefa.responsaveisId.length === 0
    ) {
      setMensagemErro("Por favor, preencha todos os campos antes de cadastrar a tarefa.");
      setTimeout(() => setMensagemErro(""), 3000);
      return;
    }

    // Validação do ano no prazoLimite
    const [datePart] = novaTarefa.prazoLimite.split("T");
    const [year] = datePart.split("-");
    if (year.length !== 4) {
      setMensagemErro("O ano deve ter exatamente 4 dígitos.");
      setTimeout(() => setMensagemErro(""), 3000);
      return;
    }

    try {
      const prazoLimiteFormatado = novaTarefa.prazoLimite ? novaTarefa.prazoLimite.split("T")[0] : null;

      const novaTarefaComData = {
        nomeTarefa: novaTarefa.nomeTarefa,
        descricao: novaTarefa.descricao,
        status: novaTarefa.status,
        prioridade: novaTarefa.prioridade,
        prazoLimite: prazoLimiteFormatado,
        dataCriacao: new Date().toISOString(),
        responsaveisId: novaTarefa.responsaveisId,
        responsaveisNome: novaTarefa.responsaveisNome,
      };

      const response = await fetchAuthenticated("http://localhost:8080/task/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novaTarefaComData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro na requisição: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      await response.json();

      setShowModal(false);
      setNovaTarefa({
        nomeTarefa: "",
        descricao: "",
        status: true,
        prioridade: "baixa",
        prazoLimite: "",
        dataCriacao: new Date().toISOString(),
        responsaveisId: [],
        responsaveisNome: [],
      });

      setMensagemSucesso("Tarefa cadastrada!");
      await carregarTarefas(true);
      setTimeout(() => setMensagemSucesso(""), 3000);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      setMensagemErro(`Erro ao cadastrar tarefa: ${error.message}`);
      setTimeout(() => setMensagemErro(""), 3000);
    }
  };

  const abrirModal = () => {
    setNovaTarefa({
      nomeTarefa: "",
      descricao: "",
      status: true,
      prioridade: "baixa",
      prazoLimite: "",
      dataCriacao: new Date().toISOString(),
      responsaveisId: [],
      responsaveisNome: [],
    });
    setShowModal(true);
  };

  const fecharModal = () => setShowModal(false);

  const abrirDetalhesModal = (tarefa) => {
    setTarefaSelecionada(tarefa);
    setShowDetalhesModal(true);
  };

  const fecharDetalhesModal = () => {
    setShowDetalhesModal(false);
    setTarefaSelecionada(null);
  };

  useEffect(() => {
    const loadData = async () => {
      if (!isInitialLoad) return;
      setIsLoading(true);
      try {
        await carregarTarefas();
        await buscarAdvogados();
        setIsInitialLoad(false);
      } catch (error) {
        console.error("Erro no carregamento inicial:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [isInitialLoad, carregarTarefas, buscarAdvogados]);

  return (
    <TarefasContainer>
      <TituloTarefas>Suas tarefas e Prazos</TituloTarefas>
      {mensagemSucesso && <MensagemSucesso>{mensagemSucesso}</MensagemSucesso>}
      {mensagemErro && <MensagemErro>{mensagemErro}</MensagemErro>}
      <ListaTarefas>
        {tarefas.map((tarefa) => (
          <TarefaCard key={tarefa.id} onClick={() => abrirDetalhesModal(tarefa)}>
            <StatusTag prioridade={tarefa.prioridade} />
            <NomeTarefaCard>{tarefa.nomeTarefa}</NomeTarefaCard>
            <div>Status: {tarefa.status ? "Ativa" : "Finalizada"}</div>
            <div>Prazo: {formatarData(tarefa.prazoLimite)}</div>
          </TarefaCard>
        ))}
      </ListaTarefas>
      <LegendaPrioridades>
        <TagLegenda>
          <CorTag cor="#ff3b30" />
          <span>Alta</span>
        </TagLegenda>
        <TagLegenda>
          <CorTag cor="#ffca28" />
          <span>Média</span>
        </TagLegenda>
        <TagLegenda>
          <CorTag cor="#34c759" />
          <span>Baixa</span>
        </TagLegenda>
      </LegendaPrioridades>
      <BotaoAdicionar onClick={abrirModal}>Adicionar Tarefa</BotaoAdicionar>

      {/* Modal para adicionar tarefa */}
      <ModalOverlay show={showModal}>
        <ModalContent>
          <BotaoFechar onClick={fecharModal}>×</BotaoFechar>
          <h3>Cadastrar Nova Tarefa</h3>

          <div>
            <FormLabel>Nome da Tarefa:</FormLabel>
            <FormInput
              type="text"
              value={novaTarefa.nomeTarefa}
              onChange={(e) => setNovaTarefa({ ...novaTarefa, nomeTarefa: e.target.value })}
              placeholder="Digite o nome da tarefa"
            />
          </div>

          <div>
            <FormLabel>Descrição:</FormLabel>
            <FormInput
              type="text"
              value={novaTarefa.descricao}
              onChange={(e) => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
              placeholder="Descreva a tarefa"
            />
          </div>

          <div>
            <FormLabel>Prioridade:</FormLabel>
            <SelectPrioridade
              value={novaTarefa.prioridade}
              onChange={(e) => setNovaTarefa({ ...novaTarefa, prioridade: e.target.value })}
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </SelectPrioridade>
          </div>

          <div>
            <FormLabel>Prazo Limite:</FormLabel>
            <FormInput
              type="datetime-local"
              value={novaTarefa.prazoLimite}
              onChange={handlePrazoLimiteChange}
              min="2000-01-01T00:00"
              max="2100-12-31T23:59"
            />
          </div>

          <div>
            <FormLabel>Selecionar Responsáveis:</FormLabel>
            <DropdownContainer>
              <DropdownButton onClick={() => setDropdownAberto(!dropdownAberto)}>
                Selecione Advogados <span>▼</span>
              </DropdownButton>
              {dropdownAberto && (
                <DropdownContent>
                  {advogados.length > 0 ? (
                    advogados.map((advogado) => (
                      <DropdownItem key={advogado.id}>
                        <input
                          type="checkbox"
                          checked={novaTarefa.responsaveisId.includes(advogado.id)}
                          onChange={() => toggleSelecionarAdvogado(advogado)}
                        />
                        {advogado.nome}
                      </DropdownItem>
                    ))
                  ) : (
                    <p style={{ color: "#7f8c8d", padding: "10px" }}>
                      Nenhum advogado cadastrado
                    </p>
                  )}
                </DropdownContent>
              )}
            </DropdownContainer>
          </div>

          <div>
            <FormLabel>Responsáveis Selecionados:</FormLabel>
            {novaTarefa.responsaveisNome.length > 0 ? (
              <ResponsaveisList>
                {novaTarefa.responsaveisNome.map((nome, index) => (
                  <ResponsavelTag key={novaTarefa.responsaveisId[index]}>
                    <span>{nome}</span>
                    <RemoveButton
                      onClick={() =>
                        toggleSelecionarAdvogado(
                          advogados.find((a) => a.id === novaTarefa.responsaveisId[index])
                        )
                      }
                    >
                      ×
                    </RemoveButton>
                  </ResponsavelTag>
                ))}
              </ResponsaveisList>
            ) : (
              <p style={{ color: "#7f8c8d", fontSize: "14px" }}>
                Nenhum responsável selecionado
              </p>
            )}
          </div>

          <BotaoAdicionar onClick={handleSubmit}>Cadastrar</BotaoAdicionar>
        </ModalContent>
      </ModalOverlay>

      {/* Modal de detalhes */}
      <ModalOverlay show={showDetalhesModal}>
        <TarefaDetalhesModal>
          <BotaoFechar onClick={fecharDetalhesModal}>X</BotaoFechar>
          <DetalheItemNome>
            <Label>Nome:</Label>
            {tarefaSelecionada?.nomeTarefa || "Sem título"}
          </DetalheItemNome>
          <DetalheItem>
            <Label>Descrição:</Label>
            <TextArea
              value={tarefaSelecionada?.descricao || "Sem descrição"}
              readOnly
            />
          </DetalheItem>
          <DetalheItem>
            <Label>Prioridade:</Label>
            <Valor>{tarefaSelecionada?.prioridade || "Nenhuma"}</Valor>
          </DetalheItem>
          <DetalheItem>
            <Label>Prazo:</Label>
            <Valor>{formatarData(tarefaSelecionada?.prazoLimite)}</Valor>
          </DetalheItem>
          <DetalheItem>
            <Label>Responsável:</Label>
            <Valor>{tarefaSelecionada?.responsaveisNome?.join(", ") || "Nenhum responsável"}</Valor>
          </DetalheItem>
          <DetalheItem>
            <Label>Status:</Label>
            <Status ativo={tarefaSelecionada?.status}>
              {tarefaSelecionada?.status ? "Ativa" : "Finalizada"}
            </Status>
          </DetalheItem>
          {tarefaSelecionada?.status && (
            <BotaoFinalizar
              onClick={() => finalizarTarefa(tarefaSelecionada?.id)}
              disabled={isLoadingFinalizar}
            >
              {isLoadingFinalizar ? "Finalizando..." : "Finalizar Tarefa"}
            </BotaoFinalizar>
          )}
          {tarefaSelecionada && (
            <BotaoEditar
              tarefaSelecionada={tarefaSelecionada}
              carregarTarefas={carregarTarefas}
              atualizarTarefa={atualizarTarefa}
            />
          )}
        </TarefaDetalhesModal>
      </ModalOverlay>
    </TarefasContainer>
  );
}

export default Tarefas;