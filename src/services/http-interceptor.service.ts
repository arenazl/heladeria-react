import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '../config/api.config';
import { loginService } from './login.service';

// Create a custom axios instance with interceptors
const createAxiosWithInterceptors = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL || '',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get token from localStorage if available, otherwise use default token
      const token = loginService.getToken() || 'defaultToken';
      
      // Add common headers for all requests
      if (config.headers) {
        config.headers['Accept'] = 'application/json, text/plain, */*';
        config.headers['Accept-Language'] = 'es-US,es-ES;q=0.9,es;q=0.8,af;q=0.7,en;q=0.6';
        config.headers['Authorization'] = 'Bearer ' + token;
        config.headers['Content-Type'] = 'application/json';
        // Removed jwt-token header as requested
      }
      
      // Add specific headers for MenuCommensal endpoints
      if (config.url && config.url.startsWith('MenuCommensal') && config.headers) {
        config.headers['CompanyId'] = API_CONFIG.COMPANY_ID;
        config.headers['Prefix'] = "_" + API_CONFIG.COMPANY_ID;
        config.headers['CompanySchema'] = API_CONFIG.PARTNER.NAME;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle authentication errors
      if (error.response && error.response.status === 401) {
        // Unauthorized, log out the user
        loginService.logOut();
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Export the axios instance with interceptors
export const axiosWithInterceptors = createAxiosWithInterceptors();
