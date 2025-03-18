import styled from "styled-components";
import React, { useState, useEffect } from "react";
import useAuth from "../Seguranca/UseAuth";

const BotaoEditar = styled.button`
  background: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease, transform 0.2s;
  width: 100%;
  text-align: center;

  &:hover {
    background: #0056b3;
    transform: translateY(-2px);
  }

  &:active {
    background: #004085;
    transform: translateY(0);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const BotaoFechar = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 22px;
  color: #333;
  cursor: pointer;

  &:hover {
    color: #007bff;
  }
`;

const TarefaDetalhesModal = styled.div``;

const DetalheItem = styled.div`
  display: flex;
  margin-bottom: 12px;
  align-items: center;
`;

const Label = styled.label`
  font-weight: 600;
  width: 120px;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 100%;
  font-size: 16px;
  color: #333;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 100%;
  font-size: 16px;
  color: #333;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const BotaoSalvar = styled.button`
  background: #28a745;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease, transform 0.2s;
  width: 100%;
  margin-top: 20px;

  &:hover {
    background: #218838;
    transform: translateY(-2px);
  }

  &:active {
    background: #1e7e34;
    transform: translateY(0);
  }
`;

const BotaoEditarComponent = ({ tarefaSelecionada, carregarTarefas }) => {
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefa, setTarefa] = useState({
    nomeTarefa: "",
    descricao: "",
    prioridade: "",
    prazoLimite: "",
    responsaveisNome: [], // Ajustado para array
    status: false,
  });
  const [advogados, setAdvogados] = useState([]); // Sempre um array
  const { fetchAuthenticated } = useAuth();

  useEffect(() => {
    const fetchAdvogados = async () => {
      try {
        const response = await fetchAuthenticated("http://localhost:8080/adv/buscarTodos", {
          method: "GET",
        });
        const data = await response.json(); // Corrigido para usar json()
        setAdvogados(Array.isArray(data) ? data : []); // Garante que seja um array
      } catch (error) {
        console.error("Erro ao buscar advogados:", error);
        setAdvogados([]); // Em caso de erro, mantém como array vazio
      }
    };

    if (modalAberto) {
      fetchAdvogados();
    }
  }, [modalAberto, fetchAuthenticated]);

  useEffect(() => {
    if (tarefaSelecionada) {
      setTarefa({
        nomeTarefa: tarefaSelecionada.nomeTarefa || "",
        descricao: tarefaSelecionada.descricao || "",
        prioridade: tarefaSelecionada.prioridade || "",
        prazoLimite: tarefaSelecionada.prazoLimite || "",
        responsaveisNome: tarefaSelecionada.responsaveisNome || [], // Ajustado para array
        status: tarefaSelecionada.status || false,
      });
    }
  }, [tarefaSelecionada]);

  const abrirModal = () => {
    if (tarefaSelecionada) {
      setModalAberto(true);
    } else {
      alert("Nenhuma tarefa selecionada.");
    }
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarefa((prevTarefa) => ({
      ...prevTarefa,
      [name]: value,
    }));
  };

  const handleResponsaveisChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setTarefa((prevTarefa) => ({
      ...prevTarefa,
      responsaveisNome: selected,
    }));
  };

  const salvarTarefa = async () => {
    if (!tarefaSelecionada) {
      alert("Nenhuma tarefa selecionada.");
      return;
    }

    try {
      const response = await fetchAuthenticated(
        `http://localhost:8080/task/upd/${tarefaSelecionada.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tarefa),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar tarefa");
      }

      alert("Tarefa atualizada com sucesso!");
      fecharModal();
      carregarTarefas(); // Recarrega as tarefas
    } catch (error) {
      console.error("Erro ao salvar a tarefa:", error);
      alert("Erro ao salvar a tarefa.");
    }
  };

  return (
    <div>
      <BotaoEditar onClick={abrirModal}>Editar</BotaoEditar>

      {modalAberto && (
        <ModalOverlay>
          <ModalContainer>
            <BotaoFechar onClick={fecharModal}>X</BotaoFechar>
            <TarefaDetalhesModal>
              <h3>Editar Tarefa</h3>

              <DetalheItem>
                <Label>Nome:</Label>
                <Input
                  type="text"
                  name="nomeTarefa"
                  value={tarefa.nomeTarefa}
                  onChange={handleChange}
                />
              </DetalheItem>

              <DetalheItem>
                <Label>Descrição:</Label>
                <Input
                  type="text"
                  name="descricao"
                  value={tarefa.descricao}
                  onChange={handleChange}
                />
              </DetalheItem>

              <DetalheItem>
                <Label>Prioridade:</Label>
                <Select
                  name="prioridade"
                  value={tarefa.prioridade}
                  onChange={handleChange}
                >
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </Select>
              </DetalheItem>

              <DetalheItem>
                <Label>Prazos:</Label>
                <Input
                  type="date"
                  name="prazoLimite"
                  value={tarefa.prazoLimite}
                  onChange={handleChange}
                />
              </DetalheItem>

              <DetalheItem>
                <Label>Responsáveis:</Label>
                <Select
                  name="responsaveisNome"
                  multiple // Permite seleção múltipla
                  value={tarefa.responsaveisNome}
                  onChange={handleResponsaveisChange}
                >
                  <option value="">Selecione responsáveis</option>
                  {advogados.map((advogado) => (
                    <option key={advogado.id} value={advogado.nome}>
                      {advogado.nome}
                    </option>
                  ))}
                </Select>
              </DetalheItem>

              <BotaoSalvar onClick={salvarTarefa}>Salvar</BotaoSalvar>
            </TarefaDetalhesModal>
          </ModalContainer>
        </ModalOverlay>
      )}
    </div>
  );
};

export default BotaoEditarComponent;