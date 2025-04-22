import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import useAuth from "../Seguranca/UseAuth";
import AbaProcessos from "./AbaProcesso";

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

  // Buscar dados do cliente
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
      const response = await fetchAuthenticated(
        `http://localhost:8080/cad/upd/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCliente),
        }
      );

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
            <BotaoSalvar onClick={handleSalvar} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
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

        {isLoading && !formData.nome ? (
          <Mensagem>Carregando dados do cliente...</Mensagem>
        ) : mensagemErro ? (
          <Mensagem>{mensagemErro}</Mensagem>
        ) : formData.nome ? (
          <>
            {abaAtiva === "informacoes" && (
              <DetalhesContainer>
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

                <SectionTitle>Endereço</SectionTitle>
                <FormRow>
                  <FormLabel>Rua</FormLabel>
                  <FormInput
                    type="text"
                    name="rua"
                    value={formData.rua}
                    onChange={handleInputChange}
                  />
                </FormRow>
                <FormRow>
                  <FormLabel>Número</FormLabel>
                  <FormInput
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                  />
                </FormRow>
                <FormRow>
                  <FormLabel>Bairro</FormLabel>
                  <FormInput
                    type="text"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleInputChange}
                  />
                </FormRow>
                <FormRow>
                  <FormLabel>Cidade</FormLabel>
                  <FormInput
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleInputChange}
                  />
                </FormRow>
                <FormRow>
                  <FormLabel>CEP</FormLabel>
                  <FormInput
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                  />
                </FormRow>

                <SectionTitle>Contato</SectionTitle>
                <FormRow>
                  <FormLabel>Telefone</FormLabel>
                  <FormInput
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                  />
                </FormRow>
                <FormRow>
                  <FormLabel>Celular</FormLabel>
                  <FormInput
                    type="text"
                    name="celular"
                    value={formData.celular}
                    onChange={handleInputChange}
                  />
                </FormRow>
                <FormRow>
                  <FormLabel>Email</FormLabel>
                  <FormInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </FormRow>

                <SectionTitle>Representante</SectionTitle>
                <FormRow>
                  <FormLabel>Nome</FormLabel>
                  <FormInput
                    type="text"
                    name="representanteNome"
                    value={formData.representanteNome}
                    onChange={handleInputChange}
                  />
                </FormRow>
                <FormRow>
                  <FormLabel>CPF</FormLabel>
                  <FormInput
                    type="text"
                    name="representanteCpf"
                    value={formData.representanteCpf}
                    onChange={handleInputChange}
                  />
                </FormRow>
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
          </>
        ) : (
          <Mensagem>Cliente não encontrado.</Mensagem>
        )}

        {showPopup && <Popup>Alterações Salvas</Popup>}
      </MainContainer>
    </ComponentesFixos>
  );
};

export default DetalhesClientes;