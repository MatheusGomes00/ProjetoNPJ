import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getAccessToken, logout as logoutStorage, isAuthenticated as checkToken } from './GerenciaToken';
import { jwtDecode } from 'jwt-decode';
import {iniciarConexaoWebSocket, limparConexaoWebSocket, } from '../../websocket/socketConfig'

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const processedNotificationIds = useRef(new Set());
  const isMountedRef = useRef(true);
  const [tokenRef, setTokenRef] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(checkToken());
  const [isSessionInvalid, setIsSessionInvalid] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
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
    setIsAuthenticated(true);
    setIsSessionInvalid(false);
    setTokenRef(getAccessToken());
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
    limparConexaoWebSocket({
      stompClientRef,
      subscriptionRef,
      processedNotificationIds
    });
  };

  useEffect(() => {
    if(isAuthenticated && tokenRef){
      const decoded = jwtDecode(tokenRef);
      iniciarConexaoWebSocket({
        userId: decoded.sub,
        token: tokenRef,
        stompClientRef,
        subscriptionRef,
        processedNotificationIds,
        isMountedRef,
        setNotificacoes,
        onError: (msg) => {
          console.error("Erro WebSocket:", msg);
        }
      });
    }
    return () => {
      isMountedRef.current = false;
      limparConexaoWebSocket({
        stompClientRef,
        subscriptionRef,
        processedNotificationIds
      });
    };
  }, [isAuthenticated, tokenRef]);


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
        notificacoes,
        setNotificacoes,
        processedNotificationIds,
        isMountedRef,
        setTokenRef,
        tokenRef,
        resetarNotificacoes: () => setNotificacoes([]),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
