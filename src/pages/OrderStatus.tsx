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
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [showOrderSummary, setShowOrderSummary] = useState<boolean>(false);
  
  // Estados para guardar la información del pedido cuando esté listo
  const [savedOrderItems, setSavedOrderItems] = useState<any[]>([]);
  const [savedOrderTotal, setSavedOrderTotal] = useState<number>(0);
  
  useEffect(() => {
    // Generate a random order number
    const generateOrderNumber = () => {
      const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];
      const randomNumber = Math.floor(Math.random() * 900000) + 100000;
      return `${randomLetter}${randomNumber}`;
    };
    
    setOrderNumber(generateOrderNumber());
    
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
        // When countdown finishes, show order is ready
        setOrderStatus('ready');
        
        // Guarda la información del pedido cuando esté listo
        if (order && order.items) {
          console.log("Guardando items del pedido:", order.items);
          setSavedOrderItems([...order.items]);
          setSavedOrderTotal(order.total || 0);
        }
        
        // After a short delay, show the order summary fullscreen
        setTimeout(() => {
          setShowOrderSummary(true);
        }, 3000);
        
        // Send notification when order is ready
        if (name) {
          console.log('[OrderStatus] Order is ready, attempting to send notification');
          
          if (notificationPermission === 'granted') {
            const notificationOptions = {
              body: `Hola ${name}, tu pedido #${orderNumber} está listo para retirar en mostrador.`,
              icon: '/logo192.png',
              requireInteraction: true
            };
            
            const notification = sendNotification(
              '¡Tu pedido está listo!',
              notificationOptions
            );
            
            if (notification) {
              notification.onclick = () => {
                window.focus();
              };
            }
          }
        }
      }
    }
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [countdown, isSubmitting, notificationPermission, name, orderNumber, order]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }
    
    // Verificación del estado actual de la orden
    console.log("Estado de la orden al confirmar:", order);
    
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

  // Si se debe mostrar el resumen del pedido a pantalla completa
  if (showOrderSummary) {
    console.log("Mostrando resumen. Order items:", order.items, "Saved items:", savedOrderItems);
    
    return (
      <div className="fullscreen-order-summary">
        <div className="order-summary-container">
          <div className="order-summary-header">
            <h2>Resumen de tu Pedido</h2>
            <div className="order-summary-number">
              Orden #{orderNumber}
            </div>
          </div>
          
          <div className="order-summary-content">
            <div className="order-summary-section">
              <h3>Datos del Cliente</h3>
              <div className="order-customer-details">
                <p><strong>Nombre:</strong> {name}</p>
                {order.customer && (
                  <>
                    <p><strong>Dirección:</strong> {order.customer.address}</p>
                    <p><strong>Teléfono:</strong> {order.customer.phone}</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="order-summary-section">
              <h3>Productos</h3>
              <div className="order-items-list">
                {savedOrderItems.length > 0 ? (
                  savedOrderItems.map((item, index) => (
                    <div key={index} className="order-item-row">
                      <div className="order-item-info">
                        <span className="order-item-quantity">{item.quantity}x</span>
                        <span className="order-item-name">{item.product.name}</span>
                      </div>
                      <div className="order-item-price">${(item.product.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-items-message">No hay productos en el pedido.</div>
                )}
              </div>
            </div>
            
            <div className="order-total-section">
              <div className="order-subtotal">
                <span>Subtotal:</span>
                <span>${savedOrderTotal.toFixed(2)}</span>
              </div>
              <div className="order-tax">
                <span>Impuestos:</span>
                <span>$0.00</span>
              </div>
              <div className="order-final-total">
                <span>Total:</span>
                <span>${savedOrderTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="order-summary-message">
              <div className="order-summary-icon">✅</div>
              <div className="order-summary-text">
                <p>¡Tu pedido está listo para retirar!</p>
                <p>Por favor, dirígete al mostrador y muestra este número de orden: <strong>#{orderNumber}</strong></p>
              </div>
            </div>
          </div>
          
          <div className="order-summary-actions">
            <button 
              className="print-order-button"
              onClick={() => window.print()}
            >
              Imprimir Recibo
            </button>
            <button 
              className="new-order-button"
              onClick={() => navigate('/')}
            >
              Iniciar Nuevo Pedido
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla normal de estado del pedido
  return (
    <div className="page-container">
      <div className="section-container">
        <div className="order-status-header">
          <h2 className="section-title">Estado de tu Pedido</h2>
          <div className="order-number-badge">
            <span className="order-number-label">Orden</span>
            <span className="order-number-value">#{orderNumber}</span>
          </div>
        </div>
        
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
                <div className="time-icon">⏱️</div>
                <div className="time-details">
                  <p>Tiempo estimado de preparación:</p>
                  <p className="time-value">20-30 minutos</p>
                  <p className="time-ready">Tu pedido estará listo aproximadamente a las {formatTime(order.estimatedPickupTime)}</p>
                </div>
              </div>
            )}
            
            {notificationPermission === 'denied' && !(/iPhone|iPad|iPod/i.test(navigator.userAgent)) && (
              <div className="notification-warning">
                <div className="notification-icon">🔔</div>
                <div className="notification-content">
                  <p>Las notificaciones están bloqueadas. Habilítalas en la configuración de tu navegador para recibir una alerta cuando tu pedido esté listo.</p>
                  <button 
                    type="button" 
                    className="permission-button"
                    onClick={requestPermissionAgain}
                  >
                    Solicitar Permisos
                  </button>
                </div>
              </div>
            )}
            
            {/iPhone|iPad|iPod/i.test(navigator.userAgent) && (
              <div className="notification-info">
                <div className="notification-icon">ℹ️</div>
                <div className="notification-content">
                  <p>En dispositivos iOS, las notificaciones pueden no estar disponibles. Mantén esta ventana abierta para ver el estado de tu pedido.</p>
                </div>
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
            <div className="order-status-card">
              <div className="order-status-details">
                <div className="order-status-customer">
                  <span className="customer-label">Cliente:</span>
                  <span className="customer-value">{name}</span>
                </div>
                <div className="order-tracking-number">
                  <span className="tracking-label">Número de seguimiento:</span>
                  <span className="tracking-value">#{orderNumber}</span>
                </div>
              </div>
            
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
                {countdown !== null && countdown > 0 && (
                  <div className="countdown-timer">
                    <div className="countdown-icon">⏳</div>
                    <div className="countdown-details">
                      <p>Tiempo restante estimado:</p>
                      <p className="countdown-value">{countdown} segundos</p>
                    </div>
                  </div>
                )}
                
                <p className="order-status-message">
                  {orderStatus === 'processing' && 'Tu pedido está siendo procesado. Pronto comenzará la preparación.'}
                  {orderStatus === 'preparing' && 'Tu pedido está siendo preparado por nuestro equipo.'}
                  {orderStatus === 'ready' && '¡Tu pedido está listo! Por favor retíralo en el mostrador.'}
                </p>
                
                <p className="order-status-instruction">
                  <span className="instruction-icon">💡</span>
                  Puedes minimizar esta ventana. Te notificaremos cuando tu pedido esté listo.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;