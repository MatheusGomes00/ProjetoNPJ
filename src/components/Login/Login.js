import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { login, isAuthenticated } from "../Seguranca/GerenciaToken";
import { motion } from 'framer-motion';

// Container principal que centraliza o conteúdo
const LoginContainer = styled.div`
  display: flex;
  flex-direction: colum;
  justify-content: center;
  align-items: center;
  min-height: 100vh; 
  background-color: #f4f7fa; 
  padding: 20px; 
  gap: 1rem;
`;

const Title = styled.h2`
  color: #333;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
`;

// Card que contém o formulário
const LoginCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px; 
  display: flex;
  flex-direction: column;
  gap: 10px; 
  align-items: center;
  box-sizing: border-box;
`;

// Estilo para a mensagem de erro
const ErrorMessage = styled(motion.p)`
  color: #d32f2f; 
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px; 
  width: 100%;
  align-items: center;
`;

// Estilo para os campos de entrada
const Input = styled.input`
  width: 100%;
  max-width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box;

  &:focus {
    border-color: #1976d2; /* Azul ao focar */
  }
`;

// Estilo para o botão
const LoginButton = styled.button`
  width: 100%;
  max-width: 100%;
  padding: 0.75rem;
  background-color: #1976d2; /* Azul primário */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  box-sizing: border-box;

  &:hover {
    background-color: #1565c0; /* Azul mais escuro no hover */
  }

  &:disabled {
    background-color: #b0bec5; /* Cinza quando desabilitado */
    cursor: not-allowed;
  }
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError(null);
    try {
      
      await login(username, password);
      
      if (isAuthenticated()) {
        
        navigate("/workspace", {replace: true});
        setTimeout(() => {
          if (window.location.pathname !== "/workspace") {
            console.log("navigate falhou, usando window.location");
            window.location.href = "/workspace";
          }
        }, 100);
      } else {
        throw new Error("Credenciais inválidas ou falha na autenticação.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro no login:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000); // = 3 segundos
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <LoginContainer>
      <Title>NPJ ANHANGUERA</Title>
      <LoginCard>
        {error && (
          <ErrorMessage
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </ErrorMessage>
        )}
        <Form onSubmit={handleLogin}>
          <Input
              type="text"
              placeholder="CPF"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
          />
          <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
          />
          <LoginButton type="submit" disabled={loading}>
              {loading ? 'Carregando...' : 'Entrar'}
          </LoginButton>
        </Form>  
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
