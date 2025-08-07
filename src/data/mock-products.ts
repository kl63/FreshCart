import { Product, Category } from '@/types'

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Fresh Produce',
    slug: 'fresh-produce',
    description: 'Fresh fruits and vegetables',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&auto=format&fit=crop',
    icon: '🥬',
    parent_id: null,
    is_active: true,
    is_featured: true,
    sort_order: 1,
    meta_title: null,
    meta_description: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    children: [],
    product_count: 50
  }
]

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Bananas',
    slug: 'organic-bananas',
    description: 'Sweet and ripe organic bananas, perfect for snacking or smoothies',
    price: 2.99,
    original_price: null,
    thumbnail: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&auto=format&fit=crop',
    is_organic: true,
    is_on_sale: false,
    in_stock: true,
    rating_average: 4.5,
    rating_count: 124,
    discount_percentage: 0,
    category: 'Fresh Produce',
    weight: 2,
    weight_unit: 'lb',
    stock_quantity: 50,
    is_fresh: true,
    tags: ['potassium', 'healthy', 'snack'],
    sku: 'PROD-001'
  },
  {
    id: '2',
    name: 'Fresh Strawberries',
    slug: 'fresh-strawberries',
    description: 'Sweet and juicy strawberries',
    price: 4.99,
    original_price: null,
    thumbnail: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&auto=format&fit=crop',
    is_organic: false,
    is_on_sale: false,
    in_stock: true,
    rating_average: 4.3,
    rating_count: 89,
    discount_percentage: 0,
    category: 'Fresh Produce',
    weight: 1,
    weight_unit: 'lb',
    stock_quantity: 30,
    is_fresh: true,
    tags: ['vitamin-c', 'antioxidants', 'berries'],
    sku: 'PROD-002'
  }
]

export const featuredProducts = mockProducts.filter(product => product.rating_average >= 4.0)
export const saleProducts = mockProducts.filter(product => product.is_on_sale)
export const organicProducts = mockProducts.filter(product => product.is_organic)
