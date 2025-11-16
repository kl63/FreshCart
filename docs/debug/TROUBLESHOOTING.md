# 🔧 Troubleshooting Guide

## "Failed to load product data" Error

### **Quick Fix:**

**1. Check which API you're using:**
```bash
# Your .env.local should have:
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# For production:
NEXT_PUBLIC_API_URL=https://fastapi.kevinlinportfolio.com/api/v1
```

**2. If using local API, start your FastAPI backend:**
```bash
cd /path/to/your/fastapi/backend
uvicorn main:app --reload
```

**3. Restart your Next.js dev server:**
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

---

## Common Issues

### **Issue: Products not loading**

**Symptoms:**
- "Failed to load product data" error
- Products page shows loading state forever
- Console error: "Failed to fetch products"

**Solutions:**

**A) Backend not running:**
```bash
# Check if your FastAPI backend is running
curl http://localhost:8000/api/v1/products/

# If it fails, start the backend:
cd /path/to/fastapi/backend
uvicorn main:app --reload
```

**B) Wrong API URL:**
Check `.env.local`:
```bash
# For local development:
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# For production:
NEXT_PUBLIC_API_URL=https://fastapi.kevinlinportfolio.com/api/v1
```

**C) CORS issues:**
Your FastAPI backend needs CORS enabled:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### **Issue: Categories not loading**

Same solutions as products - the categories API uses the same backend.

---

### **Issue: Checkout not working**

**Symptoms:**
- "Failed to create payment intent"
- 401 Unauthorized errors

**Solutions:**

**A) Check authentication:**
```javascript
// Open browser console and check:
localStorage.getItem('token')
// Should return a valid JWT token
```

**B) Verify backend endpoints exist:**
```bash
# Check if payment intent endpoint exists:
curl -X POST http://localhost:8000/api/v1/orders/ORDER_ID/create-payment-intent \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**C) Check Stripe keys:**
```bash
# .env.local should have:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

### **Issue: "Cannot read properties of undefined"**

**Symptom:**
JavaScript errors in console about undefined properties

**Solution:**
Clear your browser cache and localStorage:
```javascript
// Open browser console:
localStorage.clear()
sessionStorage.clear()
// Then refresh the page
```

---

## Debug Mode

### **Enable detailed logging:**

**1. Check browser console (F12)**
Look for:
- Red errors
- Network tab failures
- API response details

**2. Check Next.js terminal**
Look for:
```
Fetching products from: http://localhost:8000/api/v1/products/
Fetching categories from: http://localhost:8000/api/v1/categories/
```

**3. Check FastAPI logs**
Your FastAPI terminal should show incoming requests

---

## Environment Variables

Make sure `.env.local` has all required variables:

```bash
# API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51OE...

# Optional - Development tokens
NEXT_PUBLIC_DEV_AUTH_TOKEN=eyJhbGci...
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_SKIP_AUTH=false
```

---

## Still Having Issues?

### **Complete Reset:**

```bash
# 1. Stop all servers
# Press Ctrl+C in all terminal windows

# 2. Clear Next.js cache
rm -rf .next
rm -rf node_modules/.cache

# 3. Reinstall dependencies (if needed)
npm install

# 4. Start fresh
npm run dev
```

### **Check API Health:**

```bash
# Test FastAPI backend directly:
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/products/?page=1&limit=5

# Test through Next.js proxy:
curl http://localhost:3000/api/products?page=1&limit=5
```

---

## Quick Reference

**Local Development:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

**Production:**
- Frontend: Your Vercel/Netlify URL
- Backend: https://fastapi.kevinlinportfolio.com
- Products: https://fastapi.kevinlinportfolio.com/api/v1/products/

---

## Getting Help

If none of these solutions work:

1. Check browser console for specific error messages
2. Check Next.js terminal for server errors
3. Check FastAPI terminal for backend errors
4. Check network tab in browser dev tools
5. Verify all services are running

**The most common issue is forgetting to start the FastAPI backend! 🚀**
