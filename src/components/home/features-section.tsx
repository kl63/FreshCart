import { Truck, ShieldCheck, Leaf, Sprout } from 'lucide-react'
import { Card } from '@/components/ui/card'

const features = [
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Free Delivery',
    description: 'Free delivery on orders over $35. Same-day delivery available in select areas.',
    color: 'bg-blue-500/10 text-blue-600'
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: 'Quality Guaranteed',
    description: 'Supporting local communities and farmers is at the heart of everything we do. Your money back.',
    color: 'bg-green-500/10 text-green-600'
  },
  {
    icon: <Leaf className="w-8 h-8" />,
    title: 'Sustainability Assured',
    description: 'Every product is carefully selected and quality-checked before reaching your doorstep.',
    color: 'bg-emerald-500/10 text-emerald-600'
  },
  {
    icon: <Sprout className="w-8 h-8" />,
    title: 'Organic Options',
    description: 'Committed to eco-friendly practices and reducing our environmental footprint. Wide selection of certified organic and natural products for healthy living.',
    color: 'bg-amber-500/10 text-amber-600'
  }
]

export default function FeaturesSection() {
  return (
    <section className="w-full py-16 px-4 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Why Choose FreshCart?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;re committed to bringing you the freshest groceries with unmatched convenience
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-200 bg-white p-0 gap-0 overflow-hidden"
            >
              {/* Icon Container - No padding at top */}
              <div className={`w-full h-32 ${feature.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                {feature.icon}
              </div>

              {/* Content - With padding */}
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
