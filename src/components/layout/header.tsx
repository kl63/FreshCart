'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCartIcon, UserIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '@/store/cart'

const navigation = [
  { name: 'Fresh Produce', href: '/categories/produce' },
  { name: 'Meat & Seafood', href: '/categories/meat-seafood' },
  { name: 'Dairy & Eggs', href: '/categories/dairy' },
  { name: 'Bakery', href: '/categories/bakery' },
  { name: 'Pantry', href: '/categories/pantry' },
  { name: 'Frozen', href: '/categories/frozen' },
  { name: 'Organic', href: '/categories/organic' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { getItemCount } = useCartStore()
  const cartItemCount = getItemCount()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      {/* Top banner */}
      <div className="bg-green-600 text-white py-2 px-4 text-center text-sm">
        🚚 Free delivery on orders over $35 • Same-day delivery available
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🛒</span>
              </div>
              <span className="text-2xl font-bold text-green-600">FreshCart</span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for fresh groceries, organic produce..."
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile search */}
            <button className="md:hidden p-2 text-gray-600 hover:text-green-600">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* Account */}
            <Link href="/account" className="flex items-center space-x-1 text-gray-600 hover:text-green-600">
              <UserIcon className="h-6 w-6" />
              <span className="hidden sm:block text-sm">Account</span>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative flex items-center space-x-1 text-gray-600 hover:text-green-600">
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="hidden sm:block text-sm">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-green-600"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-8 py-4 border-t border-gray-100">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          {/* Mobile search */}
          <div className="px-4 py-3 border-b border-gray-100">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search groceries..."
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Mobile navigation */}
          <nav className="px-4 py-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-gray-700 hover:text-green-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
