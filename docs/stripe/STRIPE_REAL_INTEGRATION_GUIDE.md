# Real Stripe Integration Guide

## Overview

This guide explains how the real Stripe integration works in FreshCart, detailing the API endpoints, authentication requirements, and implementation patterns.

## API Endpoints

Our FastAPI backend provides the following endpoints for Stripe integration:

- **POST /api/v1/shipping-addresses/** - Creates a shipping address
- **POST /api/v1/orders/create-payment-intent** - Creates a Stripe payment intent
- **POST /api/v1/orders/create-order-with-payment** - Creates an order with payment information
- **POST /api/v1/orders/confirm-payment/{order_id}** - Confirms payment for an order
- **POST /api/v1/orders/refund/{order_id}** - Process refunds

## Checkout Flow

The checkout process follows a 3-step flow:

1. **Create Shipping Address** 
   - Send shipping details to `/api/v1/shipping-addresses/`
   - Receive address ID

2. **Create Payment Intent**
   - Send payment intent request to `/api/v1/orders/create-payment-intent`
   - Receive payment intent details from Stripe

3. **Create Order with Payment**
   - Send order details with payment intent ID to `/api/v1/orders/create-order-with-payment`
   - Order is created in the database

## Authentication

All API calls require proper authentication:

- JWT token format with Bearer prefix
- Tokens are stored in localStorage or sessionStorage
- The `getAuthToken()` function in `/lib/auth.ts` handles token retrieval

Example header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

## Testing Real Integration

To test the real Stripe integration:

1. Visit `/stripe-test-real` to check your setup
2. Ensure authentication token is valid
3. Verify API connectivity
4. Confirm Stripe publishable key is set

## Required Environment Variables

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_API_URL=https://api.freshcart.example.com/api/v1
```

## Error Handling

Stripe error responses follow this format:

```json
{
  "detail": "Error message",
  "code": "error_code"
}
```

Common error codes:
- `stripe_card_declined`
- `stripe_expired_card`
- `stripe_insufficient_funds`
- `authentication_failed`

## Debugging

If you encounter issues:

1. Check token validity using `/stripe-test-real`
2. Verify proper token formatting with Bearer prefix
3. Ensure API endpoints are accessible
4. Check browser console for detailed error logs

## Backend Integration

The backend handles all sensitive Stripe operations:
- Creating payment intents
- Processing payments
- Handling webhooks
- Storing customer payment information

The frontend only sends necessary data and displays results.
