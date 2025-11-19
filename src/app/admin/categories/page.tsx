'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'
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
  StarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    icon: '',
    is_featured: false,
    is_active: true,
    sort_order: 0
  })

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
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          setCategories(categories.filter(c => c.id !== categoryId))
          toast.success('Category deleted successfully')
        } else {
          const error = await response.json()
          toast.error(`Failed to delete category: ${error.error || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error deleting category:', error)
        toast.error('Error deleting category')
      }
    }
  }

  const handleToggleFeatured = async (categoryId: string) => {
    try {
      const category = categories.find(c => c.id === categoryId)
      if (!category) return

      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_featured: !category.is_featured })
      })

      if (response.ok) {
        setCategories(categories.map(cat => 
          cat.id === categoryId 
            ? { ...cat, is_featured: !cat.is_featured }
            : cat
        ))
        toast.success(category.is_featured ? 'Removed from featured' : 'Added to featured')
      } else {
        toast.error('Failed to update category')
      }
    } catch (error) {
      console.error('Error toggling featured:', error)
      toast.error('Error updating category')
    }
  }

  const handleOpenAddModal = () => {
    setEditingCategory(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      icon: '',
      is_featured: false,
      is_active: true,
      sort_order: categories.length
    })
    setShowModal(true)
  }

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '',
      icon: category.icon || '',
      is_featured: category.is_featured || false,
      is_active: category.is_active !== undefined ? category.is_active : true,
      sort_order: category.sort_order || 0
    })
    setShowModal(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token')

      const categoryData: Record<string, unknown> = {}
      
      if (formData.name.trim()) {
        categoryData.name = formData.name.trim()
        // Auto-generate slug if not provided
        if (!formData.slug.trim()) {
          categoryData.slug = formData.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        } else {
          categoryData.slug = formData.slug.trim()
        }
      }
      
      if (formData.description.trim()) categoryData.description = formData.description.trim()
      if (formData.image.trim()) categoryData.image = formData.image.trim()
      if (formData.icon.trim()) categoryData.icon = formData.icon.trim()
      categoryData.is_featured = formData.is_featured
      categoryData.is_active = formData.is_active
      categoryData.sort_order = formData.sort_order

      if (editingCategory) {
        // UPDATE
        const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(categoryData)
        })

        const responseData = await response.json()

        if (response.ok) {
          await loadCategories()
          toast.success('Category updated successfully')
          setShowModal(false)
        } else {
          toast.error(`Failed to update category: ${responseData.error || 'Unknown error'}`)
        }
      } else {
        // CREATE
        if (!formData.name.trim()) {
          toast.error('Category name is required')
          setIsSubmitting(false)
          return
        }

        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(categoryData)
        })

        const responseData = await response.json()

        if (response.ok) {
          await loadCategories()
          toast.success('Category created successfully')
          setShowModal(false)
        } else {
          toast.error(`Failed to create category: ${responseData.error || 'Unknown error'}`)
        }
      }
    } catch (error) {
      console.error('Error submitting category:', error)
      toast.error(`Error saving category: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
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
        <Toaster position="top-right" />
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
              <p className="text-gray-600 mt-2">
                Manage your product categories ({categories.length} categories)
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
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
                          <button
                            onClick={() => handleOpenEditModal(category)}
                            className="text-green-600 hover:text-green-800 p-1"
                          >
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
                <button
                  onClick={handleOpenAddModal}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
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

          {/* Create/Edit Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="auto-generated from name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Icon (emoji)
                      </label>
                      <input
                        type="text"
                        name="icon"
                        value={formData.icon}
                        onChange={handleInputChange}
                        placeholder="📦"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        name="sort_order"
                        value={formData.sort_order}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="is_featured"
                          checked={formData.is_featured}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Featured</span>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={formData.is_active}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}
