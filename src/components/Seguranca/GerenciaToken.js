const API_BASE_URL = 'http://localhost:8080/auth';

const getAccessToken = () => {
  return sessionStorage.getItem('accessToken');
};

const setAccessToken = (accessToken) => {
  sessionStorage.setItem('accessToken', accessToken);
};

const clearAccessToken = () => {
  sessionStorage.removeItem('accessToken');
};

export const login = async (username, password) => {
  try {
      
    if (!username || !password || username.trim() === '' || password.trim() === '') {
        throw new Error('CPF ou Senha não podem estar em branco.');
    }

    const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
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
      throw error;
  }
};

export const logout = async () => {
  try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          credentials: 'include', // Envia o cookie refreshToken para o backend
      });

      if (!response.ok) {
          throw new Error('Falha ao realizar logout');
      }

      clearAccessToken();
  } catch (error) {
      console.error('Erro no logout:', error.message);
      
      clearAccessToken();
      throw error; 
  }
};

export const isAuthenticated = () => {
  const token = getAccessToken();
  return !!token; 
};


export const fetchWithToken = async (url, options = {}) => {

    const headers = { ...options.headers } || {};
    
    const accessToken = getAccessToken();
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    let response = await fetch(url, {
        ...options,
        headers,
    });

    // token expirado
    if (response.status === 401) {
        try {
            const newAccessToken = await refreshToken();

            headers['Authorization'] = `Bearer ${newAccessToken}`;

            response = await fetch(url, {
                ...options,
                headers,
            });
        } catch (refreshError) {
            console.error('Erro ao renovar token durante fetch:', refreshError.message);
            throw refreshError; 
        }
    }
    return response;
};

const tokenManager = {
    login, logout, isAuthenticated, fetchWithToken
}

export default tokenManager;