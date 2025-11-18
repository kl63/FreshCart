'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import AdminGuard from '@/components/admin/admin-guard'
import AdminLayout from '@/components/admin/admin-layout'
import { fetchProducts } from '@/lib/products'
import { Product } from '@/types'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    description: '',
    price: '',
    original_price: '',
    category_id: '',
    stock_quantity: '',
    thumbnail: ''
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await fetchProducts({ limit: 100 })
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'price':
        return a.price - b.price
      case 'stock':
        return (b.stock_quantity || 0) - (a.stock_quantity || 0)
      default:
        return 0
    }
  })

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok || response.status === 204) {
          setProducts(products.filter(p => p.id !== productId))
          alert('Product deleted successfully')
        } else {
          const error = await response.json()
          alert(`Failed to delete product: ${error.detail || error.error || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        alert(`Error deleting product: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  const handleOpenAddModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      slug: '',
      sku: '',
      description: '',
      price: '',
      original_price: '',
      category_id: '',
      stock_quantity: '',
      thumbnail: ''
    })
    setShowModal(true)
  }

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      sku: product.sku || '',
      description: product.description || '',
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      category_id: product.category_id || '',
      stock_quantity: product.stock_quantity?.toString() || '',
      thumbnail: product.thumbnail || ''
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      
      // Build product data based on create vs update
      const productData: any = {}
      
      if (editingProduct) {
        // UPDATE - only send fields that changed and have valid values
        if (formData.name && formData.name.trim()) {
          productData.name = formData.name.trim()
        }
        if (formData.slug && formData.slug.trim()) {
          productData.slug = formData.slug.trim()
        }
        if (formData.sku && formData.sku.trim()) {
          productData.sku = formData.sku.trim()
        }
        if (formData.description && formData.description.trim()) {
          productData.description = formData.description.trim()
        }
        if (formData.price && !isNaN(parseFloat(formData.price))) {
          productData.price = parseFloat(formData.price)
        }
        if (formData.original_price && !isNaN(parseFloat(formData.original_price))) {
          productData.original_price = parseFloat(formData.original_price)
        }
        // Update category_id if provided (backend will validate)
        if (formData.category_id && formData.category_id.trim()) {
          productData.category_id = formData.category_id.trim()
        }
        if (formData.stock_quantity !== undefined && formData.stock_quantity !== '') {
          const qty = parseInt(formData.stock_quantity)
          if (!isNaN(qty)) {
            productData.stock_quantity = qty
            productData.in_stock = qty > 0
          }
        }
        if (formData.thumbnail && formData.thumbnail.trim()) {
          productData.thumbnail = formData.thumbnail.trim()
        }
      } else {
        // CREATE - required fields with validation
        if (!formData.name || !formData.name.trim()) {
          throw new Error('Product name is required')
        }
        if (!formData.category_id || !formData.category_id.trim()) {
          throw new Error('Category ID is required')
        }
        if (!formData.price || isNaN(parseFloat(formData.price))) {
          throw new Error('Valid price is required')
        }
        
        productData.name = formData.name.trim()
        productData.slug = (formData.slug && formData.slug.trim()) || 
          formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        productData.sku = (formData.sku && formData.sku.trim()) || `SKU-${Date.now()}`
        productData.category_id = formData.category_id.trim()
        productData.price = parseFloat(formData.price)
        productData.stock_quantity = parseInt(formData.stock_quantity) || 0
        productData.in_stock = (parseInt(formData.stock_quantity) || 0) > 0
        
        // Optional fields
        if (formData.description && formData.description.trim()) {
          productData.description = formData.description.trim()
        }
        if (formData.original_price && !isNaN(parseFloat(formData.original_price))) {
          productData.original_price = parseFloat(formData.original_price)
        }
        if (formData.thumbnail && formData.thumbnail.trim()) {
          productData.thumbnail = formData.thumbnail.trim()
        }
      }

      console.log('=== Product Data Being Submitted ===')
      console.log('Is Update?', !!editingProduct)
      console.log('Product Data:', JSON.stringify(productData, null, 2))
      console.log('Data Keys:', Object.keys(productData))
      console.log('Data is empty?', Object.keys(productData).length === 0)
      
      // Don't send empty updates
      if (editingProduct && Object.keys(productData).length === 0) {
        alert('No changes detected. Please modify at least one field.')
        setIsSubmitting(false)
        return
      }

      if (editingProduct) {
        // UPDATE
        console.log('Updating product:', editingProduct.id)
        const response = await fetch(
          `/api/admin/products/${editingProduct.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
          }
        )

        console.log('Update response status:', response.status)
        console.log('Update response ok:', response.ok)
        
        let responseData
        try {
          responseData = await response.json()
          console.log('Update response data:', responseData)
        } catch (e) {
          console.error('Failed to parse response JSON:', e)
          responseData = {}
        }

        if (response.ok) {
          // If we got a 200 but empty response, refetch the product
          if (!responseData || Object.keys(responseData).length === 0) {
            console.log('Empty response, refetching products...')
            await loadProducts()
            alert('Product updated successfully')
            setShowModal(false)
          } else {
            setProducts(products.map(p => p.id === editingProduct.id ? responseData : p))
            alert('Product updated successfully')
            setShowModal(false)
          }
        } else {
          console.error('Update failed:', responseData)
          alert(`Failed to update product (${response.status}): ${JSON.stringify(responseData)}`)
        }
      } else {
        // CREATE
        console.log('Creating new product')
        const response = await fetch(
          '/api/admin/products',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
          }
        )

        console.log('Create response status:', response.status)
        console.log('Create response ok:', response.ok)
        
        let responseData
        try {
          responseData = await response.json()
          console.log('Create response data:', responseData)
        } catch (e) {
          console.error('Failed to parse response JSON:', e)
          responseData = {}
        }

        if (response.ok) {
          // If we got a 200 but empty response, refetch products
          if (!responseData || Object.keys(responseData).length === 0) {
            console.log('Empty response, refetching products...')
            await loadProducts()
            alert('Product created successfully')
            setShowModal(false)
          } else {
            setProducts([...products, responseData])
            alert('Product created successfully')
            setShowModal(false)
          }
        } else {
          console.error('Create failed:', responseData)
          alert(`Failed to create product (${response.status}): ${JSON.stringify(responseData)}`)
        }
      }
    } catch (error) {
      console.error('Error submitting product:', error)
      alert(`Error saving product: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (loading) {
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="h-10 bg-gray-300 rounded w-full"></div>
              </div>
              <div className="p-6">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 py-4 border-b border-gray-200">
                    <div className="h-16 w-16 bg-gray-300 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-24"></div>
                    </div>
                    <div className="h-8 bg-gray-300 rounded w-20"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 mt-2">
                Manage your product catalog ({products.length} products)
              </p>
            </div>
            <button 
              onClick={handleOpenAddModal}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Product</span>
            </button>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Dairy & Eggs">Dairy & Eggs</option>
                <option value="Bakery">Bakery</option>
                <option value="Meat & Seafood">Meat & Seafood</option>
                <option value="Beverages">Beverages</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
              </select>

              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {sortedProducts.length} of {products.length} products
                </span>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            {product.thumbnail ? (
                              <Image
                                src={product.thumbnail}
                                alt={product.name}
                                width={64}
                                height={64}
                                className="h-16 w-16 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.description?.substring(0, 60)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${product.price.toFixed(2)}
                        {product.original_price && product.original_price > product.price && (
                          <div className="text-xs text-gray-500 line-through">
                            ${product.original_price.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          (product.stock_quantity || 0) > 10
                            ? 'bg-green-100 text-green-800'
                            : (product.stock_quantity || 0) > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock_quantity || 0} units
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.in_stock
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900" title="View Details">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenEditModal(product)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit Product"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first product.'}
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Add Product
              </button>
            </div>
          )}

          {/* Add/Edit Product Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name *
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
                        Slug {!editingProduct && '*'}
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        required={!editingProduct}
                        placeholder="product-slug"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from name</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SKU {!editingProduct && '*'}
                      </label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        required={!editingProduct}
                        placeholder="SKU-12345"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate</p>
                    </div>
                    
                    <div className="md:col-span-2">
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
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Original Price (optional)
                      </label>
                      <input
                        type="number"
                        name="original_price"
                        value={formData.original_price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category ID {!editingProduct && '*'}
                      </label>
                      <input
                        type="text"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        required={!editingProduct}
                        placeholder="Category UUID"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter the category UUID</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        name="stock_quantity"
                        value={formData.stock_quantity}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thumbnail URL
                      </label>
                      <input
                        type="url"
                        name="thumbnail"
                        value={formData.thumbnail}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
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
