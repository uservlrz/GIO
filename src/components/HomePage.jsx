import React from 'react';
import { 
  Container, Grid, Typography, Button, Card, CardContent, 
  CardActions, Box, Avatar, Paper, Divider, Alert
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import ComputerIcon from '@mui/icons-material/Computer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import PeopleIcon from '@mui/icons-material/People';
import BlockIcon from '@mui/icons-material/Block';
import { useAuth } from '../contexts/AuthContext'; // Importe o hook useAuth

const HomePage = ({ handleNavigateToPage, construcaoImg }) => {
  // Use o hook useAuth para acessar os métodos do contexto e o usuário atual
  const { currentUser, getBILink, hasBIAccess } = useAuth();
  
  // Obter o link de BI específico para a role do usuário
  const dashboardUrl = getBILink();
  const hasAccess = hasBIAccess();
  
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
          <Box sx={{ mb: 4, position: 'relative', textAlign: 'center' }}>
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
                mb: 0
              }}
            >
              Serviços
            </Typography>
            
            {/* Linha decorativa abaixo do título */}
            <Box 
              sx={{ 
                width: '120px', 
                height: '0px', 
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
                    onClick={() => handleNavigateToPage('iaTOP')}
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
                    onClick={() => handleNavigateToPage('SST')}
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
      
      {/* Seção Power BI - Modificada para acesso condicional */}
      {hasAccess ? (
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
                background: 'linear-gradient(90deg, #12b0a0, #12b0a0)',
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
                bgcolor: '',
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
              
              {/* Frame principal com iframe específico para a role do usuário */}
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
                  height: '70vh',
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
                    src={dashboardUrl} // Usa o link específico da role
                    frameBorder="0" 
                    allowFullScreen
                    style={{ position: 'relative', zIndex: 1 }}
                  />
                </Box>
              </Paper>
            </Box>
          </Container>
        </Box>
      ) : (
        <Box sx={{ 
          width: '100%', 
          py: 8, 
          bgcolor: '#f5f9ff',
          backgroundImage: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.95), rgba(245, 249, 255, 0.8))',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <Container maxWidth="lg">
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 4
            }}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'grey.400', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '50%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}>
                <BlockIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
            </Box>
            
            <Typography 
              variant="h3" 
              component="h2" 
              align="center" 
              gutterBottom 
              sx={{ 
                fontWeight: 700, 
                mb: 3,
                color: 'grey.600'
              }}
            >
              Acesso Restrito
            </Typography>
            
            <Alert 
              severity="info" 
              variant="filled"
              sx={{ 
                width: '80%', 
                mx: 'auto', 
                mb: 4,
                borderRadius: 2,
                py: 2
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Você não possui acesso aos dashboards
              </Typography>
              <Typography>
                Seu perfil atual não tem permissão para visualizar os dashboards de BI.
                Entre em contato com o administrador do sistema para solicitar acesso.
              </Typography>
            </Alert>
          </Container>
        </Box>
      )}
    </>
  );
};

export default HomePage;