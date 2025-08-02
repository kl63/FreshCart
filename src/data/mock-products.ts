import { Product, Category } from '@/types'

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Fresh Produce',
    slug: 'produce',
    description: 'Fresh fruits and vegetables',
    icon: '🥬',
    productCount: 156
  },
  {
    id: '2',
    name: 'Meat & Seafood',
    slug: 'meat-seafood',
    description: 'Premium quality meat and fresh seafood',
    icon: '🥩',
    productCount: 89
  },
  {
    id: '3',
    name: 'Dairy & Eggs',
    slug: 'dairy',
    description: 'Fresh dairy products and farm eggs',
    icon: '🥛',
    productCount: 67
  },
  {
    id: '4',
    name: 'Bakery',
    slug: 'bakery',
    description: 'Freshly baked bread and pastries',
    icon: '🍞',
    productCount: 45
  },
  {
    id: '5',
    name: 'Pantry',
    slug: 'pantry',
    description: 'Essential pantry items and dry goods',
    icon: '🥫',
    productCount: 234
  },
  {
    id: '6',
    name: 'Frozen',
    slug: 'frozen',
    description: 'Frozen foods and ice cream',
    icon: '❄️',
    productCount: 123
  },
  {
    id: '7',
    name: 'Organic',
    slug: 'organic',
    description: 'Certified organic products',
    icon: '🌱',
    productCount: 178
  }
]

export const mockProducts: Product[] = [
  // Fresh Produce
  {
    id: '1',
    name: 'Organic Bananas',
    description: 'Sweet and ripe organic bananas, perfect for snacking or smoothies',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&auto=format&fit=crop',
    category: 'Fresh Produce',
    weight: 2,
    weightUnit: 'lb',
    inStock: true,
    stockQuantity: 50,
    rating: 4.5,
    reviewCount: 124,
    isOrganic: true,
    isFresh: true,
    tags: ['potassium', 'healthy', 'snack'],
    sku: 'PROD-001'
  },
  {
    id: '2',
    name: 'Fresh Strawberries',
    description: 'Juicy, sweet strawberries picked at peak ripeness',
    price: 4.99,
    originalPrice: 5.99,
    discountPercent: 17,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&auto=format&fit=crop',
    category: 'Fresh Produce',
    weight: 1,
    weightUnit: 'lb',
    inStock: true,
    stockQuantity: 30,
    rating: 4.8,
    reviewCount: 89,
    isFresh: true,
    isOnSale: true,
    tags: ['vitamin-c', 'antioxidants', 'sweet'],
    sku: 'PROD-002'
  },
  {
    id: '3',
    name: 'Organic Baby Spinach',
    description: 'Tender organic baby spinach leaves, perfect for salads',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&auto=format&fit=crop',
    category: 'Fresh Produce',
    weight: 5,
    weightUnit: 'oz',
    inStock: true,
    stockQuantity: 25,
    rating: 4.6,
    reviewCount: 67,
    isOrganic: true,
    isFresh: true,
    tags: ['iron', 'leafy-green', 'salad'],
    sku: 'PROD-003'
  },
  {
    id: '4',
    name: 'Avocados',
    description: 'Creamy Hass avocados, perfect for guacamole or toast',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&auto=format&fit=crop',
    category: 'Fresh Produce',
    weight: 1,
    weightUnit: 'each',
    inStock: true,
    stockQuantity: 40,
    rating: 4.4,
    reviewCount: 156,
    isFresh: true,
    tags: ['healthy-fats', 'creamy', 'versatile'],
    sku: 'PROD-004'
  },

  // Meat & Seafood
  {
    id: '5',
    name: 'Grass-Fed Ground Beef',
    description: 'Premium grass-fed ground beef, 85% lean',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&auto=format&fit=crop',
    category: 'Meat & Seafood',
    weight: 1,
    weightUnit: 'lb',
    inStock: true,
    stockQuantity: 15,
    rating: 4.7,
    reviewCount: 92,
    isFresh: true,
    tags: ['protein', 'grass-fed', 'lean'],
    sku: 'MEAT-001'
  },
  {
    id: '6',
    name: 'Atlantic Salmon Fillet',
    description: 'Fresh Atlantic salmon fillet, wild-caught',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1574781330855-d0db3580ce5d?w=400&h=400&auto=format&fit=crop',
    category: 'Meat & Seafood',
    weight: 1,
    weightUnit: 'lb',
    inStock: true,
    stockQuantity: 12,
    rating: 4.9,
    reviewCount: 78,
    isFresh: true,
    tags: ['omega-3', 'wild-caught', 'protein'],
    sku: 'FISH-001'
  },

  // Dairy & Eggs
  {
    id: '7',
    name: 'Organic Whole Milk',
    description: 'Fresh organic whole milk from grass-fed cows',
    price: 4.49,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&auto=format&fit=crop',
    category: 'Dairy & Eggs',
    weight: 1,
    weightUnit: 'gallon',
    inStock: true,
    stockQuantity: 20,
    rating: 4.5,
    reviewCount: 134,
    isOrganic: true,
    isFresh: true,
    tags: ['calcium', 'protein', 'vitamin-d'],
    sku: 'DAIRY-001'
  },
  {
    id: '8',
    name: 'Free-Range Eggs',
    description: 'Large free-range eggs from happy hens',
    price: 5.99,
    originalPrice: 6.99,
    discountPercent: 14,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&auto=format&fit=crop',
    category: 'Dairy & Eggs',
    weight: 12,
    weightUnit: 'count',
    inStock: true,
    stockQuantity: 35,
    rating: 4.8,
    reviewCount: 201,
    isFresh: true,
    isOnSale: true,
    tags: ['protein', 'free-range', 'breakfast'],
    sku: 'DAIRY-002'
  },

  // Bakery
  {
    id: '9',
    name: 'Artisan Sourdough Bread',
    description: 'Handcrafted sourdough bread with a perfect crust',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&auto=format&fit=crop',
    category: 'Bakery',
    weight: 1,
    weightUnit: 'loaf',
    inStock: true,
    stockQuantity: 18,
    rating: 4.7,
    reviewCount: 87,
    isFresh: true,
    tags: ['artisan', 'sourdough', 'handcrafted'],
    sku: 'BAKERY-001'
  },
  {
    id: '10',
    name: 'Chocolate Croissants',
    description: 'Buttery croissants filled with rich chocolate',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1555507036-ab794f4ade8a?w=400&h=400&auto=format&fit=crop',
    category: 'Bakery',
    weight: 4,
    weightUnit: 'pack',
    inStock: true,
    stockQuantity: 12,
    rating: 4.6,
    reviewCount: 45,
    isFresh: true,
    tags: ['pastry', 'chocolate', 'breakfast'],
    sku: 'BAKERY-002'
  },

  // Pantry
  {
    id: '11',
    name: 'Organic Quinoa',
    description: 'Premium organic quinoa, a complete protein source',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&auto=format&fit=crop',
    category: 'Pantry',
    weight: 2,
    weightUnit: 'lb',
    inStock: true,
    stockQuantity: 45,
    rating: 4.4,
    reviewCount: 112,
    isOrganic: true,
    tags: ['protein', 'gluten-free', 'superfood'],
    sku: 'PANTRY-001'
  },
  {
    id: '12',
    name: 'Extra Virgin Olive Oil',
    description: 'Cold-pressed extra virgin olive oil from Italy',
    price: 12.99,
    originalPrice: 15.99,
    discountPercent: 19,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&auto=format&fit=crop',
    category: 'Pantry',
    weight: 500,
    weightUnit: 'ml',
    inStock: true,
    stockQuantity: 28,
    rating: 4.8,
    reviewCount: 167,
    isOnSale: true,
    tags: ['cooking', 'healthy', 'italian'],
    sku: 'PANTRY-002'
  },

  // Frozen
  {
    id: '13',
    name: 'Organic Frozen Berries',
    description: 'Mixed organic berries - strawberries, blueberries, raspberries',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&auto=format&fit=crop',
    category: 'Frozen',
    weight: 2,
    weightUnit: 'lb',
    inStock: true,
    stockQuantity: 22,
    rating: 4.5,
    reviewCount: 89,
    isOrganic: true,
    tags: ['antioxidants', 'smoothies', 'vitamin-c'],
    sku: 'FROZEN-001'
  },
  {
    id: '14',
    name: 'Vanilla Ice Cream',
    description: 'Premium vanilla ice cream made with real vanilla beans',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&h=400&auto=format&fit=crop',
    category: 'Frozen',
    weight: 1,
    weightUnit: 'quart',
    inStock: false,
    stockQuantity: 0,
    rating: 4.7,
    reviewCount: 156,
    tags: ['dessert', 'premium', 'vanilla'],
    sku: 'FROZEN-002'
  }
]

export const featuredProducts = mockProducts.filter(product => 
  product.rating && product.rating >= 4.5
).slice(0, 8)

export const saleProducts = mockProducts.filter(product => 
  product.isOnSale
)

export const organicProducts = mockProducts.filter(product => 
  product.isOrganic
)
