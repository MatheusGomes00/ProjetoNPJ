import styled from "styled-components";
import React, { useState, useEffect } from "react";
import axios from "axios";

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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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



const BotaoEditarComponent = ({ tarefaSelecionada, carregarTarefas, setTarefas }) => {
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefa, setTarefa] = useState({
    nomeTarefa: '',
    descricao: '',
    prioridade: '',
    prazoLimite: '',
    responsavelNome: '',
    status: false,
    
  });
  const [advogados, setAdvogados] = useState([]); // Estado para armazenar advogados

  

  useEffect(() => {
    // Buscar advogados quando o modal for aberto
    const fetchAdvogados = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/adv/buscarTodos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdvogados(response.data); // Armazenando advogados na variável de estado
      } catch (error) {
        console.error("Erro ao buscar advogados:", error);
      }
    };

    if (modalAberto) {
      fetchAdvogados();
    }
  }, [modalAberto]);

  useEffect(() => {
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
      const token = localStorage.getItem("token");
  
      await axios.put(
        `http://localhost:8080/task/upd/${tarefaSelecionada.id}`,
        tarefa,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      alert("Tarefa atualizada com sucesso!");
      fecharModal();
      
     
      // Recarregar as tarefas para refletir as mudanças
      carregarTarefas();  // Aqui recarrega as tarefas e a cor da tag será atualizada
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
            <select
                name="prioridade"
                value={tarefa.prioridade}
                onChange={handleChange}
                style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                width: '100%',
                fontSize: '16px',
                color: '#333',
                transition: 'border-color 0.3s ease',
                      }}
            >
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
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
                <Select
                  name="responsavelNome"
                  value={tarefa.responsavelNome}
                  onChange={handleChange}
                >
                  <option value="">Selecione um responsável</option>
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
