/**
 * Stripe API Adapter
 * 
 * This adapter provides a hybrid approach that uses mock implementations
 * while displaying a real UI. This ensures the checkout flow works
 * even when the backend API has authentication issues.
 */

import type {
  AddressResponse,
  CreateAddressRequest,
  CreatePaymentIntentRequest,
  CreateOrderWithPaymentRequest,
  OrderResponse,
  PaymentIntentResponse
} from './stripe-types';

// Import only the types, not the actual implementations
// This prevents unused import warnings while still giving us type information

// Mock implementations are now disabled for real API integration
// These functions are kept for reference but are no longer used

/*
// Internal implementation of mock functions for development testing only
const createAddressMock = (data: CreateAddressRequest): AddressResponse => {
  console.log('🎭 Using mock address creation');
  return {
    id: 'mock_address_' + Date.now().toString(),
    type: data.type || 'shipping',
    first_name: data.firstName, // Map to snake_case for API response
    last_name: data.lastName,   // Map to snake_case for API response
    email: data.email,
    phone: data.phone,
    street: data.street,
    city: data.city,
    state: data.state,
    zip_code: data.zipCode,     // Map to snake_case for API response
    country: data.country,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

const createPaymentIntentMock = (data: CreatePaymentIntentRequest): PaymentIntentResponse => {
  console.log('🎭 Using mock payment intent creation');
  // Generate a mock payment intent ID
  const paymentIntentId = 'pi_mock_' + Math.random().toString(36).substring(2, 15);
  const clientSecret = paymentIntentId + '_secret_' + Math.random().toString(36).substring(2, 15);
  
  return {
    id: paymentIntentId,
    client_secret: clientSecret,
    amount: data.amount,
    currency: data.currency || 'usd', // Provide a default to fix type error
    status: 'succeeded',
    created: Date.now(),
    payment_method_types: ['card']
  };
};

const createOrderWithPaymentMock = (data: CreateOrderWithPaymentRequest): OrderResponse => {
  console.log('🎭 Using mock order creation');
  // Generate a mock order ID
  const orderId = 'order_mock_' + Math.random().toString(36).substring(2, 15);
  
  return {
    id: orderId,
    customer_id: 'customer_mock_' + Math.random().toString(36).substring(2, 10),
    shipping_address_id: data.shipping_address_id,
    payment_intent_id: data.payment_intent_id,
    status: 'confirmed',
    items: data.items.map(item => ({
      ...item,
      id: item.id || 'item_' + Math.random().toString(36).substring(2, 10)
    })),
    totals: data.totals,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};
*/

/**
 * Creates a shipping address
 * Can toggle between mock and real implementation 
 */
export const createShippingAddress = async (
  data: CreateAddressRequest
): Promise<AddressResponse> => {
  // Import real implementation from stripe.ts
  const { createAddress } = await import('./stripe');
  
  // Use real API only - no fallback to mock
  console.log('🔄 Using real API for creating address...');
  const response = await createAddress(data, true); // useRawToken = true
  console.log('✅ Successfully used real API for address creation');
  return response;
};

/**
 * Creates a payment intent
 * Can toggle between mock and real implementation
 */
export const createStripePaymentIntent = async (
  data: CreatePaymentIntentRequest
): Promise<PaymentIntentResponse> => {
  // Import real implementation from stripe.ts
  const { createPaymentIntent } = await import('./stripe');
  
  // Use real API only - no fallback to mock
  console.log('🔄 Using real API for payment intent...');
  const response = await createPaymentIntent(data, true); // useRawToken = true
  console.log('✅ Successfully used real API for payment intent creation');
  return response;
};

/**
 * Creates an order with payment
 * Can toggle between mock and real implementation
 */
export const createOrderWithStripePayment = async (
  data: CreateOrderWithPaymentRequest
): Promise<OrderResponse> => {
  // Import real implementation from stripe.ts
  const { createOrderWithPayment } = await import('./stripe');
  
  // Use real API only - no fallback to mock
  console.log('🔄 Using real API for order creation...');
  const response = await createOrderWithPayment(data, true); // useRawToken = true
  console.log('✅ Successfully created real order with payment:', response.id);
  return response;
};
