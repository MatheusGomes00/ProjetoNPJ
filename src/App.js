import { Routes, Route } from 'react-router-dom'; // Importando Routes e Route
import Sidebar from './components/ComponentesPadroes/Sidebar'; // Sidebar é renderizada apenas uma vez
import AreaDeTrabalho from './components/AreaDeTrabalho/AreaDeTrabalho';
import AdvogadosTela from './components/Advogados/AdvogadosTela';
import TarefasMain from './components/Tarefas/TarefasMain';
import AdvogadoDetails from './components/Advogados/AdvogadoDetails';
import SearchBar from './components/Advogados/Searchbar';

function App() {
  return (
    <div className="app-container">
      
      <Sidebar />
      <div className="main-content">
        <Routes>
          
          <Route path="/" element={<AreaDeTrabalho />} />

          <Route path="/tarefas" element={<TarefasMain />} /> {/* Nova rota adicionada */}
          <Route path="/advogados" element={<AdvogadosTela />} />
          <Route path="/" element={<SearchBar />} />
        <Route path="/detalhes/:id" element={<AdvogadoDetails />} /> {/* Rota para detalhes */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
