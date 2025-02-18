import React, { useState } from "react";
import Sidebar from "../ComponentesPadroes/Sidebar"; 
import SearchBarTop from "../ComponentesPadroes/SearchBarTop";
import IconeLogOut from "../botoesTelaImovel/IconeLogOut"; 
import IconeNotificacoes from "../botoesTelaImovel/IconeNotificacoes"; 
import SearchBar from "../Advogados/Searchbar"; 
import ResultsList from "../Advogados/ResultsList"; 
import IconeNovaTarefa from "../botoesTelaImovel/IconeNovaTarefa";
import CadastrarAdvogado from "./CadastrarAdvogado"; // Importando o componente

function AdvogadosTela() {
  const [results, setResults] = useState([]); 
  const [showCadastro, setShowCadastro] = useState(false);

  const handleSearch = (searchResults) => {
    setResults(searchResults); 
  };

  return (
    <div className="app-container">
      <SearchBarTop />

      <div className="top-right-icons">
        <IconeNotificacoes />
        <IconeLogOut />
        <IconeNovaTarefa />
      </div>

      <div className="horizontal-line"></div>

      <div className="corner-label">
        <span className="corner-label-npj">NPJ</span>
        <br />
        <span className="corner-label-anhanguera">ANHANGUERA</span>
      </div>

      <Sidebar />

      <div className="content-container">
        <div className="search-container">
          <SearchBar onSearch={handleSearch} />
          
          {/* Contêiner com o label e o botão */}
          <div style={styles.buttonContainer}>
            <span style={styles.label}>Novo</span>
            <button 
              className="cadastrar-advogado-btn"
              onClick={() => setShowCadastro(true)} 
              style={styles.cadastrarBtn} 
            >
              +
            </button>
          </div>
        </div>

        {results.length > 0 && <ResultsList results={results} />}

        {showCadastro && <CadastrarAdvogado onClose={() => setShowCadastro(false)} />}
      </div>
    </div>
  );
}

const styles = {
  buttonContainer: {
    position: 'absolute', // Para garantir o posicionamento relativo do botão e do label
    top: '100px', // Ajuste conforme necessário
    right: '400px', // Ajuste a distância da borda direita da tela
    display: 'flex',
    flexDirection: 'column', // Coloca o label em cima do botão
    alignItems: 'center', // Centraliza o texto e o botão
    zIndex: 10, // Garante que o botão e o label fiquem acima de outros elementos
  },
  label: {
    color: '#007bff', // Cor do texto do label
    fontSize: '14px', // Tamanho do texto
    marginBottom: '10px', // Espaço entre o label e o botão
    fontWeight: 'bold', // Tornar o texto em negrito
  },
  cadastrarBtn: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#007bff', // Cor de fundo do botão
    color: 'white',
    fontSize: '30px',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra suave
    transition: 'all 0.3s ease', // Transições suaves para hover
  },
  cadastrarBtnHover: {
    transform: 'scale(1.1)', // Efeito de aumento ao passar o mouse
    backgroundColor: '#0056b3', // Mudança na cor ao passar o mouse
  },
};

export default AdvogadosTela;
