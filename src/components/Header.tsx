import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import { dataService } from '../services/data.service';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [companyName, setCompanyName] = useState<string>('');
  const [countryName, setCountryName] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  
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
  
  const handleBackClick = () => {
    navigate(-1);
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
         u </div>
          <h1 className="header-title">
            <span className="restaurant-name">{dataService.getCompanyName()}</span>
            <span className="restaurant-location">{dataService.getCountryName()}</span>
            <span className="visually-hidden">{getPageName()}</span>
          </h1>
        </div>
      </div>
      
{/*       
      <div className="header-right">
        <div className="header-company-logo">
          <img 
            src={require('../assets/images/NucleoItLogo50x50.png')} 
            alt="NucleoIt Logo" 
            className="company-logo" 
          />
        </div>
      </div> */}

    </header>
  );
};

export default Header;
