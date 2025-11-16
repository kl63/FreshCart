'use client'

import { useEffect, useState } from 'react'
import AdminGuard from '@/components/admin/admin-guard'
import AdminLayout from '@/components/admin/admin-layout'
import {
  ShoppingBagIcon,
  TagIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalProducts: number
  totalCategories: number
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  monthlyGrowth: number
  activeUsers: number
  pendingOrders: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeUsers: 0,
    pendingOrders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading dashboard stats
    // In a real app, you'd fetch this from your API
    setTimeout(() => {
      setStats({
        totalProducts: 156,
        totalCategories: 8,
        totalUsers: 1247,
        totalOrders: 892,
        totalRevenue: 45670.50,
        monthlyGrowth: 12.5,
        activeUsers: 89,
        pendingOrders: 23
      })
      setLoading(false)
    }, 1000)
  }, [])

  const statCards = [
    {
      name: 'Total Products',
      value: stats.totalProducts,
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
      change: '+4.75%',
      changeType: 'positive'
    },
    {
      name: 'Categories',
      value: stats.totalCategories,
      icon: TagIcon,
      color: 'bg-green-500',
      change: '+2.02%',
      changeType: 'positive'
    },
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'bg-purple-500',
      change: '+8.12%',
      changeType: 'positive'
    },
    {
      name: 'Total Orders',
      value: stats.totalOrders,
      icon: ClipboardDocumentListIcon,
      color: 'bg-orange-500',
      change: '+3.48%',
      changeType: 'positive'
    },
    {
      name: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-emerald-500',
      change: `+${stats.monthlyGrowth}%`,
      changeType: 'positive'
    },
    {
      name: 'Active Users',
      value: stats.activeUsers,
      icon: EyeIcon,
      color: 'bg-indigo-500',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      name: 'Pending Orders',
      value: stats.pendingOrders,
      icon: ShoppingCartIcon,
      color: 'bg-red-500',
      change: '-2.1%',
      changeType: 'negative'
    },
    {
      name: 'Growth Rate',
      value: `${stats.monthlyGrowth}%`,
      icon: ArrowTrendingUpIcon,
      color: 'bg-teal-500',
      change: '+1.2%',
      changeType: 'positive'
    }
  ]

  if (loading) {
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-gray-300 rounded w-24 mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-12"></div>
                </div>
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
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome to your FreshCart admin dashboard. Here&apos;s what&apos;s happening with your store today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                <div className="text-center">
                  <ShoppingBagIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">Add Product</span>
                </div>
              </button>
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                <div className="text-center">
                  <TagIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">Add Category</span>
                </div>
              </button>
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                <div className="text-center">
                  <ClipboardDocumentListIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">View Orders</span>
                </div>
              </button>
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                <div className="text-center">
                  <UsersIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">Manage Users</span>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <ShoppingBagIcon className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">New product &quot;Organic Apples&quot; was added</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <ClipboardDocumentListIcon className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Order #1234 was completed</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <UsersIcon className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">New user registered: john@example.com</p>
                  <p className="text-xs text-gray-500">10 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}
