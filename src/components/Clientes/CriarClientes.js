import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import useAuth from "../Seguranca/UseAuth";

// Estilo do container principal
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

// Estilo do cabeçalho
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

// Estilo do título
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
  background: #007bff;
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
`;

// Estilo das seções
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

const FormCheckbox = styled.input`
  width: auto;
  margin-right: 8px;
`;

const Mensagem = styled.p`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin: 20px 0;
`;

const MensagemErro = styled(Mensagem)`
  color: #dc3545;
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

const CriarClientes = () => {
  const navigate = useNavigate();
  const { fetchAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    status: "Ativo",
    cliente: {
      nome: "",
      cpf: "",
      rg: "",
      ssp: "",
      nascimento: "",
      endereco: {
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        cep: "",
      },
      contato: {
        telefone: "",
        celular: "",
        email: "",
      },
      casaPropria: false,
    },
  });
  const [mensagemErro, setMensagemErro] = useState("");
  const [showToast, setShowToast] = useState(false);

  const updateFormData = (section, field, value, nestedSection, nestedField) => {
    if (nestedSection && nestedField) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [nestedSection]: {
            ...prev[section][nestedSection],
            [nestedField]: value,
          },
        },
      }));
    } else if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagemErro("");

    // Validações básicas no frontend
    if (!formData.cliente.nome) {
      setMensagemErro("O campo Nome é obrigatório.");
      return;
    }
    if (!formData.cliente.cpf) {
      setMensagemErro("O campo CPF é obrigatório.");
      return;
    }
    if (
      !formData.cliente.endereco.rua ||
      !formData.cliente.endereco.numero ||
      !formData.cliente.endereco.bairro ||
      !formData.cliente.endereco.cidade
    ) {
      setMensagemErro(
        "Os campos de endereço (Rua, Número, Bairro, Cidade) são obrigatórios."
      );
      return;
    }

    try {
      const response = await fetchAuthenticated("http://localhost:8080/cad/ins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          setMensagemErro(
            errorData.message || "Erro ao cadastrar cliente. Verifique os dados."
          );
          return;
        } else if (response.status === 401) {
          throw new Error("Sessão expirada. Faça login novamente.");
        }
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const createdCliente = await response.json();
      const clienteId = createdCliente.id;

      if (!clienteId) {
        setMensagemErro(
          "Cliente criado, mas ID não retornado. Redirecionando para lista de clientes."
        );
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate("/clientes");
        }, 2000);
        return;
      }

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate(`/clientes/${clienteId}`);
      }, 2000);
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      setMensagemErro(error.message || "Erro ao cadastrar cliente. Tente novamente.");
    }
  };

  return (
    <ComponentesFixos>
      <MainContainer>
        <Header>
          <Titulo>Criar Novo Cliente</Titulo>
          <div>
            <BotaoSalvar onClick={handleSubmit}>Salvar</BotaoSalvar>
            <BotaoCancelar onClick={() => navigate("/clientes")}>
              Cancelar
            </BotaoCancelar>
          </div>
        </Header>

        {mensagemErro && <MensagemErro>{mensagemErro}</MensagemErro>}

        <Section>
          <SectionTitle>Informações Gerais</SectionTitle>
          <FormRow>
            <FormLabel>Status</FormLabel>
            <FormSelect
              value={formData.status}
              onChange={(e) => updateFormData(null, "status", e.target.value)}
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </FormSelect>
          </FormRow>
          <FormRow>
            <FormLabel>Nome *</FormLabel>
            <FormInput
              type="text"
              value={formData.cliente.nome}
              onChange={(e) => updateFormData("cliente", "nome", e.target.value)}
              required
            />
          </FormRow>
          <FormRow>
            <FormLabel>CPF *</FormLabel>
            <FormInput
              type="text"
              value={formData.cliente.cpf}
              onChange={(e) => updateFormData("cliente", "cpf", e.target.value)}
              required
            />
          </FormRow>
          <FormRow>
            <FormLabel>RG</FormLabel>
            <FormInput
              type="text"
              value={formData.cliente.rg}
              onChange={(e) => updateFormData("cliente", "rg", e.target.value)}
            />
          </FormRow>
          <FormRow>
            <FormLabel>SSP</FormLabel>
            <FormInput
              type="text"
              value={formData.cliente.ssp}
              onChange={(e) => updateFormData("cliente", "ssp", e.target.value)}
            />
          </FormRow>
          <FormRow>
            <FormLabel>Data de Nascimento</FormLabel>
            <FormInput
              type="date"
              value={formData.cliente.nascimento}
              onChange={(e) =>
                updateFormData("cliente", "nascimento", e.target.value)
              }
            />
          </FormRow>
          <FormRow>
            <FormLabel>Casa Própria</FormLabel>
            <FormCheckbox
              type="checkbox"
              checked={formData.cliente.casaPropria}
              onChange={(e) =>
                updateFormData("cliente", "casaPropria", e.target.checked)
              }
            />
          </FormRow>
        </Section>

        <Section>
          <SectionTitle>Endereço</SectionTitle>
          <FormRow>
            <FormLabel>Rua *</FormLabel>
            <FormInput
              type="text"
              value={formData.cliente.endereco.rua}
              onChange={(e) =>
                updateFormData("cliente", null, e.target.value, "endereco", "rua")
              }
              required
            />
          </FormRow>
          <FormRow>
            <FormLabel>Número *</FormLabel>
            <FormInput
              type="text"
              value={formData.cliente.endereco.numero}
              onChange={(e) =>
                updateFormData(
                  "cliente",
                  null,
                  e.target.value,
                  "endereco",
                  "numero"
                )
              }
              required
            />
          </FormRow>
          <FormRow>
            <FormLabel>Complemento</FormLabel>
            <FormInput
              type="text"
              value={formData.cliente.endereco.complemento}
              onChange={(e) =>
                updateFormData(
                  "cliente",
                  null,
                  e.target.value,
                  "endereco",
                  "complemento"
                )
              }
            />
          </FormRow>
          <FormRow>
            <FormLabel>Bairro *</FormLabel>
            <FormInput
              type="text"
              value={formData.cliente.endereco.bairro}
              onChange={(e) =>
                updateFormData(
                  "cliente",
                  null,
                  e.target.value,
                  "endereco",
                  "bairro"
                )
              }
              required
            />
          </FormRow>
          <FormRow>
            <FormLabel>Cidade *</FormLabel>
            <FormInput
              type="text"
              value={formData.cliente.endereco.cidade}
              onChange={(e) =>
                updateFormData(
                  "cliente",
                  null,
                  e.target.value,
                  "endereco",
                  "cidade"
                )
              }
              required
            />
          </FormRow>
          <FormRow>
            <FormLabel>CEP</FormLabel>
            <FormInput
              type="text"
              value={formData.cliente.endereco.cep}
              onChange={(e) =>
                updateFormData("cliente", null, e.target.value, "endereco", "cep")
              }
            />
          </FormRow>
        </Section>

        <Section>
          <SectionTitle>Contato</SectionTitle>
          <FormRow>
            <FormLabel>Telefone</FormLabel>
            <FormInput
              type="text"
              value={formData.cliente.contato.telefone}
              onChange={(e) =>
                updateFormData(
                  "cliente",
                  null,
                  e.target.value,
                  "contato",
                  "telefone"
                )
              }
            />
          </FormRow>
          <FormRow>
            <FormLabel>Celular</FormLabel>
            <FormInput
              type="text"
              value={formData.cliente.contato.celular}
              onChange={(e) =>
                updateFormData(
                  "cliente",
                  null,
                  e.target.value,
                  "contato",
                  "celular"
                )
              }
            />
          </FormRow>
          <FormRow>
            <FormLabel>Email</FormLabel>
            <FormInput
              type="email"
              value={formData.cliente.contato.email}
              onChange={(e) =>
                updateFormData(
                  "cliente",
                  null,
                  e.target.value,
                  "contato",
                  "email"
                )
              }
            />
          </FormRow>
        </Section>

        {showToast && <Toast>Cliente Criado</Toast>}
      </MainContainer>
    </ComponentesFixos>
  );
};

export default CriarClientes;