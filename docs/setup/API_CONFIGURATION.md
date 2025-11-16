# API Configuration Guide

Guide for configuring FreshCart to use local or production FastAPI backend.

---

## 🌐 Current Configuration

**Production Mode (Default)** ✅

All API calls now use your live FastAPI deployment:
```
https://fastapi.kevinlinportfolio.com/api/v1
```

---

## 🔧 Configuration Files

### .env.local (Environment Variables)

```bash
# Production API (Default)
NEXT_PUBLIC_API_URL=https://fastapi.kevinlinportfolio.com/api/v1

# Local development (Uncomment to use local backend)
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 🔄 Switching Between Environments

### Use Production API (Current Setup)

**.env.local:**
```bash
NEXT_PUBLIC_API_URL=https://fastapi.kevinlinportfolio.com/api/v1
```

**Result:**
- All API calls go to live production server
- No local backend needed
- Data persists across sessions

---

### Use Local Development API

**.env.local:**
```bash
# Comment out production URL
# NEXT_PUBLIC_API_URL=https://fastapi.kevinlinportfolio.com/api/v1

# Uncomment local URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

**Requirements:**
1. Start your local FastAPI backend:
   ```bash
   cd /path/to/backend
   uvicorn main:app --reload --port 8000
   ```

2. Restart Next.js dev server:
   ```bash
   npm run dev
   ```

**Result:**
- All API calls go to local backend
- Test changes locally before deploying
- Data stored in local database

---

## 📁 Files Using API Configuration

All files use `process.env.NEXT_PUBLIC_API_URL` with fallbacks:

### Frontend Components
- `src/store/cart.ts` - Cart state management
- `src/app/cart/page.tsx` - Cart page
- `src/app/auth/login/page.tsx` - Login page
- `src/app/order/[orderId]/success/page.tsx` - Order success page

### API Routes (Next.js Proxies)
- `src/app/api/products/route.ts` - Products API proxy
- `src/app/api/categories/route.ts` - Categories API proxy
- `src/app/api/orders/[orderId]/create-payment-intent/route.ts` - Payment intent proxy

### Library Files
- `src/lib/stripe.ts` - Stripe integration
- `src/lib/stripe-checkout.ts` - Checkout logic
- `src/lib/products.ts` - Product API calls
- `src/lib/categories.ts` - Category API calls

---

## 🔍 Verification

### Check Current API URL

**Browser Console:**
```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
```

**Expected Output (Production):**
```
✅ Using API URL from environment: https://fastapi.kevinlinportfolio.com/api/v1
```

### Test API Connection

**Browser Console:**
```javascript
fetch(process.env.NEXT_PUBLIC_API_URL + '/products/?page=1&limit=5')
  .then(r => r.json())
  .then(data => console.log('✅ Products:', data))
  .catch(err => console.error('❌ Error:', err))
```

---

## 🚨 Important Notes

### After Changing .env.local

**Always restart the dev server:**
```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

**Why?** Environment variables are loaded at build time, not runtime.

### CORS Issues

If you get CORS errors when using local backend:

**Backend (FastAPI) - Add CORS middleware:**
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

## 🏗️ Fallback Logic

All API calls use this pattern:

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fastapi.kevinlinportfolio.com/api/v1'
```

**Priority:**
1. `NEXT_PUBLIC_API_URL` from `.env.local`
2. Production URL (hardcoded fallback)

---

## 🔐 Authentication

JWT tokens work with both environments:
- **Production**: Tokens from production login
- **Local**: Tokens from local backend

**Tokens are NOT interchangeable** between environments!

---

## 📊 Environment Comparison

| Feature | Production | Local |
|---------|-----------|-------|
| **API URL** | `https://fastapi.kevinlinportfolio.com` | `http://localhost:8000` |
| **Database** | Production PostgreSQL | Local PostgreSQL |
| **Data** | Persistent | Development data |
| **Speed** | Network latency | Instant |
| **Best For** | Testing live features | Development & debugging |

---

## 🎯 Recommended Workflow

1. **Development**: Use local backend
2. **Testing**: Use production backend
3. **Staging**: Deploy with production URL
4. **Production**: Live with production URL

---

## 🐛 Troubleshooting

### API Calls Failing

**Check:**
1. Is `.env.local` updated?
2. Did you restart dev server?
3. Is backend running (if local)?
4. Are tokens valid for the environment?

**Debug:**
```javascript
// Browser console
console.log('Environment:', process.env.NODE_ENV)
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
```

### Wrong API Being Used

**Solution:**
1. Check `.env.local` has correct URL
2. Restart dev server
3. Clear browser cache
4. Check `src/lib/stripe.ts` - `FORCE_API` should be `''`

---

## ✅ Current Status

- ✅ Production API configured
- ✅ All files use environment variable
- ✅ Easy switching via `.env.local`
- ✅ No hardcoded production URLs
- ✅ Fallback to production by default

---

**Last Updated**: November 2024  
**Version**: 1.0.0
