import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IOSInstallPrompt from '../components/IOSInstallPrompt';
import { isIOS, isInStandaloneMode } from '../utils/pwaUtils';
import { dataService } from '../services/data.service';
import '../styles/WelcomeScreen.css';
import { API_CONFIG } from '../config/api.config';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showPWAButton, setShowPWAButton] = useState<boolean>(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(false);
  useEffect(() => {
    // Check if we should show the PWA button (iOS device and not in standalone mode)
    const shouldShowButton = !isInStandaloneMode();
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

  const handleScanQR = () => {
    // Check if we have a company ID in sessionStorage
    const companyId = sessionStorage.getItem('companyId');
    
    if (companyId) {
      // If we have a company ID, navigate to the menu with that company ID
      navigate(`/menu/${companyId}/1`);
    } else {
      // If we don't have a company ID, navigate to the QR code page
      navigate('/qr-example');
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Bienvenido</h1>
        <p>Escanea el código QR de tu mesa para comenzar</p>
        
        <button 
          className="scan-qr-button"
          onClick={handleScanQR}
        >
          Escanear QR
        </button>
        
        <button 
          className="qr-generator-button"
          onClick={() => navigate('/qr-example')}
        >
          Ver Código QR de Ejemplo
        </button>
      </div>
      
      {showPWAButton && (
        <div className="install-app-container">
          <button 
            className="pwa-install-button"
            onClick={handleInstallClick}
          >
            <img src={require('../assets/favicon.ico')} alt="App Icon" className="app-icon" />
            Instalar App para Notificaciones
          </button>
        </div>
      )}
      
      {/* Only render the iOS Install Prompt when it should be shown */}
      {showInstallPrompt && (
        <IOSInstallPrompt onClose={handleClosePrompt} />
      )}
    </div>
  );
};

export default WelcomeScreen;
