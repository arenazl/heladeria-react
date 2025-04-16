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
  const { order, clearOrder, addToOrder } = useOrder();
  const [orderStatus, setOrderStatus] = useState<OrderStatusType>('processing');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);

  // Generar un número de orden al cargar el componente
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

  // Efecto para cargar los datos de sessionStorage
  useEffect(() => {
    console.log('Checking for stored order data...');
    
    // Verificar si hay datos de orden guardados en sessionStorage
    const storedData = sessionStorage.getItem('mpOrderData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log('Retrieved order data from sessionStorage:', parsedData);
        
        // Guardar los datos para usarlos después
        setStoredOrderData(parsedData);
        
        // Limpiar el storage
        sessionStorage.removeItem('mpOrderData');
      } catch (error) {
        console.error('Error parsing order data from sessionStorage:', error);
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
        
        console.log('Order data successfully restored');
        setDataRestored(true);
      }
    }
  }, [storedOrderData, clearOrder, addToOrder, dataRestored]);

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
          
          // Asegurarse de que los headers estén configurados
          menuCommensalService.setHeaders(API_CONFIG.COMPANY_ID);
          
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

  // Configurar los eventos de SignalR
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

    // Limpiar los listeners cuando el componente se desmonte
    return () => {
      signalRService.off('partnerOrderUpdated');
    };
  }, [orderNumber, notificationPermission]);

  const handleNewOrder = () => {
    clearOrder();
    navigate('/');
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
          <div className="success-icon">✅</div>
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
