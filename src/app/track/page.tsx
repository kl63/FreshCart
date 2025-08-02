'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const mockOrderStatuses = [
  {
    orderId: '12345',
    status: 'delivered',
    estimatedDelivery: '2024-12-15T14:30:00',
    actualDelivery: '2024-12-15T14:25:00',
    items: [
      { name: 'Organic Bananas', quantity: 2, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=100&h=100&auto=format&fit=crop' },
      { name: 'Fresh Milk', quantity: 1, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&h=100&auto=format&fit=crop' },
      { name: 'Whole Wheat Bread', quantity: 1, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&auto=format&fit=crop' }
    ],
    timeline: [
      { status: 'Order Placed', time: '2024-12-15T10:00:00', completed: true },
      { status: 'Order Confirmed', time: '2024-12-15T10:15:00', completed: true },
      { status: 'Preparing Order', time: '2024-12-15T11:00:00', completed: true },
      { status: 'Out for Delivery', time: '2024-12-15T13:30:00', completed: true },
      { status: 'Delivered', time: '2024-12-15T14:25:00', completed: true }
    ]
  }
]

export default function TrackPage() {
  const [orderId, setOrderId] = useState('')
  const [trackingResult, setTrackingResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const result = mockOrderStatuses.find(order => order.orderId === orderId)
      setTrackingResult(result || null)
      setIsLoading(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'out-for-delivery':
        return 'text-blue-600 bg-blue-100'
      case 'preparing':
        return 'text-yellow-600 bg-yellow-100'
      case 'confirmed':
        return 'text-purple-600 bg-purple-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-lg text-gray-600">
            Enter your order number to get real-time updates on your delivery
          </p>
        </div>

        {/* Track Order Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrackOrder} className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your order number (e.g., 12345)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Tracking...' : 'Track Order'}
              </Button>
            </form>
            <p className="text-sm text-gray-600 mt-2">
              You can find your order number in your confirmation email or account dashboard.
            </p>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackingResult && (
          <div className="space-y-6">
            {/* Order Status Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order #{trackingResult.orderId}</CardTitle>
                  <Badge 
                    className={getStatusColor(trackingResult.status)}
                  >
                    {trackingResult.status === 'delivered' ? 'Delivered' : 
                     trackingResult.status === 'out-for-delivery' ? 'Out for Delivery' :
                     trackingResult.status === 'preparing' ? 'Preparing' : 'Confirmed'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Information</h4>
                    {trackingResult.status === 'delivered' ? (
                      <p className="text-green-600">
                        ✅ Delivered on {new Date(trackingResult.actualDelivery).toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-gray-600">
                        Estimated delivery: {new Date(trackingResult.estimatedDelivery).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                    <p className="text-gray-600">{trackingResult.items.length} items</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingResult.timeline.map((step: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${
                        step.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium ${
                            step.completed ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {step.status}
                          </p>
                          {step.completed && (
                            <p className="text-sm text-gray-600">
                              {new Date(step.time).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingResult.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Results */}
        {orderId && trackingResult === null && !isLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Order Not Found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find an order with number "{orderId}". Please check your order number and try again.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Make sure you've entered the correct order number</p>
                <p>• Check your confirmation email for the exact order number</p>
                <p>• Orders may take a few minutes to appear in our tracking system</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Can't find your order?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  If you're having trouble tracking your order, our customer service team is here to help.
                </p>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Delivery Questions</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Learn more about our delivery process, timing, and what to expect.
                </p>
                <Button variant="outline" size="sm">
                  Delivery Info
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
