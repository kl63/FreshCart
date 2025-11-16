# 🚀 Stripe Integration Testing Guide

## Overview
This guide will help you test and validate the Stripe payment integration with your FastAPI backend.

## ✅ Prerequisites Checklist

### Backend Setup
- [ ] FastAPI server is running at `https://fastapi.kevinlinportfolio.com`
- [ ] Stripe secret key is configured in FastAPI environment
- [ ] The following endpoints are available:
  - `POST /api/v1/addresses` - Create shipping address
  - `POST /api/v1/payments/create-intent` - Create payment intent  
  - `POST /api/v1/orders` - Create order with payment

### Frontend Setup
- [ ] Stripe publishable key is set in `.env.local`:
  ```
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
  ```
- [ ] User is logged in (authentication token in localStorage)
- [ ] Cart has items ready for checkout

### Dependencies Installed
All Stripe dependencies are already installed:
- ✅ `@stripe/stripe-js` (v7.9.0)
- ✅ `@stripe/react-stripe-js` (v3.9.2)

## 🔍 Current Integration Status

### ✅ What's Working
1. **API Endpoint Configuration**
   - Using production API: `https://fastapi.kevinlinportfolio.com/api/v1`
   - Proper endpoint paths for address, payment intent, and order creation
   - Token authentication with Bearer format

2. **Field Mapping Fixed**
   - All interfaces use snake_case matching FastAPI backend
   - Address creation: `first_name`, `last_name`, `zip_code`, etc.
   - Payment intent: Proper amount formatting (cents)
   - Order creation: Correct item structure

3. **Stripe Components**
   - StripePaymentForm component ready with CardElement
   - Saved payment methods support
   - Payment confirmation handling

### 🔧 Recent Fixes Applied
1. ✅ Updated API endpoints:
   - `/addresses` for address creation
   - `/payments/create-intent` for payment intents
   - `/orders` for order creation

2. ✅ Fixed field name mismatches:
   - `firstName` → `first_name`
   - `lastName` → `last_name`
   - `zipCode` → `zip_code`
   - `isDefault` → `is_default`

3. ✅ Authentication handling:
   - Centralized token retrieval
   - Bearer token format for API calls
   - Development token fallback

## 🧪 Testing Procedures

### Step 1: Verify API Connectivity

Open browser console and test API health:

```javascript
// Test API availability
const API_URL = 'https://fastapi.kevinlinportfolio.com';
fetch(`${API_URL}/health`)
  .then(r => r.json())
  .then(data => console.log('✅ API Health:', data))
  .catch(err => console.error('❌ API Error:', err));
```

### Step 2: Test Authentication

```javascript
// Check if user is authenticated
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
console.log('Token exists:', !!token);
console.log('User data:', JSON.parse(user || '{}'));
```

If not authenticated, log in first:
1. Navigate to `/auth/login`
2. Log in with valid credentials
3. Verify token is stored in localStorage

### Step 3: Test Address Creation

```javascript
// Test address endpoint
const token = localStorage.getItem('token');
const testAddress = {
  type: 'shipping',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone: '555-0123',
  street: '123 Main St',
  city: 'San Francisco',
  state: 'CA',
  zip_code: '94102',
  country: 'US'
};

fetch('https://fastapi.kevinlinportfolio.com/api/v1/addresses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(testAddress)
})
  .then(r => r.json())
  .then(data => console.log('✅ Address Created:', data))
  .catch(err => console.error('❌ Address Error:', err));
```

**Expected Response:**
```json
{
  "id": "uuid-string",
  "type": "shipping",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "555-0123",
  "street": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zip_code": "94102",
  "country": "US",
  "created_at": "2025-01-13T...",
  "updated_at": "2025-01-13T..."
}
```

### Step 4: Test Payment Intent Creation

```javascript
// Test payment intent endpoint
const token = localStorage.getItem('token');
const paymentData = {
  amount: 4999, // $49.99 in cents
  currency: 'usd',
  customer_email: 'john@example.com'
};

fetch('https://fastapi.kevinlinportfolio.com/api/v1/payments/create-intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(paymentData)
})
  .then(r => r.json())
  .then(data => console.log('✅ Payment Intent:', data))
  .catch(err => console.error('❌ Payment Error:', err));
```

**Expected Response:**
```json
{
  "id": "pi_xxxxxxxxxxxxx",
  "client_secret": "pi_xxxxxxxxxxxxx_secret_xxxxxxxxxxxxx",
  "amount": 4999,
  "currency": "usd",
  "status": "requires_payment_method",
  "created": 1673900000,
  "payment_method_types": ["card"]
}
```

### Step 5: Test Full Checkout Flow

1. **Add items to cart:**
   ```javascript
   // Navigate to products and add items to cart
   // Verify cart count in header updates
   ```

2. **Go to checkout:**
   ```javascript
   window.location.href = '/checkout';
   ```

3. **Fill shipping form:**
   - Enter first name, last name
   - Enter email and phone
   - Enter complete address
   - Click "Continue to Payment"

4. **Enter payment details:**
   - Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/25`)
   - CVV: Any 3 digits (e.g., `123`)
   - Click "Complete Order"

5. **Verify order creation:**
   - Check browser console for success messages
   - Should redirect to order confirmation page
   - Cart should be cleared

### Step 6: Monitor Console Logs

Watch for these key log messages:

✅ **Success Indicators:**
```
✅ API server health check passed
✅ Token validated successfully
✅ Using valid auth token from localStorage
🔄 Using real API for creating address...
✅ Successfully used real API for address creation
🔄 Using real API for payment intent...
✅ Successfully used real API for payment intent creation
🔄 Using real API for order creation...
✅ Successfully created real order with payment: order_xxxxx
```

❌ **Error Indicators:**
```
❌ Token validation failed
🔴 API server health check failed
HTTP 401: Unauthorized
HTTP 422: Validation error
```

## 🐛 Troubleshooting

### Issue 1: 401 Unauthorized Error

**Symptoms:**
```
HTTP 401: Unauthorized
```

**Solutions:**
1. Verify token exists in localStorage:
   ```javascript
   console.log(localStorage.getItem('token'));
   ```

2. Check token format (should be JWT):
   ```javascript
   const token = localStorage.getItem('token');
   console.log('Token parts:', token?.split('.').length); // Should be 3
   ```

3. Re-login:
   - Navigate to `/auth/login`
   - Log in again
   - Retry checkout

### Issue 2: 422 Validation Error

**Symptoms:**
```
HTTP 422: body.field_name - Field required
```

**Solutions:**
1. Check the error details in console
2. Verify all required fields are included
3. Common missing fields:
   - `type` in address creation
   - `amount` in payment intent
   - `shipping_address_id` in order creation

### Issue 3: CORS Error

**Symptoms:**
```
Access to fetch at '...' has been blocked by CORS policy
```

**Solutions:**
1. Verify FastAPI CORS settings allow your frontend origin
2. Check if API server is running
3. Ensure HTTPS is used for production

### Issue 4: Payment Confirmation Fails

**Symptoms:**
- Payment intent created but confirmation fails
- Error: "Your card was declined"

**Solutions:**
1. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Auth required: `4000 0025 0000 3155`

2. Check client_secret is valid:
   ```javascript
   console.log('Client Secret:', clientSecret);
   // Should start with "pi_" and contain "_secret_"
   ```

3. Verify Stripe publishable key in `.env.local`

## 📊 Expected Data Flow

### Complete Checkout Flow

```
1. User fills shipping form
   ↓
2. Frontend creates address via POST /addresses
   ← Backend returns address_id
   ↓
3. Frontend creates payment intent via POST /payments/create-intent
   ← Backend returns payment_intent_id + client_secret
   ↓
4. User enters card details in Stripe Elements
   ↓
5. Frontend confirms card payment with Stripe
   ← Stripe confirms payment
   ↓
6. Frontend creates order via POST /orders
   - Sends: items, shipping_address_id, payment_intent_id, totals
   ← Backend creates order and returns order_id
   ↓
7. Frontend redirects to confirmation page
   ↓
8. Cart is cleared
```

## 🎯 Success Criteria

Your Stripe integration is working correctly if:

- [ ] ✅ User can complete checkout without errors
- [ ] ✅ Address is created and saved in database
- [ ] ✅ Payment intent is created successfully
- [ ] ✅ Card payment is confirmed by Stripe
- [ ] ✅ Order is created with correct details
- [ ] ✅ Cart is cleared after successful order
- [ ] ✅ User is redirected to confirmation page
- [ ] ✅ No console errors during checkout flow

## 🔐 Security Notes

### Production Checklist

Before going to production:

1. **Environment Variables:**
   - [ ] Use production Stripe keys
   - [ ] Secure API endpoints with HTTPS
   - [ ] Remove test tokens from code

2. **Backend Security:**
   - [ ] Verify webhook signatures
   - [ ] Implement rate limiting
   - [ ] Add proper CORS restrictions
   - [ ] Log all payment transactions

3. **Frontend Security:**
   - [ ] Never expose secret keys
   - [ ] Use Stripe Elements for card input
   - [ ] Implement proper error handling
   - [ ] Add CSRF protection

## 📝 Next Steps

1. **Test with real Stripe account:**
   - Switch to production keys
   - Process small test transactions
   - Verify webhook handling

2. **Add order management:**
   - View order history
   - Track order status
   - Handle refunds

3. **Enhance user experience:**
   - Add loading states
   - Improve error messages
   - Add payment confirmation emails
   - Implement order tracking

## 🆘 Getting Help

If you encounter issues:

1. **Check browser console** for detailed error messages
2. **Check FastAPI logs** for backend errors
3. **Review Stripe dashboard** for payment logs
4. **Verify API endpoints** match between frontend and backend
5. **Test each step individually** to isolate the problem

## 📚 Additional Resources

- [Stripe Testing Cards](https://stripe.com/docs/testing)
- [Stripe Elements Documentation](https://stripe.com/docs/stripe-js)
- [FastAPI CORS Configuration](https://fastapi.tiangolo.com/tutorial/cors/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
