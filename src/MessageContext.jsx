// src/MessageContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Chave para armazenar mensagens no localStorage
const MESSAGE_DB_KEY = 'messageData';

// Mensagens iniciais
const INITIAL_MESSAGES = [
  { 
    id: 1, 
    author: 'Maria Silva', 
    department: 'RH', 
    content: 'Lembrando a todos que o treinamento de segurança será realizado amanhã às 9h na sala de reuniões principal.',
    avatar: '/api/placeholder/40/40',
    timestamp: '2025-03-24T10:30:00',
    userId: null
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
const initializeMessageDb = () => {
  if (!localStorage.getItem(MESSAGE_DB_KEY)) {
    localStorage.setItem(MESSAGE_DB_KEY, JSON.stringify(INITIAL_MESSAGES));
  }
};

// Cria o contexto
const MessageContext = createContext();

// Hook personalizado para usar o contexto
export const useMessages = () => {
  return useContext(MessageContext);
};

// Provedor do contexto
export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, isAuthenticated } = useAuth();

  // Carrega as mensagens ao iniciar e quando o estado de autenticação muda
  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        initializeMessageDb();
        const storedMessages = JSON.parse(localStorage.getItem(MESSAGE_DB_KEY) || '[]');
        const sortedMessages = storedMessages.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        setMessages(sortedMessages);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar mensagens:', err);
        setError('Não foi possível carregar as mensagens. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [isAuthenticated]);

  // Adiciona uma nova mensagem
  const addMessage = async (content) => {
    if (!content || content.trim() === '') {
      setError('A mensagem não pode estar vazia');
      return null;
    }

    if (!currentUser) {
      setError('Você precisa estar logado para adicionar uma mensagem');
      return null;
    }

    setLoading(true);
    try {
      const storedMessages = JSON.parse(localStorage.getItem(MESSAGE_DB_KEY) || '[]');
      const newId = storedMessages.length > 0 
        ? Math.max(...storedMessages.map(m => m.id)) + 1 
        : 1;
      
      const newMessage = {
        id: newId,
        author: currentUser.name || currentUser.username,
        department: currentUser.department || 'Não especificado',
        content: content,
        avatar: currentUser.avatar || '/api/placeholder/40/40',
        timestamp: new Date().toISOString(),
        userId: currentUser.id
      };
      
      storedMessages.unshift(newMessage);
      localStorage.setItem(MESSAGE_DB_KEY, JSON.stringify(storedMessages));
      
      setMessages([newMessage, ...messages]);
      setError(null);
      return newMessage;
    } catch (err) {
      console.error('Erro ao adicionar mensagem:', err);
      setError(err.message || 'Não foi possível adicionar a mensagem');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Remove uma mensagem
  const removeMessage = async (messageId) => {
    if (!currentUser) {
      setError('Você precisa estar logado para remover uma mensagem');
      return false;
    }

    setLoading(true);
    try {
      const storedMessages = JSON.parse(localStorage.getItem(MESSAGE_DB_KEY) || '[]');
      const messageToDelete = storedMessages.find(m => m.id === messageId);
      
      if (!messageToDelete) {
        throw new Error('Mensagem não encontrada');
      }
      
      const isAdmin = currentUser.role === 'admin';
      const isOwner = messageToDelete.userId === currentUser.id;
      
      if (!isAdmin && !isOwner) {
        throw new Error('Permissão negada: você não pode excluir esta mensagem');
      }
      
      const updatedMessages = storedMessages.filter(m => m.id !== messageId);
      localStorage.setItem(MESSAGE_DB_KEY, JSON.stringify(updatedMessages));
      
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
      setError(null);
      return true;
    } catch (err) {
      console.error('Erro ao remover mensagem:', err);
      setError(err.message || 'Não foi possível remover a mensagem');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Edita uma mensagem
  const editMessage = async (messageId, newContent) => {
    if (!newContent || newContent.trim() === '') {
      setError('A mensagem não pode estar vazia');
      return null;
    }

    if (!currentUser) {
      setError('Você precisa estar logado para editar uma mensagem');
      return null;
    }

    setLoading(true);
    try {
      const storedMessages = JSON.parse(localStorage.getItem(MESSAGE_DB_KEY) || '[]');
      const messageIndex = storedMessages.findIndex(m => m.id === messageId);
      
      if (messageIndex === -1) {
        throw new Error('Mensagem não encontrada');
      }
      
      const message = storedMessages[messageIndex];
      const isOwner = message.userId === currentUser.id;
      const isAdmin = currentUser.role === 'admin';
      
      if (!isOwner && !isAdmin) {
        throw new Error('Permissão negada: você não pode editar esta mensagem');
      }
      
      storedMessages[messageIndex] = {
        ...message,
        content: newContent,
        edited: true,
        editTimestamp: new Date().toISOString()
      };
      
      localStorage.setItem(MESSAGE_DB_KEY, JSON.stringify(storedMessages));
      
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? storedMessages[messageIndex] : msg
        )
      );
      setError(null);
      return storedMessages[messageIndex];
    } catch (err) {
      console.error('Erro ao editar mensagem:', err);
      setError(err.message || 'Não foi possível editar a mensagem');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Verifica se o usuário pode editar/excluir uma mensagem
  const canModifyMessage = (messageId) => {
    if (!currentUser) return false;
    
    const message = messages.find(msg => msg.id === messageId);
    if (!message) return false;
    
    const isAdmin = currentUser.role === 'admin';
    const isOwner = message.userId === currentUser.id;
    
    return isAdmin || isOwner;
  };

  // Valor a ser fornecido pelo contexto
  const value = {
    messages,
    loading,
    error,
    addMessage,
    removeMessage,
    editMessage,
    canModifyMessage,
    refreshMessages: async () => {
      setLoading(true);
      try {
        const storedMessages = JSON.parse(localStorage.getItem(MESSAGE_DB_KEY) || '[]');
        const sortedMessages = storedMessages.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        setMessages(sortedMessages);
        setError(null);
      } catch (err) {
        setError('Não foi possível atualizar as mensagens');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext;