'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PaymentIntent {
  id: string;
  amount: number;
  status: string;
  created: string;
  customer_email?: string;
}

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function StripeResultsPage() {
  const router = useRouter();
  const [paymentIntents, setPaymentIntents] = useState<PaymentIntent[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Load stored payment data from localStorage on component mount
  useEffect(() => {
    // Get mock payment intents from localStorage
    try {
      const storedPaymentIntents = localStorage.getItem('mock_payment_intents');
      if (storedPaymentIntents) {
        setPaymentIntents(JSON.parse(storedPaymentIntents));
      }
      
      const storedOrders = localStorage.getItem('mock_orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
    } catch (error) {
      console.error('Error loading mock data:', error);
    }
    
    // Add listeners for mock API events
    window.addEventListener('mock_payment_intent_created', handlePaymentIntentCreated);
    window.addEventListener('mock_order_created', handleOrderCreated);
    
    return () => {
      window.removeEventListener('mock_payment_intent_created', handlePaymentIntentCreated);
      window.removeEventListener('mock_order_created', handleOrderCreated);
    };
  }, []);
  
  // Handler for mock payment intent creation
  const handlePaymentIntentCreated = (event: any) => {
    const newPaymentIntent = event.detail;
    setPaymentIntents(prev => {
      const updated = [newPaymentIntent, ...prev];
      localStorage.setItem('mock_payment_intents', JSON.stringify(updated));
      return updated;
    });
  };
  
  // Handler for mock order creation
  const handleOrderCreated = (event: any) => {
    const newOrder = event.detail;
    setOrders(prev => {
      const updated = [newOrder, ...prev];
      localStorage.setItem('mock_orders', JSON.stringify(updated));
      return updated;
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Clear all mock data
  const clearMockData = () => {
    if (confirm('Are you sure you want to clear all mock data?')) {
      localStorage.removeItem('mock_payment_intents');
      localStorage.removeItem('mock_orders');
      setPaymentIntents([]);
      setOrders([]);
    }
  };

  // Create new mock payment and order
  const createMockTransaction = () => {
    // Create mock payment intent
    const mockPaymentIntentId = `pi_mock_${Math.random().toString(36).substring(2, 15)}`;
    const mockPaymentIntent: PaymentIntent = {
      id: mockPaymentIntentId,
      amount: Math.floor(Math.random() * 10000) + 1000,
      status: 'succeeded',
      created: new Date().toISOString(),
      customer_email: 'test@example.com'
    };
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('mock_payment_intent_created', {
      detail: mockPaymentIntent
    }));
    
    // Create mock order
    const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 15)}`;
    const mockOrderNumber = `ORD-${Date.now().toString().substring(5)}`;
    const mockOrder: Order = {
      id: mockOrderId,
      order_number: mockOrderNumber,
      total_amount: mockPaymentIntent.amount,
      status: 'paid',
      created_at: new Date().toISOString()
    };
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('mock_order_created', {
      detail: mockOrder
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Stripe Mock Dashboard</h1>
        <p className="text-gray-600 mb-4">
          View your mock Stripe transactions and orders created through the checkout process.
        </p>
        <div className="flex space-x-4">
          <Link 
            href="/stripe-test"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Test Page
          </Link>
          <button
            onClick={createMockTransaction}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Create Mock Transaction
          </button>
          <button
            onClick={clearMockData}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Clear All Data
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Intents Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Payment Intents
          </h2>
          
          {paymentIntents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paymentIntents.map(intent => (
                    <tr key={intent.id}>
                      <td className="px-4 py-3 text-sm font-mono">{intent.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">{formatCurrency(intent.amount)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {intent.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(intent.created)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No payment intents yet. Run a checkout test to create some.
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            Orders
          </h2>
          
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td className="px-4 py-3 text-sm font-medium">{order.order_number}</td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">{formatCurrency(order.total_amount)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(order.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No orders yet. Run a checkout test to create some.
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg mt-8 border border-gray-200">
        <h3 className="text-xl font-bold mb-4">About Mock Mode</h3>
        <p className="mb-4">
          This dashboard displays mock Stripe transactions that are created locally in your browser.
          No real API calls are made to Stripe or any backend server.
        </p>
        <p>
          All data is stored in your browser&apos;s localStorage and will persist until you clear it manually.
          Use the &quot;Create Mock Transaction&quot; button to generate random test data.
        </p>
      </div>
    </div>
  );
}
