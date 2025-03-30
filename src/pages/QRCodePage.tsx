import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import '../styles/QRCodePage.css';

interface QRCodePageProps {
  defaultCompanyId?: string;
  defaultPriceListId?: string;
}

const QRCodePage: React.FC<QRCodePageProps> = ({ 
  defaultCompanyId = '887', 
  defaultPriceListId = '1' 
}) => {
  const [companyId, setCompanyId] = useState<string>(defaultCompanyId);
  const [priceListId, setpriceListId] = useState<string>(defaultPriceListId);
  
  // Update state if props change
  useEffect(() => {
    setCompanyId(defaultCompanyId);
    setpriceListId(defaultPriceListId);
  }, [defaultCompanyId, defaultPriceListId]);
  
  // Base URL for the menu
  const baseUrl = window.location.origin;
  
  // Full URL for the QR code
  const qrCodeUrl = `${baseUrl}/#/menu/${companyId}/${priceListId}`;
  
  return (
    <div className="qr-code-container">
      <h1>Código QR para el Menú Digital</h1>
      
      <div className="qr-code-settings">
        <div className="form-group">
          <label htmlFor="companyId">ID de Compañía:</label>
          <input 
            type="text" 
            id="companyId" 
            value={companyId} 
            onChange={(e) => setCompanyId(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="priceListId">ID de Lista de Precios:</label>
          <input 
            type="text" 
            id="priceListId" 
            value={priceListId} 
            onChange={(e) => setpriceListId(e.target.value)}
          />
        </div>
      </div>
      
      <div className="qr-code-display">
        <QRCodeCanvas 
          value={qrCodeUrl}
          size={256}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"H"}
          includeMargin={true}
        />
      </div>
      
      <div className="qr-code-url">
        <p>URL del menú: <a href={qrCodeUrl} target="_blank" rel="noopener noreferrer">{qrCodeUrl}</a></p>
      </div>
      
      <div className="qr-code-instructions">
        <h2>Instrucciones</h2>
        <ol>
          <li>Escanea este código QR con la cámara de tu dispositivo</li>
          <li>Serás dirigido al menú digital de la heladería</li>
          <li>Navega por las categorías y productos disponibles</li>
          <li>Realiza tu pedido directamente desde tu dispositivo</li>
        </ol>
      </div>
    </div>
  );
};

export default QRCodePage;
