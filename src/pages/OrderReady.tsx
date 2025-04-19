import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { formatTime } from '../utils/orderUtils';
import { API_CONFIG } from '../config/api.config';
import '../styles/OrderReady.css';

const OrderReady: React.FC = () => {
  const navigate = useNavigate();
  const { order, clearOrder, addToOrder, setCustomer, setCustomerName, setEstimatedPickupTime } = useOrder();
  const [dataRestored, setDataRestored] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');

  // Efecto para verificar si hay datos en localStorage y restaurarlos si es necesario
  useEffect(() => {
    // Si ya hay una orden con items, no necesitamos restaurar nada
    if (order && order.items.length > 0) {
      setDataRestored(true);
      
      // Maintain the flag that indicates we're coming from payment success flow
      // This ensures the back button won't clear the cart if we came from payment success
      if (sessionStorage.getItem('fromPaymentSuccess') === 'true') {
        console.log('Maintaining fromPaymentSuccess flag in OrderReady');
      }
      
      return;
    }

    console.log('Checking for stored order data in OrderReady...');
    
    // Verificar si hay datos de orden guardados en localStorage
    const storedData = localStorage.getItem('mpOrderData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log('Retrieved order data from localStorage in OrderReady:', parsedData);
        
        // Obtener el número de orden si existe
        if (parsedData.orderNumber) {
          setOrderNumber(parsedData.orderNumber);
        } else {
          // Generar un número de orden aleatorio si no existe
          const generateOrderNumber = () => {
            const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
            const randomLetter = letters[Math.floor(Math.random() * letters.length)];
            const randomNumber = Math.floor(Math.random() * 900000) + 100000;
            return `${randomLetter}${randomNumber}`;
          };
          setOrderNumber(generateOrderNumber());
        }
        
        // Restaurar los items al OrderContext
        if (parsedData.items && parsedData.items.length > 0) {
          console.log('Restoring items to order context in OrderReady...');
          
          // Limpiar el carrito actual antes de agregar los items guardados
          clearOrder();
          
          // Agregar los items guardados
          parsedData.items.forEach((item: any) => {
            console.log('Adding item to order in OrderReady:', item.product.name, 'x', item.quantity);
            addToOrder(item.product, item.quantity);
          });
          
          // Si hay datos de cliente, restaurarlos también
          if (parsedData.customer) {
            console.log('Restoring customer data in OrderReady:', parsedData.customer);
            setCustomer(parsedData.customer);
          } else if (parsedData.customerName) {
            console.log('Setting customer name in OrderReady:', parsedData.customerName);
            setCustomerName(parsedData.customerName);
          }
          
          // Si hay tiempo estimado de recogida, restaurarlo
          if (parsedData.estimatedPickupTime) {
            console.log('Setting estimated pickup time in OrderReady');
            setEstimatedPickupTime();
          }
          
          console.log('Order data successfully restored in OrderReady');
          setDataRestored(true);
          
          // Ahora podemos eliminar los datos de localStorage
          localStorage.removeItem('mpOrderData');
        } else {
          console.warn('No items found in stored order data in OrderReady');
          // Navigate to home page
          navigate('/');
        }
      } catch (error) {
        console.error('Error parsing stored order data in OrderReady:', error);
        // Navigate to home page
        navigate('/');
      }
    } else {
      console.log('No stored order data found in OrderReady, redirecting to home');
      // Navigate to home page
      navigate('/');
    }
  }, [order, navigate, clearOrder, addToOrder, setCustomer, setCustomerName, setEstimatedPickupTime]);

  // Efecto adicional para redirigir si no hay orden después de intentar restaurar
  useEffect(() => {
    // Si ya intentamos restaurar los datos y aún no hay orden o items, redirigir a home
    if (dataRestored && (!order || order.items.length === 0)) {
      console.log('No order data after restoration attempt, redirecting to home');
      // Navigate to home page
      navigate('/');
    }
  }, [dataRestored, order, navigate]);

  const handleBackToHome = () => {
    // Clear the fromPaymentSuccess flag when explicitly going back to home
    sessionStorage.removeItem('fromPaymentSuccess');
    
    // Clear the order and navigate to home
    clearOrder();
    
    // Check if we have company ID and price list ID in sessionStorage
    const companyId = sessionStorage.getItem('companyId');
    const priceListId = sessionStorage.getItem('priceListId');
    
    // Navigate to menu page if we have company ID and price list ID, otherwise navigate to home page
    if (companyId && priceListId) {
      navigate(`/menu/${companyId}/${priceListId}`);
    } else {
      navigate('/');
    }
  };

  if (!order || order.items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="order-ready-container">
      <div className="order-ready-card">
        <div className="order-ready-header">
          <div className="order-ready-icon-container">
            <div className="order-ready-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h1 className="order-ready-title">¡Tu pedido está listo!</h1>
          <p className="order-ready-subtitle">Por favor retira por mostrador</p>
          
          {/* Número de orden */}
          {orderNumber && (
            <div className="order-number">
              <span className="order-number-label">Orden</span>
              <span className="order-number-value">#{orderNumber}</span>
            </div>
          )}
        </div>

        <div className="order-ready-details">
          <div className="order-ready-info">
            <p className="order-ready-name">
              <strong>Nombre:</strong> {order.customerName || (order.customer ? order.customer.name : 'Cliente')}
            </p>
            {order.estimatedPickupTime && (
              <p className="order-ready-time">
                <strong>Hora de preparación:</strong> {formatTime(order.estimatedPickupTime)}
              </p>
            )}
          </div>

          <div className="order-ready-items">
            <h2>Detalle del Pedido</h2>
            <div className="order-ready-items-list">
              {order.items.map((item) => (
                <div key={item.productId} className="order-ready-item">
                  <div className="order-ready-item-name">
                    {item.product.name} x {item.quantity}
                  </div>
                  <div className="order-ready-item-price">
                    $ {(item.product.price * item.quantity).toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-ready-total">
              <span>Total:</span>
              <span>$ {order.total.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
          </div>
        </div>

        <div className="order-ready-instructions">
          <h3>Instrucciones de retiro:</h3>
          <p>Dirígete al mostrador y menciona tu nombre para retirar tu pedido.</p>
          <p>¡Gracias por tu compra!</p>
        </div>

        <button 
          className="order-ready-button"
          onClick={handleBackToHome}
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};


export default OrderReady;
