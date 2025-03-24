import React from 'react';
import { getIOSInstallInstructions } from '../utils/pwaUtils';
import '../styles/IOSInstallPrompt.css';

interface IOSInstallPromptProps {
  onClose?: () => void;
}

const IOSInstallPrompt: React.FC<IOSInstallPromptProps> = ({ onClose }) => {
  const { title, steps } = getIOSInstallInstructions();

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="ios-install-prompt">
      <div className="ios-install-prompt-content">
        <button className="ios-install-prompt-close" onClick={handleClose}>×</button>
        <h3>{title}</h3>
        <p>Para una mejor experiencia y recibir notificaciones, instala esta aplicación en tu dispositivo iOS:</p>
        <ol>
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
        <div className="ios-install-prompt-image">
          {/* Safari share icon illustration */}
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8L12 2L6 8" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2V16" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 13V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p>Toca este ícono</p>
        </div>
        <button className="ios-install-prompt-button" onClick={handleClose}>Entendido</button>
      </div>
    </div>
  );
};

export default IOSInstallPrompt;
