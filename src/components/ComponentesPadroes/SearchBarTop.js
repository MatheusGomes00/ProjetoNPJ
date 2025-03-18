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

/* Mantém a barra de pesquisa no mesmo lugar */
const SearchBarContainer = styled.div`
  position: absolute;
  top: 20px;
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
`;

export default function SearchBarTop() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    console.log("Pesquisando por:", searchTerm);
  };

  return (
    <GridContainer>
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
