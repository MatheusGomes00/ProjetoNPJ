import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import useAuth from "../../Seguranca/UseAuth";

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
  z-index: 1000;
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

// Estilo do modal de detalhes da tarefa
const TarefaDetalhesModal = styled.div`
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

const ModalEdicao = ({ tarefa, onClose, carregarTarefas }) => {
  const { fetchAuthenticated } = useAuth();
  const [advogados, setAdvogados] = useState([]);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [tarefaEditada, setTarefaEditada] = useState(null);
  const [error, setError] = useState(""); // Estado para erros

  // Função para formatar a data do backend para o formato do input datetime-local
  const formatarDataParaInput = (dataString) => {
    if (!dataString) return "";
    try {
      const data = new Date(dataString);
      // Formato esperado pelo input datetime-local: "2025-03-25T14:30"
      return data.toISOString().slice(0, 16);
    } catch (err) {
      console.error("Erro ao formatar data:", err);
      return "";
    }
  };

  // Inicializar o estado tarefaEditada
  useEffect(() => {
    if (tarefa) {
      console.log("Tarefa recebida:", tarefa); // Log para depuração
      setTarefaEditada({
        nomeTarefa: tarefa.nomeTarefa || "",
        descricao: tarefa.descricao || "",
        prioridade: tarefa.prioridade || "baixa",
        prazoLimite: formatarDataParaInput(tarefa.prazoLimite), // Formatar a data
        dataCriacao: tarefa.dataCriacao || new Date().toISOString(),
        responsaveisId: tarefa.responsaveisId || [],
        responsaveisNome: tarefa.responsaveisNome || [],
        status: tarefa.status !== undefined ? tarefa.status : true,
      });
    }
  }, [tarefa]);

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
      console.log("Advogados recebidos:", data); // Log para depuração
      setAdvogados(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar advogados:", error);
      setAdvogados([]);
      setError("Erro ao carregar advogados. Tente novamente.");
    }
  }, [fetchAuthenticated]);

  // Carregar advogados ao abrir o modal, mas apenas se ainda não foram carregados
  useEffect(() => {
    if (advogados.length === 0) {
      fetchAdvogados();
    }
  }, [advogados.length, fetchAdvogados]);

  // Função para lidar com mudanças nos campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarefaEditada((prevTarefa) => ({
      ...prevTarefa,
      [name]: value,
    }));
  };

  // Função para toggle de seleção de advogados
  const toggleSelecionarAdvogado = (advogado) => {
    setTarefaEditada((prevTarefa) => {
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
    setTarefaEditada((prevTarefa) => {
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

  // Função para salvar as alterações
  const handleSalvar = async () => {
    if (!tarefaEditada) {
      alert("Nenhuma tarefa para editar.");
      return;
    }

    // Validação mais rigorosa
    if (
      !tarefaEditada.nomeTarefa?.trim() ||
      !tarefaEditada.descricao?.trim() ||
      !tarefaEditada.prioridade ||
      !tarefaEditada.prazoLimite ||
      !tarefaEditada.responsaveisId?.length ||
      !tarefaEditada.responsaveisNome?.length
    ) {
      console.error("Campos obrigatórios não preenchidos:", tarefaEditada);
      alert("Por favor, preencha todos os campos antes de salvar a tarefa.");
      return;
    }

    try {
      // Formatar prazoLimite para o formato LocalDateTime (sem milissegundos)
      const prazoLimiteFormatado = tarefaEditada.prazoLimite
        ? new Date(tarefaEditada.prazoLimite).toISOString().slice(0, 19) // Formato: "2025-03-25T14:30:00"
        : null;

      const tarefaAtualizada = {
        nomeTarefa: tarefaEditada.nomeTarefa,
        descricao: tarefaEditada.descricao,
        status: tarefaEditada.status ?? true, // Garantir que status tenha um valor
        prioridade: tarefaEditada.prioridade,
        prazoLimite: prazoLimiteFormatado,
        dataCriacao: tarefaEditada.dataCriacao ?? new Date().toISOString(), // Garantir que dataCriacao tenha um valor
        responsaveisId: tarefaEditada.responsaveisId ?? [], // Garantir que não seja null
        responsaveisNome: tarefaEditada.responsaveisNome ?? [], // Garantir que não seja null
      };

      console.log("Dados enviados ao backend:", tarefaAtualizada); // Log para depuração

      const response = await fetchAuthenticated(`http://localhost:8080/task/upd/${tarefa.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tarefaAtualizada),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Erro na requisição:", response.status, errorData); // Log mais detalhado
        throw new Error(`Erro na requisição: ${response.status} - ${errorData || "Sem detalhes"}`);
      }

      onClose(); // Fecha o modal após salvar
      await carregarTarefas("", true); // Recarrega as tarefas (passando "" para buscar todas)
      alert("Tarefa atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert(`Erro ao atualizar tarefa: ${error.message}. Verifique os logs do servidor para mais detalhes.`);
    }
  };

  if (!tarefa || !tarefaEditada) {
    console.log("Tarefa ou tarefaEditada não definida:", { tarefa, tarefaEditada });
    return null; // Não renderiza o modal se não houver tarefa ou tarefaEditada
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <BotaoFechar onClick={onClose}>X</BotaoFechar>
        <TarefaDetalhesModal>
          <ModalTitulo>Editar Tarefa: {tarefa.nomeTarefa}</ModalTitulo>

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          <DetalheItem>
            <Label>Nome:</Label>
            <Input
              type="text"
              name="nomeTarefa"
              value={tarefaEditada.nomeTarefa}
              onChange={handleChange}
            />
          </DetalheItem>

          <DetalheItem>
            <Label>Descrição:</Label>
            <Input
              type="text"
              name="descricao"
              value={tarefaEditada.descricao}
              onChange={handleChange}
            />
          </DetalheItem>

          <DetalheItem>
            <Label>Prioridade:</Label>
            <Select
              name="prioridade"
              value={tarefaEditada.prioridade}
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
              type="datetime-local"
              name="prazoLimite"
              value={tarefaEditada.prazoLimite}
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
                            checked={tarefaEditada.responsaveisId.includes(advogado.id)}
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

              {tarefaEditada.responsaveisNome.length > 0 && (
                <ResponsaveisList>
                  {tarefaEditada.responsaveisNome.map((nome, index) => (
                    <ResponsavelTag key={tarefaEditada.responsaveisId[index] || nome}>
                      <span>{nome}</span>
                      <RemoveButton
                        onClick={() => removerResponsavel(tarefaEditada.responsaveisId[index])}
                      >
                        ×
                      </RemoveButton>
                    </ResponsavelTag>
                  ))}
                </ResponsaveisList>
              )}
            </div>
          </DetalheItem>

          <BotaoSalvar onClick={handleSalvar}>Salvar Alterações</BotaoSalvar>
        </TarefaDetalhesModal>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ModalEdicao;