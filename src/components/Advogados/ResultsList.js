// ResultsList.js
import React from 'react';

const ResultsList = ({ clientes }) => {
  if (!clientes || clientes.length === 0) {
    return <p>Nenhum cliente encontrado.</p>;
  }

  return (
    <div>
      {clientes.map((cliente, index) => (
        <div key={index}>
          <p>{cliente.nome}</p> {/* Supondo que o cliente tem um campo 'nome' */}
          {/* Renderize outras informações do cliente aqui */}
        </div>
      ))}
    </div>
  );
};

export default ResultsList;
