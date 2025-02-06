import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "../Sidebar";
import SearchBarTop from "../SearchBarTop";
import IconeLogOut from "../botoesTelaImovel/IconeLogOut";
import IconeNotificacoes from "../botoesTelaImovel/IconeNotificacoes";
import IconeNovaTarefa from "../botoesTelaImovel/IconeNovaTarefa";

function AreaDeTrabalho() {
  return (
    <div className="app-container">
      <Sidebar />
      {/* Barra de pesquisa no topo */}
      <SearchBarTop />

      {/* Ícones no canto superior direito */}
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
          <div className="grid-item"></div>
        </div>
      </div>

      {/* Rótulo no canto */}
      <div className="corner-label">
        <span className="corner-label-npj">NPJ</span>
        <br />
        <span className="corner-label-anhanguera">ANHANGUERA</span>
      </div>
    </div>
  );
}

export default AreaDeTrabalho;
