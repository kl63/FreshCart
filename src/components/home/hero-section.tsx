'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

const heroSlides = [
  {
    id: 1,
    title: 'Fresh Groceries Delivered',
    subtitle: 'Get the freshest produce and quality groceries delivered to your doorstep',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=600&auto=format&fit=crop',
    bgColor: 'from-green-600 to-green-700'
  },
  {
    id: 2,
    title: 'Organic & Natural',
    subtitle: 'Discover our wide selection of certified organic and natural products',
    ctaText: 'Shop Organic',
    ctaLink: '/products',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&h=600&auto=format&fit=crop',
    bgColor: 'from-emerald-600 to-emerald-700'
  },
  {
    id: 3,
    title: 'Same-Day Delivery',
    subtitle: 'Order before 2 PM and get your groceries delivered the same day',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&auto=format&fit=crop',
    bgColor: 'from-green-700 to-green-800'
  }
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const currentHero = heroSlides[currentSlide]

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentHero.image}
          alt={currentHero.title}
          fill
          className="object-cover"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${currentHero.bgColor} opacity-80`} />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {currentHero.title}
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 leading-relaxed">
              {currentHero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-green-700 hover:bg-green-50 font-semibold px-8 py-4 text-lg"
              >
                <Link href={currentHero.ctaLink}>
                  {currentHero.ctaText}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white bg-white/20 text-white hover:bg-white hover:text-green-700 font-semibold px-8 py-4 text-lg backdrop-blur-sm"
              >
                <Link href="/categories">
                  Browse Categories
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Promotional Banner */}
      <div className="absolute top-0 left-0 right-0 bg-green-600 text-white py-2 px-4 text-center text-sm">
        🎉 Free delivery on orders over $35 • Use code FRESH10 for 10% off your first order
      </div>
    </section>
  )
}
