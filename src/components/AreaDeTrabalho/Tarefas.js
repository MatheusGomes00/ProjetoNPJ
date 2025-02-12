import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

// Container principal das tarefas
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

// Título da seção  
const TituloTarefas = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 15px;
`;

// Lista de tarefas
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

// Card de cada tarefa
const TarefaCard = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  width: 180px;
  height: 200px; /* Aumento da altura */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  h2 {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  p {
    font-size: 12px;
    color: #555;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 60px;
  }
`;

// Botão para adicionar tarefa
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

// Estilização do modal (popup)
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

// Container do formulário no modal
const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
`;

// Botão de fechar
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

// Botão de enviar
const BotaoEnviar = styled.button`
  background-color: green;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: darkgreen;
  }
`;

function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novaTarefa, setNovaTarefa] = useState({
    nomeTarefa: "",
    descricao: "",
    status: false,
    prioridade: "baixa",
    prazoLimite: "",
    responsavel: "",
  });

  const buscarTarefas = async () => {
    try {
      const response = await axios.get("http://localhost:8080/task/get");
      setTarefas(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  useEffect(() => {
    buscarTarefas();
  }, []);

  const handleChange = (e) => {
    setNovaTarefa({ ...novaTarefa, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const prazoLimiteFormatado = new Date(novaTarefa.prazoLimite).toISOString();
    const tarefaComPrazoFormatado = { ...novaTarefa, prazoLimite: prazoLimiteFormatado };
  
    console.log('Dados enviados:', tarefaComPrazoFormatado); // Verifica os dados antes de enviar
  
    try {
      const response = await axios.post("http://localhost:8080/task/create", tarefaComPrazoFormatado);
      console.log('Resposta da API:', response.data); // Verifica a resposta
      setShowModal(false);
      buscarTarefas(); // Atualiza a lista após adicionar
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      <TarefasContainer>
        <TituloTarefas>Tarefas e prazos que expiram hoje</TituloTarefas>
        <ListaTarefas>
          {tarefas.length === 0 ? (
            <p>Nenhuma tarefa encontrada</p>
          ) : (
            tarefas.map((tarefa) => (
              <TarefaCard key={tarefa.id}>
                <h2>{tarefa.nomeTarefa}</h2>
                <p>{tarefa.descricao}</p>
              </TarefaCard>
            ))
          )}
        </ListaTarefas>

        {/* Botão para abrir o modal */}
        <BotaoAdicionar onClick={() => setShowModal(true)}>
          Adicionar Tarefa
        </BotaoAdicionar>
      </TarefasContainer>

      {/* Modal de Formulário */}
      <ModalOverlay show={showModal}>
        <ModalContent>
          <BotaoFechar onClick={() => setShowModal(false)}>X</BotaoFechar>
          <h2>Adicionar Nova Tarefa</h2>

          <input
            type="text"
            name="nomeTarefa"
            placeholder="Nome da Tarefa"
            value={novaTarefa.nomeTarefa}
            onChange={handleChange}
          />
          <textarea
            name="descricao"
            placeholder="Descrição"
            value={novaTarefa.descricao}
            onChange={handleChange}
          />
          <select name="prioridade" value={novaTarefa.prioridade} onChange={handleChange}>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
            <option value="maxima">Máxima</option>
          </select>
          <input
            type="date"
            name="prazoLimite"
            value={novaTarefa.prazoLimite}
            onChange={handleChange}
          />
          <input
            type="text"
            name="responsavel"
            placeholder="Responsável"
            value={novaTarefa.responsavel}
            onChange={handleChange}
          />

          <BotaoEnviar onClick={handleSubmit}>Cadastrar Tarefa</BotaoEnviar>
        </ModalContent>
      </ModalOverlay>
    </>
  );
}

export default Tarefas;
