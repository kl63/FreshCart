'use client'
import ProductCard from '@/components/product/product-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockProducts, mockCategories } from '@/data/mock-products'

export default function ProductsPage() {
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
              {mockProducts.length} products available
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
          {mockProducts.map((product) => (
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
