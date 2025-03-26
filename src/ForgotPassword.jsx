import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Container,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import fotoLogin from './assets/fotoLogin.png';
import logoTop from './assets/logoTop.png';
import authService from './authService';

const ForgotPassword = ({ onBackToLogin }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  // Dados do formulário
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Passos do processo de recuperação
  const steps = ['Identificação', 'Verificação', 'Nova Senha'];
  
  // Solicitar código de recuperação
  const handleRequestReset = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Por favor, informe seu email ou nome de usuário');
      setOpenSnackbar(true);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await authService.requestPasswordReset(email);
      setUserId(result.userId);
      setSuccess('Código de recuperação enviado com sucesso para seu email! Caso não encontre, verifique também a pasta de spam.');
      setOpenSnackbar(true);
      setActiveStep(1); // Avança para o próximo passo
    } catch (err) {
      setError(err.message || 'Erro ao solicitar recuperação de senha');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Verificar código de recuperação
  const handleVerifyToken = async (e) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setError('Por favor, informe o código de verificação');
      setOpenSnackbar(true);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await authService.verifyResetToken(userId, token);
      setSuccess('Código verificado com sucesso!');
      setOpenSnackbar(true);
      setActiveStep(2); // Avança para o próximo passo
    } catch (err) {
      setError(err.message || 'Código de verificação inválido');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Definir nova senha
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Verificar se as senhas coincidem
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      setOpenSnackbar(true);
      return;
    }
    
    // Verificar se a senha atende aos requisitos mínimos
    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setOpenSnackbar(true);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await authService.resetPassword(userId, token, newPassword);
      setSuccess('Senha redefinida com sucesso! Você será redirecionado para o login...');
      setOpenSnackbar(true);
      
      // Redirecionar para a página de login após 3 segundos
      setTimeout(() => {
        onBackToLogin();
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Erro ao redefinir a senha');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Fechar notificação
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  
  // Renderiza o formulário com base no passo atual
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box component="form" onSubmit={handleRequestReset} sx={{ mt: 3, width: '100%' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
              Informe seu email ou nome de usuário para receber um código de recuperação.
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Email ou Nome de Usuário"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
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
              disabled={loading}
              sx={{ 
                mt: 2, 
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: '1rem',
                position: 'relative'
              }}
            >
              {loading ? (
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
              ) : 'Solicitar Código'}
            </Button>
          </Box>
        );
        
      case 1:
        return (
          <Box component="form" onSubmit={handleVerifyToken} sx={{ mt: 3, width: '100%' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
              Digite o código de verificação de 6 dígitos enviado para seu email.
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Código de Verificação"
              name="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon color="primary" />
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
              disabled={loading}
              sx={{ 
                mt: 2, 
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: '1rem',
                position: 'relative'
              }}
            >
              {loading ? (
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
              ) : 'Verificar Código'}
            </Button>
          </Box>
        );
        
      case 2:
        return (
          <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 3, width: '100%' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
              Defina sua nova senha.
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Nova Senha"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Confirme a Nova Senha"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
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
              disabled={loading}
              sx={{ 
                mt: 2, 
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: '1rem',
                position: 'relative'
              }}
            >
              {loading ? (
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
              ) : 'Redefinir Senha'}
            </Button>
          </Box>
        );
        
      default:
        return null;
    }
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
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 3 }}>
            <IconButton 
              onClick={onBackToLogin}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography component="h1" variant="h5" fontWeight="bold">
              Recuperação de Senha
            </Typography>
          </Box>
          
          {/* Logo e GIO em linha sem divisor */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              mb: 3,
              px: 4
            }}
          >
            <img 
              src={logoTop} 
              alt="TOP Construtora Logo" 
              style={{ 
                height: '80px'
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
              <Typography component="h1" variant="h5" fontWeight="bold">
                GIO
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
                Gestão Inteligente de Obras
              </Typography>
            </Box>
          </Box>
          
          <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {renderStepContent()}
          
          <Box sx={{ mt: 3, textAlign: 'center', width: '100%' }}>
            <Typography 
              variant="body2" 
              color="primary" 
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
              onClick={onBackToLogin}
            >
              Voltar para o login
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              &copy; 2025 TOP Construtora - Todos os direitos reservados
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? "error" : "success"} 
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ForgotPassword;