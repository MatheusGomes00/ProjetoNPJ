import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAccessToken, logout as logoutStorage, isAuthenticated as checkToken } from './GerenciaToken';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(checkToken());
  const [isSessionInvalid, setIsSessionInvalid] = useState(false);
  const [user, setUser] = useState(() => {
    const token = getAccessToken();
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return {
        id: decoded.sub,
        role: decoded.role?.replace('ROLE_', '') || null,
      };
    } catch {
      return null;
    }
  });

  // Sincroniza autenticação se o token mudar
  useEffect(() => {
    setIsAuthenticated(checkToken());
  }, []);

  const login = (token) => {
    // Você pode estender para salvar o token aqui
    setIsAuthenticated(true);
    setIsSessionInvalid(false);
    try {
      const decoded = jwtDecode(token);
      setUser({
        id: decoded.sub,
        role: decoded.role?.replace('ROLE_', '') || null,
      });
    } catch {
      setUser(null);
    }
  };

  const logout = () => {
    logoutStorage(); // limpa token e dados no localStorage/sessionStorage
    setIsAuthenticated(false);
    setIsSessionInvalid(false);
    setUser(null);
  };

  const markSessionAsInvalid = () => {
    setIsSessionInvalid(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isSessionInvalid,
        user,
        login,
        logout,
        markSessionAsInvalid,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
