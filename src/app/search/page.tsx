'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/product/product-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockProducts, mockCategories } from '@/data/mock-products'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchResults, setSearchResults] = useState(mockProducts)
  const [filteredResults, setFilteredResults] = useState(mockProducts)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')
  const [filters, setFilters] = useState({
    inStock: false,
    onSale: false,
    organic: false,
    priceRange: 'all'
  })

  useEffect(() => {
    if (query) {
      const results = mockProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
      )
      setSearchResults(results)
      setFilteredResults(results)
    } else {
      setSearchResults(mockProducts)
      setFilteredResults(mockProducts)
    }
  }, [query])

  useEffect(() => {
    let results = [...searchResults]

    // Apply category filter
    if (selectedCategory !== 'all') {
      results = results.filter(product => 
        product.category.toLowerCase().replace(/[^a-z0-9]/g, '-') === selectedCategory ||
        (selectedCategory === 'organic' && product.isOrganic)
      )
    }

    // Apply other filters
    if (filters.inStock) {
      results = results.filter(product => product.inStock)
    }
    if (filters.onSale) {
      results = results.filter(product => product.isOnSale)
    }
    if (filters.organic) {
      results = results.filter(product => product.isOrganic)
    }

    // Apply price range filter
    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'under-5':
          results = results.filter(product => product.price < 5)
          break
        case '5-10':
          results = results.filter(product => product.price >= 5 && product.price <= 10)
          break
        case '10-20':
          results = results.filter(product => product.price > 10 && product.price <= 20)
          break
        case 'over-20':
          results = results.filter(product => product.price > 20)
          break
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        results.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
        // For demo purposes, reverse the order
        results.reverse()
        break
      default:
        // Keep relevance order (original search results order)
        break
    }

    setFilteredResults(results)
  }, [searchResults, selectedCategory, sortBy, filters])

  const handleFilterChange = (filterKey: string, value: boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {query ? `Search Results for "${query}"` : 'All Products'}
          </h1>
          <p className="text-gray-600">
            {filteredResults.length} product{filteredResults.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    All Categories
                  </label>
                  {mockCategories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.slug}
                        checked={selectedCategory === category.slug}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2"
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Product Type Filters */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Product Type</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                      className="mr-2"
                    />
                    In Stock Only
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.onSale}
                      onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                      className="mr-2"
                    />
                    On Sale
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.organic}
                      onChange={(e) => handleFilterChange('organic', e.target.checked)}
                      className="mr-2"
                    />
                    Organic
                  </label>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Prices</option>
                  <option value="under-5">Under $5</option>
                  <option value="5-10">$5 - $10</option>
                  <option value="10-20">$10 - $20</option>
                  <option value="over-20">Over $20</option>
                </select>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedCategory('all')
                  setFilters({
                    inStock: false,
                    onSale: false,
                    organic: false,
                    priceRange: 'all'
                  })
                  setSortBy('relevance')
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Sort Controls */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('all')}>
                    {mockCategories.find(c => c.slug === selectedCategory)?.name || selectedCategory} ×
                  </Badge>
                )}
                {filters.inStock && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('inStock', false)}>
                    In Stock ×
                  </Badge>
                )}
                {filters.onSale && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('onSale', false)}>
                    On Sale ×
                  </Badge>
                )}
                {filters.organic && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('organic', false)}>
                    Organic ×
                  </Badge>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  {query 
                    ? `No products match your search for "${query}"`
                    : 'Try adjusting your filters to see more results'
                  }
                </p>
                <Button
                  onClick={() => {
                    setSelectedCategory('all')
                    setFilters({
                      inStock: false,
                      onSale: false,
                      organic: false,
                      priceRange: 'all'
                    })
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search results...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}
