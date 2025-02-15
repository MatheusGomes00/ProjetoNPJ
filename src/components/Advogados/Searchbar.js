import React, { useState } from "react";
import styled from "styled-components";
import ResultsList from "./ResultsList"; // Importa o novo componente de lista de resultados

const SearchContainer = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;  /* Adiciona um espaçamento inferior */
`;

const SearchBarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  width: 350px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background: #0056b3;
  }
`;

const ResultsWrapper = styled.div`
  position: absolute;
  top: 70%;  /* Ajusta a posição da lista de resultados */
  left: 50%;
  transform: translateX(-50%);
`;

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch(`http://localhost:8080/adv/buscanome/${query}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar dados");
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Erro na busca:", error);
      setResults([]);
    }
  };

  return (
    <>
      <SearchContainer>
        <SearchBarWrapper>
          <Input
            type="text"
            placeholder="Buscar advogado..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch}>Pesquisar</Button>
        </SearchBarWrapper>
      </SearchContainer>

      {/* Lista de resultados agora aparece separada */}
      <ResultsWrapper>
        <ResultsList results={results} />
      </ResultsWrapper>
    </>
  );
}

export default SearchBar;
