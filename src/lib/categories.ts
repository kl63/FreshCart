import { Category } from '@/types'

export interface CategoriesResponse {
  categories: Category[]
  total: number
  page: number
  limit: number
}

export async function fetchCategories(page: number = 1, limit: number = 20): Promise<Category[]> {
  try {
    const response = await fetch(`/api/categories?page=${page}&limit=${limit}`, {
      headers: {
        'accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`)
    }

    const categories: Category[] = await response.json()
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export async function fetchAllCategories(): Promise<Category[]> {
  try {
    // Fetch with a large limit to get all categories
    const categories = await fetchCategories(1, 100)
    return categories
  } catch (error) {
    console.error('Error fetching all categories:', error)
    throw error
  }
}
