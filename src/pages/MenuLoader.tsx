import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataService } from '../services/data.service';
import { API_CONFIG } from '../config/api.config';
import '../styles/MenuLoader.css';

const MenuLoader: React.FC = () => {
  const { companyId, priceListId } = useParams<{ companyId: string; priceListId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [showCompanyName, setShowCompanyName] = useState<boolean>(false);

  useEffect(() => {

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
          
          // Redirect to welcome screen after a delay
          setTimeout(() => {
            navigate('/');
          }, 2000);
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

    // If using mock data and not in development, skip the loading screen
    if (API_CONFIG.USE_MOCK_DATA && process.env.NODE_ENV !== 'development') {
      navigate('/products');
    } else {
      loadData();
    }
  }, [companyId, priceListId, navigate]);

  if (loading) {
    return (
      <div className="menu-loader">
        <h2>Cargando menú...</h2>
        <div className="loader-spinner"></div>
      </div>
    );
  }

  if (showCompanyName) {
    return (
      <div className="menu-loader company-name">
        <h1>Bienvenido a</h1>
        <h2 className="company-title">{companyName}</h2>
        <p>Cargando menú...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-loader error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  return null; // This component should redirect, so it shouldn't render anything if successful
};

export default MenuLoader;
