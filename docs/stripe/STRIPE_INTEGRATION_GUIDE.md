# Stripe Checkout Implementation Guide for Frontend Developers

## Overview

This document provides implementation details for integrating our Stripe payment processing API with your frontend application. The checkout flow is designed to support both one-time payments and saved payment methods.

## Available Checkout Methods

Our application supports two different Stripe checkout methods:

### 1. Stripe Elements (Recommended)
- **Implementation**: `/app/checkout/page.tsx`
- **Features**: Custom UI, saved payment methods, client-side confirmation
- **Best for**: Full control over the checkout UI, saving cards for future use
- **Endpoints**: Uses `/orders/create-payment-intent`, `/orders/create-order-with-payment`

### 2. Stripe Checkout Sessions
- **Implementation**: `/app/checkout-stripe/page.tsx`
- **Features**: Stripe-hosted payment page, less customization but simpler integration
- **Best for**: Quick implementation, letting Stripe handle the payment UI
- **Endpoints**: Uses `/orders/create-checkout-session`, `/orders/verify-checkout-session/{id}`

> **Note**: Ensure your backend supports both approaches. The preferred method is Stripe Elements for better UX and saved payment methods support.

## API Endpoints

**Base URL**: `https://fastapi.kevinlinportfolio.com/api/v1`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/orders/create-payment-intent` | POST | Create a payment intent for a specific amount |
| `/orders/create-order-with-payment` | POST | Create an order with payment in one step |
| `/orders/confirm-payment/{order_id}` | POST | Confirm a payment after frontend processing |
| `/payment-methods/` | GET | List user's saved payment methods |
| `/payment-methods/` | POST | Save a new payment method |
| `/payment-methods/{id}/set-default` | POST | Set a payment method as default |
| `/payment-methods/{id}` | DELETE | Delete a saved payment method |

## Required Dependencies

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## Initial Setup

```javascript
// 1. Import Stripe dependencies
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement } from '@stripe/react-stripe-js';

// 2. Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51OWJ8hLu5Z15Sb32FkzCS4tv7mfZnzAEqLStBnnVqYQb7vss0ysRV4chCGTRDyspcbYuh3lYZNNSUpznlAZY8LdF00qWwRnu2i');

// 3. Wrap your checkout component with Elements provider
function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
```

## Checkout Component Implementation

```jsx
import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from '../services/api';

function CheckoutForm({ amount, currency = 'usd', metadata = {}, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [saveCard, setSaveCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch saved payment methods when component loads
  useEffect(() => {
    async function fetchPaymentMethods() {
      try {
        const response = await api.get('/payment-methods/');
        setSavedPaymentMethods(response.data);
      } catch (err) {
        console.error('Error fetching payment methods:', err);
      }
    }
    fetchPaymentMethods();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // 1. Create payment intent on the server
      const paymentIntentResponse = await api.post('/orders/create-payment-intent', {
        amount,
        currency,
        metadata
      });
      
      const { client_secret } = paymentIntentResponse.data;
      let result;

      // 2. Confirm payment with Stripe.js
      if (selectedPaymentMethod) {
        // Using saved payment method
        result = await stripe.confirmCardPayment(client_secret, {
          payment_method: selectedPaymentMethod.id
        });
      } else {
        // Using new card
        const cardElement = elements.getElement(CardElement);
        
        result = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: document.getElementById('card-holder-name').value,
            }
          },
          setup_future_usage: saveCard ? 'off_session' : undefined
        });
      }

      // 3. Handle result
      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Payment successful
        onSuccess && onSuccess(result.paymentIntent);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during payment processing');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Customer name field */}
      <div className="form-group">
        <label htmlFor="card-holder-name">Name on card</label>
        <input id="card-holder-name" className="form-control" required />
      </div>

      {/* Saved payment methods */}
      {savedPaymentMethods.length > 0 && (
        <div className="saved-payment-methods">
          <h4>Saved Payment Methods</h4>
          {savedPaymentMethods.map(method => (
            <div key={method.id} className="saved-payment-method">
              <input
                type="radio"
                id={`method-${method.id}`}
                name="paymentMethod"
                onChange={() => setSelectedPaymentMethod(method)}
              />
              <label htmlFor={`method-${method.id}`}>
                {method.card.brand} ending in {method.card.last4} (expires {method.card.exp_month}/{method.card.exp_year})
              </label>
            </div>
          ))}
          <div className="new-card-option">
            <input
              type="radio"
              id="new-card"
              name="paymentMethod"
              onChange={() => setSelectedPaymentMethod(null)}
              defaultChecked
            />
            <label htmlFor="new-card">Use a new card</label>
          </div>
        </div>
      )}

      {/* Only show card element if no saved method is selected */}
      {!selectedPaymentMethod && (
        <div className="form-group">
          <label>Card details</label>
          <CardElement 
            className="card-element" 
            options={{
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
            }}
          />
          <div className="save-card-option">
            <input
              type="checkbox"
              id="save-card"
              checked={saveCard}
              onChange={() => setSaveCard(!saveCard)}
            />
            <label htmlFor="save-card">Save this card for future purchases</label>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Submit button */}
      <button 
        type="submit" 
        className="pay-button" 
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
}
```

## Integration with Order Creation

For a complete checkout flow that includes order creation:

```javascript
async function createOrderWithPayment(shippingAddressId, billingAddressId, notes = '') {
  try {
    // 1. Create order with payment intent
    const orderResponse = await api.post('/orders/create-order-with-payment', {
      shipping_address_id: shippingAddressId,
      billing_address_id: billingAddressId,
      notes
    });
    
    const { order_id, payment_intent_id, client_secret } = orderResponse.data;
    
    // 2. Process payment with Stripe Elements
    const result = await stripe.confirmCardPayment(client_secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: document.getElementById('card-holder-name').value,
        }
      }
    });
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    // 3. Confirm payment on backend
    await api.post(`/orders/confirm-payment/${order_id}?payment_intent_id=${payment_intent_id}`);
    
    return {
      success: true,
      order_id,
      payment_intent_id
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
```

## Error Handling

Common Stripe error codes and how to handle them:

| Error Code | Description | Handling Strategy |
|------------|-------------|-------------------|
| `card_declined` | Card was declined | Show message asking for different payment method |
| `insufficient_funds` | Insufficient funds | Suggest using a different card |
| `expired_card` | Card is expired | Ask for a different card |
| `authentication_required` | 3D Secure required | Handle with 3D Secure flow |

Example error handling:

```javascript
try {
  // Payment code here
} catch (error) {
  switch(error.code) {
    case 'card_declined':
      showError('Your card was declined. Please try a different card.');
      break;
    case 'expired_card':
      showError('Your card is expired. Please try a different card.');
      break;
    // Handle other specific errors
    default:
      showError('An error occurred while processing your payment. Please try again.');
  }
}
```

## Testing

Use these test card numbers:

- Successful payment: `4242 4242 4242 4242`
- Requires authentication: `4000 0025 0000 3155`
- Payment declined: `4000 0000 0000 0002`

Use any future expiration date, any 3-digit CVC, and any postal code.

## Important Notes on Stripe Customer Integration

Our API handles several important features automatically:

1. **Customer Creation**: When saving a payment method, a Stripe Customer is automatically created
2. **Payment Method Attachment**: All saved payment methods are attached to your Stripe Customer
3. **Customer ID Passing**: When processing payments with saved methods, the Customer ID is automatically included

This prevents common Stripe errors like:
- "PaymentMethod may not be used again" errors
- "PaymentMethod belongs to a Customer" errors
- Inability to use payment methods for off-session payments

## Authentication Requirements

All API endpoints require proper authentication using a JWT token. Here's how to correctly format the authorization headers:

### Token Format

Our FastAPI backend expects the token in the following format:

```
Bearer <your_jwt_token>
```

### Example API Call with Authentication

```javascript
async function createPaymentIntent(amount, currency = 'usd', customerEmail, shippingAddress) {
  const token = localStorage.getItem('authToken');
  
  try {
    const response = await fetch(`${API_BASE_URL}/orders/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Correct format
      },
      body: JSON.stringify({
        amount,
        currency,
        customer_email: customerEmail,
        shipping_address
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Payment intent creation failed: ${errorData.detail || 'Unknown error'}`)
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}
```

### Common Authentication Errors

| Status Code | Error | Possible Cause | Solution |
|------------|-------|----------------|----------|
| 401 | Unauthorized | Missing or invalid token | Ensure token exists and is correctly formatted with 'Bearer ' prefix |
| 403 | Forbidden | Token expired or insufficient permissions | Refresh the token or check user permissions |

### Token Management

For secure token handling:

1. Store the token in localStorage or a secure cookie
2. Add the token to every API request
3. Implement token refresh logic when tokens expire
4. Clear tokens on logout

## Enhanced Token Handling and Debugging

Our implementation includes enhanced token handling with advanced debugging features to help troubleshoot authentication issues.

### Token Format Toggle

All API functions accept an optional `useRawToken` parameter that controls how the token is formatted:

```javascript
async function createPaymentIntent(data, useRawToken = false) {
  const token = getAuthToken();
  // If useRawToken is true, token is sent as-is
  // If useRawToken is false (default), token is sent with 'Bearer ' prefix
  const authHeader = useRawToken ? token : `Bearer ${token}`;
  
  // API call with proper header
  const response = await fetch(`${API_BASE_URL}/orders/create-payment-intent`, {
    headers: {
      'Authorization': authHeader,
      // other headers
    },
    // other request options
  });
}
```

### Centralized Token Retrieval

The `getAuthToken()` function centralizes token retrieval and handles common issues:

```javascript
function getAuthToken() {
  // Check for SSR environment
  if (typeof window === 'undefined') {
    console.warn('getAuthToken called in SSR environment, returning empty token');
    return '';
  }
  
  // Get token from localStorage
  const token = localStorage.getItem('authToken') || '';
  
  // Debug logging
  if (DEBUG_MODE) {
    console.log(`Token retrieved: ${token.substring(0, 10)}... (length: ${token.length})`);
    console.log(`Token starts with 'Bearer'? ${token.startsWith('Bearer')}`);
  }
  
  return token;
}
```

### Debug Logging

When `DEBUG_MODE` is enabled, all API functions log extensive information:

```javascript
if (DEBUG_MODE) {
  console.log('=== API Request Debug ===');
  console.log(`Endpoint: ${API_BASE_URL}/endpoint`);
  console.log(`Token type: ${typeof token}`);
  console.log(`Token length: ${token.length}`);
  console.log(`Token first 10 chars: ${token.substring(0, 10)}...`);
  console.log(`Authorization header: ${authHeader.substring(0, 15)}...`);
  console.log('Request headers:', headers);
  console.log('Request body:', JSON.stringify(requestBody));
}
```

### Troubleshooting 401 Unauthorized Errors

If you encounter 401 Unauthorized errors during checkout:

1. **Check Token Format**
   - Backend may expect token with or without 'Bearer ' prefix
   - Try toggling `useRawToken` parameter in the API function call

2. **Verify Token Validity**
   - Check token expiration
   - Ensure user is properly logged in
   - Try regenerating the token

3. **Enable Debug Mode**
   - Set `const DEBUG_MODE = true;` in `/lib/stripe.ts`
   - Check browser console for detailed token and request information
   - Look for clues in the log output (token format, length, etc.)

4. **Inspect Network Requests**
   - Use browser DevTools to examine request headers
   - Verify that Authorization header is correctly formatted
   - Check for any CORS issues

5. **Test with Forced Token**
   - For testing, you can temporarily force a specific token:
     ```javascript
     function getAuthToken() {
       return 'your-test-token-here';
     }
     ```

## Additional Resources

- [Stripe.js Documentation](https://stripe.com/docs/js)
- [Stripe Elements](https://stripe.com/docs/stripe-js/react)
- [Payment Intents API](https://stripe.com/docs/api/payment_intents)
- [Handle 3D Secure](https://stripe.com/docs/payments/3d-secure)
- [JWT Authentication Best Practices](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims)
