// API Configuration
export const API_CONFIG = {
  // Flag to use mock data or API data
  USE_MOCK_DATA: false, // Set back to true for now until we resolve CORS issues
  
  // API URL and endpoints
  BASE_URL: 'https://prod.nucleocheck.com',
  ENDPOINTS: {
    MENU: 'menu' // The endpoint will be BASE_URL/menu/{companyId}/{priceListId}
  }
};
