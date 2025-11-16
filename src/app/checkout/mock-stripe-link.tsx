'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * A component that adds a link to the Stripe Dashboard in the checkout page
 * This helps users navigate to the Stripe mock dashboard to view transactions
 */
export function StripeResultsLink() {
  return (
    <div className="mt-4 text-center">
      <Link href="/stripe-results" passHref>
        <Button variant="link" className="text-blue-600 text-sm">
          View Stripe Dashboard
        </Button>
      </Link>
      <p className="text-xs text-gray-500 mt-1">
        All transactions will appear in the Stripe mock dashboard
      </p>
    </div>
  );
}

/**
 * A component that displays a notice about using mock Stripe implementation
 */
export function MockStripeNotice() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
      <p className="text-sm text-yellow-800 flex items-center">
        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Currently using mock Stripe implementation. All transactions are simulated.
      </p>
    </div>
  );
}

// Create a named constant for the default export
const components = {
  StripeResultsLink,
  MockStripeNotice
};

export default components;
