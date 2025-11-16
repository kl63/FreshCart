'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CheckoutStripePage() {
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)
  
  // Automatically redirect to the main checkout page that uses Stripe Elements
  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      router.push('/checkout')
    }, 3000) // Wait 3 seconds to show the message before redirecting
    
    setIsRedirecting(true)
    
    return () => clearTimeout(redirectTimeout)
  }, [router])
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <ExclamationCircleIcon className="h-6 w-6 text-amber-500 mr-2" />
            Redirecting to Recommended Checkout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We&apos;ve updated our checkout system to provide a better experience. You&apos;re being redirected to our improved checkout page.
          </p>
          <p className="mb-6">
            The Stripe Checkout Sessions approach is currently experiencing technical issues. Our standard checkout with Stripe Elements offers better control and support for saved payment methods.
          </p>
          {isRedirecting && (
            <p className="text-sm text-muted-foreground mb-4">
              Redirecting in a few seconds...
            </p>
          )}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              asChild
              className="mr-4"
            >
              <Link href="/cart">Return to Cart</Link>
            </Button>
            <Button 
              onClick={() => router.push('/checkout')} 
              className="bg-primary hover:bg-primary/90"
            >
              Go to Checkout Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
