import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { formatTime, requestNotificationPermission, sendNotification } from '../utils/orderUtils';
import '../styles/OrderStatus.css';

// Order status types
type OrderStatusType = 'processing' | 'preparing' | 'ready';

const OrderStatus: React.FC = () => {
  const navigate = useNavigate();
  const { order, setCustomerName, setEstimatedPickupTime } = useOrder();
  const [name, setName] = useState<string>('');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderStatus, setOrderStatus] = useState<OrderStatusType>('processing');
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    // Check notification permission on component mount
    const checkPermission = async () => {
      const permission = await requestNotificationPermission();
      setNotificationPermission(permission);
    };
    
    checkPermission();
  }, []);

  // Effect for order status simulation
  useEffect(() => {
    let timer: number | null = null;
    
    if (isSubmitting && countdown !== null) {
      if (countdown > 0) {
        timer = window.setTimeout(() => {
          const newCountdown = countdown - 1;
          setCountdown(newCountdown);
          
          // Update order status based on countdown
          if (countdown === 15) {
            // Start with processing status
            setOrderStatus('processing');
          } else if (countdown === 10) {
            // After 5 seconds, change to preparing
            setOrderStatus('preparing');
          } else if (countdown === 5) {
            // After 5 more seconds, change to ready
            setOrderStatus('ready');
          }
        }, 1000);
      } else if (countdown === 0) {
        // Send notification when order is ready
        if (name) {
          console.log('[OrderStatus] Order is ready, attempting to send notification');
          console.log('[OrderStatus] Notification permission status:', notificationPermission);
          
          try {
            // Try to send notification if permission is granted
            if (notificationPermission === 'granted') {
              console.log('[OrderStatus] Permission is granted, sending notification');
              
              try {
                const notificationOptions = {
                  body: `Hola ${name}, tu pedido está listo para retirar en mostrador.`,
                  icon: '/logo192.png',
                  requireInteraction: true,
                  // The extended options will be applied automatically
                };
                
                console.log('[OrderStatus] Notification options:', notificationOptions);
                
                const notification = sendNotification(
                  '¡Tu pedido está listo!',
                  notificationOptions
                );
                
                console.log('[OrderStatus] Notification result:', notification ? 'Success' : 'Failed');
                
                if (notification) {
                  console.log('[OrderStatus] Setting up notification click handler');
                  // Navigate to order-ready page when notification is clicked
                  notification.onclick = () => {
                    console.log('[OrderStatus] Notification clicked, navigating to order-ready');
                    window.focus();
                    navigate('/order-ready');
                  };
                } else {
                  console.log('[OrderStatus] Notification object is null, cannot set click handler');
                }
              } catch (notificationError) {
                console.error('[OrderStatus] Error sending notification:', notificationError);
                console.log('[OrderStatus] Using fallback navigation');
              }
            } else {
              console.log('[OrderStatus] Permission not granted, skipping notification');
            }
          } catch (error) {
            // Log detailed error information
            console.error('[OrderStatus] Unexpected error during notification process:', error);
          }
          
          // Show button to view order details regardless of notification status
          setOrderStatus('ready');
          
          // FALLBACK: Automatically navigate to order-ready page after a short delay
          // This ensures the user sees the order is ready even if notifications fail
          setTimeout(() => {
            navigate('/order-ready');
          }, 3000); // 3 second delay to allow the user to see the "ready" status first
        }
      }
    }
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [countdown, isSubmitting, notificationPermission, name, navigate]);

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
    
    // Start 15-second countdown for demo purposes (5 seconds per status)
    setCountdown(15);
  };

  const requestPermissionAgain = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
  };

  const getStatusText = (): string => {
    switch (orderStatus) {
      case 'processing':
        return 'Orden en proceso';
      case 'preparing':
        return 'Orden en preparación por el restaurante';
      case 'ready':
        return 'Orden lista para retirar';
      default:
        return 'Orden en proceso';
    }
  };

  const getStatusClass = (): string => {
    switch (orderStatus) {
      case 'processing':
        return 'status-processing';
      case 'preparing':
        return 'status-preparing';
      case 'ready':
        return 'status-ready';
      default:
        return 'status-processing';
    }
  };

  return (
    <div className="page-container">
      <div className="section-container">
        <h2 className="section-title">Estado de tu Pedido</h2>
        
        {!isSubmitting ? (
          <form onSubmit={handleSubmit} className="order-status-form">
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
            
            {order.estimatedPickupTime && (
              <div className="estimated-time">
                <p>Tiempo estimado de preparación:</p>
                <p className="time-value">20-30 minutos</p>
                <p className="time-ready">Tu pedido estará listo aproximadamente a las {formatTime(order.estimatedPickupTime)}</p>
              </div>
            )}
            
            {notificationPermission === 'denied' && !(/iPhone|iPad|iPod/i.test(navigator.userAgent)) && (
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
            
            {/iPhone|iPad|iPod/i.test(navigator.userAgent) && (
              <div className="notification-info">
                <p>En dispositivos iOS, las notificaciones pueden no estar disponibles. No te preocupes, serás redirigido automáticamente cuando tu pedido esté listo.</p>
              </div>
            )}
            
            <button 
              type="submit" 
              className="submit-button"
            >
              Confirmar Pedido
            </button>
          </form>
        ) : (
          <div className="order-status-tracking">
            <div className={`order-status-indicator ${getStatusClass()}`}>
              <div className="order-status-text">{getStatusText()}</div>
              <div className="order-status-progress">
                <div className="order-status-step completed">
                  <div className="step-circle"></div>
                  <div className="step-label">Procesando</div>
                </div>
                <div className={`order-status-step ${orderStatus === 'preparing' || orderStatus === 'ready' ? 'completed' : ''}`}>
                  <div className="step-circle"></div>
                  <div className="step-label">Preparando</div>
                </div>
                <div className={`order-status-step ${orderStatus === 'ready' ? 'completed' : ''}`}>
                  <div className="step-circle"></div>
                  <div className="step-label">Listo</div>
                </div>
              </div>
            </div>
            
            <div className="order-status-info">
              <p className="customer-name">Nombre: <strong>{name}</strong></p>
              
              {countdown !== null && countdown > 0 && (
                <div className="countdown-timer">
                  <p>Tiempo restante estimado:</p>
                  <p className="countdown-value">{countdown} segundos</p>
                </div>
              )}
              
              <p className="order-status-message">
                {orderStatus === 'processing' && 'Tu pedido está siendo procesado. Pronto comenzará la preparación.'}
                {orderStatus === 'preparing' && 'Tu pedido está siendo preparado por nuestro equipo.'}
                {orderStatus === 'ready' && '¡Tu pedido está listo! Por favor retíralo en el mostrador.'}
              </p>
              
              <p className="order-status-instruction">
                Puedes minimizar esta ventana. Te notificaremos cuando tu pedido esté listo.
              </p>
            </div>
            
            {orderStatus === 'ready' && (
              <button 
                className="view-ready-order-button"
                onClick={() => navigate('/order-ready')}
              >
                Ver Detalles del Pedido
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;
