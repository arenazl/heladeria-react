import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { dataService } from '../services/data.service';
import '../styles/Cart.css';
import { IMAGE_BASE_URL } from '../config/image.config';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { order, updateQuantity, removeFromOrder } = useOrder();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromOrder(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleContinueClick = () => {
    navigate('/payment');
  };

  const handleAddMoreClick = () => {
    navigate('/products');
  };

  if (order.items.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-cart-container">
          <div className="empty-cart-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 7.67V6.7c0-2.25 1.81-4.46 4.06-4.67a4.5 4.5 0 0 1 4.94 4.48v1.38" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22h6c4.02 0 4.74-1.61 4.95-3.57l.75-6C20.97 9.99 20.27 8 16 8H8c-4.27 0-4.97 1.99-4.7 4.43l.75 6C4.26 20.39 4.98 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path opacity="0.4" d="M15.5 12h.01M8.5 12h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="empty-cart-title">Tu carrito está vacío</h2>
          <p className="empty-cart-message">Parece que aún no has añadido productos a tu carrito</p>
          <button 
            className="browse-products-button"
            onClick={handleAddMoreClick}
          >
            <span className="button-icon">+</span>
            Explorar Productos
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="page-container">
      <div className="section-container">
        <div className="cart-card">

            <h3 className="recommendations-title">Pedido</h3>


          <div className="cart-items">
            {order.items.map((item) => (
              <div key={item.productId} className="cart-item">
                <div className="cart-item-image-container">
<img src={item.product.image ? (item.product.image.startsWith('http') ? item.product.image : `${IMAGE_BASE_URL}${item.product.image}`) : ''} alt={item.product.name} className="cart-item-image" />
                </div>
                
                <div className="cart-item-content">
                  <div className="cart-item-details">
<div className="cart-item-info">
                      <h3 className="cart-item-name">{item.product.name}</h3>
                      {
                        item.product.description ? (
                          <p className="cart-item-description">{item.product.description}</p>
                        ) : (
                          <p className="cart-item-description">Esta es la descripción de un producto excelente de calidad y que le recomendamos</p>
                        )
                      }
                    </div>
                    <div className="cart-item-price-container">
                      <span className="cart-item-price">$ {(item.product.price * item.quantity).toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                  </div>
                  
                  <div className="cart-item-quantity-container">
                    <div className="cart-item-quantity">
                      {item.quantity === 1 ? (
                        <button 
                          className="quantity-button trash-button"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          aria-label="Eliminar producto"
                        >
                          🗑️
                        </button>
                      ) : (
                        <button 
                          className="quantity-button"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          aria-label="Disminuir cantidad"
                        >
                          -
                        </button>
                      )}
                      <span className="quantity-value">{item.quantity}</span>
                      <button 
                        className="quantity-button"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        
        <div className="cart-summary">
          <div className="cart-total">
            <span>Total:</span>
            <span>$ {order.total.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
          

        </div>
      </div>
    </div>
  );
};

export default Cart;
