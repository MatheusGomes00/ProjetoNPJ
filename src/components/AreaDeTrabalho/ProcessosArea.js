// ProcessosArea.js
import React, { useState } from "react";

const processos = [
  { id: 1, numero: 88 },
  { id: 2, numero: 90 },
  { id: 3, numero: 79 },
  { id: 4, numero: 79 },
  { id: 5, numero: 88 },
  { id: 6, numero: 88 },
];

const ProcessosArea = () => {
  const [selecionado, setSelecionado] = useState(null);

  const handleSelecionar = (id) => {
    setSelecionado(id);
  };

  return (
    <div style={styles.container}>
      <div style={styles.linha}></div> {/* Linha vertical */}
      <h3 style={styles.titulo}>Meus Processos</h3>
      <div style={styles.lista}>
        {processos.map((processo) => (
          <div
            key={processo.id}
            style={{
              ...styles.card,
              background: selecionado === processo.id ? "#dfe6e9" : "#fff",
            }}
            onClick={() => handleSelecionar(processo.id)}
          >
            <img
              src="https://via.placeholder.com/50"
              alt="User"
              style={styles.imagem}
            />
            <span style={styles.texto}>Processo Número {processo.numero}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    right: "20px",
    top: "150px",
    background: "#f5edf9",
    padding: "20px",
    borderRadius: "25px",
    width: "350px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    height: "660px",
  },
  linha: {
    width: "1px",
    height: "150%",
    background: "#000000",
    borderRadius: "5px",
    position: "absolute",
    left: "-10px",
    top: "-50px",
  },
  titulo: {
    marginBottom: "15px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  lista: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  card: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    padding: "15px",
    borderRadius: "15px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    
    /* Animação ao passar o mouse */
    ":hover": {
      transform: "scale(1.05)",
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
    },
  },
  imagem: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    marginRight: "15px",
  },
  texto: {
    fontSize: "16px",
    fontWeight: "500",
  },
};

export default ProcessosArea;
