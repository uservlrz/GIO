import React, { useState, useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onAnimationComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete && onAnimationComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        {/* Animated background effect */}
        <div className="background-shimmer"></div>

        {/* Logo Container */}
        <div className="logo-container">
          {/* Main Logo */}
          <div className="logo-wrapper">
            <span className="logo-text">TOP</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 30 30" 
              className="logo-arrow"
            >
              <path d="M15 5 L25 20 L5 20 Z" />
            </svg>
          </div>

          {/* Subtitle */}
          <div className="subtitle">
            Construtora e Incorporadora
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;