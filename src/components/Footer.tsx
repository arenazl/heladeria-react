import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import '../styles/Footer.css';

// Trash Icon SVG
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { order, clearOrder } = useOrder();
  
  // Don't show footer on welcome screen or when already in cart
  const showFooter = location.pathname !== '/' && location.pathname !== '/quantity';
  
  const handleCartClick = () => {
    navigate('/quantity');
  };

  const handleResetOrder = () => {
    // Clear entire order and navigate to welcome screen
    clearOrder();
    navigate('/');
  };
  
  if (!showFooter) {
    return null;
  }
  
  const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <footer className="app-footer">
      <div className="cart-actions">
        <div className="cart-button" onClick={handleCartClick}>
          <div className="cart-icon">
            🛒
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </div>
          <div className="cart-info">
            <span className="cart-item-count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            <span className="cart-total">${order.total}</span>
          </div>
          <div className="cart-action">
            Ver Pedido →
          </div>
        </div>
        <button 
          className="reset-order-button" 
          onClick={handleResetOrder}
          title="Limpiar Carrito"
        >
          <TrashIcon />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
