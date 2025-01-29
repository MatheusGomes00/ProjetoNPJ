import { useState } from "react";

export default function SearchBarTop() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    console.log("Pesquisando por:", searchTerm);
  };

  return (
    <div className="search-bar-top">
      <input
        type="text"
        placeholder="Pesquise clientes, advogados ou casos"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Procurar</button>
    </div>
  );
}
