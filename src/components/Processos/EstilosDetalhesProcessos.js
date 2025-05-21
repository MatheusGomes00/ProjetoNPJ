import styled from "styled-components";

// Função para formatar situação (e.g., EM_ANDAMENTO → Em Andamento)
export const formatarSituacao = (situacao) => {
  if (!situacao) return "N/A";
  return situacao
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Estilo do container principal
export const MainContainer = styled.div`
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
export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #fff;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

export const Popup = styled.div`
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

// Estilo do container de título e status
export const TituloStatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  max-width: 70%;

  @media (max-width: 768px) {
    max-width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
`;

// Estilo do título
export const Titulo = styled.h1`
  font-family: "Arial", sans-serif;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

// Estilo do status
export const StatusBadge = styled.span`
  padding: 8px 16px;
  background: #28a745;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  min-width: 100px;
  text-align: center;

  ${({ situacao }) =>
    situacao === "INICIADO" &&
    `
    background:rgb(129, 136, 143);
  `}
  ${({ situacao }) =>
    situacao === "EM_ANDAMENTO" &&
    `
    background: #ffc107;
    color: #333;
  `}

  @media (max-width: 768px) {
    min-width: 80px;
    font-size: 12px;
    padding: 6px 12px;
  }
`;

// Estilo do botão voltar
export const BotaoVoltar = styled.button`
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
  @media (max-width: 768px) {
    align-self: flex-end;
  }
`;

// Estilo do botão salvar
export const BotaoSalvar = styled.button`
  padding: 10px 20px;
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;
  &:hover {
    background: #218838;
  }
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

// Estilo do botão de desassociar
export const BotaoDesassociar = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background: #c82333;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 5px 10px;
  }
`;

// Estilo das seções
export const Section = styled.section`
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

export const SectionTitle = styled.h2`
  font-family: "Arial", sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 15px 0;
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const InfoLabel = styled.label`
  font-weight: 600;
  color: #555;
  font-size: 16px;
  width: 40%;

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 8px;
  }
`;

export const InfoValue = styled.span`
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

export const InfoInput = styled.input`
  width: 60%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  background: #fff;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const InfoSelect = styled.select`
  width: 60%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  background: #fff;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Estilo para listas
export const ListItem = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

// Estilo para a tabela de responsáveis
export const ResponsaveisTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
`;

export const TableHeader = styled.th`
  padding: 12px;
  background-color: #f5f5f5;
  border-bottom: 2px solid #ddd;
  text-align: left;
  font-weight: bold;
  color: #333;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #fafafa;
  }
  &:hover {
    background-color: #f0f0f0;
  }
`;

export const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
  color: #555;
`;

export const BotaoAcao = styled.button`
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
export const DocumentosTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
`;

export const BotaoDownload = styled.a`
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
export const ModalOverlay = styled.div`
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

export const ModalContent = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

export const ModalTitle = styled.h3`
  font-family: "Arial", sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const FormLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #555;
  font-size: 16px;
  margin-bottom: 8px;
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
`;

export const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const BotaoCancelar = styled.button`
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
export const Mensagem = styled.p`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin: 20px 0;
`;