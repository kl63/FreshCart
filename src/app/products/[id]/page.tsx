import { notFound } from 'next/navigation'
import Image from 'next/image'
import { StarIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { mockProducts } from '@/data/mock-products'
import { formatPrice } from '@/lib/utils'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = mockProducts.find(p => p.id === params.id)
  
  if (!product) {
    notFound()
  }

  const discountedPrice = product.discountPercent 
    ? product.price * (1 - product.discountPercent / 100)
    : product.price

  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <span>Home</span> / <span>Products</span> / <span>{product.category}</span> / 
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
