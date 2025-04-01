import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Container,
  InputAdornment,
  IconButton,
  Avatar,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import StorageIcon from '@mui/icons-material/Storage';
import fotoLogin from '../assets/fotoLogin.png';
import logoTop from '../assets/logoTop.png';
import { useAuth } from "../contexts/AuthContext";
import MainApp from '../MainApp';  
import ForgotPassword from './ForgotPassword'; 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [openMigrationDialog, setOpenMigrationDialog] = useState(false);

  // Use o hook do contexto de autenticação
  const { currentUser, login, loading, authError } = useAuth();

  // Se já estiver autenticado, redireciona para o MainApp
  if (currentUser) {
    return <MainApp />;
  }

  // Se estiver mostrando a tela de recuperação de senha
  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />;
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validação do formulário
    if (!username.trim()) {
      setFormError('O nome de usuário é obrigatório');
      setOpenSnackbar(true);
      return;
    }
    
    if (!password.trim()) {
      setFormError('A senha é obrigatória');
      setOpenSnackbar(true);
      return;
    }
    
    setFormError('');
    setIsSubmitting(true);
    
    try {
      // Usa o método login do contexto de autenticação
      await login(username, password);
      // O redirecionamento será feito automaticamente pela verificação de currentUser
    } catch (error) {
      // Erro já sendo gerenciado pelo contexto, mas podemos mostrar no snackbar
      setFormError(error.message || 'Erro de autenticação');
      setOpenSnackbar(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Função para mostrar a tela de recuperação de senha
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  // Funções para abrir e fechar o diálogo de migração
  const handleOpenMigrationDialog = () => {
    setOpenMigrationDialog(true);
  };

  const handleCloseMigrationDialog = () => {
    setOpenMigrationDialog(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundImage: `url(${fotoLogin})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      {/* Overlay escurecido */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1,
        }}
      />
      
      <Container 
        component="main" 
        maxWidth="sm" 
        sx={{ 
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 5
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
            }
          }}
        >
          <Box 
            sx={{ 
              width: '100%',
              mb: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Logo e GIO em linha sem divisor */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                mb: 1,
                px: 4
              }}
            >
              <img 
                src={logoTop} 
                alt="TOP Construtora Logo" 
                style={{ 
                  height: '100px'
                }} 
              />
              
              {/* GIO e texto abaixo */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Typography component="h1" variant="h4" fontWeight="bold">
                  GIO
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
                  Gestão Inteligente de Obras
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Mensagem de erro de autenticação */}
          {(authError || formError) && (
            <Alert 
              severity="error" 
              variant="filled"
              sx={{ width: '100%', mb: 3 }}
            >
              {authError || formError}
            </Alert>
          )}
          
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
              width: '100%', 
              mt: 1 
            }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nome de usuário"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              startIcon={isSubmitting || loading ? null : <LoginIcon />}
              disabled={isSubmitting || loading}
              sx={{ 
                mt: 2, 
                mb: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: '1rem',
                position: 'relative'
              }}
            >
              {isSubmitting || loading ? (
                <CircularProgress 
                  size={24} 
                  sx={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }} 
                />
              ) : 'Entrar'}
            </Button>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                &copy; 2025 TOP Construtora - Todos os direitos reservados
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
                <Typography 
                  variant="body2" 
                  color="primary" 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                  onClick={handleForgotPassword}
                >
                  Esqueceu sua senha?
                </Typography>
                
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="error"
          sx={{ width: '100%' }}
        >
          {formError || authError || 'Erro de autenticação'}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;

