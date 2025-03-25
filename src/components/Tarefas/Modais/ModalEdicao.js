import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import useAuth from "../../Seguranca/UseAuth";

// Estilo do overlay do modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Fundo escurecido */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// Estilo base do modal (equivalente a ModalContent)
const ModalContent = styled.div`
  background: #ffffff;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 550px;
  max-height: 85vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  position: relative;
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

// Estilo específico do modal de edição
const TarefaDetalhesModal = styled(ModalContent)`
  width: 520px;
  max-height: 80vh;
  padding: 25px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

// Estilo do botão de fechar
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

// Estilo do título do modal
const ModalTitulo = styled.h2`
  font-family: "Arial", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 20px 0;
`;

// Estilo do label do formulário
const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #34495e;
  margin-bottom: 5px;
  display: block;
`;

// Estilo do input do formulário
const FormInput = styled.input`
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #dfe6e9;
  width: 100%;
  font-size: 16px;
  color: #2d3436;
  background: #f9fbfc;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
    outline: none;
  }
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

// Estilo do select de prioridade
const SelectPrioridade = styled.select`
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #dfe6e9;
  width: 100%;
  font-size: 16px;
  color: #2d3436;
  background: #f9fbfc;
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
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

// Estilo do botão de salvar
const BotaoSalvar = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background-color: #0056b3;
  }
`;

const ModalEdicao = ({ tarefa, onClose, carregarTarefas }) => {
  const { fetchAuthenticated } = useAuth();
  const [advogados, setAdvogados] = useState([]);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [tarefaEditada, setTarefaEditada] = useState({
    nomeTarefa: tarefa?.nomeTarefa || "",
    descricao: tarefa?.descricao || "",
    status: tarefa?.status || true,
    prioridade: tarefa?.prioridade || "baixa",
    prazoLimite: tarefa?.prazoLimite ? tarefa.prazoLimite.split(".")[0] : "", // Ajuste para o formato datetime-local
    dataCriacao: tarefa?.dataCriacao || new Date().toISOString(),
    responsaveisId: tarefa?.responsaveisId || [],
    responsaveisNome: tarefa?.responsaveisNome || [],
  });

  // Função para buscar advogados
  const buscarAdvogados = useCallback(async () => {
    try {
      const response = await fetchAuthenticated("http://localhost:8080/adv/buscarTodos", {
        method: "GET",
      });
      const data = await response.json();
      setAdvogados(data);
    } catch (error) {
      console.error("Erro ao buscar advogados:", error.response ? error.response.data : error.message);
    }
  }, [fetchAuthenticated]);

  // Carregar advogados ao abrir o modal
  useEffect(() => {
    buscarAdvogados();
  }, [buscarAdvogados]);

  // Função para toggle de seleção de advogados
  const toggleSelecionarAdvogado = (advogado) => {
    setTarefaEditada((prevTarefa) => {
      const isSelected = prevTarefa.responsaveisId.includes(advogado.id);
      if (isSelected) {
        const novosIds = prevTarefa.responsaveisId.filter((id) => id !== advogado.id);
        const novosNomes = prevTarefa.responsaveisNome.filter((nome) => nome !== advogado.nome);
        return {
          ...prevTarefa,
          responsaveisId: novosIds,
          responsaveisNome: novosNomes,
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

  // Função para lidar com a mudança do prazo
  const handlePrazoLimiteChange = (e) => {
    setTarefaEditada({
      ...tarefaEditada,
      prazoLimite: e.target.value,
    });
  };

  // Função para salvar as alterações
  const handleSalvar = async () => {
    if (
      !tarefaEditada.nomeTarefa.trim() ||
      !tarefaEditada.descricao.trim() ||
      !tarefaEditada.prioridade ||
      !tarefaEditada.prazoLimite ||
      tarefaEditada.responsaveisId.length === 0
    ) {
      alert("Por favor, preencha todos os campos antes de salvar a tarefa.");
      return;
    }

    try {
      const prazoLimiteFormatado = tarefaEditada.prazoLimite
        ? tarefaEditada.prazoLimite.split("T")[0]
        : null;

      const tarefaAtualizada = {
        nomeTarefa: tarefaEditada.nomeTarefa,
        descricao: tarefaEditada.descricao,
        status: tarefaEditada.status,
        prioridade: tarefaEditada.prioridade,
        prazoLimite: prazoLimiteFormatado,
        dataCriacao: tarefaEditada.dataCriacao,
        responsaveisId: tarefaEditada.responsaveisId,
        responsaveisNome: tarefaEditada.responsaveisNome,
      };

      const response = await fetchAuthenticated(`http://localhost:8080/task/update/${tarefa.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tarefaAtualizada),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro na requisição: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      onClose(); // Fecha o modal após salvar
      await carregarTarefas(true); // Recarrega as tarefas
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert(`Erro ao atualizar tarefa: ${error.message}`);
    }
  };

  if (!tarefa) return null; // Não renderiza o modal se não houver tarefa

  return (
    <ModalOverlay onClick={onClose}>
      <TarefaDetalhesModal onClick={(e) => e.stopPropagation()}>
        <BotaoFechar onClick={onClose}>×</BotaoFechar>
        <ModalTitulo>Editar Tarefa: {tarefa.nomeTarefa}</ModalTitulo>

        <div>
          <FormLabel>Nome da Tarefa:</FormLabel>
          <FormInput
            type="text"
            value={tarefaEditada.nomeTarefa}
            onChange={(e) => setTarefaEditada({ ...tarefaEditada, nomeTarefa: e.target.value })}
            placeholder="Digite o nome da tarefa"
          />
        </div>

        <div>
          <FormLabel>Descrição:</FormLabel>
          <FormInput
            type="text"
            value={tarefaEditada.descricao}
            onChange={(e) => setTarefaEditada({ ...tarefaEditada, descricao: e.target.value })}
            placeholder="Descreva a tarefa"
          />
        </div>

        <div>
          <FormLabel>Prioridade:</FormLabel>
          <SelectPrioridade
            value={tarefaEditada.prioridade}
            onChange={(e) => setTarefaEditada({ ...tarefaEditada, prioridade: e.target.value })}
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </SelectPrioridade>
        </div>

        <div>
          <FormLabel>Prazo Limite:</FormLabel>
          <FormInput
            type="datetime-local"
            value={tarefaEditada.prazoLimite}
            onChange={handlePrazoLimiteChange}
          />
        </div>

        <div>
          <FormLabel>Selecionar Responsáveis:</FormLabel>
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
        </div>

        <div>
          <FormLabel>Responsáveis Selecionados:</FormLabel>
          {tarefaEditada.responsaveisNome.length > 0 ? (
            <ResponsaveisList>
              {tarefaEditada.responsaveisNome.map((nome, index) => (
                <ResponsavelTag key={tarefaEditada.responsaveisId[index]}>
                  <span>{nome}</span>
                  <RemoveButton
                    onClick={() =>
                      toggleSelecionarAdvogado(
                        advogados.find((a) => a.id === tarefaEditada.responsaveisId[index])
                      )
                    }
                  >
                    ×
                  </RemoveButton>
                </ResponsavelTag>
              ))}
            </ResponsaveisList>
          ) : (
            <p style={{ color: "#7f8c8d", fontSize: "14px" }}>
              Nenhum responsável selecionado
            </p>
          )}
        </div>

        <BotaoSalvar onClick={handleSalvar}>Salvar Alterações</BotaoSalvar>
      </TarefaDetalhesModal>
    </ModalOverlay>
  );
};

export default ModalEdicao;