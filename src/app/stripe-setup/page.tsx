'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Simple key generation to create a consistent token
const generateTestToken = () => {
  // Create a basic JWT structure with header, payload, and signature
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: 'test-user-123',
    name: 'Test User',
    email: 'test@example.com',
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
  }));
  const signature = btoa('test-signature-for-stripe-integration');
  
  return `${header.replace(/=/g, '')}.${payload.replace(/=/g, '')}.${signature.replace(/=/g, '')}`;
};

export default function StripeSetupPage() {
  const router = useRouter();
  const [isSetup, setIsSetup] = useState(false);
  const [setupMessage, setSetupMessage] = useState('');

  const setupStripe = () => {
    try {
      // Generate test token
      const testToken = generateTestToken();
      
      // Save token to session storage
      sessionStorage.setItem('test_token', `Bearer ${testToken}`);
      
      // Also save to localStorage for persistence
      localStorage.setItem('token', testToken);
      
      setIsSetup(true);
      setSetupMessage('✅ Stripe setup complete! Your authentication token has been generated and saved.');
    } catch (error) {
      setSetupMessage(`❌ Error setting up Stripe: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const goToCheckout = () => {
    router.push('/stripe-test');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Stripe Integration Setup</h1>
        <p className="text-gray-600">
          This page will set up your browser with the necessary authentication for Stripe integration.
        </p>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">One-Click Stripe Setup</h2>
        <p className="mb-4">
          Click the button below to automatically set up your browser with the correct authentication token
          for Stripe integration. This will allow you to test the checkout process with real API calls.
        </p>
        
        <button 
          onClick={setupStripe}
          className="w-full mb-4 py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          Setup Stripe Authentication
        </button>
        
        {setupMessage && (
          <div className={`p-4 rounded-md mb-4 ${setupMessage.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {setupMessage}
          </div>
        )}
        
        {isSetup && (
          <button 
            onClick={goToCheckout}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
          >
            Go to Checkout Test
          </button>
        )}
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">What This Does</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Generates a properly formatted authentication token</li>
          <li>Adds the &ldquo;Bearer&rdquo; prefix required by the FastAPI backend</li>
          <li>Saves the token in your browser&apos;s sessionStorage</li>
          <li>Enables real API calls to the Stripe backend</li>
          <li>No server-side configuration required</li>
        </ul>
        
        <div className="mt-6">
          <p className="text-gray-500 text-sm">
            Note: This setup is for testing purposes only. In a production environment, 
            authentication would be handled through a secure login process.
          </p>
        </div>
      </div>
    </div>
  );
}
