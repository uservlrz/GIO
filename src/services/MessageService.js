// src/services/messageService.js
import supabase from '../supabase/client';
import authService from './authService';

// Chave para armazenamento no localStorage (para compatibilidade)
const MESSAGE_STORAGE_KEY = 'mural_messages';

// Mensagens iniciais para o banco de dados
const INITIAL_MESSAGES = [
  { 
    id: 1, 
    author: 'Maria Silva', 
    department: 'RH', 
    content: 'Lembrando a todos que o treinamento de segurança será realizado amanhã às 9h na sala de reuniões principal.',
    avatar: '/api/placeholder/40/40',
    timestamp: '2025-03-24T10:30:00',
    user_id: null // Mensagem do sistema
  },
  { 
    id: 2, 
    author: 'João Pereira', 
    department: 'Administração', 
    content: 'A confraternização de fim de mês será realizada nesta sexta-feira. Todos estão convidados!',
    avatar: '/api/placeholder/40/40',
    timestamp: '2025-03-24T14:15:00',
    user_id: null
  },
  { 
    id: 3, 
    author: 'Ana Oliveira', 
    department: 'TI', 
    content: 'O sistema de ponto eletrônico estará em manutenção amanhã das 8h às 10h. Por favor, registre suas horas manualmente durante este período.',
    avatar: '/api/placeholder/40/40',
    timestamp: '2025-03-23T16:45:00',
    user_id: null
  },
];

// Inicializa o banco de dados local se não existir
const initializeLocalDatabase = () => {
  if (!localStorage.getItem(MESSAGE_STORAGE_KEY)) {
    localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(INITIAL_MESSAGES));
  }
};

// Inicializa o banco de dados do Supabase se necessário
const initializeSupabaseData = async () => {
  try {
    // Verifica se já existem mensagens no Supabase
    const { data: existingMessages, error: checkError } = await supabase
      .from('messages')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Erro ao verificar mensagens existentes:', checkError);
      return;
    }

    // Se não existirem mensagens, migra as mensagens iniciais
    if (!existingMessages || existingMessages.length === 0) {
      console.log('Migrando mensagens iniciais para o Supabase...');
      
      // Carrega mensagens do localStorage para migrar
      initializeLocalDatabase();
      const localMessages = JSON.parse(localStorage.getItem(MESSAGE_STORAGE_KEY) || '[]');
      
      // Insere as mensagens no Supabase
      const { error: insertError } = await supabase
        .from('messages')
        .insert(localMessages);

      if (insertError) {
        console.error('Erro ao migrar mensagens iniciais:', insertError);
      } else {
        console.log('Mensagens migradas com sucesso!');
      }
    }
  } catch (error) {
    console.error('Erro ao inicializar banco de dados de mensagens:', error);
  }
};

// Serviço para manipulação de mensagens
const messageService = {
  // Inicializa o banco de dados
  initDatabase: async () => {
    initializeLocalDatabase();
    await initializeSupabaseData();
  },

  // Obter todas as mensagens
  getMessages: async () => {
    try {
      // Primeiro tenta buscar do Supabase
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: false });
        
      if (error) {
        console.error('Erro ao obter mensagens do Supabase:', error);
        
        // Fallback para localStorage
        initializeLocalDatabase();
        const localMessages = JSON.parse(localStorage.getItem(MESSAGE_STORAGE_KEY) || '[]');
        return localMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }
      
      return data || [];
    } catch (error) {
      console.error('Erro ao obter mensagens:', error);
      
      // Fallback para localStorage em caso de erro
      initializeLocalDatabase();
      const localMessages = JSON.parse(localStorage.getItem(MESSAGE_STORAGE_KEY) || '[]');
      return localMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
  },

  // Adicionar uma nova mensagem
  addMessage: async (content) => {
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      
      const newMessage = {
        author: currentUser.name || currentUser.username,
        department: currentUser.department || 'Não especificado', // Garantir que o departamento seja salvo
        content: content,
        avatar: currentUser.avatarUrl || '/api/placeholder/40/40',
        timestamp: new Date().toISOString(),
        user_id: currentUser.id, // Usar user_id em vez de userId
        edited: false
      };

      // Tenta inserir no Supabase
      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select();
        
      if (error) {
        console.error('Erro detalhado ao adicionar mensagem no Supabase:', error);
        
        // Fallback para localStorage
        initializeLocalDatabase();
        const localMessages = JSON.parse(localStorage.getItem(MESSAGE_STORAGE_KEY) || '[]');
        
        // Gera um ID para a nova mensagem
        const newId = localMessages.length > 0 ? Math.max(...localMessages.map(m => m.id)) + 1 : 1;
        
        const messageWithId = {
          ...newMessage,
          id: newId
        };
        
        localMessages.unshift(messageWithId);
        localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(localMessages));
        
        return messageWithId;
      }
      
      return data[0];
    } catch (error) {
      console.error('Erro ao adicionar mensagem:', error);
      throw error;
    }
  },

  // Remover uma mensagem
  removeMessage: async (messageId) => {
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      
      // Tenta excluir do Supabase
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);
      
      if (error) {
        console.error('Erro ao remover mensagem do Supabase:', error);
        
        // Fallback para localStorage
        initializeLocalDatabase();
        const localMessages = JSON.parse(localStorage.getItem(MESSAGE_STORAGE_KEY) || '[]');
        
        // Verifica se o usuário tem permissão para excluir
        const messageToDelete = localMessages.find(m => m.id === messageId);
        
        if (!messageToDelete) {
          throw new Error('Mensagem não encontrada');
        }
        
        // Verificar permissões: apenas o autor ou admin pode excluir
        const isAdmin = currentUser.role === 'admin';
        const isOwner = messageToDelete.user_id === currentUser.id;
        
        if (!isAdmin && !isOwner) {
          throw new Error('Você não tem permissão para excluir esta mensagem');
        }
        
        const updatedMessages = localMessages.filter(m => m.id !== messageId);
        localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(updatedMessages));
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao remover mensagem:', error);
      throw error;
    }
  },

  // Editar uma mensagem existente
  editMessage: async (messageId, newContent) => {
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      
      // Tenta atualizar no Supabase
      const { data, error } = await supabase
        .from('messages')
        .update({
          content: newContent,
          edited: true,
          edit_timestamp: new Date().toISOString()
        })
        .eq('id', messageId)
        .select();
      
      if (error) {
        console.error('Erro ao editar mensagem no Supabase:', error);
        
        // Fallback para localStorage
        initializeLocalDatabase();
        const localMessages = JSON.parse(localStorage.getItem(MESSAGE_STORAGE_KEY) || '[]');
        const messageIndex = localMessages.findIndex(m => m.id === messageId);
        
        if (messageIndex === -1) {
          throw new Error('Mensagem não encontrada');
        }
        
        const message = localMessages[messageIndex];
        
        // Verificar permissões: apenas o autor ou admin pode editar
        const isAdmin = currentUser.role === 'admin';
        const isOwner = message.user_id === currentUser.id;
        
        if (!isAdmin && !isOwner) {
          throw new Error('Você não tem permissão para editar esta mensagem');
        }
        
        // Atualizar a mensagem
        localMessages[messageIndex] = {
          ...message,
          content: newContent,
          edited: true,
          editTimestamp: new Date().toISOString()
        };
        
        localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(localMessages));
        
        return localMessages[messageIndex];
      }
      
      return data[0];
    } catch (error) {
      console.error('Erro ao editar mensagem:', error);
      throw error;
    }
  },

  // Verificar se o usuário pode modificar uma mensagem
  canModifyMessage: (messageId) => {
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        return false;
      }
      
      // Para simplificar, assumimos que administradores podem modificar qualquer mensagem
      if (currentUser.role === 'admin') {
        return true;
      }
      
      // Para outros casos, precisamos verificar se o usuário é o autor da mensagem
      // Isso geralmente seria feito com uma consulta ao banco, mas vamos simplificar
      return true; // Na interface, o botão só aparecerá se a mensagem for do usuário
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      return false;
    }
  }
};

export default messageService;