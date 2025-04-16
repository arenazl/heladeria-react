import React, { useState, useEffect } from 'react';
import '../styles/MercadoPagoCheckout.css';
import { useNavigate } from 'react-router-dom';
import { mercadoPagoService } from '../services/mercadopago.service';
import { signalRService } from '../services/signalr.service';
import { API_CONFIG } from '../config/api.config';
import { OrderVM, OrderProductItemVM, CustomerPaymentVM, OrderDispatchVM, CustomerPaymentMercadoPagoVM } from '../models/order';
import { useOrder } from '../context/OrderContext';

interface MercadoPagoCheckoutProps {
  order: {
    items: Array<{
      product: {
        id: number;
        name: string;
        price: number;
      };
      quantity: number;
    }>;
    total: number;
    customer?: {
      name: string;
      address?: string;
      phone?: string;
    };
    customerId?: number | null;
    customerName?: string;
    estimatedPickupTime?: Date;
  };
  onSuccess?: (preferenceId: string) => void;
  onError?: (error: string) => void;
  useRedirect?: boolean;
  onIframeShow?: () => void;
  onIframeHide?: () => void;
}

const MercadoPagoCheckout: React.FC<MercadoPagoCheckoutProps> = ({ 
  order, 
  onSuccess, 
  onError, 
  useRedirect = true,
  onIframeShow,
  onIframeHide
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToOrder, setCustomer, clearOrder } = useOrder();

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

  /**
   * Handle successful payment
   * @param {string} receivedPreferenceId - The preference ID from the notification
   */
  const handlePaymentSuccess = (receivedPreferenceId: string) => {
    // Check if this notification is for our order
    if (preferenceId && receivedPreferenceId === preferenceId) {
      console.log('Payment successful for preference ID:', preferenceId);
      
      if (onSuccess) {
        onSuccess(preferenceId);
      } else {
        // Default success behavior
        navigate('/payment-success');
      }
    }
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
    
    // Generar un identificador único
    orderVM.UniqueKey = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Propiedades heredadas de ContextualPropsVM
    orderVM.DateCreated = now;
    orderVM.CreatedUserId = 0;
    orderVM.IsActive = true;
    orderVM.CurrentTimeZone = -3;
    orderVM.Observation = "ReactApp";
    
    return orderVM;
  };

  // Llamar a onIframeShow cuando se muestra el iframe
  useEffect(() => {
    if (checkoutUrl && onIframeShow) {
      onIframeShow();
    }
  }, [checkoutUrl, onIframeShow]);
  
  // Navegar directamente a la URL de Mercado Pago
  const navigateToMercadoPago = () => {
    if (checkoutUrl) {
      // Guardar el estado actual en sessionStorage para recuperarlo al volver
      sessionStorage.setItem('mpPreferenceId', preferenceId || '');
      
      // Guardar los datos de la orden en sessionStorage con más detalles
      try {
        const orderData = {
          items: order.items,
          total: order.total,
          customer: order.customer,
          customerId: order.customerId || null,
          customerName: order.customerName || (order.customer ? order.customer.name : 'Cliente'),
          estimatedPickupTime: order.estimatedPickupTime || new Date(Date.now() + 30 * 60000) // 30 min default
        };
        sessionStorage.setItem('mpOrderData', JSON.stringify(orderData));
        console.log('Order data saved to sessionStorage:', orderData);
      } catch (error) {
        console.error('Error saving order data to sessionStorage:', error);
      }
      
      // Navegar a la URL de Mercado Pago
      window.location.href = checkoutUrl;
    }
  };

  /**
   * Create a payment preference
   */
  const createPreference = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Original order:', order);
      
      // Mapear la orden al formato OrderVM
      const orderVM = mapOrderToOrderVM(order);
      console.log('Mapped order to OrderVM:', orderVM);
      
      // Llamar al servicio con la orden mapeada
      const response = await mercadoPagoService.createPreference(orderVM);
      
      if (response.ValidationResult?.ErrorMessages?.length > 0) {
        const errorMessage = response.ValidationResult.ErrorMessages?.join(', ') || 'Unknown error';
        setError(errorMessage);
        if (onError) onError(errorMessage);
        return;
      }

      setPreferenceId(response.PreferenceId);
      
      // Guardar el ID de preferencia en sessionStorage antes de redirigir
      sessionStorage.setItem('mpPreferenceId', response.PreferenceId);
      
      // Guardar los datos de la orden en sessionStorage con más detalles antes de redireccionar
      try {
        const orderData = {
          items: order.items,
          total: order.total,
          customer: order.customer,
          customerId: order.customerId || null,
          customerName: order.customerName || (order.customer ? order.customer.name : 'Cliente'),
          estimatedPickupTime: order.estimatedPickupTime || new Date(Date.now() + 30 * 60000) // 30 min default
        };
        sessionStorage.setItem('mpOrderData', JSON.stringify(orderData));
        console.log('Order data saved to sessionStorage before redirect:', orderData);
      } catch (error) {
        console.error('Error saving order data to sessionStorage:', error);
      }
      
      // Redirigir directamente a Mercado Pago usando window.open
      console.log('Redirecting to MercadoPago:', response.PreferenceInitPoint);
      
      // Abrir en la misma ventana (_self)
      window.open(response.PreferenceInitPoint, '_self');
      
      // Estas líneas son de respaldo en caso de que la redirección falle
      setPreferenceId(response.PreferenceId);
      setCheckoutUrl(response.PreferenceInitPoint);
      
    } catch (err: any) {
      const errorMessage = `Error creating payment preference: ${err.response?.data || err.message}`;
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Manejar el mensaje de evento desde el iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verificar que el mensaje viene de MercadoPago
      if (event.origin.includes('mercadopago.com')) {
        // Si el mensaje indica que el pago fue exitoso
        if (event.data && event.data.status === 'approved') {
          handlePaymentSuccess(preferenceId || '');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [preferenceId]);

  const handleBackButton = () => {
    // Limpiar el estado y volver a mostrar el botón de pago
    setCheckoutUrl(null);
    setPreferenceId(null);
    
    // Llamar a onIframeHide cuando se oculta el iframe
    if (onIframeHide) {
      onIframeHide();
    }
  };

  // Verificar si estamos volviendo de Mercado Pago
  useEffect(() => {
    const storedPreferenceId = sessionStorage.getItem('mpPreferenceId');
    const storedOrderData = sessionStorage.getItem('mpOrderData');
    
    console.log('Checking for MercadoPago return data...');
    console.log('Stored preference ID:', storedPreferenceId);
    console.log('Stored order data exists:', !!storedOrderData);
    
    // Restaurar datos de la orden si existen
    if (storedOrderData) {
      try {
        const parsedOrderData = JSON.parse(storedOrderData);
        console.log('Restored order data from sessionStorage:', parsedOrderData);
        
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
        
        // Mantener los datos en sessionStorage por si se necesitan en otro componente
        // pero marcarlos como procesados para evitar procesamiento duplicado
        sessionStorage.setItem('mpOrderDataProcessed', 'true');
      } catch (error) {
        console.error('Error parsing stored order data:', error);
      }
    }
    
    if (storedPreferenceId) {
      console.log('Found stored preference ID, processing payment success...');
      
      // Limpiar el storage del preferenceId
      sessionStorage.removeItem('mpPreferenceId');
      
      // Notificar éxito
      handlePaymentSuccess(storedPreferenceId);
    }
  }, [addToOrder, setCustomer, clearOrder, handlePaymentSuccess]);

  return (
    <div className="mercadopago-checkout">
      {error && (
        <div className="mercadopago-error">
          <p>{error}</p>
        </div>
      )}
      
      <button 
        onClick={checkoutUrl ? navigateToMercadoPago : createPreference} 
        disabled={loading}
        className="mercadopago-button"
      >
        {loading ? (
          <div className="mercadopago-button-loading">
            <div className="spinner"></div>
            <span>Procesando...</span>
          </div>
        ) : (
          <div className="mercadopago-button-content">
            <div className="mercadopago-button-icon">
              <img src={require('../assets/images/mp.png')} alt="Mercado Pago" />
            </div>
            <div className="mercadopago-button-text">
              Ingresar a Mercado Pago
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

export default MercadoPagoCheckout;
