import React from 'react';

function ResultsList({ clientes }) {
  if (!clientes || clientes.length === 0) {
    return <p>Nenhum cliente encontrado</p>;
  }

  return (
    <ul>
      {clientes.map((cliente) => (
        <li key={cliente.id}>{cliente.nome}</li>
      ))}
    </ul>
  );
}

export default ResultsList;
