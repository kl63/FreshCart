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
    
    // Add timestamp to bypass CDN and browser cache
    params.set('_t', Date.now().toString())

    const response = await fetch(`/api/products?${params.toString()}`, {
      headers: {
        'accept': 'application/json',
      },
      cache: 'no-store'
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
    // Fetch all products (backend now includes category data in response)
    const allProducts = await fetchProducts({ limit: 100, category_id: categoryId })
    
    // Filter products by category using the actual category data from API
    const filteredProducts = allProducts.filter(product => {
      // Products now have a category object from the API
      if (product.category && typeof product.category === 'object') {
        return product.category.id === categoryId
      }
      // Fallback: if category_id is a direct field
      if ('category_id' in product) {
        return (product as any).category_id === categoryId
      }
      return false
    })
    
    return filteredProducts
  } catch (error) {
    console.error('Error fetching products by category:', error)
    // If category filtering fails, try without filter and do client-side filtering
    try {
      const allProducts = await fetchProducts({ limit: 100 })
      return allProducts.filter(product => {
        if (product.category && typeof product.category === 'object') {
          return product.category.id === categoryId
        }
        if ('category_id' in product) {
          return (product as any).category_id === categoryId
        }
        return false
      })
    } catch (fallbackError) {
      console.error('Fallback filtering also failed:', fallbackError)
      return []
    }
  }
}
