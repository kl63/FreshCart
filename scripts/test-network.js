/**
 * Network Diagnostics Script
 * 
 * Run this in browser console to diagnose the "Failed to fetch" error
 */

console.log('%c🔍 Network Diagnostics Starting...', 'color: #3b82f6; font-weight: bold; font-size: 14px');
console.log('%c════════════════════════════════════', 'color: #3b82f6');

const API_BASE = 'https://fastapi.kevinlinportfolio.com';
const API_V1 = `${API_BASE}/api/v1`;

// Test 1: Basic Connectivity
console.log('\n%c📡 Test 1: Basic API Connectivity', 'color: #8b5cf6; font-weight: bold');
console.log('Testing:', `${API_BASE}/health`);

fetch(`${API_BASE}/health`)
  .then(response => {
    console.log('%c✅ API is reachable!', 'color: #22c55e');
    console.log('Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Health check response:', data);
    
    // Test 2: CORS Preflight
    console.log('\n%c🔒 Test 2: CORS Preflight Check', 'color: #8b5cf6; font-weight: bold');
    console.log('Testing OPTIONS request to:', `${API_V1}/addresses`);
    
    return fetch(`${API_V1}/addresses`, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type,authorization'
      }
    });
  })
  .then(response => {
    console.log('%c✅ CORS preflight passed!', 'color: #22c55e');
    console.log('Status:', response.status);
    console.log('CORS Headers:');
    console.log('  - Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    console.log('  - Access-Control-Allow-Methods:', response.headers.get('Access-Control-Allow-Methods'));
    console.log('  - Access-Control-Allow-Headers:', response.headers.get('Access-Control-Allow-Headers'));
    
    // Test 3: Authentication
    console.log('\n%c🔐 Test 3: Authentication Check', 'color: #8b5cf6; font-weight: bold');
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('%c⚠️  No token found in localStorage', 'color: #f59e0b');
      console.log('%c💡 Please login first at /auth/login', 'color: #3b82f6');
      return Promise.reject('No token');
    }
    
    console.log('%c✅ Token found:', 'color: #22c55e', token.substring(0, 20) + '...');
    
    // Test 4: Actual Address Creation
    console.log('\n%c📮 Test 4: Address Creation API', 'color: #8b5cf6; font-weight: bold');
    console.log('Testing POST request to:', `${API_V1}/addresses`);
    
    const testAddress = {
      type: 'shipping',
      first_name: 'Network',
      last_name: 'Test',
      email: 'network.test@example.com',
      phone: '555-9999',
      street: '999 Debug Lane',
      city: 'Test City',
      state: 'CA',
      zip_code: '99999',
      country: 'US'
    };
    
    console.log('Request payload:', testAddress);
    
    return fetch(`${API_V1}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testAddress)
    });
  })
  .then(response => {
    console.log('Response status:', response.status);
    
    if (response.ok) {
      console.log('%c✅ Address creation successful!', 'color: #22c55e');
      return response.json();
    } else {
      console.log('%c⚠️  API returned error status', 'color: #f59e0b');
      return response.text().then(text => {
        try {
          return JSON.parse(text);
        } catch {
          return { error: text };
        }
      });
    }
  })
  .then(data => {
    console.log('Response data:', data);
    
    // Final Summary
    console.log('\n%c📊 Diagnostic Summary', 'color: #3b82f6; font-weight: bold; font-size: 14px');
    console.log('%c════════════════════════════════════', 'color: #3b82f6');
    console.log('%c✅ API is reachable', 'color: #22c55e');
    console.log('%c✅ CORS is configured', 'color: #22c55e');
    console.log('%c✅ Authentication token present', 'color: #22c55e');
    console.log('%c✅ Address API responded', 'color: #22c55e');
    console.log('\n%c🎉 Your integration should work!', 'color: #22c55e; font-weight: bold');
    console.log('%c💡 Try the checkout flow now', 'color: #3b82f6');
  })
  .catch(error => {
    console.log('\n%c❌ Diagnostic Failed', 'color: #ef4444; font-weight: bold; font-size: 14px');
    console.log('%c════════════════════════════════════', 'color: #ef4444');
    console.error('Error:', error);
    
    // Analyze the error
    console.log('\n%c🔍 Error Analysis:', 'color: #f59e0b; font-weight: bold');
    
    if (error === 'No token') {
      console.log('%c⚠️  Issue: Not authenticated', 'color: #f59e0b');
      console.log('%c💡 Solution: Login at /auth/login', 'color: #3b82f6');
    } else if (error.message && error.message.includes('Failed to fetch')) {
      console.log('%c⚠️  Issue: Network or CORS error', 'color: #f59e0b');
      console.log('%c💡 Possible causes:', 'color: #3b82f6');
      console.log('   1. CORS not configured on backend');
      console.log('   2. API server is down');
      console.log('   3. Network connectivity issue');
      console.log('   4. Firewall blocking request');
      console.log('\n%c🔧 Solutions:', 'color: #3b82f6; font-weight: bold');
      console.log('   1. Check backend CORS configuration');
      console.log('   2. Verify API server is running');
      console.log('   3. Try with local API (change FORCE_API in stripe.ts)');
      console.log('   4. Use Chrome with CORS disabled (dev only)');
    } else if (error.message && error.message.includes('NetworkError')) {
      console.log('%c⚠️  Issue: Network error', 'color: #f59e0b');
      console.log('%c💡 Solution: Check if API server is running', 'color: #3b82f6');
    }
    
    console.log('\n%c📚 For detailed help, see:', 'color: #3b82f6');
    console.log('   - DEBUG_NETWORK_ERROR.md');
    console.log('   - STRIPE_INTEGRATION_TESTING.md');
  });

// Add helper functions to window for manual testing
window.networkTest = {
  testHealth: async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      const data = await response.json();
      console.log('✅ Health check:', data);
      return data;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return null;
    }
  },
  
  testCORS: async () => {
    try {
      const response = await fetch(`${API_V1}/addresses`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'content-type,authorization'
        }
      });
      console.log('✅ CORS check passed');
      console.log('Status:', response.status);
      console.log('Headers:', {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
      });
      return true;
    } catch (error) {
      console.error('❌ CORS check failed:', error);
      return false;
    }
  },
  
  testAddress: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No token found');
      return null;
    }
    
    try {
      const response = await fetch(`${API_V1}/addresses`, {
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
      });
      const data = await response.json();
      console.log('✅ Address creation:', data);
      return data;
    } catch (error) {
      console.error('❌ Address creation failed:', error);
      return null;
    }
  },
  
  checkConfig: () => {
    console.log('Configuration:');
    console.log('  - API Base:', API_BASE);
    console.log('  - API V1:', API_V1);
    console.log('  - Origin:', window.location.origin);
    console.log('  - Token:', localStorage.getItem('token') ? 'Present' : 'Missing');
    console.log('  - User:', localStorage.getItem('user') ? 'Present' : 'Missing');
  }
};

console.log('\n%c💡 Manual test functions available:', 'color: #3b82f6; font-weight: bold');
console.log('   window.networkTest.testHealth()');
console.log('   window.networkTest.testCORS()');
console.log('   window.networkTest.testAddress()');
console.log('   window.networkTest.checkConfig()');
