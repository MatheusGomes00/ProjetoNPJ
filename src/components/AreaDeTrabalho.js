import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import SearchBarTop from "./SearchBarTop";
import IconeLogOut from "./botoesTelaImovel/IconeLogOut";
import IconeNotificacoes from "./botoesTelaImovel/IconeNotificacoes";
import IconeNovaTarefa from "./botoesTelaImovel/IconeNovaTarefa";

function AreaDeTrabalho() {
  return (
    <div className="app-container">
      <SearchBarTop />
      <div className="top-right-icons">
        <IconeLogOut />
        <IconeNotificacoes />
        <IconeNovaTarefa />
      </div>
      <div className="horizontal-line"></div>
      <div className="corner-label">
        <span className="corner-label-npj">NPJ</span>
        <br />
        <span className="corner-label-anhanguera">ANHANGUERA</span>
      </div>
      <Sidebar />
      <div className="tarefas-expirando-hoje">
        Tarefas e prazos que expiram hoje
      </div>
      
    </div>
  );
}

export default AreaDeTrabalho;