import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import MercadoPagoCheckout from '../components/MercadoPagoCheckout';
import '../styles/PaymentProcessor.css';

const PaymentProcessor: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = useOrder();
  const paymentMethod = location.state?.paymentMethod;
  
  // Verify we have an order and payment method
  if (!order || !paymentMethod || paymentMethod !== 'mercado_pago') {
    navigate('/payment');
    return null;
  }

  const handlePaymentSuccess = (preferenceId: string) => {
    console.log('Payment successful for preference:', preferenceId);
    navigate('/payment-success');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert('Error en el pago: ' + error);
    navigate('/payment');
  };

  // Ya no necesitamos callbacks para mostrar/ocultar iframe
  // porque ahora navegamos directamente a Mercado Pago
  const handleIframeShow = () => {
    console.log('Redirecting to Mercado Pago...');
  };

  const handleIframeHide = () => {
    console.log('Returning from Mercado Pago...');
  };

  return (
    <div className="page-container">
      <div className="section-container">

        <div className="payment-processor-content">

          <div className="order-summary">
            <h3>Resumen del Pedido</h3>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Total:</strong>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          
        </div>

        <MercadoPagoCheckout
        order={order}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        useRedirect={true}
        onIframeShow={handleIframeShow}
        onIframeHide={handleIframeHide}
      />


      </div>
      

    </div>
  );
};

export default PaymentProcessor;
