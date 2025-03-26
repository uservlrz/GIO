// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Login';  // Importe o Login
// import MainApp from './MainApp';  // Comente ou remova esta linha
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './AuthContext';  // Adicione a importação do AuthProvider

// Tema personalizado para a aplicação
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
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Login />  {/* Substitua MainApp por Login */}
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);