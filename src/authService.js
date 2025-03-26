// authService.js
import { users } from './users';

// Simula um tempo de resposta da API
const simulateApiCall = (data, success = true, delay = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve(data);
      } else {
        reject(new Error('API call failed'));
      }
    }, delay);
  });
};

// Serviço de autenticação
const authService = {
  // Login de usuário
  login: async (username, password) => {
    try {
      // Encontra o usuário no banco de dados
      const user = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );

      if (!user) {
        throw new Error('Credenciais inválidas');
      }

      // Criando uma cópia do usuário sem a senha para armazenamento seguro
      const { password: _, ...userWithoutPassword } = user;
      
      // Simula um token JWT (em produção seria gerado pelo servidor)
      const token = `token_${Math.random().toString(36).substring(2)}`;
      
      // Prepara objeto de autenticação
      const authData = {
        user: userWithoutPassword,
        token,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 horas
      };

      // Armazena dados no localStorage
      localStorage.setItem('authData', JSON.stringify(authData));
      
      // Simulando um delay de API
      return await simulateApiCall(authData);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  // Logout de usuário
  logout: async () => {
    try {
      // Remove dados do localStorage
      localStorage.removeItem('authData');
      return await simulateApiCall({ success: true });
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  },

  // Verifica se o usuário está autenticado
  isAuthenticated: () => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData'));
      
      if (!authData) {
        return false;
      }

      // Verifica se o token expirou
      const expiresAt = new Date(authData.expiresAt).getTime();
      const now = Date.now();
      
      if (now > expiresAt) {
        // Token expirado, faz logout
        localStorage.removeItem('authData');
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  },

  // Obtém os dados do usuário
  getCurrentUser: () => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData'));
      return authData ? authData.user : null;
    } catch (error) {
      return null;
    }
  },

  // Obtém o token atual
  getToken: () => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData'));
      return authData ? authData.token : null;
    } catch (error) {
      return null;
    }
  },

  // Atualiza as informações do usuário
  updateUser: async (userData) => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData'));
      
      if (!authData) {
        throw new Error('Usuário não autenticado');
      }

      // Atualiza as informações do usuário
      const updatedAuthData = {
        ...authData,
        user: {
          ...authData.user,
          ...userData
        }
      };

      // Atualiza no localStorage
      localStorage.setItem('authData', JSON.stringify(updatedAuthData));
      
      return await simulateApiCall(updatedAuthData.user);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }
};

export default authService;