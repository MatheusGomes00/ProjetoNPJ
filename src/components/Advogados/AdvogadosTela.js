import React, { useState, useEffect } from "react";
import SearchBar from "../Advogados/Searchbar";
import CadastrarAdvogado from "./CadastrarAdvogado";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import axios from "axios"


function AdvogadosTela() {
  const [results, setResults] = useState([]); 
  const [showCadastro, setShowCadastro] = useState(false);
  const [selectedAdvogado, setSelectedAdvogado] = useState(null);

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

  const fetchAdvogados = async () => {
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
  };

  useEffect(() => {
    fetchAdvogados();
  }, []);

  // Função para abrir o modal com os detalhes do advogado
  const handleAdvogadoClick = (advogado) => {
    setSelectedAdvogado(advogado);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setSelectedAdvogado(null);
  };

  return (
    <div className="app-container">
      <ComponentesFixos />

      <div className="content-container">
        <div className="search-container">
          <SearchBar onSearch={(searchResults) => setResults(searchResults)} />

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

        <div style={styles.gridContainer}>
          {results.map((advogado, index) => (
            <div
              key={index}
              style={styles.card}
              onClick={() => handleAdvogadoClick(advogado)}
            >
              <h4>{advogado.nome}</h4>
              <p>{advogado.cpf}</p>
              <p>{advogado.status}</p>
            </div>
          ))}
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
              <p><strong>Status:</strong> {selectedAdvogado.status}</p>
              <button onClick={handleCloseModal}>Fechar</button>
            </div>
          </div>
        )}

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
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "16px",
    justifyContent: "center",
    marginTop: "20px",
  },
  card: {
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "transform 0.3s ease",
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
    width: "300px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
};

export default AdvogadosTela;
