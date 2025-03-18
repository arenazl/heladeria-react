import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { getRelatedProducts } from '../data/mockData';
import { Product } from '../models/types';
import '../styles/OrderConfirmation.css';

// SVG Icons
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { order, clearOrder, addToOrder } = useOrder();
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    // Get recommendations based on items in the cart
    if (order.items.length > 0) {
      // Use the first item in the cart to get recommendations
      const firstItemId = order.items[0].productId;
      const relatedProducts = getRelatedProducts(firstItemId, 3);
      
      // Filter out products that are already in the cart
      const filteredRecommendations = relatedProducts.filter(
        product => !order.items.some(item => item.productId === product.id)
      );
      
      setRecommendations(filteredRecommendations);
    }
  }, [order.items]);

  const handleAddRecommendedProduct = (product: Product) => {
    addToOrder(product, 1);
    
    // Update recommendations after adding a product
    setRecommendations(prev => prev.filter(p => p.id !== product.id));
  };

  const handleConfirmOrder = () => {
    // Navigate to payment selection screen
    navigate('/payment');
  };

  const handleResetOrder = () => {
    // Clear the entire order and navigate back to categories
    clearOrder();
    navigate('/categories');
  };

  if (!order.customer) {
    return (
      <div className="confirmation-container">
        <div className="error-message">
          Por favor selecciona un cliente antes de confirmar el pedido.
        </div>
        <button 
          className="back-to-customers-button"
          onClick={() => navigate('/customers')}
        >
          Seleccionar Cliente
        </button>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-header">
        <h2 className="confirmation-title">Confirmar Pedido</h2>  
      </div>
      
      <div className="confirmation-content">
        <div className="customer-details">
          <h2>Datos del Cliente</h2>
          <div className="customer-info-card">
            <div className="customer-avatar">
              {order.customer.name.charAt(0)}
            </div>
            <div className="customer-info">
              <h3>{order.customer.name}</h3>
              <p className="customer-address">{order.customer.address}</p>
              <p className="customer-phone">{order.customer.phone}</p>
            </div>
          </div>
        </div>
        
        <div className="order-details">
          <h2>Detalle del Pedido</h2>
          <div className="order-items-list">
            {order.items.map((item) => (
              <div key={item.productId} className="order-item-row">
                <div className="order-item-name">
                  {item.product.name} x {item.quantity}
                </div>
                <div className="order-item-price">
                  ${item.product.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-total-row">
            <div className="order-total-label">Total:</div>
            <div className="order-total-amount">${order.total}</div>
          </div>
        </div>
        
        {recommendations.length > 0 && (
          <div className="recommendations-section">
            <h2>Productos Recomendados</h2>
            <div className="recommendations-grid">
              {recommendations.map((product) => (
                <div key={product.id} className="recommendation-card">
                  <div className="recommendation-image-container">
                    <img src={product.image} alt={product.name} className="recommendation-image" />
                  </div>
                  <div className="recommendation-details">
                    <h3>{product.name}</h3>
                    <p className="recommendation-description">{product.description}</p>
                    <div className="recommendation-price-action">
                      <span className="recommendation-price">${product.price}</span>
                      <button 
                        className="add-recommendation-button"
                        onClick={() => handleAddRecommendedProduct(product)}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button 
          className="confirm-order-button"
          onClick={handleConfirmOrder}
        >
          Confirmar Pedido
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
