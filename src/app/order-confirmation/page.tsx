'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { verifyCheckoutSession } from '@/lib/stripe-checkout'

interface OrderDetails {
  id: string
  created_at: string
  items: Array<{
    id: string
    product_name: string
    quantity: number
    price: number
  }>
  shipping_address: {
    first_name: string
    last_name: string
    email: string
    address_line_1: string
    city: string
    state: string
    postal_code: string
  }
  payment_intent_id: string
  status: string
  totals: {
    subtotal: number
    tax: number
    delivery_fee: number
    discount?: number
    total: number
  }
}

function OrderConfirmationContent() {
  const router = useRouter()
  const { clearCart } = useCartStore()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const orderId = searchParams.get('orderId')
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    // Make sure the cart is cleared when this page loads
    clearCart()
    
    // Process checkout completion
    const processCheckoutCompletion = async () => {
      // If we have a session_id from Stripe redirect
      if (sessionId) {
        try {
          setLoading(true)
          // Verify the session with our backend
          const sessionDetails = await verifyCheckoutSession(sessionId)
          
          // Get order details from session verification
          if (sessionDetails && sessionDetails.order_id) {
            // Format order details from session response
            const orderData = {
              id: sessionDetails.order_id,
              created_at: new Date().toISOString(),
              payment_intent_id: sessionDetails.payment_intent_id,
              status: sessionDetails.payment_status,
              // Other fields would be populated from backend
              items: [],
              shipping_address: {
                first_name: '',
                last_name: '',
                email: sessionDetails.customer_email || '',
                address_line_1: '',
                city: '',
                state: '',
                postal_code: ''
              },
              totals: {
                subtotal: 0,
                tax: 0,
                delivery_fee: 0,
                total: sessionDetails.amount_total / 100 // Stripe amounts are in cents
              }
            }
            
            // Save order to localStorage
            localStorage.setItem(`order_${orderData.id}`, JSON.stringify(orderData))
            setOrderDetails(orderData)
            
            // Clear the cart once order is confirmed
            clearCart()
          } else {
            setError('Could not retrieve order details from the verified session.')
          }
        } catch (e) {
          console.error('Error verifying checkout session:', e)
          setError('There was an error processing your order. Please contact customer support.')
        } finally {
          setLoading(false)
        }
      }
      // If we have a direct orderId (from previous checkout flow)
      else if (orderId) {
        try {
          // Fetch order details from localStorage (previous implementation)
          const savedOrder = localStorage.getItem(`order_${orderId}`)
          if (savedOrder) {
            setOrderDetails(JSON.parse(savedOrder))
          } else {
            setError('Order details not found.')
          }
        } catch (e) {
          console.error('Error retrieving order details:', e)
          setError('Could not load order information.')
        } finally {
          setLoading(false)
        }
      } else {
        // No session_id or orderId provided
        setError('No order information found.')
        setLoading(false)
      }
    }
    
    processCheckoutCompletion()
  }, [sessionId, orderId, clearCart, router])
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 md:px-0">
      {loading ? (
        <Card className="border shadow-lg p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mb-4"></div>
            <p className="text-xl font-medium">Processing your order...</p>
            <p className="text-sm text-muted-foreground mt-2">Please wait while we confirm your payment.</p>
          </div>
        </Card>
      ) : error ? (
        <Card className="border-red-200 shadow-lg">
          <CardHeader className="bg-red-50 border-b border-red-100">
            <CardTitle className="text-center flex flex-col items-center">
              <ExclamationCircleIcon className="h-16 w-16 text-red-500 mb-2" />
              <span className="text-2xl font-bold">Order Processing Issue</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <p className="text-lg">We encountered an issue with your order</p>
              <p className="text-sm text-muted-foreground mt-3">{error}</p>
            </div>
            <div className="mt-6 text-center">
              <Button asChild>
                <Link href="/cart">Return to Cart</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : orderDetails ? (
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-green-50 border-b border-green-100">
            <CardTitle className="text-center flex flex-col items-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mb-2" />
              <span className="text-2xl font-bold">Order Confirmation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <p className="text-lg">Thank you for your order!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your order has been received and is being processed.
              </p>
              <div className="mt-4">
                <span className="font-medium">Order ID:</span> <span className="font-mono">{orderDetails.id || 'Unknown'}</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Order Summary</h3>
              <div className="space-y-3">
                {orderDetails.items && orderDetails.items.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity} × {item.product_name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Order items not available</p>
                )}
                
                <div className="text-sm">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>${orderDetails.totals?.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping:</span>
                    <span>${orderDetails.totals?.delivery_fee?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Tax:</span>
                    <span>${orderDetails.totals?.tax?.toFixed(2) || '0.00'}</span>
                  </div>
                  {orderDetails.totals?.discount && orderDetails.totals.discount > 0 && (
                    <div className="flex justify-between mb-2 text-green-600">
                      <span>Discount:</span>
                      <span>-${orderDetails.totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${orderDetails.totals?.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-3 pt-2 pb-6">
            <div className="flex justify-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/account/orders">View My Orders</Link>
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
            
            <div className="text-center">
              <Button variant="link" className="text-blue-600" asChild>
                <Link href="/account/orders">View Order History</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card className="border shadow-lg">
          <CardContent className="py-8">
            <div className="text-center">
              <p>No order information found.</p>
              <Button className="mt-4" asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}
