'use client';

import React, { useState, useEffect } from 'react';

export default function AuthTestPage() {
  const [token, setToken] = useState('');
  const [currentToken, setCurrentToken] = useState('');
  const [bearerPrefix, setBearerPrefix] = useState(true);
  const [showToken, setShowToken] = useState(false);
  const [message, setMessage] = useState('');
  const [apiUrl, setApiUrl] = useState('');

  // Load current token on component mount
  useEffect(() => {
    // Check for test token
    const testToken = sessionStorage.getItem('test_token');
    if (testToken) {
      setCurrentToken(testToken);
    } else {
      // Check regular token locations
      const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
      setCurrentToken(storedToken);
    }

    // Get API URL from env or use default
    const envApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://fastapi.kevinlinportfolio.com/api/v1';
    setApiUrl(envApiUrl);
  }, []);

  const saveToken = () => {
    if (!token) {
      setMessage('Please enter a token first');
      return;
    }

    try {
      // Format token if needed
      const finalToken = bearerPrefix ? `Bearer ${token.trim()}` : token.trim();
      
      // Save to sessionStorage for testing
      sessionStorage.setItem('test_token', finalToken);
      setCurrentToken(finalToken);
      setMessage('✅ Token saved successfully! Will be used for all API calls.');
    } catch (error) {
      setMessage(`❌ Error saving token: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const clearToken = () => {
    try {
      sessionStorage.removeItem('test_token');
      setCurrentToken('');
      setToken('');
      setMessage('✅ Test token cleared. API calls will use default tokens.');
    } catch (error) {
      setMessage(`❌ Error clearing token: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const generateJwtToken = () => {
    // Generate a simple JWT-formatted token for testing
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      sub: 'test-user-id', 
      name: 'Test User',
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }));
    const signature = 'DUMMY_SIGNATURE_FOR_TESTING_ONLY';
    
    const jwt = `${header.replace(/=/g, '')}.${payload.replace(/=/g, '')}.${signature}`;
    setToken(jwt);
    setMessage('Generated test JWT token. Click Save to use it.');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Authentication Test Panel</h1>
        <p className="text-gray-600">
          Use this page to set a test token for API calls and debug authentication issues.
        </p>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Set Test Token</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Authentication Token:</label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
            placeholder="Enter your JWT token or auth token here..."
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={bearerPrefix}
              onChange={(e) => setBearerPrefix(e.target.checked)}
              className="h-5 w-5 text-blue-600"
            />
            <span>Add "Bearer" prefix automatically</span>
          </label>
        </div>
        
        <div className="flex space-x-4 mb-6">
          <button
            onClick={saveToken}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Token
          </button>
          <button
            onClick={clearToken}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Clear Token
          </button>
          <button
            onClick={generateJwtToken}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Generate Test JWT
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded-md ${message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Token Status</h2>
        
        {currentToken ? (
          <>
            <div className="flex items-center mb-4">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <p>Test token is active and will be used for API calls</p>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Token Value:</span>
                <button 
                  onClick={() => setShowToken(!showToken)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {showToken ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showToken ? (
                <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-xs">{currentToken}</pre>
              ) : (
                <pre className="bg-gray-100 p-3 rounded-md overflow-hidden text-xs">
                  {currentToken.substring(0, 10)}...{currentToken.substring(currentToken.length - 10)}
                </pre>
              )}
            </div>
            
            <div className="mb-2">
              <span className="font-medium">Token Format:</span>{' '}
              <span className={currentToken.startsWith('Bearer ') ? 'text-green-600' : 'text-yellow-600'}>
                {currentToken.startsWith('Bearer ') ? 'With Bearer prefix' : 'Without Bearer prefix'}
              </span>
            </div>
            
            <div>
              <span className="font-medium">Token Length:</span> {currentToken.length} characters
            </div>
          </>
        ) : (
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
            <p>No test token set. API calls will use default token handling.</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">API Connection Information</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>API Base URL: {apiUrl}</li>
          <li>Using Mocks: {process.env.NEXT_PUBLIC_USE_MOCKS || 'false'}</li>
          <li>Skip Auth: {process.env.NEXT_PUBLIC_SKIP_AUTH || 'false'}</li>
        </ul>
        
        <div className="mt-6">
          <a
            href="/stripe-test"
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Go to Stripe Test Page
          </a>
        </div>
      </div>
    </div>
  );
}
