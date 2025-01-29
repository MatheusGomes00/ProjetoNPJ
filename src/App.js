import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Importando Routes e Route
import Sidebar from './components/Sidebar';
import AreaDeTrabalho from './components/AreaDeTrabalho';
import SearchBar from './components/Searchbar';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Routes>
          {/* Página inicial */}
          <Route path="/" element={<AreaDeTrabalho />} />

          {/* Página de Advogados */}
          <Route path="/advogados" element={<SearchBar />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
