'use client'

import { useState, useEffect } from 'react'
import AdminGuard from '@/components/admin/admin-guard'
import AdminLayout from '@/components/admin/admin-layout'
import {
  Cog6ToothIcon,
  CurrencyDollarIcon,
  TruckIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  PhotoIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface StoreSettings {
  store_name: string
  store_description: string
  store_email: string
  store_phone: string
  store_address: string
  currency: string
  timezone: string
  tax_rate: number
  shipping_fee: number
  free_shipping_threshold: number
  logo_url: string
  favicon_url: string
}

interface NotificationSettings {
  email_notifications: boolean
  order_notifications: boolean
  low_stock_alerts: boolean
  customer_reviews: boolean
  marketing_emails: boolean
}

interface SecuritySettings {
  two_factor_auth: boolean
  login_attempts: number
  session_timeout: number
  password_requirements: {
    min_length: number
    require_uppercase: boolean
    require_lowercase: boolean
    require_numbers: boolean
    require_symbols: boolean
  }
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'store' | 'notifications' | 'security' | 'shipping'>('store')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    store_name: 'FreshCart',
    store_description: 'Your trusted online grocery store for fresh, quality products delivered to your door.',
    store_email: 'support@freshcart.com',
    store_phone: '+1-555-FRESH-01',
    store_address: '123 Market Street, Fresh City, FC 12345',
    currency: 'USD',
    timezone: 'America/New_York',
    tax_rate: 8.5,
    shipping_fee: 5.99,
    free_shipping_threshold: 50.00,
    logo_url: '/images/logo.png',
    favicon_url: '/images/favicon.ico'
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email_notifications: true,
    order_notifications: true,
    low_stock_alerts: true,
    customer_reviews: true,
    marketing_emails: false
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    two_factor_auth: false,
    login_attempts: 5,
    session_timeout: 30,
    password_requirements: {
      min_length: 8,
      require_uppercase: true,
      require_lowercase: true,
      require_numbers: true,
      require_symbols: false
    }
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API calls
      // Mock data is already set in state
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async (settingsType: 'store' | 'notifications' | 'security') => {
    try {
      setSaving(true)
      
      // TODO: Replace with actual API calls
      let settings
      switch (settingsType) {
        case 'store':
          settings = storeSettings
          break
        case 'notifications':
          settings = notificationSettings
          break
        case 'security':
          settings = securitySettings
          break
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'store', name: 'Store Settings', icon: Cog6ToothIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'shipping', name: 'Shipping', icon: TruckIcon }
  ]

  if (loading) {
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your store configuration and preferences
            </p>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div className={`rounded-md p-4 ${
              message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {message.type === 'success' ? (
                    <CheckIcon className="h-5 w-5 text-green-400" />
                  ) : (
                    <XMarkIcon className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    message.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {message.text}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Store Settings Tab */}
          {activeTab === 'store' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Store Information</h3>
                  <p className="mt-1 text-sm text-gray-500">Basic information about your store</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Store Name</label>
                    <input
                      type="text"
                      value={storeSettings.store_name}
                      onChange={(e) => setStoreSettings({...storeSettings, store_name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Store Email</label>
                    <input
                      type="email"
                      value={storeSettings.store_email}
                      onChange={(e) => setStoreSettings({...storeSettings, store_email: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Store Phone</label>
                    <input
                      type="tel"
                      value={storeSettings.store_phone}
                      onChange={(e) => setStoreSettings({...storeSettings, store_phone: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <select
                      value={storeSettings.currency}
                      onChange={(e) => setStoreSettings({...storeSettings, currency: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Store Description</label>
                    <textarea
                      rows={3}
                      value={storeSettings.store_description}
                      onChange={(e) => setStoreSettings({...storeSettings, store_description: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Store Address</label>
                    <textarea
                      rows={2}
                      value={storeSettings.store_address}
                      onChange={(e) => setStoreSettings({...storeSettings, store_address: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={storeSettings.tax_rate}
                      onChange={(e) => setStoreSettings({...storeSettings, tax_rate: parseFloat(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timezone</label>
                    <select
                      value={storeSettings.timezone}
                      onChange={(e) => setStoreSettings({...storeSettings, timezone: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => saveSettings('store')}
                    disabled={saving}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Store Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                  <p className="mt-1 text-sm text-gray-500">Choose which notifications you want to receive</p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'email_notifications', label: 'Email Notifications', description: 'Receive general email notifications' },
                    { key: 'order_notifications', label: 'Order Notifications', description: 'Get notified about new orders and order updates' },
                    { key: 'low_stock_alerts', label: 'Low Stock Alerts', description: 'Receive alerts when products are running low' },
                    { key: 'customer_reviews', label: 'Customer Reviews', description: 'Get notified when customers leave reviews' },
                    { key: 'marketing_emails', label: 'Marketing Emails', description: 'Receive marketing and promotional emails' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{item.label}</h4>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({
                          ...notificationSettings,
                          [item.key]: !notificationSettings[item.key as keyof NotificationSettings]
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notificationSettings[item.key as keyof NotificationSettings] ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notificationSettings[item.key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => saveSettings('notifications')}
                    disabled={saving}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Notification Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                  <p className="mt-1 text-sm text-gray-500">Configure security and authentication settings</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <button
                      onClick={() => setSecuritySettings({
                        ...securitySettings,
                        two_factor_auth: !securitySettings.two_factor_auth
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        securitySettings.two_factor_auth ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          securitySettings.two_factor_auth ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Max Login Attempts</label>
                      <input
                        type="number"
                        min="3"
                        max="10"
                        value={securitySettings.login_attempts}
                        onChange={(e) => setSecuritySettings({
                          ...securitySettings,
                          login_attempts: parseInt(e.target.value)
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        min="15"
                        max="480"
                        value={securitySettings.session_timeout}
                        onChange={(e) => setSecuritySettings({
                          ...securitySettings,
                          session_timeout: parseInt(e.target.value)
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Password Requirements</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Minimum Length</label>
                        <input
                          type="number"
                          min="6"
                          max="20"
                          value={securitySettings.password_requirements.min_length}
                          onChange={(e) => setSecuritySettings({
                            ...securitySettings,
                            password_requirements: {
                              ...securitySettings.password_requirements,
                              min_length: parseInt(e.target.value)
                            }
                          })}
                          className="mt-1 block w-32 border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      
                      {[
                        { key: 'require_uppercase', label: 'Require Uppercase Letters' },
                        { key: 'require_lowercase', label: 'Require Lowercase Letters' },
                        { key: 'require_numbers', label: 'Require Numbers' },
                        { key: 'require_symbols', label: 'Require Symbols' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{item.label}</span>
                          <button
                            onClick={() => setSecuritySettings({
                              ...securitySettings,
                              password_requirements: {
                                ...securitySettings.password_requirements,
                                [item.key]: !securitySettings.password_requirements[item.key as keyof typeof securitySettings.password_requirements]
                              }
                            })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              securitySettings.password_requirements[item.key as keyof typeof securitySettings.password_requirements] 
                                ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                securitySettings.password_requirements[item.key as keyof typeof securitySettings.password_requirements] 
                                  ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => saveSettings('security')}
                    disabled={saving}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Security Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Tab */}
          {activeTab === 'shipping' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Shipping Settings</h3>
                  <p className="mt-1 text-sm text-gray-500">Configure shipping rates and policies</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Standard Shipping Fee</label>
                    <div className="mt-1 relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={storeSettings.shipping_fee}
                        onChange={(e) => setStoreSettings({
                          ...storeSettings,
                          shipping_fee: parseFloat(e.target.value)
                        })}
                        className="pl-8 pr-3 py-2 block w-full border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Free Shipping Threshold</label>
                    <div className="mt-1 relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={storeSettings.free_shipping_threshold}
                        onChange={(e) => setStoreSettings({
                          ...storeSettings,
                          free_shipping_threshold: parseFloat(e.target.value)
                        })}
                        className="pl-8 pr-3 py-2 block w-full border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Orders above this amount get free shipping</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => saveSettings('store')}
                    disabled={saving}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Shipping Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}
