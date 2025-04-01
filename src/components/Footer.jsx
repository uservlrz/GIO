import React from 'react';
import { 
  Box, Container, Grid, Typography, Button, Divider
} from '@mui/material';

const Footer = ({ setCurrentPage, handleAboutOpen, handleContactClick, handleNavigateToPage }) => {
  return (
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
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#12b0a0' }}>
                TOP Construtora
              </Typography>
              <Divider sx={{ width: 80, height: 3, bgcolor: '#12b0a0', mb: 3 }} />
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
                    '&:hover': { color: '#12b0a0' }
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
                    '&:hover': { color: '#12b0a0' }
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
                    '&:hover': { color: '#12b0a0' }
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
                    '&:hover': { color: '#12b0a0' }
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
                  onClick={() => handleNavigateToPage('iaTOP')} 
                  sx={{ 
                    p: 0, 
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    '&:hover': { color: '#12b0a0' }
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
                    '&:hover': { color: '#12b0a0' }
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
                    '&:hover': { color: '#12b0a0' }
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
                    '&:hover': { color: '#12b0a0' }
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
            <Typography component="a" variant="body2" sx={{ color: 'white', opacity: 0.8, textDecoration: 'none', '&:hover': { color: '#12b0a0', opacity: 1 } }}>
              Política de Privacidade
            </Typography>
            <Typography component="a" variant="body2" sx={{ color: 'white', opacity: 0.8, textDecoration: 'none', '&:hover': { color: '#12b0a0', opacity: 1 } }}>
              Termos de Uso
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;