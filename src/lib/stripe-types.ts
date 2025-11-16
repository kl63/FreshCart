/**
 * Extended type definitions for Stripe integration
 * 
 * This file provides more comprehensive type definitions that match
 * both the mock implementations and real API responses
 */

// Address types
export interface AddressResponse {
  id: string;
  type: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressRequest {
  type: string; // "shipping", "billing", "home", "work", "other"
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default?: boolean;
}

// Payment Intent types
export interface PaymentIntentResponse {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  payment_method_types: string[];
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
  customer_email: string;
  shipping_address?: {
    type: string;
    first_name: string;
    last_name: string;
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
}

// Order item types
export interface OrderItem {
  id?: string;
  product_id: string;
  quantity: number;
  price: number;
  name?: string;
  image_url?: string;
}

// Order types
export interface OrderResponse {
  id: string;
  customer_id?: string;
  shipping_address_id: string;
  payment_intent_id: string;
  status: string;
  items: OrderItem[];
  totals: {
    subtotal: number;
    tax: number;
    delivery_fee: number;
    discount: number;
    total: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateOrderWithPaymentRequest {
  items: OrderItem[];
  shipping_address_id: string;
  payment_intent_id: string;
  totals: {
    subtotal: number;
    tax: number;
    delivery_fee: number;
    discount: number;
    total: number;
  };
}
