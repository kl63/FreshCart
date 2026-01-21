'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { fetchAllCategories } from '@/lib/categories'
import { fetchProducts } from '@/lib/products'
import { Category } from '@/types'
import { useEffect, useState } from 'react'

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [productCounts, setProductCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true)
        const [fetchedCategories, products] = await Promise.all([
          fetchAllCategories(),
          fetchProducts({ limit: 100 })
        ])
        
        // Calculate actual product counts by category
        const counts: Record<string, number> = {}
        console.log('📊 Calculating product counts. Total products:', products.length)
        products.forEach(product => {
          let categoryId: string | null = null
          
          // Check if product has category object
          if (product.category && typeof product.category === 'object') {
            categoryId = product.category.id
          } 
          // Fallback to category_id field
          else if (product.category_id) {
            categoryId = product.category_id
          }
          
          if (categoryId) {
            counts[categoryId] = (counts[categoryId] || 0) + 1
          }
        })
        
        console.log('📊 Product counts by category:', counts)
        
        // Filter categories to only show ones with products, sorted by product count
        const categoriesWithProducts = fetchedCategories
          .filter(cat => counts[cat.id] && counts[cat.id] > 0)
          .sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0))
          .slice(0, 8)
        
        console.log('📊 Categories with products:', categoriesWithProducts.map(c => ({ 
          id: c.id, 
          name: c.name, 
          count: counts[c.id] 
        })))
        
        setProductCounts(counts)
        setCategories(categoriesWithProducts)
      } catch (err) {
        setError('Failed to load categories')
        console.error('Error loading categories:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover fresh, quality products across all your favorite categories
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="bg-white animate-pulse">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-20 mx-auto"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              // Create gradient colors based on category index
              const gradients = [
                'from-green-400 to-blue-500',
                'from-purple-400 to-pink-500', 
                'from-yellow-400 to-orange-500',
                'from-blue-400 to-indigo-500',
                'from-pink-400 to-red-500',
                'from-indigo-400 to-purple-500',
                'from-teal-400 to-green-500',
                'from-orange-400 to-red-500'
              ]
              const gradient = gradients[index % gradients.length]
              
              return (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white border-0 shadow-lg overflow-hidden relative h-80">
                    {/* Featured badge */}
                    {category.is_featured && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                          ⭐ Featured
                        </div>
                      </div>
                    )}
                    
                    {/* Top Half - Image */}
                    <div className="h-1/2 relative overflow-hidden">
                      {category.image ? (
                        <>
                          <Image 
                            src={category.image} 
                            alt={category.name}
                            width={300}
                            height={160}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Gradient overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                        </>
                      ) : category.icon ? (
                        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                          <span className="text-6xl text-white group-hover:scale-110 transition-transform duration-300">
                            {category.icon}
                          </span>
                        </div>
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                          <span className="text-6xl text-white opacity-80">📦</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Bottom Half - Content */}
                    <CardContent className="h-1/2 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors text-lg leading-tight">
                          {category.name}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                          {category.description || 'Discover amazing products in this category'}
                        </p>
                      </div>
                      
                      <div className="mt-auto">
                        <div className={`bg-gradient-to-r ${gradient} text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-md group-hover:shadow-lg transition-shadow duration-300 text-center`}>
                          {productCounts[category.id] || 0} products
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
