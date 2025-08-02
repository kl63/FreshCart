import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Account Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Account Menu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  Profile Information
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Order History
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Addresses
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Payment Methods
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Preferences
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Loyalty Program
                </Button>
                <Button variant="ghost" className="w-full justify-start text-red-600">
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">JD</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">John Doe</h3>
                    <p className="text-gray-600">john.doe@example.com</p>
                    <Badge variant="success" className="mt-1">Verified</Badge>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="john.doe@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <Button className="mt-4 bg-green-600 hover:bg-green-700">
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            {/* Loyalty Program */}
            <Card>
              <CardHeader>
                <CardTitle>FreshCart Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Silver Member</h3>
                    <p className="text-gray-600">1,250 points available</p>
                  </div>
                  <Badge variant="secondary" className="bg-gray-200">
                    Silver
                  </Badge>
                </div>
                
                <div className="bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '62%' }}></div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Spend $750 more to reach Gold status and unlock exclusive benefits!
                </p>
                
                <Button variant="outline">
                  View Rewards
                </Button>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold">Order #12345</p>
                      <p className="text-sm text-gray-600">Delivered on Dec 15, 2024</p>
                      <p className="text-sm text-gray-600">5 items • $47.82</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="success">Delivered</Badge>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold">Order #12344</p>
                      <p className="text-sm text-gray-600">Delivered on Dec 12, 2024</p>
                      <p className="text-sm text-gray-600">8 items • $63.45</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="success">Delivered</Badge>
                      <Button variant="outline" size="sm" className="mt-2">
                        Reorder
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  View All Orders
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                    <div className="text-2xl mb-2">📍</div>
                    <span>Manage Addresses</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                    <div className="text-2xl mb-2">💳</div>
                    <span>Payment Methods</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                    <div className="text-2xl mb-2">❤️</div>
                    <span>My Wishlist</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                    <div className="text-2xl mb-2">🔔</div>
                    <span>Notifications</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
