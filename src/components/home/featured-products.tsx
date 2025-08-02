import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/product/product-card'
import { featuredProducts } from '@/data/mock-products'

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              Hand-picked favorites from our customers
            </p>
          </div>
          <Button asChild variant="outline" className="hidden md:flex">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Button asChild variant="outline">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
