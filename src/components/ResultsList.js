import React from 'react';

function ResultsList({ clientes }) {
  const handleClick = (cliente) => {
    // Aqui você pode adicionar a lógica para o que deve acontecer quando um cliente for clicado
    alert(`Cliente selecionado: ${cliente.nome}`);
  };

  return (
    <div className="results-list">
      {clientes.length > 0 ? (
        clientes.map((cliente, index) => (
          <div
            key={index}
            className="result-card"
            onClick={() => handleClick(cliente)}
          >
            <div className="result-card-header">
              <h3>{cliente.nome}</h3>
            </div>
            <div className="result-card-body">
              <p><strong>CPF:</strong> {cliente.cpf}</p> {/* Exibindo CPF */}
              {/* Status será mostrado como uma bolinha verde ou vermelha */}
              <div className="status-indicator">
                <span className={`status-badge ${cliente.status ? "active" : "inactive"}`} />
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Nenhum cliente encontrado.</p>
      )}
    </div>
  );
}

export default ResultsList;
