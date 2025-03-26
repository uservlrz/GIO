import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Se estiver usando roteamento
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Importações de estilos
import './index.css';
import './global.css'; // Se tiver estilos globais adicionais

// Importações de componentes e contextos
import { AuthProvider } from './AuthContext';
import Login from './Login';

// Configuração de temas
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  // Configurações adicionais de tema
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Impede que botões fiquem em maiúsculas por padrão
        },
      },
    },
  },
});

// Renderização da aplicação
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS */}
      <AuthProvider>
        {/* Você pode adicionar roteamento aqui se necessário */}
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);