import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IOSInstallPrompt from '../components/IOSInstallPrompt';
import { isIOS, isInStandaloneMode } from '../utils/pwaUtils';
import '../styles/WelcomeScreen.css';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showPWAButton, setShowPWAButton] = useState<boolean>(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if we should show the PWA button (iOS device and not in standalone mode)
    const shouldShowButton = isIOS() && !isInStandaloneMode();
    setShowPWAButton(shouldShowButton);
    
    // Automatically show the install prompt on first load for iOS devices
    // but only if we haven't shown it recently (check is done in the component)
    if (shouldShowButton) {
      // Clear any previous localStorage entry to ensure the prompt shows
      localStorage.removeItem('iosInstallPromptLastShown');
      setShowInstallPrompt(true);
    }
  }, []);

  const handleInstallClick = () => {
    // Show the iOS install prompt when the button is clicked
    setShowInstallPrompt(true);
  };

  const handleClosePrompt = () => {
    setShowInstallPrompt(false);
    // Store in localStorage that we've shown the prompt
    localStorage.setItem('iosInstallPromptLastShown', new Date().getTime().toString());
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
      
      {/* Only render the iOS Install Prompt when it should be shown */}
      {showInstallPrompt && (
        <IOSInstallPrompt onClose={handleClosePrompt} />
      )}
    </div>
  );
};

export default WelcomeScreen;
