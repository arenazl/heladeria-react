import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { formatTime } from '../utils/orderUtils';
import '../styles/OrderReady.css';

const OrderReady: React.FC = () => {
  const navigate = useNavigate();
  const { order } = useOrder();

  useEffect(() => {
    // If there's no order or no items, redirect to home
    if (!order || order.items.length === 0) {
      navigate('/');
    }
  }, [order, navigate]);

  const handleBackToHome = () => {
    navigate('/');
  };

  if (!order || order.items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="order-ready-container">
      <div className="order-ready-card">
        <div className="order-ready-header">
          <div className="order-ready-icon">✅</div>
          <h1 className="order-ready-title">¡Tu pedido está listo!</h1>
          <p className="order-ready-subtitle">Por favor retira por mostrador</p>
        </div>

        <div className="order-ready-details">
          <div className="order-ready-info">
            <p className="order-ready-name">
              <strong>Nombre:</strong> {order.customerName || (order.customer ? order.customer.name : 'Cliente')}
            </p>
            {order.estimatedPickupTime && (
              <p className="order-ready-time">
                <strong>Hora de preparación:</strong> {formatTime(order.estimatedPickupTime)}
              </p>
            )}
          </div>

          <div className="order-ready-items">
            <h2>Detalle del Pedido</h2>
            <div className="order-ready-items-list">
              {order.items.map((item) => (
                <div key={item.productId} className="order-ready-item">
                  <div className="order-ready-item-name">
                    {item.product.name} x {item.quantity}
                  </div>
                  <div className="order-ready-item-price">
                    $ {(item.product.price * item.quantity).toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-ready-total">
              <span>Total:</span>
              <span>$ {order.total.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
          </div>
        </div>

        <div className="order-ready-instructions">
          <h3>Instrucciones de retiro:</h3>
          <p>Dirígete al mostrador y menciona tu nombre para retirar tu pedido.</p>
          <p>¡Gracias por tu compra!</p>
        </div>

        <button 
          className="order-ready-button"
          onClick={handleBackToHome}
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default OrderReady;
