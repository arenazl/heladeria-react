import { axiosWithInterceptors } from './http-interceptor.service';
import { API_CONFIG } from '../config/api.config';
import { MenuResponse, MenuCommensalSearch } from '../models/api.types';
import { loginService } from './login.service';
import { 
  ApiResponseWithValidation, 
  MercadoPagoPreferenceResultVM, 
  processApiResponse 
} from '../models/validation.types';

class MenuCommensalService {
  // Get company by ID
  async getCompanyById(companyId: string) {
    const headers = {
      'CompanyId': companyId,
      'Prefix': `_${companyId}`
    };
    
    const response = await axiosWithInterceptors.get<any>(
      `MenuCommensal/GetCompanyById/${companyId}`,
      { headers }
    );
    
    if (response.headers && response.headers['authorization']) {
      const authHeader = response.headers['authorization'];
      const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
      loginService.saveToken(token);
    }

    response.data = response.data.Company;
    return response;
  }

  // Get menu commensal data
  async getMenuCommensal(searchTerm: MenuCommensalSearch) {
    const params: Record<string, string> = {};
    if (searchTerm.PriceListId) {
      params['PriceListId'] = searchTerm.PriceListId.toString();
    }
    if (searchTerm.OrderTypeId) {
      params['OrderTypeId'] = searchTerm.OrderTypeId.toString();
    }
    if (searchTerm.TableId) {
      params['TableId'] = searchTerm.TableId.toString();
    }

    // Get companyId from sessionStorage - this is set by the MenuLoader component
    const companyId = sessionStorage.getItem('companyId');
    
    // If companyId is not available, throw an error
    if (!companyId) {
      console.error('No companyId found in sessionStorage');
      throw new Error('No companyId found in sessionStorage');
    }
    
    const options = {
      params: params,
      headers: {
        'CompanyId': companyId,
        'Prefix': `_${companyId}`
      }
    };
    
    const response = await axiosWithInterceptors.get<MenuResponse>(
      'MenuCommensal/GetMenuCommensal',
      options
    );
    
    if (response.headers && response.headers['authorization']) {
      const authHeader = response.headers['authorization'];
      const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
      loginService.saveToken(token);
    }
    
    return response;
  }

  /**
   * Saves a partner order through MenuCommensal
   * @param {any} orderData - The order data to save
   * @returns {Promise<ApiResponseWithValidation>} - The response with properly typed ValidationResult if present
   */
  async savePartnerOrder(orderData: any): Promise<ApiResponseWithValidation> {
    try {
      if (!orderData) {
        throw new Error('No order data provided');
      }
      
      if (!orderData.partnerOrderItems || !Array.isArray(orderData.partnerOrderItems) || orderData.partnerOrderItems.length === 0) {
        console.error('No partner order items found in the order data:', orderData);
        throw new Error('No partner order items found in the order data');
      }
      
      console.log('Saving partner order with', orderData.partnerOrderItems.length, 'items');
      
      const now = new Date();
      
      // Crear el PartnerOrderVM según la estructura requerida
      const partnerOrderVM = {
        id: 0,
        partnerOrderNumber: orderData.partnerOrder.PartnerOrderNumber,
        partnerId: orderData.partnerOrder.PartnerId || API_CONFIG.PARTNER.ID,
        partnerName: orderData.partnerOrder.PartnerName || API_CONFIG.PARTNER.NAME,
        partnerOrderStatusId: 1, // Pending
        partnerOrderJsonFileId: 1,
        partnerOrderJsonFile: {
          id: 0,
          mappedOrderJson: JSON.stringify(orderData.partnerOrder),
          unmappedOrderJson: JSON.stringify(orderData),
          dateCreated: now.toISOString(),
          dateUpdated: null,
          createdUserId: 1,
          updatedUserId: null,
          isActive: true,
          currentTimeZone: -3
        },
        isDeliveryDateScheduled: false,
        restaurantIntegrationCode: API_CONFIG.PARTNER.INTEGRATION_CODE,
        date: now.toISOString(),
        deliveryAddress: orderData.partnerOrder.DeliveryAddress,
        deliveryDate: orderData.partnerOrder.DeliveryDate,
        customerId: orderData.partnerOrder.CustomerId,
        customerName: orderData.partnerOrder.CustomerName,
        customerPhone: orderData.partnerOrder.CustomerPhone,
        discount: orderData.partnerOrder.Discount,
        subtotal: orderData.partnerOrder.Subtotal,
        tax: orderData.partnerOrder.Tax,
        total: orderData.partnerOrder.Total,
        observation: "",
        errorMesagge: null,
        responseDataTextRepresentation: JSON.stringify(orderData),
        partnerLogoPath: null,
        orderId: 0,
        order: null,
        partnerResponseOptionSelected: null,
        askSaveOrderWithError: false,
        saveOrderWithError: false,
        forceOrderRemoval: false,
        dateCreated: now.toISOString(),
        dateUpdated: null,
        createdUserId: 1,
        updatedUserId: null,
        isActive: true,
        isFromAutomatization: false,
        token: null,
        rappiQR: null,
        workstationId: 0,
        currentTimeZone: -3,
        items: orderData.partnerOrderItems.map((item: any) => {
          console.log('Processing item for API:', item);
          return {
            id: 0,
            partnerOrderId: 0,
            productId: item.ProductId,
            productName: item.ProductName,
            unitPrice: item.UnitPrice,
            quantity: item.Quantity,
            subtotal: item.Subtotal,
            tax: item.Tax,
            total: item.Total,
            observation: "",
            isInnerProductItem: false,
            dateCreated: now.toISOString(),
            dateUpdated: null,
            createdUserId: 1,
            updatedUserId: null,
            isActive: true,
            currentTimeZone: -3
          };
        })
      };

      const baseUrl = API_CONFIG.BASE_URL || '';
      console.log('URL base de la API:', baseUrl);
      console.log('Datos a enviar al servidor:', JSON.stringify(partnerOrderVM, null, 2));

      // Get companyId from sessionStorage
      const companyId = sessionStorage.getItem('companyId');
      
      // If companyId is not available, throw an error
      if (!companyId) {
        console.error('No companyId found in sessionStorage');
        throw new Error('No companyId found in sessionStorage');
      }
      
      // Llamada al endpoint SavePartnerOrder de MenuCommensal
      const response = await axiosWithInterceptors.post(
        'MenuCommensal/SavePartnerOrder',
        partnerOrderVM,
        {
          headers: {
            'CompanyId': companyId,
            'Prefix': `_${companyId}`
          }
        }
      );
      
      // Process the response to handle ValidationResult if present
      return processApiResponse<ApiResponseWithValidation>(response.data);
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
      throw error;
    }
  }
  /**
   * Creates a Mercado Pago payment preference
   * @param {Object} order - The order object containing all order details
   * @returns {Promise<MercadoPagoPreferenceResultVM>} - The preference data including preferenceId and preferenceInitPoint
   */
  async createPreference(order: any): Promise<MercadoPagoPreferenceResultVM> {
    try {

      // Get companyId from sessionStorage
      const companyId = sessionStorage.getItem('companyId');
      
      // If companyId is not available, throw an error
      if (!companyId) {
        console.error('No companyId found in sessionStorage');
        throw new Error('No companyId found in sessionStorage');
      }
      
      const response = await axiosWithInterceptors.post(
        'MenuCommensal/CreatePreferenceCheckout', 
        order,
        {
          headers: {
            'CompanyId': companyId,
            'Prefix': `_${companyId}`
          }
        }
      );
      // Process the response to handle ValidationResult if present
      return processApiResponse<MercadoPagoPreferenceResultVM>(response.data);
    } catch (error) {
      console.error('Error creating Mercado Pago preference:', error);
      throw error;
    }
  }

  /**
   * Gets order by ID
   * @param {number} id - The order ID
   * @returns {Promise<ApiResponseWithValidation>} - The order data with properly typed ValidationResult if present
   */
  async getOrderById(id: number): Promise<ApiResponseWithValidation> {
    try {
      // Get companyId from sessionStorage
      const companyId = sessionStorage.getItem('companyId');
      
      // If companyId is not available, throw an error
      if (!companyId) {
        console.error('No companyId found in sessionStorage');
        throw new Error('No companyId found in sessionStorage');
      }
      
      const response = await axiosWithInterceptors.get(
        `MenuCommensal/GetOrderById/${id}`,
        {
          headers: {
            'CompanyId': companyId,
            'Prefix': `_${companyId}`
          }
        }
      );
      // Process the response to handle ValidationResult if present
      return processApiResponse<ApiResponseWithValidation>(response.data);
    } catch (error) {
      console.error(`Error getting order with ID ${id}:`, error);
      throw error;
    }
  }
}

// Crear una instancia singleton
export const menuCommensalService = new MenuCommensalService();

// Exportar métodos específicos para compatibilidad con código existente
export const mercadoPagoService = {
  createPreference: (order: any) => menuCommensalService.createPreference(order),
  getOrderById: (id: number) => menuCommensalService.getOrderById(id)
};
