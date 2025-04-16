import { jwtDecode } from 'jwt-decode';
import { axiosWithInterceptors } from './http-interceptor.service';
import { API_CONFIG } from '../config/api.config';

class LoginService {
  
  private tokenKey = '';

  // Get token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Save token to local storage
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Remove token from local storage
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token has an expiration time and if it's expired
      return decoded.exp ? decoded.exp < currentTime : false;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }

  // Log out user
  logOut(): void {
    this.removeToken();
    // Redirect to login page or home page if needed
    window.location.href = '/';
  }

  // Login with email and password
  async login(emailUser: string, password: string, companyId: number = 0) {
    try {
      const loginData = {
        EmailUser: emailUser,
        Password: password,
        CompanyId: companyId
      };

      const response = await axiosWithInterceptors.post(
        'Account/Login',
        loginData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (response.data && response.data.token) {
        this.saveToken(response.data.token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  // Validate user and get companies
  async validateUserAndGetCompanies() {
    try {
      // Hardcoded credentials as requested
      const emailUser = "Comensal1";
      const password = "Comensal1";
      const companyId = 0;
      
      // Build the JSON body
      const loginData = {
        EmailUser: emailUser,
        Password: password,
        CompanyId: companyId
      };
      
      console.log('Validating user and getting companies...');
      
      // Make the API call
      const response = await axiosWithInterceptors.post(
        'Account/ValidateUserAndGetCompanies/',
        loginData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('ValidateUserAndGetCompanies response:', response);
      
      if (response) {
        return response;
      }
      
    } catch (error) {
      return null;
    }
  }
  
  // Anonymous login for QR code access (deprecated, use validateUserAndGetCompanies instead)
  async anonymousLogin() {
    return this.validateUserAndGetCompanies();
  }
}

// Create a singleton instance
export const loginService = new LoginService();
