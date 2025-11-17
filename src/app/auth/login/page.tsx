'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function LoginPage() {


  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }


  
  const performActualLogin = () => {
    console.log('=== PERFORMING ACTUAL LOGIN ===')
    console.log('Form data:', { email: formData.email, hasPassword: !!formData.password })
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    // Simple login without async/await to avoid Suspense
    const loginData = {
      email: formData.email.trim(),
      password: formData.password
    }
    
    console.log('=== SENDING LOGIN REQUEST ===')
    console.log('Login data:', loginData)
    
    // Use form-urlencoded format (required by FastAPI OAuth2)
    const formBody = new URLSearchParams()
    formBody.append('username', loginData.email) // FastAPI OAuth2 expects "username" field
    formBody.append('password', loginData.password)
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fastapi.kevinlinportfolio.com/api/v1'
    console.log('API URL:', apiUrl)
    
    fetch(`${apiUrl}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody
    })
    .then(response => {
      console.log('=== LOGIN RESPONSE ===')
      console.log('Status:', response.status)
      
      if (!response.ok) {
        return response.json().then(error => {
          throw new Error(error.detail || 'Login failed')
        })
      }
      
      return response.json()
    })
    .then(data => {
      console.log('=== LOGIN SUCCESS ===')
      console.log('Response data:', JSON.stringify(data, null, 2))
      
      // Store tokens
      if (data.access_token) {
        localStorage.setItem('token', data.access_token)
        console.log('Token stored')
      }
      
      if (data.refresh_token) {
        localStorage.setItem('refreshToken', data.refresh_token)
        console.log('Refresh token stored')
      }
      
      // Now fetch user data with the new token
      console.log('=== FETCHING USER DATA AFTER LOGIN ===')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fastapi.kevinlinportfolio.com/api/v1'
      return fetch(`${apiUrl}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
          'accept': 'application/json'
        }
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch user profile')
      }
      return response.json()
    })
    .then(userData => {
      console.log('=== USER DATA FETCHED ===')
      console.log('User data:', JSON.stringify(userData, null, 2))
      
      localStorage.setItem('user', JSON.stringify(userData))
      console.log('User data stored successfully!')
      
      setIsLoading(false)
      console.log('=== REDIRECTING TO ACCOUNT ===')
      window.location.href = '/account'
    })
    .catch(err => {
      console.error('=== LOGIN ERROR ===')
      console.error(err)
      setError(err.message)
      setIsLoading(false)
    })
  }
  
  const performLogin = () => {
    // Use actual login for form submission
    performActualLogin()
  }
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('=== FORM SUBMITTED ===')
    performLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/auth/register"
              className="font-medium text-green-600 hover:text-green-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-green-600 hover:text-green-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

