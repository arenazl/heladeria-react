import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataService } from '../services/data.service';
import { API_CONFIG } from '../config/api.config';
import IOSInstallPrompt from '../components/IOSInstallPrompt';
import { isInStandaloneMode } from '../utils/pwaUtils';
import '../styles/MenuLoader.css';

const MenuLoader: React.FC = () => {
  const { companyId, priceListId } = useParams<{ companyId: string; priceListId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [showCompanyName, setShowCompanyName] = useState<boolean>(false);
  const [showPWAButton, setShowPWAButton] = useState<boolean>(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(false);

  const handleInstallClick = () => {
    // Show the iOS install prompt when the button is clicked
    setShowInstallPrompt(true);
  };

  const handleClosePrompt = () => {
    setShowInstallPrompt(false);
    // Store in localStorage that we've shown the prompt
    localStorage.setItem('iosInstallPromptLastShown', new Date().getTime().toString());
  };

  useEffect(() => {
    // Check if we should show the PWA button (not in standalone mode)
    const shouldShowButton = !isInStandaloneMode();
    setShowPWAButton(shouldShowButton);
    
    const loadData = async () => {
      if (!companyId || !priceListId) {
        setError('Parámetros de QR inválidos');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        const success = await dataService.loadData(companyId, priceListId);
        
        if (success) {
          // Get company name
          const name = dataService.getCompanyName();
          setCompanyName(name);
          
          // Show company name for a few seconds before redirecting
          setShowCompanyName(true);
          setLoading(false);
          
          // Redirect to products page after a delay
          setTimeout(() => {
            navigate('/products');
          }, 5500); 
        } else {
          setError('Error al cargar los datos del menú');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading menu data:', err);
        setError('Error al cargar los datos del menú');
        setLoading(false);
      }
    };

    // Load data directly
    loadData();
  }, [companyId, priceListId, navigate]);

  if (error) {
    return (
      <div className="menu-loader error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="menu-loader success">
      <div className="top-bar">
        {showPWAButton && (
          <button 
            className="pwa-install-button"
            onClick={handleInstallClick}
          >
            <svg className="app-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L12 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 10L12 5L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 17H20V22H4V17Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Instalar App para Notificaciones
          </button>
        )}
      </div>

      <div className="menu-loader-content">
        {loading ? (
          <div className="loader-container">
            <p>Cargando menú...</p>
            <div className="loader-spinner"></div>
          </div>
        ) : (
          <>
            <h2>Bienvenido a</h2>
            <h1 className="company-name">{companyName}</h1>
            <p>Cargando productos...</p>
          </>
        )}
      </div>
      
      {/* Only render the iOS Install Prompt when it should be shown */}
      {showInstallPrompt && (
        <IOSInstallPrompt onClose={handleClosePrompt} />
      )}
    </div>
  );
};

export default MenuLoader;
