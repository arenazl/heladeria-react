import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { formatTime, requestNotificationPermission, sendNotification } from '../utils/orderUtils';
import '../styles/CustomerSelection.css';

const CustomerSelection: React.FC = () => {
  const navigate = useNavigate();
  const { order, setCustomerName, setEstimatedPickupTime } = useOrder();
  const [name, setName] = useState<string>('');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    // Check notification permission on component mount
    const checkPermission = async () => {
      const permission = await requestNotificationPermission();
      setNotificationPermission(permission);
    };
    
    checkPermission();
  }, []);

  // Effect for countdown timer and notification
  useEffect(() => {
    let timer: number | null = null;
    
    if (countdown !== null && countdown > 0) {
      timer = window.setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Send notification when countdown reaches 0
      if (notificationPermission === 'granted' && name) {
        const notification = sendNotification(
          '¡Tu pedido está listo!',
          {
            body: `Hola ${name}, tu pedido está listo para retirar en mostrador.`,
            icon: '/favicon.ico',
            requireInteraction: true,
          }
        );
        
        if (notification) {
          // Navigate to order-ready page when notification is clicked
          notification.onclick = () => {
            window.focus();
            navigate('/order-ready');
          };
        }
      }
    }
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [countdown, notificationPermission, name, navigate]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }
    
    setIsSubmitting(true);
    
    // Set customer name and generate estimated pickup time
    setCustomerName(name);
    setEstimatedPickupTime();
    
    // Start 20-second countdown for demo purposes
    setCountdown(20);
  };

  const requestPermissionAgain = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
  };

  return (
    <div className="page-container">
      <div className="section-container">
        <h2 className="section-title">Ingresa tu Nombre</h2>
        
        <form onSubmit={handleSubmit} className="customer-form">
          <div className="form-group">
            <label htmlFor="customerName">Nombre:</label>
            <input
              type="text"
              id="customerName"
              className="customer-input"
              placeholder="Ingresa tu nombre..."
              value={name}
              onChange={handleNameChange}
              required
              disabled={isSubmitting}
            />
          </div>
          
          {order.estimatedPickupTime && !isSubmitting && (
            <div className="estimated-time">
              <p>Tiempo estimado de preparación:</p>
              <p className="time-value">20-30 minutos</p>
              <p className="time-ready">Tu pedido estará listo aproximadamente a las {formatTime(order.estimatedPickupTime)}</p>
            </div>
          )}
          
          {isSubmitting && countdown !== null && (
            <div className="estimated-time">
              <p>Preparando tu pedido...</p>
              <p className="time-value">{countdown} segundos</p>
              <p className="time-ready">
                {countdown > 0 
                  ? 'Puedes minimizar esta ventana. Te notificaremos cuando esté listo.' 
                  : '¡Tu pedido está listo! Revisa la notificación.'}
              </p>
            </div>
          )}
          
          {notificationPermission === 'denied' && (
            <div className="notification-warning">
              <p>Las notificaciones están bloqueadas. Habilítalas en la configuración de tu navegador para recibir una alerta cuando tu pedido esté listo.</p>
              <button 
                type="button" 
                className="permission-button"
                onClick={requestPermissionAgain}
              >
                Solicitar Permisos
              </button>
            </div>
          )}
          
          {!isSubmitting && (
            <button 
              type="submit" 
              className="submit-button"
            >
              Continuar
            </button>
          )}
          
          {isSubmitting && countdown === 0 && (
            <button 
              type="button" 
              className="submit-button"
              onClick={() => navigate('/order-ready')}
            >
              Ver Pedido Listo
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CustomerSelection;
