import React, { useEffect, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import BotaoEditar from "./BotaoEditar";
import useAuth from "../Seguranca/UseAuth";


const TarefasContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(106vh - 32px);
  height: 400px;
  padding: 40px;
  border: 2px solid black;
  border-radius: 0px;
  background: #fff;
  box-sizing: border-box;
 
`;

const TituloTarefas = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 15px;
`;

const ListaTarefas = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 30px;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  max-width: 200%;
  max-height: 350px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;
const TarefaCard = styled.div`
  font-size: 15px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  width: 120px;
  height: 120px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

const StatusTag = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 10px;
  height: 20px;
  background-color: ${({ prioridade }) => {
    const prioridadeLower = prioridade.toLowerCase();
    return prioridadeLower === "baixa"
      ? "green"
      : prioridadeLower === "média" || prioridadeLower === "media"
      ? "yellow"
      : "red";
  }};
  border-radius: 30%;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

const BotaoAdicionar = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  margin-top: 20px;
  border-radius: 5px;
  cursor: pointer;
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
  z-index: 10000;
  background: rgba(0, 0, 0, 0.5); /* Fundo um pouco mais escuro */
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(6px); /* Desfoque mais suave */
  transition: opacity 0.3s ease-in-out;
  opacity: ${({ show }) => (show ? "1" : "0")};
`;

const ModalContent = styled.div`
  background: #ffffff;
  padding: 30px;
  border-radius: 16px; /* Bordas mais arredondadas */
  width: 90%;
  max-width: 550px; /* Um pouco mais largo */
  max-height: 85vh; /* Mais espaço vertical */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15); /* Sombra mais pronunciada */
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
    color: #2c3e50; /* Cor mais elegante */
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
  color: #34495e; /* Azul escuro suave */
  margin-bottom: 5px;
  display: block;
`;
const FormInput = styled.input`
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #dfe6e9; /* Cinza claro */
  width: 100%;
  font-size: 16px;
  color: #2d3436;
  background: #f9fbfc; /* Fundo claro */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #3498db; /* Azul vibrante */
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
  width: 520px;
  max-height: 80vh;
  padding: 25px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;


const LegendaPrioridades = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
  width: 100%;
  font-size: 14px;
  color: #666;
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

const NomeTarefa = styled.h3`
  font-size: 22px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
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
  overflow-y: auto;
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
    accent-color: #3498db; /* Cor do checkbox */
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

const piscar = keyframes`
  0% { border-color: red; }
  50% { border-color: transparent; }
  100% { border-color: red; }
`;

const InputErro = styled.input`
  border: 2px solid red;
  animation: ${piscar} 0.5s infinite;
`;

const MensagemErro = styled.span`
  color: red;
  font-size: 12px;
  margin-left: 5px;
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
  const [isLoading, setIsLoading] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0"); // Mês começa em 0, então somamos 1
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  }

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

  const adicionarResponsavel = (advogado) => {
    setNovaTarefa({
      ...novaTarefa,
      responsaveisId: [...novaTarefa.responsaveisId, advogado.id],
      responsaveisNome: [...novaTarefa.responsaveisNome, advogado.nome],
    });
  };
  const toggleSelecionarAdvogado = (advogado) => {
    setNovaTarefa((prevTarefa) => {
      const isSelected = prevTarefa.responsaveisId.includes(advogado.id);
      if (isSelected) {
        const novosIds = prevTarefa.responsaveisId.filter((id) => id !== advogado.id);
        const novosNomes = prevTarefa.responsaveisNome.filter((nome) => nome !== advogado.nome);
        console.log("Removendo advogado:", advogado.nome, "Novos IDs:", novosIds, "Novos Nomes:", novosNomes);
        return {
          ...prevTarefa,
          responsaveisId: novosIds,
          responsaveisNome: novosNomes,
        };
      } else {
        console.log("Adicionando advogado:", advogado.nome);
        return {
          ...prevTarefa,
          responsaveisId: [...prevTarefa.responsaveisId, advogado.id],
          responsaveisNome: [...prevTarefa.responsaveisNome, advogado.nome],
        };
      }
    });
  };

  const removerResponsavel = (id) => {
    const index = novaTarefa.responsaveisId.indexOf(id);
    if (index !== -1) {
      const novosIds = [...novaTarefa.responsaveisId];
      const novosNomes = [...novaTarefa.responsaveisNome];
      novosIds.splice(index, 1);
      novosNomes.splice(index, 1);
      setNovaTarefa({
        ...novaTarefa,
        responsaveisId: novosIds,
        responsaveisNome: novosNomes,
      });
    }
  };

  const carregarTarefas = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();
      const minInterval = 5000;
  
      if (!forceRefresh && now - lastFetchTime < minInterval && tarefas.length > 0) {
        console.log("Usando dados em memória, evitando requisição desnecessária.");
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
        console.log("Dados completos recebidos da API:", JSON.stringify(data));
        
        // Procurar a tarefa editada
        const tarefaEditada = data.find(tarefa => tarefa.id === tarefaSelecionada?.id);
        console.log("Tarefa editada retornada:", tarefaEditada || "Tarefa não encontrada");
  
        if (!data || data.length === 0) {
          setMensagemErro("Nenhuma tarefa cadastrada.");
          setTarefas([]);
          return;
        }
  
        const tarefasAtivas = data.filter((tarefa) => tarefa.status === true);
        console.log("Tarefas ativas filtradas:", tarefasAtivas);
        setTarefas(tarefasAtivas);
  
        // Atualizar tarefaSelecionada se estiver aberta
        if (tarefaSelecionada) {
          const updatedTarefa = tarefasAtivas.find(t => t.id === tarefaSelecionada.id) || data.find(t => t.id === tarefaSelecionada.id);
          console.log("Atualizando tarefaSelecionada:", updatedTarefa);
          setTarefaSelecionada(updatedTarefa);
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
    [fetchAuthenticated, lastFetchTime, tarefaSelecionada]
  );

  const buscarAdvogados = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();
      const minInterval = 5000;

      if (!forceRefresh && now - lastFetchTime < minInterval && advogados.length > 0) {
        console.log("Usando advogados em memória, evitando requisição desnecessária.");
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

    try {
      const response = await fetchAuthenticated(`http://localhost:8080/task/end/${id}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(`Erro ao finalizar tarefa: ${response.status}`);
      }

      console.log("Tarefa finalizada com sucesso");
      setTarefas((tarefasAntigas) => tarefasAntigas.filter((tarefa) => tarefa.id !== id));
      setMensagemErro("");
    } catch (error) {
      console.error("Erro ao finalizar a tarefa:", error);
      setMensagemErro("Erro ao finalizar a tarefa. Tente novamente mais tarde.");
    }
  };

  const handleSubmit = async () => {
    if (
      !novaTarefa.nomeTarefa.trim() ||
      !novaTarefa.descricao.trim() ||
      !novaTarefa.prioridade ||
      !novaTarefa.prazoLimite ||
      novaTarefa.responsaveisId.length === 0
    ) {
      alert("Por favor, preencha todos os campos antes de cadastrar a tarefa.");
      return;
    }
  
    try {
      const prazoLimiteFormatado = novaTarefa.prazoLimite
        ? novaTarefa.prazoLimite.split("T")[0]
        : null;
  
      const novaTarefaComData = {
        nomeTarefa: novaTarefa.nomeTarefa,
        descricao: novaTarefa.descricao,
        status: novaTarefa.status,
        prioridade: novaTarefa.prioridade,
        prazoLimite: prazoLimiteFormatado,
        dataCriacao: new Date().toISOString(),
        responsaveisId: novaTarefa.responsaveisId,
        responsaveisNome: novaTarefa.responsaveisNome, // Adicionado aqui
      };
  
      console.log("Estado de novaTarefa antes do envio:", novaTarefa);
      console.log("Payload enviado para a API:", JSON.stringify(novaTarefaComData));
  
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
  
      const tarefaCriada = await response.json();
      console.log("Tarefa criada retornada pela API:", tarefaCriada);
  
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

  const handlePrazoLimiteChange = (e) => {
    setNovaTarefa({
      ...novaTarefa,
      prazoLimite: e.target.value,
    });
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
      <ListaTarefas>
        {tarefas.map((tarefa) => (
          <TarefaCard key={tarefa.id} onClick={() => abrirDetalhesModal(tarefa)}>
            <StatusTag prioridade={tarefa.prioridade} />
            <div>{tarefa.nomeTarefa}</div>
            <div>Status: {tarefa.status ? "Ativa" : "Finalizada"}</div>
            <div>Prazo: {formatarData(tarefa.prazoLimite)}</div>
          </TarefaCard>
        ))}
      </ListaTarefas>
      <LegendaPrioridades>
        <TagLegenda>
          <CorTag cor="red" />
          <span>Alta</span>
        </TagLegenda>
        <TagLegenda>
          <CorTag cor="yellow" />
          <span>Média</span>
        </TagLegenda>
        <TagLegenda>
          <CorTag cor="green" />
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
              onClick={() => toggleSelecionarAdvogado(advogados.find(a => a.id === novaTarefa.responsaveisId[index]))}
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
          <NomeTarefa>{tarefaSelecionada?.nomeTarefa || "Sem título"}</NomeTarefa>
          <DetalheItem>
            <Label>Descrição:</Label>
            <Valor>{tarefaSelecionada?.descricao || "Sem descrição"}</Valor>
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
            <Valor>
              {tarefaSelecionada?.responsaveisNome?.join(", ") || "Nenhum responsável"}
            </Valor>
          </DetalheItem>
          <DetalheItem>
            <Label>Status:</Label>
            <Status ativo={tarefaSelecionada?.status}>
              {tarefaSelecionada?.status ? "Ativa" : "Finalizada"}
            </Status>
          </DetalheItem>
          {tarefaSelecionada && (
            <BotaoEditar tarefaSelecionada={tarefaSelecionada} carregarTarefas={carregarTarefas} />
          )}
          {tarefaSelecionada && (
            <BotaoFinalizar onClick={() => finalizarTarefa(tarefaSelecionada?.id)}>
              Finalizar Tarefa
            </BotaoFinalizar>
          )}
        </TarefaDetalhesModal>
      </ModalOverlay>
    </TarefasContainer>
  );
}

export default Tarefas;