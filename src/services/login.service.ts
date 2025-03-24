import { jwtDecode } from 'jwt-decode';

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
}

// Create a singleton instance
export const loginService = new LoginService();
