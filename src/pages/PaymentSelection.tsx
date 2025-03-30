import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import '../styles/PaymentSelection.css';
import { Banknote, CreditCard, Smartphone } from 'lucide-react-native';

// Define payment method types
type PaymentMethod = 'cash' | 'credit_card' | 'mercado_pago';

const PaymentSelection: React.FC = () => {
  const navigate = useNavigate();
  const { order, clearOrder } = useOrder();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);

  // Efecto para agregar la clase al contenedor según el método seleccionado
  useEffect(() => {
    const container = document.querySelector('.payment-methods-container');
    if (container) {
      // Quitar todas las clases de selección
      container.classList.remove('cash-selected', 'credit-selected', 'mercado-selected');
      
      // Agregar la clase correspondiente
      if (selectedPayment === 'cash') {
        container.classList.add('cash-selected');
      } else if (selectedPayment === 'credit_card') {
        container.classList.add('credit-selected');
      } else if (selectedPayment === 'mercado_pago') {
        container.classList.add('mercado-selected');
      }
    }
  }, [selectedPayment]);

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
    
    // Automatically proceed to the next step after a short delay
    setTimeout(() => {
      // For MercadoPago, navigate to payment processor
      if (method === 'mercado_pago') {
        navigate('/payment-processor', { state: { paymentMethod: method } });
        return;
      }

      // For other payment methods, show success message and clear order
      alert(`¡Pago con ${getPaymentMethodName(method)} procesado con éxito! En un futuro, esto se enviará a un endpoint.`);
      clearOrder();
      navigate('/');
    }, 500); // Increased delay for better visual feedback
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

  return (
    <div className="page-container">
      <div className="section-container">      
        <div className="payment-order-summary">
          <h3>Resumen del Pedido</h3>
          <div className="payment-order-items">
            {order.items.map((item) => (
              <div key={item.productId} className="payment-order-item">
                <div className="payment-item-details">
                  <span className="payment-item-name">{item.product.name}</span>
                  <span className="payment-item-quantity">x {item.quantity}</span>
                </div>
                {
                item.product.description ? (
                  <p className="payment-item-description">{item.product.description}</p>
                ) : (
                  <p className="payment-item-description">Esta es una descripción del producto que es muy saludable y lo recomendamos para toda la familia</p>
                )
              }
  
              <div className="payment-item-price">${item.product.price * item.quantity}</div>
              </div>
            ))}
          </div>
          
          <div className="payment-total">
            <span>Total:</span>
            <span>${order.total}</span>
          </div>
        </div>
        
        <div className="payment-methods-container">
          <h3>Método de Pago</h3>
          
          <div className="payment-methods-grid">
            <div
              className={`payment-method-card ${selectedPayment === 'cash' ? 'selected' : ''}`}
              onClick={() => handlePaymentSelect('cash')}
            >
              <div className="payment-method-icon">
                <Banknote size={24} color="#22c55e" />
              </div>
              <div className="payment-method-name">Efectivo</div>
            </div>
            
            <div
              className={`payment-method-card ${selectedPayment === 'credit_card' ? 'selected' : ''}`}
              onClick={() => handlePaymentSelect('credit_card')}
            >
              <div className="payment-method-icon">
                <CreditCard size={24} color="#22c55e" />
              </div>
              <div className="payment-method-name">Tarjeta de Crédito</div>
            </div>
            
            <div
              className={`payment-method-card ${selectedPayment === 'mercado_pago' ? 'selected' : ''}`}
              onClick={() => handlePaymentSelect('mercado_pago')}
            >
              <div className="payment-method-icon">
                <Smartphone size={24} color="#22c55e" />
              </div>
              <div className="payment-method-name">Mercado Pago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSelection;