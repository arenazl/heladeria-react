import { AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api.config';
import { 
  MenuResponse,
  UploadPathEnum,
  MenuCommensalSearch
} from '../models/api.types';
import { axiosWithInterceptors } from './http-interceptor.service';
import { loginService } from './login.service';
import { menuCommensalService } from './menu-commensal.service';

/**
 * Servicio API general para la aplicación.
 * Nota: Los métodos relacionados con MenuCommensal han sido movidos al servicio específico
 * menu-commensal.service.ts para evitar duplicación y mantener la lógica en un solo lugar.
 */
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

  // Get company by ID - Delegado al servicio de menú comensal
  async getCompanyById(companyId: string) {
    // Delegamos al servicio especializado
    return menuCommensalService.getCompanyById(companyId);
  }

  // Get menu commensal data - Delegado al servicio de menú comensal
  async getMenuCommensal(searchTerm: MenuCommensalSearch) {
    console.log('getMenuCommensal called with params:', searchTerm);
    
    // Delegamos al servicio especializado
    return menuCommensalService.getMenuCommensal(searchTerm);
  }

  // Helper method to get upload path
  getUploadPath(pathType: UploadPathEnum): string {
    // This would typically come from configuration or the API
    // For now, we'll return a placeholder
    const baseUrl = API_CONFIG.BASE_URL || '';
    return `${baseUrl}/uploads/${pathType}`;
  }
}

// Create a singleton instance
export const apiService = new ApiService();
