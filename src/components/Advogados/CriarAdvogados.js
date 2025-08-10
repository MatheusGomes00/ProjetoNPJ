import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import useAuth from "../Seguranca/UseAuth";
import {
    MainContainer,
    Header,
    Titulo,
    BotoesContainer,
    BotaoSalvar,
    BotaoCancelar,
    Section,
    SectionTitle,
    FormRow,
    FormLabel,
    FormInput,
    FormSelect,
    MensagemErro,
    Toast,
  } from "./CriarStyles";


const CriarAdvogado = () => {
  const navigate = useNavigate();
  const { fetchAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    status: true,
    nome: "",
    cpf: "",
    datanasc: "",
    registroOab: "",
    secaoOab: "",
    role: "",
    senha: "",
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

    const validarCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (cpf.length !== 11) return false;
        if (/^(\d)\1+$/.test(cpf)) return false; // Verifica dígitos repetidos
      
        let soma = 0;
        for (let i = 0; i < 9; i++) {
          soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;
      
        soma = 0;
        for (let i = 0; i < 10; i++) {
          soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10))) return false;
      
        return true;
    };

    // Validações no handleSalvar (ou função equivalente)
    if (!formData.nome || formData.nome.trim().length < 3) {
    setMensagemErro('O campo Nome é obrigatório e deve ter pelo menos 3 caracteres.');
    return;
    }
    
    if (!formData.cpf || !validarCPF(formData.cpf)) {
    setMensagemErro('O campo CPF é obrigatório e deve ser um CPF válido.');
    return;
    }
    
    if (!formData.datanasc) {
    setMensagemErro('O campo Data de Nascimento é obrigatório.');
    return;
    }

    if (formData.role === 'ADVOGADO') {
        if (!formData.registroOab || formData.registroOab.trim().length < 6) {
          setMensagemErro('O campo Registro OAB é obrigatório para advogados e deve ter pelo menos 6 caracteres.');
          return;
        }
        if (!formData.secaoOab || !/^[A-Z]{2}$/.test(formData.secaoOab)) {
          setMensagemErro('O campo Seção OAB é obrigatório para advogados e deve ser uma UF válida (ex.: SP, RJ).');
          return;
        }
    }

    if (!formData.role || !['ADVOGADO', 'ESTAGIARIO'].includes(formData.role)) {
        setMensagemErro('O campo Cargo é obrigatório e deve ser "ADVOGADO" ou "ESTAGIARIO".');
        return;
    }
      
    if (!formData.senha || formData.senha.length < 8) {
        setMensagemErro('A senha é obrigatória e deve ter pelo menos 8 caracteres.');
        return;
    }

    const formattedFormData = {
        status: formData.status === "Ativo" ? true : false,
        nome: formData.nome.trim(),
        cpf: formData.cpf.replace(/\D/g, ''),
        datanasc: formData.datanasc,
        registroOab: formData.registroOab || null,
        secaoOab: formData.secaoOab || null,
        role: formData.role.toUpperCase(),
        senha: formData.senha,
    };

    //console.log(JSON.stringify(formData))

    try {
      const response = await fetchAuthenticated('/adv/ins', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedFormData),
      });

      if (!response.ok) {
        let errorMessage = "Erro ao cadastrar advogado. Tente novamente.";
        if (response.status === 400 || response.status === 500) {
          const errorData = await response.json().catch(() => ({}));
          errorMessage = errorData.message || `Erro na requisição: ${response.status}`;
        } else if (response.status === 401) {
          errorMessage = "Sessão expirada. Faça login novamente.";
        } else if (response.status === 409) {
            errorMessage = "CPF já cadastrado."
        }
        setMensagemErro(errorMessage);
        return;
      }

      const createdCliente = await response.json();
      const advogadoId = createdCliente.id;

      if (!advogadoId) {
        setMensagemErro(
          "Advogado criado, mas ID não retornado. Redirecionando para lista de clientes."
        );
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate("/advogados");
        }, 2000);
        return;
      }

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate(`/advogados/${advogadoId}`);
      }, 2000);
    } catch (error) {
      console.error("Erro ao cadastrar advogado:", error);
      setMensagemErro(error.message || "Erro ao cadastrar advogado. Tente novamente.");
    }
  };

  return (
    <ComponentesFixos>
      <MainContainer>
        <Header>
          <Titulo>Criar Novo Advogado</Titulo>
          <BotoesContainer>
            <BotaoSalvar onClick={handleSubmit}>Salvar</BotaoSalvar>
            <BotaoCancelar onClick={() => navigate("/advogados")}>
              Cancelar
            </BotaoCancelar>
          </BotoesContainer>
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
            </FormSelect>
          </FormRow>
          <FormRow>
            <FormLabel>Nome *</FormLabel>
            <FormInput
              type="text"
              value={formData.nome}
              onChange={(e) => updateFormData(null, "nome", e.target.value)}
              required
            />
          </FormRow>
          <FormRow>
            <FormLabel>CPF *</FormLabel>
            <FormInput
              type="text"
              value={formData.cpf}
              onChange={(e) => updateFormData(null, "cpf", e.target.value)}
              required
            />
          </FormRow>
          <FormRow>
            <FormLabel>Data de Nascimento *</FormLabel>
            <FormInput
              type="date"
              value={formData.datanasc}
              onChange={(e) => updateFormData(null, "datanasc", e.target.value)}
              required
            />
          </FormRow>
          <FormRow>
            <FormLabel>Cargo *</FormLabel>
            <FormSelect
              name="role"
              value={formData.role}
              onChange={(e) => updateFormData(null, "role", e.target.value)}
              required
            >
              <option value="">Selecione</option>
              <option value="ADVOGADO">Advogado</option>
              <option value="ESTAGIARIO">Estagiário</option>
            </FormSelect>
          </FormRow>
          {formData.role === 'ADVOGADO' && (
            <>
              <FormRow>
                <FormLabel>Registro OAB *</FormLabel>
                <FormInput
                  type="text"
                  name="registroOab"
                  value={formData.registroOab}
                  onChange={(e) => updateFormData(null, "registroOab", e.target.value)}
                  required
                />
              </FormRow>
              <FormRow>
                <FormLabel>Seção OAB *</FormLabel>
                <FormInput
                  type="text"
                  name="secaoOab"
                  value={formData.secaoOab}
                  onChange={(e) => updateFormData(null, "secaoOab", e.target.value)}
                  required
                />
              </FormRow>
            </>
          )}
          <FormRow>
            <FormLabel>Senha *</FormLabel>
            <FormInput
              type="password"
              name="senha"
              value={formData.senha}
              onChange={(e) => updateFormData(null, "senha", e.target.value)}
              required
            />
          </FormRow>
        </Section>
        {showToast && <Toast>Advogado cadastrado!</Toast>}
      </MainContainer>
    </ComponentesFixos>
  );
};

export default CriarAdvogado;