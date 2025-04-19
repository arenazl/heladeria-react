import React from 'react';
import '../styles/Footer.css';

const TestFooter: React.FC = () => {
  return (
    <footer className="app-footer" style={{ backgroundColor: 'red' }}>
      <div className="cart-actions">
        <div style={{ color: 'white', fontWeight: 'bold' }}>
          ESTE ES UN FOOTER DE PRUEBA
        </div>
      </div>
    </footer>
  );
};

export default TestFooter;
