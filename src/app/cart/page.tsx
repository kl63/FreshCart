'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { cart, updateQuantity, removeItem, applyDiscountCode, removeDiscountCode } = useCartStore()
  const [discountCode, setDiscountCode] = useState('')

  const handleApplyDiscount = () => {
    if (discountCode.trim()) {
      applyDiscountCode(discountCode.trim())
      setDiscountCode('')
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add some fresh groceries to get started!
            </p>
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/products">
                Start Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0">
                      {item.product.thumbnail && item.product.thumbnail.trim() !== '' ? (
                        <Image
                          src={item.product.thumbnail}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/products/${item.product.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-green-600"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {item.product.category}
                      </p>
                      {item.product.weight && (
                        <p className="text-sm text-gray-600">
                          {item.product.weight}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        {formatPrice(item.product.price)}
                      </div>
                      {item.product.original_price && item.product.is_on_sale && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatPrice(item.product.original_price)}
                        </div>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                {/* Discount Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <Button onClick={handleApplyDiscount} variant="outline">
                      Apply
                    </Button>
                  </div>
                  {cart.discountCode && (
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-green-600">
                        Code &ldquo;{cart.discountCode}&rdquo; applied
                      </span>
                      <button
                        onClick={removeDiscountCode}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Order Totals */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>
                  
                  {cart.discountAmount && cart.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(cart.discountAmount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(cart.tax)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>
                      {cart.deliveryFee === 0 ? 'FREE' : formatPrice(cart.deliveryFee)}
                    </span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(cart.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                {cart.subtotal < 35 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Add {formatPrice(35 - cart.subtotal)} more for free delivery!
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                <Button 
                  size="lg" 
                  className="w-full mt-6 bg-green-600 hover:bg-green-700"
                >
                  Proceed to Checkout
                </Button>

                {/* Continue Shopping */}
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full mt-3"
                  asChild
                >
                  <Link href="/products">
                    Continue Shopping
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
