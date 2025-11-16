# 🔗 API Endpoints Reference

## Base URL
```
Production: https://fastapi.kevinlinportfolio.com/api/v1
Local: http://localhost:8000/api/v1
```

## 📮 Address Endpoints

### Create Address
**Endpoint:** `POST /addresses`

**Request:**
```json
{
  "type": "shipping",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "555-0123",
  "street": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zip_code": "94102",
  "country": "US"
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "type": "shipping",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "555-0123",
  "street": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zip_code": "94102",
  "country": "US",
  "created_at": "2025-01-13T10:00:00Z",
  "updated_at": "2025-01-13T10:00:00Z"
}
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

---

## 💳 Payment Endpoints

### Create Payment Intent
**Endpoint:** `POST /payments/create-intent`

**Request:**
```json
{
  "amount": 4999,
  "currency": "usd",
  "customer_email": "john@example.com"
}
```

**Response:**
```json
{
  "id": "pi_xxxxxxxxxxxxx",
  "client_secret": "pi_xxxxxxxxxxxxx_secret_xxxxxxxxxxxxx",
  "amount": 4999,
  "currency": "usd",
  "status": "requires_payment_method",
  "created": 1673900000,
  "payment_method_types": ["card"]
}
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Notes:**
- Amount is in cents (4999 = $49.99)
- Use client_secret for Stripe.js payment confirmation

---

## 📦 Order Endpoints

### Create Order with Payment
**Endpoint:** `POST /orders`

**Request:**
```json
{
  "items": [
    {
      "product_id": "prod_123",
      "quantity": 2,
      "price": 1999
    },
    {
      "product_id": "prod_456",
      "quantity": 1,
      "price": 2999
    }
  ],
  "shipping_address_id": "addr_uuid",
  "payment_intent_id": "pi_xxxxxxxxxxxxx",
  "totals": {
    "subtotal": 6997,
    "tax": 560,
    "delivery_fee": 500,
    "discount": 0,
    "total": 8057
  }
}
```

**Response:**
```json
{
  "id": "order_uuid",
  "customer_id": "user_uuid",
  "shipping_address_id": "addr_uuid",
  "payment_intent_id": "pi_xxxxxxxxxxxxx",
  "status": "confirmed",
  "items": [
    {
      "id": "item_uuid",
      "product_id": "prod_123",
      "quantity": 2,
      "price": 1999
    }
  ],
  "totals": {
    "subtotal": 6997,
    "tax": 560,
    "delivery_fee": 500,
    "discount": 0,
    "total": 8057
  },
  "created_at": "2025-01-13T10:05:00Z",
  "updated_at": "2025-01-13T10:05:00Z"
}
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

---

## 🔐 Authentication

All endpoints require Bearer token authentication:

```javascript
// Get token from localStorage
const token = localStorage.getItem('token');

// Use in request headers
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## ⚠️ Common Error Responses

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```
**Solution:** Re-login to get a fresh token

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "first_name"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```
**Solution:** Check request body matches expected schema

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```
**Solution:** Verify endpoint URL and resource ID

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```
**Solution:** Check backend logs for details

---

## 🧪 Test with cURL

### Test Address Creation
```bash
curl -X POST https://fastapi.kevinlinportfolio.com/api/v1/addresses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "shipping",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "555-0123",
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zip_code": "94102",
    "country": "US"
  }'
```

### Test Payment Intent
```bash
curl -X POST https://fastapi.kevinlinportfolio.com/api/v1/payments/create-intent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 4999,
    "currency": "usd",
    "customer_email": "john@example.com"
  }'
```

### Test Order Creation
```bash
curl -X POST https://fastapi.kevinlinportfolio.com/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [
      {
        "product_id": "prod_123",
        "quantity": 1,
        "price": 4999
      }
    ],
    "shipping_address_id": "ADDR_UUID",
    "payment_intent_id": "pi_xxxxxxxxxxxxx",
    "totals": {
      "subtotal": 4999,
      "tax": 400,
      "delivery_fee": 500,
      "discount": 0,
      "total": 5899
    }
  }'
```

---

## 📝 Field Name Mapping

| Frontend (Form) | API (Backend)   | Type    |
|----------------|-----------------|---------|
| firstName      | first_name      | string  |
| lastName       | last_name       | string  |
| email          | email           | string  |
| phone          | phone           | string  |
| address        | street          | string  |
| city           | city            | string  |
| state          | state           | string  |
| zipCode        | zip_code        | string  |
| country        | country         | string  |
| isDefault      | is_default      | boolean |

---

## 🔄 Complete Checkout Flow

```
1. POST /addresses
   ↓ returns address_id
   
2. POST /payments/create-intent
   ↓ returns payment_intent_id + client_secret
   
3. [Frontend] Stripe.confirmCardPayment(client_secret)
   ↓ Stripe confirms payment
   
4. POST /orders
   → uses address_id + payment_intent_id
   ↓ returns order_id
   
5. [Frontend] Redirect to /order-confirmation?orderId={order_id}
```

---

## 💡 Quick Tips

1. **Always use Bearer token format:**
   ```javascript
   Authorization: `Bearer ${token}`
   ```

2. **Amounts in cents:**
   ```javascript
   amount: Math.round(totalDollars * 100)
   ```

3. **Use snake_case for API fields:**
   ```javascript
   first_name, not firstName
   zip_code, not zipCode
   ```

4. **Check response status:**
   ```javascript
   if (!response.ok) {
     const error = await response.json();
     console.error('API Error:', error);
   }
   ```

5. **Log everything during development:**
   ```javascript
   console.log('Request:', url, headers, body);
   console.log('Response:', status, data);
   ```
