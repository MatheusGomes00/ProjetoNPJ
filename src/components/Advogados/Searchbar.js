import React, { useState } from "react"; // Certifique-se de importar useState corretamente

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState(""); // Estado para armazenar a pesquisa

  // Função para buscar na API
  const handleSearch = async () => {
    if (!query.trim()) return; // Evita busca vazia

    try {
      const response = await fetch(`http://localhost:8080/adv/buscanome/${query}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar dados");
      }
      const data = await response.json();

      console.log("Dados recebidos da API:", data); // Log para depuração

      onSearch(data); // Passa os resultados para o componente pai (AdvogadosTela)
    } catch (error) {
      console.error("Erro na busca:", error);
      onSearch([]); // Passa lista vazia para o componente pai
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Buscar advogado..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Permite buscar com Enter
      />
      <button onClick={handleSearch}>Pesquisar</button>
    </div>
  );
}

export default SearchBar;
