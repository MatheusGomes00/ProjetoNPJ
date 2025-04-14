// DetalhesClientes.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import useAuth from "../Seguranca/UseAuth";

// Estilo do contêiner principal (reutilizando o mesmo estilo de ClientesMain)
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
  }
`;

// Estilo do cabeçalho
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
`;

// Estilo do título
const Titulo = styled.h1`
  font-family: "Arial", sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
`;

// Estilo do botão de voltar
const BotaoVoltar = styled.button`
  padding: 10px 20px;
  background-color: #6c757d;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #5a6268;
  }
`;

// Estilo do contêiner de detalhes
const DetalhesContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(200, 210, 230, 0.3);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

// Estilo para os campos de informação
const InfoCampo = styled.div`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #2c3e50;
  display: flex;
  gap: 10px;
  align-items: center;

  & > strong {
    font-weight: 600;
    color: #1e3c72;
  }
`;

// Estilo para mensagens de erro ou carregamento
const Mensagem = styled.p`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin: 20px 0;
`;

const DetalhesClientes = () => {
  const { id } = useParams(); // Pega o ID da URL
  const { fetchAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [hasFetched, setHasFetched] = useState(false); // Novo estado para controlar se a busca já foi feita

  // Função para buscar os dados do cliente pelo ID
  useEffect(() => {
    const buscarClientePorId = async () => {
      // Evitar múltiplas requisições se já buscamos os dados
      if (hasFetched) return;

      setIsLoading(true);
      setMensagemErro("");
      setHasFetched(true); // Marca que a busca foi iniciada

      try {
        const response = await fetchAuthenticated(`http://localhost:8080/cad/get`, {
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

        const data = await response.json();
        const clienteSelecionado = data.find((c) => c.id === id); // Filtra o cliente pelo ID

        if (!clienteSelecionado) {
          throw new Error("Cliente não encontrado.");
        }

        setCliente(clienteSelecionado);
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        setMensagemErro(error.message || "Erro ao carregar os dados do cliente.");
      } finally {
        setIsLoading(false);
      }
    };

    buscarClientePorId();
  }, [id, fetchAuthenticated]); // Mantemos as dependências, mas controlamos a execução com hasFetched

  // Função para voltar à tela anterior
  const handleVoltar = () => {
    navigate("/clientes");
  };

  return (
    <ComponentesFixos>
      <MainContainer>
        <Header>
          <Titulo>Detalhes do Cliente</Titulo>
          <BotaoVoltar onClick={handleVoltar}>Voltar</BotaoVoltar>
        </Header>

        {isLoading ? (
          <Mensagem>Carregando dados do cliente...</Mensagem>
        ) : mensagemErro ? (
          <Mensagem>{mensagemErro}</Mensagem>
        ) : cliente ? (
          <DetalhesContainer>
            <InfoCampo>
              <strong>Nome:</strong> {cliente.cliente.nome || "Não informado"}
            </InfoCampo>
            <InfoCampo>
              <strong>Status:</strong> {cliente.status ? "Ativo" : "Inativo"}
            </InfoCampo>
            <InfoCampo>
              <strong>CPF:</strong> {cliente.cliente.cpf || "Não informado"}
            </InfoCampo>
            <InfoCampo>
              <strong>Endereço:</strong>{" "}
              {cliente.cliente.endereco
                ? `${cliente.cliente.endereco.rua}, ${cliente.cliente.endereco.numero}, ${cliente.cliente.endereco.bairro}, ${cliente.cliente.endereco.cidade} - CEP: ${cliente.cliente.endereco.cep}`
                : "Não informado"}
            </InfoCampo>
            <InfoCampo>
              <strong>Telefone:</strong>{" "}
              {cliente.cliente.contato?.telefone || "Não informado"}
            </InfoCampo>
            <InfoCampo>
              <strong>Celular:</strong>{" "}
              {cliente.cliente.contato?.celular || "Não informado"}
            </InfoCampo>
            <InfoCampo>
              <strong>Email:</strong>{" "}
              {cliente.cliente.contato?.email || "Não informado"}
            </InfoCampo>
            <InfoCampo>
              <strong>Representante:</strong>{" "}
              {cliente.representante?.nome || "Não informado"}
            </InfoCampo>
            <InfoCampo>
              <strong>CPF do Representante:</strong>{" "}
              {cliente.representante?.cpf || "Não informado"}
            </InfoCampo>
          </DetalhesContainer>
        ) : (
          <Mensagem>Cliente não encontrado.</Mensagem>
        )}
      </MainContainer>
    </ComponentesFixos>
  );
};

export default DetalhesClientes;