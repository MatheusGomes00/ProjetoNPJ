import React from "react";
import Sidebar from "../ComponentesPadroes/Sidebar";
import SearchBarTop from "../ComponentesPadroes/SearchBarTop";
import IconeLogOut from "../botoesTelaImovel/IconeLogOut";
import IconeNotificacoes from "../botoesTelaImovel/IconeNotificacoes";
import IconeNovaTarefa from "../botoesTelaImovel/IconeNovaTarefa"; // Adicionando o IconeNovaTarefa, conforme sugerido.

const ComponentesFixos = () => {
  return (
    <div className="componentes-fixos">
      <SearchBarTop />

      <div className="top-right-icons">
        <IconeNotificacoes />
        <IconeLogOut />
        <IconeNovaTarefa />
      </div>

      <div className="horizontal-line"></div>

      <div className="corner-label">
        <span className="corner-label-npj">NPJ</span>
        <br />
        <span className="corner-label-anhanguera">ANHANGUERA</span>
      </div>

      <Sidebar />
    </div>
  );
};

export default ComponentesFixos;