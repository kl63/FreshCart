import HeroSection from '@/components/home/hero-section'
import CategoryGrid from '@/components/home/category-grid'
import FeaturedProducts from '@/components/home/featured-products'
import FeaturesSection from '@/components/home/features-section'

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <FeaturesSection />
    </div>
  )
}
