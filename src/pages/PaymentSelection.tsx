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

    // For MercadoPago, navigate to payment processor
    if (selectedPayment === 'mercado_pago') {
      navigate('/payment-processor', { state: { paymentMethod: selectedPayment } });
      return;
    }

    // For other payment methods, show success message and clear order
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

  // No longer requiring customer selection before payment

  return (
    <div className="page-container">
      <div className="section-container">
        <h2 className="section-title">Completar Pago</h2>
        
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
          
          {/* Customer info section removed as it's no longer required */}
          
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
