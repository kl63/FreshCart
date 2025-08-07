'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/product/product-card'
import { Badge } from '@/components/ui/badge'
import { fetchAllCategories } from '@/lib/categories'
import { fetchProductsByCategory } from '@/lib/products'
import { Category, Product } from '@/types'
import Image from 'next/image'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!slug) return

    async function loadCategoryData() {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all categories to find the one with matching slug
        const categories = await fetchAllCategories()
        const foundCategory = categories.find(cat => cat.slug === slug)
        
        if (!foundCategory) {
          notFound()
          return
        }
        
        setCategory(foundCategory)
        
        // Fetch products for this category
        const categoryProducts = await fetchProductsByCategory(foundCategory.id)
        setProducts(categoryProducts)
      } catch (err) {
        console.error('Error loading category data:', err)
        setError('Failed to load category data')
      } finally {
        setLoading(false)
      }
    }

    loadCategoryData()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-300 rounded w-32 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    notFound()
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="text-center mb-12">
          {category.image ? (
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="text-6xl mb-4">{category.icon || '📦'}</div>
          )}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            {category.description}
          </p>
          <div className="flex justify-center items-center space-x-4">
            <Badge variant="secondary" className="text-sm">
              {products.length} products available
            </Badge>
            {category.is_featured && (
              <Badge variant="organic" className="text-sm">
                Featured Category
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
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: Product) => (
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
              We&apos;re working on adding more products to this category.
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
            {slug === 'produce' && (
              <p className="mt-4">
                Our produce is delivered fresh daily from local farms and trusted suppliers. 
                We guarantee the quality and freshness of all our fruits and vegetables.
              </p>
            )}
            {slug === 'organic' && (
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
