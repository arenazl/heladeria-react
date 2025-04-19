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
  
  // Don't show footer on welcome screen or when cart is empty
  const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
  const showFooter = location.pathname !== '/' && itemCount > 0;
  
  // Check if we're on the cart page
  const isCartPage = location.pathname === '/cart';
  
  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleResetOrder = () => {
    // Clear entire order and navigate to welcome screen
    clearOrder();
    navigate('/');
  };
  
  const handleAddMoreClick = () => {
    navigate('/products');
  };

  const handleFinalizeClick = () => {
    navigate('/payment');
  };

  // Plus Icon SVG
  const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  if (!showFooter) {
    return null;
  }

  return (
    <footer className="app-footer">
      <div className="cart-actions">
        {isCartPage ? (
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
        <div className="cart-button" onClick={isCartPage ? handleFinalizeClick : handleCartClick}>
          <div className="cart-icon">
            🛒
            <span className="cart-badge">{itemCount}</span>
          </div>
          <div className="cart-info">
            {itemCount > 0 && <span className="cart-total">$ {order.total.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>}
          </div>
          <div className="cart-action">
            {isCartPage ? 'Finalizar →' : 'Ver Carrito →'}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
