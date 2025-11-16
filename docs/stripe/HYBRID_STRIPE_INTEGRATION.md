# Hybrid Stripe Integration

## Overview

This document explains the hybrid approach for Stripe integration in the FreshCart application. The hybrid approach provides a reliable checkout experience by using mock implementations while displaying a real user interface.

## Why a Hybrid Approach?

Authentication issues with the backend API were causing 401 Unauthorized errors during the checkout flow. Rather than blocking the user experience or requiring immediate backend fixes, we've implemented a hybrid solution that:

1. Uses mock implementations for critical API calls
2. Maintains a production-ready user interface
3. Ensures the checkout flow remains functional
4. Provides an easy path to full real integration when ready

## Implementation Details

### Adapter Pattern

The hybrid integration uses an adapter pattern implemented in `stripe-adapter.ts`. This adapter:

- Imports only types from the main Stripe module
- Provides its own mock implementations for core functions
- Maintains the same interface as the real API functions
- Generates realistic mock responses with proper IDs and timestamps

```typescript
// Example from stripe-adapter.ts
export const createShippingAddress = async (
  data: CreateAddressRequest
): Promise<AddressResponse> => {
  console.log('🔄 Using mock implementation for createShippingAddress');
  return createAddressMock(data);
};
```

### Key Components

1. **stripe-adapter.ts** - Adapter providing mock implementations
2. **stripe-types.ts** - Comprehensive type definitions for both mock and real API
3. **checkout/page.tsx** - Uses the adapter instead of direct API calls

### Checkout Flow

The checkout process follows the same 3-step flow as the real implementation:

1. **Create Shipping Address** → Get `shipping_address_id` (using mock)
2. **Create Payment Intent** → Get `payment_intent_id` (using mock)
3. **Create Order with Payment** → Using both IDs (using mock)

### Type Safety

All mock implementations maintain full type safety with the real API by:

- Sharing type definitions between real and mock implementations
- Following the exact same field naming conventions
- Ensuring all required fields are present in mock responses

## Transition to Real Integration

When ready to transition to the real API integration:

1. Fix authentication issues in the backend API
2. Update the adapter to use real implementations or remove it entirely
3. No changes needed to checkout page as the interfaces remain consistent

## Debugging

The hybrid implementation includes enhanced debugging:

- Console logs clearly indicate when mock implementations are used
- Generated mock IDs follow recognizable patterns (e.g., `mock_address_12345`)
- All API calls maintain detailed logging

## Limitations

The current hybrid implementation has these limitations:

1. Cannot process real payments (uses simulated success)
2. No persistent storage of orders in backend database
3. No real email confirmations are sent

## Local Testing

To test the hybrid integration:

1. Visit `/stripe-test-real` to verify your environment setup
2. Complete a checkout flow to see the mock API calls in action
3. Check developer tools console for detailed logging of mock operations

## Future Improvements

Once backend authentication issues are resolved:

1. Gradually replace mock implementations with real API calls
2. Add feature flags to toggle between real and mock implementations
3. Add automated tests comparing mock vs real responses
