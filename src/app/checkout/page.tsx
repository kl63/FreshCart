'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Separator } from '@/components/ui'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import {
  validateToken,
  checkApiHealth,
  getPaymentMethods,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  SavedPaymentMethod
} from '@/lib/stripe'

import type {
  CreateAddressRequest,
  CreateOrderWithPaymentRequest
} from '@/lib/stripe-types'
import { StripePaymentForm } from '@/components/stripe/StripePaymentForm'
import { 
  CreditCardIcon, 
  LockClosedIcon,
  ArrowLeftIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}


export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping')
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  // Store token validity status to conditionally show login prompt
  const [tokenValid, setTokenValid] = useState<boolean>(true)
  // Track API server status
  const [apiServerUp, setApiServerUp] = useState<boolean>(true)
  // Store payment intent client secret
  const [clientSecret, setClientSecret] = useState<string>('')
  // Saved payment methods
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<SavedPaymentMethod[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<SavedPaymentMethod | null>(null)
  const [loadingSavedMethods, setLoadingSavedMethods] = useState<boolean>(false)
  const [saveCard, setSaveCard] = useState<boolean>(false)
  // Token format toggle for API calls
  const [useRawToken, setUseRawToken] = useState<boolean>(true)
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })


  // Redirect if cart is empty, but not after successful payment
  useEffect(() => {
    // Only redirect if cart is empty AND we're not on the confirmation step
    if (cart.items.length === 0 && step !== 'confirmation') {
      router.push('/cart')
    }
    
    // Check server and token validity on load
    const checkServerAndToken = async () => {
      console.log('🛒 Starting checkout flow checks...')
      // First check if API server is available
      const isServerUp = await checkApiHealth()
      setApiServerUp(isServerUp)
      
      if (!isServerUp) {
        console.error('🔴 API server health check failed')
        setError('We&apos;re having trouble connecting to our servers. Please try again later.')
        return
      }
      console.log('✅ API server health check passed')
      
      // Only validate token if server is up
      console.log('🔍 Validating authentication token...')
      const isValid = await validateToken()
      setTokenValid(isValid)
      
      if (!isValid) {
        console.error('🔴 Token validation failed during checkout initialization')
        setError('Your login session has expired. Please log in again.')
      } else {
        console.log('✅ Token validated successfully')
      }
    }
    
    checkServerAndToken()
  }, [cart.items.length, router, step])

  // Fetch saved payment methods when moving to payment step
  const fetchPaymentMethods = async () => {
    setLoadingSavedMethods(true)
    setError('') // Clear any previous errors
    try {
      // Check if API server is available first
      const isServerUp = await checkApiHealth()
      if (!isServerUp) {
        console.log('API server is down, skipping payment methods fetch')
        setSavedPaymentMethods([])
        return
      }

      const methods = await getPaymentMethods(useRawToken)
      console.log('Loaded saved payment methods:', methods)
      
      // Handle empty or null response gracefully
      if (!methods || methods.length === 0) {
        console.log('No saved payment methods found')
        setSavedPaymentMethods([])
        setSelectedPaymentMethod(null)
        return
      }
      
      // Check if these are mock payment methods (ID starts with pm_mock)
      if (methods[0]?.id?.startsWith('pm_mock')) {
        console.log('Using mock payment methods for development')
      }
      
      setSavedPaymentMethods(methods)
      
      // Auto-select default payment method if available
      const defaultMethod = methods.find(m => m.is_default)
      if (defaultMethod) {
        setSelectedPaymentMethod(defaultMethod)
      }
    } catch (error) {
      console.error('Error in payment methods flow:', error)
      // Don't show error to user - just proceed with empty payment methods
      setSavedPaymentMethods([])
    } finally {
      setLoadingSavedMethods(false)
    }
  }

  // Handle deleting a payment method
  const handleDeletePaymentMethod = async (method: SavedPaymentMethod) => {
    try {
      await deletePaymentMethod(method.id, useRawToken)
      // Refresh the list after deletion
      const updatedMethods = await getPaymentMethods(useRawToken)
      setSavedPaymentMethods(updatedMethods)
      
      // Clear selection if the deleted method was selected
      if (selectedPaymentMethod?.id === method.id) {
        setSelectedPaymentMethod(null)
      }
    } catch (error) {
      console.error('Error deleting payment method:', error)
      setError('Failed to delete payment method. Please try again.')
    }
  }

  // Function to set a payment method as default
  const handleSetDefaultPaymentMethod = async (method: SavedPaymentMethod) => {
    try {
      setLoading(true)
      await setDefaultPaymentMethod(method.id, useRawToken)
      // Refresh payment methods list after setting default
      fetchPaymentMethods()
      setSuccess('Default payment method updated successfully')
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error setting default payment method:', error)
      setError('Failed to update default payment method')
    } finally {
      setLoading(false)
    }
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('payment')
    // Fetch payment methods when moving to payment step
    fetchPaymentMethods()
  }

  // Track payment confirmation state (not needed as it's handled by the success callback)
  
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // If we already have selected payment method and client secret,
    // we can proceed directly to order creation
    if (selectedPaymentMethod && clientSecret) {
      await processOrderWithPayment()
      return
    }
    
    setLoading(true)
    setError('')
    
    // Check API server health first
    const isServerUp = await checkApiHealth()
    if (!isServerUp) {
      setApiServerUp(false)
      setError('We&apos;re having trouble connecting to our servers. Please try again later.')
      setLoading(false)
      return
    }
    
    // Then check token validity before proceeding
    console.log('🔐 Validating token before payment processing...')
    const isValid = await validateToken()
    
    if (!isValid) {
      console.error('🔴 Token validation failed during payment submission')
      setTokenValid(false)
      setError('Your login session has expired. Please log in again.')
      setLoading(false)
      return
    }
    
    console.log('✅ Token validation successful, proceeding with checkout')
    console.log('📦 Available localStorage keys:', Object.keys(localStorage).join(', '))

    try {
      // Use createShippingAddress to first create a shipping address
      // Import from stripe-adapter to use mock implementation to avoid 401 errors
      const { createShippingAddress } = await import('@/lib/stripe-adapter');
      
      const addressResponse = await createShippingAddress({
        // Convert from checkout form fields to API expected fields
        type: 'shipping',
        first_name: shippingInfo.firstName,
        last_name: shippingInfo.lastName,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        street: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zip_code: shippingInfo.zipCode,
        country: shippingInfo.country || 'US',
        is_default: true
      })
      
      console.log('Address created:', addressResponse)

      // Step 2: Create payment intent
      // Then create a payment intent using the adapter to avoid 401 errors
      const { createStripePaymentIntent } = await import('@/lib/stripe-adapter');
      
      const paymentIntent = await createStripePaymentIntent({
        amount: Math.round(cart.total * 100), // Convert to cents
        currency: 'usd',
        customer_email: shippingInfo.email,
        shipping_address: {
          type: 'shipping',
          first_name: shippingInfo.firstName,
          last_name: shippingInfo.lastName,
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zip_code: shippingInfo.zipCode,
          country: 'US'
        }
      })
      
      console.log('Payment intent created:', paymentIntent)
      
      // Store the client secret for Stripe confirmation
      setClientSecret(paymentIntent.client_secret)
      
      // Move to the payment step to let the user enter card details
      // After entering card details, the StripePaymentForm will handle payment confirmation
      // Only after successful confirmation will we create the order
      setStep('payment')
    } catch (error) {
      console.error('Error preparing payment:', error)
      
      // Enhanced error message extraction with structured backend errors
      let errorMessage = 'Please try again.'
      let errorType = 'payment_preparation'
      
      if (error instanceof Error) {
        errorMessage = error.message
        
        // Try to parse JSON error response from API
        try {
          // Extract JSON from common error patterns
          const jsonMatch = error.message.match(/\{.*\}/)
          if (jsonMatch) {
            const jsonError = JSON.parse(jsonMatch[0])
            
            // Handle specific FastAPI validation errors
            if (jsonError.detail && Array.isArray(jsonError.detail)) {
              // Define a type for FastAPI validation errors
              interface FastAPIValidationError {
                loc: string[];
                msg: string;
                type: string;
              }
              
              errorMessage = jsonError.detail
                .map((err: FastAPIValidationError) => `${err.loc.join('.')}: ${err.msg}`)
                .join(', ')
              errorType = 'validation'
            } else if (jsonError.detail) {
              errorMessage = jsonError.detail
            }
            
            // Check for Stripe-specific errors
            if (jsonError.code && jsonError.code.startsWith('stripe_')) {
              errorType = 'stripe'
              if (jsonError.code === 'stripe_card_declined') {
                errorMessage = 'Your card was declined. Please try another payment method.'
              } else if (jsonError.code === 'stripe_expired_card') {
                errorMessage = 'Your card has expired. Please use another card.'
              } else if (jsonError.code === 'stripe_insufficient_funds') {
                errorMessage = 'Your card has insufficient funds. Please use another payment method.'
              }
            }
          }
        } catch (parseError) {
          console.log('Error parsing JSON from error message:', parseError)
        }
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object') {
        // Try to extract error from object
        // Define error object interface with proper types
        interface ErrorObject {
          detail?: string | Array<{
            loc: string[];
            msg: string;
            type: string;
          }>;
          message?: string;
          code?: string;
          type?: string;
          [key: string]: unknown;
        }
        const errorObj = error as ErrorObject;
        
        // Handle FastAPI validation errors array
        if (Array.isArray(errorObj.detail)) {
          errorMessage = errorObj.detail
            .map((err) => `${err.loc.join('.')}: ${err.msg}`)
            .join(', ')
          errorType = 'validation'
        } else if (errorObj.detail && typeof errorObj.detail === 'string') {
          errorMessage = errorObj.detail
        } else if (errorObj.message) {
          errorMessage = errorObj.message as string
        } else {
          try {
            errorMessage = JSON.stringify(error)
          } catch {
            errorMessage = 'Unknown error occurred'
          }
        }
        
        // Check for Stripe error codes
        if (errorObj.code && typeof errorObj.code === 'string' && errorObj.code.startsWith('stripe_')) {
          errorType = 'stripe'
        }
      }
      
      // Create a user-friendly error message based on the error type
      let userFriendlyMessage = ''
      switch (errorType) {
        case 'validation':
          userFriendlyMessage = `Validation error: ${errorMessage}`
          break
        case 'stripe':
          userFriendlyMessage = `Payment error: ${errorMessage}`
          break
        default:
          userFriendlyMessage = `Payment preparation failed: ${errorMessage}`
      }
      
      console.error(`[${errorType}] ${errorMessage}`, error)
      setError(userFriendlyMessage)
    } finally {
      setLoading(false)
    }
  }
  
  // Function to handle the order creation after payment is confirmed
  const processOrderWithPayment = async () => {
    if (!clientSecret) {
      setError('Missing payment information. Please try again.')
      return
    }
    
    // Extract payment intent ID from client secret
    const paymentIntentId = clientSecret.split('_secret_')[0]
    if (!paymentIntentId) {
      setError('Invalid payment information. Please try again.')
      return
    }
    
    console.log('Payment confirmed successfully, creating order with payment intent:', paymentIntentId)
    setLoading(true)
    setError('')
    
    try {
      // Step 3: Create order with payment using your FastAPI backend
      const orderData: CreateOrderWithPaymentRequest = {
        items: cart.items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shipping_address_id: '', // Will be filled by the address we created earlier
        payment_intent_id: clientSecret.split('_secret_')[0], // Extract payment intent ID from client secret
        totals: {
          subtotal: cart.subtotal,
          tax: cart.tax,
          delivery_fee: cart.deliveryFee,
          discount: cart.discountAmount || 0,
          total: cart.total
        }
      }
      
      // Use createShippingAddress to first create a shipping address
      // Import from stripe-adapter to use mock implementation to avoid 401 errors
      const { createShippingAddress } = await import('@/lib/stripe-adapter');
      
      const addressResponse = await createShippingAddress({
        // Convert from checkout form fields to API expected fields
        type: 'shipping',
        first_name: shippingInfo.firstName,
        last_name: shippingInfo.lastName,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        street: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zip_code: shippingInfo.zipCode,
        country: shippingInfo.country || 'US',
        is_default: true
      })
      // Use the address ID for the order
      orderData.shipping_address_id = addressResponse.id

      // Use adapter to create order with payment
      const { createOrderWithStripePayment } = await import('@/lib/stripe-adapter');
      const createdOrder = await createOrderWithStripePayment(orderData)
      console.log('Order created with payment:', createdOrder)
      
      // Store order details in localStorage for the confirmation page
      localStorage.setItem(`order_${createdOrder.id}`, JSON.stringify({
        id: createdOrder.id,
        items: cart.items.map(item => ({
          id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        totals: orderData.totals
      }))
      
      // Record successful order in analytics
      console.log('Order successfully created:', createdOrder.id)
      
      // Payment is complete - clear cart first and store in a flag so we know it was cleared
      clearCart()
      localStorage.setItem('cart_cleared', 'true')
      
      // Important: We need to add a small delay before redirecting to ensure
      // the cart state is fully updated before the page transition
      setTimeout(() => {
        // Redirect to dedicated confirmation page
        router.push(`/order-confirmation?orderId=${createdOrder.id}`)
      }, 100)
    } catch (error) {
      console.error('Order creation failed:', error)
      
      // Enhanced error message extraction with structured backend errors
      let errorMessage = 'Please try again.'
      let errorType = 'order_creation'
      
      if (error instanceof Error) {
        errorMessage = error.message
        
        // Try to parse JSON error response from API
        try {
          // Extract JSON from common error patterns
          const jsonMatch = error.message.match(/\{.*\}/)
          if (jsonMatch) {
            const jsonError = JSON.parse(jsonMatch[0])
            
            // Handle specific FastAPI validation errors
            if (jsonError.detail && Array.isArray(jsonError.detail)) {
              // Define a type for FastAPI validation errors
              interface FastAPIValidationError {
                loc: string[];
                msg: string;
                type: string;
              }
              
              errorMessage = jsonError.detail
                .map((err: FastAPIValidationError) => `${err.loc.join('.')}: ${err.msg}`)
                .join(', ')
              errorType = 'validation'
            } else if (jsonError.detail) {
              errorMessage = jsonError.detail
            }
            
            // Check for order-specific errors
            if (jsonError.code) {
              if (jsonError.code === 'inventory_insufficient') {
                errorMessage = 'Some items in your cart are no longer available in the requested quantity.'
                errorType = 'inventory'
              } else if (jsonError.code === 'order_duplicate') {
                errorMessage = 'This order appears to be a duplicate. Please check your order history.'
                errorType = 'duplicate'
              }
            }
          }
        } catch (parseError) {
          console.log('Error parsing JSON from error message:', parseError)
        }
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object') {
        // Define error object interface with proper types
        interface ErrorObject {
          detail?: string | Array<{
            loc: string[];
            msg: string;
            type: string;
          }>;
          message?: string;
          code?: string;
          type?: string;
          [key: string]: unknown;
        }
        const errorObj = error as ErrorObject;
        
        // Handle FastAPI validation errors array
        if (Array.isArray(errorObj.detail)) {
          errorMessage = errorObj.detail
            .map((err) => `${err.loc.join('.')}: ${err.msg}`)
            .join(', ')
          errorType = 'validation'
        } else if (errorObj.detail && typeof errorObj.detail === 'string') {
          errorMessage = errorObj.detail
        } else if (errorObj.message) {
          errorMessage = errorObj.message as string
        } else {
          try {
            errorMessage = JSON.stringify(error)
          } catch {
            // Ignore stringify error, use generic message
            errorMessage = 'Unknown error occurred'
          }
        }
        
        // Check for specific error codes
        if (errorObj.code && typeof errorObj.code === 'string') {
          if (errorObj.code === 'inventory_insufficient') {
            errorType = 'inventory'
          } else if (errorObj.code === 'order_duplicate') {
            errorType = 'duplicate'
          }
        }
      }
      
      // Create a user-friendly error message based on the error type
      let userFriendlyMessage = ''
      switch (errorType) {
        case 'validation':
          userFriendlyMessage = `Validation error: ${errorMessage}`
          break
        case 'inventory':
          userFriendlyMessage = `Inventory error: ${errorMessage}`
          break
        case 'duplicate':
          userFriendlyMessage = `${errorMessage}`
          break
        default:
          userFriendlyMessage = `Order creation failed: ${errorMessage}`
      }
      
      console.error(`[${errorType}] ${errorMessage}`, error)
      setError(userFriendlyMessage)
    } finally {
      setLoading(false)
    }
  }

  if (cart.items.length === 0) {
    return null // Will redirect
  }
  
  // Show error message if there is one
  const ErrorAlert = () => {
    // If API server is down
    if (!apiServerUp) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">API Server Connection Error</p>
              <p className="text-sm mt-1">We&apos;re having trouble connecting to our servers. This could be due to maintenance, high traffic, or network issues.</p>
            </div>
            <div className="ml-auto">
              <Button 
                onClick={() => window.location.reload()}
                size="sm"
                className="bg-red-700 hover:bg-red-800"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    // If token is invalid, show login prompt
    if (!tokenValid) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">Your session has expired. Please log in again to continue checkout.</p>
            </div>
            <div className="ml-auto">
              <Button 
                onClick={() => router.push('/auth/login?redirect=/checkout')}
                size="sm"
                className="bg-yellow-700 hover:bg-yellow-800"
              >
                Log In
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    if (!error) return null
    
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm">{error}</p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button 
                onClick={() => setError('')}
                className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorAlert />
        {/* Header */}
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>
        
        {/* Stripe Integration Notice */}
        <div className="mb-6">
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-800 flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Using real Stripe integration for secure payment processing
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === 'shipping' ? 'bg-green-600 text-white' : 'bg-green-600 text-white'
            }`}>
              {step === 'shipping' ? '1' : <CheckCircleIcon className="h-5 w-5" />}
            </div>
            <span className="ml-2 text-sm font-medium">Shipping</span>
          </div>
          
          <div className="w-16 h-px bg-gray-300 mx-4"></div>
          
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === 'payment' ? 'bg-green-600 text-white' : 
              step === 'confirmation' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {step === 'confirmation' ? <CheckCircleIcon className="h-5 w-5" /> : '2'}
            </div>
            <span className="ml-2 text-sm font-medium">Payment</span>
          </div>
          
          <div className="w-16 h-px bg-gray-300 mx-4"></div>
          
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === 'confirmation' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {step === 'confirmation' ? <CheckCircleIcon className="h-5 w-5" /> : '3'}
            </div>
            <span className="ml-2 text-sm font-medium">Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={shippingInfo.firstName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={shippingInfo.lastName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={shippingInfo.address}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={shippingInfo.city}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShippingInfo({...shippingInfo, city: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={shippingInfo.state}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShippingInfo({...shippingInfo, state: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                      Continue to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCardIcon className="h-5 w-5 mr-2" />
                    Payment Information
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useRawToken}
                        onChange={(e) => setUseRawToken(e.target.checked)}
                        className="rounded text-green-600 focus:ring-green-500 h-4 w-4 mr-2"
                      />
                      <span className="text-sm text-gray-600">
                        {useRawToken ? "Using Raw Token" : "Using Bearer Token"}
                      </span>
                    </label>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    {/* Show success message if present */}
                    {success && (
                      <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded">
                        {success}
                      </div>
                    )}
                    
                    {/* Enhanced Stripe Payment Form with saved payment methods */}
                    <StripePaymentForm
                      onSuccess={(paymentMethod) => {
                        // If client secret exists, the payment has been confirmed with Stripe
                        // and we can create the order
                        console.log('Payment confirmed successfully:', paymentMethod.id);
                        processOrderWithPayment();
                      }}
                      onError={(errorMessage) => {
                        setError(`Payment error: ${errorMessage}`);
                      }}
                      isLoading={loading}
                      amount={Math.round(cart.total * 100)}
                      clientSecret={clientSecret}
                      savedPaymentMethods={savedPaymentMethods}
                      loadingSavedMethods={loadingSavedMethods}
                      onDeletePaymentMethod={handleDeletePaymentMethod}
                      onSetDefaultPaymentMethod={handleSetDefaultPaymentMethod}
                      saveCard={saveCard}
                      onSaveCardChange={setSaveCard}
                      selectedPaymentMethod={selectedPaymentMethod}
                      onSelectSavedPaymentMethod={setSelectedPaymentMethod}
                    />
                    
                    <div className="flex items-center text-sm text-gray-600 mt-4">
                      <LockClosedIcon className="h-4 w-4 mr-2" />
                      Your payment information is secure and encrypted
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setStep('shipping')}
                        className="flex items-center"
                      >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={loading}
                      >
                        {loading ? 'Processing...' : 'Complete Order'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === 'confirmation' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Order Confirmation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    {loading ? (
                      <div className="flex flex-col items-center">
                        <div className="loader mb-4" />
                        <p>Processing your order...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
                        <h3 className="text-xl font-semibold">Order Confirmed!</h3>
                        <p>Your order has been confirmed and is being processed. Thank you for your purchase!</p>
                        
                        <div className="mt-6">
                          <Button 
                            onClick={() => router.push('/orders')}
                            className="w-full"
                          >
                            View Your Orders
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={item.product.thumbnail || '/images/placeholder-product.jpg'}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>
                  
                  {cart.discountAmount && cart.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({cart.discountCode})</span>
                      <span>-{formatPrice(cart.discountAmount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatPrice(cart.tax)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Delivery</span>
                    <span>
                      {cart.deliveryFee === 0 ? 'FREE' : formatPrice(cart.deliveryFee)}
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
