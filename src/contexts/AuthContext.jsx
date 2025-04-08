// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { roles } from '../services/users';

// Adicionando o mapeamento de roles para links de BI
const roleToBILinks = {
  'administracao_central': 'https://app.powerbi.com/view?r=eyJrIjoiZjg5ZTRjYTUtNjI4MS00ZTMxLWEwZTctYjJiODFjNmQ2NjBiIiwidCI6IjZjNTkxNjdhLTVhYTAtNDk2Ni1hZTRiLWNiMjYzZWIwNTVkOCJ9',
  'admin': 'https://app.powerbi.com/view?r=eyJrIjoiZjg5ZTRjYTUtNjI4MS00ZTMxLWEwZTctYjJiODFjNmQ2NjBiIiwidCI6IjZjNTkxNjdhLTVhYTAtNDk2Ni1hZTRiLWNiMjYzZWIwNTVkOCJ9',
  'equipe_obras': 'https://app.powerbi.com/view?r=eyJrIjoiNTE3MzI2ZWQtZWU0Yi00ZTdmLWEwZTItNTU5ZThkNTE4YjkwIiwidCI6IjZjNTkxNjdhLTVhYTAtNDk2Ni1hZTRiLWNiMjYzZWIwNTVkOCJ9',
  'sem_acesso': null // sem acesso a BI
};

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

  // Efeito para inicializar o banco de dados e carregar o usuário atual
  useEffect(() => {
    const initialize = async () => {
      try {
        // Inicializa o banco de dados Supabase (se necessário)
        await authService.initDatabase();
        
        // Verifica autenticação
        if (authService.isAuthenticated()) {
          setCurrentUser(authService.getCurrentUser());
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Erro ao inicializar:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    initialize();
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

  // NOVO MÉTODO: Obter o link de BI baseado na role do usuário
  const getBILink = () => {
    if (!currentUser || !currentUser.role) return null;
    
    // Converter para lowercase para garantir a correspondência
    const userRole = currentUser.role.toLowerCase();
    
    // Se a role do usuário for 'admin', usar o mesmo link de 'administracao_central'
    if (userRole === 'admin') {
      return roleToBILinks['admin'];
    }
    
    // Retorna o link correspondente à role ou null se não houver correspondência
    return roleToBILinks[userRole] || null;
  };

  // Verifica se o usuário tem acesso a algum dashboard de BI
  const hasBIAccess = () => {
    return getBILink() !== null;
  };

  // ADICIONANDO AS FUNÇÕES DE RECUPERAÇÃO DE SENHA
  // Função para solicitar recuperação de senha
  const requestPasswordReset = async (emailOrUsername) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authService.requestPasswordReset(emailOrUsername);
      return result;
    } catch (error) {
      setAuthError(error.message || 'Erro ao solicitar recuperação de senha');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para verificar token de recuperação
  const verifyResetToken = async (userId, token) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authService.verifyResetToken(userId, token);
      return result;
    } catch (error) {
      setAuthError(error.message || 'Erro ao verificar token');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para redefinir senha
  const resetPassword = async (userId, token, newPassword) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authService.resetPassword(userId, token, newPassword);
      return result;
    } catch (error) {
      setAuthError(error.message || 'Erro ao redefinir senha');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Valor a ser fornecido pelo contexto (ADICIONANDO AS NOVAS FUNÇÕES)
  const value = {
    currentUser,
    loading,
    authError,
    login,
    logout,
    updateUser,
    hasPermission,
    // Novas funções para acesso ao BI
    getBILink,
    hasBIAccess,
    // Funções de recuperação de senha
    requestPasswordReset,
    verifyResetToken,
    resetPassword,
    isAdmin: currentUser?.role === 'admin',
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};