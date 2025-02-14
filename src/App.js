import { Routes, Route } from 'react-router-dom'; // Importando Routes e Route
import Sidebar from './components/Sidebar'; // Sidebar é renderizada apenas uma vez
import AreaDeTrabalho from './components/AreaDeTrabalho/AreaDeTrabalho';
import AdvogadosTela from './components/Advogados/AdvogadosTela';

function App() {
  return (
    <div className="app-container">
      
      <Sidebar />
      <div className="main-content">
        <Routes>
          
          <Route path="/" element={<AreaDeTrabalho />} />

         
          <Route path="/advogados" element={<AdvogadosTela />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
