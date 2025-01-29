import React, { useState } from 'react';
import SearchBarTop from './SearchBarTop';
import IconeLogOut from './botoesTelaImovel/IconeLogOut';
import Sidebar from './Sidebar';
import IconeNotificacoes from './botoesTelaImovel/IconeNotificacoes';
import ResultsList from './ResultsList';





function SearchBar() {
  const [clientes, setClientes] = useState([]);  // Armazena os clientes retornados da API
  const [nome, setNome] = useState('');  // Armazena o nome digitado no SearchBar
  
  // Função chamada ao submeter o nome de busca
  const buscarClientes = async (nome) => {
    try {
      const response = await fetch(`http://localhost:8080/adv/buscanome/${nome}`);  // Faz a requisição à API
      const data = await response.json();
      setClientes(data);  // Armazena os clientes retornados
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  return (
    <div className="app-container">
      <h1 className="advogados-title">Gerenciar Advogados</h1> {/* Título reposicionado */}
      
      <div className="main-content">
        <SearchBarTop onSearch={buscarClientes} />  {/* Aqui passa a função buscarClientes */}
        <div className='top-right-icons'>
          <IconeLogOut />
          <IconeNotificacoes />
          <IconeLogOut />
        </div>
        <div className="horizontal-line"></div>
        
        <div className="corner-label">
          <span className="corner-label-npj">NPJ</span>
          <br />
          <span className="corner-label-anhanguera">ANHANGUERA</span>
        </div>
        
        <Sidebar /> 
        
        <div className="content">
        
          {/* Passa os clientes encontrados para o ResultsList */}
          <ResultsList clientes={clientes} /> 
        </div>
      </div>
    </div>
  );
}
export default SearchBar;
