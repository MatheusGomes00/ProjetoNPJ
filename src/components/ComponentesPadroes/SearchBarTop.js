import { useState } from "react";
import styled from "styled-components";

/* Grid que vai de ponta a ponta */
const GridContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px; /* Ajuste a altura conforme necessário */
  background-color: #f8f9fa; /* Cor de fundo opcional */
  border-bottom: 2px solid black; /* Linha preta para separação */
  display: flex;
  align-items: center;
  justify-content: center;
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
