import { TruckIcon, ClockIcon, ShieldCheckIcon, HeartIcon } from '@heroicons/react/24/outline'

const features = [
  {
    icon: TruckIcon,
    title: 'Free Delivery',
    description: 'Free delivery on orders over $35. Same-day delivery available in select areas.',
    color: 'text-green-600'
  },
  {
    icon: ClockIcon,
    title: 'Fresh Guarantee',
    description: 'We guarantee the freshness of our produce or your money back.',
    color: 'text-blue-600'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Quality Assured',
    description: 'All products are carefully selected and quality-checked before delivery.',
    color: 'text-purple-600'
  },
  {
    icon: HeartIcon,
    title: 'Organic Options',
    description: 'Wide selection of certified organic and natural products for healthy living.',
    color: 'text-red-600'
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose FreshCart?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to bringing you the freshest groceries with unmatched convenience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-6 group-hover:shadow-xl transition-shadow duration-300">
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
