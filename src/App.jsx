import { useState } from 'react'
import './App.css'
import { 
  AppBar, Toolbar, Typography, Button, IconButton, Container, Grid, 
  Card, CardContent, CardActions, Box, Divider, Avatar, Paper,
  Menu, MenuItem, Popover, Dialog, DialogTitle, DialogContent, DialogActions,
  ClickAwayListener, Popper, Grow, MenuList
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuIcon from '@mui/icons-material/Menu';
import ComputerIcon from '@mui/icons-material/Computer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import PeopleIcon from '@mui/icons-material/People';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import construcaoImg from './assets/construcao.png';
import logoTop from './assets/logoTop2.png';
import GenteGestao from './GenteGestao';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from './AuthContext';

function App({ onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  
  // Estados para os menus dropdown
  const [servicesAnchorEl, setServicesAnchorEl] = useState(null);
  const [contactAnchorEl, setContactAnchorEl] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Obtém o usuário atual do contexto de autenticação
  const { currentUser } = useAuth();

  // Handlers para o menu de serviços
  const handleServicesClick = (event) => {
    setServicesAnchorEl(event.currentTarget);
  };

  const handleServicesClose = () => {
    setServicesAnchorEl(null);
  };

  // Handlers para o menu de contato
  const handleContactClick = (event) => {
    setContactAnchorEl(event.currentTarget);
  };

  const handleContactClose = () => {
    setContactAnchorEl(null);
  };

  // Handlers para o modal Sobre
  const handleAboutOpen = () => {
    setAboutOpen(true);
  };

  const handleAboutClose = () => {
    setAboutOpen(false);
  };

  // Handlers para navegação entre páginas
  const handleNavigateToPage = (page) => {
    console.log('Navegando para:', page);
    setCurrentPage(page);
    handleServicesClose(); // Fechar o menu de serviços quando um item for selecionado
  };

  // Quando o usuário quiser voltar à página inicial
  const handleBackToHome = () => {
    console.log('Voltando para home');
    setCurrentPage('home');
  };

  // Renderizar o conteúdo baseado na página atual
  const renderContent = () => {
    console.log('Renderizando página:', currentPage);
    switch (currentPage) {
      case 'genteGestao':
        return <GenteGestao onBack={handleBackToHome} />;
      case 'home':
      default:
        return (
          <>
            {/* Hero Section - com imagem de fundo */}
            <Box 
              sx={{ 
                color: 'white', 
                pt: 12,
                pb: 8,
                backgroundImage: `url(${construcaoImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}
            >
              {/* Camada de sobreposição escura para melhorar legibilidade do texto */}
              <Box sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                bgcolor: 'rgba(0,0,0,0.5)'
              }} />
              
              <Container sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Typography 
                      variant="h1" 
                      component="h1" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 700, 
                        letterSpacing: '0.05em',
                        fontSize: { xs: '3rem', md: '4.5rem' },
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      GIO
                    </Typography>
                    <Typography 
                      variant="h5" 
                      paragraph
                      sx={{ 
                        fontWeight: 500,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        opacity: 0.9,
                        marginTop: -2
                      }}
                    >
                      GERENCIAMENTO INTELIGENTE DE OBRAS
                    </Typography>
                    {/* Nova linha de saudação */}
                    <Typography 
                      variant="subtitle1"
                      sx={{ 
                        fontWeight: 400,
                        letterSpacing: '0.05em',
                        opacity: 0.8,
                        marginTop: 1,
                        color: 'white'
                      }}
                    >
                      Olá, {currentUser?.name || 'Usuário'}
                    </Typography>
                  </Grid>
                </Grid>
              </Container>
            </Box>

            {/* Service Section com Cards Simples */}
            <Box sx={{ py: 8, bgcolor: 'grey.100' }}>
              <Container>
                {/* Título Destacado de Serviços */}
                <Box sx={{ mb: 6, position: 'relative', textAlign: 'center' }}>
                  {/* Elemento decorativo atrás do título */}
                  <Typography 
                    variant="h4" 
                    component="span" 
                    sx={{ 
                      position: 'absolute', 
                      left: '50%', 
                      top: '50%', 
                      transform: 'translate(-50%, -50%)', 
                      fontSize: '6rem', 
                      opacity: 0.04, 
                      zIndex: 0, 
                      fontWeight: 900, 
                      color: 'primary.main',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    SERVIÇOS
                  </Typography>
                  
                  {/* Título principal */}
                  <Typography 
                    variant="h4" 
                    component="h2" 
                    position="relative"
                    sx={{ 
                      fontWeight: 'bold', 
                      color: 'primary.dark',
                      zIndex: 1,
                      display: 'inline-block',
                      mb: -5
                    }}
                  >
                    Serviços
                  </Typography>
                  
                  {/* Linha decorativa abaixo do título */}
                  <Box 
                    sx={{ 
                      width: '120px', 
                      height: '4px', 
                      background: 'linear-gradient(90deg, transparent, primary.main, transparent)', 
                      borderRadius: '2px',
                      mx: 'auto',
                      mt: 1,
                      mb: 0.5
                    }} 
                  />
                  <Box 
                    sx={{ 
                      width: '60px', 
                      height: '4px', 
                      background: 'linear-gradient(90deg, transparent, primary.main, transparent)', 
                      borderRadius: '2px',
                      mx: 'auto',
                      mb: 2
                    }} 
                  />
                  
                  {/* Subtítulo opcional */}
                  <Typography 
                    variant="subtitle1" 
                    color="text.secondary" 
                    sx={{ 
                      maxWidth: '600px', 
                      mx: 'auto', 
                      fontWeight: 400,
                      letterSpacing: '0.3px'
                    }}
                  >
                    Soluções tecnológicas para aprimorar a gestão das obras
                  </Typography>
                </Box>
                
                <Grid container spacing={4} sx={{ mt: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      height: '100%',
                      borderRadius: 4,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': { 
                        transform: 'translateY(-8px)',
                        boxShadow: 6
                      }
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60 }}>
                            <ComputerIcon />
                          </Avatar>
                        </Box>
                        <Typography variant="h5" component="div" align="center" gutterBottom>
                          IA TOP
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                          Inteligência Artificial aplicada para otimizar processos e aumentar a produtividade em obras.
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'center' }}>
                        <Button 
                          size="small" 
                          color="primary" 
                          variant="contained" 
                          sx={{ 
                            borderRadius: 3,
                            px: 3
                          }}
                        >
                          Acessar
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      height: '100%',
                      borderRadius: 4,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': { 
                        transform: 'translateY(-8px)',
                        boxShadow: 6
                      }
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60 }}>
                            <TrendingUpIcon />
                          </Avatar>
                        </Box>
                        <Typography variant="h5" component="div" align="center" gutterBottom>
                          SGQ
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                          Sistema de Gestão da Qualidade para garantir excelência e conformidade em todos os projetos.
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'center' }}>
                        <Button 
                          size="small" 
                          color="primary" 
                          variant="contained" 
                          sx={{ 
                            borderRadius: 3,
                            px: 3
                          }}
                        >
                          Acessar
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      height: '100%',
                      borderRadius: 4,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': { 
                        transform: 'translateY(-8px)',
                        boxShadow: 6
                      }
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60 }}>
                            <SecurityIcon />
                          </Avatar>
                        </Box>
                        <Typography variant="h5" component="div" align="center" gutterBottom>
                          SST
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                          Saúde e Segurança do Trabalho com monitoramento contínuo para um ambiente seguro e protegido.
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'center' }}>
                        <Button 
                          size="small" 
                          color="primary" 
                          variant="contained" 
                          sx={{ 
                            borderRadius: 3,
                            px: 3
                          }}
                        >
                          Acessar
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      height: '100%',
                      borderRadius: 4,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': { 
                        transform: 'translateY(-8px)',
                        boxShadow: 6
                      }
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60 }}>
                            <PeopleIcon />
                          </Avatar>
                        </Box>
                        <Typography variant="h5" component="div" align="center" gutterBottom>
                          GENTE E GESTÃO
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                          Desenvolvimento humano e estratégias de gestão para maximizar o potencial da sua equipe.
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'center' }}>
                        <Button 
                          size="small" 
                          color="primary" 
                          variant="contained" 
                          onClick={() => handleNavigateToPage('genteGestao')}
                          sx={{ 
                            borderRadius: 3,
                            px: 3
                          }}
                        >
                          Acessar
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                </Grid>
                
                {/* Seção de Atalhos */}
                <Box sx={{ mt: 8, pt: 4, pb: 2, borderTop: '1px solid', borderColor: 'grey.300' }}>
                  {/* Título Destacado de Atalhos */}
                  <Box sx={{ mb: 6, position: 'relative', textAlign: 'center' }}>
                    {/* Elemento decorativo atrás do título */}
                    <Typography 
                      variant="h4" 
                      component="span" 
                      sx={{ 
                        position: 'absolute', 
                        left: '50%', 
                        top: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        fontSize: '6rem', 
                        opacity: 0.04, 
                        zIndex: 0, 
                        fontWeight: 900, 
                        color: 'primary.main',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      ATALHOS
                    </Typography>
                    
                    {/* Título principal */}
                    <Typography 
                      variant="h4" 
                      component="h3" 
                      position="relative"
                      sx={{ 
                        fontWeight: 'bold', 
                        color: 'primary.dark',
                        zIndex: 1,
                        display: 'inline-block',
                        mb: -5
                      }}
                    >
                      Atalhos
                    </Typography>
                    
                    {/* Linha decorativa abaixo do título */}
                    <Box 
                      sx={{ 
                        width: '120px', 
                        height: '4px', 
                        background: 'linear-gradient(90deg, transparent, primary.main, transparent)', 
                        borderRadius: '2px',
                        mx: 'auto',
                        mt: 1,
                        mb: 0.5
                      }} 
                    />
                    <Box 
                      sx={{ 
                        width: '60px', 
                        height: '4px', 
                        background: 'linear-gradient(90deg, transparent, primary.main, transparent)', 
                        borderRadius: '2px',
                        mx: 'auto',
                        mb: 2
                      }} 
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
                    <Button 
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ 
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        minWidth: 200
                      }}
                    >
                      Intranet
                    </Button>
                    <Button 
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ 
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        minWidth: 200
                      }}
                    >
                      Sala de Reunião
                    </Button>
                  </Box>
                </Box>
              </Container>
            </Box>
            
            {/* Seção Power BI - Ajustada sem emblemas e altura reduzida */}
            <Box sx={{ 
              width: '100%', 
              py: 8, 
              bgcolor: '#f5f9ff', 
              backgroundImage: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.95), rgba(245, 249, 255, 0.8)), url(https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGRhdGElMjBhbmFseXRpY3N8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}>
              <Container maxWidth="lg" sx={{ position: 'relative' }}>
                {/* Ícone decorativo */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 4,
                  position: 'relative'
                }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'primary.main', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderRadius: '50%',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    zIndex: 1
                  }}>
                    <BarChartIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Box sx={{ 
                    position: 'absolute', 
                    height: 2, 
                    bgcolor: 'rgba(0,0,0,0.07)', 
                    width: '80%', 
                    top: 40
                  }} />
                </Box>
                
                <Typography 
                  variant="h3" 
                  component="h2" 
                  align="center" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Dashboard de Performance
                </Typography>
                
                <Typography 
                  variant="subtitle1" 
                  color="text.secondary" 
                  align="center" 
                  sx={{ maxWidth: 700, mx: 'auto', mb: 5, fontWeight: 500 }}
                >
                  Acompanhe em tempo real os principais indicadores de desempenho dos nossos projetos
                </Typography>
                
                {/* Container para o Power BI com efeito de profundidade */}
                <Box sx={{ 
                  position: 'relative',
                  mb: 4
                }}>
                  {/* Camada decorativa */}
                  <Box sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    right: -12,
                    bottom: -12,
                    bgcolor: 'rgba(25, 118, 210, 0.05)',
                    borderRadius: 4,
                    zIndex: 0
                  }} />
                  
                  {/* Camada decorativa 2 */}
                  <Box sx={{
                    position: 'absolute',
                    top: 6,
                    left: 6,
                    right: -6,
                    bottom: -6,
                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                    borderRadius: 4,
                    zIndex: 0
                  }} />
                  
                  {/* Frame principal */}
                  <Paper 
                    elevation={12} 
                    sx={{ 
                      position: 'relative',
                      zIndex: 1,
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <Box sx={{ 
                      position: 'relative',
                      height: '70vh', // Reduzido de 85vh para 70vh
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                        zIndex: 2
                      },
                    }}>
                      <iframe 
                        title="Dashboard de Performance" 
                        width="100%" 
                        height="100%" 
                        src="https://app.powerbi.com/view?r=eyJrIjoiYzRjNTk2YzYtZjY4My00ZDkzLTg5MGEtYjFjNmM3NGNjY2E4IiwidCI6IjZjNTkxNjdhLTVhYTAtNDk2Ni1hZTRiLWNiMjYzZWIwNTVkOCJ9"
                        frameBorder="0" 
                        allowFullScreen
                        style={{ position: 'relative', zIndex: 1 }}
                      />
                    </Box>
                  </Paper>
                </Box>
              </Container>
            </Box>

            {/* Footer simplificado */}
            <Box 
              component="footer" 
              sx={{ 
                bgcolor: '#051622', 
                color: 'white', 
                py: 8, 
                mt: 'auto'
              }}
            >
              <Container>
                <Grid container spacing={6}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#7BD2F0' }}>
                        TOP Construtora
                      </Typography>
                      <Divider sx={{ width: 80, height: 3, bgcolor: '#7BD2F0', mb: 3 }} />
                      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                        Construindo o futuro com inovação, qualidade e sustentabilidade. Nossa missão é transformar visões em realidade através de projetos que superam expectativas.
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={2}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Links Rápidos
                    </Typography>
                    <Divider sx={{ width: 60, height: 2, bgcolor: 'grey.500', mb: 3 }} />
                    <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
                      <Box component="li" sx={{ mb: 2 }}>
                        <Button 
                          color="inherit" 
                          onClick={() => setCurrentPage('home')}
                          sx={{ 
                            p: 0, 
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            '&:hover': { color: '#7BD2F0' }
                          }}
                        >
                          Início
                        </Button>
                      </Box>
                      <Box component="li" sx={{ mb: 2 }}>
                        <Button 
                          color="inherit" 
                          sx={{ 
                            p: 0, 
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            '&:hover': { color: '#7BD2F0' }
                          }}
                        >
                          Serviços
                        </Button>
                      </Box>
                      <Box component="li" sx={{ mb: 2 }}>
                        <Button 
                          color="inherit" 
                          onClick={handleAboutOpen}
                          sx={{ 
                            p: 0, 
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            '&:hover': { color: '#7BD2F0' }
                          }}
                        >
                          Sobre Nós
                        </Button>
                      </Box>
                      <Box component="li" sx={{ mb: 2 }}>
                        <Button 
                          color="inherit" 
                          onClick={handleContactClick}
                          sx={{ 
                            p: 0, 
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            '&:hover': { color: '#7BD2F0' }
                          }}
                        >
                          Contato
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={2}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Serviços
                    </Typography>
                    <Divider sx={{ width: 60, height: 2, bgcolor: 'grey.500', mb: 3 }} />
                    <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
                      <Box component="li" sx={{ mb: 2 }}>
                        <Button 
                          color="inherit" 
                          sx={{ 
                            p: 0, 
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            '&:hover': { color: '#7BD2F0' }
                          }}
                        >
                          IA TOP
                        </Button>
                      </Box>
                      <Box component="li" sx={{ mb: 2 }}>
                        <Button 
                          color="inherit" 
                          sx={{ 
                            p: 0, 
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            '&:hover': { color: '#7BD2F0' }
                          }}
                        >
                          SGQ
                        </Button>
                      </Box>
                      <Box component="li" sx={{ mb: 2 }}>
                        <Button 
                          color="inherit" 
                          sx={{ 
                            p: 0, 
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            '&:hover': { color: '#7BD2F0' }
                          }}
                        >
                          SST
                        </Button>
                      </Box>
                      <Box component="li" sx={{ mb: 2 }}>
                        <Button 
                          color="inherit" 
                          onClick={() => handleNavigateToPage('genteGestao')}
                          sx={{ 
                            p: 0, 
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            '&:hover': { color: '#7BD2F0' }
                          }}
                        >
                          GENTE E GESTÃO
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Contato
                    </Typography>
                    <Divider sx={{ width: 60, height: 2, bgcolor: 'grey.500', mb: 3 }} />
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        Endereço
                      </Typography>
                      <Typography variant="body2">
                        Av. Paulista, 1000, São Paulo, SP
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        Email
                      </Typography>
                      <Typography variant="body2">
                        contato@topconstrutora.com
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        Telefone
                      </Typography>
                      <Typography variant="body2">
                        (11) 99999-9999
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Divider sx={{ mt: 6, mb: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    &copy; 2025 TOP Construtora. Todos os direitos reservados.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, mt: { xs: 2, sm: 0 } }}>
                    <Typography component="a" variant="body2" sx={{ color: 'white', opacity: 0.8, textDecoration: 'none', '&:hover': { color: '#7BD2F0', opacity: 1 } }}>
                      Política de Privacidade
                    </Typography>
                    <Typography component="a" variant="body2" sx={{ color: 'white', opacity: 0.8, textDecoration: 'none', '&:hover': { color: '#7BD2F0', opacity: 1 } }}>
                      Termos de Uso
                    </Typography>
                  </Box>
                </Box>
              </Container>
            </Box>
          </>
        );
    }
  };

  // Renderiza o conteúdo principal ou a página específica
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* O header permanece visível independentemente da página */}
      <AppBar 
        position="absolute"
        sx={{ 
          bgcolor: currentPage === 'home' ? 'transparent' : 'primary.main',
          boxShadow: currentPage === 'home' ? 'none' : 1,
          zIndex: 1100,
          width: '100%'
        }}
      >
        <Toolbar>
          {/* Logo sem caixa branca e com tamanho aumentado */}
          <Box
            component="img"
            src={logoTop}
            alt="Logo da empresa"
            sx={{ 
              height: 100,
              marginRight: 'auto',
              cursor: 'pointer'
            }}
            onClick={() => setCurrentPage('home')}
          />
          
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button 
              color="inherit"
              onClick={() => setCurrentPage('home')}
            >
              Início
            </Button>
            
            {/* Botão de Serviços com Dropdown */}
            <Button 
              color="inherit"
              onClick={handleServicesClick}
              endIcon={<ArrowDropDownIcon />}
            >
              Serviços
            </Button>
            <Menu
              anchorEl={servicesAnchorEl}
              open={Boolean(servicesAnchorEl)}
              onClose={handleServicesClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              PaperProps={{
                elevation: 3,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 180,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
            >
              <MenuItem 
                onClick={handleServicesClose}
                sx={{ 
                  py: 1.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                  <ComputerIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography>IA TOP</Typography>
              </MenuItem>
              
              <MenuItem 
                onClick={handleServicesClose}
                sx={{ 
                  py: 1.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                  <TrendingUpIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography>SGQ</Typography>
              </MenuItem>
              
              <MenuItem 
                onClick={handleServicesClose}
                sx={{ 
                  py: 1.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                  <SecurityIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography>SST</Typography>
              </MenuItem>
              
              <MenuItem 
                onClick={() => {
                  handleNavigateToPage('genteGestao');
                  handleServicesClose();
                }}
                sx={{ 
                  py: 1.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                  <PeopleIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography>GENTE E GESTÃO</Typography>
              </MenuItem>
            </Menu>
            
            {/* Botão de Sobre com Modal */}
            <Button 
              color="inherit"
              onClick={handleAboutOpen}
            >
              Sobre
            </Button>
            <Dialog
              open={aboutOpen}
              onClose={handleAboutClose}
              maxWidth="md"
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  p: 1
                }
              }}
            >
              <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                borderBottom: '1px solid', 
                borderColor: 'divider',
                pb: 2
              }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Sobre a TOP Construtora
                </Typography>
                <IconButton 
                  edge="end" 
                  color="inherit" 
                  onClick={handleAboutClose} 
                  aria-label="close"
                  sx={{ 
                    bgcolor: 'rgba(0,0,0,0.05)', 
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ pt: 3, px: 4, pb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Nossa História
                </Typography>
                <Typography paragraph>
                  Fundada em 2010, a TOP Construtora nasceu com o propósito de inovar o setor de construção civil, trazendo soluções tecnológicas avançadas para o mercado. Desde então, temos nos destacado por nosso compromisso com a qualidade, a segurança e a sustentabilidade.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Missão
                </Typography>
                <Typography paragraph>
                  Transformar o setor da construção civil através de práticas inovadoras e sustentáveis, entregando projetos que superam as expectativas dos clientes e contribuem para o desenvolvimento das comunidades.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Visão
                </Typography>
                <Typography paragraph>
                  Ser reconhecida como líder em inovação no setor de construção, referência em gestão inteligente de obras e comprometimento com a excelência.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Valores
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li" paragraph>Inovação e tecnologia como pilares de transformação</Typography>
                  <Typography component="li" paragraph>Compromisso com a sustentabilidade e o meio ambiente</Typography>
                  <Typography component="li" paragraph>Excelência em todos os processos e entregas</Typography>
                  <Typography component="li" paragraph>Valorização e desenvolvimento das pessoas</Typography>
                  <Typography component="li" paragraph>Responsabilidade social e ética em todas as ações</Typography>
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button 
                  onClick={handleAboutClose} 
                  variant="outlined" 
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  Fechar
                </Button>
                <Button 
                  onClick={handleAboutClose} 
                  variant="contained" 
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  Saiba Mais
                </Button>
              </DialogActions>
            </Dialog>
            
            {/* Botão de Contato com Dropdown */}
            <Button 
              color="inherit"
              onClick={handleContactClick}
              endIcon={<ArrowDropDownIcon />}
            >
              Contato
            </Button>
            <Menu
              anchorEl={contactAnchorEl}
              open={Boolean(contactAnchorEl)}
              onClose={handleContactClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              PaperProps={{
                elevation: 3,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 220,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
            >
              <MenuItem 
                onClick={handleContactClose}
                component="a"
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  py: 1.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
                }}
              >
                <Avatar sx={{ bgcolor: '#25D366', width: 36, height: 36 }}>
                  <WhatsAppIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>WhatsApp</Typography>
                  <Typography variant="body2">(11) 99999-9999</Typography>
                </Box>
              </MenuItem>
              
              <MenuItem 
                onClick={handleContactClose}
                sx={{ 
                  py: 1.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                 <EmailIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Email</Typography>
                  <Typography variant="body2">contato@topconstrutora.com</Typography>
                </Box>
              </MenuItem>
              
              <MenuItem 
                onClick={handleContactClose}
                sx={{ 
                  py: 1.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                  <EmailIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Email</Typography>
                  <Typography variant="body2">contato@topconstrutora.com</Typography>
                </Box>
              </MenuItem>
              
              <MenuItem 
                onClick={handleContactClose}
                sx={{ 
                  py: 1.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
                }}
              >
               <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
  <PhoneIcon sx={{ fontSize: 20 }} />
</Avatar>
<Box>
  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Telefone</Typography>
  <Typography variant="body2">(11) 5555-5555</Typography>
</Box>
</MenuItem>
</Menu>
</Box>

<IconButton
  color="inherit"
  aria-label="menu"
  sx={{ display: { xs: 'flex', md: 'none' } }}
>
  <MenuIcon />
</IconButton>

{/* Botão de Logout */}
<Button 
  color="inherit"
  onClick={onLogout}
  startIcon={<LogoutIcon />}
  sx={{ 
    ml: { xs: 1, md: 2 },
    display: 'flex'
  }}
>
  Sair
</Button>
</Toolbar>
</AppBar>

{/* Renderiza o conteúdo específico da página */}
{renderContent()}

</Box>

);
}

export default App;