import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import '../styles/PaymentSelection.css';

// Define payment method types
type PaymentMethod = 'cash' | 'credit_card' | 'mercado_pago';

const PaymentSelection: React.FC = () => {
  const navigate = useNavigate();
  const { order, clearOrder } = useOrder();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
  };

  const handleConfirmPayment = () => {
    if (!selectedPayment) {
      alert('Por favor selecciona un método de pago');
      return;
    }

    // Here we would process the payment
    // For now, we'll just show a success message and clear the order
    alert(`¡Pago con ${getPaymentMethodName(selectedPayment)} procesado con éxito! En un futuro, esto se enviará a un endpoint.`);
    clearOrder();
    navigate('/');
  };

  const getPaymentMethodName = (method: PaymentMethod): string => {
    switch (method) {
      case 'cash':
        return 'Efectivo';
      case 'credit_card':
        return 'Tarjeta de Crédito';
      case 'mercado_pago':
        return 'Mercado Pago';
      default:
        return '';
    }
  };

  if (!order.customer) {
    return (
      <div className="page-container">
        <div className="section-container">
          <div className="error-message">
            Por favor selecciona un cliente antes de elegir el método de pago.
          </div>
          <button 
            className="back-to-customers-button"
            onClick={() => navigate('/customers')}
          >
            Seleccionar Cliente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="section-container">
        <h2 className="section-title"> Completar Pago</h2>
        
        <div className="payment-order-summary">
          <h3>Resumen del Pedido</h3>
          <div className="payment-order-items">
            {order.items.map((item) => (
              <div key={item.productId} className="payment-order-item">
                <div className="payment-item-details">
                  <span className="payment-item-name">{item.product.name}</span>
                  <span className="payment-item-quantity">x {item.quantity}</span>
                </div>
                <div className="payment-item-description">{item.product.description}</div>
                <div className="payment-item-price">${item.product.price * item.quantity}</div>
              </div>
            ))}
          </div>
          
          <div className="payment-customer-info">
            <h4>Cliente:</h4>
            <p>{order.customer.name}</p>
            <p>{order.customer.address}</p>
          </div>
          
          <div className="payment-total">
            <span>Total:</span>
            <span>${order.total}</span>
          </div>
        </div>
        
        <div className="payment-methods-container">
          <h3>Metodo de Pago</h3>
          
          <div className="payment-methods-grid">
            <div 
              className={`payment-method-card ${selectedPayment === 'cash' ? 'selected' : ''}`}
              onClick={() => handlePaymentSelect('cash')}
            >
              <div className="payment-method-icon">💵</div>
              <div className="payment-method-name">Efectivo</div>
            </div>
            
            <div 
              className={`payment-method-card ${selectedPayment === 'credit_card' ? 'selected' : ''}`}
              onClick={() => handlePaymentSelect('credit_card')}
            >
              <div className="payment-method-icon">💳</div>
              <div className="payment-method-name">Tarjeta de Crédito</div>
            </div>
            
            <div 
              className={`payment-method-card ${selectedPayment === 'mercado_pago' ? 'selected' : ''}`}
              onClick={() => handlePaymentSelect('mercado_pago')}
            >
              <div className="payment-method-icon">📱</div>
              <div className="payment-method-name">Mercado Pago</div>
            </div>
          </div>
        </div>
        
        <button 
          className={`confirm-payment-button ${!selectedPayment ? 'disabled' : ''}`}
          onClick={handleConfirmPayment}
          disabled={!selectedPayment}
        >
          Confirmar Pago
        </button>
      </div>
    </div>
  );
};

export default PaymentSelection;
