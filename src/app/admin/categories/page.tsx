'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import AdminGuard from '@/components/admin/admin-guard'
import AdminLayout from '@/components/admin/admin-layout'
import { fetchAllCategories } from '@/lib/categories'
import { Category } from '@/types'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await fetchAllCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      // TODO: Implement delete API call
      console.log('Delete category:', categoryId)
      // For now, just remove from local state
      setCategories(categories.filter(c => c.id !== categoryId))
    }
  }

  const handleToggleFeatured = async (categoryId: string) => {
    // TODO: Implement toggle featured API call
    console.log('Toggle featured for category:', categoryId)
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, is_featured: !cat.is_featured }
        : cat
    ))
  }

  if (loading) {
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="h-32 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AdminLayout>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
              <p className="text-gray-600 mt-2">
                Manage your product categories ({categories.length} categories)
              </p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <PlusIcon className="h-5 w-5" />
              <span>Add Category</span>
            </button>
          </div>

          {/* Search */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="relative max-w-md">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    {/* Category Image */}
                    <div className="relative h-48 bg-gray-100">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-2">{category.icon || '📦'}</div>
                            <span className="text-gray-400 text-sm">No Image</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Featured Badge */}
                      {category.is_featured && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                            <StarIconSolid className="h-3 w-3" />
                            <span>Featured</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Category Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        <button
                          onClick={() => handleToggleFeatured(category.id)}
                          className={`p-1 rounded ${
                            category.is_featured
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-400 hover:text-yellow-500'
                          }`}
                        >
                          {category.is_featured ? (
                            <StarIconSolid className="h-5 w-5" />
                          ) : (
                            <StarIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {category.description || 'No description available'}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{category.product_count} products</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            category.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {category.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 p-1">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800 p-1">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-xs text-gray-400">
                          #{category.sort_order}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏷️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No categories found' : 'No categories yet'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? 'Try adjusting your search criteria.'
                    : 'Get started by creating your first category.'}
                </p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Add Category
                </button>
              </div>
            )}
          </div>

          {/* Category Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600">Total Categories</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {categories.filter(c => c.is_active).length}
              </div>
              <div className="text-sm text-gray-600">Active Categories</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-yellow-600">
                {categories.filter(c => c.is_featured).length}
              </div>
              <div className="text-sm text-gray-600">Featured Categories</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">
                {categories.reduce((sum, c) => sum + (c.product_count || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}
