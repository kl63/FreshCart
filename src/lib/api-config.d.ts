/**
 * Type declarations for API configuration
 */

// Define API endpoints structure
export interface ApiEndpoints {
  AUTH: {
    LOGIN: string;
    REFRESH: string;
    REGISTER: string;
  };
  ADDRESSES: {
    CREATE: string;
    GET_ALL: string;
    GET_ONE: (id: string) => string;
    UPDATE: (id: string) => string;
    DELETE: (id: string) => string;
  };
  ORDERS: {
    CREATE_PAYMENT_INTENT: string;
    CREATE_ORDER_WITH_PAYMENT: string;
    CONFIRM_PAYMENT: (orderId: string) => string;
    REFUND: (orderId: string) => string;
    GET_ALL: string;
    GET_ONE: (id: string) => string;
  };
  PRODUCTS: {
    GET_ALL: string;
    GET_ONE: (id: string) => string;
    SEARCH: string;
  };
}

// Export API config interface
export interface ApiConfig {
  API_BASE_URL: string;
  API_ENDPOINTS: ApiEndpoints;
  getApiUrl: (endpoint: string) => string;
  checkAndSelectBestAPI: () => Promise<string>;
}

// Declare the module
declare module './api-config' {
  const apiConfig: ApiConfig;
  export const API_BASE_URL: string;
  export const API_ENDPOINTS: ApiEndpoints;
  export const getApiUrl: (endpoint: string) => string;
  export const checkAndSelectBestAPI: () => Promise<string>;
  export default apiConfig;
}
