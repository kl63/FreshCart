'use client';

import { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  orderId: string;
  amount: number;
}

export default function CheckoutForm({ orderId, amount }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Submit the payment information to Stripe
      const { error: submitError } = await elements.submit();
      
      if (submitError) {
        setError(submitError.message || 'Payment failed');
        setLoading(false);
        return;
      }

      // Confirm the payment with Stripe
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order/${orderId}/success`,
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        setLoading(false);
      }
      
      // If no error, Stripe will redirect to return_url
      
    } catch {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      {/* Stripe Payment Element - handles all payment methods */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <PaymentElement />
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Order summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Amount:</span>
          <span className="text-2xl font-bold">${amount.toFixed(2)}</span>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`
          w-full py-4 px-6 rounded-lg font-semibold text-white
          transition-all duration-200
          ${!stripe || loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }
        `}
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
            Processing...
          </span>
        ) : (
          `Pay $${amount.toFixed(2)}` 
        )}
      </button>

      {/* Security badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        Secure payment powered by Stripe
      </div>
    </form>
  );
}
