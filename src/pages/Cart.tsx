import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { getRelatedProducts, getProductById } from '../data/mockData';
import '../styles/Cart.css';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { order, updateQuantity, removeFromOrder, addToOrder } = useOrder();
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    // Get recommendations based on items in the cart
    if (order.items.length > 0) {
      // Use the first item in the cart to get recommendations
      const firstItemId = order.items[0].productId;
      const relatedProducts = getRelatedProducts(firstItemId, 3);
      
      // Filter out products that are already in the cart
      const filteredRecommendations = relatedProducts.filter(
        product => product && product.id && !order.items.some(item => item.productId === product.id)
      );
      
      setRecommendations(filteredRecommendations);
    }
  }, [order.items]);

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

  const handleAddRecommendedProduct = (productId: number) => {
    const product = getProductById(productId);
    if (product) {
      addToOrder(product, 1);
      
      // Update recommendations after adding a product
      const updatedRecommendations = recommendations.filter(p => p && p.id !== productId);
      setRecommendations(updatedRecommendations);
    }
  };

  if (order.items.length === 0) {
    return (
      <div className="page-container">
        <div className="section-container">
          <h2 className="section-title">Tu carrito está vacío</h2>
          <p style={{ textAlign: 'center', marginBottom: 'var(--spacing-large)' }}>Agrega productos a tu carrito para continuar</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
              className="add-more-button"
              onClick={handleAddMoreClick}
            >
              Agregar Productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="section-container">
        <div className="cart-card">
          <h2 className="section-title cart-title">Pedido</h2>
          <div className="cart-items">
            {order.items.map((item) => (
              <div key={item.productId} className="cart-item">
                <div className="cart-item-image-container">
                  <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
                </div>
                
                <div className="cart-item-content">
                  <div className="cart-item-details">
                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.product.name}</h3>
                      <p className="cart-item-description">{item.product.description}</p>
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
        
        {recommendations.length > 0 && (
          <div className="recommendations-section">
            <h3 className="recommendations-title">Productos Recomendados</h3>
            <div className="recommendations-scroll">
              {recommendations.map((product) => (
                product && product.id && (
                  <div key={product.id} className="recommendation-card">
                    <div className="recommendation-image-container">
                      <img src={product.image} alt={product.name} className="recommendation-image" />
                    </div>
                    <div className="recommendation-details">
                      <h4>{product.name}</h4>
                      <p className="recommendation-description">{product.description}</p>
                      <div className="recommendation-price-action">
                        <span className="recommendation-price">$ {product.price.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        <button 
                          className="add-recommendation-button"
                          onClick={() => handleAddRecommendedProduct(product.id)}
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
        
        <div className="cart-summary">
          <div className="cart-total">
            <span>Total:</span>
            <span>$ {order.total.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
          
          <div className="cart-actions">
            <button 
              className="complete-payment-button"
              onClick={handleContinueClick}
            >
              Completar Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
