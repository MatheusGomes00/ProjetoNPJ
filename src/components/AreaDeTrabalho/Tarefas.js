import React from 'react';
import './Tarefas.js';

function Tarefas() {
  const tarefas = [
    { id: 1, titulo: 'Tarefa 1', descricao: 'Descrição da primeira tarefa', prioridade: 'maxima' },
    { id: 2, titulo: 'Tarefa 2', descricao: 'Descrição da segunda tarefa', prioridade: 'media'  },
    { id: 3, titulo: 'Tarefa 3', descricao: 'Descrição da terceira tarefa', prioridade: 'baixa' },
  ];

  const getPrioridadeClasse = (prioridade) => {
    switch (prioridade) {
      case 'baixa': return 'indicador verde';
      case 'media': return 'indicador amarelo';
      case 'alta': return 'indicador laranja';
      case 'maxima': return 'indicador vermelho';
      default: return 'indicador';
    }
  };
  return (
    <div className="tarefas-container">
      {tarefas.map((tarefa) => (
        <div key={tarefa.id} className="tarefa-card">
          <h2>{tarefa.titulo}</h2>
          <p>{tarefa.descricao}</p>
         
          <div className="indicadores">
            <span className={getPrioridadeClasse(tarefa.prioridade)}></span>
          </div>

        </div>
      ))}
    </div>
  );
}

export default Tarefas;