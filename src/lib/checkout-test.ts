/**
 * Stripe Checkout Test Script
 * 
 * This script helps test the Stripe integration with real API calls
 * It can be imported and run from the browser console for testing
 */

import { createAddress, createPaymentIntent, createOrderWithPayment } from './stripe';
import { CheckoutFlowTracker, LogLevel, debugLog } from './debug-logger';

// Sample test data - matches the API requirements
const testAddress = {
  type: 'shipping',
  first_name: 'Test',
  last_name: 'Customer',
  email: 'test@example.com',
  phone: '555-555-5555',
  street: '123 Main St',
  city: 'Anytown',
  state: 'CA',
  zip_code: '94000',
  country: 'US'
};

// Sample order items
const testOrderItems = [
  {
    product_id: 'prod_test_01',
    quantity: 1,
    price: 1999
  },
  {
    product_id: 'prod_test_02',
    quantity: 2,
    price: 999
  }
];

// Order totals
const testTotals = {
  subtotal: 3997,
  tax: 320,
  delivery_fee: 500,
  discount: 0,
  total: 4817
};

// Tracker to monitor checkout flow
const checkoutTracker = new CheckoutFlowTracker();

/**
 * Directly set a valid authentication token for testing
 */
const ensureValidToken = (): string => {
  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItaWQiLCJleHAiOjk5OTk5OTk5OTl9.0XEw6zJqhQxsLLcd4QicU5D-MW9jCbp16dCD9kLrXww';
  
  // Save directly to session storage with bearer prefix
  const tokenWithPrefix = `Bearer ${validToken}`;
  sessionStorage.setItem('test_token', tokenWithPrefix);
  console.log('✅ Valid test token set for API calls:', tokenWithPrefix.substring(0, 15) + '...');
  
  return validToken;
};

/**
 * Run a complete checkout test flow
 * @param useRawToken Whether to use raw token format (without Bearer prefix)
 */
export async function testCheckoutFlow(useRawToken: boolean = false): Promise<void> {
  debugLog(LogLevel.INFO, '⭐ Starting checkout test flow', { useRawToken });
  
  // Ensure we have a valid token before starting
  ensureValidToken();
  
  try {
    // Step 1: Create shipping address
    checkoutTracker.startStep(0, { message: 'Initializing checkout test' });
    debugLog(LogLevel.INFO, 'Checkout test initialized');
    checkoutTracker.completeStep(0);
    
    // Step 2: Create shipping address
    checkoutTracker.startStep(1, testAddress);
    debugLog(LogLevel.INFO, 'Creating shipping address...');
    
    const addressResponse = await createAddress(testAddress, useRawToken);
    debugLog(LogLevel.INFO, 'Shipping address created', addressResponse);
    checkoutTracker.completeStep(1, addressResponse);
    
    // Step 3: Create payment intent
    checkoutTracker.startStep(2);
    const paymentIntentRequest = {
      amount: testTotals.total,
      currency: 'usd',
      customer_email: testAddress.email
    };
    
    debugLog(LogLevel.INFO, 'Creating payment intent...', paymentIntentRequest);
    const paymentIntent = await createPaymentIntent(paymentIntentRequest, useRawToken);
    debugLog(LogLevel.INFO, 'Payment intent created', paymentIntent);
    checkoutTracker.completeStep(2, paymentIntent);
    
    // Step 4: Process payment method (this would normally be done via Stripe Elements in UI)
    checkoutTracker.startStep(3);
    debugLog(LogLevel.INFO, 'Processing payment method... (simulated in this test)');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
    checkoutTracker.completeStep(3, { simulated: true });
    
    // Step 5: Create order with payment
    checkoutTracker.startStep(4);
    const orderRequest = {
      items: testOrderItems,
      shipping_address_id: addressResponse.id,
      payment_intent_id: paymentIntent.payment_intent_id,
      totals: testTotals
    };
    
    debugLog(LogLevel.INFO, 'Creating order with payment...', orderRequest);
    const orderResponse = await createOrderWithPayment(orderRequest, useRawToken);
    debugLog(LogLevel.INFO, 'Order created successfully', orderResponse);
    checkoutTracker.completeStep(4, orderResponse);
    
    // Step 6: Finalize order (in a real flow, this might clear cart, show confirmation, etc.)
    checkoutTracker.startStep(5);
    debugLog(LogLevel.INFO, 'Finalizing order...');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate finalization
    checkoutTracker.completeStep(5, { order_id: orderResponse.id });
    
    // Display checkout flow summary
    const summary = checkoutTracker.getSummary();
    debugLog(LogLevel.INFO, '✅ Checkout flow completed successfully!', summary);
    
    return Promise.resolve();
  } catch (error) {
    // Capture any errors during the checkout process
    debugLog(LogLevel.ERROR, '❌ Checkout flow failed', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    
    return Promise.reject(error);
  }
}

/**
 * Run checkout test with both token formats
 */
export async function runFullCheckoutTest(): Promise<void> {
  console.log('🚀 RUNNING FULL CHECKOUT TEST WITH REAL STRIPE INTEGRATION');
  console.log('This will create real charges in your Stripe account');
  
  try {
    console.log('👉 Test 1: Using Bearer token format');
    await testCheckoutFlow(false);
    
    console.log('👉 Test 2: Using raw token format');
    await testCheckoutFlow(true);
    
    console.log('✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Export a simple run function that can be called from the browser console
// To use: import { runCheckoutTest } from './lib/checkout-test' then runCheckoutTest()
export const runCheckoutTest = () => testCheckoutFlow(false);
