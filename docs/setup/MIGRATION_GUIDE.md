# 🔄 Migration Guide: Old → New Stripe Integration

## 📊 What Changed?

### **Old Implementation** ❌
- Complex `/app/checkout/page.tsx` with mixed mock/real API calls
- Manual address creation and payment intent in checkout page
- Lots of debugging code and validation logic
- Cart clearing logic in checkout page
- No dedicated order ID route

### **New Implementation** ✅
- Clean `/app/checkout/[orderId]/page.tsx` route structure
- Order is created **before** checkout
- Stripe handles payment confirmation
- Automatic redirect to success page
- Proper separation of concerns

---

## 🛠️ How to Migrate Your Cart Page

### **Old Flow:**
```
Cart → Checkout Page → Fill Forms → Create Order + Payment → Success
```

### **New Flow:**
```
Cart → Create Order → Checkout Page (with order ID) → Pay → Success
```

---

## 📝 Update Your Cart Page

Find your cart page (likely `/app/cart/page.tsx`) and update the checkout button:

### **Before:**
```typescript
const handleCheckout = () => {
  router.push('/checkout');
};
```

### **After:**
```typescript
const handleCheckout = async () => {
  setLoading(true);
  setError('');
  
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/auth/login?redirect=/cart');
      return;
    }

    // Create order first
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          })),
          // status will be "pending" until payment completes
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create order');
    }

    const order = await response.json();
    
    // Redirect to checkout with order ID
    router.push(`/checkout/${order.id}`);
    
  } catch (error) {
    console.error('Checkout error:', error);
    setError(error instanceof Error ? error.message : 'Failed to start checkout');
  } finally {
    setLoading(false);
  }
};
```

---

## 🗑️ Clean Up Old Files (Optional)

You can safely delete or archive these files:

- `/app/checkout/page.tsx` (old checkout page)
- `/components/stripe/StripePaymentForm.tsx` (if not used elsewhere)
- `/lib/stripe-adapter.ts` (adapter layer no longer needed)
- `/lib/stripe-checkout.ts` (old checkout logic)
- `/lib/stripe-fixed.ts` (old implementation backup)
- `/lib/stripe.ts.bak` (backup file)
- `/lib/stripe.ts.new` (backup file)

**Important:** Keep `/lib/stripe.ts` - we updated it with the new implementation!

---

## 🔧 Backend Endpoint Required

Make sure your FastAPI backend has this endpoint:

```python
@router.post("/orders/{order_id}/create-payment-intent")
async def create_payment_intent_for_order(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a Stripe payment intent for an existing order
    """
    # 1. Get order from database
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # 2. Create Stripe payment intent
    import stripe
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
        
        # 3. Update order with payment intent ID
        order.payment_intent_id = intent.id
        db.commit()
        
        # 4. Return payment intent details
        return {
            "client_secret": intent.client_secret,
            "payment_intent_id": intent.id,
            "amount": order.total_amount,
            "currency": "usd"
        }
        
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

---

## ✅ Checklist for Migration

- [ ] Update cart page to create order before checkout
- [ ] Test creating order from cart
- [ ] Test redirect to `/checkout/[orderId]`
- [ ] Verify payment intent creation endpoint works
- [ ] Test payment with test card `4242 4242 4242 4242`
- [ ] Verify redirect to success page
- [ ] Test error handling (declined cards, etc.)
- [ ] Set up webhook for order confirmation
- [ ] Clear cart after successful payment (on success page or via webhook)
- [ ] Clean up old files (optional)

---

## 🎯 Key Benefits of New Approach

1. **Cleaner Code** - Separation of concerns
2. **Better UX** - Order is created upfront, no loss if payment fails
3. **Easier Debugging** - Clear order ID for tracking
4. **Stripe Best Practices** - Follows official Stripe guides
5. **Mobile Friendly** - Responsive by default
6. **Production Ready** - Minimal, focused implementation

---

## 🐛 Common Issues

### **"Order not found" error**
- Make sure order creation endpoint returns order with `id` field
- Check that order ID is being passed correctly in URL

### **Payment intent creation fails**
- Verify Stripe secret key in backend
- Check order.total_amount is a valid number
- Ensure order exists in database

### **Cart not clearing after payment**
- Use webhook to clear cart when payment succeeds
- Or clear cart on success page load

---

## 📞 Need Help?

If you encounter issues during migration:

1. Check browser console for errors
2. Check FastAPI logs for backend errors
3. Verify all environment variables are set
4. Test with Stripe CLI in development
5. Review Stripe Dashboard for payment events

**You're ready to go! 🚀**
