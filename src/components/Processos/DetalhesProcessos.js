import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

// Estilo do status
const StatusBadge = styled.span`
  padding: 8px 16px;
  background: #28a745;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  color: #fff;

  ${({ situacao }) =>
    situacao === "INICIADO" &&
    `
    background: #007bff;
  `}
  ${({ situacao }) =>
    situacao === "EM ANDAMENTO" &&
    `
    background: #ffc107;
    color: #333;
  `}
`;

// Estilo do botão voltar
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

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #555;
  font-size: 16px;
`;

const InfoValue = styled.span`
  color: #333;
  font-size: 16px;
  text-align: right;
  max-width: 60%;
  word-break: break-word;

  @media (max-width: 768px) {
    max-width: 100%;
    text-align: left;
  }
`;

// Estilo para listas
const ListItem = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

// Estilo para a tabela de responsáveis
const ResponsaveisTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
`;

const TableHeader = styled.th`
  padding: 12px;
  background-color: #f5f5f5;
  border-bottom: 2px solid #ddd;
  text-align: left;
  font-weight: bold;
  color: #333;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #fafafa;
  }
  &:hover {
    background-color: #f0f0f0;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
  color: #555;
`;

const BotaoAcao = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

// Estilo para a tabela de documentos
const DocumentosTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
`;

const BotaoDownload = styled.a`
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

// Estilo para o modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  font-family: "Arial", sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #555;
  font-size: 16px;
  margin-bottom: 8px;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

// Estilo para mensagens
const Mensagem = styled.p`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin: 20px 0;
`;

const DetalhesProcesso = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchAuthenticated } = useAuth();
  const [processo, setProcesso] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");
  const [advogados, setAdvogados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novoResponsavelId, setNovoResponsavelId] = useState("");

  // Busca os dados do processo
  const fetchProcesso = async () => {
    setIsLoading(true);
    setMensagemErro("");
    try {
      const response = await fetchAuthenticated(`http://localhost:8080/proc/porId/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        if (response.status === 404) {
          setMensagemErro("Processo não encontrado.");
          setProcesso(null);
          return;
        }
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      const data = await response.json();
      console.log("Dados do processo:", data);
      setProcesso(data);
    } catch (error) {
      console.error("Erro ao buscar processo:", error);
      setMensagemErro("Erro ao carregar os dados do processo. Tente novamente.");
      setProcesso(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Busca a lista de advogados
  const fetchAdvogados = async () => {
    try {
      const response = await fetchAuthenticated(`http://localhost:8080/adv/buscarTodos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
      const data = await response.json();
      setAdvogados(data || []);
    } catch (error) {
      console.error("Erro ao buscar advogados:", error);
      setMensagemErro("Erro ao carregar lista de advogados.");
    }
  };

  // Adiciona um novo responsável
  const adicionarResponsavel = async () => {
    if (!novoResponsavelId) {
      setMensagemErro("Selecione um advogado.");
      return;
    }

    try {
      const responsaveisAtuais = (processo.responsaveis || []).map((resp) => resp.id || "").filter(Boolean);
      const novosResponsaveis = [...new Set([...responsaveisAtuais, novoResponsavelId])]; // Evita duplicatas

      const dto = {
        situacao: processo.situacao || "INICIADO",
        numeroProcesso: processo.numeroProcesso || "",
        pasta: processo.pasta || "",
        tipoAcaoClasse: processo.tipoAcaoClasse || "",
        representanteLegal: processo.representanteLegal || null,
        requerido: processo.requerido || null,
        vara: processo.vara || "",
        valorCausa: processo.valorCausa || "",
        responsaveisId: novosResponsaveis,
        clienteId: (processo.cliente || []).map((cli) => cli.id || "").filter(Boolean),
      };

      const response = await fetchAuthenticated(`http://localhost:8080/proc/updProc/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
      const updatedProcesso = await response.json();
      setProcesso(updatedProcesso);
      setShowModal(false);
      setNovoResponsavelId("");
      setMensagemErro("");
    } catch (error) {
      console.error("Erro ao adicionar responsável:", error);
      setMensagemErro("Erro ao adicionar responsável. Tente novamente.");
    }
  };

  useEffect(() => {
    fetchProcesso();
    fetchAdvogados();
  }, [id]);

  return (
    <ComponentesFixos>
      <MainContainer>
        {isLoading ? (
          <Mensagem>Carregando dados do processo...</Mensagem>
        ) : mensagemErro ? (
          <Mensagem>{mensagemErro}</Mensagem>
        ) : !processo ? (
          <Mensagem>Nenhum dado disponível para este processo.</Mensagem>
        ) : (
          <>
            <Header>
              <div>
                <Titulo>{processo.numeroProcesso || "N/A"}</Titulo>
                <StatusBadge situacao={processo.situacao}>{processo.situacao || "N/A"}</StatusBadge>
              </div>
              <BotaoVoltar onClick={() => navigate(-1)}>Voltar</BotaoVoltar>
            </Header>

            <Section>
              <SectionTitle>Informações do Processo</SectionTitle>
              <InfoRow>
                <InfoLabel>Tipo de Ação/Classe</InfoLabel>
                <InfoValue>{processo.tipoAcaoClasse || "N/A"}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Vara</InfoLabel>
                <InfoValue>{processo.vara || "N/A"}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Valor da Causa</InfoLabel>
                <InfoValue>{processo.valorCausa || "N/A"}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Pasta</InfoLabel>
                <InfoValue>{processo.pasta || "N/A"}</InfoValue>
              </InfoRow>
            </Section>

            <Section>
              <SectionTitle>Partes Envolvidas</SectionTitle>
              <InfoRow>
                <InfoLabel>Representante Legal</InfoLabel>
                <InfoValue>{processo.representanteLegal || "N/A"}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Requerido</InfoLabel>
                <InfoValue>{processo.requerido || "N/A"}</InfoValue>
              </InfoRow>
            </Section>

            <Section>
              <SectionTitle>Cliente</SectionTitle>
              {processo.cliente && processo.cliente.length > 0 ? (
                processo.cliente.map((cli, index) => (
                  <ListItem key={cli?.id || index}>
                    <InfoRow>
                      <InfoLabel>Nome</InfoLabel>
                      <InfoValue>{cli.cliente?.nome || "N/A"}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>CPF</InfoLabel>
                      <InfoValue>{cli.cliente?.cpf || "N/A"}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>Endereço</InfoLabel>
                      <InfoValue>
                        {cli.cliente?.endereco
                          ? `${cli.cliente.endereco.rua}, ${cli.cliente.endereco.numero}, ${cli.cliente.endereco.bairro}, ${cli.cliente.endereco.cidade}`
                          : "N/A"}
                      </InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>Contato</InfoLabel>
                      <InfoValue>
                        {cli.cliente?.contato
                          ? `Tel: ${cli.cliente.contato.telefone || "N/A"}, Cel: ${cli.cliente.contato.celular || "N/A"}, Email: ${cli.cliente.contato.email || "N/A"}`
                          : "N/A"}
                      </InfoValue>
                    </InfoRow>
                  </ListItem>
                ))
              ) : (
                <Mensagem>Nenhum cliente associado.</Mensagem>
              )}
            </Section>

            <Section>
              <SectionTitle>Responsáveis</SectionTitle>
              <BotaoAcao onClick={() => setShowModal(true)} style={{ marginBottom: "20px" }}>
                Adicionar Responsável
              </BotaoAcao>
              {processo.responsaveis && processo.responsaveis.length > 0 ? (
                <ResponsaveisTable>
                  <thead>
                    <tr>
                      <TableHeader>Nome</TableHeader>
                      <TableHeader>OAB</TableHeader>
                      <TableHeader>CPF</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {processo.responsaveis.map((resp, index) => (
                      <TableRow key={resp?.id || index}>
                        <TableCell>{resp?.nome || "N/A"}</TableCell>
                        <TableCell>
                          {resp?.registroOab && resp?.secaoOab
                            ? `${resp.registroOab}/${resp.secaoOab}`
                            : "N/A"}
                        </TableCell>
                        <TableCell>{resp?.cpf || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </ResponsaveisTable>
              ) : (
                <Mensagem>Nenhum responsável associado.</Mensagem>
              )}
            </Section>

            <Section>
              <SectionTitle>Documentos do Processo</SectionTitle>
              {processo.documentos && processo.documentos.length > 0 ? (
                <DocumentosTable>
                  <thead>
                    <tr>
                      <TableHeader>Nome do Documento</TableHeader>
                      <TableHeader>Tipo</TableHeader>
                      <TableHeader>Data de Upload</TableHeader>
                      <TableHeader>Ação</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {processo.documentos.map((doc, index) => (
                      <TableRow key={doc?.id || index}>
                        <TableCell>{doc?.nome || "N/A"}</TableCell>
                        <TableCell>{doc?.tipo || "N/A"}</TableCell>
                        <TableCell>{doc?.dataUpload || "N/A"}</TableCell>
                        <TableCell>
                          <BotaoDownload href={doc?.url || "#"} target="_blank" rel="noopener noreferrer">
                            Download
                          </BotaoDownload>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </DocumentosTable>
              ) : (
                <Mensagem>Nenhum documento associado ao processo.</Mensagem>
              )}
            </Section>

            {showModal && (
              <ModalOverlay>
                <ModalContent>
                  <ModalTitle>Adicionar Responsável</ModalTitle>
                  <FormGroup>
                    <FormLabel>Selecione o Advogado</FormLabel>
                    <FormSelect
                      value={novoResponsavelId}
                      onChange={(e) => setNovoResponsavelId(e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      {advogados.map((adv, index) => (
                        <option key={adv?.id || index} value={adv.id}>
                          {adv.nome} ({adv.registroOab}/{adv.secaoOab})
                        </option>
                      ))}
                    </FormSelect>
                  </FormGroup>
                  <ModalButtons>
                    <BotaoCancelar onClick={() => setShowModal(false)}>Cancelar</BotaoCancelar>
                    <BotaoAcao onClick={adicionarResponsavel}>Adicionar</BotaoAcao>
                  </ModalButtons>
                </ModalContent>
              </ModalOverlay>
            )}
          </>
        )}
      </MainContainer>
    </ComponentesFixos>
  );
};

export default DetalhesProcesso;