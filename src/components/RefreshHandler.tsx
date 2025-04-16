import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';

/**
 * Componente que maneja el comportamiento cuando se refresca la página.
 * Cuando ocurre un refresh, limpia el carrito y redirige al listado de productos.
 * No limpia el carrito si se está volviendo de MercadoPago.
 */
const RefreshHandler: React.FC = () => {
  const { clearOrder } = useOrder();
  const navigate = useNavigate();

  useEffect(() => {
    // Función para manejar el evento beforeunload (cuando se refresca la página)
    const handleBeforeUnload = () => {
      // Guardar un flag en sessionStorage para indicar que se está refrescando la página
      sessionStorage.setItem('isRefreshing', 'true');
    };

    // Función para manejar cuando la página se carga (después de un refresh)
    const handlePageLoad = () => {
      // Verificar si se está cargando después de un refresh
      const isRefreshing = sessionStorage.getItem('isRefreshing');
      
      // Verificar si hay datos de MercadoPago en sessionStorage
      const mpPreferenceId = sessionStorage.getItem('mpPreferenceId');
      const mpOrderData = sessionStorage.getItem('mpOrderData');
      
      // Verificar la URL actual para determinar si estamos en la página de éxito de pago
      const currentPath = window.location.hash;
      const isPaymentSuccessPage = currentPath.includes('/payment-success');
      
      // Si se está refrescando y estamos en la página de éxito de pago o hay datos de MercadoPago,
      // no hacer nada para preservar el contexto de la orden
      if (isRefreshing === 'true' && (isPaymentSuccessPage || mpPreferenceId || mpOrderData)) {
        console.log('Refresh detected on payment success page or with MercadoPago data, preserving order context');
        
        // Solo limpiar el flag de refresh, pero no el carrito ni redirigir
        sessionStorage.removeItem('isRefreshing');
      } 
      // En cualquier otro caso de refresco, limpiar el carrito y redirigir al menú
      else if (isRefreshing === 'true') {
        console.log('Refresh detected, clearing order and redirecting to menu page');
        
        // Limpiar el carrito
        clearOrder();
        
        // Verificar si hay un companyId y priceListId en sessionStorage
        const companyId = sessionStorage.getItem('companyId') || '1';
        const priceListId = sessionStorage.getItem('priceListId') || '1';
        
        // Redirigir a la página de menú
        navigate('/menu/' + companyId + '/' + priceListId);
        
        // Limpiar el flag
        sessionStorage.removeItem('isRefreshing');
      }
    };

    // Agregar event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Verificar si se está cargando después de un refresh
    handlePageLoad();

    // Limpiar event listeners al desmontar el componente
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [clearOrder, navigate]);

  // Este componente no renderiza nada visible
  return null;
};

export default RefreshHandler;
