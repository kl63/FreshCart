'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { testStripeIntegration, getStripeStatus } from '@/lib/test-stripe';

export default function StripeRealTestPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const runDiagnostics = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Run Stripe integration tests
      const status = await getStripeStatus();
      setResults(status);
      
      if (!status.ready) {
        setError('Stripe integration is not fully configured. See details below.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error running diagnostics:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Real Stripe Integration Test</h1>
        <p className="text-gray-600 mb-4">
          Test your Stripe integration to ensure it's properly configured for production use.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Diagnostics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Run diagnostics to check if your Stripe integration is properly configured.
              This will check:
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Authentication token validity</li>
              <li>API connectivity</li>
              <li>Environment variables</li>
            </ul>
            <Button 
              onClick={runDiagnostics} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Running Tests...' : 'Run Diagnostics'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            {results && (
              <div>
                <div className={`p-3 mb-4 rounded-md ${results.ready ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <p className={results.ready ? 'text-green-800' : 'text-yellow-800'}>
                    {results.ready ? '✅ Stripe integration is ready' : '⚠️ Stripe integration needs attention'}
                  </p>
                </div>

                <h3 className="font-semibold mb-2">Authentication</h3>
                {results.tests?.auth && (
                  <div className="mb-4 pl-2 border-l-2 border-gray-200">
                    <p>Status: {results.tests.auth.valid ? '✅ Valid' : '❌ Invalid'}</p>
                    {results.tests.auth.details && (
                      <ul className="text-sm text-gray-600">
                        {Object.entries(results.tests.auth.details).map(([key, value]) => (
                          <li key={key} className="flex justify-between">
                            <span>{key}:</span>
                            <span className="font-mono">{String(value)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <h3 className="font-semibold mb-2">API Connectivity</h3>
                {results.tests?.api && (
                  <div className="mb-4 pl-2 border-l-2 border-gray-200">
                    <p>Status: {results.tests.api.success ? '✅ Connected (Simulated)' : '❌ Failed'}</p>
                    {results.tests.api.details && (
                      <ul className="text-sm text-gray-600">
                        <li className="flex justify-between">
                          <span>Status:</span>
                          <span className="font-mono">{results.tests.api.details.statusText || 'Unknown'}</span>
                        </li>
                        {results.tests.api.details.error && (
                          <li className="flex justify-between">
                            <span>Error:</span>
                            <span className="font-mono">{results.tests.api.details.error}</span>
                          </li>
                        )}
                        {results.tests.api.details.suggestion && (
                          <li className="mt-2">
                            <span className="text-blue-600">Note:</span>
                            <p className="mt-1">{results.tests.api.details.suggestion}</p>
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                )}

                <h3 className="font-semibold mb-2">Environment</h3>
                {results.tests?.environment && (
                  <div className="mb-4 pl-2 border-l-2 border-gray-200">
                    <p>Publishable Key: {results.tests.environment.hasPublishableKey ? '✅ Set' : '❌ Missing'}</p>
                    {results.tests.environment.keyPreview && (
                      <p className="text-sm text-gray-600">
                        Key: <span className="font-mono">{results.tests.environment.keyPreview}</span>
                      </p>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-4">
                  Timestamp: {new Date(results.timestamp).toLocaleString()}
                </p>
              </div>
            )}

            {!results && !error && !loading && (
              <p className="text-center text-gray-500">
                Run the diagnostics to see results here
              </p>
            )}
          </CardContent>
          <CardFooter>
            <div className="w-full text-center">
              <Link href="/checkout" className="text-blue-600 hover:underline">
                Go to checkout page to test the full flow
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mt-8 border border-gray-200">
        <h3 className="text-xl font-bold mb-4">Troubleshooting</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Authentication Issues</h4>
            <p>
              If you're having authentication issues, make sure you're logged in or have a valid 
              test token set. You can set a test token using the developer tools.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold">API Connectivity</h4>
            <p>
              If API connectivity fails, check that your backend server is running and accessible.
              The API base URL should be properly configured in your environment.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold">Stripe Keys</h4>
            <p>
              Ensure your Stripe publishable key is set in the environment variables.
              The backend should have the Stripe secret key configured.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
