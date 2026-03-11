# Debug Cart Sync Issue

## Problem
Cart sync is getting 400 Bad Request from production API when trying to add items to cart.

## Steps to Debug

### 1. Check Console for Error Details

When you try to checkout, look for:
```
❌ Failed to sync item: [Product Name]
   Status: 400
   Error: [Actual backend error message]
```

### 2. Common 400 Errors

**Invalid Product ID Format:**
```json
{"detail": "Invalid product_id format"}
```
**Solution:** Backend expects UUID string, frontend might be sending wrong format

**Product Not Found:**
```json
{"detail": "Product not found"}
```
**Solution:** Product doesn't exist in production database

**Validation Error:**
```json
{"detail": [{"loc": ["body", "product_id"], "msg": "field required"}]}
```
**Solution:** Missing required field

**Quantity Invalid:**
```json
{"detail": "Quantity must be positive"}
```
**Solution:** Check quantity value

### 3. Test Cart API Directly

**Browser Console:**
```javascript
const token = localStorage.getItem('token')
const productId = 'YOUR_PRODUCT_ID' // Get from cart items

fetch('https://fastapi.kevinlinportfolio.com/api/v1/cart/items', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    product_id: productId,
    quantity: 1
  })
})
.then(r => r.text())
.then(text => {
  console.log('Response:', text)
  try {
    const json = JSON.parse(text)
    console.log('Parsed:', json)
  } catch(e) {
    console.log('Not JSON:', text)
  }
})
.catch(err => console.error('Error:', err))
```

### 4. Check Product ID Format

**Browser Console:**
```javascript
const cart = JSON.parse(localStorage.getItem('freshcart-cart'))
console.log('Cart items:', cart.state.cart.items)
console.log('Product IDs:', cart.state.cart.items.map(i => ({
  name: i.product.name,
  id: i.product.id,
  type: typeof i.product.id
})))
```

**Expected:**
- ID should be a UUID string like `"6d24bd4a-d613-4b24-8dc0-ffa923c467c9"`
- Type should be `"string"`

### 5. Check if Products Exist in Production

```javascript
const token = localStorage.getItem('token')
const productId = 'YOUR_PRODUCT_ID'

fetch(`https://fastapi.kevinlinportfolio.com/api/v1/products/${productId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => console.log('Product exists:', data))
.catch(err => console.error('Product not found:', err))
```

## Common Solutions

### Solution 1: Product Doesn't Exist in Production
If the product is only in local database:
1. Add product to production database
2. Or clear cart and add products that exist in production

### Solution 2: Wrong API URL
Check .env.local:
```bash
NEXT_PUBLIC_API_URL=https://fastapi.kevinlinportfolio.com/api/v1
```

### Solution 3: Token Invalid for Production
Production and local tokens are different:
1. Logout
2. Login again to get production token
3. Try checkout again

### Solution 4: Backend CORS Issue
Check backend FastAPI has CORS middleware for your frontend domain.

## Next Steps

1. Run the debug commands above
2. Share the actual error message
3. We'll fix based on the specific error

---

**Last Updated**: November 2024
