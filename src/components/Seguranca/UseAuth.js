import { useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, fetchWithToken } from './GerenciaToken';

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

    // Wrapper para fetchWithToken com tratamento de autenticação
    const fetchAuthenticated = async (url, options = {}) => {
        try {
        const response = await fetchWithToken(url, options);
        if (!response.ok && response.status === 401) {
            await logoutWithRedirect(); // Logout e redireciona se não autorizado
        }
        return response;
        } catch (error) {
        console.error('Erro na requisição autenticada:', error.message);
        await logoutWithRedirect(); // Redireciona em caso de falha crítica
        throw error;
        }
    };
    return {
        checkAuth,          // Verifica se o usuário está autenticado
        logoutWithRedirect, // Faz logout e redireciona
        fetchAuthenticated, // Faz requisições autenticadas com tratamento
      };
};
    
export default useAuth;