/**
 * API Configuration for Stripe and other backend services
 */

// Production API URL - where the real FastAPI backend is hosted
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fastapi.kevinlinportfolio.com/api/v1';

// Fallback to Auth service API URL if needed
export const getBackupApiUrl = () => {
  // This is used as a fallback from auth.ts which already has a working API URL
  return 'https://fastapi.kevinlinportfolio.com/api/v1';
};

// Endpoints for different API operations
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
  },

  // Addresses
  ADDRESSES: {
    CREATE: '/shipping-addresses',
    GET_ALL: '/shipping-addresses',
    GET_ONE: (id: string) => `/shipping-addresses/${id}`,
    UPDATE: (id: string) => `/shipping-addresses/${id}`,
    DELETE: (id: string) => `/shipping-addresses/${id}`,
  },

  // Orders
  ORDERS: {
    CREATE_PAYMENT_INTENT: '/orders/create-payment-intent',
    CREATE_ORDER_WITH_PAYMENT: '/orders/create-order-with-payment',
    CONFIRM_PAYMENT: (orderId: string) => `/orders/confirm-payment/${orderId}`,
    REFUND: (orderId: string) => `/orders/refund/${orderId}`,
    GET_ALL: '/orders',
    GET_ONE: (id: string) => `/orders/${id}`,
  },

  // Products
  PRODUCTS: {
    GET_ALL: '/products',
    GET_ONE: (id: string) => `/products/${id}`,
    SEARCH: '/products/search',
  },
};

// Function to construct a full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Function to select the best API URL based on environment
export const checkAndSelectBestAPI = async (): Promise<string> => {
  // In a production environment, we would implement health checks
  // and fallback logic here. For now, we just return the base URL.
  return API_BASE_URL;
};

// Export default configuration
// Create a named object for default export
const apiConfig = {
  API_BASE_URL,
  API_ENDPOINTS,
  getApiUrl,
  checkAndSelectBestAPI,
};

export default apiConfig;
