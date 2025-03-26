import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, Grid, Avatar, Divider,
  Card, CardContent, TextField, Button, IconButton,
  MobileStepper, useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import PeopleIcon from '@mui/icons-material/People';

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

// Dados de exemplo para o mural de recados
const INITIAL_MESSAGES = [
  { 
    id: 1, 
    author: 'Maria Silva', 
    department: 'RH', 
    content: 'Lembrando a todos que o treinamento de segurança será realizado amanhã às 9h na sala de reuniões principal.',
    avatar: '/api/placeholder/40/40',
    timestamp: '2025-03-24T10:30:00'
  },
  { 
    id: 2, 
    author: 'João Pereira', 
    department: 'Administração', 
    content: 'A confraternização de fim de mês será realizada nesta sexta-feira. Todos estão convidados!',
    avatar: '/api/placeholder/40/40',
    timestamp: '2025-03-24T14:15:00'
  },
  { 
    id: 3, 
    author: 'Ana Oliveira', 
    department: 'TI', 
    content: 'O sistema de ponto eletrônico estará em manutenção amanhã das 8h às 10h. Por favor, registre suas horas manualmente durante este período.',
    avatar: '/api/placeholder/40/40',
    timestamp: '2025-03-23T16:45:00'
  },
];

function GenteGestao({ onBack }) {
  const theme = useTheme();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: 'Usuário',
    department: 'Departamento'
  });
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = EXAMPLE_IMAGES.length;

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
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: messages.length + 1,
      author: userInfo.name,
      department: userInfo.department,
      content: newMessage,
      avatar: '/api/placeholder/40/40',
      timestamp: new Date().toISOString()
    };
    
    setMessages([newMsg, ...messages]);
    setNewMessage('');
  };

  // Remover uma mensagem
  const handleRemoveMessage = (id) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  return (
    <Box sx={{ bgcolor: '#f5f9ff', minHeight: '100vh', pt: 20, pb: 8 }}>
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

          {/* Mural de Recados */}
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
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                Mural de Recados
              </Typography>

              <Box sx={{ p: 3 }}>
                {/* Formulário para adicionar novo recado */}
                <Card sx={{ mb: 4, bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Novo Recado</Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Digite sua mensagem para o mural..."
                      variant="outlined"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<SendIcon />}
                        onClick={handleAddMessage}
                        sx={{ borderRadius: 2 }}
                      >
                        Publicar
                      </Button>
                    </Box>
                  </CardContent>
                </Card>

                {/* Lista de recados */}
                <Box>
                  {messages.map((message) => (
                    <Card 
                      key={message.id} 
                      sx={{ 
                        mb: 2, 
                        borderRadius: 2,
                        transition: 'transform 0.2s',
                        '&:hover': { 
                          transform: 'translateY(-3px)',
                          boxShadow: 3
                        }
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
                            </Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => handleRemoveMessage(message.id)}
                              sx={{ ml: 1, color: 'error.main' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Divider sx={{ my: 1.5 }} />
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {message.content}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default GenteGestao;