import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import useAuth from "../Seguranca/UseAuth";
import { useAuthContext } from '../Seguranca/AuthContext';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 34px;
  width: calc(100% - 34px);
  min-height: 100vh;
  background: #f4f7fa;
  padding: 30px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    padding: 20px;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #fff;
`;

const Titulo = styled.h1`
  font-family: "Arial", sans-serif;
  font-size: 28px;
  font-weight: 700;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const BotaoSalvar = styled.button`
  padding: 10px 20px;
  background:rgb(18, 224, 28);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const BotaoCancelar = styled.button`
  padding: 10px 20px;
  background: #fff;
  color: #dc3545;
  border: 2px solid #dc3545;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #dc3545;
    color: #fff;
  }

  &:disabled {
    background: #f8f9fa;
    color: #6c757d;
    border-color: #6c757d;
    cursor: not-allowed;
  }
`;

const Section = styled.section`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const SectionTitle = styled.h2`
  font-family: "Arial", sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 15px 0;
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const FormLabel = styled.label`
  font-weight: 600;
  color: #555;
  font-size: 16px;
  width: 40%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FormInput = styled.input`
  width: 60%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  font-family: "Arial", sans-serif;
  color: #333;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FormSelect = styled.select`
  width: 60%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  font-family: "Arial", sans-serif;
  color: #333;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DropdownContainer = styled.div`
  width: 60%;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  font-family: "Arial", sans-serif;
  color: #333;
  background: #fff;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #007bff;
  }

  &:focus {
    border-color: #007bff;
    outline: none;
  }

  &:disabled {
    background: #f8f9fa;
    color: #6c757d;
    border-color: #6c757d;
    cursor: not-allowed;
  }
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  padding: 10px;
`;

const DropdownItem = styled.label`
  display: flex;
  align-items: center;
  padding: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }

  input[type="checkbox"] {
    margin-right: 8px;
    accent-color: #007bff;
  }
`;

const ResponsaveisList = styled.div`
  width: 60%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ResponsavelTag = styled.div`
  display: flex;
  align-items: center;
  background: #e9ecef;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 14px;
  color: #333;

  button {
    background: #dc3545;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
    cursor: pointer;
    font-size: 12px;

    &:hover {
      background: #c82333;
    }
  }
`;

const MensagemErro = styled.p`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #dc3545;
  text-align: center;
  margin: 20px 0;
`;

const Toast = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #28a745;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-family: "Arial", sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease, slideOut 0.3s ease 1.7s forwards;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(100%);
    }
  }
`;

const CriarProcessosCliente = () => {
  const { fetchAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { clientId, clientName } = location.state || {};

  const [formData, setFormData] = useState({
    situacao: "INICIADO",
    numeroProcesso: "",
    pasta: "",
    tipoAcaoClasse: "",
    requerente: "",
    representanteLegal: "",
    requerido: "",
    npjRepresentando: "",
    vara: "",
    valorCausa: "",
    responsaveis: [],
    responsaveisNome: [],
    clienteId: clientId ? [String(clientId)] : [],
    clienteNome: clientName ? [clientName] : [],
  });
  const [clientes, setClientes] = useState([]);
  const [advogados, setAdvogados] = useState([]);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [dropdownClientesAberto, setDropdownClientesAberto] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [hasFetchedAdvogados, setHasFetchedAdvogados] = useState(false);
  const [hasFetchedClientes, setHasFetchedClientes] = useState(false);
  const { isSessionInvalid } = useAuthContext(); // Verifica se a sessão é inválida

  const fetchClientes = useCallback(async () => {
    if (hasFetchedClientes) return;

    try {
      setIsLoading(true);
      const response = await fetchAuthenticated("/cad/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar clientes.");
      }

      const data = await response.json();
      setClientes(data);
      setHasFetchedClientes(true);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setMensagemErro("Erro ao carregar lista de clientes.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchAuthenticated, hasFetchedClientes]);

  const fetchClientName = useCallback(async () => {
    if (!clientId || clientName) return;

    try {
      setIsLoading(true);
      const response = await fetchAuthenticated("/cad/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar cliente.");
      }

      const data = await response.json();
      const clienteSelecionado = data.find((c) => String(c.id) === String(clientId));

      if (!clienteSelecionado) {
        throw new Error("Cliente não encontrado.");
      }

      setFormData((prev) => ({
        ...prev,
        clienteId: [String(clientId)],
        clienteNome: [clienteSelecionado.cliente.nome],
      }));
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      setMensagemErro("Erro ao carregar os dados do cliente.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchAuthenticated, clientId, clientName]);

  const fetchAdvogados = useCallback(async () => {
    if (hasFetchedAdvogados) return;

    try {
      setIsLoading(true);
      const response = await fetchAuthenticated("/adv/buscarTodos", {
        method: "GET",
      });
      if (!response.ok) throw new Error("Erro ao buscar advogados");
      const data = await response.json();
      setAdvogados(Array.isArray(data) ? data.filter((adv) => adv.id != null) : []);
      setHasFetchedAdvogados(true);
    } catch (error) {
      console.error("Erro ao buscar advogados:", error);
      setAdvogados([]);
      setMensagemErro("Erro ao carregar lista de advogados.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchAuthenticated, hasFetchedAdvogados]);

  useEffect(() => {
    if (isSessionInvalid) return; // Verifica se a sessão é inválida
    fetchAdvogados();
    if (!clientId) {
      fetchClientes();
    } else {
      fetchClientName();
    }
  }, [fetchAdvogados, fetchClientes, fetchClientName, clientId, isSessionInvalid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClienteChange = (cliente) => {
    setFormData((prev) => ({
      ...prev,
      clienteId: cliente.id ? [String(cliente.id)] : [],
      clienteNome: cliente.cliente?.nome ? [cliente.cliente.nome] : [],
    }));
    setDropdownClientesAberto(false);
  };

  const toggleSelecionarAdvogado = (advogado) => {
    if (!advogado.id) {
      console.warn("Advogado sem ID:", advogado);
      return;
    }
    setFormData((prev) => {
      const isSelected = prev.responsaveis.some((resp) => resp.id === advogado.id);
      if (isSelected) {
        return {
          ...prev,
          responsaveis: prev.responsaveis.filter((resp) => resp.id !== advogado.id),
          responsaveisNome: prev.responsaveisNome.filter((_, i) => prev.responsaveis[i].id !== advogado.id),
        };
      } else {
        return {
          ...prev,
          responsaveis: [...prev.responsaveis, { id: advogado.id }],
          responsaveisNome: [...prev.responsaveisNome, advogado.nome],
        };
      }
    });
  };

  const removerResponsavel = (id) => {
    setFormData((prev) => ({
      ...prev,
      responsaveis: prev.responsaveis.filter((resp) => resp.id !== id),
      responsaveisNome: prev.responsaveisNome.filter((_, i) => prev.responsaveis[i].id !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clienteId.length || !formData.numeroProcesso || !formData.responsaveis.length ) {
        setMensagemErro("Campos obrigatórios: Cliente, Número do Processo e Responsáveis.");
        return;
    }

    const responsaveisIds = formData.responsaveis.map((resp) => String(resp.id));
    if (responsaveisIds.some((id) => !id)) {
      const invalidIds = responsaveisIds.filter((id) => !id);
      setMensagemErro(`IDs dos responsáveis inválidos: ${invalidIds.join(", ")}`);
      return;
    }

    if(!formData.situacao) {
      setMensagemErro("O campo situação é obrigatório.");
      return;
    }

    const payload = {
      ...formData,
      responsaveisId: responsaveisIds,
      clienteId: formData.clienteId,
      responsaveis: undefined,
      cliente: undefined,
    };

    setIsLoading(true);
    setMensagemErro("");
    try {
      const response = await fetchAuthenticated("/proc/newProc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Erro na requisição: ${response.status} - ${
            errorData.message || errorData.error || "Sem detalhes"
          }`
        );
      }

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate(formData.clienteId.length ? `/clientes/${formData.clienteId[0]}` : "/processos");
      }, 2000);
    } catch (error) {
      console.error("Erro ao criar processo:", error);
      setMensagemErro(`Erro ao criar processo: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ComponentesFixos>
      <MainContainer>
        <Header>
          <Titulo>Criar Novo Processo</Titulo>
          <div>
            <BotaoSalvar onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Criando..." : "Salvar"}
            </BotaoSalvar>
            <BotaoCancelar
              onClick={() => navigate(formData.clienteId.length ? `/clientes/${formData.clienteId[0]}` : "/processos")}
              disabled={isLoading}
            >
              Cancelar
            </BotaoCancelar>
          </div>
        </Header>

        {mensagemErro && <MensagemErro>{mensagemErro}</MensagemErro>}

        <Section>
          <SectionTitle>Informações Gerais</SectionTitle>
          <FormRow>
            <FormLabel>Cliente *</FormLabel>
            {clientId ? (
              <FormInput value={formData.clienteNome[0] || ""} disabled />
            ) : (
              <DropdownContainer>
                <DropdownButton
                  onClick={() => setDropdownClientesAberto(!dropdownClientesAberto)}
                  disabled={isLoading}
                >
                  {formData.clienteNome[0] || "Selecione um Cliente"} <span>▼</span>
                </DropdownButton>
                {dropdownClientesAberto && (
                  <DropdownContent>
                    {clientes.length > 0 ? (
                      clientes.map((cliente) => (
                        <DropdownItem
                          key={cliente.id}
                          onClick={() => handleClienteChange(cliente)}
                        >
                          {cliente.cliente?.nome || "Sem Nome"}
                        </DropdownItem>
                      ))
                    ) : (
                      <p style={{ color: "#7f8c8d", padding: "8px" }}>
                        Nenhum cliente cadastrado
                      </p>
                    )}
                  </DropdownContent>
                )}
              </DropdownContainer>
            )}
          </FormRow>
          <FormRow>
            <FormLabel>Número do Processo *</FormLabel>
            <FormInput
              name="numeroProcesso"
              value={formData.numeroProcesso}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </FormRow>
          <FormRow>
            <FormLabel>Situação *</FormLabel>
            <FormSelect
              name="situacao"
              value={formData.situacao}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="INICIADO">Iniciado</option>
            </FormSelect>
          </FormRow>
          <FormRow>
            <FormLabel>Pasta</FormLabel>
            <FormInput
              name="pasta"
              value={formData.pasta}
              onChange={handleChange}
              disabled={isLoading}
            />
          </FormRow>
        </Section>

        <Section>
          <SectionTitle>Detalhes Legais</SectionTitle>
          <FormRow>
            <FormLabel>Tipo de Ação/Classe</FormLabel>
            <FormInput
              name="tipoAcaoClasse"
              value={formData.tipoAcaoClasse}
              onChange={handleChange}
              disabled={isLoading}
            />
          </FormRow>
          <FormRow>
            <FormLabel>Requerente</FormLabel>
            <FormInput
              name="requerente"
              value={formData.requerente}
              onChange={handleChange}
              disabled={isLoading}
            />
          </FormRow>
          <FormRow>
            <FormLabel>Representante Legal</FormLabel>
            <FormInput
              name="representanteLegal"
              value={formData.representanteLegal}
              onChange={handleChange}
              disabled={isLoading}
            />
          </FormRow>
          <FormRow>
            <FormLabel>Requerido</FormLabel>
            <FormInput
              name="requerido"
              value={formData.requerido}
              onChange={handleChange}
              disabled={isLoading}
            />
          </FormRow>
          <FormRow>
            <FormLabel>NPJ Representando</FormLabel>
            <FormInput
              name="npjRepresentando"
              value={formData.npjRepresentando}
              onChange={handleChange}
              disabled={isLoading}
            />
          </FormRow>
          <FormRow>
            <FormLabel>Vara</FormLabel>
            <FormInput
              name="vara"
              value={formData.vara}
              onChange={handleChange}
              disabled={isLoading}
            />
          </FormRow>
          <FormRow>
            <FormLabel>Valor da Causa</FormLabel>
            <FormInput
              name="valorCausa"
              value={formData.valorCausa}
              onChange={handleChange}
              disabled={isLoading}
            />
          </FormRow>
        </Section>

        <Section>
          <SectionTitle>Responsáveis</SectionTitle>
          <FormRow>
            <FormLabel>Advogados Responsáveis *</FormLabel>
            <DropdownContainer>
              <DropdownButton
                onClick={() => setDropdownAberto(!dropdownAberto)}
                disabled={isLoading}
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
                          checked={formData.responsaveis.some((resp) => resp.id === advogado.id)}
                          onChange={() => toggleSelecionarAdvogado(advogado)}
                          disabled={isLoading || !advogado.id}
                        />
                        {advogado.nome}
                      </DropdownItem>
                    ))
                  ) : (
                    <p style={{ color: "#7f8c8d", padding: "8px" }}>
                      Nenhum advogado cadastrado
                    </p>
                  )}
                </DropdownContent>
              )}
            </DropdownContainer>
          </FormRow>
          {formData.responsaveis.length > 0 && (
            <FormRow>
              <FormLabel></FormLabel>
              <ResponsaveisList>
                {formData.responsaveis.map((resp, index) => (
                  <ResponsavelTag key={resp.id}>
                    <span>{formData.responsaveisNome[index]}</span>
                    <button
                      onClick={() => removerResponsavel(resp.id)}
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </ResponsavelTag>
                ))}
              </ResponsaveisList>
            </FormRow>
          )}
        </Section>

        {showToast && <Toast>Processo Criado</Toast>}
      </MainContainer>
    </ComponentesFixos>
  );
};

export default CriarProcessosCliente;