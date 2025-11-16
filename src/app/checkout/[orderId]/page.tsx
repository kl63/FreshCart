'use client';

import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import CheckoutForm from '@/components/CheckoutForm';
import { useParams } from 'next/navigation';

interface PaymentIntent {
  client_secret: string;
  payment_intent_id: string;
  amount: number;
  currency: string;
}

export default function CheckoutPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        // Get JWT token from localStorage (or your auth solution)
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Please login to continue');
          return;
        }

        // Use Next.js API route to avoid CORS issues
        const url = `/api/orders/${orderId}/create-payment-intent`;
        
        console.log('🔄 Creating payment intent for order:', orderId);
        console.log('📍 URL:', url);

        // Call Next.js API route (which proxies to backend)
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Payment intent error:', response.status, errorText);
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { detail: errorText };
          }
          throw new Error(errorData.detail || 'Failed to create payment intent');
        }

        const data = await response.json();
        console.log('✅ Payment intent created:', data);
        setPaymentIntent(data);
        
      } catch (err) {
        console.error('💥 Payment intent creation failed:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!paymentIntent) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Payment
          </h1>
          <p className="text-gray-600">
            Order ID: {orderId}
          </p>
        </div>

        {/* Payment Form */}
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: paymentIntent.client_secret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#2563eb',
              },
            },
          }}
        >
          <CheckoutForm
            orderId={orderId}
            amount={paymentIntent.amount}
          />
        </Elements>
      </div>
    </div>
  );
}
