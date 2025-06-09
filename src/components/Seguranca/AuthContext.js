import React, { createContext, useCallback } from 'react';
import fetchWithToken from './GerenciaToken';
import useAuth from './UseAuth';



// Criação do contexto
const AuthContext = createContext({
  fetchAuthenticated: async () => {},
  getId: () => '',
});

// Provedor do contexto
const AuthProvider = ({ children }) => {
  const { logoutWithRedirect } = useAuth();

  const fetchAuthenticated = useCallback(
    async (url, options = {}) => {
      const response = await fetchWithToken(url, options);
      if (response.status === 401) {
        console.warn('Token inválido ou expirado, fazendo logout...');
        await logoutWithRedirect();
        return response;
      }
      return response;
    },
    [logoutWithRedirect]
  );

  // Valor fornecido pelo contexto
  const value = {
    fetchAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };