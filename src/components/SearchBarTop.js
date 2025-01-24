// SearchBarTop.js
import React, { useState } from 'react';

function SearchBarTop({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="search-bar-top">
      <input
        type="text"
        placeholder="Pesquisar Cliente, Processo ou Tarefa"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
}

export default SearchBarTop;
