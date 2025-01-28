import React, { useState } from 'react';
import SearchBar from './components/SearchBar'; 
import ResultsList from './components/ResultsList';  
import Sidebar from './components/Sidebar';
import SearchBarTop from './components/SearchBarTop';
import IconeLogOut from './components/botoesTelaImovel/IconeLogOut';
import IconeNotificacoes from './components/botoesTelaImovel/IconeNotificacoes';
import IconeNovaTarefa from './components/botoesTelaImovel/IconeNovaTarefa';

function App() {
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
          {/* Passa a função buscarClientes para o SearchBar */}
          <SearchBar onSearch={buscarClientes} /> 
          {/* Passa os clientes encontrados para o ResultsList */}
          <ResultsList clientes={clientes} /> 
        </div>
      </div>
    </div>
  );
}

export default App;
