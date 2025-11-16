'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { testCheckoutFlow } from '@/lib/checkout-test';

export default function StripeTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [useRawToken, setUseRawToken] = useState(false);

  const handleRunTest = async () => {
    setIsLoading(true);
    setResult('');
    setError('');
    
    try {
      console.log('Running checkout test with real Stripe integration...');
      await testCheckoutFlow(useRawToken);
      setResult('✅ Checkout test completed successfully! Check your browser console for detailed logs and your Stripe dashboard for the transaction.');
    } catch (err) {
      setError(`❌ Error: ${err instanceof Error ? err.message : String(err)}`);
      console.error('Checkout test failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Stripe Integration Test</h1>
        <p className="text-gray-600">
          This page allows you to test the real Stripe integration without using mock data.
          All transactions will appear in your Stripe dashboard.
        </p>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
        
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={useRawToken}
              onChange={(e) => setUseRawToken(e.target.checked)}
              className="h-5 w-5 text-blue-600"
            />
            <span>Use raw token format (without Bearer prefix)</span>
          </label>
        </div>
        
        <button
          onClick={handleRunTest}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Running Test...' : 'Run Real Stripe Checkout Test'}
        </button>
      </div>

      {result && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-6">
          <p className="text-green-800">{result}</p>
          <div className="mt-4">
            <Link 
              href="/stripe-results" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Stripe Dashboard
            </Link>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
        <p className="mb-2">
          Check your browser console (F12) for detailed logs of the checkout process.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>API Base URL: {process.env.NEXT_PUBLIC_API_BASE_URL || 'Using default API URL'}</li>
          <li>Using Mocks: {process.env.NEXT_PUBLIC_USE_MOCKS || 'false'}</li>
          <li>Debug Enabled: {process.env.NEXT_PUBLIC_DEBUG_ENABLED || 'false'}</li>
          <li>Auth Debug: {process.env.NEXT_PUBLIC_AUTH_DEBUG_ENABLED || 'false'}</li>
        </ul>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="font-semibold mb-2">Test Data Used</h3>
          <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-auto text-sm">
{`// Test Address
{
  type: 'shipping',
  first_name: 'Test',
  last_name: 'Customer',
  email: 'test@example.com',
  phone: '555-555-5555',
  street: '123 Main St',
  city: 'Anytown',
  state: 'CA',
  zip_code: '94000',
  country: 'US'
}

// Test Order Items
[
  {
    product_id: 'prod_test_01',
    quantity: 1,
    price: 1999  // $19.99
  },
  {
    product_id: 'prod_test_02',
    quantity: 2,
    price: 999   // $9.99 x2
  }
]

// Order Total: $48.17`}
          </pre>
        </div>
      </div>
    </div>
  );
}
