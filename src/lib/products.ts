import { Product } from '@/types'

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
}

export interface ProductFilters {
  page?: number
  limit?: number
  sort_by?: 'name' | 'price' | 'created_at'
  sort_order?: 'asc' | 'desc'
  category_id?: string
  is_organic?: boolean
  is_on_sale?: boolean
  min_price?: number
  max_price?: number
  search?: string
}

export async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
  try {
    const params = new URLSearchParams()
    
    // Set default values
    params.set('page', (filters.page || 1).toString())
    params.set('limit', (filters.limit || 20).toString())
    params.set('sort_by', filters.sort_by || 'name')
    params.set('sort_order', filters.sort_order || 'asc')
    
    // Add optional filters
    if (filters.category_id) params.set('category_id', filters.category_id)
    if (filters.is_organic !== undefined) params.set('is_organic', filters.is_organic.toString())
    if (filters.is_on_sale !== undefined) params.set('is_on_sale', filters.is_on_sale.toString())
    if (filters.min_price !== undefined) params.set('min_price', filters.min_price.toString())
    if (filters.max_price !== undefined) params.set('max_price', filters.max_price.toString())
    if (filters.search) params.set('search', filters.search)

    const response = await fetch(`/api/products?${params.toString()}`, {
      headers: {
        'accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`)
    }

    const products: Product[] = await response.json()
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export async function fetchFeaturedProducts(limit: number = 8): Promise<Product[]> {
  try {
    // Fetch products on sale or organic products as "featured"
    const onSaleProducts = await fetchProducts({ 
      is_on_sale: true, 
      limit: Math.ceil(limit / 2),
      sort_by: 'price',
      sort_order: 'asc'
    })
    
    const organicProducts = await fetchProducts({ 
      is_organic: true, 
      limit: Math.ceil(limit / 2),
      sort_by: 'price',
      sort_order: 'desc'
    })
    
    // Combine and deduplicate
    const combined = [...onSaleProducts, ...organicProducts]
    const unique = combined.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    )
    
    return unique.slice(0, limit)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    throw error
  }
}

export async function fetchProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    // Fetch all products since the API doesn't support category filtering yet
    const allProducts = await fetchProducts({ limit: 100 })
    
    // Fetch categories to get the category slug for matching
    const categoriesResponse = await fetch('/api/categories?page=1&limit=100')
    if (!categoriesResponse.ok) {
      throw new Error('Failed to fetch categories')
    }
    const categories = await categoriesResponse.json()
    const category = categories.find((cat: { id: string; slug: string }) => cat.id === categoryId)
    
    if (!category) {
      return []
    }
    
    // Implement intelligent category-product matching based on category slug and product names
    const filteredProducts = allProducts.filter(product => {
      const productName = product.name.toLowerCase()
      const categorySlug = category.slug.toLowerCase()
      
      let matches = false
      
      // Category-specific matching logic
      switch (categorySlug) {
        case 'bakery':
          matches = productName.includes('bread') || productName.includes('bakery') || 
                   productName.includes('pastry') || productName.includes('cake') ||
                   productName.includes('sourdough') || productName.includes('bake')
          break
                 
        case 'beverages':
          matches = productName.includes('juice') || productName.includes('drink') ||
                   productName.includes('water') || productName.includes('soda') ||
                   productName.includes('beverage') || productName.includes('coffee') ||
                   productName.includes('tea')
          break
                 
        case 'dairy-eggs':
          matches = productName.includes('milk') || productName.includes('egg') ||
                   productName.includes('cheese') || productName.includes('yogurt') ||
                   productName.includes('dairy') || productName.includes('butter')
          break
                 
        case 'fresh-produce':
          // First check if it's a dairy/egg product (exclude from produce even if organic)
          const isDairy = productName.includes('milk') || productName.includes('egg') ||
                         productName.includes('cheese') || productName.includes('yogurt') ||
                         productName.includes('dairy') || productName.includes('butter')
          
          if (isDairy) {
            matches = false
          } else {
            matches = productName.includes('banana') || productName.includes('apple') ||
                     productName.includes('spinach') || productName.includes('lettuce') ||
                     productName.includes('tomato') || productName.includes('carrot') ||
                     productName.includes('fruit') || productName.includes('vegetable') ||
                     productName.includes('produce') || productName.includes('fresh') ||
                     (product.is_organic && !productName.includes('milk') && !productName.includes('egg'))
          }
          break
                 
        case 'meat-seafood':
          matches = productName.includes('salmon') || productName.includes('chicken') ||
                   productName.includes('beef') || productName.includes('fish') ||
                   productName.includes('meat') || productName.includes('seafood') ||
                   productName.includes('pork')
          break
                 
        case 'pantry-staples':
          matches = productName.includes('rice') || productName.includes('pasta') ||
                   productName.includes('flour') || productName.includes('oil') ||
                   productName.includes('sauce') || productName.includes('spice')
          break
                 
        case 'frozen-foods':
          matches = productName.includes('frozen') || productName.includes('ice cream')
          break
                 
        case 'snacks-candy':
          matches = productName.includes('chip') || productName.includes('candy') ||
                   productName.includes('snack') || productName.includes('cookie')
          break
                 
        case 'health-beauty':
          matches = productName.includes('vitamin') || productName.includes('supplement') ||
                   productName.includes('beauty') || productName.includes('care')
          break
                 
        case 'household-items':
          matches = productName.includes('clean') || productName.includes('paper') ||
                   productName.includes('detergent') || productName.includes('soap')
          break
                 
        case 'electronics':
          matches = productName.includes('phone') || productName.includes('iphone') ||
                   productName.includes('electronic') || productName.includes('device') ||
                   productName.includes('computer') || productName.includes('tablet')
          break
                 
        default:
          // For unknown categories, return products that might match the category name
          matches = productName.includes(categorySlug.replace('-', ' ')) ||
                   categorySlug.includes(productName.split(' ')[0].toLowerCase())
          break
      }
      
      return matches
    })
    
    return filteredProducts
  } catch (error) {
    console.error('Error fetching products by category:', error)
    throw error
  }
}
