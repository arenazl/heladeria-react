import { axiosWithInterceptors } from './http-interceptor.service';
import { API_CONFIG } from '../config/api.config';

class OrderService {

  // Método para rechazar un pedido
  async rejectOrder(orderData: any) {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      const baseUrl = API_CONFIG.BASE_URL || '';
      console.log('URL base de la API:', baseUrl);
      const endpoint = 'PartnerOrder/RejectOrder';
      console.log('Endpoint completo:', `${baseUrl}/${endpoint}`);
      console.log('Enviando datos al servidor:', JSON.stringify(orderData, null, 2));

      // Llamada al endpoint PartnerOrder/RejectOrder del controlador
      const response = await axiosWithInterceptors.post(
        endpoint,
        orderData,
        options
      );
      
      return response.data;
    } catch (error) {
      console.error('Error al rechazar el pedido:', error);
      throw error;
    }
  }

  // Método para obtener los partners configurados
  async getPartnersConfigured() {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      const baseUrl = API_CONFIG.BASE_URL || '';
      console.log('URL base de la API:', baseUrl);
      const endpoint = 'PartnerOrder/GetPartnersConfigured';
      console.log('Endpoint completo:', `${baseUrl}/${endpoint}`);

      // Llamada al endpoint PartnerOrder/GetPartnersConfigured del controlador
      const response = await axiosWithInterceptors.get(
        endpoint,
        options
      );
      
      return response.data;
    } catch (error) {
      console.error('Error al obtener los partners configurados:', error);
      throw error;
    }
  }

}

// Crear una instancia singleton
export const orderService = new OrderService();
