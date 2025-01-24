import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [nome, setNome] = useState('');

  const handleSearch = () => {
    if (nome.trim() !== '') {
      onSearch(nome);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Pesquisar Advogado"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
}

export default SearchBar;
