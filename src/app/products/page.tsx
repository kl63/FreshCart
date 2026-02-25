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
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [filterType, setFilterType] = useState('all')

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

  // Filter products based on search, category, and special filters
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Category filter
    if (selectedCategory !== 'all') {
      const categoryName = typeof product.category === 'object' ? product.category?.name : product.category
      if (categoryName !== selectedCategory) {
        return false
      }
    }

    // Special filters
    if (filterType === 'on-sale' && !product.is_on_sale) return false
    if (filterType === 'organic' && !product.is_organic) return false
    if (filterType === 'in-stock' && !product.in_stock) return false
    if (filterType === 'under-5' && product.price >= 5) return false
    if (filterType === 'under-10' && product.price >= 10) return false

    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return (b.rating_average || 0) - (a.rating_average || 0)
      case 'newest':
        // Sort by created_at if available, otherwise treat as equal
        const dateA = (a as any).created_at ? new Date((a as any).created_at).getTime() : 0
        const dateB = (b as any).created_at ? new Date((b as any).created_at).getTime() : 0
        return dateB - dateA
      default: // featured
        // Prioritize featured products if the field exists
        const aFeatured = (a as any).is_featured ? 1 : 0
        const bFeatured = (b as any).is_featured ? 1 : 0
        return bFeatured - aFeatured
    }
  })

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
              {sortedProducts.length} of {products.length} products
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 justify-center">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {mockCategories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
            </select>

            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Products</option>
              <option value="in-stock">In Stock Only</option>
              <option value="on-sale">On Sale</option>
              <option value="organic">Organic</option>
            </select>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button 
              variant={filterType === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilterType('all')}
            >
              All
            </Button>
            <Button 
              variant={filterType === 'on-sale' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilterType('on-sale')}
            >
              On Sale
            </Button>
            <Button 
              variant={filterType === 'organic' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilterType('organic')}
            >
              Organic
            </Button>
            <Button 
              variant={filterType === 'in-stock' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilterType('in-stock')}
            >
              In Stock
            </Button>
            <Button 
              variant={filterType === 'under-5' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilterType('under-5')}
            >
              Under $5
            </Button>
            <Button 
              variant={filterType === 'under-10' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilterType('under-10')}
            >
              Under $10
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search term</p>
            <Button onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
              setFilterType('all')
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

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
