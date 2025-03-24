import { SystemConfiguration, UploadPathEnum } from '../models/api.types';

class SessionService {
  // Save system configuration to local storage
  saveSystemConfigurationInLocalStorage(config: SystemConfiguration): void {
    localStorage.setItem('systemConfiguration', JSON.stringify(config));
  }

  // Get system configuration from local storage
  getSystemConfigurationFromLocalStorage(): SystemConfiguration | null {
    const configStr = localStorage.getItem('systemConfiguration');
    if (configStr) {
      return JSON.parse(configStr);
    }
    return null;
  }

  // Get upload paths
  getUploadPaths(pathType: UploadPathEnum): string {
    const config = this.getSystemConfigurationFromLocalStorage();
    // This is a placeholder implementation
    // In a real application, this would come from the system configuration
    return `/uploads/${pathType}`;
  }

  // Save menu data to local storage
  saveMenuDataInLocalStorage(menuData: any): void {
    localStorage.setItem('menuData', JSON.stringify(menuData));
  }

  // Get menu data from local storage
  getMenuDataFromLocalStorage(): any {
    const menuDataStr = localStorage.getItem('menuData');
    if (menuDataStr) {
      return JSON.parse(menuDataStr);
    }
    return null;
  }

  // Clear session data
  clearSessionData(): void {
    localStorage.removeItem('systemConfiguration');
    localStorage.removeItem('menuData');
  }
}

// Create a singleton instance
export const sessionService = new SessionService();
