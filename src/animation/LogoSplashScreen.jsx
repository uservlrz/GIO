import React, { useState, useEffect } from 'react';
import logoTop from '../assets/logoTop.png';

const LogoSplashScreen = ({ onAnimationComplete }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in
    const fadeInTimer = setTimeout(() => {
      setOpacity(1);
    }, 100);

    // Fade out after 3 seconds
    const fadeOutTimer = setTimeout(() => {
      setOpacity(0);
      
      // Notifica que a animação foi concluída
      const completeTimer = setTimeout(() => {
        onAnimationComplete();
      }, 1000); // Tempo da animação de fade out

      return () => clearTimeout(completeTimer);
    }, 3000);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
    };
  }, [onAnimationComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      opacity: opacity,
      transition: 'opacity 1s ease-in-out',
      pointerEvents: 'none'
    }}>
      <img 
        src={logoTop} 
        alt="TOP Construtora Logo" 
        style={{ 
          maxWidth: '300px', 
          maxHeight: '300px',
          objectFit: 'contain'
        }} 
      />
      <h2 style={{
        marginTop: '1rem',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        opacity: opacity,
        transition: 'opacity 1s ease-in-out'
      }}>
        GIO - Gestão Inteligente de Obras
      </h2>
    </div>
  );
};

export default LogoSplashScreen;