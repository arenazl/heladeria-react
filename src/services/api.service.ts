import { AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api.config';
import { 
  MenuResponse,
  UploadPathEnum
} from '../models/api.types';
import { categories, subcategories, products } from '../data/mockData';
import { axiosWithInterceptors } from './http-interceptor.service';
import { loginService } from './login.service';

class ApiService {
  private headers: Record<string, string> = {};
  private folderPath: string = '';

  // Get menu data by company ID and price list ID
  async getMenu(companyId: string, priceListId: string) {
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
        PriceListId: parseInt(priceListId),
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
    const url = `${API_CONFIG.ENDPOINTS.MENU}/${companyId}/${priceListId}`;
    const response = await axiosWithInterceptors.get<MenuResponse>(url);
    
    // If the response contains a token, save it
    if (response.headers && response.headers['jwt-token']) {
      loginService.saveToken(response.headers['jwt-token']);
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
