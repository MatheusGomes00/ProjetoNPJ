import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../Advogados/Searchbar";
import CadastrarAdvogado from "./CadastrarAdvogado";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import ResultsList from "../Advogados/ResultsList";
import axios from "axios"


function AdvogadosTela() {
  const [results, setResults] = useState([]); 
  const [showCadastro, setShowCadastro] = useState(false);
  const [defaultResults, setDefaultResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const transformAdvogadosData = (data) => {
    return data.map((advogado) => {
      // Remover o campo 'id' e alterar o status
      const { id, status, ...rest } = advogado;
      return {
        ...rest,
        status: status ? "ATIVO" : "DESATIVADO", // Converte o status
      };
    });
  };

  const getToken = () => {
    return localStorage.getItem("token"); // Certifique-se de que o token está salvo corretamente
  };

  const fetchAdvogados = useCallback(async () => {
    try {
      const token = getToken();
      const response = await axios.get('http://localhost:8080/adv/buscarTodos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const transformedData = transformAdvogadosData(response.data);
      setResults(transformedData); 
      setDefaultResults(transformedData)
    } catch (error) {
      console.error("Erro ao buscar advogados:", error);
    }
  }, []);

  useEffect(() => {
    fetchAdvogados();
  }, [fetchAdvogados]);

  const handleSearch = (searchResults) => {
    if (searchResults.length > 0) {
      setResults(searchResults);
      setIsSearching(true);
    } else {
      setResults(defaultResults); // Se não houver resultados, volta para a lista original
      setIsSearching(false);
    }
  };

  return (
    <div className="app-container">
      <ComponentesFixos />
      
      <div style={styles.quadroContainer}>
        
        <div style={styles.searchSection}>
          <SearchBar onSearch={handleSearch} />
          <button onClick={() => setShowCadastro(true)} style={styles.cadastrarBtn} > + </button>
        </div>

        <div style={styles.resultsContainer}>
          <ResultsList results={results} />
        </div>
      </div>

      {showCadastro && <CadastrarAdvogado onClose={() => setShowCadastro(false)} />}
    </div>
    );
  }

const styles = {
  quadroContainer: {
    width: "90%",
    maxWidth: "900px", // Ajuste conforme necessário
    margin: "20px auto",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  searchSection: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "10px",
    borderBottom: "2px solid #eee", // Linha separadora
    gap: "30px",
  },
  cadastrarBtn: {
    width: '80px',
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
    marginLeft: '10px',
  },
  resultsContainer: {
    width: "100%",
    marginTop: "20px", // Garante espaçamento abaixo da barra de pesquisa
  },
};

export default AdvogadosTela;
