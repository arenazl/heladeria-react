import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import { dataService } from '../services/data.service';
import { isInStandaloneMode } from '../utils/pwaUtils';
import IOSInstallPrompt from './IOSInstallPrompt';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [companyName, setCompanyName] = useState<string>('');
  const [countryName, setCountryName] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [showPWAButton, setShowPWAButton] = useState<boolean>(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(false);
  
  // Check if data is loaded on mount and when data changes
  useEffect(() => {
    const checkData = () => {
      const dataLoaded = dataService.isLoaded();
      if (dataLoaded) {
        setCompanyName(dataService.getCompanyName());
        setCountryName(dataService.getCountryName());
        setIsLoaded(true);
      } else {
        setIsLoaded(false);
      }
    };
    
    // Check initially
    checkData();
    
    // Set up an interval to check periodically
    const interval = setInterval(checkData, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Check if we should show the PWA button (not in standalone mode)
  useEffect(() => {
    const shouldShowButton = !isInStandaloneMode();
    setShowPWAButton(shouldShowButton);
  }, []);
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handleInstallClick = () => {
    // Show the iOS install prompt when the button is clicked
    setShowInstallPrompt(true);
  };
  
  const handleClosePrompt = () => {
    setShowInstallPrompt(false);
    // Store in localStorage that we've shown the prompt
    localStorage.setItem('iosInstallPromptLastShown', new Date().getTime().toString());
  };
  
  // Don't show back button on welcome screen
  const showBackButton = location.pathname !== '/';
  
  // Get the current page name for screen reader accessibility
  const getPageName = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Inicio';
    if (path === '/categories') return 'Categorías';
    if (path.includes('/products/')) return 'Detalle del Producto';
    if (path.includes('/subcategories/') && path.includes('/products')) return 'Productos';
    if (path.includes('/subcategories')) return 'Subcategorías';
    if (path.includes('/products') && !path.includes('/products/')) return 'Productos';
    if (path === '/cart') return 'Tu Carrito';
    if (path === '/customers') return 'Seleccionar Cliente';
    if (path === '/confirmation') return 'Confirmar Pedido';
    
    return 'Inicio';
  };
  
  // If data is not loaded yet, don't show the header
  if (!isLoaded || !companyName) {
    return null;
  }
  
  return (
    <header className="app-header">
      <div className="header-left">
        {showBackButton && (
          <button className="header-back-button" onClick={handleBackClick} aria-label="Volver">
            <svg className="back-arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M15 18L9 12L15 6" 
                stroke="currentColor" 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
      
      <div className="header-center">
        <div className="header-brand">
          <div className="header-logo-container">
          <img 
            src={require('../assets/images/istockphoto-1138202866-612x612.jpg')} 
            alt="Mexican Food Logo" 
            className="header-logo" 
          />
        </div>
          <h1 className="header-title">
            <span className="restaurant-name">{dataService.getCompanyName()}</span>
            <span className="restaurant-location">{dataService.getCountryName()}</span>
            <span className="visually-hidden">{getPageName()}</span>
          </h1>
        </div>
      </div>
      
      <div className="header-right">
        {showPWAButton && (
          <button 
            className="header-install-button"
            onClick={handleInstallClick}
            aria-label="Instalar App"
          >
            <svg className="install-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 10L12 5L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 17H20V22H4V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
      
      {/* Only render the iOS Install Prompt when it should be shown */}
      {showInstallPrompt && (
        <IOSInstallPrompt onClose={handleClosePrompt} />
      )}

    </header>
  );
};

export default Header;
