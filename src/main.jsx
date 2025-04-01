import React from 'react';
import ReactDOM from 'react-dom/client';
import './styless/index.css';
import Login from './components/Login';  // Importe o Login
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';  // Adicione a importação do AuthProvider

// Tema personalizado para a aplicação
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e6076',
      light: '#12b0a0',
      dark: '#12b0a0',
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
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Login />  
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);