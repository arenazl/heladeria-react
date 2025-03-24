import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '../config/api.config';
import { loginService } from './login.service';

// Create a custom axios instance with interceptors
const createAxiosWithInterceptors = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Get the token
      const token = loginService.getToken();

      // Skip token check for specific endpoints
      const isMenuCommensalEndpoint = config.url?.includes('MenuCommensal/');
      const isAccountEndpoint = config.url?.includes('Account/');

      if (!isMenuCommensalEndpoint && !isAccountEndpoint) {
        // Check if token exists and is not expired
        if (token && loginService.isTokenExpired()) {
          // Token is expired, log out the user
          loginService.logOut();
          // The request will still be sent, but the user will be redirected
        }
      }

      // Add token to headers if it exists
      if (token) {
        config.headers = config.headers || {};
        config.headers['jwt-Token'] = token;
        config.headers['Authorization'] = `Bearer ${token}`;
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
