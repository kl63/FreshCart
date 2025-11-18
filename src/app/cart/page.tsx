'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const router = useRouter()
  const { cart, updateQuantity, removeItem, applyDiscountCode, removeDiscountCode } = useCartStore()
  const [discountCode, setDiscountCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleApplyDiscount = () => {
    if (discountCode.trim()) {
      applyDiscountCode(discountCode.trim())
      setDiscountCode('')
    }
  }

  // NEW CHECKOUT FLOW: Create order first, then redirect to checkout
  const handleCheckout = async () => {
    if (loading) return
    
    setLoading(true)
    setError('')

    try {
      // Check authentication
      const token = localStorage.getItem('token')
      
      if (!token) {
        setError('Please log in to continue checkout')
        router.push('/auth/login?redirect=/cart')
        return
      }

      // Validate user data exists
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        setError('Session expired. Please log in again.')
        localStorage.removeItem('token') // Clear invalid token
        router.push('/auth/login?redirect=/cart')
        return
      }

      // Parse user data
      let user
      try {
        user = JSON.parse(userStr)
        console.log('User authenticated:', user.email || user.username)
      } catch {
        setError('Invalid session. Please log in again.')
        localStorage.clear()
        router.push('/auth/login?redirect=/cart')
        return
      }

      // Validate cart
      if (!cart.items || cart.items.length === 0) {
        setError('Your cart is empty')
        setLoading(false)
        return
      }

      console.log('Creating order with', cart.items.length, 'items')
      console.log('Auth token:', token.substring(0, 20) + '...')

      // IMPORTANT: Re-sync all cart items to backend before creating order
      // This ensures backend cart matches frontend, even if user left and came back
      console.log('🔄 Re-syncing cart to backend before order creation...')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fastapi.kevinlinportfolio.com/api/v1'
      
      const syncErrors: Array<{item: string; error: unknown}> = []
      for (const item of cart.items) {
        try {
          const syncResponse = await fetch(`${apiUrl}/cart/items`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              product_id: item.product.id,
              quantity: item.quantity
            })
          })
          
          if (!syncResponse.ok) {
            const errorText = await syncResponse.text()
            console.error('❌ Failed to sync item:', item.product.name)
            console.error('   Status:', syncResponse.status)
            console.error('   Error:', errorText)
            syncErrors.push({ item: item.product.name, error: errorText })
          } else {
            console.log('✅ Synced:', item.product.name)
          }
        } catch (syncError) {
          console.error('❌ Network error syncing item:', item.product.name, syncError)
          syncErrors.push({ item: item.product.name, error: syncError })
        }
      }
      
      if (syncErrors.length > 0) {
        console.error('❌ Cart sync failed for', syncErrors.length, 'item(s)')
        setError(`Failed to sync cart items: ${syncErrors.map(e => e.item).join(', ')}. Please try again.`)
        setLoading(false)
        return
      }
      
      console.log('✅ Cart re-sync complete!')

      // Fetch user's addresses to get shipping_address_id
      console.log('📍 Fetching user addresses...')
      const addressResponse = await fetch(`${apiUrl}/addresses/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      if (!addressResponse.ok) {
        throw new Error('Failed to fetch addresses. Please add a shipping address.')
      }

      const addresses = await addressResponse.json()
      console.log('📍 Found addresses:', addresses.length)

      if (!addresses || addresses.length === 0) {
        throw new Error('No shipping address found. Please add a shipping address first.')
      }

      // Use default address or first address
      const defaultAddress = addresses.find((addr: { is_default?: boolean }) => addr.is_default) || addresses[0]
      console.log('📍 Using address:', defaultAddress.id)

      const orderUrl = `${apiUrl}/orders/`
      console.log('Order creation URL:', orderUrl)

      // Backend reads items from cart database, and needs shipping_address_id
      const orderData = {
        shipping_address_id: defaultAddress.id,
        notes: "Order created from cart"
      }
      
      console.log('Cart has', cart.items.length, 'items')
      console.log('Order request body:', JSON.stringify(orderData, null, 2))

      // Create order
      const response = await fetch(orderUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData)
        }
      )

      console.log('Order creation response status:', response.status)
      console.log('Order creation response ok:', response.ok)
      console.log('Order creation response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        // Try to get response text first
        const responseText = await response.text()
        console.error('Order creation failed - Response text:', responseText)
        
        interface ErrorResponse {
          detail?: string | Array<{loc?: string[]; msg?: string; type?: string}>;
          message?: string;
        }
        
        let errorData: ErrorResponse = {}
        try {
          errorData = responseText ? JSON.parse(responseText) : {}
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError)
          errorData = { detail: responseText || 'Unknown error' }
        }
        
        console.error('Order creation failed - Parsed error:', errorData)
        
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.')
        } else if (response.status === 404) {
          const detailStr = typeof errorData.detail === 'string' ? errorData.detail : ''
          if (detailStr.includes('User not found')) {
            throw new Error('User account not found. Please log in again.')
          } else {
            throw new Error(`Endpoint not found. Backend may not have this endpoint. Status: ${response.status}`)
          }
        } else if (response.status === 422) {
          // Validation error - show detailed info
          const validationErrors = errorData.detail || []
          if (Array.isArray(validationErrors)) {
            const errorMessages = validationErrors.map((err) => 
              `${err.loc?.join('.') || 'field'}: ${err.msg || 'validation error'}`
            ).join(', ')
            throw new Error(`Validation error: ${errorMessages}`)
          } else {
            throw new Error(`Validation error: ${errorData.detail || 'Invalid request data'}`)
          }
        } else {
          const detailStr = typeof errorData.detail === 'string' ? errorData.detail : ''
          throw new Error(
            detailStr || 
            errorData.message || 
            responseText ||
            `Failed to create order (HTTP ${response.status})`
          )
        }
      }

      const order = await response.json()
      console.log('Order created successfully:', order.id)

      if (!order.id) {
        throw new Error('Invalid order response from server')
      }

      // Redirect to NEW checkout page with order ID
      router.push(`/checkout/${order.id}`)
      
    } catch (err) {
      console.error('Checkout error:', err)
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      
      // If authentication error, clear session and redirect to login
      if (errorMessage.includes('Session expired') || 
          errorMessage.includes('User not found') ||
          errorMessage.includes('User account not found')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setError(errorMessage + ' Redirecting to login...')
        setTimeout(() => {
          router.push('/auth/login?redirect=/cart')
        }, 2000)
      } else {
        setError(errorMessage)
      }
      
      setLoading(false)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add some fresh groceries to get started!
            </p>
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/products">
                Start Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0">
                      {item.product.thumbnail && item.product.thumbnail.trim() !== '' && item.product.thumbnail.startsWith('http') ? (
                        <Image
                          src={item.product.thumbnail}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover rounded-lg"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/products/${item.product.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-green-600"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {typeof item.product.category === 'object' 
                          ? item.product.category?.name || 'Uncategorized'
                          : item.product.category || 'Uncategorized'}
                      </p>
                      {item.product.weight && (
                        <p className="text-sm text-gray-600">
                          {item.product.weight}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        {formatPrice(item.product.price)}
                      </div>
                      {item.product.original_price && item.product.is_on_sale && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatPrice(item.product.original_price)}
                        </div>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                {/* Discount Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <Button onClick={handleApplyDiscount} variant="outline">
                      Apply
                    </Button>
                  </div>
                  {cart.discountCode && (
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-green-600">
                        Code &ldquo;{cart.discountCode}&rdquo; applied
                      </span>
                      <button
                        onClick={removeDiscountCode}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Order Totals */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>
                  
                  {cart.discountAmount && cart.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(cart.discountAmount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(cart.tax)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>
                      {cart.deliveryFee === 0 ? 'FREE' : formatPrice(cart.deliveryFee)}
                    </span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(cart.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                {cart.subtotal < 35 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Add {formatPrice(35 - cart.subtotal)} more for free delivery!
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                    <button
                      onClick={() => setError('')}
                      className="text-xs text-red-600 underline mt-1"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Checkout Button - NEW FLOW */}
                <Button 
                  size="lg" 
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Creating Order...
                    </span>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </Button>

                {/* Security Badge */}
                <p className="text-xs text-gray-500 text-center mt-2">
                  🔒 Secure checkout powered by Stripe
                </p>

                {/* Continue Shopping */}
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full mt-3"
                  asChild
                >
                  <Link href="/products">
                    Continue Shopping
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
