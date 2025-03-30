import { AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api.config';
import { 
  MenuResponse,
  UploadPathEnum,
  Company,
  MenuCommensalSearch
} from '../models/api.types';
import { categories, subcategories, products } from '../data/mockData';
import { axiosWithInterceptors } from './http-interceptor.service';
import { loginService } from './login.service';

class ApiService {
  private headers: Record<string, string> = {};
  private folderPath: string = '';

  // Set headers for API requests
  setHeaders(companyId: string, prefix: string = '') {
    // Get token from localStorage if available, otherwise use default token
    const savedToken = loginService.getToken();
    const token = savedToken || 'defaultToken';
    
    console.log('Setting headers with token:', token ? token.substring(0, 20) + '...' : 'No token');

    // Only include headers that are safe to set via JavaScript
    this.headers = {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'es-US,es-ES;q=0.9,es;q=0.8,af;q=0.7,en;q=0.6',
      'Authorization': 'Bearer ' + token,
      'CompanyId': companyId,
      'Content-Type': 'application/json',
      'jwt-token': token
    };

    if (prefix) {
      this.headers['Prefix'] = prefix;
      this.headers['CompanySchema'] = prefix;
    }
  }

  // Get company by ID
  async getCompanyById(companyId: string) {

    // If using mock data, return a promise with mock data
    if (API_CONFIG.USE_MOCK_DATA) {

      const mockCompany: Company = {   
        Id: companyId,
        Name: "Heladería Demo",
        Prefix: "HD",
        Address: "Av. Corrientes 1234",
        City: "Buenos Aires",
        State: "CABA",
        Country: "Argentina",
        CurrentTimeZone: -3
      };

        // Return a mock response with headers
        return Promise.resolve({ 
          data: mockCompany,
          headers: {
            authorization: 'Bearer mockToken123'
          }
        });
    }

    // If not using mock data, make the actual API call
    const options = {
      headers: this.headers
    };

    const response = await axiosWithInterceptors.get<any>(
      `MenuCommensal/GetCompanyById/${companyId}`,
      options
    );
    
    console.log('GetCompanyById response headers:', response.headers);
    
    // Check for token in response headers (Authorization or jwt-token)
    if (response.headers) {

      // Try to get token from Authorization header
      if (response.headers['authorization']) {
        const authHeader = response.headers['authorization'];
        console.log('Found Authorization header:', authHeader);
        
        // Extract token from "Bearer <token>" format if needed
        const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
        console.log('Saving token from Authorization header');

        loginService.saveToken(token);
      }
      // Fallback to jwt-token header
      else if (response.headers['jwt-token']) {
        console.log('Saving token from jwt-token header');
        loginService.saveToken(response.headers['jwt-token']);
      }
    }

    response.data = response.data.Company;
    
    return response;
  }

  // Get menu commensal data
  async getMenuCommensal(searchTerm: MenuCommensalSearch) {
    console.log('getMenuCommensal called with params:', searchTerm);
    console.log('Current headers:', this.headers);
    
    // If using mock data, return a promise with mock data
    if (API_CONFIG.USE_MOCK_DATA) {
      // Create a mock response based on the existing mock data
      const mockResponse: MenuResponse = {
        Categories: categories.map(category => ({
          Id: category.id,
          Name: category.name,
          Products: products.filter(product => {
            const subcat = subcategories.find(s => s.id === product.subcategoryId);
            return subcat && subcat.categoryId === category.id;
          }).map(product => {
            const subcat = subcategories.find(s => s.id === product.subcategoryId);
            return {
              Id: product.id,
              ProductCode: product.id.toString(),
              PriceWithIva: product.price,
              RubroName: category.name,
              SubRubroName: subcat ? subcat.name : '',
              RubroId: category.id,
              SubRubroId: product.subcategoryId,
              ProductName: product.name,
              ProductTypeId: 1,
              ProductTypeName: 'Producto simple',
              SaleMethodId: 1,
              ObservationType: null,
              MaxObservationsCount: 10,
              ProductDescription: product.description,
              PicturePath: product.image || null,
              AlaxUnits: 0,
              ProductGroups: [],
              ProductPromoItems: [],
              ProductQuantities: [],
              ProductSizes: [],
              Cost: 0,
              AlicuotaId: 1,
              AlicuotaPercentage: 21,
              PriceNoTax: product.price * 0.79, // Approximate tax calculation
              CurrentTimeZone: -3
            };
          }),
          CurrentTimeZone: -3
        })),
        CompanyName: "Heladería Demo",
        PriceListId: searchTerm.PriceListId || 0,
        PriceListName: "Lista Estándar",
        WhatsappPhoneNumber: null,
        Table: null,
        SystemConfiguration: {
          Id: 1,
          Address: null,
          City: "Buenos Aires",
          State: "CABA",
          Country: "Argentina",
          SystemConfigurationDigitalMenu: {
            Id: 1,
            ActiveColor: "7EA940",
            BackColor: "F4F3F4",
            MenuColor: "FFFFFF",
            ProductNameColor: "222222",
            ProductCardColor: "FFFFFF",
            TitleColor: "7EA940",
            TotalColor: "7EA940",
            DescriptionColor: "5F5F60",
            Description: "Los mejores helados artesanales",
            Name: "Heladería Demo",
            ImagePath: "",
            LogoPath: "",
            CurrentTimeZone: -3
          },
          UploadPaths: [],
          CurrentTimeZone: -3
        },
        CommensalProducts: [],
        Order: null,
        CurrentTimeZone: -3
      };

      return Promise.resolve({ data: mockResponse });
    }

    // If not using mock data, make the actual API call
    // Build params for the request
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

    const options = {
      headers: this.headers,
      params: params
    };

    console.log('Making API call to MenuCommensal/GetMenuCommensal with options:', options);
    
    const response = await axiosWithInterceptors.get<MenuResponse>(
      'MenuCommensal/GetMenuCommensal',
      options
    );
    
    console.log('API call successful, response:', response);
    
    // Check for token in response headers (Authorization or jwt-token)
    if (response.headers) {
      // Try to get token from Authorization header
      if (response.headers['authorization']) {
        const authHeader = response.headers['authorization'];
        console.log('Found Authorization header:', authHeader);
        
        // Extract token from "Bearer <token>" format if needed
        const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
        console.log('Saving token from Authorization header');
        loginService.saveToken(token);
      }
      // Fallback to jwt-token header
      else if (response.headers['jwt-token']) {
        console.log('Saving token from jwt-token header');
        loginService.saveToken(response.headers['jwt-token']);
      }
    }
    
    return response;
  }

  // Helper method to get upload path
  getUploadPath(pathType: UploadPathEnum): string {
    // This would typically come from configuration or the API
    // For now, we'll return a placeholder
    return `${API_CONFIG.BASE_URL}/uploads/${pathType}`;
  }
}

// Create a singleton instance
export const apiService = new ApiService();
