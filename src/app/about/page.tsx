import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&auto=format&fit=crop',
    bio: 'Passionate about bringing fresh, quality groceries to every household.'
  },
  {
    name: 'Michael Chen',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&auto=format&fit=crop',
    bio: 'Ensures our supply chain delivers the freshest products daily.'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Customer Experience Director',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&auto=format&fit=crop',
    bio: 'Dedicated to making every customer interaction exceptional.'
  }
]

const values = [
  {
    icon: '🌱',
    title: 'Fresh & Natural',
    description: 'We source the freshest produce and natural products from trusted local farms and suppliers.'
  },
  {
    icon: '🤝',
    title: 'Community First',
    description: 'Supporting local communities and farmers is at the heart of everything we do.'
  },
  {
    icon: '♻️',
    title: 'Sustainability',
    description: 'Committed to eco-friendly practices and reducing our environmental footprint.'
  },
  {
    icon: '⭐',
    title: 'Quality Guaranteed',
    description: 'Every product is carefully selected and quality-checked before reaching your doorstep.'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About FreshCart
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
              Your trusted partner for fresh, quality groceries delivered with care since 2020
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="prose text-gray-600 space-y-4">
                <p>
                  FreshCart was born from a simple idea: everyone deserves access to fresh, 
                  quality groceries without the hassle of traditional shopping. Founded in 2020 
                  by a team of food enthusiasts and technology experts, we set out to revolutionize 
                  the way people shop for groceries.
                </p>
                <p>
                  What started as a small local delivery service has grown into a comprehensive 
                  online supermarket, serving thousands of families across the region. We&apos;ve 
                  built strong partnerships with local farms, organic producers, and trusted 
                  suppliers to ensure that every product meets our high standards.
                </p>
                <p>
                  Today, FreshCart is more than just a grocery delivery service – we&apos;re a 
                  community of people who believe that good food should be accessible, 
                  sustainable, and delivered with care.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&auto=format&fit=crop"
                alt="Fresh groceries"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center h-full">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The passionate people behind FreshCart
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-green-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg p-8 shadow-sm mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">By the Numbers</h2>
            <p className="text-lg text-gray-600">
              Our impact in the community
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500,000+</div>
              <div className="text-gray-600">Orders Delivered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">150+</div>
              <div className="text-gray-600">Local Partners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center bg-green-50 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            &ldquo;To make fresh, quality groceries accessible to everyone while supporting 
            local communities and promoting sustainable practices. We believe that good 
            food is a foundation for healthy, happy lives, and we&apos;re committed to 
            delivering that foundation right to your doorstep.&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
