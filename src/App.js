import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import AreaDeTrabalho from "./components/AreaDeTrabalho/AreaDeTrabalho";
import TarefasMain from "./components/Tarefas/TarefasMain";
import AdvogadosTela from "./components/Advogados/AdvogadosTela";
import AdvogadoDetails from "./components/Advogados/AdvogadoDetails";
import SearchBar from "./components/Advogados/Searchbar";

const isAuthenticated = () => !!localStorage.getItem("token"); // Verifica se o usuário está logado

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
          path="/advogados"
          element={isAuthenticated() ? <AdvogadosTela /> : <Navigate to="/login" />}
        />
        <Route
          path="/detalhes/:id"
          element={isAuthenticated() ? <AdvogadoDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/search"
          element={isAuthenticated() ? <SearchBar /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
