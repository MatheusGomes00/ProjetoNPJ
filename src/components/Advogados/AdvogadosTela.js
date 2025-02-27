import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../Advogados/Searchbar";
import CadastrarAdvogado from "./CadastrarAdvogado";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import axios from "axios"


function AdvogadosTela() {
  const [results, setResults] = useState([]); 
  const [showCadastro, setShowCadastro] = useState(false);
  const [selectedAdvogado, setSelectedAdvogado] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    } catch (error) {
      console.error("Erro ao buscar advogados:", error);
    }
  }, []);

  useEffect(() => {
    fetchAdvogados();
  }, [fetchAdvogados]);

  // Função para abrir o modal com os detalhes do advogado
  const handleAdvogadoClick = (advogado) => {
    setSelectedAdvogado(advogado);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setSelectedAdvogado(null);
  };

  // Função de pesquisa
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filtra os resultados de acordo com a pesquisa
  const filteredResults = results.filter((advogado) =>
    advogado.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      <ComponentesFixos />
        <div style={styles.searchContainer}>
          <div style={styles.searchBarWrapper}>
          <SearchBar onSearch={handleSearch} />
            <button
              onClick={() => setShowCadastro(true)}
              style={styles.cadastrarBtn}
            >
              +
            </button>
            </div>
          </div>

          <div style={styles.gridContainer}>
            {filteredResults.length > 0 ? (
              filteredResults.map((advogado, index) => (
                <div
                  key={index}
                  style={styles.card}
                  onClick={() => handleAdvogadoClick(advogado)}
                >
                  <h4>{advogado.nome}</h4>
                  <p>{advogado.cpf}</p>
                  <p>{advogado.status ? "ATIVO" : "DESATIVADO"}</p>
                </div>
              ))
            ) : (
              <p>Não localizado</p>
            )}
          </div>

          {selectedAdvogado && (
            <div style={styles.modal} onClick={handleCloseModal}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3>Detalhes do Advogado</h3>
                <p><strong>Nome:</strong> {selectedAdvogado.nome}</p>
                <p><strong>Data de Nascimento:</strong> {selectedAdvogado.datanasc}</p>
                <p><strong>CPF:</strong> {selectedAdvogado.cpf}</p>
                <p><strong>Registro OAB:</strong> {selectedAdvogado.registroOab}</p>
                <p><strong>Seção OAB:</strong> {selectedAdvogado.secaoOab}</p>
                <p><strong>Status:</strong> {selectedAdvogado.status ? "ATIVO" : "DESATIVADO"}</p>
                <button onClick={handleCloseModal}>Fechar</button>
              </div>
            </div>
          )}

          {showCadastro && <CadastrarAdvogado onClose={() => setShowCadastro(false)} />}
        </div>
    );
  }

const styles = {
  searchContainer: {
    display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  padding: "10px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  searchBarWrapper: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    gap: "10px",
  },
  label: {
    color: '#007bff', // Cor do texto do label
    fontSize: '14px', // Tamanho do texto
    marginBottom: '5px', // Espaço entre o label e o botão
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
    marginLeft: '10px',
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
    justifyContent: "center",
    width: "100%",
    marginTop: "20px",
  },
  card: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "transform 0.3s ease",
    textAlign: "center",
  },
  cardHover: {
    transform: "scale(1.05)",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
};

export default AdvogadosTela;
