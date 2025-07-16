import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { isAuthenticated, logout, fetchWithToken, getAccessToken } from './GerenciaToken';
import { jwtDecode } from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css';

let alreadyLoggingOut = false;

const useAuth = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (window.location.pathname === "/login") {
      alreadyLoggingOut = false;
    }
  }, []);

  const checkAuth = () => {
    return isAuthenticated();
  };

  const logoutWithRedirect = async () => {
    if (alreadyLoggingOut) return;
      alreadyLoggingOut = true;

    try {
      await logout();
      toast.warn('Sessão expirada, redirecionando para login...', {
        position: 'top-center',
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
        onClose: () => navigate('/login'),
      });
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
  };

  const getRole = () => {
    const token = getAccessToken();
    if (!token) return null;
    const decoded = jwtDecode(token);
    const role = decoded.role;
    return role ? role.replace('ROLE_', '') : null;
  };

  const fetchAuthenticated = async (url, options = {}) => {
    const response = await fetchWithToken(url, options);
    if (response.status === 401) {
      console.warn('Token inválido ou expirado, fazendo logout...');
      await logoutWithRedirect();
    }
    return response;
  };

  return {
    checkAuth,
    getId,
    getRole,
    logoutWithRedirect,
    fetchAuthenticated,
  };
};

export default useAuth;