'use client'

import { useState, useEffect } from 'react'
import AdminGuard from '@/components/admin/admin-guard'
import AdminLayout from '@/components/admin/admin-layout'
import {
  MagnifyingGlassIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ShieldCheckIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  FunnelIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'

interface User {
  id: string // UUID from API
  username: string
  email: string
  first_name: string | null
  last_name: string | null
  phone?: string | null
  date_of_birth?: string | null
  is_admin: boolean
  is_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  last_login?: string | null
  full_name?: string | null
  orders_count?: number // Not in API, will be calculated separately
  total_spent?: number // Not in API, will be calculated separately
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [operationLoading, setOperationLoading] = useState<string | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    is_admin: false,
    is_verified: false,
    is_active: true
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'customer'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'verified' | 'unverified'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'created' | 'orders' | 'spent'>('created')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      // Get admin token for API authentication
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }
      
      console.log('Fetching users from API...')
      const response = await fetch('https://fastapi.kevinlinportfolio.com/api/v1/users/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Admin access required')
        }
        throw new Error(`Failed to fetch users: ${response.status}`)
      }
      
      const apiUsers = await response.json()
      console.log('Users fetched from API:', apiUsers)
      
      // Fetch all orders to calculate order counts and totals
      let ordersData: any[] = []
      try {
        const ordersResponse = await fetch('https://fastapi.kevinlinportfolio.com/api/v1/orders/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
          }
        })
        
        if (ordersResponse.ok) {
          ordersData = await ordersResponse.json()
          console.log('Orders fetched for user stats:', ordersData.length)
        }
      } catch (e) {
        console.error('Failed to fetch orders for user stats:', e)
      }
      
      // Calculate orders count and total spent per user
      const userOrderStats = ordersData.reduce((acc: any, order: any) => {
        const userId = order.user_id
        if (!acc[userId]) {
          acc[userId] = { count: 0, total: 0 }
        }
        acc[userId].count++
        acc[userId].total += order.total_amount || 0
        return acc
      }, {})
      
      // Transform API data to match our User interface
      const transformedUsers: User[] = apiUsers.map((apiUser: any) => ({
        id: apiUser.id,
        username: apiUser.username,
        email: apiUser.email,
        first_name: apiUser.first_name,
        last_name: apiUser.last_name,
        phone: apiUser.phone,
        date_of_birth: apiUser.date_of_birth,
        is_admin: apiUser.is_admin || false,
        is_verified: apiUser.is_verified || false,
        is_active: apiUser.is_active !== false,
        created_at: apiUser.created_at,
        updated_at: apiUser.updated_at,
        last_login: apiUser.last_login,
        full_name: apiUser.full_name,
        orders_count: userOrderStats[apiUser.id]?.count || 0,
        total_spent: userOrderStats[apiUser.id]?.total || 0
      }))
      
      setUsers(transformedUsers)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users
    .filter(user => {
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim()
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           fullName.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRole = roleFilter === 'all' || 
                         (roleFilter === 'admin' && user.is_admin) ||
                         (roleFilter === 'customer' && !user.is_admin)
      
      const matchesStatus = statusFilter === 'all' ||
                           (statusFilter === 'active' && user.is_active) ||
                           (statusFilter === 'inactive' && !user.is_active) ||
                           (statusFilter === 'verified' && user.is_verified) ||
                           (statusFilter === 'unverified' && !user.is_verified)
      
      return matchesSearch && matchesRole && matchesStatus
    })
    .sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'name':
          aValue = `${a.first_name} ${a.last_name}`
          bValue = `${b.first_name} ${b.last_name}`
          break
        case 'email':
          aValue = a.email
          bValue = b.email
          break
        case 'created':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        case 'orders':
          aValue = a.orders_count
          bValue = b.orders_count
          break
        case 'spent':
          aValue = a.total_spent
          bValue = b.total_spent
          break
        default:
          return 0
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const toggleUserStatus = async (userId: string, field: 'is_active' | 'is_admin' | 'is_verified') => {
    if (operationLoading) return // Prevent multiple operations
    
    setOperationLoading(`toggle-${userId}-${field}`)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const user = users.find(u => u.id === userId)
      if (!user) {
        throw new Error('User not found')
      }

      const newValue = !user[field]
      const requestBody = {
        email: user.email, // Required field
        [field]: newValue
      }
      console.log(`Updating user ${userId} ${field} to ${newValue}`)
      console.log('Request body:', requestBody)

      // Update user via API
      const response = await fetch(`https://fastapi.kevinlinportfolio.com/api/v1/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.log('Error response:', errorText)
        
        if (response.status === 401) {
          throw new Error('Unauthorized: Admin access required')
        }
        if (response.status === 404) {
          throw new Error('User not found')
        }
        if (response.status === 405) {
          throw new Error('Update functionality not available: PATCH /users/{id} endpoint needs to be implemented on the backend')
        }
        if (response.status === 422) {
          let errorMessage = 'Invalid request data'
          try {
            const errorData = JSON.parse(errorText)
            if (errorData.detail) {
              if (Array.isArray(errorData.detail)) {
                errorMessage = errorData.detail.map((err: any) => `${err.loc?.join('.')}: ${err.msg}`).join(', ')
              } else {
                errorMessage = errorData.detail
              }
            }
          } catch (e) {
            errorMessage = errorText || 'Invalid request format'
          }
          throw new Error(`Validation error: ${errorMessage}`)
        }
        throw new Error(`Failed to update user: ${response.status} - ${errorText}`)
      }

      const updatedUser = await response.json()
      console.log('User updated successfully:', updatedUser)

      // Update local state with API response
      setUsers(users.map(user => 
        user.id === userId ? { ...user, [field]: updatedUser[field] } : user
      ))

    } catch (error) {
      console.error(`Failed to update user ${field}:`, error)
      alert(`Failed to update user ${field}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setOperationLoading(null)
    }
  }

  const viewUserDetails = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (!user) {
      alert('User not found')
      return
    }

    const details = [
      `ID: ${user.id}`,
      `Username: ${user.username}`,
      `Email: ${user.email}`,
      `Name: ${user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : 'Not provided'}`,
      `Phone: ${user.phone || 'Not provided'}`,
      `Date of Birth: ${user.date_of_birth || 'Not provided'}`,
      `Admin: ${user.is_admin ? 'Yes' : 'No'}`,
      `Verified: ${user.is_verified ? 'Yes' : 'No'}`,
      `Active: ${user.is_active ? 'Yes' : 'No'}`,
      `Created: ${formatDate(user.created_at)}`,
      `Last Updated: ${formatDate(user.updated_at)}`,
      `Last Login: ${user.last_login ? formatDate(user.last_login) : 'Never'}`,
      `Orders: ${user.orders_count || 0}`,
      `Total Spent: ${formatCurrency(user.total_spent || 0)}`
    ]

    alert(`User Details:\n\n${details.join('\n')}`)
  }

  const openEditModal = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (!user) {
      alert('User not found')
      return
    }

    setEditingUser(user)
    setEditFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      date_of_birth: user.date_of_birth || '',
      is_admin: user.is_admin,
      is_verified: user.is_verified,
      is_active: user.is_active
    })
    setEditModalOpen(true)
  }

  const closeEditModal = () => {
    setEditModalOpen(false)
    setEditingUser(null)
    setEditFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      is_admin: false,
      is_verified: false,
      is_active: true
    })
  }

  const handleEditFormChange = (field: string, value: string | boolean) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const saveUserChanges = async () => {
    if (!editingUser || operationLoading) return

    setOperationLoading(`edit-${editingUser.id}`)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const updateData = {
        first_name: editFormData.first_name.trim() || null,
        last_name: editFormData.last_name.trim() || null,
        email: editFormData.email.trim(),
        phone: editFormData.phone.trim() || null,
        date_of_birth: editFormData.date_of_birth.trim() || null,
        is_admin: editFormData.is_admin,
        is_verified: editFormData.is_verified,
        is_active: editFormData.is_active
      }

      console.log(`Updating user ${editingUser.id}:`, updateData)

      const response = await fetch(`https://fastapi.kevinlinportfolio.com/api/v1/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.log('Error response:', errorText)
        
        if (response.status === 401) {
          throw new Error('Unauthorized: Admin access required')
        }
        if (response.status === 404) {
          throw new Error('User not found')
        }
        if (response.status === 422) {
          let errorMessage = 'Invalid request data'
          try {
            const errorData = JSON.parse(errorText)
            if (errorData.detail) {
              if (Array.isArray(errorData.detail)) {
                errorMessage = errorData.detail.map((err: any) => `${err.loc?.join('.')}: ${err.msg}`).join(', ')
              } else {
                errorMessage = errorData.detail
              }
            }
          } catch (e) {
            errorMessage = errorText || 'Invalid request format'
          }
          throw new Error(`Validation error: ${errorMessage}`)
        }
        throw new Error(`Failed to update user: ${response.status} - ${errorText}`)
      }

      const updatedUser = await response.json()
      console.log('User updated successfully:', updatedUser)

      // Update local state with API response
      setUsers(users.map(u => 
        u.id === editingUser.id ? { ...u, ...updatedUser } : u
      ))

      closeEditModal()
      alert('User updated successfully!')
      
    } catch (error) {
      console.error('Failed to update user:', error)
      alert(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setOperationLoading(null)
    }
  }

  const deleteUser = async (userId: string) => {
    if (operationLoading) return // Prevent multiple operations
    
    const user = users.find(u => u.id === userId)
    const userName = user ? (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username) : 'this user'
    
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return
    }
    
    setOperationLoading(`delete-${userId}`)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      console.log(`Deleting user ${userId}`)

      // Delete user via API
      const response = await fetch(`https://fastapi.kevinlinportfolio.com/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Admin access required')
        }
        if (response.status === 404) {
          throw new Error('User not found')
        }
        if (response.status === 403) {
          throw new Error('Forbidden: Cannot delete this user')
        }
        throw new Error(`Failed to delete user: ${response.status}`)
      }

      console.log('User deleted successfully')

      // Remove user from local state
      setUsers(users.filter(user => user.id !== userId))
      
      alert(`User ${userName} has been deleted successfully.`)
      
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setOperationLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </AdminLayout>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Users</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage user accounts and permissions
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Export Users
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShieldCheckIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Admins</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.is_admin).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <EnvelopeIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Verified</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.is_verified).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.is_active).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by name, username, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admins</option>
                  <option value="customer">Customers</option>
                </select>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
                
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-')
                    setSortBy(field as any)
                    setSortOrder(order as any)
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="created-desc">Newest First</option>
                  <option value="created-asc">Oldest First</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="email-asc">Email A-Z</option>
                  <option value="orders-desc">Most Orders</option>
                  <option value="spent-desc">Highest Spent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name && user.last_name 
                                ? `${user.first_name} ${user.last_name}` 
                                : user.first_name || user.last_name || 'No Name'}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                        {user.phone && (
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.is_admin 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.is_admin ? 'Admin' : 'Customer'}
                          </span>
                          <div className="flex space-x-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_verified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.is_verified ? 'Verified' : 'Unverified'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.orders_count || 0} orders</div>
                        <div className="text-sm text-gray-500">{formatCurrency(user.total_spent || 0)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => viewUserDetails(user.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => openEditModal(user.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit User"
                            disabled={operationLoading === `edit-${user.id}`}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user.id, 'is_active')}
                            className={`${user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                            title={user.is_active ? 'Deactivate' : 'Activate'}
                            disabled={operationLoading === `toggle-${user.id}-is_active`}
                          >
                            {operationLoading === `toggle-${user.id}-is_active` ? '⏳' : (user.is_active ? '🔒' : '🔓')}
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user.id, 'is_admin')}
                            className={`${user.is_admin ? 'text-purple-600 hover:text-purple-900' : 'text-gray-400 hover:text-purple-600'}`}
                            title={user.is_admin ? 'Remove Admin' : 'Make Admin'}
                            disabled={operationLoading === `toggle-${user.id}-is_admin`}
                          >
                            <ShieldCheckIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user.id, 'is_verified')}
                            className={`${user.is_verified ? 'text-green-600 hover:text-green-900' : 'text-gray-400 hover:text-green-600'}`}
                            title={user.is_verified ? 'Unverify User' : 'Verify User'}
                            disabled={operationLoading === `toggle-${user.id}-is_verified`}
                          >
                            <CheckBadgeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete User"
                            disabled={operationLoading === `delete-${user.id}`}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Users will appear here once they register.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>

      {/* Edit User Modal */}
      {editModalOpen && editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Edit User: {editingUser.username}
                </h3>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.first_name}
                    onChange={(e) => handleEditFormChange('first_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter first name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.last_name}
                    onChange={(e) => handleEditFormChange('last_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter last name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => handleEditFormChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => handleEditFormChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Date of Birth */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={editFormData.date_of_birth}
                    onChange={(e) => handleEditFormChange('date_of_birth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Status Toggles */}
              <div className="border-t pt-4 mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">User Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Active Status */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={editFormData.is_active}
                      onChange={(e) => handleEditFormChange('is_active', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>

                  {/* Admin Status */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_admin"
                      checked={editFormData.is_admin}
                      onChange={(e) => handleEditFormChange('is_admin', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-900">
                      Admin
                    </label>
                  </div>

                  {/* Verified Status */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_verified"
                      checked={editFormData.is_verified}
                      onChange={(e) => handleEditFormChange('is_verified', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_verified" className="ml-2 block text-sm text-gray-900">
                      Verified
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={operationLoading === `edit-${editingUser.id}`}
                >
                  Cancel
                </button>
                <button
                  onClick={saveUserChanges}
                  disabled={operationLoading === `edit-${editingUser.id}`}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {operationLoading === `edit-${editingUser.id}` ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminGuard>
  )
}
