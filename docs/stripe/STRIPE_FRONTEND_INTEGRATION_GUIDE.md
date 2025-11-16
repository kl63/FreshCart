# Stripe Frontend Integration Guide

This guide will walk you through integrating Stripe payment processing with your frontend application, connecting to our FastAPI backend.

## Table of Contents

1. [Authentication](#authentication)
2. [Creating Payment Intents](#creating-payment-intents)
3. [Collecting Payment Information](#collecting-payment-information)
4. [Creating an Order with Payment](#creating-an-order-with-payment)
5. [Confirming Payment](#confirming-payment)
6. [Handling Webhooks](#handling-webhooks)
7. [Handling Refunds](#handling-refunds)
8. [Complete Implementation Example](#complete-implementation-example)

## Authentication

Before making any payment-related API calls, your application must authenticate with the backend. We recommend using a centralized function to handle token retrieval for consistent authentication across all API calls.

### Login and Token Storage

```javascript
// Example using fetch API
async function login(email, password) {
  const response = await fetch('https://fastapi.kevinlinportfolio.com/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.detail || errorData.message || 'Unknown error';
    } catch {
      errorMessage = errorText || 'Login failed';
    }
    
    throw new Error(`Login failed: ${errorMessage}`);
  }
  
  const data = await response.json();
  // Store the token securely (e.g., in localStorage or secure cookie)
  localStorage.setItem('token', data.access_token);
  return data.access_token;
}
```

### Centralized Token Handling

To ensure consistent authentication across all API calls, use this centralized function:

```javascript
// Centralized function to get authentication token
export const getAuthToken = () => {
  try {
    // Check if localStorage is available (it may not be during SSR)
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token && verifyTokenFormat(token)) {
        console.log('✅ Using valid auth token from localStorage');
        return token;
      }
      
      // Try getting token from sessionStorage as fallback
      const sessionToken = sessionStorage.getItem('token');
      if (sessionToken && verifyTokenFormat(sessionToken)) {
        console.log('✅ Using valid auth token from sessionStorage');
        return sessionToken;
      }
    }
    
    // For development/testing use a valid token format that your backend accepts
    // This should match the format expected by your FastAPI backend
    const developmentToken = process.env.NEXT_PUBLIC_DEV_AUTH_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItaWQiLCJleHAiOjk5OTk5OTk5OTl9.0XEw6zJqhQxsLLcd4QicU5D-MW9jCbp16dCD9kLrXww';
    console.log('⚠️ Using development auth token');
    return developmentToken;
  } catch (error) {
    console.error('❌ Error getting auth token:', error);
    // Use a proper JWT format token for development fallback
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItaWQiLCJleHAiOjk5OTk5OTk5OTl9.0XEw6zJqhQxsLLcd4QicU5D-MW9jCbp16dCD9kLrXww';
  }
}

// Verify token format - ensures token is in correct JWT format
export const verifyTokenFormat = (token: string): boolean => {
  // Basic check: JWT tokens typically have three parts separated by dots
  // and follow a specific format (header.payload.signature)
  if (!token) {
    console.log('❌ Token is empty or undefined');
    return false;
  }
  
  if (token.split('.').length !== 3) {
    console.log('❌ Token does not have three parts separated by dots');
    return false;
  }
  
  if (token.length < 30) {
    console.log('❌ Token is too short to be valid');
    return false;
  }

  console.log('✅ Token format validation passed');
  return true;
}

// Optional: Add debug logging for authentication
const debugTokenInfo = (token, useRawToken) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('=== DEBUG: API AUTHENTICATION ===');
    console.log('Token type:', typeof token);
    console.log('Token length:', token?.length || 0);
    if (token?.length > 10) {
      console.log('Token first 10 chars:', token.substring(0, 10) + '...');
    }
    console.log('Token format:', useRawToken ? 'Raw token' : 'Bearer prefix');
    console.log('Token validation:', verifyTokenFormat(token) ? 'Valid' : 'Invalid');
  }
}
```

## Creating Payment Intents

A payment intent represents your customer's intent to pay and must be created before collecting payment information.

```javascript
async function createPaymentIntent(amount, currency = 'usd', description = 'Order payment') {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('User not authenticated');
  }
  
  const response = await fetch('https://fastapi.kevinlinportfolio.com/api/v1/orders/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      amount: amount, // amount in cents (e.g., 2999 for $29.99)
      currency: currency,
      description: description
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to create payment intent');
  }
  
  return await response.json();
}
```

## Collecting Payment Information

Once you have a payment intent, use Stripe Elements to securely collect payment information.

```html
<!-- Include Stripe.js -->
<script src="https://js.stripe.com/v3/"></script>

<!-- Payment form -->
<form id="payment-form">
  <div id="card-element"></div>
  <button id="submit-button" type="submit">Pay Now</button>
  <div id="error-message"></div>
</form>
```

```javascript
// Initialize Stripe
const stripe = Stripe('pk_test_51OWJ8hLu5Z15Sb32...'); // Your publishable key
let paymentIntentData;

// Create payment intent when needed
async function initiateCheckout(amount) {
  try {
    // Get payment intent from your backend
    paymentIntentData = await createPaymentIntent(amount);
    
    // Set up Stripe Elements
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');
    
    // Handle form submission
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', handleSubmit);
  } catch (error) {
    console.error('Checkout initialization failed:', error);
  }
}

// Handle the form submission
async function handleSubmit(event) {
  event.preventDefault();
  
  const errorElement = document.getElementById('error-message');
  errorElement.textContent = '';
  
  // Disable the submit button to prevent multiple clicks
  const submitButton = document.getElementById('submit-button');
  submitButton.disabled = true;
  
  try {
    // Confirm the payment with Stripe
    const result = await stripe.confirmCardPayment(paymentIntentData.client_secret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'Customer Name' // Get this from your form
        }
      }
    });
    
    if (result.error) {
      // Show error message
      errorElement.textContent = result.error.message;
      submitButton.disabled = false;
    } else {
      // Payment succeeded, create order on backend
      await createOrderWithPayment(result.paymentIntent.id);
    }
  } catch (error) {
    errorElement.textContent = error.message;
    submitButton.disabled = false;
  }
}
```

## Creating an Order with Payment

After successful payment confirmation, create an order in your system.

```javascript
async function createOrderWithPayment(paymentIntentId) {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('User not authenticated');
  }
  
  // Get cart items from your state management
  const cartItems = getCartItems();
  
  // Get shipping and billing addresses
  const shippingAddressId = getSelectedShippingAddress();
  const billingAddressId = getSelectedBillingAddress();
  
  const response = await fetch('https://fastapi.kevinlinportfolio.com/api/v1/orders/create-order-with-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      payment_intent_id: paymentIntentId,
      shipping_address_id: shippingAddressId,
      billing_address_id: billingAddressId,
      items: cartItems.map(item => ({
        product_id: item.productId,
        quantity: item.quantity
      }))
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to create order');
  }
  
  const orderData = await response.json();
  // Redirect to order confirmation page
  window.location.href = `/order-confirmation/${orderData.id}`;
}
```

## Confirming Payment

In some cases, you may need to confirm a payment after the order has been created:

```javascript
async function confirmPayment(orderId, paymentIntentId) {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('User not authenticated');
  }
  
  const response = await fetch(`https://fastapi.kevinlinportfolio.com/api/v1/orders/confirm-payment/${orderId}?payment_intent_id=${paymentIntentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to confirm payment');
  }
  
  return await response.json();
}
```

## Handling Webhooks

For asynchronous payment events, Stripe sends webhooks to your backend. Your frontend doesn't need to handle these directly, but should be prepared to react to state changes:

1. Set up a polling mechanism or websockets to check order status
2. Display appropriate UI based on the current order status
3. Handle success/failure scenarios gracefully

## Handling Refunds

For admin interfaces that need to process refunds:

```javascript
async function processRefund(orderId, paymentIntentId, amount, reason) {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('User not authenticated');
  }
  
  const response = await fetch(`https://fastapi.kevinlinportfolio.com/api/v1/orders/refund/${orderId}?payment_intent_id=${paymentIntentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      amount: amount, // Optional: amount in cents to refund (defaults to full amount)
      reason: reason // Optional: reason for refund
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to process refund');
  }
  
  return await response.json();
}
```

## Complete Implementation Example

Here's a complete React component example for a checkout page:

```jsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51OWJ8hLu5Z15Sb32...');

// Checkout Form Component
const CheckoutForm = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  
  // Create payment intent when component mounts
  useEffect(() => {
    const createIntent = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('https://fastapi.kevinlinportfolio.com/api/v1/orders/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            amount: amount,
            currency: 'usd',
            description: 'Purchase from My E-commerce Store'
          })
        });
        
        if (!response.ok) {
          throw new Error('Could not create payment intent');
        }
        
        const data = await response.json();
        setClientSecret(data.client_secret);
      } catch (error) {
        setErrorMessage(error.message);
        onError(error.message);
      }
    };
    
    if (amount > 0) {
      createIntent();
    }
  }, [amount, onError]);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Get shipping and billing addresses from your form or state
      const shippingAddressId = '1'; // Replace with actual ID
      const billingAddressId = '1';  // Replace with actual ID
      
      // Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Jenny Rosen', // Replace with customer name from form
          }
        }
      });
      
      if (result.error) {
        setErrorMessage(result.error.message);
        onError(result.error.message);
      } else {
        // Payment successful, create order
        const token = localStorage.getItem('authToken');
        const cartItems = []; // Get from your cart state
        
        const orderResponse = await fetch('https://fastapi.kevinlinportfolio.com/api/v1/orders/create-order-with-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            payment_intent_id: result.paymentIntent.id,
            shipping_address_id: shippingAddressId,
            billing_address_id: billingAddressId,
            items: cartItems.map(item => ({
              product_id: item.id,
              quantity: item.quantity
            }))
          })
        });
        
        if (!orderResponse.ok) {
          throw new Error('Failed to create order');
        }
        
        const orderData = await orderResponse.json();
        onSuccess(orderData);
      }
    } catch (error) {
      setErrorMessage(error.message);
      onError(error.message);
    }
    
    setIsLoading(false);
  };
  
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Card Details</label>
        <CardElement options={cardElementOptions} />
      </div>
      
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      
      <button 
        type="submit" 
        className="btn btn-primary btn-block mt-4" 
        disabled={isLoading || !stripe || !clientSecret}
      >
        {isLoading ? 'Processing...' : `Pay $${(amount/100).toFixed(2)}`}
      </button>
    </form>
  );
};

// Main Checkout Container
const CheckoutPage = () => {
  const [cartTotal, setCartTotal] = useState(0);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderData, setOrderData] = useState(null);
  
  useEffect(() => {
    // Calculate cart total - replace with your actual cart logic
    const calculateTotal = () => {
      // Example: Get cart items and calculate total
      const cartItems = []; // Get from your state or storage
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setCartTotal(Math.round(total * 100)); // Convert to cents
    };
    
    calculateTotal();
  }, []);
  
  const handlePaymentSuccess = (data) => {
    setOrderComplete(true);
    setOrderData(data);
    // Clear cart, etc.
  };
  
  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
  };
  
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h1 className="mb-4">Checkout</h1>
          
          {orderComplete ? (
            <div className="card">
              <div className="card-body">
                <h2 className="text-success">Payment Successful!</h2>
                <p>Your order #{orderData.id} has been placed.</p>
                <p>You will receive a confirmation email shortly.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.href = '/orders'}
                >
                  View Your Orders
                </button>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <h2 className="mb-4">Payment Details</h2>
                <Elements stripe={stripePromise}>
                  <CheckoutForm 
                    amount={cartTotal} 
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
```

## Important Notes

1. **Security**: Never log or store payment details on your frontend
2. **Testing**: Use Stripe test cards during development
3. **Error Handling**: Provide clear error messages to users
4. **Responsive UI**: Show loading states during API calls
5. **Validation**: Validate all inputs before submitting
6. **Confirmation**: Always confirm successful payments with backend
7. **Idempotency**: Handle duplicate submissions gracefully

For more information, refer to [Stripe's official documentation](https://stripe.com/docs).
