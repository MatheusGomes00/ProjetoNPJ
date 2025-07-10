import React, { useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import useAuth from "../Seguranca/UseAuth";
import EditarAdvogados from "./EditarAdvogados";

// Estilo do contêiner principal
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 24px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  gap: 20px;

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

const DetalhesAdvogados = () => {
  const { id } = useParams();
  const { fetchAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState("informacoes");
  const [isSaving, setIsSaving] = useState(false);

  // Voltar à tela anterior
  const handleVoltar = () => {
    navigate("/advogados");
  };

  return (
    <ComponentesFixos>
      <MainContainer>
        <Header>
          <Titulo>Detalhes do Advogado</Titulo>
          <div style={{ display: "flex", gap: "10px" }}>
            <BotaoSalvar onClick={() => document.getElementById("save-advogado").click()} disabled={isSaving}>
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
            Informações do Advogado
          </BotaoAba>
        </AbasContainer>

        {abaAtiva === "informacoes" && (
          <DetalhesContainer>
            <EditarAdvogados
              fetchAuthenticated={fetchAuthenticated}
              id={id}
              navigate={navigate}
              onSave={() => setIsSaving(true)}
              setIsSaving={setIsSaving}
            />
          </DetalhesContainer>
        )}
      </MainContainer>
    </ComponentesFixos>
  );
};

export default DetalhesAdvogados;