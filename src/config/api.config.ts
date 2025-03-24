// API Configuration
export const API_CONFIG = {
  // Flag to use mock data or API data
  USE_MOCK_DATA: false, // Set to false to use the real API through the proxy
  
  // API URL and endpoints
  BASE_URL: process.env.NODE_ENV === 'production' ? 'https://api-prod.nucleocheck.com' : '/api', // Use full URL in production

  ENDPOINTS: {
    MENU: 'menu' // The endpoint will be BASE_URL/menu/{companyId}/{priceListId}
  }

};
