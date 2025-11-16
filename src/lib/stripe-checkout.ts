// Stripe Checkout Session implementation
import { getAuthToken } from './stripe';

// Import or define API base URL
// Using environment variable or production API as fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fastapi.kevinlinportfolio.com/api/v1';

// Simplified fetch with retry function
const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 3): Promise<Response> => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await fetch(url, options);
    } catch (error) {
      retries++;
      if (retries >= maxRetries) throw error;
      await new Promise(r => setTimeout(r, 1000 * retries)); // Exponential backoff
    }
  }
  
  throw new Error('Maximum retries reached');
};

export interface CreateCheckoutSessionRequest {
  items: Array<{
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
  }>;
  shipping_address: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_line_1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  success_url: string;
  cancel_url: string;
  totals?: {
    subtotal: number;
    tax: number;
    delivery_fee: number;
    discount: number;
    total: number;
  };
}

export interface CheckoutSessionResponse {
  id: string;
  url: string;
  payment_intent_id: string;
  shipping_address_id?: string;
}

// Create a Stripe Checkout Session
export const createCheckoutSession = async (data: CreateCheckoutSessionRequest): Promise<CheckoutSessionResponse> => {
  console.log('Creating checkout session with data:', data);
  
  // Get token using centralized function
  const token = getAuthToken();
  
  // Log token format for debugging
  console.log('Creating checkout with auth token:', `Bearer ${token}`);

  try {
    // Convert request to URL parameters for GET method
    const params = new URLSearchParams();
    // Add basic parameters from data
    params.append('success_url', data.success_url);
    params.append('cancel_url', data.cancel_url);
    
    // Add shipping address parameters
    const address = data.shipping_address;
    params.append('first_name', address.first_name);
    params.append('last_name', address.last_name);
    params.append('email', address.email);
    params.append('phone', address.phone);
    params.append('address_line_1', address.address_line_1);
    params.append('city', address.city);
    params.append('state', address.state);
    params.append('postal_code', address.postal_code);
    params.append('country', address.country);
    
    // Add item parameters (simplified)
    params.append('items_json', JSON.stringify(data.items));
    
    // Add totals if available
    if (data.totals) {
      params.append('totals_json', JSON.stringify(data.totals));
    }
    
    const response = await fetchWithRetry(`${API_BASE_URL}/orders/create-checkout-session?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    console.log('Checkout session response status:', response.status);
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error('Checkout session failed - Status:', response.status);
      console.error('Checkout session failed - Response text:', responseText);
      
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }

    const result = await response.json();
    console.log('Checkout session created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Verification response interface
export interface VerifySessionResponse {
  order_id: string;
  payment_intent_id: string;
  payment_status: 'succeeded' | 'processing' | 'requires_payment_method' | 'requires_confirmation' | 'canceled';
  shipping_address_id: string;
  customer_email: string;
  amount_total: number;
}

// Verify a completed checkout session
export const verifyCheckoutSession = async (sessionId: string): Promise<VerifySessionResponse> => {
  console.log('Verifying checkout session:', sessionId);
  
  // Get token using centralized function
  const token = getAuthToken();
  
  // Log token format for debugging
  console.log('Verifying session with auth token:', `Bearer ${token}`);
  console.log('Verify endpoint URL:', `${API_BASE_URL}/orders/verify-checkout-session/${sessionId}`);

  try {
    // Update the verify session endpoint to match the backend convention
    const response = await fetchWithRetry(`${API_BASE_URL}/orders/verify-checkout-session/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('Verify session response status:', response.status);
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error('Session verification failed - Status:', response.status);
      console.error('Session verification failed - Response text:', responseText);
      
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }

    const result = await response.json();
    console.log('Session verified successfully:', result);
    return result;
  } catch (error) {
    console.error('Error verifying checkout session:', error);
    throw error;
  }
};
