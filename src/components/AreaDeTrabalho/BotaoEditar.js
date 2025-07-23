import styled from "styled-components";
import React, { useState, useEffect, useCallback } from "react";
import useAuth from "../Seguranca/UseAuth";
import { useAuthContext } from '../Seguranca/AuthContext';

// Estilos (mantidos como estão)
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
  top: 25px;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;
const ModalContainer = styled.div`
  background: #ffffff;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 550px;
  height: 95vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  position: flex;
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
const BotaoFechar = styled.button`
  position: absolute;
  top: 80px;
  right: 30px;
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
  flex-direction: column;
  margin-bottom: 12px;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
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
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
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
  min-height: 60px;
  max-height: 200px;
  overflow-y: auto;
  box-sizing: border-box;

  &:focus {
    border-color: rgb(0, 123, 255);
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

const BotaoEditarComponent = ({ tarefaSelecionada, carregarTarefas, atualizarTarefa }) => {
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefa, setTarefa] = useState({
    nomeTarefa: "",
    descricao: "",
    prioridade: "",
    prazoLimite: "",
    responsaveis: [],
    status: false,
  });
  const [advogados, setAdvogados] = useState([]);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const { fetchAuthenticated } = useAuth();
  const { isSessionInvalid } = useAuthContext();

  const formatarDataParaInput = (dataString) => {
    if (!dataString) return "";
    try {
      const data = new Date(dataString);
      const dataUTC = new Date(
        Date.UTC(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate())
      );
      return dataUTC.toISOString().split("T")[0];
    } catch (err) {
      console.error("Erro ao formatar data:", err);
      return "";
    }
  };

  const fetchAdvogados = useCallback(async () => {
    try {
      const response = await fetchAuthenticated("/adv/buscarTodos", {
        method: "GET",
      });
      if (!response.ok) throw new Error("Erro ao buscar advogados");
      const data = await response.json();
      setAdvogados(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar advogados:", error);
      setAdvogados([]);
    }
  }, [fetchAuthenticated]);

  useEffect(() => {
    if (isSessionInvalid) return;
    if (modalAberto && advogados.length === 0) {
      fetchAdvogados();
    }
  }, [modalAberto, advogados.length, fetchAdvogados, isSessionInvalid]);

  useEffect(() => {
    if (isSessionInvalid) return;
    if (tarefaSelecionada) {
      const responsaveis = (tarefaSelecionada.responsaveisId || []).map((id, index) => ({
        id: id,
        nome: tarefaSelecionada.responsaveisNome[index],
      }));

   

      setTarefa({
        nomeTarefa: tarefaSelecionada.nomeTarefa || "",
        descricao: tarefaSelecionada.descricao || "",
        prioridade: tarefaSelecionada.prioridade || "",
        prazoLimite: formatarDataParaInput(tarefaSelecionada.prazoLimite),
        responsaveis: responsaveis,
        status: tarefaSelecionada.status || false,
      });
    }
  }, [tarefaSelecionada, isSessionInvalid]);

  const abrirModal = () => {
    if (tarefaSelecionada) {
      setModalAberto(true);
    } else {
      alert("Nenhuma tarefa selecionada.");
    }
  };

  const fecharModal = () => {
    setModalAberto(false);
    setDropdownAberto(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
   
    setTarefa((prevTarefa) => {
      const novaTarefa = {
        ...prevTarefa,
        [name]: value,
      };
  
      return novaTarefa;
    });
  };

  const toggleSelecionarAdvogado = (advogado) => {
    setTarefa((prevTarefa) => {
      const isSelected = prevTarefa.responsaveis.some((resp) => resp.id === advogado.id);
      if (isSelected) {
        return {
          ...prevTarefa,
          responsaveis: prevTarefa.responsaveis.filter((resp) => resp.id !== advogado.id),
        };
      } else {
        return {
          ...prevTarefa,
          responsaveis: [...prevTarefa.responsaveis, { id: advogado.id, nome: advogado.nome }],
        };
      }
    });
  };

  const removerResponsavel = (id) => {
    setTarefa((prevTarefa) => ({
      ...prevTarefa,
      responsaveis: prevTarefa.responsaveis.filter((resp) => resp.id !== id),
    }));
  };

  const salvarTarefa = async () => {
    if (!tarefaSelecionada) {
      alert("Nenhuma tarefa selecionada.");
      return;
    }

    if (
      !tarefa.nomeTarefa?.trim() ||
      !tarefa.descricao?.trim() ||
      !tarefa.prioridade ||
      !tarefa.prazoLimite ||
      !tarefa.responsaveis?.length
    ) {
      alert("Por favor, preencha todos os campos antes de salvar a tarefa.");
      return;
    }

    try {
      const responsaveisId = tarefa.responsaveis.map((resp) => resp.id);
      const responsaveisNome = tarefa.responsaveis.map((resp) => resp.nome);

      const tarefaAtualizada = {
        nomeTarefa: tarefa.nomeTarefa,
        descricao: tarefa.descricao,
        prioridade: tarefa.prioridade,
        prazoLimite: tarefa.prazoLimite,
        responsaveisId: responsaveisId,
        responsaveisNome: responsaveisNome,
        status: tarefa.status,
      };


      const response = await fetchAuthenticated(
        `/task/upd/${tarefaSelecionada.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tarefaAtualizada),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Erro na requisição: ${response.status} - ${errorData || "Sem detalhes"}`);
      }

      const contentType = response.headers.get("content-type");
      let tarefaAtualizadaDoBackend = null;
      if (contentType && contentType.includes("application/json")) {
        tarefaAtualizadaDoBackend = await response.json();
        if (tarefaAtualizadaDoBackend.responsaveis) {
          tarefaAtualizadaDoBackend.responsaveisId = tarefaAtualizadaDoBackend.responsaveis.map(
            (adv) => adv.id
          );
          tarefaAtualizadaDoBackend.responsaveisNome = tarefaAtualizadaDoBackend.responsaveis.map(
            (adv) => adv.nome
          );
          delete tarefaAtualizadaDoBackend.responsaveis;
        }
      } else {
        console.warn("Resposta do backend não contém JSON. Usando dados enviados como fallback.");
        tarefaAtualizadaDoBackend = { ...tarefaAtualizada, id: tarefaSelecionada.id };
        tarefaAtualizadaDoBackend.prazoLimite = `${tarefaAtualizada.prazoLimite}T20:00:00`;
      }

      

      if (typeof atualizarTarefa === "function") {
        atualizarTarefa(tarefaAtualizadaDoBackend);
      } else {
        console.warn("Prop atualizarTarefa não foi fornecida ou não é uma função.");
        if (typeof carregarTarefas === "function") {
          await carregarTarefas(true);
        }
      }

      alert("Tarefa atualizada com sucesso!");
      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar a tarefa:", error);
      alert(`Erro ao salvar a tarefa: ${error.message}`);
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
                <TextArea
                  name="nomeTarefa"
                  value={tarefa.nomeTarefa}
                  onChange={handleChange}
                  required
                />
              </DetalheItem>

              <DetalheItem>
                <Label>Descrição:</Label>
                <TextArea
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
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
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
                <div style={{ width: "100%" }}>
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
                                checked={tarefa.responsaveis.some((resp) => resp.id === advogado.id)}
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

                  {tarefa.responsaveis.length > 0 && (
                    <ResponsaveisList>
                      {tarefa.responsaveis.map((resp) => (
                        <ResponsavelTag key={resp.id}>
                          <span>{resp.nome}</span>
                          <RemoveButton onClick={() => removerResponsavel(resp.id)}>
                            ×
                          </RemoveButton>
                        </ResponsavelTag>
                      ))}
                    </ResponsaveisList>
                  )}
                </div>
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