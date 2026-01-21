'use client'
import { useEffect, useState } from 'react'
import ProductCard from '@/components/product/product-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockCategories } from '@/data/mock-products'
import { Product } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    let retryCount = 0
    const maxRetries = 3

    const fetchProducts = async () => {
      try {
        console.log(`🔄 Fetching products (attempt ${retryCount + 1}/${maxRetries})...`)
        
        const response = await fetch('/api/products?page=1&limit=100', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        })
        
        console.log('📡 Response status:', response.status, response.statusText)
        
        if (!mounted) return
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Loaded', data.length, 'products')
          
          if (mounted && Array.isArray(data)) {
            setProducts(data)
            setError(null)
            setLoading(false)
          } else if (retryCount < maxRetries - 1) {
            retryCount++
            console.log('⚠️ Invalid data, retrying...')
            setTimeout(() => fetchProducts(), 1000 * retryCount)
          } else {
            setError('Invalid data received from API')
            setLoading(false)
          }
        } else {
          if (retryCount < maxRetries - 1) {
            retryCount++
            console.log(`⚠️ Request failed, retrying in ${retryCount}s...`)
            setTimeout(() => fetchProducts(), 1000 * retryCount)
          } else {
            const errorData = await response.json().catch(() => ({}))
            console.error('❌ API error:', errorData)
            setError(`Failed to load products: ${response.status}`)
            setLoading(false)
          }
        }
      } catch (error) {
        console.error('❌ Failed to load products:', error)
        
        if (retryCount < maxRetries - 1) {
          retryCount++
          console.log(`⚠️ Error occurred, retrying in ${retryCount}s...`)
          setTimeout(() => fetchProducts(), 1000 * retryCount)
        } else {
          if (mounted) {
            setError(error instanceof Error ? error.message : 'Unknown error')
            setLoading(false)
          }
        }
      }
    }
    
    fetchProducts()
    
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h2>
          <p className="text-gray-600">Check console for details</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            All Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our complete selection of fresh groceries and everyday essentials
          </p>
          <div className="mt-6">
            <Badge variant="secondary" className="text-sm">
              {products.length} products available
            </Badge>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 justify-center">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option>All Categories</option>
              {mockCategories.map(category => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
              <option>Newest</option>
            </select>

            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option>All Products</option>
              <option>In Stock Only</option>
              <option>On Sale</option>
              <option>Organic</option>
              <option>Fresh</option>
            </select>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="outline" size="sm">All</Button>
            <Button variant="outline" size="sm">On Sale</Button>
            <Button variant="outline" size="sm">Organic</Button>
            <Button variant="outline" size="sm">Fresh</Button>
            <Button variant="outline" size="sm">Under $5</Button>
            <Button variant="outline" size="sm">Under $10</Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Quality You Can Trust
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🌱</div>
              <h3 className="font-semibold mb-2">Fresh & Organic</h3>
              <p className="text-gray-600 text-sm">
                Sourced from trusted farms and suppliers for maximum freshness
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600 text-sm">
                Every product is carefully selected and quality-checked
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🚚</div>
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">
                Same-day delivery available for orders placed before 2 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
