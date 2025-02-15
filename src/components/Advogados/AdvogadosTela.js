import React, { useState } from "react"; // Certifique-se de importar useState corretamente
 // Importar React e useState
import Sidebar from "../ComponentesPadroes/Sidebar"; // Importar Sidebar
import SearchBarTop from "../ComponentesPadroes/SearchBarTop";
import IconeLogOut from "../botoesTelaImovel/IconeLogOut"; // Importar IconeLogOut
import IconeNotificacoes from "../botoesTelaImovel/IconeNotificacoes"; // Importar IconeNotificacoes
import SearchBar from "../Advogados/Searchbar"; // Importar SearchBar
import ResultsList from "../Advogados/ResultsList"; // Importar ResultsList
import IconeNovaTarefa from "../botoesTelaImovel/IconeNovaTarefa";

function AdvogadosTela() {
    const [results, setResults] = useState([]); // Armazena os resultados da busca
  
    // Função chamada quando a pesquisa é realizada em SearchBar
    const handleSearch = (searchResults) => {
      setResults(searchResults); // Atualiza os resultados com os dados vindos da busca
    };
  
    return (
      <div className="app-container">
        {/* Barra de pesquisa no topo */}
        <SearchBarTop />
  
        {/* Ícones no canto superior direito */}
        <div className="top-right-icons">
          <IconeNotificacoes />
          <IconeLogOut />
          <IconeNovaTarefa />
        </div>
  
        {/* Linha horizontal */}
        <div className="horizontal-line"></div>
  
        {/* Rótulo no canto */}
        <div className="corner-label">
          <span className="corner-label-npj">NPJ</span>
          <br />
          <span className="corner-label-anhanguera">ANHANGUERA</span>
        </div>
  
        {/* Sidebar */}
        <Sidebar />
  
        {/* Conteúdo principal */}
        <div className="content-container">
          {/* Passando a função para o SearchBar */}
          <SearchBar onSearch={handleSearch} />
  
          {/* Renderiza ResultsList somente se houver resultados */}
          {results.length > 0 && <ResultsList results={results} />}
        </div>
      </div>
    );
  }
  export default AdvogadosTela;