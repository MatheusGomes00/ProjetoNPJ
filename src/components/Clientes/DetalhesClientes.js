// DetalhesClientes.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import useAuth from "../Seguranca/UseAuth";

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

// Estilo do botão de salvar
const BotaoSalvar = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #218838;
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
  background-color: ${(props) => (props.ativo ? "#2c3e50" : "#f4f7fa")};
  color: ${(props) => (props.ativo ? "#fff" : "#2c3e50")};
  border: none;
  border-radius: 8px 8px 0 0;
  font-family: "Arial", sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.ativo ? "#2c3e50" : "#e0e4e8")};
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

// Estilo para os campos de informação editáveis
const InfoCampo = styled.div`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  gap: 5px;

  & > label {
    font-weight: 600;
    color: #1e3c72;
  }
`;

// Estilo para os inputs
const CampoInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

// Estilo para o select (status)
const CampoSelect = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;

  &:focus {
    border-color: #007bff;
    outline: none;
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

// Estilo para o pop-up de feedback
const Popup = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #28a745;
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

// Estilo para a tabela de processos
const TabelaProcessos = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: "Arial", sans-serif;
  font-size: 14px;
  color: #2c3e50;
`;

const TabelaCabecalho = styled.th`
  background-color: #2c3e50;
  color: #fff;
  padding: 10px;
  text-align: left;
  border-bottom: 2px solid #e0e4e8;
`;

const TabelaLinha = styled.tr`
  &:nth-child(even) {
    background-color: #f8fbff;
  }
`;

const TabelaCelula = styled.td`
  padding: 10px;
  border-bottom: 1px solid #e0e4e8;
`;

const DetalhesClientes = () => {
  const { id } = useParams();
  const { fetchAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("informacoes");
  const [processos, setProcessos] = useState([]);
  const [isLoadingProcessos, setIsLoadingProcessos] = useState(false);
  const [mensagemErroProcessos, setMensagemErroProcessos] = useState("");
  const [hasFetchedProcessos, setHasFetchedProcessos] = useState(false); // Novo estado para evitar loop

  // Função para buscar os dados do cliente pelo ID
  useEffect(() => {
    const buscarClientePorId = async () => {
      if (hasFetched) return;

      setIsLoading(true);
      setMensagemErro("");
      setHasFetched(true);

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
        const clienteSelecionado = data.find((c) => c.id === id);

        if (!clienteSelecionado) {
          throw new Error("Cliente não encontrado.");
        }

        setCliente(clienteSelecionado);
        setFormData({
          nome: clienteSelecionado.cliente.nome || "",
          status: clienteSelecionado.status,
          cpf: clienteSelecionado.cliente.cpf || "",
          rua: clienteSelecionado.cliente.endereco?.rua || "",
          numero: clienteSelecionado.cliente.endereco?.numero || "",
          bairro: clienteSelecionado.cliente.endereco?.bairro || "",
          cidade: clienteSelecionado.cliente.endereco?.cidade || "",
          cep: clienteSelecionado.cliente.endereco?.cep || "",
          telefone: clienteSelecionado.cliente.contato?.telefone || "",
          celular: clienteSelecionado.cliente.contato?.celular || "",
          email: clienteSelecionado.cliente.contato?.email || "",
          representanteNome: clienteSelecionado.representante?.nome || "",
          representanteCpf: clienteSelecionado.representante?.cpf || "",
        });
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        setMensagemErro(error.message || "Erro ao carregar os dados do cliente.");
      } finally {
        setIsLoading(false);
      }
    };

    buscarClientePorId();
  }, [id, fetchAuthenticated, hasFetched]);

  // Função para buscar os processos vinculados ao cliente
  useEffect(() => {
    const buscarProcessos = async () => {
      if (abaAtiva !== "processos" || hasFetchedProcessos) return; // Evita múltiplas requisições

      setIsLoadingProcessos(true);
      setMensagemErroProcessos("");
      setHasFetchedProcessos(true); // Marca que a requisição foi feita

      try {
        const response = await fetchAuthenticated(`http://localhost:8080/proc/porNome/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Nenhum processo encontrado para este cliente.");
          } else if (response.status === 401) {
            throw new Error("Sessão expirada. Faça login novamente.");
          }
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        setProcessos(data);
        if (data.length === 0) {
          setMensagemErroProcessos("Nenhum processo vinculado encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar processos:", error);
        setMensagemErroProcessos(error.message || "Erro ao carregar os processos.");
        setProcessos([]);
      } finally {
        setIsLoadingProcessos(false);
      }
    };

    buscarProcessos();
  }, [id, fetchAuthenticated, abaAtiva, hasFetchedProcessos]);

  // Função para lidar com mudanças nos inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Função para lidar com a mudança no status (select)
  const handleStatusChange = (e) => {
    const value = e.target.value === "true";
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  // Função para salvar as alterações
  const handleSalvar = async () => {
    setIsLoading(true);
    setMensagemErro("");

    const updatedCliente = {
      ...cliente,
      status: formData.status.toString(),
      cliente: {
        ...cliente.cliente,
        nome: formData.nome,
        cpf: formData.cpf,
        endereco: {
          ...cliente.cliente.endereco,
          rua: formData.rua,
          numero: formData.numero,
          bairro: formData.bairro,
          cidade: formData.cidade,
          cep: formData.cep,
        },
        contato: {
          ...cliente.cliente.contato,
          telefone: formData.telefone,
          celular: formData.celular,
          email: formData.email,
        },
      },
      representante: {
        ...cliente.representante,
        nome: formData.representanteNome,
        cpf: formData.representanteCpf,
      },
    };

    try {
      const response = await fetchAuthenticated(`http://localhost:8080/cad/upd/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCliente),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sessão expirada. Faça login novamente.");
        }
        throw new Error(`Erro ao atualizar cliente: ${response.status}`);
      }

      const updatedData = await response.json();
      setCliente(updatedData);
      setFormData({
        nome: updatedData.cliente.nome || "",
        status: updatedData.status,
        cpf: updatedData.cliente.cpf || "",
        rua: updatedData.cliente.endereco?.rua || "",
        numero: updatedData.cliente.endereco?.numero || "",
        bairro: updatedData.cliente.endereco?.bairro || "",
        cidade: updatedData.cliente.endereco?.cidade || "",
        cep: updatedData.cliente.endereco?.cep || "",
        telefone: updatedData.cliente.contato?.telefone || "",
        celular: updatedData.cliente.contato?.celular || "",
        email: updatedData.cliente.contato?.email || "",
        representanteNome: updatedData.representante?.nome || "",
        representanteCpf: updatedData.representante?.cpf || "",
      });
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      setMensagemErro(error.message || "Erro ao salvar as alterações.");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para voltar à tela anterior
  const handleVoltar = () => {
    navigate("/clientes");
  };

  return (
    <ComponentesFixos>
      <MainContainer>
        <Header>
          <Titulo>Detalhes do Cliente</Titulo>
          <div style={{ display: "flex", gap: "10px" }}>
            <BotaoSalvar onClick={handleSalvar} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </BotaoSalvar>
            <BotaoVoltar onClick={handleVoltar}>Voltar</BotaoVoltar>
          </div>
        </Header>

        {/* Sistema de abas */}
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

        {/* Conteúdo das abas */}
        {isLoading && !formData.nome ? (
          <Mensagem>Carregando dados do cliente...</Mensagem>
        ) : mensagemErro ? (
          <Mensagem>{mensagemErro}</Mensagem>
        ) : formData.nome ? (
          <>
            {abaAtiva === "informacoes" && (
              <DetalhesContainer>
                <InfoCampo>
                  <label>Nome:</label>
                  <CampoInput
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                  />
                </InfoCampo>
                <InfoCampo>
                  <label>Status:</label>
                  <CampoSelect
                    name="status"
                    value={formData.status.toString()}
                    onChange={handleStatusChange}
                  >
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </CampoSelect>
                </InfoCampo>
                <InfoCampo>
                  <label>CPF:</label>
                  <CampoInput
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                  />
                </InfoCampo>
                <InfoCampo>
                  <label>Rua:</label>
                  <CampoInput
                    type="text"
                    name="rua"
                    value={formData.rua}
                    onChange={handleInputChange}
                  />
                </InfoCampo>
                <InfoCampo>
                  <label>Número:</label>
                  <CampoInput
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                  />
                </InfoCampo>
                <InfoCampo>
                  <label>Bairro:</label>
                  <CampoInput
                    type="text"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleInputChange}
                  />
                </InfoCampo>
                <InfoCampo>
                  <label>Cidade:</label>
                  <CampoInput
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleInputChange}
                  />
                </InfoCampo>
                <InfoCampo>
                  <label>CEP:</label>
                  <CampoInput
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                  />
                </InfoCampo>
                <InfoCampo>
                  <label>Telefone:</label>
                  <CampoInput
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                  />
                </InfoCampo>
                <InfoCampo>
                  <label>Celular:</label>
                  <CampoInput
                    type="text"
                    name="celular"
                    value={formData.celular}
                    onChange={handleInputChange}
                  />
                </InfoCampo>
                <InfoCampo>
                  <label>Email:</label>
                  <CampoInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </InfoCampo>
                <InfoCampo>
                  <label>Representante:</label>
                  <CampoInput
                    type="text"
                    name="representanteNome"
                    value={formData.representanteNome}
                    onChange={handleInputChange}
                  />
                </InfoCampo>
                <InfoCampo>
                  <label>CPF do Representante:</label>
                  <CampoInput
                    type="text"
                    name="representanteCpf"
                    value={formData.representanteCpf}
                    onChange={handleInputChange}
                  />
                </InfoCampo>
              </DetalhesContainer>
            )}
            {abaAtiva === "documentos" && (
              <DetalhesContainer>
                <Mensagem>Seção de Documentos e Arquivos (em desenvolvimento)</Mensagem>
              </DetalhesContainer>
            )}
            {abaAtiva === "processos" && (
              <DetalhesContainer>
                {isLoadingProcessos ? (
                  <Mensagem>Carregando processos...</Mensagem>
                ) : mensagemErroProcessos ? (
                  <Mensagem>{mensagemErroProcessos}</Mensagem>
                ) : processos.length > 0 ? (
                  <TabelaProcessos>
                    <thead>
                      <tr>
                        <TabelaCabecalho>Número do Processo</TabelaCabecalho>
                        <TabelaCabecalho>Situação</TabelaCabecalho>
                        <TabelaCabecalho>Tipo de Ação/Classe</TabelaCabecalho>
                        <TabelaCabecalho>Vara</TabelaCabecalho>
                        <TabelaCabecalho>Representante Legal</TabelaCabecalho>
                        <TabelaCabecalho>Requerido</TabelaCabecalho>
                      </tr>
                    </thead>
                    <tbody>
                      {processos.map((processo) => (
                        <TabelaLinha key={processo.id}>
                          <TabelaCelula>{processo.numeroProcesso || "Não informado"}</TabelaCelula>
                          <TabelaCelula>{processo.situacao || "Não informado"}</TabelaCelula>
                          <TabelaCelula>{processo.tipoAcaoClasse || "Não informado"}</TabelaCelula>
                          <TabelaCelula>{processo.vara || "Não informado"}</TabelaCelula>
                          <TabelaCelula>{processo.representanteLegal || "Não informado"}</TabelaCelula>
                          <TabelaCelula>{processo.requerido || "Não informado"}</TabelaCelula>
                        </TabelaLinha>
                      ))}
                    </tbody>
                  </TabelaProcessos>
                ) : (
                  <Mensagem>Nenhum processo vinculado encontrado.</Mensagem>
                )}
              </DetalhesContainer>
            )}
          </>
        ) : (
          <Mensagem>Cliente não encontrado.</Mensagem>
        )}

        {/* Pop-up de feedback */}
        {showPopup && <Popup>Alterações Salvas</Popup>}
      </MainContainer>
    </ComponentesFixos>
  );
};

export default DetalhesClientes;