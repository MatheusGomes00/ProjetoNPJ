import styled from "styled-components";
import React, { useState, useEffect } from "react";
import axios from "axios";

const BotaoEditar = styled.button`
  background: #007bff;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
  width: 100%;
  text-align: center;

  &:hover {
    background: #0056b3;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
`;

const BotaoFechar = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;
`;

const TarefaDetalhesModal = styled.div``;

const DetalheItem = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const Label = styled.label`
  font-weight: bold;
  width: 100px;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  width: 100%;
`;

const BotaoSalvar = styled.button`
  background: #28a745;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
  width: 100%;
  margin-top: 20px;

  &:hover {
    background: #218838;
  }
`;


const BotaoEditarComponent = ({ tarefaSelecionada }) => {
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefa, setTarefa] = useState({
    nomeTarefa: '',
    descricao: '',
    prioridade: '',
    prazoLimite: '',
    responsavelNome: '',
    status: false,
  });

  // Log para depurar o valor de tarefaSelecionada
  useEffect(() => {
    console.log("tarefaSelecionada:", tarefaSelecionada);
    if (tarefaSelecionada) {
      setTarefa({
        nomeTarefa: tarefaSelecionada.nomeTarefa || '',
        descricao: tarefaSelecionada.descricao || '',
        prioridade: tarefaSelecionada.prioridade || '',
        prazoLimite: tarefaSelecionada.prazoLimite || '',
        responsavelNome: tarefaSelecionada.responsavelNome || '',
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

  const salvarTarefa = async () => {
    if (!tarefaSelecionada) {
      alert("Nenhuma tarefa selecionada.");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/task/upd/${tarefaSelecionada.id}`, tarefa);
      alert('Tarefa atualizada com sucesso!');
      fecharModal();  // Fecha o modal após salvar
    } catch (error) {
      console.error('Erro ao salvar a tarefa:', error);
      alert('Erro ao salvar a tarefa.');
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
                <Input
                  type="text"
                  name="prioridade"
                  value={tarefa.prioridade}
                  onChange={handleChange}
                />
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
                <Label>Responsável:</Label>
                <Input
                  type="text"
                  name="responsavelNome"
                  value={tarefa.responsavelNome}
                  onChange={handleChange}
                />
              </DetalheItem>

              <DetalheItem>
                <Label>Status:</Label>
                <Input
                  type="checkbox"
                  name="status"
                  checked={tarefa.status}
                  onChange={(e) => setTarefa({ ...tarefa, status: e.target.checked })}
                />
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
