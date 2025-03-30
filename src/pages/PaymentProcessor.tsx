import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/PaymentProcessor.css';

const PaymentProcessor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('Iniciando procesamiento de pago...');
  const [animationComplete, setAnimationComplete] = useState<boolean>(false);
  
  // Get payment method from location state or default to MercadoPago
  const paymentMethod = location.state?.paymentMethod || 'mercado_pago';
  
  useEffect(() => {
    // Simulate payment processing with progress bar
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          
          // Show success animation before navigating
          setAnimationComplete(true);
          
          // Navigate to order status page after payment is processed
          setTimeout(() => {
            navigate('/order-status');
          }, 1500);
          return 100;
        }
        
        // Update status message based on progress
        if (prevProgress === 0) {
          setStatus('Conectando con el procesador de pago...');
        } else if (prevProgress === 20) {
          setStatus('Verificando información de pago...');
        } else if (prevProgress === 40) {
          setStatus('Procesando transacción...');
        } else if (prevProgress === 60) {
          setStatus('Confirmando pago...');
        } else if (prevProgress === 80) {
          setStatus('¡Pago confirmado!');
        }
        
        return prevProgress + 3;
      });
    }, 120); // Update every 120ms for a smoother animation
    
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
  
  const getPaymentIcon = (): React.ReactNode => {
    switch (paymentMethod) {
      case 'cash':
        return '💵';
      case 'credit_card':
        return '💳';
      case 'mercado_pago':
        return <img 
          src="/images.png" 
          alt="Mercado Pago" 
          style={{ width: 44, height: 44, objectFit: 'contain' }} 
        />;
      default:
        return <img 
          src="/images.png" 
          alt="Mercado Pago" 
          style={{ width: 44, height: 44, objectFit: 'contain' }} 
        />;
    }
  };
  
  return (
    <div className="payment-processor-container">
      <div className="payment-processor-card">
        <div className="payment-processor-header">
          <span className="payment-processor-icon">{getPaymentIcon()}</span>
          <h2 className="payment-processor-title">Procesando Pago</h2>
        </div>
        
        <div className="payment-method-badge">
          {getPaymentMethodName()}
        </div>
        
        <div className="payment-processor-progress-container">
          <div 
            className="payment-processor-progress-bar"
            style={{ width: `${progress}%` }}
          >
            {progress >= 100 && (
              <div className="payment-processor-progress-complete"></div>
            )}
          </div>
        </div>
        
        <div className="payment-processor-status-container">
          <p className="payment-processor-status">{status}</p>
          <p className="payment-processor-percentage">{progress}%</p>
        </div>
        
        <div className="payment-processor-info">
          <p>Por favor no cierres esta ventana mientras procesamos tu pago.</p>
          {animationComplete && (
            <div className="payment-processor-success">
              <div className="payment-processor-success-icon">✓</div>
              <p className="payment-processor-complete">
                ¡Pago completado con éxito!
              </p>
              <p className="payment-processor-redirecting">Redirigiendo...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessor;