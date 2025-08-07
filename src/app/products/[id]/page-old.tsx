'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { StarIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { fetchProducts } from '@/lib/products'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [productId, setProductId] = useState<string>('')

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params
      setProductId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!productId) return

    async function loadProductData() {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all products to find the one with matching ID
        const products = await fetchProducts({ limit: 100 })
        const foundProduct = products.find(p => p.id === productId)
        
        if (!foundProduct) {
          notFound()
          return
        }
        
        setProduct(foundProduct)
        
        // Get related products (other products, limited to 4)
        const related = products
          .filter(p => p.id !== productId)
          .slice(0, 4)
        setRelatedProducts(related)
      } catch (err) {
        console.error('Error loading product data:', err)
        setError('Failed to load product data')
      } finally {
        setLoading(false)
      }
    }

    loadProductData()
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-300 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              </div>
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

  if (!product) {
    notFound()
    return null
  }

  const discountedPrice = product.original_price && product.is_on_sale
    ? product.price
    : product.price

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <span>Home</span> / <span>Products</span> / 
          <span className="text-gray-900 font-medium"> {product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category */}
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              {product.category}
            </p>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating!)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-green-600">
                {formatPrice(discountedPrice)}
              </span>
              {product.discountPercent && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <Badge variant="sale">
                    Save {product.discountPercent}%
                  </Badge>
                </>
              )}
            </div>

            {/* Weight */}
            {product.weight && (
              <p className="text-gray-600">
                Weight: {product.weight} {product.weightUnit || 'lb'}
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isOrganic && (
                <Badge variant="organic">Organic</Badge>
              )}
              {product.isFresh && (
                <Badge variant="fresh">Fresh</Badge>
              )}
              {product.isOnSale && (
                <Badge variant="sale">On Sale</Badge>
              )}
              {product.inStock ? (
                <Badge variant="success">In Stock</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button 
                  size="lg" 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!product.inStock}
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <HeartIcon className="h-5 w-5" />
                </Button>
              </div>
              
              <Button variant="outline" size="lg" className="w-full">
                Add to Wishlist
              </Button>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">SKU:</span>
                <span>{product.sku || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Category:</span>
                <span>{product.category}</span>
              </div>
              {product.brand && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Brand:</span>
                  <span>{product.brand}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nutrition Info */}
        {product.nutritionInfo && (
          <Card className="mb-16">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Nutrition Information</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {product.nutritionInfo.calories && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {product.nutritionInfo.calories}
                    </div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                )}
                {product.nutritionInfo.protein && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {product.nutritionInfo.protein}g
                    </div>
                    <div className="text-sm text-gray-600">Protein</div>
                  </div>
                )}
                {product.nutritionInfo.carbs && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {product.nutritionInfo.carbs}g
                    </div>
                    <div className="text-sm text-gray-600">Carbs</div>
                  </div>
                )}
                {product.nutritionInfo.fat && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {product.nutritionInfo.fat}g
                    </div>
                    <div className="text-sm text-gray-600">Fat</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3">
                      <Image
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-green-600 font-bold">
                      {formatPrice(relatedProduct.price)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
