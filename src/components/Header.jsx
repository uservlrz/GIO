import React from 'react';
import { 
  AppBar, Toolbar, Typography, Button, IconButton, Box, Avatar,
  Menu, MenuItem, Divider, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ComputerIcon from '@mui/icons-material/Computer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import PeopleIcon from '@mui/icons-material/People';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LogoutIcon from '@mui/icons-material/Logout';
import logoTop from '../assets/logoTop2.png';

const Header = ({ 
  currentPage, 
  setCurrentPage, 
  servicesAnchorEl, 
  setServicesAnchorEl,
  contactAnchorEl,
  setContactAnchorEl,
  aboutOpen,
  setAboutOpen,
  handleServicesClick,
  handleServicesClose,
  handleContactClick,
  handleContactClose,
  handleAboutOpen,
  handleAboutClose,
  handleNavigateToPage,
  onLogout,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  return (
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
                  left: '40%',
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateX(-50%) translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <MenuItem 
              onClick={() => {
                handleNavigateToPage('iaTOP');
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
              onClick={() => {
                handleNavigateToPage('SST');  // Modificado para navegar para SST
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
                mt: 0.5,
                borderRadius: 2,
                minWidth: 220,
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: '50%',
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateX(-50%) translateY(-50%) rotate(45deg)',
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
                <Typography variant="body2"> (62) 3093-0464</Typography>
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
                <Typography variant="body2">atendimento@topconstrutora.com</Typography>
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
                <Typography variant="body2">(62) 3922-0464 </Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>

        {/* Menu mobile */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Menu mobile dropdown */}
          <Menu
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            PaperProps={{
              elevation: 3,
              sx: {
                minWidth: 200,
                borderRadius: 2,
                mt: 1
              }
            }}
          >
            <MenuItem onClick={() => {
              setCurrentPage('home');
              setMobileMenuOpen(false);
            }}>
              <Typography>Início</Typography>
            </MenuItem>
            <MenuItem onClick={() => {
              handleNavigateToPage('iaTOP');
              setMobileMenuOpen(false);
            }}>
              <Typography>IA TOP</Typography>
            </MenuItem>
            <MenuItem onClick={() => {
              handleNavigateToPage('genteGestao');
              setMobileMenuOpen(false);
            }}>
              <Typography>Gente e Gestão</Typography>
            </MenuItem>
            <MenuItem onClick={() => {
              handleAboutOpen();
              setMobileMenuOpen(false);
            }}>
              <Typography>Sobre</Typography>
            </MenuItem>
            <MenuItem onClick={() => {
              handleContactClick();
              setMobileMenuOpen(false);
            }}>
              <Typography>Contato</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={onLogout}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LogoutIcon fontSize="small" />
                <Typography>Sair</Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>

        {/* Botão de Logout */}
        <Button 
          color="inherit"
          onClick={onLogout}
          startIcon={<LogoutIcon />}
          sx={{ 
            ml: { xs: 1, md: 2 },
            display: { xs: 'none', md: 'flex' }
          }}
        >
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;