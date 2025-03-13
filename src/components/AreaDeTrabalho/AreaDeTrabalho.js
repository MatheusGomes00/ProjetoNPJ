import React from "react";
import Sidebar from "../ComponentesPadroes/Sidebar";
import SearchBarTop from "../ComponentesPadroes/SearchBarTop";
import IconeLogOut from "../botoesTelaImovel/IconeLogOut";
import IconeNotificacoes from "../botoesTelaImovel/IconeNotificacoes";
import IconeNovaTarefa from "../botoesTelaImovel/IconeNovaTarefa";
import Tarefas from "./Tarefas";
import Notificacoes from "./Notificacoes";


function AreaDeTrabalho() {
  
  return (
    <div className="app-container">

      
      <Sidebar />
      
      <SearchBarTop />

      
      <div className="top-right-icons">
        <IconeLogOut />
        <IconeNotificacoes />
        <IconeNovaTarefa />
      </div>

      

      {/* Layout com Sidebar e grid de conteúdo */}
      <div className="main-layout">
        {/* Grid ao lado direito da Sidebar */}
        <div className="grid-container">
          {/* Células do grid */}
          <div className="grid-item"></div>
          <div className="grid-item"></div>
          <div className="grid-item">
            {/* Adicionando o componente de Tarefas no grid */}
            <Tarefas />
          </div>
        </div>
      </div>
      

      {/* Rótulo no canto */}
      <div className="corner-label">
        <span className="corner-label-npj">NPJ</span>
        <br />
        <span className="corner-label-anhanguera">ANHANGUERA</span>
      </div>
      <Notificacoes/>
    </div>
    
  );
}

export default AreaDeTrabalho;
