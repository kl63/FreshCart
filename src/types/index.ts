export interface Product {
  id: string
  name: string
  slug: string
  price: number
  original_price: number | null
  thumbnail: string
  is_organic: boolean
  is_on_sale: boolean
  in_stock: boolean
  rating_average: number
  rating_count: number
  discount_percentage: number
  // Optional fields for detailed product view
  description?: string
  images?: string[]
  category?: string
  subcategory?: string
  brand?: string
  weight?: number
  weight_unit?: string
  stock_quantity?: number
  is_fresh?: boolean
  nutrition_info?: NutritionInfo
  tags?: string[]
  sku?: string
  barcode?: string
}

export interface NutritionInfo {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  sugar?: number
  sodium?: number
  servingSize?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  image: string | null
  parent_id: string | null
  is_active: boolean
  is_featured: boolean
  sort_order: number
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  children: Category[]
  product_count: number | null
}

export interface CartItem {
  product: Product
  quantity: number
  selectedWeight?: number
  notes?: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  discountCode?: string
  discountAmount?: number
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  addresses: Address[]
  preferences?: UserPreferences
  loyaltyPoints?: number
  membershipTier?: 'bronze' | 'silver' | 'gold' | 'platinum'
}

export interface Address {
  id: string
  type: 'home' | 'work' | 'other'
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
  deliveryInstructions?: string
}

export interface UserPreferences {
  dietaryRestrictions?: string[]
  allergies?: string[]
  preferredCategories?: string[]
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  deliveryAddress: Address
  estimatedDelivery: Date
  actualDelivery?: Date
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
  trackingNumber?: string
  notes?: string
}

export interface Store {
  id: string
  name: string
  address: Address
  phone: string
  hours: StoreHours
  services: string[]
  rating?: number
  reviewCount?: number
}

export interface StoreHours {
  monday: { open: string; close: string; closed?: boolean }
  tuesday: { open: string; close: string; closed?: boolean }
  wednesday: { open: string; close: string; closed?: boolean }
  thursday: { open: string; close: string; closed?: boolean }
  friday: { open: string; close: string; closed?: boolean }
  saturday: { open: string; close: string; closed?: boolean }
  sunday: { open: string; close: string; closed?: boolean }
}

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  title?: string
  comment: string
  helpful: number
  verified: boolean
  createdAt: Date
  user: {
    firstName: string
    avatar?: string
  }
}

export interface SearchFilters {
  categories?: string[]
  priceRange?: { min: number; max: number }
  brands?: string[]
  rating?: number
  inStock?: boolean
  isOrganic?: boolean
  isOnSale?: boolean
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest'
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}
