'use client'

import { useState, useEffect } from 'react'
import AdminGuard from '@/components/admin/admin-guard'
import AdminLayout from '@/components/admin/admin-layout'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  revenue: {
    total: number
    growth: number
    trend: 'up' | 'down'
    monthly: Array<{ month: string; amount: number }>
  }
  orders: {
    total: number
    growth: number
    trend: 'up' | 'down'
    daily: Array<{ date: string; count: number }>
  }
  customers: {
    total: number
    growth: number
    trend: 'up' | 'down'
    new_this_month: number
  }
  products: {
    total: number
    top_selling: Array<{ name: string; sales: number; revenue: number }>
    low_stock: Array<{ name: string; stock: number }>
  }
  categories: {
    performance: Array<{ name: string; sales: number; revenue: number; growth: number }>
  }
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      // Mock data for now - replace with actual API call
      const mockAnalytics: AnalyticsData = {
        revenue: {
          total: 45678.90,
          growth: 12.5,
          trend: 'up',
          monthly: [
            { month: 'Jan', amount: 12000 },
            { month: 'Feb', amount: 15000 },
            { month: 'Mar', amount: 18000 },
            { month: 'Apr', amount: 22000 },
            { month: 'May', amount: 25000 },
            { month: 'Jun', amount: 28000 }
          ]
        },
        orders: {
          total: 1234,
          growth: 8.3,
          trend: 'up',
          daily: [
            { date: '2025-01-04', count: 45 },
            { date: '2025-01-05', count: 52 },
            { date: '2025-01-06', count: 38 },
            { date: '2025-01-07', count: 61 },
            { date: '2025-01-08', count: 49 },
            { date: '2025-01-09', count: 67 },
            { date: '2025-01-10', count: 58 }
          ]
        },
        customers: {
          total: 2567,
          growth: 15.2,
          trend: 'up',
          new_this_month: 89
        },
        products: {
          total: 156,
          top_selling: [
            { name: 'Organic Bananas', sales: 234, revenue: 1170 },
            { name: 'Fresh Milk', sales: 189, revenue: 945 },
            { name: 'Whole Wheat Bread', sales: 156, revenue: 468 },
            { name: 'Free Range Eggs', sales: 134, revenue: 670 },
            { name: 'Organic Apples', sales: 123, revenue: 615 }
          ],
          low_stock: [
            { name: 'Premium Olive Oil', stock: 3 },
            { name: 'Organic Quinoa', stock: 5 },
            { name: 'Almond Butter', stock: 7 }
          ]
        },
        categories: {
          performance: [
            { name: 'Fresh Produce', sales: 567, revenue: 12450, growth: 18.5 },
            { name: 'Dairy & Eggs', sales: 423, revenue: 8960, growth: 12.3 },
            { name: 'Bakery', sales: 234, revenue: 5670, growth: 8.7 },
            { name: 'Pantry Staples', sales: 189, revenue: 4230, growth: -2.1 },
            { name: 'Beverages', sales: 156, revenue: 3450, growth: 5.4 }
          ]
        }
      }
      
      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </AdminLayout>
      </AdminGuard>
    )
  }

  if (!analytics) {
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="text-center py-12">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No analytics data</h3>
            <p className="mt-1 text-sm text-gray-500">Analytics data will appear here once available.</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="mt-1 text-sm text-gray-500">
                Track your store performance and insights
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(analytics.revenue.total)}
                  </p>
                  <div className="flex items-center mt-2">
                    {analytics.revenue.trend === 'up' ? (
                      <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      analytics.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(analytics.revenue.growth)}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.orders.total}</p>
                  <div className="flex items-center mt-2">
                    {analytics.orders.trend === 'up' ? (
                      <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      analytics.orders.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(analytics.orders.growth)}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.customers.total}</p>
                  <div className="flex items-center mt-2">
                    {analytics.customers.trend === 'up' ? (
                      <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      analytics.customers.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(analytics.customers.growth)}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <UsersIcon className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.products.total}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {analytics.products.low_stock.length} low stock
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
              <div className="space-y-3">
                {analytics.revenue.monthly.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.month}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(item.amount / 30000) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-20 text-right">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h3>
              <div className="space-y-4">
                {analytics.products.top_selling.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sales} sold</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(product.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Category Performance</h3>
              <div className="space-y-4">
                {analytics.categories.performance.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{formatCurrency(category.revenue)}</span>
                        <span className={`text-xs font-medium ${
                          category.growth >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatPercentage(category.growth)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(category.sales / 600) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{category.sales} sales</span>
                      <span>{((category.sales / 600) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Low Stock Alert</h3>
              {analytics.products.low_stock.length > 0 ? (
                <div className="space-y-3">
                  {analytics.products.low_stock.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-red-600">Only {product.stock} left in stock</p>
                      </div>
                      <button className="text-xs bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition-colors">
                        Restock
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircleIcon className="mx-auto h-8 w-8 text-green-500" />
                  <p className="mt-2 text-sm text-gray-500">All products are well stocked</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Orders</h3>
            <div className="grid grid-cols-7 gap-2">
              {analytics.orders.daily.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="h-16 bg-gray-100 rounded flex items-end justify-center">
                    <div 
                      className="bg-blue-600 rounded-t w-full flex items-end justify-center text-white text-xs font-medium"
                      style={{ height: `${(day.count / 70) * 100}%`, minHeight: '20px' }}
                    >
                      {day.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}
