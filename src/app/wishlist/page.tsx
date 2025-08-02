'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/cart'

// Mock wishlist data
const mockWishlistItems = [
  {
    id: '1',
    name: 'Organic Avocados',
    price: 4.99,
    originalPrice: 5.99,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&h=300&auto=format&fit=crop',
    category: 'Fruits',
    inStock: true,
    isOnSale: true,
    rating: 4.8,
    unit: 'per bag'
  },
  {
    id: '2',
    name: 'Grass-Fed Ground Beef',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=300&h=300&auto=format&fit=crop',
    category: 'Meat',
    inStock: true,
    isOnSale: false,
    rating: 4.9,
    unit: 'per lb'
  },
  {
    id: '3',
    name: 'Organic Quinoa',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&auto=format&fit=crop',
    category: 'Pantry',
    inStock: false,
    isOnSale: false,
    rating: 4.6,
    unit: 'per bag'
  },
  {
    id: '4',
    name: 'Fresh Salmon Fillet',
    price: 18.99,
    originalPrice: 22.99,
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=300&h=300&auto=format&fit=crop',
    category: 'Seafood',
    inStock: true,
    isOnSale: true,
    rating: 4.7,
    unit: 'per lb'
  }
]

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems)
  const { addItem } = useCartStore()

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId))
  }

  const addToCart = (item: typeof mockWishlistItems[0]) => {
    // Convert wishlist item to Product type for cart
    const product = {
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      category: item.category,
      inStock: item.inStock,
      isOnSale: item.isOnSale,
      rating: item.rating,
      unit: item.unit,
      slug: item.name.toLowerCase().replace(/\s+/g, '-'),
      description: '',
      images: [item.image],
      tags: [],
      isOrganic: false,
      isFresh: false,
      isFeatured: false,
      stockQuantity: 100,
      weight: 1,
      nutritionInfo: undefined,
      reviewCount: 0
    }
    addItem(product, 1)
  }

  const moveAllToCart = () => {
    wishlistItems.forEach(item => {
      if (item.inStock) {
        addToCart(item)
      }
    })
    setWishlistItems(prev => prev.filter(item => !item.inStock))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">
              {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setWishlistItems([])}>
                Clear All
              </Button>
              <Button onClick={moveAllToCart}>
                Add All to Cart
              </Button>
            </div>
          )}
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  {/* Product Image */}
                  <div className="relative mb-4">
                    <Link href={`/products/${item.id}`}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </Link>
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {item.isOnSale && (
                        <Badge variant="destructive" className="text-xs">
                          Sale
                        </Badge>
                      )}
                      {!item.inStock && (
                        <Badge variant="secondary" className="text-xs">
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    {/* Remove from Wishlist */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                    >
                      ❤️
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <Link href={`/products/${item.id}`}>
                      <h3 className="font-medium text-gray-900 hover:text-green-600 transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-gray-600">{item.category}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({item.rating})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-600">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-sm text-gray-600">{item.unit}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        disabled={!item.inStock}
                        onClick={() => addToCart(item)}
                      >
                        {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty Wishlist */
          <div className="text-center py-16">
            <div className="text-6xl mb-6">💝</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding items to your wishlist by clicking the heart icon on products you love.
            </p>
            <Link href="/products">
              <Button>
                Browse Products
              </Button>
            </Link>
          </div>
        )}

        {/* Wishlist Tips */}
        {wishlistItems.length > 0 && (
          <Card className="mt-12">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Wishlist Tips
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">📧 Get Notified</h4>
                  We&apos;ll email you when items go on sale or come back in stock.
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">🔄 Easy Reordering</h4>
                  <p>Quickly add your favorite items to your cart for repeat purchases.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">💝 Share Lists</h4>
                  <p>Share your wishlist with family and friends for special occasions.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommended Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* This would typically show recommended products */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Recommended Product</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Product Name</h3>
                <p className="text-green-600 font-bold">$X.XX</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
