import React, { useState, useEffect } from 'react';
import '../styles/PaymentSuccess.css';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { signalRService } from '../services/signalr.service';
import { formatTime, requestNotificationPermission, sendNotification } from '../utils/orderUtils';
import { OrderItem } from '../models/types';
import { menuCommensalService } from '../services/menu-commensal.service';
import { API_CONFIG } from '../config/api.config';

// Order status types
type OrderStatusType = 'processing' | 'preparing' | 'ready';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { order, clearOrder, addToOrder, setCustomer, setCustomerName, setEstimatedPickupTime } = useOrder();
  const [orderStatus, setOrderStatus] = useState<OrderStatusType>('processing');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);

  // Obtener el número de orden de localStorage o generar uno nuevo
  useEffect(() => {
    // Intentar obtener el número de orden de localStorage
    const storedOrderData = localStorage.getItem('mpOrderData');
    if (storedOrderData) {
      try {
        const parsedData = JSON.parse(storedOrderData);
        if (parsedData.orderNumber) {
          setOrderNumber(parsedData.orderNumber);
        } else {
          // Si no hay número de orden en localStorage, generar uno nuevo
          generateNewOrderNumber();
        }
      } catch (error) {
        console.error('Error parsing order data from localStorage:', error);
        generateNewOrderNumber();
      }
    } else {
      // Si no hay datos de orden en localStorage, generar un número de orden nuevo
      generateNewOrderNumber();
    }
    
    // Check notification permission on component mount
    const checkPermission = async () => {
      const permission = await requestNotificationPermission();
      setNotificationPermission(permission);
    };
    
    checkPermission();
  }, []);

  // Función para generar un nuevo número de orden
  const generateNewOrderNumber = () => {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    const newOrderNumber = `${randomLetter}${randomNumber}`;
    setOrderNumber(newOrderNumber);
    return newOrderNumber;
  };

  // Función para generar el JSON del pedido según el contrato de la base de datos
  const generateOrderJson = () => {
    const now = new Date();
    
    // Verificar que hay ítems en la orden
    if (!order.items || order.items.length === 0) {
      console.error('No hay ítems en la orden para guardar');
      return null;
    }
    
    console.log('Generando JSON del pedido con', order.items.length, 'ítems');
    
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
      CustomerName: order.customer?.name || order.customerName || "Cliente",
      CustomerPhone: order.customer?.phone || "",
      Discount: 0,
      Subtotal: order.total || 0,
      Tax: 0,
      Total: order.total || 0,
      Observation: "Pedido realizado a través de MercadoPago",
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
    const partnerOrderItems = order.items.map((item) => {
      console.log('Procesando ítem:', item.product.name, 'x', item.quantity);
      return {
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
      };
    });
    
    // Objeto completo con el pedido y sus items
    const orderJson = {
      partnerOrder: partnerOrder,
      partnerOrderItems: partnerOrderItems
    };
    
    console.log('JSON del pedido generado:', JSON.stringify(orderJson, null, 2));
    return orderJson;
  };

  // Estado para rastrear si los datos se han restaurado correctamente
  const [dataRestored, setDataRestored] = useState<boolean>(false);
  const [storedOrderData, setStoredOrderData] = useState<any>(null);

  // Efecto para cargar los datos de localStorage
  useEffect(() => {
    console.log('Checking for stored order data...');
    
    // Set a flag to indicate we're coming from payment success page
    // This will be used by the Header component to decide whether to clear the cart
    sessionStorage.setItem('fromPaymentSuccess', 'true');
    
    // Verificar si hay datos de orden guardados en localStorage
    const storedData = localStorage.getItem('mpOrderData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log('Retrieved order data from localStorage:', parsedData);
        
        // Guardar los datos para usarlos después
        setStoredOrderData(parsedData);
        
        // No eliminamos los datos de localStorage todavía para que estén disponibles
        // para OrderReady.tsx cuando se redirija allí
        // Los marcaremos como procesados para evitar procesamiento duplicado
        localStorage.setItem('mpOrderDataProcessed', 'true');
      } catch (error) {
        console.error('Error parsing order data from localStorage:', error);
      }
    } else {
      console.log('No stored order data found');
    }
  }, []);

  // Efecto separado para restaurar los datos al contexto de la orden
  useEffect(() => {
    if (storedOrderData && !dataRestored) {
      // Actualizar el contexto de la orden con los datos guardados
      if (storedOrderData.items && storedOrderData.items.length > 0 && storedOrderData.total) {
        console.log('Clearing current order...');
        clearOrder();
        
        console.log('Adding items to order:', storedOrderData.items.length, 'items');
        
        // Agregar cada producto a la orden
        storedOrderData.items.forEach((item: OrderItem) => {
          console.log('Adding item to order:', item.product.name, 'x', item.quantity);
          addToOrder(item.product, item.quantity);
        });
        
        // Si hay datos de cliente, restaurarlos también
        if (storedOrderData.customer) {
          console.log('Restoring customer data:', storedOrderData.customer);
          setCustomer(storedOrderData.customer);
        } else if (storedOrderData.customerName) {
          console.log('Setting customer name:', storedOrderData.customerName);
          setCustomerName(storedOrderData.customerName);
        }
        
        // Si hay tiempo estimado de recogida, restaurarlo
        if (storedOrderData.estimatedPickupTime) {
          console.log('Setting estimated pickup time');
          // Llamar a la función para establecer el tiempo estimado de recogida
          setEstimatedPickupTime();
        }
        
        console.log('Order data successfully restored');
        setDataRestored(true);
      }
    }
  }, [storedOrderData, clearOrder, addToOrder, setCustomer, setCustomerName, setEstimatedPickupTime, dataRestored]);

  // Efecto para guardar el pedido en la base de datos después de que los datos se hayan restaurado
  useEffect(() => {
    if (dataRestored && order && order.items && order.items.length > 0) {
      console.log('Order is ready to be saved. Items count:', order.items.length);
      
      // Guardar el pedido en la base de datos
      const saveOrder = async () => {
        try {
          // Generar el JSON del pedido
          const orderJson = generateOrderJson();
          
          if (!orderJson) {
            console.error('Failed to generate order JSON');
            return;
          }
          
          console.log('Generated order JSON:', orderJson);
          
          // Llamar al servicio para guardar el pedido
          const response = await menuCommensalService.savePartnerOrder(orderJson);
          
          // Si hay errores en la respuesta, mostrarlos
          if (response.ValidationResult && 
              response.ValidationResult.ErrorMessages && 
              response.ValidationResult.ErrorMessages.length > 0) {
            console.error("Errores al confirmar el pedido:", response.ValidationResult.ErrorMessages);
            // No mostrar alerta para no interrumpir la experiencia del usuario
          } else {
            console.log('Order successfully saved to database:', response);
          }
        } catch (error) {
          console.error("Error al guardar el pedido en la base de datos:", error);
          // No mostrar alerta para no interrumpir la experiencia del usuario
        }
      };
      
      // Ejecutar la función para guardar el pedido
      saveOrder();
    } else if (dataRestored) {
      console.error('Order is empty after data restoration. Cannot save to database.');
    }
  }, [dataRestored, order]);

  // Configurar los eventos de SignalR y el simulador de cambio de estado
  useEffect(() => {
    // Asegurarse de que SignalR esté conectado
    signalRService.start();

    // Escuchar eventos de actualización de estado de la orden
    signalRService.on('partnerOrderUpdated', (data) => {
      console.log('Received order update:', data);
      
      // Actualizar el estado de la orden según los datos recibidos
      if (data && data.PartnerOrderStatusId) {
        switch (data.PartnerOrderStatusId) {
          case 1: // Procesando
            setOrderStatus('processing');
            break;
          case 2: // Preparando
            setOrderStatus('preparing');
            // Enviar notificación si está permitido
            if (notificationPermission === 'granted') {
              sendNotification(
                'Tu pedido está siendo preparado',
                {
                  body: `Tu pedido #${orderNumber} está siendo preparado por el restaurante.`,
                  icon: '/logo192.png',
                  requireInteraction: true
                }
              );
            }
            break;
          case 3: // Listo
            setOrderStatus('ready');
            // Enviar notificación si está permitido
            if (notificationPermission === 'granted') {
              sendNotification(
                '¡Tu pedido está listo!',
                {
                  body: `Tu pedido #${orderNumber} está listo para retirar.`,
                  icon: '/logo192.png',
                  requireInteraction: true
                }
              );
            }
            break;
          default:
            break;
        }
      }
    });

    // Simulador de cambio de estado automático cada 10 segundos
    const simulateStatusChange = () => {
      setOrderStatus(currentStatus => {
        switch (currentStatus) {
          case 'processing':
            console.log('Simulando cambio de estado: processing -> preparing');
            // Enviar notificación si está permitido
            if (notificationPermission === 'granted') {
              sendNotification(
                'Tu pedido está siendo preparado',
                {
                  body: `Tu pedido #${orderNumber} está siendo preparado por el restaurante.`,
                  icon: '/logo192.png',
                  requireInteraction: true
                }
              );
            }
            return 'preparing';
          case 'preparing':
            console.log('Simulando cambio de estado: preparing -> ready');
            // Enviar notificación si está permitido
            if (notificationPermission === 'granted') {
              sendNotification(
                '¡Tu pedido está listo!',
                {
                  body: `Tu pedido #${orderNumber} está listo para retirar.`,
                  icon: '/logo192.png',
                  requireInteraction: true
                }
              );
            }
            
            // Programar la redirección a la página OrderReady después de 2 segundos
            setTimeout(() => {
              console.log('Redirigiendo a la página OrderReady...');
              navigate('/order-ready');
            }, 2000);
            
            return 'ready';
          default:
            return currentStatus;
        }
      });
    };

    // Configurar el temporizador para simular cambios de estado cada 10 segundos
    const statusTimer = setInterval(() => {
      simulateStatusChange();
    }, 10000); // 10 segundos

    // Limpiar los listeners y el temporizador cuando el componente se desmonte
    return () => {
      signalRService.off('partnerOrderUpdated');
      clearInterval(statusTimer);
    };
  }, [orderNumber, notificationPermission]);

  const handleNewOrder = () => {
    clearOrder();
    
    // Verificar si hay un companyId y priceListId en sessionStorage
    const companyId = sessionStorage.getItem('companyId');
    const priceListId = sessionStorage.getItem('priceListId');
    
    // Redirigir a la página de menú o a la página de inicio si no hay companyId
    if (companyId && priceListId) {
      navigate('/menu/' + companyId + '/' + priceListId);
    } else {
      navigate('/');
    }
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
        <div className="success-content">
          <div className="success-icon-container">
            <div className="success-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h2>¡Pago Exitoso!</h2>
          <p>Tu pedido ha sido confirmado y está siendo procesado.</p>
          
          {/* Número de orden */}
          <div className="order-number">
            <span className="order-number-label">Orden</span>
            <span className="order-number-value">#{orderNumber}</span>
          </div>
          
          {/* Barra de progreso del pedido */}
          <div className={`order-status-container ${getStatusClass()}`}>
            <div className="order-status-header">
              <div className="status-icon">
                {orderStatus === 'processing' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#f57c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="#f57c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {orderStatus === 'preparing' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 11H18C19.6569 11 21 12.3431 21 14C21 15.6569 19.6569 17 18 17H15" stroke="#43a047" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 11H15V19C15 20.1046 14.1046 21 13 21H8C6.89543 21 6 20.1046 6 19V11Z" stroke="#43a047" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 11V7C6 5.89543 6.89543 5 8 5H13C14.1046 5 15 5.89543 15 7V11" stroke="#43a047" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 15H8" stroke="#43a047" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {orderStatus === 'ready' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
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
          
          {order.customer && (
            <div className="order-details">
              <h3>Detalles del Pedido</h3>
              <p><strong>Cliente:</strong> {order.customer.name}</p>
              {order.customer.address && (
                <p><strong>Dirección:</strong> {order.customer.address}</p>
              )}
              {order.customer.phone && (
                <p><strong>Teléfono:</strong> {order.customer.phone}</p>
              )}
            </div>
          )}

          <div className="order-items">
            <h3>Productos</h3>
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <span>{item.quantity}x {item.product.name}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="order-total">
              <strong>Total:</strong>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="success-actions">
            <button 
              onClick={handleNewOrder}
              className="new-order-button"
            >
              Realizar Nuevo Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
