// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from './authService';
import { roles } from './users';

// Cria o contexto
const AuthContext = createContext();

// Hook personalizado para usar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Efeito para carregar o usuário atual ao iniciar
  useEffect(() => {
    const checkAuthentication = () => {
      try {
        if (authService.isAuthenticated()) {
          setCurrentUser(authService.getCurrentUser());
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // Função de login
  const login = async (username, password) => {
    setAuthError(null);
    setLoading(true);
    
    try {
      const authData = await authService.login(username, password);
      setCurrentUser(authData.user);
      return authData.user;
    } catch (error) {
      setAuthError(error.message || 'Erro ao fazer login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setCurrentUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar o usuário
  const updateUser = async (userData) => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateUser(userData);
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verifica se o usuário tem uma determinada permissão
  const hasPermission = (permission) => {
    if (!currentUser) return false;
    
    const userRole = roles[currentUser.role];
    if (!userRole) return false;
    
    return userRole.permissions.includes('all') || 
           userRole.permissions.includes(permission);
  };

  // Valor a ser fornecido pelo contexto
  const value = {
    currentUser,
    loading,
    authError,
    login,
    logout,
    updateUser,
    hasPermission,
    isAdmin: currentUser?.role === 'admin',
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};