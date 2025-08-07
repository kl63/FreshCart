'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCartIcon, UserIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '@/store/cart'
import { fetchAllCategories } from '@/lib/categories'
import { Category } from '@/types'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { getItemCount } = useCartStore()
  const cartItemCount = getItemCount()

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true)
        const fetchedCategories = await fetchAllCategories()
        // Show first 6 categories in navigation
        setCategories(fetchedCategories.slice(0, 6))
      } catch (err) {
        console.error('Error loading categories for navigation:', err)
        // Fallback to empty array if API fails
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

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
        <nav className="hidden md:flex items-center space-x-8 py-4 border-t border-gray-100">
          <Link
            href="/"
            className="text-gray-700 hover:text-green-600 font-medium transition-colors"
          >
            Home
          </Link>
          
          {/* Categories Dropdown */}
          <div className="relative group">
            <button className="flex items-center text-gray-700 hover:text-green-600 font-medium transition-colors">
              Categories
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="px-4 py-2">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))
                ) : (
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))
                )}
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <Link
                    href="/categories"
                    className="block px-4 py-2 text-sm text-green-600 hover:bg-green-50 font-medium"
                  >
                    View All Categories →
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <Link
            href="/products"
            className="text-gray-700 hover:text-green-600 font-medium transition-colors"
          >
            Products
          </Link>
          
          <Link
            href="/deals"
            className="text-gray-700 hover:text-green-600 font-medium transition-colors"
          >
            Deals
          </Link>
          
          <Link
            href="/about"
            className="text-gray-700 hover:text-green-600 font-medium transition-colors"
          >
            About
          </Link>
          
          <Link
            href="/contact"
            className="text-gray-700 hover:text-green-600 font-medium transition-colors"
          >
            Contact
          </Link>
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
            <Link
              href="/"
              className="block py-3 text-gray-700 hover:text-green-600 font-medium border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            <Link
              href="/products"
              className="block py-3 text-gray-700 hover:text-green-600 font-medium border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            
            <Link
              href="/deals"
              className="block py-3 text-gray-700 hover:text-green-600 font-medium border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Deals
            </Link>
            
            {/* Categories Section */}
            <div className="py-2">
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Categories
              </div>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-8 bg-gray-200 rounded animate-pulse mb-1" />
                ))
              ) : (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="block py-2 pl-4 text-gray-600 hover:text-green-600 text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))
              )}
              <Link
                href="/categories"
                className="block py-2 pl-4 text-green-600 hover:text-green-700 font-medium text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                View All Categories →
              </Link>
            </div>
            
            <Link
              href="/about"
              className="block py-3 text-gray-700 hover:text-green-600 font-medium border-t border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            
            <Link
              href="/contact"
              className="block py-3 text-gray-700 hover:text-green-600 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
