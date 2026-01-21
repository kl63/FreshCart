'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { fetchAllCategories } from '@/lib/categories'
import { fetchProducts } from '@/lib/products'
import { Category } from '@/types'
import { useEffect, useState } from 'react'

export default function CategoriesPage() {
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
        products.forEach(product => {
          let categoryId: string | null = null
          
          if (product.category && typeof product.category === 'object') {
            categoryId = product.category.id
          } else if (product.category_id) {
            categoryId = product.category_id
          }
          
          if (categoryId) {
            counts[categoryId] = (counts[categoryId] || 0) + 1
          }
        })
        
        console.log('📊 All Categories page - Product counts:', counts)
        setProductCounts(counts)
        setCategories(fetchedCategories)
      } catch (err) {
        setError('Failed to load categories. Please try again later.')
        console.error('Error loading categories:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our complete selection of fresh groceries and everyday essentials
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 12 }).map((_, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg overflow-hidden h-96 animate-pulse">
                <div className="h-1/2 bg-gray-200" />
                <CardContent className="h-1/2 p-6 flex flex-col justify-between">
                  <div>
                    <div className="h-6 bg-gray-200 rounded mb-3" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="h-8 bg-gray-200 rounded-full w-24" />
                      <div className="h-5 bg-gray-200 rounded w-5" />
                    </div>
                  </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category, index) => {
              const count = productCounts[category.id] || 0
              // Create gradient colors based on category index
              const gradients = [
                'from-green-400 to-blue-500',
                'from-purple-400 to-pink-500', 
                'from-yellow-400 to-orange-500',
                'from-blue-400 to-indigo-500',
                'from-pink-400 to-red-500',
                'from-indigo-400 to-purple-500',
                'from-teal-400 to-green-500',
                'from-orange-400 to-red-500',
                'from-cyan-400 to-blue-500',
                'from-rose-400 to-pink-500',
                'from-emerald-400 to-teal-500',
                'from-violet-400 to-purple-500'
              ]
              const gradient = gradients[index % gradients.length]
              
              return (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white border-0 shadow-lg overflow-hidden relative h-96">
                    {/* Featured badge */}
                    {category.is_featured && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg animate-pulse">
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
                            width={400}
                            height={192}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Gradient overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                        </>
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                          <span className="text-white text-8xl opacity-80">📦</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Bottom Half - Content */}
                    <CardContent className="h-1/2 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors leading-tight">
                          {category.name}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                          {category.description || 'Discover amazing products in this category'}
                        </p>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex items-center justify-between">
                          <div className={`bg-gradient-to-r ${gradient} text-white text-sm px-4 py-2 rounded-full font-bold shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                            {count} products
                          </div>
                          
                          <div className="flex items-center text-gray-400 group-hover:text-gray-600 transition-colors">
                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
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
    </div>
  )
}
