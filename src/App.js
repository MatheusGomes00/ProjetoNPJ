import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import AreaDeTrabalho from "./components/AreaDeTrabalho/AreaDeTrabalho";
import TarefasMain from "./components/Tarefas/TarefasMain";
import AdvogadosMain from "./components/Advogados/AdvogadosMain";
import CriarAdvogados from "./components/Advogados/CriarAdvogados";
import DetalhesAdvogados from "./components/Advogados/DetalhesAdvogados";
import Processos from "./components/Processos/ProcessosMain";
import ClientesMain from "./components/Clientes/ClientesMain";
import DetalhesClientes from "./components/Clientes/DetalhesClientes";
import DetalhesProcesso from "./components/Processos/DetalhesProcessos";
import CriarClientes from "./components/Clientes/CriarClientes";
import CriarProcessosCliente from "./components/Clientes/CriarProcessosCliente";
import './App.css';


function App() {

  return (
    <div className="app-container">
      <Routes>
        {/* Página de Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        {/* Rotas Protegidas */}
        <Route
          path="/workspace"
          //element={isAuthenticated ? <AreaDeTrabalho /> : <Navigate to="/login" />}
          element={<AreaDeTrabalho />}
        />
        <Route
          path="/tarefas"
          // element={isAuthenticated ? <TarefasMain /> : <Navigate to="/login" />}
          element={<TarefasMain />}
        />
        <Route
          path="/processos"
          // element={isAuthenticated ? <Processos /> : <Navigate to="/login" />}
          element={<Processos />}
        />
        <Route
          path="/advogados"
          // element={isAuthenticated ? <AdvogadosMain /> : <Navigate to="/login" />}
          element={<AdvogadosMain />}
        />
        <Route
          path="/advogados/criar"
          // element={isAuthenticated ? <CriarAdvogados /> : <Navigate to="/login" />}
          element={<CriarAdvogados />}
        />
        <Route
          path="/advogados/:id"
          // element={isAuthenticated ? <DetalhesAdvogados /> : <Navigate to="/login" />}
          element={<DetalhesAdvogados />}
        />
        <Route
          path="/clientes"
          // element={isAuthenticated ? <ClientesMain /> : <Navigate to="/login" />}
          element={<ClientesMain />}
        />
         <Route
          path="/clientes/:id"
          // element={isAuthenticated ? <DetalhesClientes /> : <Navigate to="/login" />}
          element={<DetalhesClientes />}
        />
         <Route
          path="/clientes/criar"
          // element={isAuthenticated ? <CriarClientes /> : <Navigate to="/login" />}
          element={<CriarClientes />}
        />
        
        <Route
          path="/processos/:id"
          // element={isAuthenticated ? <DetalhesProcesso /> : <Navigate to="/login" />}
          element={<DetalhesProcesso />}
        />
        <Route
          path="/clientes/criarProc"
          // element={isAuthenticated ? <CriarProcessosCliente /> : <Navigate to="/login" />}
          element={<CriarProcessosCliente />}
        />
        
      </Routes>
    </div>
  );
  
}

export default App;
