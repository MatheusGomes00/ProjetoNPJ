import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove o token
    localStorage.removeItem("token");
    // Redireciona para a página de login
    navigate("/login");
  };

  return (
    <div>
      <h2>Bem-vindo à Home</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
