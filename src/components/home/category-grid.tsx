import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { mockCategories } from '@/data/mock-products'

export default function CategoryGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover fresh, quality products across all your favorite categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockCategories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {category.description}
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    {category.productCount} products
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
