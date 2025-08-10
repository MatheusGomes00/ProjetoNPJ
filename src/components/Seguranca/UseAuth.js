import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchWithToken, getAccessToken } from './GerenciaToken';
import { useAuthContext } from './AuthContext';
import 'react-toastify/dist/ReactToastify.css';

let alreadyLoggingOut = false;

const useAuth = () => {
  const navigate = useNavigate();
  const {
    isSessionInvalid,
    isAuthenticated,
    user,
    logout,
    markSessionAsInvalid,
    setTokenRef,
    tokenRef,
  } = useAuthContext();
  
  useEffect(() => {
    if (window.location.pathname === "/login") {
      alreadyLoggingOut = false;
    }
  }, []);

  const checkAuth = () => isAuthenticated;

  const userLogout = async () => {
    await logout();
    navigate('/login');
  }

  const logoutWithRedirect = async () => {
    if (alreadyLoggingOut) return;
      alreadyLoggingOut = true;

    try {
      markSessionAsInvalid();
      await logout();
      
      navigate('/login');
    } catch (error) {
      console.error('Erro ao realizar logout:', error.message);
      navigate('/login');
    }
  };

  const getId = () => {
    return user?.id || null;
  };

  const getRole = () => {
    return user?.role || null;
  };

  const fetchAuthenticated = async (url, options = {}) => {
    if (!checkAuth()) return;
    if (isSessionInvalid) return;

    const apiUrl = `${process.env.REACT_APP_API_URL}${url}`;
    const response = await fetchWithToken(apiUrl, options);
    const currentToken = getAccessToken(); 
    if (currentToken !== tokenRef) {
      setTokenRef(currentToken);
    }   
    if (response.status === 401) {
      markSessionAsInvalid();
      console.warn('Token inválido ou expirado, fazendo logout...');
      if (!alreadyLoggingOut) {
        await logoutWithRedirect();
      }
      return;
    }
    return response;
  };

  return {
    getId,
    getRole,
    logoutWithRedirect,
    userLogout,
    fetchAuthenticated,
  };
};

export default useAuth;