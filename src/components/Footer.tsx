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
  
  // Don't show footer only on welcome screen
  const showFooter = location.pathname !== '/';
  
  // Check if we're on the quantity selection page
  const isQuantityPage = location.pathname === '/quantity';
  
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
  
  const handleAddMoreClick = () => {
    navigate('/products');
  };

  const handleFinalizeClick = () => {
    navigate('/customers');
  };

  // Plus Icon SVG
  const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  return (
    <footer className="app-footer">
      <div className="cart-actions">
        <div className="cart-button" onClick={isQuantityPage ? handleFinalizeClick : handleCartClick}>
          <div className="cart-icon">
            🛒
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </div>
          <div className="cart-info">
            <span className="cart-item-count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            <span className="cart-total">${order.total}</span>
          </div>
          <div className="cart-action">
            {isQuantityPage ? 'Finalizar →' : 'Ver Pedido →'}
          </div>
        </div>
        {isQuantityPage ? (
          <button 
            className="add-products-button" 
            onClick={handleAddMoreClick}
            title="Agregar Productos"
          >
            <span className="add-products-text">Agregar</span>
            <PlusIcon />
          </button>
        ) : (
          <button 
            className="reset-order-button" 
            onClick={handleResetOrder}
            title="Limpiar Carrito"
          >
            <TrashIcon />
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;
