// src/components/Clientes/ClientesMain.js
import React, { useState } from "react";
import styled from "styled-components";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";

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
  }
`;

// Estilo do cabeçalho
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

// Estilo do título
const Titulo = styled.h1`
  font-family: "Arial", sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
`;

// Estilo do botão de adicionar cliente
const BotaoAdicionar = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

// Estilo do campo de busca
const CampoBusca = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  width: 300px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Estilo do contêiner da lista de clientes
const ClientesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

// Estilo da lista de clientes
const ClientesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

// Estilo de cada card de cliente
const ClienteCard = styled.div`
  background: #ffffff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

// Estilo para o nome do cliente
const ClienteNome = styled.div`
  font-family: "Arial", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #1e3c72;
`;

// Estilo para informações adicionais
const InfoText = styled.div`
  font-family: "Arial", sans-serif;
  font-size: 14px;
  color: #5a6a8a;
`;

// Estilo para o status
const Status = styled.div`
  font-family: "Arial", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.ativo ? "#52c41a" : "#ff4d4f")};
`;

// Estilo para mensagens
const Mensagem = styled.p`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin: 20px 0;
`;

// Dados mockados baseados no CadastroDto
const clientesMock = [
  {
    id: "1",
    status: true,
    nome: "João Silva",
    cliente: { nome: "João Silva" }, // ClienteDto (simplificado)
    representante: { nome: "Ana Pereira" }, // RepresentanteDto
    parteContraria: { nome: "Empresa XYZ" }, // ParteContrariaDto
    dadosProcessuais: { numeroProcesso: "12345-67" }, // DadosProcessuaisDto
    natureza: { tipo: "Cível" }, // NaturezaDto
    responsaveis: { nomes: ["Carlos Souza", "Maria Oliveira"] }, // ResponsaveisDto
  },
  {
    id: "2",
    status: false,
    nome: "Maria Oliveira",
    cliente: { nome: "Maria Oliveira" },
    representante: { nome: "Pedro Almeida" },
    parteContraria: { nome: "Banco ABC" },
    dadosProcessuais: { numeroProcesso: "98765-43" },
    natureza: { tipo: "Trabalhista" },
    responsaveis: { nomes: ["João Silva"] },
  },
  {
    id: "3",
    status: true,
    nome: "Carlos Souza",
    cliente: { nome: "Carlos Souza" },
    representante: { nome: "Fernanda Lima" },
    parteContraria: { nome: "Indústria DEF" },
    dadosProcessuais: { numeroProcesso: "54321-98" },
    natureza: { tipo: "Criminal" },
    responsaveis: { nomes: ["Ana Pereira", "Pedro Almeida"] },
  },
];

const ClientesMain = () => {
  const [clientes, setClientes] = useState(clientesMock);
  const [termoBusca, setTermoBusca] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  // Filtra os clientes com base no termo de busca
  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const handleBusca = (e) => {
    setTermoBusca(e.target.value);
  };

  const handleAdicionarCliente = () => {
    alert("Funcionalidade de adicionar cliente será implementada!");
    // Aqui você pode implementar a lógica para abrir um formulário ou modal para adicionar um novo cliente
  };

  return (
    <ComponentesFixos>
      <MainContainer>
        <Header>
          <Titulo>Gerenciamento de Clientes</Titulo>
          <BotaoAdicionar onClick={handleAdicionarCliente}>
            Adicionar Cliente
          </BotaoAdicionar>
        </Header>

        <CampoBusca
          type="text"
          value={termoBusca}
          onChange={handleBusca}
          placeholder="Buscar por nome do cliente..."
        />

        <ClientesContainer>
          {isLoading ? (
            <Mensagem>Carregando clientes...</Mensagem>
          ) : mensagemErro ? (
            <Mensagem>{mensagemErro}</Mensagem>
          ) : clientesFiltrados.length === 0 ? (
            <Mensagem>Nenhum cliente encontrado.</Mensagem>
          ) : (
            <ClientesList>
              {clientesFiltrados.map((cliente) => (
                <ClienteCard key={cliente.id}>
                  <ClienteNome>{cliente.nome}</ClienteNome>
                  <Status ativo={cliente.status}>
                    Status: {cliente.status ? "Ativo" : "Inativo"}
                  </Status>
                  <InfoText>Representante: {cliente.representante?.nome || "N/A"}</InfoText>
                  <InfoText>
                    Parte Contrária: {cliente.parteContraria?.nome || "N/A"}
                  </InfoText>
                  <InfoText>
                    Processo: {cliente.dadosProcessuais?.numeroProcesso || "N/A"}
                  </InfoText>
                  <InfoText>Natureza: {cliente.natureza?.tipo || "N/A"}</InfoText>
                  <InfoText>
                    Responsáveis: {(cliente.responsaveis?.nomes || []).join(", ") || "N/A"}
                  </InfoText>
                </ClienteCard>
              ))}
            </ClientesList>
          )}
        </ClientesContainer>
      </MainContainer>
    </ComponentesFixos>
  );
};

export default ClientesMain;