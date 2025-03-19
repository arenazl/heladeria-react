import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WelcomeScreen.css';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Bienvenidos a Mexican Food</h1>
        <p>Los mejores platillos mexicanos en un solo lugar</p>
        <button 
          className="start-button"
          onClick={() => navigate('/products')}
        >
          Comenzar Pedido
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
