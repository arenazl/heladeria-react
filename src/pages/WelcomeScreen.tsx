import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IOSInstallPrompt from '../components/IOSInstallPrompt';
import { isIOS, isInStandaloneMode } from '../utils/pwaUtils';
import '../styles/WelcomeScreen.css';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showPWAButton, setShowPWAButton] = useState<boolean>(isIOS() && !isInStandaloneMode());

  const handleInstallClick = () => {
    // Show the iOS install prompt
    // The prompt component will handle the actual display logic
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Bienvenidos a Mexican Food</h1>
        <p>Los mejores platillos mexicanos en un solo lugar</p>
        <button 
          className="start-button"
          onClick={() => navigate('/products')}
        >
          Comenzar Pedido
        </button>
        
        {showPWAButton && (
          <button 
            className="pwa-install-button"
            onClick={handleInstallClick}
          >
            Instalar App para Notificaciones
          </button>
        )}
      </div>
      
      {/* iOS Install Prompt */}
      <IOSInstallPrompt onClose={() => setShowPWAButton(false)} />
    </div>
  );
};

export default WelcomeScreen;
