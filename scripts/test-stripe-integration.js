/**
 * Stripe Integration Test Script
 * 
 * Run this in your browser console to test the Stripe integration
 * Make sure you're on the checkout page with items in your cart
 */

const API_BASE_URL = 'https://fastapi.kevinlinportfolio.com/api/v1';

// Color codes for console output
const colors = {
  success: 'color: #22c55e; font-weight: bold',
  error: 'color: #ef4444; font-weight: bold',
  info: 'color: #3b82f6; font-weight: bold',
  warning: 'color: #f59e0b; font-weight: bold'
};

console.log('%c🚀 Starting Stripe Integration Tests', colors.info);
console.log('%c═══════════════════════════════════════', colors.info);

// Test 1: Check API Health
async function testApiHealth() {
  console.log('\n%c📡 Test 1: API Health Check', colors.info);
  try {
    const response = await fetch(`${API_BASE_URL.split('/api/v1')[0]}/health`);
    const data = await response.json();
    console.log('%c✅ API is healthy:', colors.success, data);
    return true;
  } catch (error) {
    console.log('%c❌ API health check failed:', colors.error, error.message);
    return false;
  }
}

// Test 2: Check Authentication
function testAuthentication() {
  console.log('\n%c🔐 Test 2: Authentication Check', colors.info);
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token) {
    console.log('%c❌ No authentication token found', colors.error);
    console.log('%c💡 Please log in first at /auth/login', colors.warning);
    return false;
  }
  
  console.log('%c✅ Token found:', colors.success, token.substring(0, 20) + '...');
  
  if (!user) {
    console.log('%c⚠️  No user data found', colors.warning);
  } else {
    try {
      const userData = JSON.parse(user);
      console.log('%c✅ User data:', colors.success, userData);
    } catch (e) {
      console.log('%c❌ Invalid user data in localStorage', colors.error);
    }
  }
  
  return true;
}

// Test 3: Create Test Address
async function testAddressCreation() {
  console.log('\n%c📮 Test 3: Address Creation', colors.info);
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.log('%c❌ Cannot test - no token', colors.error);
    return null;
  }
  
  const testAddress = {
    type: 'shipping',
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    phone: '555-0123',
    street: '123 Test Street',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94102',
    country: 'US'
  };
  
  console.log('%c📤 Sending address data:', colors.info, testAddress);
  
  try {
    const response = await fetch(`${API_BASE_URL}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testAddress)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.log('%c❌ Address creation failed:', colors.error, response.status, data);
      return null;
    }
    
    console.log('%c✅ Address created successfully:', colors.success, data);
    return data;
  } catch (error) {
    console.log('%c❌ Network error:', colors.error, error.message);
    return null;
  }
}

// Test 4: Create Payment Intent
async function testPaymentIntent() {
  console.log('\n%c💳 Test 4: Payment Intent Creation', colors.info);
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.log('%c❌ Cannot test - no token', colors.error);
    return null;
  }
  
  const paymentData = {
    amount: 4999, // $49.99
    currency: 'usd',
    customer_email: 'test@example.com'
  };
  
  console.log('%c📤 Sending payment intent data:', colors.info, paymentData);
  
  try {
    const response = await fetch(`${API_BASE_URL}/payments/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.log('%c❌ Payment intent creation failed:', colors.error, response.status, data);
      return null;
    }
    
    console.log('%c✅ Payment intent created:', colors.success, data);
    return data;
  } catch (error) {
    console.log('%c❌ Network error:', colors.error, error.message);
    return null;
  }
}

// Test 5: Full Integration Test
async function testFullIntegration() {
  console.log('\n%c🎯 Test 5: Full Integration Test', colors.info);
  console.log('%c═══════════════════════════════════════', colors.info);
  
  // Step 1: Health Check
  const healthOk = await testApiHealth();
  if (!healthOk) {
    console.log('%c⛔ Cannot continue - API is not available', colors.error);
    return;
  }
  
  // Step 2: Authentication
  const authOk = testAuthentication();
  if (!authOk) {
    console.log('%c⛔ Cannot continue - not authenticated', colors.error);
    return;
  }
  
  // Step 3: Address Creation
  const address = await testAddressCreation();
  if (!address) {
    console.log('%c⚠️  Address creation failed - check backend logs', colors.warning);
  }
  
  // Step 4: Payment Intent
  const paymentIntent = await testPaymentIntent();
  if (!paymentIntent) {
    console.log('%c⚠️  Payment intent creation failed - check backend logs', colors.warning);
  }
  
  // Final Summary
  console.log('\n%c📊 Test Summary', colors.info);
  console.log('%c═══════════════════════════════════════', colors.info);
  console.log('%cAPI Health:', healthOk ? '%c✅ Pass' : '%c❌ Fail', '', healthOk ? colors.success : colors.error);
  console.log('%cAuthentication:', authOk ? '%c✅ Pass' : '%c❌ Fail', '', authOk ? colors.success : colors.error);
  console.log('%cAddress Creation:', address ? '%c✅ Pass' : '%c❌ Fail', '', address ? colors.success : colors.error);
  console.log('%cPayment Intent:', paymentIntent ? '%c✅ Pass' : '%c❌ Fail', '', paymentIntent ? colors.success : colors.error);
  
  if (healthOk && authOk && address && paymentIntent) {
    console.log('\n%c🎉 All tests passed! Your Stripe integration is ready!', colors.success);
    console.log('%c✅ You can now proceed with checkout', colors.success);
  } else {
    console.log('\n%c⚠️  Some tests failed - review errors above', colors.warning);
    console.log('%c💡 Check STRIPE_INTEGRATION_TESTING.md for troubleshooting', colors.info);
  }
}

// Run all tests
testFullIntegration();

// Export functions for individual testing
window.stripeTests = {
  testApiHealth,
  testAuthentication,
  testAddressCreation,
  testPaymentIntent,
  testFullIntegration
};

console.log('\n%c💡 TIP: Run individual tests using:', colors.info);
console.log('%c   window.stripeTests.testApiHealth()', colors.info);
console.log('%c   window.stripeTests.testAuthentication()', colors.info);
console.log('%c   window.stripeTests.testAddressCreation()', colors.info);
console.log('%c   window.stripeTests.testPaymentIntent()', colors.info);
console.log('%c   window.stripeTests.testFullIntegration()', colors.info);
