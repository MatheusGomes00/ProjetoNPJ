import React from 'react';

import { Routes, Route } from 'react-router-dom'; // Apenas importando Routes e Route

import Sidebar from './components/Sidebar';
import AreaDeTrabalho from './components/AreaDeTrabalho';

import GerenciarAdvogados from './components/Advogados/GerenciarAdvogados';


function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Routes>
          {/* Página inicial */}
          <Route path="/" element={<AreaDeTrabalho />} />

          {/* Página de Advogados */}
          <Route path="/advogados" element={<GerenciarAdvogados />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
