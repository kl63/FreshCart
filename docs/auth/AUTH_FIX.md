# 🔐 Fix: "User not found" Error

## 🐛 Problem

**Error:** `User not found`

**Cause:** Your JWT token is either:
1. Expired or invalid
2. Points to a user that doesn't exist in the backend database
3. Not properly formatted

---

## ✅ Quick Fix (Try This First)

### **Option 1: Log In Again**

The easiest solution - just log in again to get a fresh token:

1. Open browser console (F12)
2. Run: `localStorage.clear()`
3. Go to http://localhost:3000/auth/login
4. Log in with your credentials
5. Try checkout again

### **Option 2: Check Your Session**

Open browser console and check:

```javascript
// Check if you have a token
localStorage.getItem('token')
// Should return a JWT token

// Check if you have user data
localStorage.getItem('user')
// Should return JSON with user info

// If either is missing, you need to log in again
```

---

## 🔍 Detailed Debugging

### **Step 1: Verify Token Exists**

Open browser console (F12):

```javascript
const token = localStorage.getItem('token')
console.log('Token:', token ? 'EXISTS' : 'MISSING')

const user = localStorage.getItem('user')
console.log('User:', user ? JSON.parse(user) : 'MISSING')
```

**Expected Output:**
```
Token: EXISTS
User: { id: "123", email: "user@example.com", ... }
```

**If Token is MISSING:**
- You're not logged in
- Go to `/auth/login` and log in

**If User is MISSING:**
- Session is corrupted
- Run `localStorage.clear()` and log in again

---

### **Step 2: Verify Token Format**

```javascript
const token = localStorage.getItem('token')
console.log('Token preview:', token.substring(0, 30) + '...')
console.log('Token parts:', token.split('.').length)
// JWT should have 3 parts (header.payload.signature)
```

**Valid JWT format:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM...
          Part 1 (header)          .  Part 2 (payload) . Part 3
```

**If token doesn't have 3 parts:**
- Token is corrupted
- Clear and log in again

---

### **Step 3: Test Backend Authentication**

Open terminal and test your backend directly:

```bash
# Get your token from browser console first
TOKEN="your_token_here"

# Test authentication
curl -X GET http://localhost:8000/api/v1/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (Good):**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "first_name": "John",
  ...
}
```

**Error Response (Bad):**
```json
{
  "detail": "User not found"
}
```

If you get "User not found":
- Your user doesn't exist in the backend database
- You need to register or use a different account

---

## 🛠️ Solutions Based on Cause

### **Cause 1: Token Expired**

**Symptoms:**
- Worked before, suddenly stopped
- Error: "Session expired"

**Fix:**
```javascript
// Clear storage
localStorage.clear()

// Go to login page
window.location.href = '/auth/login'
```

---

### **Cause 2: User Not in Database**

**Symptoms:**
- Backend returns 404
- Error specifically says "User not found"

**Fix:**

**Option A:** Register a new account
1. Go to `/auth/register`
2. Create a new account
3. Use that account for checkout

**Option B:** Check your backend database
```bash
# If using SQLite/PostgreSQL, check users table
# Make sure your user exists in the database
```

---

### **Cause 3: Wrong Backend Environment**

**Symptoms:**
- Works on one computer, not another
- Token looks valid but backend rejects it

**Fix:**

Check your `.env.local`:
```bash
# Make sure API URL matches your running backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# NOT:
# NEXT_PUBLIC_API_URL=https://fastapi.kevinlinportfolio.com/api/v1
```

**If using local backend:** Token must be from local backend
**If using production backend:** Token must be from production backend

---

## 🎯 Complete Reset (Nuclear Option)

If nothing works, do a complete reset:

```javascript
// 1. Clear everything in browser console
localStorage.clear()
sessionStorage.clear()

// 2. Restart your backend
// Stop: Ctrl+C
// Start: uvicorn main:app --reload

// 3. Restart your frontend
// Stop: Ctrl+C
// Start: npm run dev

// 4. Register a fresh account
// Go to: http://localhost:3000/auth/register
```

---

## 🧪 Test Your Fix

After fixing:

1. **Clear browser cache** (important!)
2. **Log in** to get fresh token
3. **Add items to cart**
4. **Try checkout**
5. **Check console for errors**

You should see in console:
```
User authenticated: user@example.com
Creating order with 2 items
Auth token: eyJhbGciOiJIUzI1NiIs...
Order creation response status: 201
Order created successfully: order_abc123
```

---

## 🔍 Still Not Working?

### **Check Backend Logs**

Look at your FastAPI terminal for:

```
INFO:     127.0.0.1:53XXX - "POST /api/v1/orders HTTP/1.1" 404 Not Found
```

If you see 404 with "User not found":
- Backend can't find your user in database
- Check user ID in token matches database
- Verify authentication middleware is working

### **Debug Token Contents**

```javascript
// Decode token to see what's inside (NOT FOR PRODUCTION!)
const token = localStorage.getItem('token')
const parts = token.split('.')
const payload = JSON.parse(atob(parts[1]))
console.log('Token payload:', payload)
// Look for: sub (user ID), exp (expiry), etc.
```

Check if:
- `sub` or `user_id` matches a user in your database
- `exp` (expiry) is in the future (not expired)

---

## 📋 Quick Checklist

Before trying checkout:

- [ ] Backend is running (`uvicorn main:app --reload`)
- [ ] Frontend is running (`npm run dev`)
- [ ] You're logged in (have token in localStorage)
- [ ] User data exists (have user in localStorage)
- [ ] Token is valid JWT format (3 parts separated by dots)
- [ ] User exists in backend database
- [ ] API URL in `.env.local` matches running backend

---

## 💡 Prevention

To avoid this in the future:

1. **Check token expiry** - Implement auto-refresh or show warning before expiry
2. **Better error messages** - We've added these in the latest update
3. **Auto-redirect to login** - Already implemented
4. **Session persistence** - Consider using httpOnly cookies instead of localStorage

---

**After the fix, you should see:**
```
✅ User authenticated: user@example.com
✅ Creating order...
✅ Order created successfully
✅ Redirecting to checkout...
```

**Good luck! 🚀**
