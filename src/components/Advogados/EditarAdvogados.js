import React, { useState, useEffect } from "react";
import useAuth from "../Seguranca/UseAuth";
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  SectionTitle,
  FormRow,
  FormLabel,
  FormInput,
  FormSelect,
  Mensagem,
  Popup,
} from './EditarStyles';


const FormInputPassword = ({ label, name, value, onChange, showPassword, toggleShowPassword }) => (
  <FormRow>
    <FormLabel>{label}</FormLabel>
    <TextField
      type={showPassword ? 'text' : 'password'}
      name={name}
      value={value}
      onChange={onChange}
      variant="outlined"
      size="small"
      sx={{
        flex: 1,
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          fontFamily: '"Arial", sans-serif',
          fontSize: '16px',
          color: '#333',
          '&:hover fieldset': {
            borderColor: '#007bff',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#007bff',
          },
        },
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={toggleShowPassword}
              edge="end"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  </FormRow>
);


const EditarAdvogados = ({ fetchAuthenticated, id, navigate, onSave, setIsSaving }) => {
  const [, setAdvogado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  const { getRole, getId } = useAuth(); 
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [repeteSenha, setRepeteSenha] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showRepeteSenha, setShowRepeteSenha] = useState(false);

  // Função para lidar com a mudança nos campos de senha
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'novaSenha') {
      setNovaSenha(value);
    } else if (name === 'repeteSenha') {
      setRepeteSenha(value);
    }
    setPasswordError(''); // Limpa erro ao digitar
  };

  // Função para validar e salvar a nova senha
  const handleAlterarSenha = async () => {
    if (!novaSenha || !repeteSenha) {
      setPasswordError('Senha e Repetir Senha precisam ser preenchidos.');
      return;
    }
    if (novaSenha !== repeteSenha) {
      setPasswordError('As senhas não conferem.');
      return;
    }

    setIsLoading(true);
    setPasswordError('');

    try {
      const response = await fetchAuthenticated(
        `${process.env.REACT_APP_API_URL}adv/upd`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            novaSenha,
            repeteSenha,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        throw new Error(`Erro ao atualizar senha: ${response.status}`);
      }

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
      setNovaSenha('');
      setRepeteSenha('');
      setShowPasswordFields(false);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      setPasswordError(error.message || 'Erro ao alterar a senha.');
    } finally {
      setIsLoading(false);
    }
  };

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
          senha: '',
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
      ...(formData.senha && { senha: formData.senha }),
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
        senha: '',
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
        {(getId() === id || getRole() === 'ADVOGADO') && (
          <>
            <FormRow>
              <FormLabel>Alterar Senha</FormLabel>
              <button
                type="button"
                onClick={() => setShowPasswordFields(!showPasswordFields)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {showPasswordFields ? 'Ocultar' : 'Alterar Senha'}
              </button>
            </FormRow>
            {showPasswordFields && (
              <>
                <FormInputPassword
                  label="Nova Senha"
                  name="novaSenha"
                  value={novaSenha}
                  onChange={handlePasswordChange}
                  showPassword={showNovaSenha}
                  toggleShowPassword={() => setShowNovaSenha(!showNovaSenha)}
                />
                <FormInputPassword
                  label="Repetir Senha"
                  name="repeteSenha"
                  value={repeteSenha}
                  onChange={handlePasswordChange}
                  showPassword={showRepeteSenha}
                  toggleShowPassword={() => setShowRepeteSenha(!showRepeteSenha)}
                />
                {passwordError && (
                  <FormRow>
                    <Mensagem style={{ color: 'red', marginLeft: '150px' }}>
                      {passwordError}
                    </Mensagem>
                  </FormRow>
                )}
                <FormRow>
                  <FormLabel />
                  <button
                    type="button"
                    onClick={handleAlterarSenha}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Salvar Senha
                  </button>
                </FormRow>
              </>
            )}
          </>
        )}
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