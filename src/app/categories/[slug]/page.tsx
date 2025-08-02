import { notFound } from 'next/navigation'
import ProductCard from '@/components/product/product-card'
import { Badge } from '@/components/ui/badge'
import { mockCategories, mockProducts } from '@/data/mock-products'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = mockCategories.find(cat => cat.slug === params.slug)
  
  if (!category) {
    notFound()
  }

  // Filter products by category
  const categoryProducts = mockProducts.filter(product => 
    product.category.toLowerCase().replace(/[^a-z0-9]/g, '-') === params.slug ||
    (params.slug === 'organic' && product.isOrganic)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{category.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            {category.description}
          </p>
          <div className="flex justify-center items-center space-x-4">
            <Badge variant="secondary" className="text-sm">
              {categoryProducts.length} products available
            </Badge>
            {params.slug === 'organic' && (
              <Badge variant="organic" className="text-sm">
                Certified Organic
              </Badge>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
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
          </select>
        </div>

        {/* Products Grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              We're working on adding more products to this category.
            </p>
          </div>
        )}

        {/* Category Info */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            About {category.name}
          </h2>
          <div className="prose max-w-none text-gray-600">
            <p>
              Discover our premium selection of {category.name.toLowerCase()}. 
              We source only the finest quality products to ensure freshness and taste 
              in every item. Our {category.name.toLowerCase()} section features both 
              conventional and organic options to meet all your dietary needs.
            </p>
            {params.slug === 'produce' && (
              <p className="mt-4">
                Our produce is delivered fresh daily from local farms and trusted suppliers. 
                We guarantee the quality and freshness of all our fruits and vegetables.
              </p>
            )}
            {params.slug === 'organic' && (
              <p className="mt-4">
                All organic products are certified by USDA and meet strict organic standards. 
                No synthetic pesticides, herbicides, or fertilizers are used in their production.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
