# 🔍 Debugging "Failed to fetch" Error

## Error Analysis

**Error:** `TypeError: Failed to fetch`
**Location:** `createAddress` function in `stripe.ts`

This error means the browser couldn't make the network request. Common causes:

1. ❌ **CORS blocking** - Backend not allowing requests from localhost:3000
2. ❌ **API server down** - FastAPI server not running
3. ❌ **Wrong URL** - API endpoint doesn't exist
4. ❌ **Network issue** - DNS problem or firewall

---

## 🛠️ Quick Diagnostics

### Step 1: Test API Directly (30 seconds)

**In browser console:**

```javascript
// Test if API is reachable
fetch('https://fastapi.kevinlinportfolio.com/health')
  .then(r => r.json())
  .then(data => console.log('✅ API is UP:', data))
  .catch(err => console.error('❌ API is DOWN:', err));
```

**Expected:** Should return API health status
**If fails:** API server is down or unreachable

### Step 2: Test CORS (30 seconds)

```javascript
// Test CORS with authentication
const token = localStorage.getItem('token');
fetch('https://fastapi.kevinlinportfolio.com/api/v1/addresses', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'http://localhost:3000',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'content-type,authorization'
  }
})
  .then(r => {
    console.log('✅ CORS preflight passed');
    console.log('Headers:', r.headers);
  })
  .catch(err => console.error('❌ CORS issue:', err));
```

**Expected:** Response with CORS headers
**If fails:** CORS not configured on backend

### Step 3: Check Current Configuration

```javascript
// Check what URL is being used
console.log('API Base URL:', 'https://fastapi.kevinlinportfolio.com/api/v1');
console.log('Token exists:', !!localStorage.getItem('token'));
console.log('Full address endpoint:', 'https://fastapi.kevinlinportfolio.com/api/v1/addresses');
```

---

## 🔧 Solutions

### Solution 1: Fix CORS (Backend)

Your FastAPI backend needs CORS configuration:

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://your-frontend-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Solution 2: Use Local API (Temporary)

If the production API is down, switch to local:

**In `/lib/stripe.ts` line 44:**

```typescript
// Change from:
const FORCE_API = 'production' as ApiMode;

// To:
const FORCE_API = 'local' as ApiMode;
```

Then start local FastAPI server:
```bash
cd your-backend-directory
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Solution 3: Bypass CORS (Development Only)

**Option A: Chrome with CORS disabled**
```bash
# Mac
open -na "Google Chrome" --args --disable-web-security --user-data-dir=/tmp/chrome_dev

# Windows
chrome.exe --disable-web-security --user-data-dir=C:\temp\chrome_dev

# Linux
google-chrome --disable-web-security --user-data-dir=/tmp/chrome_dev
```

**⚠️ WARNING:** Only for development! Never use in production.

**Option B: Use CORS proxy (Development)**
```typescript
// Temporarily use a CORS proxy
const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const API_BASE_URL = PROXY_URL + 'https://fastapi.kevinlinportfolio.com/api/v1';
```

---

## 🧪 Test Each Solution

After applying a solution, test with:

```javascript
// Test address creation
const token = localStorage.getItem('token');
fetch('https://fastapi.kevinlinportfolio.com/api/v1/addresses', {
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
  .then(data => console.log('✅ Success:', data))
  .catch(err => console.error('❌ Failed:', err));
```

---

## 📊 Network Tab Analysis

1. Open Chrome DevTools (F12)
2. Go to "Network" tab
3. Try checkout again
4. Look for the `/addresses` request

**Check:**
- Request URL
- Request Method (should be POST)
- Status Code
- Response preview
- CORS headers in response

**Common Issues:**
- Status 0: CORS or network error
- Status 404: Wrong endpoint URL
- Status 422: Validation error (good - means API is working!)
- Status 500: Server error

---

## 🎯 Most Likely Issue

Based on your error, it's likely **CORS blocking**. The FastAPI backend needs to:

1. Allow `http://localhost:3000` origin
2. Allow POST method
3. Allow `Authorization` and `Content-Type` headers
4. Enable credentials

---

## ✅ Verify Backend is Running

Check if backend is accessible:

```bash
# Test with curl
curl https://fastapi.kevinlinportfolio.com/health

# Should return something like:
# {"status": "healthy"}
```

If this fails, the API server is not running or not accessible.

---

## 🚀 Quick Fix Checklist

- [ ] Verify API server is running and accessible
- [ ] Check CORS configuration in FastAPI backend
- [ ] Confirm origin `http://localhost:3000` is allowed
- [ ] Verify token exists in localStorage
- [ ] Check browser console for CORS errors
- [ ] Look at Network tab for request details
- [ ] Try with CORS disabled browser (development)
- [ ] Consider switching to local API temporarily

---

## 📞 Still Stuck?

If none of these work, provide:

1. Output of health check test
2. Screenshot of Network tab showing the failed request
3. Backend CORS configuration
4. Any error messages from browser console
