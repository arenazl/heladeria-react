import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, ThemeType } from '../context/ThemeContext';
import { useRelatedProducts } from '../context/RelatedProductsContext';
import '../styles/Settings.css';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { showRelatedProducts, setShowRelatedProducts } = useRelatedProducts();

  // Función para cambiar el tema
  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
  };

  // Función para cambiar la configuración de productos relacionados
  const handleRelatedProductsChange = (show: boolean) => {
    setShowRelatedProducts(show);
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

          {/* Tema Naranja */}
          <div 
            className={`theme-option ${theme === 'orange' ? 'active' : ''}`}
            onClick={() => handleThemeChange('orange')}
          >
            <div className="theme-preview orange-theme">
              <div className="theme-preview-header"></div>
              <div className="theme-preview-content"></div>
            </div>
            <div className="theme-name">Naranja</div>
            {theme === 'orange' && <div className="theme-selected-indicator">✓</div>}
          </div>

          {/* Tema Ladrillo */}
          <div 
            className={`theme-option ${theme === 'brick' ? 'active' : ''}`}
            onClick={() => handleThemeChange('brick')}
          >
            <div className="theme-preview brick-theme">
              <div className="theme-preview-header"></div>
              <div className="theme-preview-content"></div>
            </div>
            <div className="theme-name">Ladrillo</div>
            {theme === 'brick' && <div className="theme-selected-indicator">✓</div>}
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

      <div className="settings-section">
        <h2>Productos Relacionados</h2>
        <p>Activa o desactiva la visualización de productos relacionados en todas las pantallas.</p>

        <div className="toggle-option">
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={showRelatedProducts}
              onChange={(e) => handleRelatedProductsChange(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
          <div className="toggle-label">
            {showRelatedProducts ? 'Activado' : 'Desactivado'}
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
