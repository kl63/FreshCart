/**
 * Mock Store for Stripe Integration
 * 
 * This file provides a central place to store mock data for Stripe integration
 * and makes it accessible across the application, including the main checkout flow.
 */

import { OrderResponse, PaymentIntentResponse, AddressResponse } from './stripe';

// Custom event types
declare global {
  interface WindowEventMap {
    'mock_payment_intent_created': CustomEvent;
    'mock_order_created': CustomEvent;
  }
}

// Save mock payment intent
export const saveMockPaymentIntent = (paymentIntentData: any): void => {
  if (typeof window === 'undefined') return;

  try {
    // Store in localStorage
    const existingData = localStorage.getItem('mock_payment_intents') || '[]';
    const existingIntents = JSON.parse(existingData);
    localStorage.setItem('mock_payment_intents', JSON.stringify([paymentIntentData, ...existingIntents]));
    
    // Dispatch event for any listeners
    window.dispatchEvent(new CustomEvent('mock_payment_intent_created', {
      detail: paymentIntentData
    }));
  } catch (e) {
    console.log('Could not save mock payment intent data:', e);
  }
};

// Save mock order
export const saveMockOrder = (orderData: any): void => {
  if (typeof window === 'undefined') return;

  try {
    // Store in localStorage
    const existingData = localStorage.getItem('mock_orders') || '[]';
    const existingOrders = JSON.parse(existingData);
    localStorage.setItem('mock_orders', JSON.stringify([orderData, ...existingOrders]));
    
    // Dispatch event for any listeners
    window.dispatchEvent(new CustomEvent('mock_order_created', {
      detail: orderData
    }));
  } catch (e) {
    console.log('Could not save mock order data:', e);
  }
};

// Generate a realistic-looking ID
export const generateMockId = (prefix: string): string => {
  return `${prefix}_mock_${Math.random().toString(36).substring(2, 15)}`;
};

// Force mock mode for Stripe integration
export const isMockModeEnabled = (): boolean => {
  // Always return true to force mock mode
  return true;
};

// Get mock data
export const getMockOrders = (): any[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const ordersData = localStorage.getItem('mock_orders') || '[]';
    return JSON.parse(ordersData);
  } catch (e) {
    console.error('Failed to get mock orders:', e);
    return [];
  }
};

export const getMockPaymentIntents = (): any[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const intentsData = localStorage.getItem('mock_payment_intents') || '[]';
    return JSON.parse(intentsData);
  } catch (e) {
    console.error('Failed to get mock payment intents:', e);
    return [];
  }
};

// Clear all mock data
export const clearAllMockData = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('mock_payment_intents');
    localStorage.removeItem('mock_orders');
  } catch (e) {
    console.error('Failed to clear mock data:', e);
  }
};
