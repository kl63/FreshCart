'use client'

import { useState, useEffect } from 'react'
import { AuthService, type User } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = AuthService.isAuthenticated()
      setIsAuthenticated(authenticated)
      
      if (authenticated) {
        const userData = AuthService.getUser()
        setUser(userData)
      }
      
      setIsLoading(false)
    }

    checkAuth()

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login({ email, password })
      AuthService.setTokens(response.access_token, response.refresh_token)
      AuthService.setUser(response.user)
      
      setUser(response.user)
      setIsAuthenticated(true)
      
      return { success: true, user: response.user }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      }
    }
  }

  const logout = async () => {
    await AuthService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUser = (userData: User) => {
    AuthService.setUser(userData)
    setUser(userData)
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser
  }
}
