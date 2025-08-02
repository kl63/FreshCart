import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const mockOrders = [
  {
    id: '12345',
    date: '2024-12-15',
    status: 'delivered',
    items: 5,
    total: 47.82,
    deliveryAddress: '123 Main St, Anytown, ST 12345'
  },
  {
    id: '12344',
    date: '2024-12-12',
    status: 'delivered',
    items: 8,
    total: 63.45,
    deliveryAddress: '123 Main St, Anytown, ST 12345'
  },
  {
    id: '12343',
    date: '2024-12-08',
    status: 'cancelled',
    items: 3,
    total: 28.99,
    deliveryAddress: '123 Main St, Anytown, ST 12345'
  },
  {
    id: '12342',
    date: '2024-12-05',
    status: 'delivered',
    items: 12,
    total: 89.76,
    deliveryAddress: '123 Main St, Anytown, ST 12345'
  }
]

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
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          {mockOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Items</p>
                    <p className="font-medium">{order.items} items</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="font-medium text-sm">{order.deliveryAddress}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
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
                  {order.status === 'preparing' && (
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
          ))}
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
