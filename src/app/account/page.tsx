'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AuthService, type User } from '@/lib/auth'

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  created_at: string
  updated_at: string
}

interface Address {
  id: string
  type: string
  first_name: string
  last_name: string
  street: string
  city: string
  state: string
  zip_code: string
  country: string
  is_default: boolean
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [addressError, setAddressError] = useState('')
  const [activeSection, setActiveSection] = useState('profile') // 'profile', 'orders', 'addresses'
  const [addressFormData, setAddressFormData] = useState({
    type: 'shipping',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'USA'
  })
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    username: '',
    date_of_birth: ''
  })
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      console.log('Account page: Checking authentication...')
      
      // Don't clear data immediately - let's see what we have first
      const token = AuthService.getToken()
      const userData = AuthService.getUser()
      
      console.log('Account page: Token exists:', !!token)
      console.log('Account page: User data exists:', !!userData)
      console.log('Account page: Token value:', token)
      console.log('Account page: User data:', userData)
      
      const isAuthenticated = AuthService.isAuthenticated()
      console.log('Account page: isAuthenticated result:', isAuthenticated)
      
      if (!isAuthenticated) {
        console.log('Account page: Not authenticated, redirecting to login')
        router.push('/auth/login')
        return
      }
      
      if (!userData) {
        console.log('Account page: No user data, redirecting to login')
        router.push('/auth/login')
        return
      }
      
      console.log('Account page: Authentication successful, showing user data')
      setUser(userData)
      
      // Initialize form data with user data
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        username: userData.username || '',
        date_of_birth: userData.date_of_birth || ''
      })
      
      setIsLoading(false)
    }

    // Add a small delay to allow data to be stored
    setTimeout(checkAuth, 100)
  }, [router])

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      const token = AuthService.getToken()
      if (!token) return

      try {
        setIsLoadingOrders(true)
        const response = await fetch('https://fastapi.kevinlinportfolio.com/api/v1/orders/?limit=5', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setOrders(data.items || data || [])
        } else {
          console.error('Failed to fetch orders:', response.status)
          setOrders([])
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        setOrders([])
      } finally {
        setIsLoadingOrders(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user])

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      const token = AuthService.getToken()
      if (!token) return

      try {
        setIsLoadingAddresses(true)
        const response = await fetch('https://fastapi.kevinlinportfolio.com/api/v1/addresses/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setAddresses(data || [])
        } else {
          console.error('Failed to fetch addresses:', response.status)
          setAddresses([])
        }
      } catch (error) {
        console.error('Error fetching addresses:', error)
        setAddresses([])
      } finally {
        setIsLoadingAddresses(false)
      }
    }

    if (user) {
      fetchAddresses()
    }
  }, [user])

  const handleSignOut = async () => {
    await AuthService.logout()
    router.push('/')
  }

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAddressFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (addressError) setAddressError('')
  }

  const handleAddAddress = async () => {
    setIsAddingAddress(true)
    setAddressError('')
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setAddressError('No authentication token found')
        return
      }
      
      const response = await fetch('https://fastapi.kevinlinportfolio.com/api/v1/addresses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressFormData)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to add address')
      }
      
      const newAddress = await response.json()
      setAddresses([...addresses, newAddress])
      setShowAddressForm(false)
      setAddressFormData({
        type: 'shipping',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'USA'
      })
      
    } catch (error) {
      console.error('Address creation error:', error)
      setAddressError(error instanceof Error ? error.message : 'Failed to add address')
    } finally {
      setIsAddingAddress(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear messages when user starts typing
    if (updateError) setUpdateError('')
    if (updateSuccess) setUpdateSuccess('')
  }
  
  const handleUpdateProfile = async () => {
    setIsUpdating(true)
    setUpdateError('')
    setUpdateSuccess('')
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setUpdateError('No authentication token found')
        return
      }
      
      console.log('=== UPDATING PROFILE ===')
      console.log('Form data:', formData)
      
      const response = await fetch('https://fastapi.kevinlinportfolio.com/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      console.log('=== UPDATE RESPONSE DETAILS ===')
      console.log('Status:', response.status)
      console.log('Status Text:', response.statusText)
      console.log('Headers:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        const error = await response.json()
        console.error('Update error:', error)
        throw new Error(error.detail || 'Failed to update profile')
      }
      
      const updatedUser = await response.json()
      console.log('=== UPDATED USER DATA FROM API ===')
      console.log('Full response:', JSON.stringify(updatedUser, null, 2))
      
      // Compare original vs updated data
      console.log('=== DATA COMPARISON ===')
      console.log('Original user:', user)
      console.log('Form data sent:', formData)
      console.log('Response received:', updatedUser)
      
      // Update local storage and state
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      setUpdateSuccess('Profile updated successfully!')
      
    } catch (error) {
      console.error('Profile update error:', error)
      setUpdateError(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsUpdating(false)
    }
  }

  const getInitials = (firstName: string | null | undefined, lastName: string | null | undefined) => {
    const firstInitial = firstName && firstName.length > 0 ? firstName.charAt(0) : '';
    const lastInitial = lastName && lastName.length > 0 ? lastName.charAt(0) : '';
    
    if (!firstInitial && !lastInitial) {
      return 'U'; // Default to 'U' for User if no initials available
    }
    
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your account...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

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
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${activeSection === 'profile' ? 'bg-green-50 text-green-600' : ''}`}
                  onClick={() => setActiveSection('profile')}
                >
                  Profile Information
                </Button>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${activeSection === 'orders' ? 'bg-green-50 text-green-600' : ''}`}
                  onClick={() => setActiveSection('orders')}
                >
                  Order History
                </Button>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${activeSection === 'addresses' ? 'bg-green-50 text-green-600' : ''}`}
                  onClick={() => setActiveSection('addresses')}
                >
                  Addresses
                </Button>
                
                {/* Admin Menu Items */}
                {user?.is_admin && (
                  <>
                    <div className="pt-4 pb-2 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 px-3">ADMIN</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => router.push('/admin/products')}
                    >
                      📦 Manage Products
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => router.push('/admin/users')}
                    >
                      👥 Manage Customers
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => router.push('/admin/orders')}
                    >
                      📋 Manage Orders
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => router.push('/admin')}
                    >
                      🎯 Admin Dashboard
                    </Button>
                  </>
                )}
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            {activeSection === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">
                      {getInitials(user.first_name, user.last_name)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{user.first_name} {user.last_name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex gap-2 mt-1">
                      {user.is_verified ? (
                        <Badge variant="success">Verified</Badge>
                      ) : (
                        <Badge variant="secondary">Unverified</Badge>
                      )}
                      {user.is_admin && <Badge className="bg-purple-600">Admin</Badge>}
                      {!user.is_active && <Badge variant="destructive">Inactive</Badge>}
                    </div>
                  </div>
                </div>
                
                {/* Success/Error Messages */}
                {updateSuccess && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    {updateSuccess}
                  </div>
                )}
                {updateError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {updateError}
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      title="Username cannot be changed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Account Information</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Member since:</span>
                      <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Last login:</span>
                      <p className="font-medium">{new Date(user.last_login).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Account ID:</span>
                      <p className="font-medium font-mono text-xs">{user.id}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <p className="font-medium">{user.is_active ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="mt-4 bg-green-600 hover:bg-green-700"
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </Button>
              </CardContent>
            </Card>
            )}

            {/* Recent Orders */}
            {activeSection === 'orders' && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No orders yet</p>
                    <Button variant="outline" className="mt-4" onClick={() => router.push('/products')}>
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-semibold">Order #{order.order_number}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                            <p className="text-sm text-gray-600">${order.total_amount.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={
                                order.status === 'delivered' ? 'success' : 
                                order.status === 'pending' ? 'secondary' : 
                                order.status === 'processing' ? 'default' : 
                                'destructive'
                              }
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => router.push(`/order/${order.id}/success`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full mt-4" onClick={() => router.push('/orders')}>
                      View All Orders
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
            )}

            {/* Saved Addresses */}
            {activeSection === 'addresses' && (
            <Card>
              <CardHeader>
                <CardTitle>Saved Addresses</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingAddresses ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading addresses...</p>
                  </div>
                ) : (
                  <>
                    {/* Address Form */}
                    {showAddressForm && (
                      <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50">
                        <h3 className="font-semibold mb-4">Add New Address</h3>
                        
                        {addressError && (
                          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {addressError}
                          </div>
                        )}
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Address Type
                            </label>
                            <select
                              name="type"
                              value={addressFormData.type}
                              onChange={handleAddressInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                              <option value="shipping">Shipping</option>
                              <option value="billing">Billing</option>
                            </select>
                          </div>
                          <div></div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="first_name"
                              value={addressFormData.first_name}
                              onChange={handleAddressInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="last_name"
                              value={addressFormData.last_name}
                              onChange={handleAddressInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={addressFormData.email}
                              onChange={handleAddressInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={addressFormData.phone}
                              onChange={handleAddressInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Street Address
                            </label>
                            <input
                              type="text"
                              name="street"
                              value={addressFormData.street}
                              onChange={handleAddressInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={addressFormData.city}
                              onChange={handleAddressInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              State
                            </label>
                            <input
                              type="text"
                              name="state"
                              value={addressFormData.state}
                              onChange={handleAddressInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ZIP Code
                            </label>
                            <input
                              type="text"
                              name="zip_code"
                              value={addressFormData.zip_code}
                              onChange={handleAddressInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Country
                            </label>
                            <input
                              type="text"
                              name="country"
                              value={addressFormData.country}
                              onChange={handleAddressInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={handleAddAddress}
                            disabled={isAddingAddress}
                          >
                            {isAddingAddress ? 'Adding...' : 'Add Address'}
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => setShowAddressForm(false)}
                            disabled={isAddingAddress}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Existing Addresses */}
                    {addresses.length === 0 && !showAddressForm ? (
                      <div className="text-center py-8">
                        <p className="text-gray-600">No saved addresses</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setShowAddressForm(true)}
                        >
                          Add Address
                        </Button>
                      </div>
                    ) : addresses.length > 0 ? (
                      <>
                        <div className="space-y-4">
                          {addresses.map((address) => (
                            <div key={address.id} className="p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <p className="font-semibold">{address.type.charAt(0).toUpperCase() + address.type.slice(1)} Address</p>
                                    {address.is_default && (
                                      <Badge variant="secondary">Default</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-900">{address.first_name} {address.last_name}</p>
                                  <p className="text-sm text-gray-600">{address.street}</p>
                                  <p className="text-sm text-gray-600">
                                    {address.city}, {address.state} {address.zip_code}
                                  </p>
                                  <p className="text-sm text-gray-600">{address.country}</p>
                                </div>
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {!showAddressForm && (
                          <Button 
                            variant="outline" 
                            className="w-full mt-4"
                            onClick={() => setShowAddressForm(true)}
                          >
                            Add New Address
                          </Button>
                        )}
                      </>
                    ) : null}
                  </>
                )}
              </CardContent>
            </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center"
                    onClick={() => router.push('/cart')}
                  >
                    <div className="text-2xl mb-2">🛒</div>
                    <span>View Cart</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center"
                    onClick={() => router.push('/orders')}
                  >
                    <div className="text-2xl mb-2">📦</div>
                    <span>My Orders</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center"
                    onClick={() => router.push('/products')}
                  >
                    <div className="text-2xl mb-2">🛍️</div>
                    <span>Shop Products</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center"
                    onClick={() => router.push('/deals')}
                  >
                    <div className="text-2xl mb-2">🔥</div>
                    <span>View Deals</span>
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
