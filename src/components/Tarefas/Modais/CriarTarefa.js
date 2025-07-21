import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import useAuth from "../../Seguranca/UseAuth";
import { useAuthContext } from '../../Seguranca/AuthContext';

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

// Estilo do label com asterisco
const Label = styled.label`
  font-weight: 600;
  width: 120px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 4px;

  .required::after {
    content: "*";
    color: #e74c3c;
  }
`;

// Estilo do input
const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.error ? "#e74c3c" : "#ddd")};
  width: 100%;
  font-size: 16px;
  color: #333;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${(props) => (props.error ? "#e74c3c" : "#007bff")};
    outline: none;
  }
`;

// Estilo do select
const Select = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.error ? "#e74c3c" : "#ddd")};
  width: 100%;
  font-size: 16px;
  color: #333;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${(props) => (props.error ? "#e74c3c" : "#007bff")};
    outline: none;
  }
`;

// Estilo do container de prazo
const PrazoContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
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
  border: 1px solid ${(props) => (props.error ? "#e74c3c" : "#dfe6e9")};
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
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-weight: 600;
  transition: background 0.3s ease, transform 0.2s;
  width: 100%;
  margin-top: 20px;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover:not(:disabled) {
    background: #218838;
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    background: #1e7e34;
    transform: translateY(0);
  }
`;

// Estilo para mensagens de erro
const MensagemErro = styled.p`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
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
    prazoHora: "",
    responsaveisId: [],
    responsaveisNome: [],
  });
  const [advogados, setAdvogados] = useState([]);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [erros, setErros] = useState({});
  const [dataError, setDataError] = useState("");
  const { isSessionInvalid } = useAuthContext();

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
     
      setAdvogados(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar advogados:", error);
      setAdvogados([]);
      setMensagemErro("Erro ao carregar advogados. Tente novamente.");
    }
  }, [fetchAuthenticated]);

  // Carregar advogados ao abrir o modal
  useEffect(() => {
    if (isSessionInvalid) return;
    if (showModal && advogados.length === 0) {
      fetchAdvogados();
    }
  }, [isSessionInvalid, showModal, advogados.length, fetchAdvogados]);

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
      prazoHora: "",
      responsaveisId: [],
      responsaveisNome: [],
    });
    setMensagemErro("");
    setErros({});
    setDataError("");
  };

  // Função para validar o ano
  const validateYear = (value) => {
    if (!value) return true; // Allow empty input
    const year = value.split("-")[0];
    if (year.length > 4) {
      setDataError("O ano deve ter no máximo 4 dígitos.");
      setErros((prevErros) => ({ ...prevErros, prazoLimite: true }));
      return false;
    }
    if (year.length === 4) {
      if (!/^\d{4}$/.test(year)) {
        setDataError("O ano deve ser um número de 4 dígitos (ex.: 2025).");
        setErros((prevErros) => ({ ...prevErros, prazoLimite: true }));
        return false;
      }
      const yearNum = parseInt(year, 10);
      if (yearNum < 1900 || yearNum > 9999) {
        setDataError("O ano deve estar entre 1900 e 9999.");
        setErros((prevErros) => ({ ...prevErros, prazoLimite: true }));
        return false;
      }
    }
    setDataError("");
    setErros((prevErros) => ({ ...prevErros, prazoLimite: false }));
    return true;
  };

  // Função para lidar com mudanças no campo de data
  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setNovaTarefa((prevTarefa) => ({
      ...prevTarefa,
      [name]: value,
    }));
    // Clear error while typing, validation happens on blur or save
    setDataError("");
    setErros((prevErros) => ({ ...prevErros, prazoLimite: false }));
  };

  // Função para validar data ao sair do campo
  const handleDataBlur = (e) => {
    const { value } = e.target;
    if (value) {
      validateYear(value);
    }
  };

  // Função para lidar com mudanças nos outros campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaTarefa((prevTarefa) => ({
      ...prevTarefa,
      [name]: value,
    }));
    setErros((prevErros) => ({
      ...prevErros,
      [name]: false,
    }));
  };

  // Função para toggle de seleção de advogados
  const toggleSelecionarAdvogado = (advogado) => {
    setNovaTarefa((prevTarefa) => {
      const isSelected = prevTarefa.responsaveisId.includes(advogado.id);
      let newResponsaveisId, newResponsaveisNome;

      if (isSelected) {
        newResponsaveisId = prevTarefa.responsaveisId.filter((id) => id !== advogado.id);
        newResponsaveisNome = prevTarefa.responsaveisNome.filter((nome) => nome !== advogado.nome);
      } else {
        newResponsaveisId = [...prevTarefa.responsaveisId, advogado.id];
        newResponsaveisNome = [...prevTarefa.responsaveisNome, advogado.nome];
      }

      return {
        ...prevTarefa,
        responsaveisId: newResponsaveisId,
        responsaveisNome: newResponsaveisNome,
      };
    });
    setErros((prevErros) => ({
      ...prevErros,
      responsaveis: false,
    }));
  };

  // Função para remover um responsável
  const removerResponsavel = (id) => {
    setNovaTarefa((prevTarefa) => {
      const index = prevTarefa.responsaveisId.indexOf(id);
      if (index === -1) return prevTarefa;

      const novosIds = prevTarefa.responsaveisId.filter((rid) => rid !== id);
      const novosNomes = prevTarefa.responsaveisNome.filter((_, i) => i !== index);

      return {
        ...prevTarefa,
        responsaveisId: novosIds,
        responsaveisNome: novosNomes,
      };
    });
    setErros((prevErros) => ({
      ...prevErros,
      responsaveis: false,
    }));
  };

  // Função para validar campos
  const validarCampos = () => {
    const novosErros = {
      nomeTarefa: !novaTarefa.nomeTarefa.trim(),
      descricao: !novaTarefa.descricao.trim(),
      prioridade: !novaTarefa.prioridade,
      prazoLimite: !novaTarefa.prazoLimite,
      prazoHora: !novaTarefa.prazoHora,
      responsaveis: novaTarefa.responsaveisId.length === 0,
    };

    if (novaTarefa.prazoLimite) {
      const isYearValid = validateYear(novaTarefa.prazoLimite);
      novosErros.prazoLimite = novosErros.prazoLimite || !isYearValid;
    }

    setErros(novosErros);
    return !Object.values(novosErros).some((erro) => erro);
  };

  // Função para criar a tarefa
  const handleCriarTarefa = async () => {
    // Validar o ano antes de prosseguir
    if (novaTarefa.prazoLimite) {
      const year = novaTarefa.prazoLimite.split("-")[0];
      if (year.length !== 4 || !/^\d{4}$/.test(year)) {
        setDataError("O ano deve ser um número de 4 dígitos (ex.: 2025).");
        setErros((prevErros) => ({ ...prevErros, prazoLimite: true }));
        return;
      }
      const yearNum = parseInt(year, 10);
      if (yearNum < 1900 || yearNum > 9999) {
        setDataError("O ano deve estar entre 1900 e 9999.");
        setErros((prevErros) => ({ ...prevErros, prazoLimite: true }));
        return;
      }
    }

    if (!validarCampos()) {
      setMensagemErro("Por favor, preencha todos os campos obrigatórios corretamente.");
      return;
    }

    try {
      const prazoCompleto = novaTarefa.prazoLimite && novaTarefa.prazoHora
        ? `${novaTarefa.prazoLimite}T${novaTarefa.prazoHora}:00`
        : null;

      const novaTarefaComData = {
        nomeTarefa: novaTarefa.nomeTarefa,
        descricao: novaTarefa.descricao,
        status: novaTarefa.status,
        prioridade: novaTarefa.prioridade,
        prazoLimite: prazoCompleto,
        dataCriacao: new Date().toISOString(),
        responsaveisId: novaTarefa.responsaveisId,
        responsaveisNome: novaTarefa.responsaveisNome,
      };


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
      

      setShowModal(false);
      setNovaTarefa({
        nomeTarefa: "",
        descricao: "",
        status: true,
        prioridade: "baixa",
        prazoLimite: "",
        prazoHora: "",
        responsaveisId: [],
        responsaveisNome: [],
      });
      setErros({});
      setDataError("");

      if (carregarTarefas) {
        await carregarTarefas(true);
      }
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      setMensagemErro(`Erro ao cadastrar tarefa: ${error.message}`);
    }
  };

  // Verificar se todos os campos estão preenchidos
  const isFormValido = () => {
    return (
      novaTarefa.nomeTarefa.trim() &&
      novaTarefa.descricao.trim() &&
      novaTarefa.prioridade &&
      novaTarefa.prazoLimite &&
      !erros.prazoLimite &&
      novaTarefa.prazoHora &&
      novaTarefa.responsaveisId.length > 0
    );
  };

  return (
    <div>
      <BotaoCriar onClick={abrirModal}>Criar Tarefa</BotaoCriar>

      {showModal && (
        <ModalOverlay onClick={fecharModal}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <BotaoFechar onClick={fecharModal}>X</BotaoFechar>
            <TarefaCriacaoModal>
              <ModalTitulo>Criar Nova Tarefa</ModalTitulo>

              {mensagemErro && <MensagemErro>{mensagemErro}</MensagemErro>}

              <DetalheItem>
                <Label>
                  Nome: <span className={erros.nomeTarefa ? "required" : ""}></span>
                </Label>
                <Input
                  type="text"
                  name="nomeTarefa"
                  value={novaTarefa.nomeTarefa}
                  onChange={handleChange}
                  error={erros.nomeTarefa}
                />
              </DetalheItem>

              <DetalheItem>
                <Label>
                  Descrição: <span className={erros.descricao ? "required" : ""}></span>
                </Label>
                <Input
                  type="text"
                  name="descricao"
                  value={novaTarefa.descricao}
                  onChange={handleChange}
                  error={erros.descricao}
                />
              </DetalheItem>

              <DetalheItem>
                <Label>
                  Prioridade: <span className={erros.prioridade ? "required" : ""}></span>
                </Label>
                <Select
                  name="prioridade"
                  value={novaTarefa.prioridade}
                  onChange={handleChange}
                  error={erros.prioridade}
                >
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </Select>
              </DetalheItem>

              <DetalheItem>
                <Label>
                  Prazo: <span className={erros.prazoLimite || erros.prazoHora ? "required" : ""}></span>
                </Label>
                <div style={{ width: "100%" }}>
                  <PrazoContainer>
                    <Input
                      type="date"
                      name="prazoLimite"
                      value={novaTarefa.prazoLimite}
                      onChange={handleDataChange}
                      onBlur={handleDataBlur}
                      error={erros.prazoLimite}
                      style={{ flex: 1 }}
                    />
                    <Input
                      type="time"
                      name="prazoHora"
                      value={novaTarefa.prazoHora}
                      onChange={handleChange}
                      error={erros.prazoHora}
                      style={{ flex: 1 }}
                    />
                  </PrazoContainer>
                  {dataError && <MensagemErro>{dataError}</MensagemErro>}
                </div>
              </DetalheItem>

              <DetalheItem>
                <Label>
                  Responsáveis: <span className={erros.responsaveis ? "required" : ""}></span>
                </Label>
                <div style={{ width: "100%" }}>
                  <DropdownContainer>
                    <DropdownButton
                      onClick={() => setDropdownAberto(!dropdownAberto)}
                      error={erros.responsaveis}
                    >
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

              <BotaoSalvar onClick={handleCriarTarefa} disabled={!isFormValido()}>
                Criar Tarefa
              </BotaoSalvar>
            </TarefaCriacaoModal>
          </ModalContainer>
        </ModalOverlay>
      )}
    </div>
  );
};

export default CriarTarefa;