'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCartIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Product } from '@/types'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { addItem } = useCartStore()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!product.in_stock) return
    
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    addItem(product, 1)
    setIsLoading(false)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }



  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
      <Link href={`/products/${product.id}`}>
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden bg-gray-100">
            {product.thumbnail && product.thumbnail.trim() !== '' && product.thumbnail.startsWith('http') ? (
              <Image
                src={product.thumbnail}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/images/placeholder-product.jpg'
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="text-gray-400 text-center">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs">No Image</p>
                </div>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_on_sale && product.discount_percentage > 0 && (
              <Badge variant="sale" className="text-xs">
                -{Math.round(product.discount_percentage)}%
              </Badge>
            )}
            {product.is_organic && (
              <Badge variant="organic" className="text-xs">
                Organic
              </Badge>
            )}
            {product.is_fresh && (
              <Badge variant="fresh" className="text-xs">
                Fresh
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            {isWishlisted ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* Stock Status */}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Product Info */}
          <div className="space-y-2">
            {/* Category */}
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {product.category}
            </p>

            {/* Name */}
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
              {product.name}
            </h3>

            {/* Weight */}
            {product.weight && (
              <p className="text-sm text-gray-600">
                {product.weight} {product.weight_unit || 'lb'}
              </p>
            )}

            {/* Rating */}
            {product.rating_average > 0 && (
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating_average)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.rating_count || 0})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-green-600">
                {formatPrice(product.price)}
              </span>
              {product.original_price && product.is_on_sale && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.in_stock || isLoading}
            className="w-full mt-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
            size="sm"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ShoppingCartIcon className="h-4 w-4" />
                <span>Add to Cart</span>
              </div>
            )}
          </Button>
        </CardContent>
      </Link>
    </Card>
  )
}
