import React, { useState } from "react";
import styled from "styled-components";

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
  width: 90%
`;

const SearchBarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
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
  min-width: 100px;
  &:hover {
    background: #0056b3;
  }
`;

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const isCpf = (value) => {
    return /^\d{11}$/.test(value);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setSearchPerformed(true);

    try {
      const url = isCpf(query)
        ? `http://localhost:8080/adv/buscacpf`
        : `http://localhost:8080/adv/buscanome/${query}`;
      
      const requestBody = isCpf(query)
        ? JSON.stringify({ cpf: query.toString() })
        : null;

      const token = localStorage.getItem("token"); 

      const response = await fetch(url, {
        method: isCpf(query) ? "POST" : "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: requestBody,
      });

      if (response.status === 404) {
        setErrorMessage("Nenhum registro localizado.");
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao buscar dados");
      }

      const data = await response.json();
      onSearch(data);
    } catch (error) {
      console.error("Erro na busca:", error);
      setErrorMessage("Erro ao buscar dados. Tente novamente mais tarde.");
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setErrorMessage("");
    setSearchPerformed(false); // Limpa a busca e esconde o botão de limpar
    onSearch([]); // Reseta os resultados da busca
  };

  const handleErrorClick = () => {
    setErrorMessage("");
  };

  if (errorMessage) {
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  }

  return (
    <>
      <SearchContainer>
        <SearchBarWrapper>
          <Input
            type="text"
            placeholder="Buscar advogado por nome ou CPF..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch}>Pesquisar</Button>
          {searchPerformed && (
            <Button onClick={handleClearSearch}>Limpar busca</Button>
          )}
        </SearchBarWrapper>
      
        {errorMessage && 
          <div 
            onClick={handleErrorClick}
            style={{ color: "red", marginTop: "10px" }}
          >
            {errorMessage}
          </div>}
      </SearchContainer>
    </>
  );
}

export default SearchBar;
