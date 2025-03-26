import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import useAuth from "../../Seguranca/UseAuth";

// Estilo do botão "Criar Tarefa"
const BotaoCriar = styled.button`
  background: #28a745;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease, transform 0.2s;
  margin-bottom: 20px;

  &:hover {
    background: #218838;
    transform: translateY(-2px);
  }

  &:active {
    background: #1e7e34;
    transform: translateY(0);
  }
`;

// Estilo do overlay do modal
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

// Estilo do container do modal
const ModalContainer = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 550px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

// Estilo do botão de fechar
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

// Estilo do modal de criação da tarefa
const TarefaCriacaoModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

// Estilo do título do modal
const ModalTitulo = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 10px;
`;

// Estilo dos itens de detalhe (label + input)
const DetalheItem = styled.div`
  display: flex;
  margin-bottom: 12px;
  align-items: center;
`;

// Estilo do label
const Label = styled.label`
  font-weight: 600;
  width: 120px;
  color: #555;
`;

// Estilo do input
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

// Estilo do select
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

// Estilo do container do dropdown
const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

// Estilo do botão do dropdown
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

// Estilo do conteúdo do dropdown
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

// Estilo dos itens do dropdown
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

// Estilo da lista de responsáveis
const ResponsaveisList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

// Estilo das tags de responsáveis
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

// Estilo do botão de remover responsável
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

// Estilo do botão de salvar
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

// Estilo para mensagens de erro
const MensagemErro = styled.p`
  color: #e74c3c;
  text-align: center;
  margin-top: 10px;
`;

const CriarTarefa = ({ carregarTarefas }) => {
  const { fetchAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [novaTarefa, setNovaTarefa] = useState({
    nomeTarefa: "",
    descricao: "",
    status: true,
    prioridade: "baixa",
    prazoLimite: "",
    responsaveisId: [],
    responsaveisNome: [],
  });
  const [advogados, setAdvogados] = useState([]);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  // Função para buscar advogados
  const fetchAdvogados = useCallback(async () => {
    try {
      const response = await fetchAuthenticated("http://localhost:8080/adv/buscarTodos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar advogados: ${response.status}`);
      }

      const data = await response.json();
      console.log("Advogados recebidos:", data);
      setAdvogados(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar advogados:", error);
      setAdvogados([]);
      setMensagemErro("Erro ao carregar advogados. Tente novamente.");
    }
  }, [fetchAuthenticated]);

  // Carregar advogados ao abrir o modal
  useEffect(() => {
    if (showModal && advogados.length === 0) {
      fetchAdvogados();
    }
  }, [showModal, advogados.length, fetchAdvogados]);

  // Funções para abrir e fechar o modal
  const abrirModal = () => {
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setDropdownAberto(false);
    setNovaTarefa({
      nomeTarefa: "",
      descricao: "",
      status: true,
      prioridade: "baixa",
      prazoLimite: "",
      responsaveisId: [],
      responsaveisNome: [],
    });
    setMensagemErro("");
  };

  // Função para lidar com mudanças nos campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaTarefa((prevTarefa) => ({
      ...prevTarefa,
      [name]: value,
    }));
  };

  // Função para toggle de seleção de advogados
  const toggleSelecionarAdvogado = (advogado) => {
    setNovaTarefa((prevTarefa) => {
      const isSelected = prevTarefa.responsaveisId.includes(advogado.id);
      if (isSelected) {
        return {
          ...prevTarefa,
          responsaveisId: prevTarefa.responsaveisId.filter((id) => id !== advogado.id),
          responsaveisNome: prevTarefa.responsaveisNome.filter((nome) => nome !== advogado.nome),
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

  // Função para remover um responsável
  const removerResponsavel = (id) => {
    setNovaTarefa((prevTarefa) => {
      const index = prevTarefa.responsaveisId.indexOf(id);
      if (index === -1) return prevTarefa;

      const novoIdRemovido = prevTarefa.responsaveisId[index];
      const novoNomeRemovido = prevTarefa.responsaveisNome[index];
      const novosIds = prevTarefa.responsaveisId.filter((rid) => rid !== id);
      const novosNomes = prevTarefa.responsaveisNome.filter((nome) => nome !== novoNomeRemovido);

      return {
        ...prevTarefa,
        responsaveisId: novosIds,
        responsaveisNome: novosNomes,
      };
    });
  };

  // Função para criar a tarefa
  const handleCriarTarefa = async () => {
    try {
      // Formatar prazoLimite (enviar apenas a data, como no BotaoEditarComponent)
      const prazoLimiteFormatado = novaTarefa.prazoLimite || null;

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
        responsaveisId: [],
        responsaveisNome: [],
      });

      // Chama a função carregarTarefas para atualizar a lista de tarefas no componente pai
      if (carregarTarefas) {
        await carregarTarefas(true);
      }
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      setMensagemErro(`Erro ao cadastrar tarefa: ${error.message}`);
    }
  };

  return (
    <div>
      {/* Botão para abrir o modal de criação */}
      <BotaoCriar onClick={abrirModal}>Criar Tarefa</BotaoCriar>

      {/* Modal de Criação */}
      {showModal && (
        <ModalOverlay onClick={fecharModal}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <BotaoFechar onClick={fecharModal}>X</BotaoFechar>
            <TarefaCriacaoModal>
              <ModalTitulo>Criar Nova Tarefa</ModalTitulo>

              {mensagemErro && <MensagemErro>{mensagemErro}</MensagemErro>}

              <DetalheItem>
                <Label>Nome:</Label>
                <Input
                  type="text"
                  name="nomeTarefa"
                  value={novaTarefa.nomeTarefa}
                  onChange={handleChange}
                />
              </DetalheItem>

              <DetalheItem>
                <Label>Descrição:</Label>
                <Input
                  type="text"
                  name="descricao"
                  value={novaTarefa.descricao}
                  onChange={handleChange}
                />
              </DetalheItem>

              <DetalheItem>
                <Label>Prioridade:</Label>
                <Select
                  name="prioridade"
                  value={novaTarefa.prioridade}
                  onChange={handleChange}
                >
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </Select>
              </DetalheItem>

              <DetalheItem>
                <Label>Prazo:</Label>
                <Input
                  type="date"
                  name="prazoLimite"
                  value={novaTarefa.prazoLimite}
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

                  {novaTarefa.responsaveisNome.length > 0 && (
                    <ResponsaveisList>
                      {novaTarefa.responsaveisNome.map((nome, index) => (
                        <ResponsavelTag key={novaTarefa.responsaveisId[index] || nome}>
                          <span>{nome}</span>
                          <RemoveButton
                            onClick={() => removerResponsavel(novaTarefa.responsaveisId[index])}
                          >
                            ×
                          </RemoveButton>
                        </ResponsavelTag>
                      ))}
                    </ResponsaveisList>
                  )}
                </div>
              </DetalheItem>

              <BotaoSalvar onClick={handleCriarTarefa}>Criar Tarefa</BotaoSalvar>
            </TarefaCriacaoModal>
          </ModalContainer>
        </ModalOverlay>
      )}
    </div>
  );
};

export default CriarTarefa;