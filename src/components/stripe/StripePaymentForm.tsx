'use client'

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import type { StripeCardElement, PaymentIntent } from '@stripe/stripe-js'
import SavedPaymentMethods from './SavedPaymentMethods'
import { getPaymentMethods, deletePaymentMethod, setDefaultPaymentMethod, SavedPaymentMethod } from '@/lib/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

// Define the ref interface for the payment form
export interface StripePaymentFormRef {
  submit: () => Promise<void>
}

// Props for the payment form component
export interface PaymentFormProps {
  onSuccess?: (paymentIntent: PaymentIntent) => void
  onError?: (error: string) => void
  isLoading?: boolean
  amount: number
  clientSecret?: string
  savedPaymentMethods?: SavedPaymentMethod[]
  loadingSavedMethods?: boolean
  onDeletePaymentMethod?: (method: SavedPaymentMethod) => Promise<void>
  onSetDefaultPaymentMethod?: (method: SavedPaymentMethod) => Promise<void>
  onSaveCardChange?: (save: boolean) => void
  saveCard?: boolean
  onSelectSavedPaymentMethod?: (method: SavedPaymentMethod | null) => void
  selectedPaymentMethod?: SavedPaymentMethod | null
}

// Extract a user-friendly error message from different error types
const extractErrorMessage = (error: any): string => {
  if (!error) {
    return 'An unknown error occurred'
  }

  // Handle Stripe errors
  if (typeof error === 'object') {
    if (error.type === 'card_error' || error.type === 'validation_error') {
      return error.message || `Card error: ${error.type}`
    }
    
    if (error.message) {
      return error.message
    }

    if (error.error && error.error.message) {
      return error.error.message
    }

    // Handle API error responses
    if (error.response && error.response.data) {
      const { data } = error.response
      
      if (typeof data === 'string') {
        return data
      }
      
      if (data.message) {
        return data.message
      }
      
      if (data.error) {
        return typeof data.error === 'string' ? data.error : 'API error occurred'
      }
    }
  }

  // Fallback for string errors or unexpected formats
  return typeof error === 'string' ? error : 'An unexpected error occurred'
}

// Card input component with ref forwarding
const CardForm = forwardRef<StripePaymentFormRef, PaymentFormProps>(({ 
  onSuccess,
  onError,
  isLoading,
  amount,
  clientSecret,
  savedPaymentMethods = [],
  loadingSavedMethods = false,
  onDeletePaymentMethod,
  onSetDefaultPaymentMethod,
  onSaveCardChange,
  saveCard = false,
  onSelectSavedPaymentMethod,
  selectedPaymentMethod
}, ref) => {
  const stripe = useStripe()
  const elements = useElements()
  const [cardError, setCardError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [internalSavedMethods, setInternalSavedMethods] = useState<SavedPaymentMethod[]>([])
  const [isLoadingMethods, setIsLoadingMethods] = useState(false)
  const [internalSelectedMethod, setInternalSelectedMethod] = useState<SavedPaymentMethod | null>(null)

  // Effect to load saved payment methods if not provided as props
  useEffect(() => {
    if (savedPaymentMethods && savedPaymentMethods.length > 0) {
      // Use externally provided payment methods
      setInternalSavedMethods(savedPaymentMethods)
      
      // If there's a default method, select it
      const defaultMethod = savedPaymentMethods.find(m => m.is_default)
      if (defaultMethod && !internalSelectedMethod) {
        setInternalSelectedMethod(defaultMethod)
        if (onSelectSavedPaymentMethod) {
          onSelectSavedPaymentMethod(defaultMethod)
        }
      }
    } else {
      // If no methods provided, fetch them
      const fetchMethods = async () => {
        setIsLoadingMethods(true)
        try {
          const methods = await getPaymentMethods(true)
          setInternalSavedMethods(methods)
          
          // If there's a default method, select it
          const defaultMethod = methods.find(m => m.is_default)
          if (defaultMethod && !internalSelectedMethod) {
            setInternalSelectedMethod(defaultMethod)
            if (onSelectSavedPaymentMethod) {
              onSelectSavedPaymentMethod(defaultMethod)
            }
          }
        } catch (error) {
          console.error('Error fetching payment methods:', error)
          setInternalSavedMethods([])
        } finally {
          setIsLoadingMethods(false)
        }
      }
      
      fetchMethods()
    }
  }, [savedPaymentMethods, onSelectSavedPaymentMethod, internalSelectedMethod])

  // Effect to sync selected payment method from props
  useEffect(() => {
    if (selectedPaymentMethod) {
      setInternalSelectedMethod(selectedPaymentMethod)
    }
  }, [selectedPaymentMethod])

  // Handle payment method selection
  const handleSelectPaymentMethod = (method: SavedPaymentMethod | null) => {
    setInternalSelectedMethod(method)
    if (onSelectSavedPaymentMethod) {
      onSelectSavedPaymentMethod(method)
    }
  }

  // Expose the submit method via ref
  useImperativeHandle(ref, () => ({
    async submit() {
      if (!stripe || !elements || !clientSecret) {
        const errorMessage = !clientSecret 
          ? 'Missing payment details. Please try again.' 
          : 'Stripe is not loaded yet. Please try again.'
        
        setCardError(errorMessage)
        if (onError) onError(errorMessage)
        return
      }

      setIsProcessing(true)
      setCardError(null)

      try {
        // Case 1: Using a saved payment method
        if (internalSelectedMethod) {
          const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: internalSelectedMethod.id
          })

          if (error) {
            const userFriendlyMessage = extractErrorMessage(error)
            setCardError(userFriendlyMessage)
            if (onError) onError(userFriendlyMessage)
            return
          }

          if (paymentIntent && paymentIntent.status === 'succeeded') {
            if (onSuccess) onSuccess(paymentIntent)
            return
          }
        } 
        // Case 2: Using a new card
        else {
          const cardElement = elements.getElement(CardElement)
          
          if (!cardElement) {
            const errorMessage = 'Card information is missing. Please check your card details.'
            setCardError(errorMessage)
            if (onError) onError(errorMessage)
            return
          }

          // First, confirm card payment
          const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {}
            },
            // If saveCard is true, setup for future use
            setup_future_usage: saveCard ? 'off_session' : undefined
          })

          if (error) {
            const userFriendlyMessage = extractErrorMessage(error)
            setCardError(userFriendlyMessage)
            if (onError) onError(userFriendlyMessage)
            return
          }

          if (paymentIntent && paymentIntent.status === 'succeeded') {
            if (onSuccess) onSuccess(paymentIntent)
            return
          }
        }

        // If we get here, something unexpected happened with the payment intent
        const errorMessage = 'Payment processing failed. Please try again.'
        setCardError(errorMessage)
        if (onError) onError(errorMessage)
      } catch (error) {
        const userFriendlyMessage = extractErrorMessage(error)
        setCardError(userFriendlyMessage)
        if (onError) onError(userFriendlyMessage)
      } finally {
        setIsProcessing(false)
      }
    }
  }), [stripe, elements, clientSecret, internalSelectedMethod, saveCard, onSuccess, onError])

  // Handle save card checkbox change
  const handleSaveCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSaveCardChange) {
      onSaveCardChange(e.target.checked)
    }
  }

  // Local handlers for payment method management
  const handleDeletePaymentMethod = async (method: SavedPaymentMethod) => {
    if (onDeletePaymentMethod) {
      await onDeletePaymentMethod(method)
    } else {
      try {
        await deletePaymentMethod(method.id)
        // Update local state after deletion
        setInternalSavedMethods(prev => prev.filter(m => m.id !== method.id))
        // If the deleted method was selected, clear selection
        if (internalSelectedMethod && internalSelectedMethod.id === method.id) {
          setInternalSelectedMethod(null)
          if (onSelectSavedPaymentMethod) {
            onSelectSavedPaymentMethod(null)
          }
        }
      } catch (error) {
        console.error('Failed to delete payment method:', error)
        setCardError('Failed to delete payment method. Please try again.')
      }
    }
  }

  const handleSetDefaultPaymentMethod = async (method: SavedPaymentMethod) => {
    if (onSetDefaultPaymentMethod) {
      await onSetDefaultPaymentMethod(method)
    } else {
      try {
        await setDefaultPaymentMethod(method.id)
        // Update local state to reflect new default
        setInternalSavedMethods(prev => 
          prev.map(m => ({
            ...m,
            is_default: m.id === method.id
          }))
        )
      } catch (error) {
        console.error('Failed to set default payment method:', error)
        setCardError('Failed to set default payment method. Please try again.')
      }
    }
  }

  return (
    <div className="stripe-payment-form">
      {/* Display any card errors */}
      {cardError && (
        <div className="card-error" role="alert">
          <div className="text-red-500 text-sm mb-4">{cardError}</div>
        </div>
      )}

      {/* Saved Payment Methods Section */}
      {(internalSavedMethods.length > 0 || loadingSavedMethods || isLoadingMethods) && (
        <div className="saved-payment-methods mb-4">
          <SavedPaymentMethods
            savedMethods={internalSavedMethods}
            selectedMethodId={internalSelectedMethod?.id || null}
            onSelect={handleSelectPaymentMethod}
            onDelete={handleDeletePaymentMethod}
            onSetDefault={handleSetDefaultPaymentMethod}
            isLoading={loadingSavedMethods || isLoadingMethods}
          />
        </div>
      )}

      {/* New Card Form */}
      {!internalSelectedMethod && (
        <div className="new-card-section">
          <div className="card-element-container mb-4">
            <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-1">
              Card Details
            </label>
            <div className="border border-gray-300 rounded-md p-3">
              <CardElement
                id="card-element"
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Save card for future purchases checkbox */}
          {onSaveCardChange && (
            <div className="save-card-option mb-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={handleSaveCardChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Save card for future purchases</span>
              </label>
            </div>
          )}
        </div>
      )}

      {/* Loading states */}
      {(isProcessing || isLoading) && (
        <div className="loading-indicator text-center my-4">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          <span className="ml-2 text-gray-700">Processing payment...</span>
        </div>
      )}

      {/* Display amount */}
      <div className="text-sm mt-4 font-medium">
        Amount: ${(amount / 100).toFixed(2)} USD
      </div>

      {/* Security notice */}
      <div className="text-xs text-gray-500 mt-2">
        <span className="text-green-600 font-medium">Secure payment</span>
        <span> • Your payment information is encrypted</span>
      </div>
    </div>
  )
})

// Export the wrapped component
export const StripePaymentForm = forwardRef<StripePaymentFormRef, PaymentFormProps>((props, ref) => {
  return (
    <Elements stripe={stripePromise}>
      <CardForm ref={ref} {...props} />
    </Elements>
  )
})

// Default export
export default StripePaymentForm
