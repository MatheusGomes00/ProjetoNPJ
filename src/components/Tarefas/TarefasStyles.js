import styled from "styled-components";


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
  }
`;

// Estilo do cabeçalho
export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
`;

// Estilo do título
export const Titulo = styled.h1`
  font-family: "Arial", sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
`;

// Estilo do container de busca
export const BuscaContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 350px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

// Estilo do campo de busca
export const CampoBusca = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Estilo do botão de busca
export const BotaoBusca = styled.button`
  background: rgb(4, 0, 255);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.3s ease;

  &:hover {
    background: #218838;
  }

  &:active {
    background: #1e7e34;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Estilo do container de filtros
export const FiltrosContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

// Estilo dos botões de filtro de status
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

// Estilo do dropdown de prioridade
export const SelectPrioridade = styled.select`
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  background-color: #fff;
  color: #333;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

// Estilo do grid de tarefas
export const TarefasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
`;

// Estilo de cada card de tarefa
export const TarefaCard = styled.div`
  font-size: 15px;
  background-color: #f9f9f9;
  padding: 15px;
  padding-right: 20px;
  border-radius: 10px;
  width: 120px;
  height: 120px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

// Estilo da tag de prioridade
export const StatusTag = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 10px;
  height: 20px;
  background-color: ${({ $prioridade }) => {
    const prioridadeLower = $prioridade.toLowerCase();
    return prioridadeLower === "baixa"
      ? "#34c759"
      : prioridadeLower === "média" || prioridadeLower === "media"
      ? "#ffca28"
      : "#ff3b30";
  }};
  border-radius: 30%;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

export const NomeTarefa = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limita a 2 linhas */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2em; /* Altura da linha para consistência */
  max-height: 2.4em; /* 2 linhas x 1.2em */
  word-wrap: break-word; /* Quebra palavras longas */
`;

// Estilo para mensagens de loading ou erro
export const Mensagem = styled.p`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin: 20px 0;
`;

// Estilo do container de navegação
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

// Estilo dos botões de navegação
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

export const LegendaPrioridades = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 10px;
  font-size: 14px;
  color: #666;
  flex-shrink: 0; /* Evita que a legenda seja espremida */
`;

export const TagLegenda = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const CorTag = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ $cor }) => $cor};
`;