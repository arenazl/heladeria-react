import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { formatTime } from '../utils/orderUtils';
import '../styles/OrderReady.css';

const OrderReady: React.FC = () => {
  const navigate = useNavigate();
  const { order, clearOrder, addToOrder, setCustomer, setCustomerName, setEstimatedPickupTime } = useOrder();
  const [dataRestored, setDataRestored] = useState<boolean>(false);

  // Efecto para verificar si hay datos en sessionStorage y restaurarlos si es necesario
  useEffect(() => {
    // Si ya hay una orden con items, no necesitamos restaurar nada
    if (order && order.items.length > 0) {
      setDataRestored(true);
      return;
    }

    console.log('Checking for stored order data in OrderReady...');
    
    // Verificar si hay datos de orden guardados en sessionStorage
    const storedData = sessionStorage.getItem('mpOrderData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log('Retrieved order data from sessionStorage in OrderReady:', parsedData);
        
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
          
          // Ahora podemos eliminar los datos de sessionStorage
          sessionStorage.removeItem('mpOrderData');
        } else {
          console.warn('No items found in stored order data in OrderReady');
          navigate('/');
        }
      } catch (error) {
        console.error('Error parsing stored order data in OrderReady:', error);
        navigate('/');
      }
    } else {
      console.log('No stored order data found in OrderReady, redirecting to home');
      navigate('/');
    }
  }, [order, navigate, clearOrder, addToOrder, setCustomer, setCustomerName, setEstimatedPickupTime]);

  // Efecto adicional para redirigir si no hay orden después de intentar restaurar
  useEffect(() => {
    // Si ya intentamos restaurar los datos y aún no hay orden o items, redirigir a home
    if (dataRestored && (!order || order.items.length === 0)) {
      console.log('No order data after restoration attempt, redirecting to home');
      navigate('/');
    }
  }, [dataRestored, order, navigate]);

  const handleBackToHome = () => {
    navigate('/');
  };

  if (!order || order.items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="order-ready-container">
      <div className="order-ready-card">
        <div className="order-ready-header">
          <div className="order-ready-icon">✅</div>
          <h1 className="order-ready-title">¡Tu pedido está listo!</h1>
          <p className="order-ready-subtitle">Por favor retira por mostrador</p>
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
