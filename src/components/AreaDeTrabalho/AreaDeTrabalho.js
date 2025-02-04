import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "../Sidebar";
import SearchBarTop from "../SearchBarTop";
import IconeLogOut from "../botoesTelaImovel/IconeLogOut";
import IconeNotificacoes from "../botoesTelaImovel/IconeNotificacoes";
import IconeNovaTarefa from "../botoesTelaImovel/IconeNovaTarefa";
import ResultsList from "../Advogados/ResultsList"; // Import the ResultsList component
import SearchBar from "../Advogados/Searchbar";
import Tarefas from "./Tarefas";
import Notificacao from "./Notificacoes";
import ProcessosArea from "./ProcessosArea";


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
      <hr className="linha-horizontal" /> {/* Adiciona a linha horizontal */}
      <div class="notificacoes-hoje">Notificações de hoje:</div>
      {/* Rótulo no canto */}
      <div className="corner-label">
        <span className="corner-label-npj">NPJ</span>
        <br />
        <span className="corner-label-anhanguera">ANHANGUERA</span>
      </div>

      {/* Sidebar */}
      <Sidebar onAdvogadosClick={() => setActivePage("advogados")} />
      <Notificacao />
      <ProcessosArea />
      
      {/* Conteúdo dinâmico */}
      <div className="content-container">
        {activePage === "home" && (
          <div className="tarefas-expirando-hoje">
            Tarefas e prazos que expiram hoje
          </div>
          
        )}
        
        {activePage === "advogados" && (
          <div className="advogados-content">
            
          </div>
          
        )}
      </div>
    </div>
  );
}

export default AreaDeTrabalho;
