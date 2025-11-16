# 🚨 Backend Setup Required

## Problem

Your frontend is trying to create an order, but your backend returns **404 Not Found**:

```
POST http://localhost:8000/api/v1/orders/
Response: 404 (Not Found)
```

This means your FastAPI backend **doesn't have the orders endpoint yet**.

---

## ✅ Solution: Add Orders Endpoint to Backend

Your FastAPI backend needs to implement the orders endpoints before checkout will work.

### **Required Endpoint:**

```python
# File: backend/app/routers/orders.py (or similar)

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import uuid4

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", status_code=201)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new order for the authenticated user
    """
    try:
        # Create order in database
        new_order = Order(
            id=str(uuid4()),
            user_id=current_user.id,
            status="pending",
            subtotal=order_data.totals.subtotal,
            tax=order_data.totals.tax,
            delivery_fee=order_data.totals.delivery_fee,
            discount=order_data.totals.discount,
            total_amount=order_data.totals.total,
        )
        
        db.add(new_order)
        
        # Add order items
        for item in order_data.items:
            order_item = OrderItem(
                id=str(uuid4()),
                order_id=new_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=item.price,
            )
            db.add(order_item)
        
        db.commit()
        db.refresh(new_order)
        
        return {
            "id": new_order.id,
            "status": new_order.status,
            "total_amount": new_order.total_amount,
            "created_at": new_order.created_at,
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{order_id}/create-payment-intent")
async def create_payment_intent_for_order(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create Stripe payment intent for an existing order
    """
    import stripe
    
    # Get order
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Create Stripe payment intent
    stripe.api_key = settings.STRIPE_SECRET_KEY
    
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(order.total_amount * 100),  # Convert to cents
            currency="usd",
            metadata={
                "order_id": order.id,
                "user_id": str(current_user.id)
            }
        )
        
        # Update order with payment intent ID
        order.payment_intent_id = intent.id
        db.commit()
        
        return {
            "client_secret": intent.client_secret,
            "payment_intent_id": intent.id,
            "amount": order.total_amount,
            "currency": "usd"
        }
        
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

### **Required Models:**

```python
# File: backend/app/models/order.py

from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Integer
from sqlalchemy.sql import func
from ..database import Base

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="pending")  # pending, paid, confirmed, shipped, delivered
    
    subtotal = Column(Float, nullable=False)
    tax = Column(Float, default=0)
    delivery_fee = Column(Float, default=0)
    discount = Column(Float, default=0)
    total_amount = Column(Float, nullable=False)
    
    payment_intent_id = Column(String, nullable=True)
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())


class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(String, primary_key=True)
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    product_id = Column(String, nullable=False)
    
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    
    created_at = Column(DateTime, server_default=func.now())
```

### **Required Schemas:**

```python
# File: backend/app/schemas/order.py

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int
    price: float

class OrderTotals(BaseModel):
    subtotal: float
    tax: float
    delivery_fee: float
    discount: float
    total: float

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    status: str = "pending"
    totals: OrderTotals

class OrderResponse(BaseModel):
    id: str
    status: str
    total_amount: float
    created_at: datetime
    
    class Config:
        from_attributes = True
```

---

## 🔍 Verify Endpoint Exists

After adding the endpoint, check:

1. **Visit FastAPI docs:**
   ```
   http://localhost:8000/docs
   ```

2. **Look for:**
   - `POST /api/v1/orders/`
   - `POST /api/v1/orders/{order_id}/create-payment-intent`

3. **Test directly:**
   ```bash
   curl -X POST http://localhost:8000/api/v1/orders/ \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "items": [{"product_id": "123", "quantity": 1, "price": 10.00}],
       "status": "pending",
       "totals": {
         "subtotal": 10.00,
         "tax": 0.80,
         "delivery_fee": 0,
         "discount": 0,
         "total": 10.80
       }
     }'
   ```

---

## 📋 What Frontend Expects

Your frontend sends this request:

```
POST http://localhost:8000/api/v1/orders/

Headers:
  Authorization: Bearer eyJhbGci...
  Content-Type: application/json

Body:
{
  "items": [
    {
      "product_id": "prod_123",
      "quantity": 2,
      "price": 4.99
    }
  ],
  "status": "pending",
  "totals": {
    "subtotal": 9.98,
    "tax": 0.80,
    "delivery_fee": 0,
    "discount": 0,
    "total": 10.78
  }
}
```

**Expected Response (201 Created):**
```json
{
  "id": "order_abc123",
  "status": "pending",
  "total_amount": 10.78,
  "created_at": "2025-01-16T09:24:00Z"
}
```

---

## 🎯 Quick Check

**Is your backend setup complete?**

- [ ] Do you have `Order` and `OrderItem` models?
- [ ] Do you have `POST /api/v1/orders/` endpoint?
- [ ] Does it require authentication (`get_current_user`)?
- [ ] Does it create order in database?
- [ ] Does it return order with `id` field?

**If ANY of these are missing, the frontend won't work!**

---

## 🚀 After Setup

Once your backend has the orders endpoint:

1. Restart your FastAPI backend
2. Refresh your frontend
3. Try checkout again
4. Should work! ✨

---

## 💡 Your Authentication IS Working

The good news: Your authentication is **100% working**!

```
✅ Token exists
✅ User data exists
✅ User authenticated: lin.kevin.1923@gmail.com
✅ Creating order with 1 items
✅ Auth token valid
```

The ONLY problem is: **Backend doesn't have the orders endpoint yet.**

---

**Bottom line: Fix your backend first, then frontend will work perfectly! 🚀**
