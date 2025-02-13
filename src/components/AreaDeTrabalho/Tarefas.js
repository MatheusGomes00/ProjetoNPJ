import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const TarefasContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 160%;
  max-width: 180%;
  margin: 0 auto;
  padding: 40px;
  border: 2px solid black;
  border-radius: 10px;
  background: #fff;
  margin-left: 52px;
  margin-top: -35%;
  height: 300px;
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
  gap: 22px;
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
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  width: 180px;
  height: 200px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
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
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const BotaoFechar = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: red;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  font-weight: bold;
  border-radius: 5px;
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
  width: 300px;
`;

const BotaoEditar = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background-color: #218838;
  }
`;

function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [advogados, setAdvogados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [novaTarefa, setNovaTarefa] = useState({
    nomeTarefa: "",
    descricao: "",
    status: true,
    prioridade: "baixa",
    prazoLimite: "", // Inicia como string vazia
    dataCriacao: new Date().toISOString(), // Data correta, no formato ISO
    responsavelId: "",
    responsavelNome: ""
  });

  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);

  const buscarTarefas = async () => {
    try {
      const response = await axios.get("http://localhost:8080/task/get");
      setTarefas(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  const buscarAdvogados = async () => {
    try {
      const response = await axios.get("http://localhost:8080/adv/buscarTodos");
      setAdvogados(response.data);
    } catch (error) {
      console.error("Erro ao buscar advogados:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Garantindo que o prazoLimite seja uma string no formato yyyy-MM-dd
      const prazoLimiteFormatado = novaTarefa.prazoLimite ? novaTarefa.prazoLimite.split('T')[0] : null;
  
      const novaTarefaComData = {
        ...novaTarefa,
        prazoLimite: prazoLimiteFormatado, // Enviando data sem hora
        dataCriacao: new Date().toISOString(), // Data de criação com a hora atual
        responsavel: {
          "$ref": "cadastroAdvogado", 
          "$id": novaTarefa.responsavelId
        }
      };
  
      // Enviando dados para o backend
      await axios.post("http://localhost:8080/task/create", novaTarefaComData);
      setShowModal(false);
      setNovaTarefa({
        nomeTarefa: "",
        descricao: "",
        status: true,
        prioridade: "baixa",
        prazoLimite: "", // Resetando o prazoLimite
        dataCriacao: new Date().toISOString(),
        responsavelId: "",
        responsavelNome: ""
      });
      setMensagemSucesso("Tarefa cadastrada!");
      buscarTarefas();
      setTimeout(() => setMensagemSucesso(""), 3000);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  const abrirModal = () => setShowModal(true);

  const fecharModal = () => setShowModal(false);

  const abrirDetalhesModal = (tarefa) => {
    setTarefaSelecionada(tarefa);
    setShowDetalhesModal(true);
  };

  const fecharDetalhesModal = () => setShowDetalhesModal(false);

  const handlePrazoLimiteChange = (e) => {
    setNovaTarefa({
      ...novaTarefa,
      prazoLimite: e.target.value, // Garantindo que sempre tenha um valor controlado
    });
  };

  useEffect(() => {
    buscarTarefas();
    buscarAdvogados();
  }, []);

  return (
    <TarefasContainer>
      <TituloTarefas>Tarefas e prazos que expiram hoje</TituloTarefas>
      <ListaTarefas>
        {tarefas.length === 0 ? <p>Nenhuma tarefa encontrada</p> : tarefas.map((tarefa) => (
          <TarefaCard key={tarefa.id} onClick={() => abrirDetalhesModal(tarefa)}>
            <h2>{tarefa.nomeTarefa}</h2>
            <p>{tarefa.descricao}</p>
          </TarefaCard>
        ))}
      </ListaTarefas>
      {mensagemSucesso && <MensagemSucesso>{mensagemSucesso}</MensagemSucesso>}
      <BotaoAdicionar onClick={abrirModal}>Adicionar Tarefa</BotaoAdicionar>

      <ModalOverlay show={showModal ? "flex" : undefined}>
        <ModalContent>
          <BotaoFechar onClick={fecharModal}>X</BotaoFechar>
          <input 
            type="text" 
            placeholder="Nome da Tarefa" 
            value={novaTarefa.nomeTarefa}
            onChange={(e) => setNovaTarefa({ ...novaTarefa, nomeTarefa: e.target.value })} 
          />
          <textarea 
            placeholder="Descrição" 
            value={novaTarefa.descricao}
            onChange={(e) => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })} 
          />
          <label htmlFor="prazoLimite">Prazo Limite</label>
          <input 
            type="date" 
            id="prazoLimite"
            value={novaTarefa.prazoLimite || ""} // Se estiver vazio, será uma string vazia
            onChange={handlePrazoLimiteChange} 
          />
          <select
            onChange={(e) => {
              const advogadoSelecionado = advogados.find(adv => adv.id === e.target.value);
              setNovaTarefa({ ...novaTarefa, responsavelId: e.target.value, responsavelNome: advogadoSelecionado ? advogadoSelecionado.nome : "" });
            }}
            value={novaTarefa.responsavelId}
          >
            <option value="">Selecione o Responsável</option>
            {advogados.map((advogado) => (
              <option key={advogado.id} value={advogado.id}>
                {advogado.nome}
              </option>
            ))}
          </select>
          <SelectPrioridade onChange={(e) => setNovaTarefa({ ...novaTarefa, prioridade: e.target.value })}>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </SelectPrioridade>
          <button onClick={handleSubmit}>Cadastrar Tarefa</button>
        </ModalContent>
      </ModalOverlay>

      {tarefaSelecionada && (
        <ModalOverlay show={showDetalhesModal ? "flex" : undefined}>
          <TarefaDetalhesModal>
            <BotaoFechar onClick={fecharDetalhesModal}>X</BotaoFechar>
            <h2>{tarefaSelecionada.nomeTarefa}</h2>
            <p><strong>Descrição:</strong> {tarefaSelecionada.descricao}</p>
            <p><strong>Data de criação:</strong> {new Date(tarefaSelecionada.dataCriacao).toLocaleDateString()}</p>
            <p><strong>Prioridade:</strong> {tarefaSelecionada.prioridade}</p>
            <p><strong>Status:</strong> {tarefaSelecionada.status ? "Ativa" : "Inativa"}</p>
            <p><strong>Prazo Limite:</strong> {tarefaSelecionada.prazoLimite}</p>
            <BotaoEditar>Editar Tarefa</BotaoEditar>
          </TarefaDetalhesModal>
        </ModalOverlay>
      )}
    </TarefasContainer>
  );
}

export default Tarefas;
