'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  created_at: string
  items?: any[]
  order_items?: any[]
  shipping_address?: any
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'delivered':
      return <Badge variant="success">Delivered</Badge>
    case 'cancelled':
      return <Badge variant="destructive">Cancelled</Badge>
    case 'pending':
      return <Badge variant="warning">Pending</Badge>
    case 'preparing':
      return <Badge variant="secondary">Preparing</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.error('No authentication token found')
        setOrders([])
        return
      }

      const response = await fetch('https://fastapi.kevinlinportfolio.com/api/v1/orders/my-orders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const ordersData = await response.json()
      console.log('Customer orders data:', ordersData)
      setOrders(ordersData)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4 -ml-2"
          onClick={() => router.push('/account')}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Account
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-2">View and track all your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button className="border-green-500 text-green-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                All Orders
              </button>
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                Delivered
              </button>
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                In Progress
              </button>
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                Cancelled
              </button>
            </nav>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">No orders found</p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => {
              const itemsCount = order.items?.length || order.order_items?.length || 0
              const deliveryAddress = order.shipping_address 
                ? `${order.shipping_address.street || order.shipping_address.address_line_1 || ''}, ${order.shipping_address.city || ''}, ${order.shipping_address.state || ''} ${order.shipping_address.zip_code || order.shipping_address.postal_code || ''}`
                : 'Address not available'
              
              return (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{order.order_number}</h3>
                        <p className="text-sm text-gray-600">
                          Placed on {(() => {
                            const date = order.created_at.endsWith('Z') 
                              ? new Date(order.created_at) 
                              : new Date(order.created_at + 'Z')
                            return date.toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })
                          })()}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Items</p>
                        <p className="font-medium">{itemsCount} items</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-medium">${order.total_amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Delivery Address</p>
                        <p className="font-medium text-sm">{deliveryAddress}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/order/${order.id}`)}>
                        View Details
                      </Button>
                      {order.status === 'delivered' && (
                        <>
                          <Button variant="outline" size="sm">
                            Reorder
                          </Button>
                          <Button variant="outline" size="sm">
                            Leave Review
                          </Button>
                        </>
                      )}
                      {(order.status === 'preparing' || order.status === 'shipped') && (
                        <Button variant="outline" size="sm">
                          Track Order
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Download Receipt
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline">
            Load More Orders
          </Button>
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Order Issues</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Having problems with an order? We&apos;re here to help.
                </p>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </div>
              <div>
                <h4 className="font-medium mb-2">Returns & Refunds</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Learn about our return policy and how to request refunds.
                </p>
                <Button variant="outline" size="sm">
                  Return Policy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
