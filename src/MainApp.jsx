// src/MainApp.jsx
import React from 'react';
import App from './App';
import { AuthProvider, useAuth } from "./AuthContext";
import { CircularProgress, Box } from '@mui/material';
import Login from './Login';

// Em MainApp.jsx
const AuthenticatedApp = () => {
  const { currentUser, loading, logout } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Certifique-se que está passando logout como onLogout
  return currentUser ? <App onLogout={logout} /> : <Login />;
};

// Componente principal que provê o contexto de autenticação
function MainApp() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default MainApp;