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
          
          // Redirect to products page after a delay
          setTimeout(() => {
            navigate('/products');
          }, 3500); // Show company name for 1.5 seconds before redirecting
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

  if (loading) {
    return (
      <div className="menu-loader">
        <h2>Cargando menú...</h2>
        <div className="loader-spinner"></div>
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

  if (showCompanyName && companyName) {
    return (
      <div className="menu-loader success">
        <h2>Bienvenido a</h2>
        <h1 className="company-name">{companyName}</h1>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return null; // This component should redirect, so it shouldn't render anything if successful
};

export default MenuLoader;
