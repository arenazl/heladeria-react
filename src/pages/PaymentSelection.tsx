import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import '../styles/PaymentSelection.css';
import { mercadoPagoService } from '../services/mercadopago.service';
import { signalRService } from '../services/signalr.service';
import { OrderVM, OrderProductItemVM, CustomerPaymentVM, OrderDispatchVM, CustomerPaymentMercadoPagoVM } from '../models/order';

// Define payment method types
type PaymentMethod = 'mercado_pago' | 'cash' | 'credit_card';

const PaymentSelection: React.FC = () => {
  const navigate = useNavigate();
  const { order, clearOrder, addToOrder, setCustomer } = useOrder();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>('');

  // Efecto para agregar la clase al contenedor según el método seleccionado
  useEffect(() => {
    const container = document.querySelector('.payment-methods-container');
    if (container) {
      // Quitar todas las clases de selección
      container.classList.remove('cash-selected', 'credit-selected', 'mercado-selected');
      
      // Agregar la clase correspondiente
      if (selectedPayment === 'cash') {
        container.classList.add('cash-selected');
      } else if (selectedPayment === 'credit_card') {
        container.classList.add('credit-selected');
      } else if (selectedPayment === 'mercado_pago') {
        container.classList.add('mercado-selected');
      }
    }
  }, [selectedPayment]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Generate a random order number when the component mounts
  useEffect(() => {
    // Generate a random order number
    const generateOrderNumber = () => {
      const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];
      const randomNumber = Math.floor(Math.random() * 900000) + 100000;
      return `${randomLetter}${randomNumber}`;
    };
    
    setOrderNumber(generateOrderNumber());
  }, []);

  // Initialize SignalR connection
  useEffect(() => {
    signalRService.start();

    // Listen for checkout approved events
    signalRService.on('checkoutApproved', handlePaymentSuccess);

    return () => {
      // Clean up SignalR listeners
      signalRService.off('checkoutApproved');
    };
  }, []);

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
    
    // Automatically proceed to the next step after a short delay
    setTimeout(() => {
      // For MercadoPago, create preference and redirect immediately
      if (method === 'mercado_pago') {
        createMercadoPagoPreference();
        return;
      }

      // For other payment methods, show success message and clear order
      alert(`¡Pago con ${getPaymentMethodName(method)} procesado con éxito! En un futuro, esto se enviará a un endpoint.`);
      clearOrder();
      navigate('/');
    }, 500); // Increased delay for better visual feedback
  };

  const handlePaymentSuccess = (preferenceId: string) => {
    console.log('Payment successful for preference:', preferenceId);
    navigate('/payment-success');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert('Error en el pago: ' + error);
    setSelectedPayment(null);
    setLoading(false);
  };

  /**
   * Mapea la orden del contexto de la aplicación a un objeto OrderVM
   * @param appOrder - La orden del contexto de la aplicación
   * @returns OrderVM - La orden mapeada al formato requerido por el backend
   */
  const mapOrderToOrderVM = (appOrder: any): OrderVM => {
    const now = new Date();
    
    // Crear una instancia de OrderVM con valores por defecto
    const orderVM = new OrderVM();
    
    // Mapear propiedades básicas
    orderVM.Id = 0;
    orderVM.CustomerName = appOrder.customer?.name || '';
    orderVM.CustomerDocNumber = '';
    orderVM.StartDate = now;
    orderVM.Subtotal = appOrder.total * 0.9; // Estimación del subtotal (90% del total)
    orderVM.Tax = appOrder.total * 0.1; // Estimación del impuesto (10% del total)
    orderVM.Total = appOrder.total;
    orderVM.TotalWithNoDiscount = appOrder.total;
    orderVM.Subtotal2 = appOrder.total * 0.9; // Mismo que Subtotal
    
    // OrderRestaurant sigue siendo null
    orderVM.OrderRestaurant = null;
    
    // Configurar OrderDispatch con los datos específicos
    const orderDispatch = new OrderDispatchVM();
    orderDispatch.Id = 104;
    orderDispatch.DeliveryDate = new Date(now.getTime() + 30 * 60000); // 30 minutos en el futuro
    orderDispatch.DelayInMinutes = 0;
    orderDispatch.OrderDispatchAddressId = undefined;
    orderDispatch.Addresses = [];
    orderDispatch.OrderDispatchPhoneId = undefined;
    orderDispatch.DeliveryCompanyId = undefined;
    orderDispatch.DeliveryCompany = null;
    orderDispatch.OrderDispatchStateId = 5;
    orderDispatch.EmployeeId = undefined;
    orderDispatch.DateCreated = now;
    orderDispatch.DateUpdated = undefined;
    orderDispatch.CreatedUserId = 102;
    orderDispatch.UpdatedUserId = undefined;
    orderDispatch.IsActive = true;
    orderDispatch.CurrentTimeZone = -3;
    
    orderVM.OrderDispatch = orderDispatch;
    
    // Mapear items
    orderVM.Items = appOrder.items.map((item: any) => {
      const orderItem = new OrderProductItemVM();
      orderItem.Id = 0;
      orderItem.OrderId = 0;
      orderItem.ProductId = item.product.id;
      orderItem.ProductName = item.product.name;
      orderItem.Quantity = item.quantity;
      orderItem.UnitPrice = item.product.price;
      orderItem.SubTotal = item.product.price * item.quantity;
      orderItem.Tax = 0;
      orderItem.Total = item.product.price * item.quantity;
      orderItem.AlicuotaPercentage = 0;
      orderItem.AlicuotaId = 0;
      orderItem.IsSpecialPrice = false;
      orderItem.IsPeopleTableCommensalProduct = false;
      orderItem.Observation = '';
      orderItem.Discount = 0;
      orderItem.DiscountPercentage = 0;
      orderItem.Subtotal2 = item.product.price * item.quantity;
      orderItem.IsStarter = false;
      orderItem.IsInvitation = false;
      orderItem.InvitationObservation = '';
      orderItem.ProductTypeName = '';
      orderItem.DateCreated = now;
      orderItem.CreatedUserId = 0;
      orderItem.IsActive = true;
      orderItem.AlaxUnits = 0;
      return orderItem;
    });
    
    // Contar items y unidades
    orderVM.ProductItemsCount = orderVM.Items.length;
    orderVM.ProductItemUnitsCount = orderVM.Items.reduce((total: number, item: OrderProductItemVM) => total + item.Quantity, 0);
    
    // Inicializar array de pagos
    orderVM.CustomerPayments = [];
    
    // Agregar un pago de MercadoPago
    const payment = new CustomerPaymentVM();
    payment.Id = 0;
    payment.OrderId = 0;
    payment.PaymentOptionId = 1; // Asumimos que 1 es MercadoPago
    payment.Amount = appOrder.total;
    payment.Observation = '';
    payment.PayWith = 0;
    payment.CashDrawerId = 0;
    payment.DateCreated = now;
    payment.CreatedUserId = 0;
    payment.IsActive = true;
    payment.IsEditPayment = false;
    
    // Agregar detalles de pago MercadoPago
    const mpPayment = new CustomerPaymentMercadoPagoVM();
    mpPayment.Id = 0;
    mpPayment.CustomerPaymentId = 0;
    mpPayment.Amount = appOrder.total;
    mpPayment.IsQrPayment = false;
    mpPayment.IsLinkPayment = true;
    mpPayment.DateCreated = now;
    mpPayment.CreatedUserId = 0;
    mpPayment.IsActive = true;
    
    payment.CustomerPaymentMercadoPagos = [mpPayment];
    orderVM.CustomerPayments.push(payment);
    
    // Indicar que tiene pagos
    orderVM.HasCustomerPayments = true;
    
    // Otros campos importantes según el código del backend
    orderVM.OrderTypeId = 1; // Asumimos que 1 es para pedidos online
    orderVM.SaleChannelName = 'Web';
    orderVM.PriceListName = 'Default';
    orderVM.IsInvoiced = false;
    orderVM.IsMustInvoiceOrder = false;
    orderVM.Observation = '';
    orderVM.UseThirdPartyDeliveryLogistics = false;
    orderVM.IsTransfer = false;
    orderVM.TransferDescription = '';
    orderVM.TransferObservation = '';
    orderVM.KitchenOrderId = 0;
    orderVM.WorkStationId = 0;
    orderVM.AlaxCouponDiscount = 0;
    orderVM.AlaxCouponDiscountUnits = 0;
    orderVM.AlaxDNI = 0;
    orderVM.SendAlaxUnits = false;
    orderVM.Discount = 0;
    orderVM.DiscountPercentage = 0;
    
    // Usar el número de orden generado como identificador único
    orderVM.UniqueKey = `ORDER-${orderNumber}-${Date.now()}`;
    
    // Propiedades heredadas de ContextualPropsVM
    orderVM.DateCreated = now;
    orderVM.CreatedUserId = 0;
    orderVM.IsActive = true;
    orderVM.CurrentTimeZone = -3;
    orderVM.Observation = "ReactApp";
    
    return orderVM;
  };

  /**
   * Create a payment preference and redirect to Mercado Pago
   */
  const createMercadoPagoPreference = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Creating Mercado Pago preference for order:', order);
      
      // Mapear la orden al formato OrderVM
      const orderVM = mapOrderToOrderVM(order);
      console.log('Mapped order to OrderVM:', orderVM);
      
      // Llamar al servicio con la orden mapeada
      const response = await mercadoPagoService.createPreference(orderVM);
      
      if (response.ValidationResult?.ErrorMessages?.length > 0) {
        const errorMessage = response.ValidationResult.ErrorMessages?.join(', ') || 'Unknown error';
        setError(errorMessage);
        handlePaymentError(errorMessage);
        return;
      }

      const preferenceId = response.PreferenceId;
      
      // Guardar el ID de preferencia en localStorage antes de redirigir
      localStorage.setItem('mpPreferenceId', preferenceId);
      
      // Guardar los datos de la orden en localStorage con más detalles antes de redireccionar
      try {
        const orderData = {
          items: order.items,
          total: order.total,
          customer: order.customer,
          customerId: order.customerId || null,
          customerName: order.customerName || (order.customer ? order.customer.name : 'Cliente'),
          estimatedPickupTime: order.estimatedPickupTime || new Date(Date.now() + 30 * 60000), // 30 min default
          timestamp: new Date().getTime(), // Añadir timestamp para control
          orderNumber: orderNumber // Incluir el número de orden
        };
        localStorage.setItem('mpOrderData', JSON.stringify(orderData));
        console.log('Order data saved to localStorage before redirect:', orderData);
      } catch (error) {
        console.error('Error saving order data to localStorage:', error);
      }
      
      // Redirigir directamente a Mercado Pago
      console.log('Redirecting to MercadoPago:', response.PreferenceInitPoint);
      window.location.href = response.PreferenceInitPoint;
      
    } catch (err: any) {
      const errorMessage = `Error creating payment preference: ${err.response?.data || err.message}`;
      setError(errorMessage);
      handlePaymentError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Verificar si estamos volviendo de Mercado Pago
  useEffect(() => {
    const storedPreferenceId = localStorage.getItem('mpPreferenceId');
    const storedOrderData = localStorage.getItem('mpOrderData');
    
    console.log('Checking for MercadoPago return data...');
    console.log('Stored preference ID:', storedPreferenceId);
    console.log('Stored order data exists:', !!storedOrderData);
    
    // Restaurar datos de la orden si existen
    if (storedOrderData) {
      try {
        const parsedOrderData = JSON.parse(storedOrderData);
        console.log('Restored order data from localStorage:', parsedOrderData);
        
        // Restaurar los items al OrderContext
        if (parsedOrderData.items && parsedOrderData.items.length > 0) {
          console.log('Restoring items to order context...');
          
          // Limpiar el carrito actual antes de agregar los items guardados
          clearOrder();
          
          // Agregar los items guardados
          parsedOrderData.items.forEach((item: any) => {
            console.log('Adding item to order:', item.product.name, 'x', item.quantity);
            addToOrder(item.product, item.quantity);
          });
          
          console.log('Items restored successfully');
        } else {
          console.warn('No items found in stored order data');
        }
        
        // Restaurar los datos del cliente si existen
        if (parsedOrderData.customer) {
          console.log('Restoring customer data:', parsedOrderData.customer);
          setCustomer(parsedOrderData.customer);
        } else {
          console.warn('No customer data found in stored order data');
        }
        
        // Mantener los datos en localStorage por si se necesitan en otro componente
        // pero marcarlos como procesados para evitar procesamiento duplicado
        localStorage.setItem('mpOrderDataProcessed', 'true');
      } catch (error) {
        console.error('Error parsing stored order data:', error);
      }
    }
    
    if (storedPreferenceId) {
      console.log('Found stored preference ID, processing payment success...');
      
      // Limpiar el storage del preferenceId
      localStorage.removeItem('mpPreferenceId');
      
      // Notificar éxito
      handlePaymentSuccess(storedPreferenceId);
    }
  }, []);

  const getPaymentMethodName = (method: PaymentMethod): string => {
    switch (method) {
      case 'cash':
        return 'Efectivo';
      case 'credit_card':
        return 'Tarjeta.';
      case 'mercado_pago':
        return 'Mercado Pago';
      default:
        return '';
    }
  };

  return (
    <div className="page-container">
      <div className="section-container">
        {/* Order Summary Section */}
        <div className="order-summary-container">
          <h3>Resumen del Pedido</h3>
          
          {/* Número de orden */}
          {orderNumber && (
            <div className="order-number">
              <span className="order-number-label">Orden</span>
              <span className="order-number-value">#{orderNumber}</span>
            </div>
          )}
          
          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <span>{item.quantity}x {item.product.name}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="order-total">
            <strong>Total:</strong>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="payment-methods-container">
          <h3>Método de Pago</h3>
          <div className="payment-methods-row">
            <div
              className={`payment-method-card ${selectedPayment === 'mercado_pago' ? 'selected' : ''} ${loading && selectedPayment === 'mercado_pago' ? 'loading' : ''}`}
              onClick={() => !loading && handlePaymentSelect('mercado_pago')}
            >
              <div className="payment-method-icon"  style={{ marginLeft: '10px', marginTop: '6px' }}>
                {loading && selectedPayment === 'mercado_pago' ? (
                  <div className="spinner"></div>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 18H12.01" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="8" y="6" width="8" height="8" rx="1" stroke="var(--primary-color)" strokeWidth="2"/>
                  </svg>
                )}
              </div>
              <div className="payment-method-name">
                {loading && selectedPayment === 'mercado_pago' ? 'Procesando...' : 'Mercado Pago'}
              </div>
            </div>

            <div
              className={`payment-method-card ${selectedPayment === 'cash' ? 'selected' : ''}`}
              onClick={() => !loading && handlePaymentSelect('cash')}
            >
              <div className="payment-method-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="6" width="20" height="12" rx="2" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="var(--primary-color)" strokeWidth="2"/>
                  <path d="M17 6V4.5C17 3.67157 16.3284 3 15.5 3H8.5C7.67157 3 7 3.67157 7 4.5V6" stroke="var(--primary-color)" strokeWidth="2"/>
                  <path d="M7 18V19.5C7 20.3284 7.67157 21 8.5 21H15.5C16.3284 21 17 20.3284 17 19.5V18" stroke="var(--primary-color)" strokeWidth="2"/>
                </svg>
              </div>
              <div className="payment-method-name">Efectivo</div>
            </div>

            <div
              className={`payment-method-card ${selectedPayment === 'credit_card' ? 'selected' : ''}`}
              onClick={() => !loading && handlePaymentSelect('credit_card')}
            >
              <div className="payment-method-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="var(--primary-color)" strokeWidth="2"/>
                  <path d="M2 10H22" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M6 15H10" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M14 15H18" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="payment-method-name">Tarjeta</div>
            </div>
          </div>
          
          {error && (
            <div className="payment-error-message">
              <p>{error}</p>
              <button 
                className="retry-button" 
                onClick={() => {
                  setError(null);
                  setSelectedPayment(null);
                }}
              >
                Intentar nuevamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSelection;
