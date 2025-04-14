import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import AreaDeTrabalho from "./components/AreaDeTrabalho/AreaDeTrabalho";
import TarefasMain from "./components/Tarefas/TarefasMain";
import AdvogadosTela from "./components/Advogados/AdvogadosTela";
import SearchBar from "./components/Advogados/Searchbar";
import { isAuthenticated } from "./components/Seguranca/GerenciaToken";
import Processos from "./components/Processos/ProcessosMain";
import ClientesMain from "./components/Clientes/ClientesMain";
import DetalhesClientes from "./components/Clientes/DetalhesClientes";


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
          element={isAuthenticated() ? <AreaDeTrabalho /> : <Navigate to="/login" />}
        />
        <Route
          path="/tarefas"
          element={isAuthenticated() ? <TarefasMain /> : <Navigate to="/login" />}
        />
        <Route
          path="/processos"
          element={isAuthenticated() ? <Processos /> : <Navigate to="/login" />}
        />
        <Route
          path="/advogados"
          element={isAuthenticated() ? <AdvogadosTela /> : <Navigate to="/login" />}
        />
        <Route
          path="/search"
          element={isAuthenticated() ? <SearchBar /> : <Navigate to="/login" />}
        />
        <Route
          path="/clientes"
          element={isAuthenticated() ? <ClientesMain /> : <Navigate to="/login" />}
        />
         <Route
          path="/clientes/:id"
          element={isAuthenticated() ? <DetalhesClientes /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
