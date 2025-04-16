import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, ThemeType } from '../context/ThemeContext';
import '../styles/Settings.css';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Función para cambiar el tema
  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
  };

  // Función para volver a la página anterior
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Configuración</h1>
        <button className="settings-back-button" onClick={handleBack}>
          Volver
        </button>
      </div>

      <div className="settings-section">
        <h2>Temas de Colores</h2>
        <p>Selecciona un tema para personalizar la apariencia de la aplicación.</p>

        <div className="theme-options">
          {/* Tema Verde */}
          <div 
            className={`theme-option ${theme === 'green' ? 'active' : ''}`}
            onClick={() => handleThemeChange('green')}
          >
            <div className="theme-preview green-theme">
              <div className="theme-preview-header"></div>
              <div className="theme-preview-content"></div>
            </div>
            <div className="theme-name">Verde</div>
            {theme === 'green' && <div className="theme-selected-indicator">✓</div>}
          </div>

          {/* Tema Turquesa */}
          <div 
            className={`theme-option ${theme === 'turquoise' ? 'active' : ''}`}
            onClick={() => handleThemeChange('turquoise')}
          >
            <div className="theme-preview turquoise-theme">
              <div className="theme-preview-header"></div>
              <div className="theme-preview-content"></div>
            </div>
            <div className="theme-name">Turquesa</div>
            {theme === 'turquoise' && <div className="theme-selected-indicator">✓</div>}
          </div>

          {/* Tema Oscuro */}
          <div 
            className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => handleThemeChange('dark')}
          >
            <div className="theme-preview dark-theme">
              <div className="theme-preview-header"></div>
              <div className="theme-preview-content"></div>
            </div>
            <div className="theme-name">Modo Oscuro</div>
            {theme === 'dark' && <div className="theme-selected-indicator">✓</div>}
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <p>Los cambios se aplican automáticamente y se guardan para futuras visitas.</p>
      </div>
    </div>
  );
};

export default Settings;
