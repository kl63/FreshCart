import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { mockCategories } from '@/data/mock-products'

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our complete selection of fresh groceries and everyday essentials
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockCategories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white h-full">
                <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                  <div>
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {category.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">
                      {category.productCount} products
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
