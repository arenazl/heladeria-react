import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { visitedCompaniesService, VisitedCompany } from '../services/visited-companies.service';
import '../styles/QRCodePage.css';
import { API_CONFIG } from '../config/api.config';

interface QRCodePageProps {
  defaultCompanyId?: string;
  defaultPriceListId?: string;
}

const QRCodePage: React.FC<QRCodePageProps> = ({ 
  defaultCompanyId = '1', 
  defaultPriceListId = '1' 
}) => {
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState<string>(defaultCompanyId);
  const [priceListId, setpriceListId] = useState<string>(defaultPriceListId);
  const [visitedCompanies, setVisitedCompanies] = useState<VisitedCompany[]>([]);
  
  // Update state if props change
  useEffect(() => {
    setCompanyId(defaultCompanyId);
    setpriceListId(defaultPriceListId);
  }, [defaultCompanyId, defaultPriceListId]);
  
  // Load visited companies and clear session storage values that might cause redirects
  useEffect(() => {
    // Clear companyId and priceListId from sessionStorage to prevent unwanted redirects
    // when on the home page (Comparilista)
    if (window.location.hash === '#/' || window.location.hash === '') {
      sessionStorage.removeItem('companyId');
      sessionStorage.removeItem('priceListId');
      console.log('Cleared companyId and priceListId from sessionStorage on Comparilista page');
    }
    
    const companies = visitedCompaniesService.getVisitedCompanies();
    // Sort by most recent first
    companies.sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
    setVisitedCompanies(companies);
  }, []);
  
  // Base URL for the menu
  const baseUrl = window.location.origin;
  
  // Full URL for the QR code
  const qrCodeUrl = `${baseUrl}/#/menu/${companyId}/${priceListId}`;
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Handle access to a company
  const handleAccessCompany = (companyId: string, priceListId: string) => {
    navigate(`/menu/${companyId}/${priceListId}`);
  };
  
  // Handle delete company
  const handleDeleteCompany = (companyId: string) => {
    visitedCompaniesService.removeVisitedCompany(companyId);
    // Update the list
    const updatedCompanies = visitedCompaniesService.getVisitedCompanies();
    updatedCompanies.sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
    setVisitedCompanies(updatedCompanies);
  };
  
  return (
    <div className="qr-code-container">
      <h1>Negociod Escaneados</h1>
      <p className="qr-code-subtitle">Escanea códigos QR y accede rápidamente a tus empresas favoritas</p>
    
      {/* Empresas visitadas */}
      <div className="saved-companies">
        <h2>Empresas Visitadas</h2>
        
        {visitedCompanies.length > 0 ? (
          <div className="saved-companies-list">
            {visitedCompanies.map((company) => (
              <div key={company.id} className="company-item">
                <div className="company-info">
                  <div className="company-name">{company.name}</div>
                  <div className="company-date">Visitado: {formatDate(company.visitDate)}</div>
                </div>
                <div className="company-actions">
                  <button 
                    className="access-button"
                    onClick={() => handleAccessCompany(company.id, company.priceListId)}
                  >
                    Acceder
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteCompany(company.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-companies">No has visitado ninguna empresa aún. Escanea un código QR para comenzar.</p>
        )}
      </div>
      
      <div className="qr-code-instructions">
        <h2>Instrucciones</h2>
        <ol>
          <li>Escanea un código QR con la cámara de tu dispositivo</li>
          <li>Serás dirigido al menú digital de la empresa</li>
          <li>La empresa se guardará automáticamente en tu lista</li>
          <li>Podrás acceder rápidamente a ella en el futuro desde esta pantalla</li>
        </ol>
      </div>
    </div>
  );
};

export default QRCodePage;
