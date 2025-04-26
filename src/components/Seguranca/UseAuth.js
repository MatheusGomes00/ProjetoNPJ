import { useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, fetchWithToken, getAccessToken } from './GerenciaToken';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
    const navigate = useNavigate();

    const checkAuth = () => {
        return isAuthenticated();
    };

    // Executa o logout e redireciona para a página de login
    const logoutWithRedirect = async () => {
        try {
          await logout(); // Limpa os tokens no frontend e backend
          navigate('/login');
        } catch (error) {
        console.error('Erro ao realizar logout:', error.message);
        navigate('/login');
        }
    };

    const getId = () => {
      const token = getAccessToken();
      if (!token) return null;
      const decoded = jwtDecode(token);
      return decoded.sub;
    }

    const getRole = () => {
      const token = getAccessToken();
      if (!token) return null;
      const decoded = jwtDecode(token);
      const role = decoded.role;
      return role ? role.replace("ROLE_", "") : null;
    }

    // Wrapper para fetchWithToken com tratamento de autenticação
    const fetchAuthenticated = async (url, options = {}) => {
      const response = await fetchWithToken(url, options);
      
      if (response.status === 401) {
        console.warn("Token inválido ou expirado, fazendo logout...");
        await logoutWithRedirect();
      }
      return response;
    };

    return {
        checkAuth,          // Verifica se o usuário está autenticado
        getId,
        getRole,
        logoutWithRedirect, // Faz logout e redireciona
        fetchAuthenticated, // Faz requisições autenticadas com tratamento
      };
};
    
export default useAuth;