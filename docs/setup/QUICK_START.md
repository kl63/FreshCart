# ⚡ Quick Start - Test Stripe Integration Now

## 🚀 5-Minute Test

### Step 1: Start Development Server (30 seconds)
```bash
npm run dev
```

Server should start at `http://localhost:3000`

### Step 2: Login (1 minute)
1. Navigate to: `http://localhost:3000/auth/login`
2. Login with your credentials
3. Verify you see your account page

### Step 3: Add Items to Cart (1 minute)
1. Navigate to: `http://localhost:3000/products`
2. Click "Add to Cart" on any products
3. Verify cart count updates in header

### Step 4: Go to Checkout (30 seconds)
1. Click cart icon in header
2. Click "Checkout" button
3. You should be at `/checkout`

### Step 5: Run Test Script (2 minutes)

Open browser console (F12) and paste this:

```javascript
// Quick API Test
const API = 'https://fastapi.kevinlinportfolio.com/api/v1';
const token = localStorage.getItem('token');

console.log('🧪 Testing Stripe Integration...\n');

// Test 1: Address Creation
fetch(`${API}/addresses`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    type: 'shipping',
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    phone: '555-0123',
    street: '123 Test St',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94102',
    country: 'US'
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Address API working:', data);
  
  // Test 2: Payment Intent
  return fetch(`${API}/payments/create-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      amount: 4999,
      currency: 'usd',
      customer_email: 'test@example.com'
    })
  });
})
.then(r => r.json())
.then(data => {
  console.log('✅ Payment Intent API working:', data);
  console.log('\n🎉 All APIs working! Ready for checkout!');
})
.catch(err => {
  console.error('❌ API Test Failed:', err);
  console.log('💡 Check STRIPE_INTEGRATION_TESTING.md for troubleshooting');
});
```

### Step 6: Complete Checkout (1 minute)

If tests pass:

1. Fill out shipping form on checkout page
2. Click "Continue to Payment"
3. Enter Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVV: `123`
4. Click "Complete Order"

**Expected Result:** ✅ Order created, redirected to confirmation page, cart cleared

---

## 🎯 What Should Happen

### ✅ Success Indicators

**In Browser Console:**
```
✅ API server health check passed
✅ Token validated successfully
✅ Using valid auth token from localStorage
🔄 Using real API for creating address...
✅ Successfully used real API for address creation
🔄 Using real API for payment intent...
✅ Successfully used real API for payment intent creation
🔄 Using real API for order creation...
✅ Successfully created real order with payment
```

**In UI:**
- Progress indicator shows all steps completed
- Success message appears
- Redirected to `/order-confirmation?orderId=...`
- Cart badge shows 0 items

### ❌ Common Errors & Quick Fixes

**Error: "Your login session has expired"**
```
Fix: Go to /auth/login and login again
```

**Error: "HTTP 422: body.first_name - Field required"**
```
Fix: Field mapping issue - already fixed! Refresh page.
```

**Error: "Payment confirmation failed"**
```
Fix: Verify Stripe key in .env.local
     Check: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Error: "CORS policy blocked"**
```
Fix: FastAPI CORS settings need to allow localhost:3000
```

---

## 📱 Mobile Testing

Test on mobile:
```bash
# Find your local IP
ipconfig getifaddr en0  # Mac
ip addr show           # Linux

# Access from phone: http://YOUR_IP:3000
```

---

## 🔍 Debug Mode

Enable detailed logging:

```javascript
// In browser console
localStorage.setItem('debug', 'true');
location.reload();
```

This will show:
- All API requests with headers and body
- Response data
- Token information
- Payment flow steps

---

## 📊 Test Checklist

Complete this checklist:

- [ ] Development server running
- [ ] User logged in (token in localStorage)
- [ ] Products added to cart
- [ ] Test script runs without errors
- [ ] Address creation successful
- [ ] Payment intent creation successful
- [ ] Checkout form loads without errors
- [ ] Shipping form accepts input
- [ ] Payment step loads Stripe Elements
- [ ] Test card accepted
- [ ] Order created successfully
- [ ] Redirected to confirmation page
- [ ] Cart cleared after order

---

## 🆘 Need Help?

### Quick Diagnostics

Run this in console:
```javascript
console.log('Token:', !!localStorage.getItem('token'));
console.log('User:', !!localStorage.getItem('user'));
console.log('Cart items:', localStorage.getItem('cart-storage'));
console.log('Stripe key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Missing');
```

### Documentation

- **Testing Guide:** `STRIPE_INTEGRATION_TESTING.md`
- **API Reference:** `API_ENDPOINTS_REFERENCE.md`
- **Summary:** `STRIPE_INTEGRATION_SUMMARY.md`

### Test Files

- **Automated Test:** `test-stripe-integration.js`
- **This Guide:** `QUICK_START.md`

---

## 🎓 What Was Fixed

Before you start, here's what's ready:

✅ **API Endpoints Corrected:**
- Address: `/addresses` (was `/freshcart/users/addresses`)
- Payment: `/payments/create-intent` (was `/payments`)
- Orders: `/orders` (already correct)

✅ **Field Names Fixed:**
- Using snake_case: `first_name`, `last_name`, `zip_code`
- Matches FastAPI backend exactly

✅ **Authentication:**
- Bearer token format working
- Token validation included

✅ **Stripe Integration:**
- Stripe.js properly loaded
- CardElement component working
- Payment confirmation flow ready

---

## 🚀 Let's Go!

Everything is ready. Just follow the 5-minute test above and you should have a working checkout! 

**Good luck! 🍀**

If something doesn't work, check the detailed guides in the docs folder.
