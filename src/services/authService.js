// src/contexts/authService.js
import { users as initialUsers } from './users';
import emailjs from 'emailjs-com';
import supabase from '../supabase/client';

// Configuração do EmailJS
const EMAILJS_SERVICE_ID = 'default_service';
const EMAILJS_TEMPLATE_ID = 'template_hmlgw9a';
const EMAILJS_USER_ID = 'U224VEP6DVdcNq_JZ';

// Carregar usuários do localStorage (para compatibilidade)
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

// Salvar usuários no localStorage (para compatibilidade)
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

// Inicializa o banco de dados do Supabase se necessário
const initializeSupabaseData = async () => {
  try {
    // Verifica se já existem usuários no Supabase
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Erro ao verificar usuários existentes:', checkError);
      return;
    }

    // Se não existirem usuários, migra os usuários iniciais
    if (!existingUsers || existingUsers.length === 0) {
      console.log('Migrando usuários iniciais para o Supabase...');
      
      // Carrega usuários do localStorage para migrar
      const localUsers = loadUsers();
      
      // Insere os usuários no Supabase
      const { error: insertError } = await supabase
        .from('users')
        .insert(localUsers);

      if (insertError) {
        console.error('Erro ao migrar usuários iniciais:', insertError);
      } else {
        console.log('Usuários migrados com sucesso!');
      }
    }
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
  }
};

// Serviço de autenticação
const authService = {
  // Inicializa o banco de dados
  initDatabase: async () => {
    await initializeSupabaseData();
  },
  
  // Login de usuário
  login: async (username, password) => {
    try {
      // Primeiro tenta buscar no Supabase
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .or(`username.eq.${username},email.eq.${username}`)
        .single();

      // Se houve erro ou usuário não foi encontrado no Supabase
      if (error || !user) {
        console.log('Usuário não encontrado no Supabase, verificando no localStorage...');
        
        // Fallback para localStorage
        const currentUsers = loadUsers();
        
        // Encontra o usuário no banco de dados local
        const localUser = currentUsers.find(
          (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
        );

        if (!localUser) {
          throw new Error('Credenciais inválidas');
        }

        // Tenta migrar para o Supabase
        try {
          const { error: insertError } = await supabase
            .from('users')
            .upsert([localUser]);
            
          if (insertError) {
            console.error('Erro ao migrar usuário para Supabase:', insertError);
          }
        } catch (migrationError) {
          console.error('Erro ao tentar migrar usuário:', migrationError);
        }

        // Atualiza a data do último login no localStorage
        const userIndex = currentUsers.findIndex(u => u.id === localUser.id);
        if (userIndex !== -1) {
          currentUsers[userIndex].lastLogin = new Date().toISOString();
          saveUsers(currentUsers);
        }

        // Criando uma cópia do usuário sem a senha para armazenamento seguro
        const { password: _, ...userWithoutPassword } = localUser;
        
        // Simula um token JWT
        const token = `token_${Math.random().toString(36).substring(2)}`;
        
        // Prepara objeto de autenticação
        const authData = {
          user: userWithoutPassword,
          token,
          expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 horas
        };

        // Armazena dados no localStorage
        localStorage.setItem('authData', JSON.stringify(authData));
        
        return await simulateApiCall(authData);
      }
      
      // Se encontrou no Supabase, verifica a senha
      if (user.password !== password) {
        throw new Error('Credenciais inválidas');
      }

      // Atualiza a data do último login no Supabase
      const { error: updateError } = await supabase
        .from('users')
        .update({ lastLogin: new Date().toISOString() })
        .eq('id', user.id);
        
      if (updateError) {
        console.error('Erro ao atualizar data de login:', updateError);
      }

      // Criando uma cópia do usuário sem a senha
      const { password: _, ...userWithoutPassword } = user;
      
      // Simula um token JWT
      const token = `token_${Math.random().toString(36).substring(2)}`;
      
      // Prepara objeto de autenticação
      const authData = {
        user: userWithoutPassword,
        token,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 horas
      };

      // Armazena dados no localStorage
      localStorage.setItem('authData', JSON.stringify(authData));
      
      return await simulateApiCall(authData);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  // Os métodos abaixo permanecem quase idênticos, mas com suporte ao Supabase

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

      // Atualiza no Supabase
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', authData.user.id)
        .select();
        
      if (error) {
        console.error('Erro ao atualizar usuário no Supabase:', error);
        
        // Fallback para localStorage
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

  // Solicitar recuperação de senha (envia token por email)
  requestPasswordReset: async (emailOrUsername) => {
    try {
      // Tenta buscar usuário no Supabase
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${emailOrUsername},username.eq.${emailOrUsername}`)
        .single();

      // Se não encontrou no Supabase, busca no localStorage
      if (error || !user) {
        console.log('Usuário não encontrado no Supabase, verificando localStorage...');
        
        // Carrega usuários do localStorage
        const currentUsers = loadUsers();
        
        // Encontra o usuário por email ou nome de usuário
        const localUser = currentUsers.find(
          (u) => 
            u.email.toLowerCase() === emailOrUsername.toLowerCase() || 
            u.username.toLowerCase() === emailOrUsername.toLowerCase()
        );

        if (!localUser) {
          throw new Error('Usuário não encontrado');
        }

        // Gera um token de recuperação (6 dígitos)
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Armazena o token com expiração de 15 minutos
        passwordResetTokens[localUser.id] = {
          token: resetToken,
          expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutos
          email: localUser.email
        };

        // Tenta migrar usuário para Supabase
        try {
          await supabase
            .from('users')
            .upsert([localUser]);
            
          // Armazena o token no Supabase também
          await supabase
            .from('password_reset_tokens')
            .upsert([{
              user_id: localUser.id,
              token: resetToken,
              expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
            }]);
        } catch (migrationError) {
          console.error('Erro ao migrar dados para Supabase:', migrationError);
        }

        // Preparar template params para o EmailJS
        const templateParams = {
          to_name: localUser.name,
          system_name: 'GIO - Gestão Inteligente de Obras',
          reset_code: resetToken,
          expiry_time: '15 minutos',
          company_name: 'TOP Construtora',
          email: localUser.email
        };
        
        try {
          console.log('Tentando enviar email para:', localUser.email);
          
          // Tenta enviar o email usando EmailJS
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
            EMAILJS_USER_ID
          );
          
          console.log('Email enviado com sucesso para:', localUser.email);
        } catch (emailError) {
          console.error('Erro ao enviar email:', emailError);
          // Continua mesmo com erro de email para fins de desenvolvimento
        }
        
        // Mostra o código no console para facilitar o desenvolvimento
        console.log('----------------------------------------');
        console.log(`Código de recuperação para ${localUser.name}: ${resetToken}`);
        console.log('----------------------------------------');
        
        // Simula uma chamada de API bem-sucedida
        return await simulateApiCall({
          success: true,
          message: 'Email de recuperação enviado',
          userId: localUser.id
        });
      }

      // Se encontrou no Supabase
      const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Armazena o token com expiração de 15 minutos (local e Supabase)
      passwordResetTokens[user.id] = {
        token: resetToken,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutos
        email: user.email
      };
      
      // Armazena o token no Supabase
      const { error: tokenError } = await supabase
        .from('password_reset_tokens')
        .upsert([{
          user_id: user.id,
          token: resetToken,
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        }]);
        
      if (tokenError) {
        console.error('Erro ao salvar token no Supabase:', tokenError);
      }

      // Enviar email
      const templateParams = {
        to_name: user.name,
        system_name: 'GIO - Gestão Inteligente de Obras',
        reset_code: resetToken,
        expiry_time: '15 minutos',
        company_name: 'TOP Construtora',
        email: user.email
      };
      
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          EMAILJS_USER_ID
        );
        
        console.log('Email enviado com sucesso para:', user.email);
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
      }
      
      // Mostra o código no console para facilitar o desenvolvimento
      console.log('----------------------------------------');
      console.log(`Código de recuperação para ${user.name}: ${resetToken}`);
      console.log('----------------------------------------');
      
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
      // Primeiro verifica no cache local
      const resetData = passwordResetTokens[userId];
      
      if (resetData) {
        // Verifica se o token expirou
        if (Date.now() > resetData.expiresAt) {
          delete passwordResetTokens[userId];
          throw new Error('Token de recuperação expirado');
        }

        // Verifica se o token está correto
        if (resetData.token !== token) {
          throw new Error('Token de recuperação incorreto');
        }
        
        return await simulateApiCall({
          success: true,
          message: 'Token verificado com sucesso'
        });
      }
      
      // Se não encontrou localmente, verifica no Supabase
      const { data, error } = await supabase
        .from('password_reset_tokens')
        .select('*')
        .eq('user_id', userId)
        .eq('token', token)
        .single();
        
      if (error || !data) {
        throw new Error('Token de recuperação inválido ou expirado');
      }
      
      // Verifica se o token expirou
      const expiresAt = new Date(data.expires_at).getTime();
      if (Date.now() > expiresAt) {
        // Remove o token expirado
        await supabase
          .from('password_reset_tokens')
          .delete()
          .eq('user_id', userId);
          
        throw new Error('Token de recuperação expirado');
      }
      
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

      // Atualiza senha no Supabase
      const { error: updateError } = await supabase
        .from('users')
        .update({ password: newPassword })
        .eq('id', userId);
        
      // Se houve erro no Supabase, tenta atualizar no localStorage
      if (updateError) {
        console.error('Erro ao atualizar senha no Supabase:', updateError);
        
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
      }
      
      console.log(`Senha atualizada com sucesso para o usuário ID: ${userId}`);

      // Remove o token de recuperação usado
      delete passwordResetTokens[userId];
      
      // Remove o token do Supabase também
      await supabase
        .from('password_reset_tokens')
        .delete()
        .eq('user_id', userId);

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
  getAllUsers: async () => {
    try {
      // Tentar buscar do Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*');
        
      if (error) {
        console.error('Erro ao buscar usuários do Supabase:', error);
        // Fallback para localStorage
        return loadUsers();
      }
      
      return data;
    } catch (err) {
      console.error('Erro ao listar usuários:', err);
      return loadUsers();
    }
  }
};

export default authService;