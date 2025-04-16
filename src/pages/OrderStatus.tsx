import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { formatTime, requestNotificationPermission, sendNotification } from '../utils/orderUtils';
import { menuCommensalService } from '../services/menu-commensal.service';
import { API_CONFIG } from '../config/api.config';
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

    // Cleanup function to prevent memory leaks and duplicate effects
    return () => {
      setIsSubmitting(false);
      setShowOrderSummary(false);
      setCountdown(null);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Effect for countdown and order status
  useEffect(() => {
    let timer: number | null = null;
    
    if (isSubmitting && countdown !== null) {
      if (countdown > 0) {
        timer = window.setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
      } else {
        // When countdown reaches 0, show order summary
        setTimeout(() => {
          setShowOrderSummary(true);
          
          // Send notification only once when showing summary
          if (name && notificationPermission === 'granted') {
            const notification = sendNotification(
              'Tu pedido está siendo procesado',
              {
                body: `Hola ${name}, tu pedido #${orderNumber} está siendo procesado.`,
                icon: '/logo192.png',
                requireInteraction: true
              }
            );
            
            if (notification) {
              notification.onclick = () => window.focus();
            }
          }
        }, 3000);
      }
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, isSubmitting]);

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
    
    try {
      // Generar el JSON del pedido y enviarlo al servidor
      const orderJson = generateOrderJson();
      // Asegurarse de que los headers estén configurados
      menuCommensalService.setHeaders(API_CONFIG.COMPANY_ID);
      const response = await menuCommensalService.savePartnerOrder(orderJson);
      
      // Si hay errores en la respuesta, mostrarlos
      if (response.ValidationResult && 
          response.ValidationResult.ErrorMessages && 
          response.ValidationResult.ErrorMessages.length > 0) {
        console.error("Errores al confirmar el pedido:", response.ValidationResult.ErrorMessages);
        alert(`Error al confirmar el pedido: ${response.ValidationResult.ErrorMessages.join(', ')}`);
        return;
      }
      
      // Establecer el estado de procesamiento y guardar los items
      setOrderStatus('processing');
      setCountdown(5);
      
      if (order?.items) {
        setSavedOrderItems([...order.items]);
        setSavedOrderTotal(order.total || 0);
      }
     
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert("Ocurrió un error al procesar el pedido. Por favor, intenta nuevamente.");
      setIsSubmitting(false);
    }
  };

// Función para generar el JSON del pedido según el contrato de la base de datos
const generateOrderJson = () => {
  const now = new Date();
  
  const partnerOrder = {
    PartnerOrderNumber: orderNumber,
    PartnerOrderNumberText: orderNumber,
    PartnerId: API_CONFIG.PARTNER.ID,
    PartnerName: API_CONFIG.PARTNER.NAME,
    PartnerOrderStatusId: 1, // Estado inicial (pendiente)
    PartnerOrderJsonFileId: 1,
    IsDeliveryDateScheduled: false,
    RestaurantIntegrationCode: API_CONFIG.PARTNER.INTEGRATION_CODE,
    Date: now.toISOString(),
    DeliveryAddress: order.customer?.address || "",
    DeliveryDate: order.estimatedPickupTime?.toISOString() || now.toISOString(),
    CustomerId: order.customerId || 1,
    CustomerName: name || order.customerName || "Cliente",
    CustomerPhone: order.customer?.phone || "",
    Discount: 0,
    Subtotal: order.total || 0,
    Tax: 0,
    Total: order.total || 0,
    Observation: "",
    OrderId: null,
    ErrorMessage: null,
    ResponseDataTextRepresentation: JSON.stringify(order),
    DateCreated: now.toISOString(),
    DateUpdated: null,
    CreatedUserId: 1,
    UpdatedUserId: null,
    IsActive: true,
    CurrentTimeZone: -3
  };
  
  // Crear los items del pedido según la estructura de la tabla 10_partnerorderitem
  const partnerOrderItems = order.items.map((item, index) => ({
    PartnerOrderId: 0, // Se asignará cuando se guarde el pedido
    ProductId: item.product.id,
    ProductName: item.product.name,
    UnitPrice: item.product.price,
    Quantity: item.quantity,
    Subtotal: item.product.price * item.quantity,
    Tax: 0,
    Total: item.product.price * item.quantity,
    Observation: "",
    IsInnerProductItem: false,
    DateCreated: now.toISOString(),
    DateUpdated: null,
    CreatedUserId: 1,
    UpdatedUserId: null,
    IsActive: true,
    CurrentTimeZone: -3
  }));
  
  // Objeto completo con el pedido y sus items
  return {
    partnerOrder: partnerOrder,
    partnerOrderItems: partnerOrderItems
  };
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
              <div className="order-summary-icon">⚙️</div>
              <div className="order-summary-text">
                <p>Tu pedido está siendo procesado</p>
                <p>Número de orden: <strong>#{orderNumber}</strong></p>
                <p>JSON del pedido generado según el contrato de la base de datos</p>
                <p>Datos enviados al endpoint del controlador MenuComensalController</p>
                <p>El pedido permanecerá en estado "Procesando"</p>
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
            
            <div className={`order-status-container ${getStatusClass()}`}>
              <div className="order-status-header">
                <div className="status-icon">
                  {orderStatus === 'processing' && <span>⚙️</span>}
                  {orderStatus === 'preparing' && <span>👨‍🍳</span>}
                  {orderStatus === 'ready' && <span>✅</span>}
                </div>
                <div className="order-status-text">{getStatusText()}</div>
              </div>
              
              <div className="order-progress-bar-container">
                <div className="order-progress-bar">
                  <div 
                    className="order-progress-fill"
                    style={{ 
                      width: orderStatus === 'processing' ? '33%' : 
                             orderStatus === 'preparing' ? '66%' : '100%' 
                    }}
                  ></div>
                </div>
                
                <div className="order-progress-labels">
                  <div className={`progress-label ${orderStatus === 'processing' ? 'active' : (orderStatus === 'preparing' || orderStatus === 'ready') ? 'completed' : ''}`}>
                    <div className="progress-dot"></div>
                    <span>Procesando</span>
                  </div>
                  <div className={`progress-label ${orderStatus === 'preparing' ? 'active' : orderStatus === 'ready' ? 'completed' : ''}`}>
                    <div className="progress-dot"></div>
                    <span>Preparando</span>
                  </div>
                  <div className={`progress-label ${orderStatus === 'ready' ? 'active' : ''}`}>
                    <div className="progress-dot"></div>
                    <span>Listo</span>
                  </div>
                </div>
              </div>
            </div>
            
            
            <div className="order-status-info">

                 
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
