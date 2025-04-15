import { useState } from 'react'
import { Box } from '@mui/material';
import construcaoImg from './assets/construcao.png';
import GenteGestao from './components/GenteGestao';
import { useAuth } from './contexts/AuthContext';
import FormularioSST from './components/SST/FormularioSST'; // Importe apenas o componente principal

// Importação dos componentes separados
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import IaTopPage from './components/IaTop';

function App({ onLogout }) {
  // Estado para controlar a página atual
  const [currentPage, setCurrentPage] = useState('home');
  
  // Estados para os menus dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      case 'iaTOP':
        return <IaTopPage onBack={handleBackToHome} />;
      case 'genteGestao':
        return <GenteGestao onBack={handleBackToHome} />;
      case 'SST': // Use o FormularioSST ao invés do FormularioSeguranca
        return <FormularioSST handleBackToHome={handleBackToHome} />;
      case 'home':
      default:
        return (
          <HomePage 
            currentUser={currentUser}
            handleNavigateToPage={handleNavigateToPage}
            construcaoImg={construcaoImg}
          />
        );
    }
  };

  // Renderiza o conteúdo principal ou a página específica
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header component */}
      <Header 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        servicesAnchorEl={servicesAnchorEl}
        setServicesAnchorEl={setServicesAnchorEl}
        contactAnchorEl={contactAnchorEl}
        setContactAnchorEl={setContactAnchorEl}
        aboutOpen={aboutOpen}
        setAboutOpen={setAboutOpen}
        handleServicesClick={handleServicesClick}
        handleServicesClose={handleServicesClose}
        handleContactClick={handleContactClick}
        handleContactClose={handleContactClose}
        handleAboutOpen={handleAboutOpen}
        handleAboutClose={handleAboutClose}
        handleNavigateToPage={handleNavigateToPage}
        onLogout={onLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Conteúdo específico da página */}
      {renderContent()}

      {/* Footer apenas visível na página inicial */}
      {currentPage === 'home' && (
        <Footer 
          setCurrentPage={setCurrentPage}
          handleAboutOpen={handleAboutOpen}
          handleContactClick={handleContactClick}
          handleNavigateToPage={handleNavigateToPage}
        />
      )}
    </Box>
  );
}

export default App;