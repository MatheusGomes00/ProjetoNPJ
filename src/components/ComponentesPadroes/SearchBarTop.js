import { useState } from "react";
import styled from "styled-components";
const GridContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background-color: #f8f9fa;
  border-bottom: 2px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0; /* Menor que o z-index do modal */
  overflow: hidden; 
  box-sizing: border-box;
  
  /* Certificando-se de que o modal vai ficar abaixo do grid, independente da resolução */
  @media (max-width: 768px) {
    height: 120px; /* Ajuste para telas menores, se necessário */
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  max-width: 600px;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
const CornerLabel = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  font-family: Arial, sans-serif;
  color: #333;
  font-size: clamp(8px, 1vw, 14px); /* Tamanho responsivo */
  line-height: 1.1;
  pointer-events: none; /* Evita interferência em cliques */

  @media (max-width: 800px) {
    font-size: clamp(6px, 0.8vw, 10px);
    top: 3px;
    left: 3px;
  }

  @media (max-width: 600px) {
    font-size: clamp(5px, 0.6vw, 8px);
    top: 2px;
    left: 2px;
  }

  @media (min-width: 1440px) {
    font-size: clamp(12px, 1.5vw, 16px);
    top: 8px;
    left: 8px;
  }
`;

/* Mantém a barra de pesquisa no mesmo lugar */
const SearchBarContainer = styled.div`
  position: absolute;
  top: clamp(30px, 5vh, 50px); /* Ajusta a posição vertical para evitar o label */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 600px;
  width: 100%;
  padding: 0;
  background-color: transparent;
  border-radius: 8px;
  z-index: 1000;
`;
/* Campo de pesquisa */
const SearchInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
  }

  @media (max-width: 800px) {
    font-size: 14px;
    padding: 8px;
  }

  @media (max-width: 600px) {
    font-size: 12px;
    padding: 6px;
  }
`;

/* Botão de pesquisa */
const SearchButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #003f7f;
  }

  @media (max-width: 800px) {
    padding: 8px 15px;
    font-size: 14px;
  }

  @media (max-width: 600px) {
    padding: 6px 10px;
    font-size: 12px;
  }
`;

export default function SearchBarTop() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    console.log("Pesquisando por:", searchTerm);
  };

  return (
    <GridContainer>
      <CornerLabel>
        <span className="corner-label-npj">NPJ</span>
        <br />
        <span className="corner-label-anhanguera">ANHANGUERA</span>
      </CornerLabel>
      <SearchBarContainer>
        <SearchInput
          type="text"
          placeholder="Pesquise clientes, advogados ou casos"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>Procurar</SearchButton>
      </SearchBarContainer>
    </GridContainer>
  );
}
