import React, { useEffect, useState, useCallback } from "react";
//import styled from "styled-components";
import styled, { keyframes } from "styled-components";
import BotaoEditar from "./BotaoEditar";
import useAuth from "../Seguranca/UseAuth"; 


const TarefasContainer = styled.div`
  position: absolute;
  flex-direction: column;
  align-items: center;
  width: 700px;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  border: 2px solid black;
  border-radius: 0px;
  background: #fff;
  margin-left: -487px;
  margin-top: -269px;
  height: 350px;
  display: flex;
  flex-direction: column;
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
  background: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease-in-out;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 15px;
  width: 450px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  transform: translateY(30px);
  opacity: 0;
  animation: modalSlideIn 0.3s forwards;

  @keyframes modalSlideIn {
    0% {
      transform: translateY(30px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
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
   max-height: 120px; /* Limite de altura para evitar campos gigantes */
  overflow-y: auto; /* Adiciona rolagem interna quando necessário */
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
  background-color: #dc3545; /* Cor vermelha para indicar uma ação de finalização */
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: #c82333; /* Tom mais escuro de vermelho ao passar o mouse */
    transform: translateY(-2px); /* Efeito de elevação */
  }

  &:active {
    background-color: #bd2130; /* Tom ainda mais escuro ao clicar */
  }
`;

const SelectPrioridade = styled.select`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const MensagemSucesso = styled.p`
  color: green;
  font-weight: bold;
  text-align: center;
`;

const TarefaDetalhesModal = styled(ModalContent)`
  width: 520px;
  max-height: 90vh;
  padding: 25px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
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

  const adicionarResponsavel = (advogado) => {
  setNovaTarefa({
    ...novaTarefa,
    responsaveisId: [...novaTarefa.responsaveisId, advogado.id],
    responsaveisNome: [...novaTarefa.responsaveisNome, advogado.nome],
  });
};
  const toggleSelecionarAdvogado = (advogado) => {
    if (novaTarefa.responsaveisId.includes(advogado.id)) {
      removerResponsavel(advogado.id);
    } else {
      adicionarResponsavel(advogado);
    }
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
  const [dropdownAberto, setDropdownAberto] = useState(false);

  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [novaTarefa, setNovaTarefa] = useState({
    nomeTarefa: "",
    descricao: "",
    status: true,
    prioridade: "baixa",
    prazoLimite: "",
    dataCriacao: new Date().toISOString(),
    responsaveisId: [], // Alterei aqui para aceitar listas
    responsaveisNome: [] // Alterei aqui para aceitar listas
  });

  const carregarTarefas = useCallback(async () => {
    try {
      const response = await fetchAuthenticated("http://localhost:8080/task/get", {
        method: "GET"
      });
  
      console.log("Dados recebidos da API:", response.data);
  
      if (!response.data || response.data.length === 0) {
        setMensagemErro("Nenhuma tarefa cadastrada.");
        setTarefas([]);
        return;
      }
  
      const tarefasAtivas = response.data.filter((tarefa) => tarefa.status === true);
      setTarefas(tarefasAtivas);
      setMensagemErro("");
  
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      setMensagemErro("Erro ao carregar tarefas. Tente novamente mais tarde.");
      setTarefas([]);
    }
  }, []); // <-- Array de dependências vazio garante que a função não será recriada
  
  useEffect(() => {
    carregarTarefas();
  }, [carregarTarefas]);
  
  const [tarefaSelecionada, setTarefaSelecionada] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [isLoading, setIsLoading] = useState(false);

const buscarTarefas = async () => {
  setIsLoading(true); // Inicia o carregamento

  try {
    
    const response = await fetchAuthenticated("http://localhost:8080/task/get", {
      method: "GET"
    });
    console.log("Tarefas ativas:", tarefas);

    if (!response.data || response.data.length === 0) {
      setMensagemErro("Nenhuma tarefa cadastrada.");
      setTarefas([]); // Garante que a lista de tarefas fica vazia
    } else {
      // Filtra apenas as tarefas com status true
      const tarefasAtivas = response.data.filter((tarefa) => tarefa.status === true);
      setTarefas(tarefasAtivas);
      setMensagemErro(""); // Reseta a mensagem de erro caso tenha sucesso
    }

  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    setMensagemErro("Erro ao carregar tarefas. Tente novamente mais tarde.");
    setTarefas([]);
  } finally {
    setIsLoading(false); // Finaliza o carregamento
  }
};

  const buscarAdvogados = async () => {
    try {
  
      const response = await fetchAuthenticated("http://localhost:8080/adv/buscarTodos", {
        method: "GET"
      });
  
      setAdvogados(response.data);
    } catch (error) {
      console.error("Erro ao buscar advogados:", error.response ? error.response.data : error.message);
    }
  };
  
  const finalizarTarefa = async (id) => {
    const confirmacao = window.confirm("Tem certeza que deseja finalizar a tarefa?");
    
    if (!confirmacao) return;
  
    try {
      
      const response = await fetchAuthenticated(`http://localhost:8080/task/end/${id}`, {}, {
        method: "PUT"
      });
  
      if (response.status === 200) {
        console.log("Tarefa finalizada com sucesso");
  
        
        setTarefas((tarefasAntigas) => tarefasAntigas.filter((tarefa) => tarefa.id !== id));
  
        setMensagemErro("");
      }
    } catch (error) {
      console.error("Erro ao finalizar a tarefa:", error);
      setMensagemErro("Erro ao finalizar a tarefa. Tente novamente mais tarde.");
    }
  };

  const handleSubmit = async () => {
    // Verifica se todos os campos obrigatórios foram preenchidos
    if (
      !novaTarefa.nomeTarefa.trim() ||
      !novaTarefa.descricao.trim() ||
      !novaTarefa.prioridade ||
      !novaTarefa.prazoLimite ||
      novaTarefa.responsaveisId.length === 0 // Agora verifica se há pelo menos um responsável
    ) {
      alert("Por favor, preencha todos os campos antes de cadastrar a tarefa.");
      return;
    }
  
    try {
      const prazoLimiteFormatado = novaTarefa.prazoLimite
        ? novaTarefa.prazoLimite.split("T")[0]
        : null;
  
        const novaTarefaComData = {
          ...novaTarefa,
          prazoLimite: prazoLimiteFormatado,
          dataCriacao: new Date().toISOString(),
        };
  
        await fetchAuthenticated("http://localhost:8080/task/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novaTarefaComData)});
  
        setShowModal(false);
        setNovaTarefa({
          nomeTarefa: "",
          descricao: "",
          status: true,
          prioridade: "baixa",
          prazoLimite: "",
          dataCriacao: new Date().toISOString(),
          responsaveisId: [], // Agora reseta como lista vazia
          responsaveisNome: [],
        });
  
      setMensagemSucesso("Tarefa cadastrada!");
      buscarTarefas();
      setTimeout(() => setMensagemSucesso(""), 3000);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
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
      responsaveisId: [], // Agora é uma lista
      responsaveisNome: [],
    });
    setShowModal(true);
  };

  const fecharModal = () => setShowModal(false);

  
  const abrirDetalhesModal = (tarefa) => {
    // console.log("Abrindo detalhes da tarefa:", tarefa);
    setTarefaSelecionada(tarefa);
    setShowDetalhesModal(true);
  };

  const fecharDetalhesModal = () => setShowDetalhesModal(false);

  const handlePrazoLimiteChange = (e) => {
    setNovaTarefa({
      ...novaTarefa,
      prazoLimite: e.target.value,
    });
  };

  useEffect(() => {
    // console.log("Tarefa Selecionada:", tarefaSelecionada);
  }, [tarefaSelecionada]);
  useEffect(() => {
    buscarTarefas();
    buscarAdvogados();
    carregarTarefas();    
  }, []);
  

  return (
    <TarefasContainer>
      
      <TituloTarefas>Suas tarefas e Prazos</TituloTarefas>
      {mensagemSucesso && <MensagemSucesso>{mensagemSucesso}</MensagemSucesso>}
      <ListaTarefas>
        {tarefas.map((tarefa) => (
          <TarefaCard
            key={tarefa.id}
            onClick={() => abrirDetalhesModal(tarefa)}
          >
            <StatusTag prioridade={tarefa.prioridade} />
            <div>{tarefa.nomeTarefa}</div>
            <div>Status: {tarefa.status ? "Ativa" : "Finalizada"}</div>
            <div>{tarefa.prazoLimite}</div>
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
          
          <BotaoFechar onClick={fecharModal}>X</BotaoFechar>
          <h3>Cadastrar Nova Tarefa</h3>
          <label>Nome da Tarefa:</label>
          <input
            type="text"
            value={novaTarefa.nomeTarefa}
            onChange={(e) =>
              setNovaTarefa({ ...novaTarefa, nomeTarefa: e.target.value })
            }
          />
          <label>Descrição:</label>
          <input
            type="text"
            value={novaTarefa.descricao}
            onChange={(e) =>
              setNovaTarefa({ ...novaTarefa, descricao: e.target.value })
            }
          />
          <label>Prioridade:</label>
          <SelectPrioridade
            value={novaTarefa.prioridade}
            onChange={(e) =>
              setNovaTarefa({ ...novaTarefa, prioridade: e.target.value })
            }
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </SelectPrioridade>
          <label>Prazo Limite:</label>
          <input
            type="datetime-local"
            value={novaTarefa.prazoLimite}
            onChange={handlePrazoLimiteChange}
          />
         
         <div>
  <h3>Selecionar Responsáveis:</h3>
  <div className="custom-dropdown">
  <button className="dropdown-btn" onClick={() => setDropdownAberto(!dropdownAberto)}>
    Selecione Advogados ▼
  </button>

  {dropdownAberto && (
    <div className="dropdown-content">
      {advogados.length > 0 ? (
        advogados.map((advogado) => (
          <label key={advogado.id} className="dropdown-item">
            <input
              type="checkbox"
              checked={novaTarefa.responsaveisId.includes(advogado.id)}
              onChange={() => toggleSelecionarAdvogado(advogado)}
            />
            {advogado.nome}
          </label>
        ))
      ) : (
        <p className="dropdown-empty">Nenhum advogado cadastrado</p>
      )}
    </div>
  )}
</div>

 
</div>

{/* Lista de advogados selecionados */}
<div style={{ marginTop: '12px' }}>
  <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>Responsáveis Selecionados:</h4>

  {novaTarefa.responsaveisNome.length > 0 ? (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
      {novaTarefa.responsaveisNome.map((nome, index) => (
        <div key={novaTarefa.responsaveisId[index]} style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          padding: '8px 12px',
          borderRadius: '20px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        }}>
          <span style={{ marginRight: '10px', fontSize: '14px' }}>{nome}</span>
          <button
            type="button"
            onClick={() => {
              setNovaTarefa(prevState => ({
                ...prevState,
                responsaveisId: prevState.responsaveisId.filter(id => id !== prevState.responsaveisId[index]),
                responsaveisNome: prevState.responsaveisNome.filter((_, i) => i !== index),
              }));
            }}
            style={{
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            ✖
          </button>
        </div>
      ))}
    </div>
  ) : (
    <p style={{ color: '#666', fontSize: '14px' }}>Nenhum responsável selecionado.</p>
  )}
</div>
          <BotaoAdicionar onClick={handleSubmit}>Cadastrar</BotaoAdicionar>
        </ModalContent>
      </ModalOverlay>

      {/* Modal de detalhes */}
      
      <ModalOverlay show={showDetalhesModal}>
      <TarefaDetalhesModal>
  <BotaoFechar onClick={fecharDetalhesModal}>X</BotaoFechar>
  
  <NomeTarefa>{tarefaSelecionada?.nomeTarefa}</NomeTarefa>

  <DetalheItem>
    <Label>Descrição:</Label>
    <Valor>{tarefaSelecionada?.descricao}</Valor>
  </DetalheItem>

  <DetalheItem>
    <Label>Prioridade:</Label>
    <Valor>{tarefaSelecionada?.prioridade}</Valor>
  </DetalheItem>

  <DetalheItem>
    <Label>Prazos:</Label>
    <Valor>{tarefaSelecionada?.prazoLimite}</Valor>
  </DetalheItem>

  <DetalheItem>
    <Label>Responsável:</Label>
      <Valor>
    {tarefaSelecionada?.responsaveisNome?.join(", ") || "Nenhum responsável"}
      </Valor>
  </DetalheItem>

  <DetalheItem>
    <Label>Status:</Label>
    <Status ativo={tarefaSelecionada.status}>
      {tarefaSelecionada.status ? "Ativa" : "Finalizada"}
    </Status>
  </DetalheItem>
  <BotaoEditar tarefaSelecionada={tarefaSelecionada} carregarTarefas={carregarTarefas} />

  
  <BotaoFinalizar onClick={() => finalizarTarefa(tarefaSelecionada?.id)}>
    Finalizar Tarefa
  </BotaoFinalizar>
</TarefaDetalhesModal>
</ModalOverlay>
    </TarefasContainer>
  );
}

export default Tarefas;