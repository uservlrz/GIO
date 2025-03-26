// src/messageService.js
import authService from './authService';

// Chave para armazenamento no localStorage
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
    userId: null // mensagem do sistema
  },
  { 
    id: 2, 
    author: 'João Pereira', 
    department: 'Administração', 
    content: 'A confraternização de fim de mês será realizada nesta sexta-feira. Todos estão convidados!',
    avatar: '/api/placeholder/40/40',
    timestamp: '2025-03-24T14:15:00',
    userId: null
  },
  { 
    id: 3, 
    author: 'Ana Oliveira', 
    department: 'TI', 
    content: 'O sistema de ponto eletrônico estará em manutenção amanhã das 8h às 10h. Por favor, registre suas horas manualmente durante este período.',
    avatar: '/api/placeholder/40/40',
    timestamp: '2025-03-23T16:45:00',
    userId: null
  },
];

// Inicializa o banco de dados se não existir
const initializeDatabase = () => {
  if (!localStorage.getItem(MESSAGE_STORAGE_KEY)) {
    localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(INITIAL_MESSAGES));
  }
};

// Serviço para manipulação de mensagens
const messageService = {
  // Obter todas as mensagens
  getMessages: () => {
    initializeDatabase();
    try {
      const messages = JSON.parse(localStorage.getItem(MESSAGE_STORAGE_KEY) || '[]');
      return messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Erro ao obter mensagens:', error);
      return [];
    }
  },

  // Adicionar uma nova mensagem
  addMessage: (content) => {
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      
      const messages = messageService.getMessages();
      const newId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
      
      const newMessage = {
        id: newId,
        author: currentUser.name || currentUser.username,
        department: currentUser.department || 'Não especificado',
        content: content,
        avatar: '/api/placeholder/40/40',
        timestamp: new Date().toISOString(),
        userId: currentUser.id
      };
      
      messages.unshift(newMessage);
      localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(messages));
      
      return newMessage;
    } catch (error) {
      console.error('Erro ao adicionar mensagem:', error);
      throw error;
    }
  },

  // Remover uma mensagem
  removeMessage: (messageId) => {
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      
      const messages = messageService.getMessages();
      const messageToDelete = messages.find(m => m.id === messageId);
      
      if (!messageToDelete) {
        throw new Error('Mensagem não encontrada');
      }
      
      // Verificar permissões: apenas o autor ou admin pode excluir
      const isAdmin = currentUser.role === 'admin';
      const isOwner = messageToDelete.userId === currentUser.id;
      
      if (!isAdmin && !isOwner) {
        throw new Error('Você não tem permissão para excluir esta mensagem');
      }
      
      const updatedMessages = messages.filter(m => m.id !== messageId);
      localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(updatedMessages));
      
      return true;
    } catch (error) {
      console.error('Erro ao remover mensagem:', error);
      throw error;
    }
  },

  // Editar uma mensagem existente
  editMessage: (messageId, newContent) => {
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      
      const messages = messageService.getMessages();
      const messageIndex = messages.findIndex(m => m.id === messageId);
      
      if (messageIndex === -1) {
        throw new Error('Mensagem não encontrada');
      }
      
      const message = messages[messageIndex];
      
      // Verificar permissões: apenas o autor ou admin pode editar
      const isAdmin = currentUser.role === 'admin';
      const isOwner = message.userId === currentUser.id;
      
      if (!isAdmin && !isOwner) {
        throw new Error('Você não tem permissão para editar esta mensagem');
      }
      
      // Atualizar a mensagem
      messages[messageIndex] = {
        ...message,
        content: newContent,
        edited: true,
        editTimestamp: new Date().toISOString()
      };
      
      localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(messages));
      
      return messages[messageIndex];
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
      
      const messages = messageService.getMessages();
      const message = messages.find(m => m.id === messageId);
      
      if (!message) {
        return false;
      }
      
      const isAdmin = currentUser.role === 'admin';
      const isOwner = message.userId === currentUser.id;
      
      return isAdmin || isOwner;
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      return false;
    }
  }
};

export default messageService;