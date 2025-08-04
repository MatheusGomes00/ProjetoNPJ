// src/components/Clientes/EstiloClientes.js
import styled from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 24px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  gap: 20px;

`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const Titulo = styled.h1`
  font-family: "Arial", sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
`;

export const BotaoAdicionar = styled.button`
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

export const CampoBusca = styled.input`
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

export const FiltrosContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const BotaoFiltroStatus = styled.button`
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: ${({ $ativo }) => ($ativo ? "#007bff" : "#fff")};
  color: ${({ $ativo }) => ($ativo ? "#fff" : "#333")};
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: ${({ $ativo }) => ($ativo ? "#0056b3" : "#f0f0f0")};
  }
`;

export const ClientesContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  min-height: 0;
`;

export const ClientesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const ClienteCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(200, 210, 230, 0.3);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ClienteNome = styled.div`
  font-family: "Arial", sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1e3c72;
  grid-column: span 2;
  display: flex;
  align-items: center;
  gap: 8px;

  &:before {
    content: "👤";
    font-size: 18px;
  }

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

export const CpfCliente = styled.div`
  font-family: "Arial", sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #1e3c72;
  grid-column: span 2;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

export const ProcNumero = styled.div`
  font-family: "Arial", sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1e3c72;
  grid-column: span 2;
  display: flex;
  align-items: center;
  gap: 8px;

  &:before {
    content: "📜";
    font-size: 18px;
  }

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

// função para definir cor com base na situação
const getStatusColor = ($status) => {
  switch ($status) {
    case "INICIADO":
      return "#52c41a"; // verde
    case "EM_ANDAMENTO":
      return "#1890ff"; // azul
    case "FINALIZADO":
      return "#180000ff"; // cinza
    case "ARQUIVADO":
      return "#585858ff"; // cinza claro
    case "SUSPENSO":
      return "#faad14"; // laranja
    case "AGUARDANDO_DISTRIBUICAO":
      return "#fa8c16"; // laranja forte
    case "EM_RECURSO":
      return "#722ed1"; // roxo
    default:
      return "#ff4d4f"; // vermelho para status indefinido
  }
};

export const Situacao = styled.div`
  font-family: "Arial", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => getStatusColor(props.$status)};
  display: flex;
  align-items: center;
  gap: 8px;

  &:before {
    content: "●";
    font-size: 12px;
    color: ${(props) => getStatusColor(props.$status)};
  }
`;

export const Status = styled.div`
  font-family: "Arial", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.$ativo ? "#52c41a" : "#ff4d4f")};
  display: flex;
  align-items: center;
  gap: 8px;

  &:before {
    content: "●";
    font-size: 12px;
    color: ${(props) => (props.$ativo ? "#52c41a" : "#ff4d4f")};
  }
`;

export const Mensagem = styled.p`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin: 20px 0;
`;

export const NavegacaoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #2c3e50;
`;

export const BotaoNavegacao = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  color: ${({ disabled }) => (disabled ? "#ccc" : "#007bff")};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ disabled }) => (disabled ? "#ccc" : "#0056b3")};
  }
`;