'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/auth'

interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAdminAccess = () => {
      try {
        // Clear any corrupted data first
        AuthService.clearCorruptedData()
        
        // Check if user is authenticated
        const isAuth = AuthService.isAuthenticated()
        if (!isAuth) {
          router.push('/auth/login?redirect=/admin')
          return
        }
        
        // Check if user is admin
        const user = AuthService.getUser()
        const canAccess = user?.is_admin === true
        
        if (!canAccess) {
          // Redirect to login if not authenticated
          if (!AuthService.isAuthenticated()) {
            router.push('/auth/login?redirect=/admin')
            return
          }
          
          // Redirect to home if authenticated but not admin
          router.push('/?error=access-denied')
          return
        }
        
        setIsAuthorized(true)
      } catch (error) {
        console.error('Admin access check failed:', error)
        router.push('/auth/login?redirect=/admin')
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminAccess()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don&apos;t have permission to access this area.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
