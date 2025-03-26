// src/contexts/authService.js
import { users as initialUsers } from './users';
import emailjs from 'emailjs-com'; // Use 'emailjs-com' ou '@emailjs/browser' dependendo do instalado

// Configuração do EmailJS
const EMAILJS_SERVICE_ID = 'default_service';
const EMAILJS_TEMPLATE_ID = 'template_hmlgw9a';
const EMAILJS_USER_ID = 'U224VEP6DVdcNq_JZ';

// Carregar usuários do localStorage ou usar os iniciais
const loadUsers = () => {
  const savedUsers = localStorage.getItem('app_users');
  if (savedUsers) {
    try {
      return JSON.parse(savedUsers);
    } catch (e) {
      console.error('Erro ao carregar usuários do localStorage:', e);
      return [...initialUsers]; // Cópia para evitar mutação
    }
  } else {
    // Inicializa o localStorage com os usuários iniciais
    localStorage.setItem('app_users', JSON.stringify(initialUsers));
    return [...initialUsers]; // Cópia para evitar mutação
  }
};

// Salvar usuários no localStorage
const saveUsers = (updatedUsers) => {
  localStorage.setItem('app_users', JSON.stringify(updatedUsers));
};

// Armazenar os tokens de recuperação
const passwordResetTokens = {};

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
      // Carrega usuários do localStorage
      const currentUsers = loadUsers();
      
      // Encontra o usuário no banco de dados
      const user = currentUsers.find(
        (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );

      if (!user) {
        throw new Error('Credenciais inválidas');
      }

      // Atualiza a data do último login
      const userIndex = currentUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        currentUsers[userIndex].lastLogin = new Date().toISOString();
        saveUsers(currentUsers);
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

      // Atualiza as informações do usuário no localStorage
      const currentUsers = loadUsers();
      const userIndex = currentUsers.findIndex(u => u.id === authData.user.id);
      
      if (userIndex !== -1) {
        currentUsers[userIndex] = {
          ...currentUsers[userIndex],
          ...userData,
          // Mantém a senha intacta
          password: currentUsers[userIndex].password
        };
        
        saveUsers(currentUsers);
      }

      // Atualiza o objeto de autenticação
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
  },

  // =========== FUNÇÕES DE RECUPERAÇÃO DE SENHA ===========

  // Solicitar recuperação de senha (envia token por email)
  requestPasswordReset: async (emailOrUsername) => {
    try {
      // Carrega usuários do localStorage
      const currentUsers = loadUsers();
      
      // Encontra o usuário por email ou nome de usuário
      const user = currentUsers.find(
        (u) => 
          u.email.toLowerCase() === emailOrUsername.toLowerCase() || 
          u.username.toLowerCase() === emailOrUsername.toLowerCase()
      );

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Gera um token de recuperação (6 dígitos)
      const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Armazena o token com expiração de 15 minutos
      passwordResetTokens[user.id] = {
        token: resetToken,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutos
        email: user.email
      };

      // Preparar template params para o EmailJS
      const templateParams = {
        to_name: user.name,
        system_name: 'GIO - Gestão Inteligente de Obras',
        reset_code: resetToken,
        expiry_time: '15 minutos',
        company_name: 'TOP Construtora',
        email: user.email
      };
      
      try {
        console.log('Tentando enviar email para:', user.email);
        
        // Tenta enviar o email usando EmailJS
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          EMAILJS_USER_ID
        );
        
        console.log('Email enviado com sucesso para:', user.email);
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        // Continua mesmo com erro de email para fins de desenvolvimento
      }
      
      // Mostra o código no console para facilitar o desenvolvimento
      console.log('----------------------------------------');
      console.log(`Código de recuperação para ${user.name}: ${resetToken}`);
      console.log('----------------------------------------');
      
      // Simula uma chamada de API bem-sucedida
      return await simulateApiCall({
        success: true,
        message: 'Email de recuperação enviado',
        userId: user.id
      });
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      throw error;
    }
  },

  // Verificar token de recuperação
  verifyResetToken: async (userId, token) => {
    try {
      // Verifica se existe um token para este usuário
      const resetData = passwordResetTokens[userId];
      
      if (!resetData) {
        throw new Error('Token de recuperação inválido ou expirado');
      }

      // Verifica se o token expirou
      if (Date.now() > resetData.expiresAt) {
        delete passwordResetTokens[userId];
        throw new Error('Token de recuperação expirado');
      }

      // Verifica se o token está correto
      if (resetData.token !== token) {
        throw new Error('Token de recuperação incorreto');
      }

      // Simula uma chamada de API bem-sucedida
      return await simulateApiCall({
        success: true,
        message: 'Token verificado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      throw error;
    }
  },

  // Redefinir senha
  resetPassword: async (userId, token, newPassword) => {
    try {
      // Primeiro verifica o token
      await authService.verifyResetToken(userId, token);

      // Carrega usuários do localStorage
      const currentUsers = loadUsers();
      
      // Encontra o índice do usuário no array
      const userIndex = currentUsers.findIndex(u => u.id === parseInt(userId));
      
      if (userIndex === -1) {
        throw new Error('Usuário não encontrado');
      }

      // Atualiza a senha
      currentUsers[userIndex].password = newPassword;
      
      // Salva os usuários atualizados no localStorage
      saveUsers(currentUsers);
      
      console.log(`Senha atualizada com sucesso para o usuário: ${currentUsers[userIndex].name}`);

      // Remove o token de recuperação usado
      delete passwordResetTokens[userId];

      // Simula uma chamada de API bem-sucedida
      return await simulateApiCall({
        success: true,
        message: 'Senha atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      throw error;
    }
  },
  
  // DEBUG: Obter todos os tokens ativos (apenas para desenvolvimento)
  getActiveTokens: () => {
    return passwordResetTokens;
  },

  // DEBUG: Obter todos os usuários (apenas para desenvolvimento)
  getAllUsers: () => {
    return loadUsers();
  }
};

export default authService;