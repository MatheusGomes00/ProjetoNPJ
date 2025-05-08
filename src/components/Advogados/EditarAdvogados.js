import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Estilo do título da seção
const SectionTitle = styled.h3`
  font-family: "Arial", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #1e3c72;
  margin: 0 0 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e0e4e8;
  grid-column: span 2;

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

// Estilo para os campos de formulário
const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
`;

const FormLabel = styled.label`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #1e3c72;
  width: 120px;
  margin-right: 10px;

  @media (max-width: 480px) {
    width: 100%;
    margin-right: 0;
  }
`;

const FormInput = styled.input`
  flex: 1;
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

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const FormSelect = styled.select`
  flex: 1;
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

  @media (max-width: 480px) {
    width: 100%;
  }
`;

// Estilo para mensagens
const Mensagem = styled.p`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin: 20px 0;
  grid-column: span 2;

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

// Estilo para o pop-up de feedback
const Popup = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #28a745;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  animation: fadeInOut 2s ease-in-out;

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    10% {
      opacity: 1;
      transform: translateY(0);
    }
    90% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
`;

const EditarAdvogados = ({ fetchAuthenticated, id, navigate, onSave, setIsSaving }) => {
  const [advogado, setAdvogado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  // Buscar dados do advogado
  useEffect(() => {
    const buscarAdvogadoPorId = async () => {
      if (hasFetched) return;

      setIsLoading(true);
      setMensagemErro("");
      setHasFetched(true);

      try {
        const response = await fetchAuthenticated(`${API_URL}adv/buscar/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Cliente não encontrado.");
          } else if (response.status === 401) {
            throw new Error("Sessão expirada. Faça login novamente.");
          }
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const advogadoSelecionado = await response.json();

        if (!advogadoSelecionado) {
          throw new Error("Advogado não encontrado.");
        }

        setAdvogado(advogadoSelecionado);
        setFormData({
          nome: advogadoSelecionado.nome || "",
          cpf: advogadoSelecionado.cpf || "",
          status: advogadoSelecionado.status || false,
          datanasc: advogadoSelecionado.datanasc || "",
          registroOab: advogadoSelecionado.registroOab || "",
          secaoOab: advogadoSelecionado.secaoOab || "",
          role: advogadoSelecionado.role || "",
        });
      } catch (error) {
        console.error("Erro ao buscar advogado:", error);
        setMensagemErro(error.message || "Erro ao carregar os dados do advogado.");
      } finally {
        setIsLoading(false);
      }
    };

    buscarAdvogadoPorId();
  }, [id, fetchAuthenticated, hasFetched, API_URL]);

  // Lidar com mudanças nos inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Lidar com mudança no status
  const handleStatusChange = (e) => {
    const value = e.target.value === "true";
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  // Salvar alterações
  const handleSalvar = async () => {
    setIsLoading(true);
    setMensagemErro('');
    onSave();
  
    const updatedAdvogado = {
      nome: formData.nome,
      cpf: formData.cpf,
      status: formData.status,
      datanasc: formData.datanasc,
      registroOab: formData.registroOab,
      secaoOab: formData.secaoOab,
      role: formData.role,
    };
  
    try {
      const response = await fetchAuthenticated(
        `${process.env.REACT_APP_API_URL}adv/upd/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedAdvogado),
        }
      );
  
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        throw new Error(`Erro ao atualizar advogado: ${response.status}`);
      }
  
      // const updatedData = await response.json();
      setAdvogado(updatedAdvogado);
      setFormData({
        nome: updatedAdvogado.nome || '',
        cpf: updatedAdvogado.cpf || '',
        status: updatedAdvogado.status || false,
        datanasc: updatedAdvogado.datanasc || '',
        registroOab: updatedAdvogado.registroOab || '',
        secaoOab: updatedAdvogado.secaoOab || '',
        role: updatedAdvogado.role || '',
      });
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar advogado:', error);
      setMensagemErro(error.message || 'Erro ao salvar as alterações.');
    } finally {
      setIsLoading(false);
      setIsSaving(false);
    }
  };

  return (
    <>
      {isLoading && !formData.nome ? (
        <Mensagem>Carregando dados do advogado...</Mensagem>
      ) : mensagemErro ? (
        <Mensagem>{mensagemErro}</Mensagem>
      ) : formData.nome ? (
        <>
          <SectionTitle>Informações Pessoais</SectionTitle>
          <FormRow>
            <FormLabel>Nome</FormLabel>
            <FormInput
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
            />
          </FormRow>
          <FormRow>
            <FormLabel>CPF</FormLabel>
            <FormInput
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
            />
          </FormRow>
          <FormRow>
          <FormLabel>Data de Nascimento</FormLabel>
          <FormInput
            type="date"
            name="datanasc"
            value={formData.datanasc}
            onChange={handleInputChange}
          />
          </FormRow>
        {formData.role === 'ADVOGADO' && (
          <>
            <FormRow>
              <FormLabel>Registro OAB</FormLabel>
              <FormInput
                type="text"
                name="registroOab"
                value={formData.registroOab}
                onChange={handleInputChange}
              />
            </FormRow>
            <FormRow>
              <FormLabel>Seção OAB</FormLabel>
              <FormInput
                type="text"
                name="secaoOab"
                value={formData.secaoOab}
                onChange={handleInputChange}
              />
            </FormRow>
          </>
        )}
        <FormRow>
          <FormLabel>Cargo</FormLabel>
          <FormInput
            type="text"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          />
        </FormRow>
        <FormRow>
          <FormLabel>Status</FormLabel>
          <FormSelect
            name="status"
            value={formData.status.toString()}
            onChange={handleStatusChange}
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </FormSelect>
        </FormRow>
        <button id="save-advogado" onClick={handleSalvar} style={{ display: 'none' }} />
      </>
      ) : (
        <Mensagem>Advogado não encontrado.</Mensagem>
      )}

      {showPopup && <Popup>Alterações Salvas</Popup>}
    </>
  );
};

export default EditarAdvogados;