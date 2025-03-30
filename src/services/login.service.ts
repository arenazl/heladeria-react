import { jwtDecode } from 'jwt-decode';
import { axiosWithInterceptors } from './http-interceptor.service';
import { API_CONFIG } from '../config/api.config';

class LoginService {
  private tokenKey = 'jwtToken';

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
      const emailUser = "lucas@nucleo.com.ar";
      const password = "123";
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
      
      if (response) 
        {
        return response;
      } 

      else if (API_CONFIG.USE_MOCK_DATA) {
        // For mock data, use a hardcoded token
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTHVjYXMiLCJVc2VySWQiOiIyNzYiLCJVc2VyTmFtZSI6Ikx1Y2FzIiwiQ29tcGFueUlkIjoiMTkyIiwiQ29tcGFueVNjaGVtYSI6IjE5Ml8iLCJJc1VzZXJDaGVjayI6IlRydWUiLCJBY2Nlc3NMZXZlbCI6IjAiLCJDb21wYW55RGF0YWJhc2UiOiJudWNsZW9fY2hlY2tfcHJvZCIsIlRpbWVab25lIjoiLTMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJbNF0iLCJQZXJtaXNzaW9ucyI6IlsxLDIsMyw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxNywxOCwxOSwyMCwyMSwyMiwyMywyNCwyNSwyNiwyNywyOCwyOSwzMCwzMSwzMiwzMywzNCwzNSwzNiwzNywzOCwzOSw0MCw0MSw0Miw0Myw0NCw0NSw0Niw0Nyw0OCw0OSw1MCw1MSw1Miw1Myw1NCw1NSw1Niw1Nyw1OCw1OSw2MCw2MSw2Miw2Myw2NCw2NSw2Niw2Nyw2OCw2OSw3MCw3MSw3Miw3Myw3NCw3NSw3Niw3Nyw3OCw3OSw4MCw4MSw4Miw4Myw4NCw4NSw4Niw4Nyw4OCw4OSw5MCw5MSw5Miw5Myw5NCw5NSw5Niw5Nyw5OCw5OSwxMDAsMTAxLDEwMiwxMDMsMTA0LDEwNSwxMDYsMTA3LDEwOCwxMDksMTEwLDExMSwxMTIsMTEzLDExNCwxMTUsMTE2LDExNywxMTgsMTE5LDEyMCwxMjEsMTIyLDEyMywxMjQsMTI1LDEyNiwxMjcsMTI4LDEyOSwxMzAsMTMxLDEzMiwxMzMsMTM0LDEzNSwxMzYsMTM3XSIsIk1vZHVsZXMiOiJbMSwyLDE0LDEyLDksMTEsMTZdIiwiZXhwIjoxNzQyODE1ODI0fQ.wsACOAqiRoWJ5ZD-WNBkp78D4WCZZeYoxC6A_dPzvwg';
        this.saveToken(token);
        return null;
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
