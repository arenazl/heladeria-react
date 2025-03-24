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
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // We're not adding any headers here since they're already set in the api.service.ts
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
