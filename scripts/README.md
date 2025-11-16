# Test & Debug Scripts

This folder contains test and debugging scripts used during development.

## Files

### test-network.js
Network connectivity and API endpoint testing script.
- Tests backend API connection
- Verifies network configuration

### test-stripe-integration.js
Stripe integration testing script for browser console.
- Tests payment intent creation
- Verifies Stripe configuration
- Can be run in browser console for quick testing

### test-api.html
HTML page for manual API testing.
- Interactive API testing interface
- Useful for debugging backend endpoints

## Usage

These scripts are for **development and testing only**.

### Browser Console Testing
```javascript
// Copy contents of test-stripe-integration.js
// Paste into browser console at http://localhost:3000
```

### Node.js Testing
```bash
node test-network.js
```

## Note

These scripts are not part of the production build and are for development reference only.
