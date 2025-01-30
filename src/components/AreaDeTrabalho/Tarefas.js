import React from 'react';
import './Tarefas.js';

function Tarefas() {
  const tarefas = [
    { id: 1, titulo: 'Tarefa 1', descricao: 'Descrição da primeira tarefa' },
    { id: 2, titulo: 'Tarefa 2', descricao: 'Descrição da segunda tarefa' },
    { id: 3, titulo: 'Tarefa 3', descricao: 'Descrição da terceira tarefa' },
  ];

  return (
    <div className="tarefas-container">
      {tarefas.map((tarefa) => (
        <div key={tarefa.id} className="tarefa-card">
          <h2>{tarefa.titulo}</h2>
          <p>{tarefa.descricao}</p>
        </div>
      ))}
    </div>
  );
}

export default Tarefas;