import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

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
  margin-left: 52px;
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
  background-color: ${({ prioridade }) =>
    prioridade === "baixa"
      ? "green"
      : prioridade === "media"
      ? "yellow" 
      : "red"};
  border-radius: 30%;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
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

const BotaoFechar = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  color: #333;
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;
  border-radius: 50%;
  padding: 5px;
  transition: background 0.3s ease;

  &:hover {
    background: #f0f0f0;
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
  width: 380px;
  padding: 25px;
`;

const BotaoEditar = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: #218838;
    transform: translateY(-2px);
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
    prazoLimite: "",
    dataCriacao: new Date().toISOString(),
    responsavelId: "",
    responsavelNome: ""
  });

  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);

  // Função para obter o token
  const getToken = () => {
    return localStorage.getItem("token"); // Certifique-se de que o token está salvo corretamente
  };

  const buscarTarefas = async () => {
    try {
      const token = getToken();
      const response = await axios.get("http://localhost:8080/task/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const tarefasComResponsavel = await Promise.all(
        response.data.map(async (tarefa) => {
          if (tarefa.responsavelId) {
            try {
              const responsavelResponse = await axios.get(
                `http://localhost:8080/adv/buscar/${tarefa.responsavelId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              return {
                ...tarefa,
                responsavelNome: responsavelResponse.data.nome,
              };
            } catch (error) {
              console.error("Erro ao buscar responsável:", error);
              return {
                ...tarefa,
                responsavelNome: "Desconhecido",
              };
            }
          } else {
            return {
              ...tarefa,
              responsavelNome: "Não atribuído",
            };
          }
        })
      );
      setTarefas(tarefasComResponsavel);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  const buscarAdvogados = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token não encontrado!");
        return;
      }
  
      const response = await axios.get("http://localhost:8080/adv/buscarTodos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdvogados(response.data);
    } catch (error) {
      console.error("Erro ao buscar advogados:", error.response ? error.response.data : error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = getToken();
      const prazoLimiteFormatado = novaTarefa.prazoLimite
        ? novaTarefa.prazoLimite.split("T")[0]
        : null;
      const novaTarefaComData = {
        ...novaTarefa,
        prazoLimite: prazoLimiteFormatado,
        dataCriacao: new Date().toISOString(),
        responsavel: {
          $ref: "cadastroAdvogado",
          $id: novaTarefa.responsavelId,
        },
      };
      await axios.post("http://localhost:8080/task/create", novaTarefaComData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setShowModal(false);
      setNovaTarefa({
        nomeTarefa: "",
        descricao: "",
        status: true,
        prioridade: "baixa",
        prazoLimite: "",
        dataCriacao: new Date().toISOString(),
        responsavelId: "",
        responsavelNome: "",
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

  useEffect(() => {
    buscarTarefas();
    buscarAdvogados();
  }, []);

  return (
    <div>
      <TarefasContainer>
        <TituloTarefas>Lista de Tarefas</TituloTarefas>
        <ListaTarefas>
          {tarefas.map((tarefa) => (
            <TarefaCard key={tarefa.id} onClick={() => abrirDetalhesModal(tarefa)}>
              <StatusTag prioridade={tarefa.prioridade} />
              <p><strong>{tarefa.nomeTarefa}</strong></p>
              <p>{tarefa.responsavelNome}</p>
            </TarefaCard>
          ))}
        </ListaTarefas>
        <LegendaPrioridades>
          <TagLegenda>
            <CorTag cor="green" />
            <span>Baixa</span>
          </TagLegenda>
          <TagLegenda>
            <CorTag cor="yellow" />
            <span>Média</span>
          </TagLegenda>
          <TagLegenda>
            <CorTag cor="red" />
            <span>Alta</span>
          </TagLegenda>
        </LegendaPrioridades>
        <BotaoAdicionar onClick={abrirModal}>Adicionar Tarefa</BotaoAdicionar>
        {mensagemSucesso && <MensagemSucesso>{mensagemSucesso}</MensagemSucesso>}
      </TarefasContainer>

      <ModalOverlay show={showModal}>
        <ModalContent>
          <BotaoFechar onClick={fecharModal}>&times;</BotaoFechar>
          <h3>Cadastrar Nova Tarefa</h3>
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
          <input
            type="date"
            value={novaTarefa.prazoLimite}
            onChange={(e) => setNovaTarefa({ ...novaTarefa, prazoLimite: e.target.value })}
          />
          <SelectPrioridade
            value={novaTarefa.prioridade}
            onChange={(e) => setNovaTarefa({ ...novaTarefa, prioridade: e.target.value })}
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </SelectPrioridade>
          <select
            value={novaTarefa.responsavelId}
            onChange={(e) =>
              setNovaTarefa({
                ...novaTarefa,
                responsavelId: e.target.value,
                responsavelNome: advogados.find((adv) => adv.id === e.target.value)?.nome || "",
              })
            }
          >
            <option value="">Selecione o Responsável</option>
            {advogados.map((advogado) => (
              <option key={advogado.id} value={advogado.id}>
                {advogado.nome}
              </option>
            ))}
          </select>
          <BotaoEditar onClick={handleSubmit}>Salvar Tarefa</BotaoEditar>
        </ModalContent>
      </ModalOverlay>

      {tarefaSelecionada && (
        <ModalOverlay show={showDetalhesModal}>
          <TarefaDetalhesModal>
            <BotaoFechar onClick={fecharDetalhesModal}>&times;</BotaoFechar>
            <h3>{tarefaSelecionada.nomeTarefa}</h3>
            <p><strong>Descrição:</strong> {tarefaSelecionada.descricao}</p>
            <p><strong>Responsável:</strong> {tarefaSelecionada.responsavelNome}</p>
            <p><strong>Prioridade:</strong> {tarefaSelecionada.prioridade}</p>
            <p><strong>Prazo:</strong> {tarefaSelecionada.prazoLimite}</p>
          </TarefaDetalhesModal>
        </ModalOverlay>
      )}
    </div>
  );
}

export default Tarefas;
