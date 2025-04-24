import React, { useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import useAuth from "../Seguranca/UseAuth";
import AbaProcessos from "./AbaProcesso";
import EditarClientes from "./EditarClientes";

// Estilo do contêiner principal
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

// Estilo dos botões
const BotaoSalvar = styled.button`
  padding: 10px 20px;
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background: #218838;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const BotaoVoltar = styled.button`
  padding: 10px 20px;
  background: #fff;
  color: #007bff;
  border: 2px solid #007bff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #007bff;
    color: #fff;
  }
`;

// Estilo do contêiner de abas
const AbasContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e4e8;
`;

// Estilo dos botões de aba
const BotaoAba = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => (props.ativo ? "#007bff" : "#f4f7fa")};
  color: ${(props) => (props.ativo ? "#fff" : "#2c3e50")};
  border: none;
  border-radius: 8px 8px 0 0;
  font-family: "Arial", sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.ativo ? "#0056b3" : "#e0e4e8")};
  }
`;

// Estilo do contêiner de detalhes
const DetalhesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e0e4e8;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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

const DetalhesClientes = () => {
  const { id } = useParams();
  const { fetchAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState("informacoes");
  const [isSaving, setIsSaving] = useState(false);

  // Voltar à tela anterior
  const handleVoltar = () => {
    navigate("/clientes");
  };

  return (
    <ComponentesFixos>
      <MainContainer>
        <Header>
          <Titulo>Detalhes do Cliente</Titulo>
          <div style={{ display: "flex", gap: "10px" }}>
            <BotaoSalvar onClick={() => document.getElementById("save-client").click()} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar"}
            </BotaoSalvar>
            <BotaoVoltar onClick={handleVoltar}>Voltar</BotaoVoltar>
          </div>
        </Header>

        <AbasContainer>
          <BotaoAba
            ativo={abaAtiva === "informacoes"}
            onClick={() => setAbaAtiva("informacoes")}
          >
            Informações do Cliente
          </BotaoAba>
          <BotaoAba
            ativo={abaAtiva === "documentos"}
            onClick={() => setAbaAtiva("documentos")}
          >
            Documentos e Arquivos
          </BotaoAba>
          <BotaoAba
            ativo={abaAtiva === "processos"}
            onClick={() => setAbaAtiva("processos")}
          >
            Processos Vinculados
          </BotaoAba>
        </AbasContainer>

        {abaAtiva === "informacoes" && (
          <DetalhesContainer>
            <EditarClientes
              fetchAuthenticated={fetchAuthenticated}
              id={id}
              navigate={navigate}
              onSave={() => setIsSaving(true)}
              setIsSaving={setIsSaving}
            />
          </DetalhesContainer>
        )}
        {abaAtiva === "documentos" && (
          <DetalhesContainer>
            <Mensagem>Seção de Documentos e Arquivos (em desenvolvimento)</Mensagem>
          </DetalhesContainer>
        )}
        {abaAtiva === "processos" && (
          <DetalhesContainer>
            <AbaProcessos
              fetchAuthenticated={fetchAuthenticated}
              id={id}
              abaAtiva={abaAtiva}
            />
          </DetalhesContainer>
        )}
      </MainContainer>
    </ComponentesFixos>
  );
};

export default DetalhesClientes;