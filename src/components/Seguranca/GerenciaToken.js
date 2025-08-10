

// const API_BASE_URL = 'http://localhost:8080/auth';
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/auth`

export const getAccessToken = () => {
  return sessionStorage.getItem('accessToken');
};

const setAccessToken = (accessToken) => {
  sessionStorage.setItem('accessToken', accessToken);
};

const clearAccessToken = () => {
  sessionStorage.removeItem('accessToken');
  localStorage.removeItem('token');
};

export const login = async (username, password) => {
  try {
      
    if (!username || !password || username.trim() === '' || password.trim() === '') {
        throw new Error('CPF ou Senha não podem estar em branco.');
    }

    const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
          throw new Error('CPF ou Senha incorretos.');
      }

      const data = await response.json();
      const accessToken = data.accessToken;

      if (!accessToken) {
          throw new Error('Access token não retornado');
      }

      setAccessToken(accessToken);

  } catch (error) {
      console.error('Erro no login:', error.message);
      throw error;
  }
};

export const refreshToken = async () => {
  try {
      const response = await fetch(`${API_BASE_URL}/refresh-token`, {
          method: 'POST',
          credentials: 'include', // Envia o cookie refreshToken automaticamente
          headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
          throw new Error('Falha ao renovar o token');
      }

      const data = await response.json();
      const newAccessToken = data.accessToken;

      if (!newAccessToken) {
          throw new Error('Novo access token não retornado');
      }

      setAccessToken(newAccessToken);

      return newAccessToken; 
  } catch (error) {
      console.error('Erro ao renovar o token:', error.message);
      sessionStorage.removeItem('accessToken');

      //  import Alert from '@mui/material/Alert';
      // <Alert variant="filled" severity="warning">
      // This is a filled warning Alert.
      // </Alert>


      // window.location.href = '/login';
      throw error;
  }
};

export const logout = async () => {
  try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include', // Envia o cookie refreshToken para o backend
      });
      clearAccessToken();
      // window.location.href = '/login';
  } catch (error) {
      console.error('Erro no logout:', error.message);
      
      clearAccessToken();
      throw error; 
  }
};

export const isAuthenticated = () => {
  return !!sessionStorage.getItem("accessToken");
};

let isRefreshing = false;

let refreshPromise = null;

export const fetchWithToken = async (url, options = {}) => {
  const token = getAccessToken();

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(url, { 
      ...options,
      headers,
    });

    if (response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshToken()
          .then((newAccessToken) => {
            isRefreshing = false;
            refreshPromise = null;
            return newAccessToken;
          })
          .catch((error) => {
            isRefreshing = false;
            refreshPromise = null;
            console.error('Erro ao renovar token:', error.message);
            // Retorna uma resposta com status 401 para acionar logout
            return new Response(null, { status: 401 });
          });
      }

      // Aguarda a renovação do token
      const newAccessToken = await refreshPromise;

      // Repete a requisição com o novo token
      const newHeaders = {
        ...headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      return await fetch(url, {
        ...options,
        headers: newHeaders,
      });
    }

    return response;
  } catch (error) {
    console.error(`Erro na requisição ${url}:`, error.message);
    throw error;
  }
};
const tokenManager = {
    getAccessToken, login, logout, isAuthenticated, fetchWithToken
}

export default tokenManager;