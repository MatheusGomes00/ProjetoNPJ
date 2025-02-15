import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import styled from 'styled-components';

// Estilos do componente
const ResultsContainer = styled.div`
  margin-top: -200px;  /* Adiciona um espaçamento superior */
  background: #fff;
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  max-height: 250px;
  overflow-y: auto;
  width: 800px;
`;

const ResultInfo = styled.div`
  font-size: 14px;
  color: #555;
  margin-top: 5px;
`;

const ResultItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
  cursor: pointer;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #f1f1f1;
  }
`;

const ResultsList = ({ results }) => {
  const navigate = useNavigate();  // Usando useNavigate ao invés de useHistory

  const handleClick = (id) => {
    navigate(`/detalhes/${id}`); // Redireciona para a página de detalhes do advogado
  };

  if (!results.length) return null; // Retorna nada se não houver resultados

  return (
    <ResultsContainer>
      {results.map((result, index) => (
        <ResultItem key={index} onClick={() => handleClick(result.id)}>
          <div>{result.nome}</div>
          <ResultInfo>
            <strong>Sessão OAB:</strong> {result.secaoOab || 'Não informada'}
          </ResultInfo>
        </ResultItem>
      ))}
    </ResultsContainer>
  );
};

export default ResultsList;
