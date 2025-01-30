import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import SearchBarTop from "./SearchBarTop";
import IconeLogOut from "./botoesTelaImovel/IconeLogOut";
import IconeNotificacoes from "./botoesTelaImovel/IconeNotificacoes";
import IconeNovaTarefa from "./botoesTelaImovel/IconeNovaTarefa";
import ResultsList from "./ResultsList"; // Import the ResultsList component
import SearchBar from "./Searchbar";
import Tarefas from "./AreaDeTrabalho/Tarefas";


function AreaDeTrabalho() {
  const [activePage, setActivePage] = useState("home"); // 'home' or 'advogados'

  return (
    <div className="app-container">
      {/* Barra de pesquisa no topo */}
      <SearchBarTop />

      {/* Ícones no canto superior direito */}
      <div className="top-right-icons">
        <IconeLogOut />
        <IconeNotificacoes />
        <IconeNovaTarefa />
      </div>
      <Tarefas /> {/* Renderizando as tarefas */}

      {/* Linha horizontal */}
      <div className="horizontal-line"></div>
      <div className="horizontal-line2"></div> 

      {/* Rótulo no canto */}
      <div className="corner-label">
        <span className="corner-label-npj">NPJ</span>
        <br />
        <span className="corner-label-anhanguera">ANHANGUERA</span>
      </div>

      {/* Sidebar */}
      <Sidebar onAdvogadosClick={() => setActivePage("advogados")} />

      {/* Conteúdo dinâmico */}
      <div className="content-container">
        {activePage === "home" && (
          <div className="tarefas-expirando-hoje">
            Tarefas e prazos que expiram hoje
          </div>
        )}
        
        {activePage === "advogados" && (
          <div className="advogados-content">
            <SearchBar />
            <ResultsList />
          </div>
        )}
      </div>
    </div>
  );
}

export default AreaDeTrabalho;
