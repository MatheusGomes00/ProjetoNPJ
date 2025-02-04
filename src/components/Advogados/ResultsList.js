import React from "react";

function ResultsList({ results }) {
  return (
    <div className="results-list">
      {results.length > 0 ? (
        <ul>
          {results.map((result, index) => (
            <li key={index} className="result-item">
              <div>{result.nome}</div> {/* Verifique se o campo é 'nome' */}
              <div>{result.cpf}</div> {/* Verifique se o campo é 'nome' */}
              
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum resultado encontrado.</p>
      )}
    </div>
  );
}

export default ResultsList;
