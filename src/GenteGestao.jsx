import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Typography, Box, Paper, Grid, Avatar, Divider,
  Card, CardContent, TextField, Button, IconButton,
  MobileStepper, useTheme, Snackbar, Alert, CircularProgress,
  CardMedia, CardHeader, CardActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// Corrigindo caminhos de importação
import authService from './authService';
import messageService from './MessageService';

// Importar as imagens locais
import obrabs1 from './assets/obrabs1.jpeg';
import obrabs2 from './assets/obrabs2.jpeg';
import obrabs3 from './assets/obrabs3.jpeg';
import obrabs4 from './assets/obrabs4.jpeg';
import obrabs5 from './assets/obrabs5.jpeg';
import obrabs6 from './assets/obrabs6.jpeg';

// Imagens locais para o carrossel
const EXAMPLE_IMAGES = [
  obrabs1,
  obrabs2,
  obrabs3,
  obrabs4,
  obrabs5,
  obrabs6,
];

// Serviço para gerenciar o feed de fotos
const photoFeedService = {
  // Chave para armazenamento no localStorage
  PHOTO_STORAGE_KEY: 'photo_feed_data',
  
  // Inicializar o storage se não existir
  initialize: () => {
    if (!localStorage.getItem(photoFeedService.PHOTO_STORAGE_KEY)) {
      localStorage.setItem(photoFeedService.PHOTO_STORAGE_KEY, JSON.stringify([]));
    }
  },
  
  // Obter todas as fotos
  getPhotos: () => {
    photoFeedService.initialize();
    try {
      const photos = JSON.parse(localStorage.getItem(photoFeedService.PHOTO_STORAGE_KEY) || '[]');
      return photos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Erro ao obter fotos:', error);
      return [];
    }
  },
  
  // Adicionar uma nova foto
  addPhoto: (imageData, caption) => {
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Apenas administradores podem adicionar fotos');
      }
      
      const photos = photoFeedService.getPhotos();
      const newId = photos.length > 0 ? Math.max(...photos.map(p => p.id)) + 1 : 1;
      
      const newPhoto = {
        id: newId,
        image: imageData,
        caption: caption,
        author: currentUser.name || currentUser.username,
        authorId: currentUser.id,
        timestamp: new Date().toISOString(),
        likes: []
      };
      
      photos.unshift(newPhoto);
      localStorage.setItem(photoFeedService.PHOTO_STORAGE_KEY, JSON.stringify(photos));
      
      return newPhoto;
    } catch (error) {
      console.error('Erro ao adicionar foto:', error);
      throw error;
    }
  },
  
  // Remover uma foto
  removePhoto: (photoId) => {
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Apenas administradores podem remover fotos');
      }
      
      const photos = photoFeedService.getPhotos();
      const updatedPhotos = photos.filter(p => p.id !== photoId);
      
      localStorage.setItem(photoFeedService.PHOTO_STORAGE_KEY, JSON.stringify(updatedPhotos));
      
      return true;
    } catch (error) {
      console.error('Erro ao remover foto:', error);
      throw error;
    }
  },
  
  // Curtir/descurtir uma foto
  toggleLike: (photoId) => {
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Você precisa estar logado para curtir fotos');
      }
      
      const photos = photoFeedService.getPhotos();
      const photoIndex = photos.findIndex(p => p.id === photoId);
      
      if (photoIndex === -1) {
        throw new Error('Foto não encontrada');
      }
      
      const photo = photos[photoIndex];
      const userLikeIndex = photo.likes.indexOf(currentUser.id);
      
      if (userLikeIndex === -1) {
        // Adicionar curtida
        photo.likes.push(currentUser.id);
      } else {
        // Remover curtida
        photo.likes.splice(userLikeIndex, 1);
      }
      
      photos[photoIndex] = photo;
      localStorage.setItem(photoFeedService.PHOTO_STORAGE_KEY, JSON.stringify(photos));
      
      return photos[photoIndex];
    } catch (error) {
      console.error('Erro ao curtir/descurtir foto:', error);
      throw error;
    }
  },
  
  // Verificar se um usuário curtiu uma foto
  hasLiked: (photoId, userId) => {
    try {
      if (!userId) return false;
      
      const photos = photoFeedService.getPhotos();
      const photo = photos.find(p => p.id === photoId);
      
      if (!photo) return false;
      
      return photo.likes.includes(userId);
    } catch (error) {
      console.error('Erro ao verificar curtida:', error);
      return false;
    }
  }
};

function GenteGestao({ onBack }) {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [editMode, setEditMode] = useState({ active: false, messageId: null, content: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Estados para o feed de fotos
  const [photos, setPhotos] = useState([]);
  const [newCaption, setNewCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const fileInputRef = useRef(null);
  
  const maxSteps = EXAMPLE_IMAGES.length;

  // Efeito para verificar autenticação
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        setIsAdmin(user.role === 'admin');
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    };
    
    checkAuth();
  }, []);

  // Efeito para carregar mensagens
  useEffect(() => {
    const loadMessages = () => {
      setLoading(true);
      try {
        const allMessages = messageService.getMessages();
        setMessages(allMessages);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar mensagens:', err);
        setError('Não foi possível carregar as mensagens');
      } finally {
        setLoading(false);
      }
    };
    
    loadMessages();
  }, []);
  
  // Efeito para carregar fotos
  useEffect(() => {
    const loadPhotos = () => {
      setLoadingPhotos(true);
      try {
        const allPhotos = photoFeedService.getPhotos();
        setPhotos(allPhotos);
      } catch (err) {
        console.error('Erro ao carregar fotos:', err);
        setNotification({
          open: true,
          message: 'Não foi possível carregar as fotos',
          severity: 'error'
        });
      } finally {
        setLoadingPhotos(false);
      }
    };
    
    loadPhotos();
  }, []);

  // Efeito para avançar automaticamente o carrossel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prevActiveStep) => 
        prevActiveStep === maxSteps - 1 ? 0 : prevActiveStep + 1
      );
    }, 5000);
    
    return () => {
      clearInterval(timer);
    };
  }, [maxSteps]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => 
      prevActiveStep === maxSteps - 1 ? 0 : prevActiveStep + 1
    );
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => 
      prevActiveStep === 0 ? maxSteps - 1 : prevActiveStep - 1
    );
  };

  // Função para formatar a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Adicionar uma nova mensagem
  const handleAddMessage = () => {
    if (!isAuthenticated) {
      setNotification({
        open: true,
        message: 'Você precisa estar logado para publicar uma mensagem',
        severity: 'warning'
      });
      return;
    }
    
    if (newMessage.trim() === '') {
      setNotification({
        open: true,
        message: 'A mensagem não pode estar vazia',
        severity: 'warning'
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = messageService.addMessage(newMessage);
      setMessages([result, ...messages]);
      setNewMessage('');
      setNotification({
        open: true,
        message: 'Mensagem publicada com sucesso!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Erro ao adicionar mensagem:', err);
      setNotification({
        open: true,
        message: err.message || 'Erro ao publicar mensagem',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Remover uma mensagem
  const handleRemoveMessage = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta mensagem?')) {
      setLoading(true);
      try {
        messageService.removeMessage(id);
        setMessages(messages.filter(msg => msg.id !== id));
        setNotification({
          open: true,
          message: 'Mensagem removida com sucesso!',
          severity: 'success'
        });
      } catch (err) {
        console.error('Erro ao remover mensagem:', err);
        setNotification({
          open: true,
          message: err.message || 'Erro ao remover mensagem',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Iniciar edição de mensagem
  const handleStartEdit = (message) => {
    setEditMode({
      active: true,
      messageId: message.id,
      content: message.content
    });
  };

  // Salvar edição de mensagem
  const handleSaveEdit = () => {
    if (editMode.content.trim() === '') {
      setNotification({
        open: true,
        message: 'A mensagem não pode estar vazia',
        severity: 'warning'
      });
      return;
    }
    
    setLoading(true);
    try {
      const updatedMessage = messageService.editMessage(editMode.messageId, editMode.content);
      setMessages(messages.map(msg => 
        msg.id === editMode.messageId ? updatedMessage : msg
      ));
      setEditMode({ active: false, messageId: null, content: '' });
      setNotification({
        open: true,
        message: 'Mensagem atualizada com sucesso!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Erro ao editar mensagem:', err);
      setNotification({
        open: true,
        message: err.message || 'Erro ao editar mensagem',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditMode({ active: false, messageId: null, content: '' });
  };

  // Fechar notificação
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Verificar permissões de modificação
  const canModifyMessage = (messageId) => {
    return messageService.canModifyMessage(messageId);
  };
  
  // Funções para o Feed de Fotos
  
  // Selecionar um arquivo
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      
      // Preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setSelectedFile(imageData);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Abrir o seletor de arquivos
  const handleOpenFileSelector = () => {
    fileInputRef.current.click();
  };
  
  // Publicar uma foto
  const handlePostPhoto = () => {
    if (!isAdmin) {
      setNotification({
        open: true,
        message: 'Apenas administradores podem publicar fotos',
        severity: 'warning'
      });
      return;
    }
    
    if (!selectedFile) {
      setNotification({
        open: true,
        message: 'Por favor, selecione uma imagem',
        severity: 'warning'
      });
      return;
    }
    
    setLoadingPhotos(true);
    try {
      const newPhoto = photoFeedService.addPhoto(selectedFile, newCaption);
      setPhotos([newPhoto, ...photos]);
      setSelectedFile(null);
      setSelectedFileName('');
      setNewCaption('');
      setNotification({
        open: true,
        message: 'Foto publicada com sucesso!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Erro ao publicar foto:', err);
      setNotification({
        open: true,
        message: err.message || 'Erro ao publicar foto',
        severity: 'error'
      });
    } finally {
      setLoadingPhotos(false);
    }
  };
  
  // Remover uma foto
  const handleRemovePhoto = (photoId) => {
    if (window.confirm('Tem certeza que deseja excluir esta foto?')) {
      setLoadingPhotos(true);
      try {
        photoFeedService.removePhoto(photoId);
        setPhotos(photos.filter(photo => photo.id !== photoId));
        setNotification({
          open: true,
          message: 'Foto removida com sucesso!',
          severity: 'success'
        });
      } catch (err) {
        console.error('Erro ao remover foto:', err);
        setNotification({
          open: true,
          message: err.message || 'Erro ao remover foto',
          severity: 'error'
        });
      } finally {
        setLoadingPhotos(false);
      }
    }
  };
  
  // Curtir/descurtir uma foto
  const handleToggleLike = (photoId) => {
    if (!isAuthenticated) {
      setNotification({
        open: true,
        message: 'Você precisa estar logado para curtir fotos',
        severity: 'warning'
      });
      return;
    }
    
    setLoadingPhotos(true);
    try {
      const updatedPhoto = photoFeedService.toggleLike(photoId);
      setPhotos(photos.map(photo => 
        photo.id === photoId ? updatedPhoto : photo
      ));
    } catch (err) {
      console.error('Erro ao curtir/descurtir foto:', err);
      setNotification({
        open: true,
        message: err.message || 'Erro ao curtir foto',
        severity: 'error'
      });
    } finally {
      setLoadingPhotos(false);
    }
  };
  
  // Verificar se o usuário curtiu uma foto
  const userHasLiked = (photoId) => {
    if (!currentUser) return false;
    return photoFeedService.hasLiked(photoId, currentUser.id);
  };

  return (
    <Box sx={{ bgcolor: '#f5f9ff', minHeight: '100vh', pt: 20, pb: 8 }}>
      {/* Notificações */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Header da página */}
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton 
            onClick={onBack} 
            sx={{ 
              mr: 2, 
              bgcolor: 'primary.main', 
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mr: 2 }}>
              <PeopleIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Gente e Gestão
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Comunicação e Integração da Equipe
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Carrossel de Fotos */}
          <Grid item xs={12}>
            <Paper 
              elevation={3} 
              sx={{ 
                borderRadius: 4, 
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  p: 2, 
                  fontWeight: 'bold', 
                  borderBottom: '1px solid', 
                  borderColor: 'divider',
                  bgcolor: 'primary.main',
                  color: 'white'
                }}
              >
                Se Liga TOP
              </Typography>
              
              {/* Carrossel simplificado */}
              <Box sx={{ position: 'relative' }}>
                <Box 
                  sx={{ 
                    height: 500, 
                    backgroundImage: `url(${EXAMPLE_IMAGES[activeStep]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'flex-end'
                  }}
                >
                  <Box 
                    sx={{ 
                      width: '100%', 
                      p: 2, 
                      bgcolor: 'rgba(0,0,0,0.6)',
                      color: 'white'
                    }}
                  >
                    <Typography variant="h6">Obra {activeStep + 1}</Typography>
                    <Typography variant="body2">Projeto em andamento. Aqui você pode visualizar o progresso da construção.</Typography>
                  </Box>
                </Box>
                
                <MobileStepper
                  steps={maxSteps}
                  position="static"
                  activeStep={activeStep}
                  nextButton={
                    <Button
                      size="small"
                      onClick={handleNext}
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
                      }}
                    >
                      Próximo
                      {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </Button>
                  }
                  backButton={
                    <Button
                      size="small"
                      onClick={handleBack}
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
                      }}
                    >
                      {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                      Anterior
                    </Button>
                  }
                  sx={{ bgcolor: 'background.paper' }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Container para dividir o espaço */}
          <Grid container item xs={12} spacing={4}>
            {/* Mural de Recados - Agora com metade da largura */}
            <Grid item xs={6}>
              <Paper 
                elevation={3} 
                sx={{ 
                  borderRadius: 4, 
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  height: '100%' // Para garantir que ocupe toda a altura
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    p: 2, 
                    fontWeight: 'bold', 
                    borderBottom: '1px solid', 
                    borderColor: 'divider',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  Mural de Recados
                  {isAuthenticated && (
                    <Typography variant="body2">
                      Logado como: {currentUser.name || currentUser.username}
                    </Typography>
                  )}
                </Typography>

                <Box sx={{ p: 3 }}>
                  {/* Formulário para adicionar novo recado */}
                  <Card sx={{ mb: 4, bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        {isAuthenticated ? 'Novo Recado' : 'Faça login para publicar um recado'}
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder={isAuthenticated ? "Digite sua mensagem para o mural..." : "Faça login para publicar"}
                        variant="outlined"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={!isAuthenticated}
                        sx={{ mb: 2 }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<SendIcon />}
                          onClick={handleAddMessage}
                          disabled={!isAuthenticated || newMessage.trim() === ''}
                          sx={{ borderRadius: 2 }}
                        >
                          Publicar
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Indicador de carregamento */}
                  {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                      <CircularProgress />
                    </Box>
                  )}

                  {/* Mensagem de erro */}
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {/* Lista de recados */}
                  <Box>
                    {messages.length === 0 && !loading ? (
                      <Typography variant="body1" sx={{ textAlign: 'center', my: 4, color: 'text.secondary' }}>
                        Nenhuma mensagem disponível
                      </Typography>
                    ) : (
                      messages.map((message) => (
                        <Card 
                          key={message.id} 
                          sx={{ 
                            mb: 2, 
                            borderRadius: 2,
                            transition: 'transform 0.2s',
                            '&:hover': { 
                              transform: 'translateY(-3px)',
                              boxShadow: 3
                            },
                            ...(editMode.active && editMode.messageId === message.id && {
                              border: '2px solid',
                              borderColor: 'primary.main'
                            })
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar 
                                  src={message.avatar} 
                                  alt={message.author}
                                  sx={{ mr: 1.5 }}
                                />
                                <Box>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {message.author}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {message.department}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(message.timestamp)}
                                  {message.edited && ' (editado)'}
                                </Typography>
                                
                                {canModifyMessage(message.id) && (
                                  <>
                                    {!editMode.active && (
                                      <IconButton 
                                        size="small" 
                                        onClick={() => handleStartEdit(message)}
                                        sx={{ ml: 1, color: 'primary.main' }}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleRemoveMessage(message.id)}
                                      sx={{ ml: 1, color: 'error.main' }}
                                      disabled={editMode.active}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </>
                                )}
                              </Box>
                            </Box>
                            <Divider sx={{ my: 1.5 }} />
                            
                            {editMode.active && editMode.messageId === message.id ? (
                              <Box>
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={3}
                                  value={editMode.content}
                                  onChange={(e) => setEditMode({...editMode, content: e.target.value})}
                                  variant="outlined"
                                  sx={{ mb: 2 }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                  <Button 
                                    variant="outlined"
                                    onClick={handleCancelEdit}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button 
                                    variant="contained"
                                    onClick={handleSaveEdit}
                                    disabled={editMode.content.trim() === ''}
                                  >
                                    Salvar
                                  </Button>
                                </Box>
                              </Box>
                            ) : (
                              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {message.content}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>
            
            {/* Feed de Fotos (estilo Instagram) */}
            <Grid item xs={6}>
              <Paper 
                elevation={3} 
                sx={{ 
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    p: 2, 
                    fontWeight: 'bold', 
                    borderBottom: '1px solid', 
                    borderColor: 'divider',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  Feed de Fotos
                  {isAuthenticated && isAdmin && (
                    <Typography variant="body2">
                      Modo Admin
                    </Typography>
                  )}
                </Typography>

                <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
                  {/* Formulário para publicar foto (visível apenas para admin) */}
                  {isAuthenticated && isAdmin && (
                    <Card sx={{ mb: 4, bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                          Publicar Nova Foto
                        </Typography>
                        
                        {/* Input escondido para selecionar arquivo */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          style={{ display: 'none' }}
                          ref={fileInputRef}
                        />
                        
                        {/* Área de preview e seleção de imagem */}
                        <Box 
                          sx={{ 
                            mb: 2,
                            border: '2px dashed',
                            borderColor: 'primary.light',
                            borderRadius: 2,
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: 200,
                            bgcolor: 'background.paper',
                            cursor: 'pointer'
                          }}
                          onClick={handleOpenFileSelector}
                        >
                          {selectedFile ? (
                            <>
                              <Box 
                                component="img"
                                src={selectedFile}
                                alt="Preview"
                                sx={{ 
                                  maxWidth: '100%', 
                                  maxHeight: 300,
                                  borderRadius: 1,
                                  mb: 1
                                }}
                              />
                              <Typography variant="body2" color="primary">
                                {selectedFileName} (Clique para alterar)
                              </Typography>
                            </>
                          ) : (
                            <>
                              <PhotoCameraIcon sx={{ fontSize: 60, color: 'primary.light', mb: 1 }} />
                              <Typography variant="body1" color="text.secondary">
                                Clique para selecionar uma imagem
                              </Typography>
                            </>
                          )}
                        </Box>
                        
                        {/* Campo para legenda */}
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          placeholder="Digite uma legenda para a foto..."
                          variant="outlined"
                          value={newCaption}
                          onChange={(e) => setNewCaption(e.target.value)}
                          sx={{ mb: 2 }}
                        />
                        
                        {/* Botão para publicar */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<SendIcon />}
                            onClick={handlePostPhoto}
                            disabled={!selectedFile}
                            sx={{ borderRadius: 2 }}
                          >
                            Publicar Foto
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  )}

                  {/* Indicador de carregamento para fotos */}
                  {loadingPhotos && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                      <CircularProgress />
                    </Box>
                  )}

                  {/* Feed de fotos */}
                  <Box>
                    {photos.length === 0 && !loadingPhotos ? (
                      <Typography variant="body1" sx={{ textAlign: 'center', my: 4, color: 'text.secondary' }}>
                        Nenhuma foto publicada ainda
                      </Typography>
                    ) : (
                      photos.map((photo) => (
                        <Card 
                          key={photo.id} 
                          sx={{ 
                            mb: 4, 
                            borderRadius: 2,
                            transition: 'transform 0.2s',
                            '&:hover': { 
                              transform: 'translateY(-3px)',
                              boxShadow: 3
                            }
                          }}
                        >
                          <CardHeader
                            avatar={
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                {photo.author.charAt(0).toUpperCase()}
                              </Avatar>
                            }
                            action={
                              isAdmin && (
                                <IconButton 
                                  onClick={() => handleRemovePhoto(photo.id)}
                                  aria-label="excluir"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              )
                            }
                            title={photo.author}
                            subheader={formatDate(photo.timestamp)}
                          />
                          
                          <CardMedia
                            component="img"
                            image={photo.image}
                            alt={`Foto de ${photo.author}`}
                            sx={{ 
                              width: '100%',
                              maxHeight: 500,
                              objectFit: 'cover'
                            }}
                          />
                          
                          <CardContent>
                            {photo.caption && (
                              <Typography variant="body1" component="p" sx={{ mb: 1 }}>
                                {photo.caption}
                              </Typography>
                            )}
                            
                            <Typography variant="body2" color="text.secondary">
                              {photo.likes.length} {photo.likes.length === 1 ? 'curtida' : 'curtidas'}
                            </Typography>
                          </CardContent>
                          
                          <CardActions disableSpacing>
                            <IconButton 
                              onClick={() => handleToggleLike(photo.id)}
                              color={userHasLiked(photo.id) ? 'secondary' : 'default'}
                              aria-label="adicionar às curtidas"
                              disabled={!isAuthenticated}
                            >
                              {userHasLiked(photo.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                            </IconButton>
                          </CardActions>
                        </Card>
                      ))
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default GenteGestao;