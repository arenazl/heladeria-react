import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/PaymentProcessor.css';

const PaymentProcessor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('Iniciando procesamiento de pago...');
  
  // Get payment method from location state or default to MercadoPago
  const paymentMethod = location.state?.paymentMethod || 'mercado_pago';
  
  useEffect(() => {
    // Simulate payment processing with progress bar
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          // Navigate to order status page after payment is processed
          setTimeout(() => {
            navigate('/order-status');
          }, 500);
          return 100;
        }
        
        // Update status message based on progress
        if (prevProgress === 0) {
          setStatus('Conectando con MercadoPago...');
        } else if (prevProgress === 20) {
          setStatus('Verificando información de pago...');
        } else if (prevProgress === 40) {
          setStatus('Procesando transacción...');
        } else if (prevProgress === 60) {
          setStatus('Confirmando pago...');
        } else if (prevProgress === 80) {
          setStatus('¡Pago confirmado!');
        }
        
        return prevProgress + 5;
      });
    }, 150); // Update every 150ms for a total of ~3 seconds
    
    return () => clearInterval(interval);
  }, [navigate]);
  
  const getPaymentMethodName = (): string => {
    switch (paymentMethod) {
      case 'cash':
        return 'Efectivo';
      case 'credit_card':
        return 'Tarjeta de Crédito';
      case 'mercado_pago':
        return 'MercadoPago';
      default:
        return 'MercadoPago';
    }
  };
  
  return (
    <div className="payment-processor-container">
      <div className="payment-processor-card">
        <h2 className="payment-processor-title">Procesando Pago</h2>
        <p className="payment-processor-method">Método: {getPaymentMethodName()}</p>
        
        <div className="payment-processor-progress-container">
          <div 
            className="payment-processor-progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="payment-processor-status">{status}</p>
        
        <div className="payment-processor-info">
          <p>Por favor no cierres esta ventana mientras procesamos tu pago.</p>
          {progress >= 100 && (
            <p className="payment-processor-complete">
              ¡Pago completado con éxito! Redirigiendo...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessor;
