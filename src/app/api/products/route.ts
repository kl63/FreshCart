import { NextRequest, NextResponse } from 'next/server'

// Support both local and production APIs
const PRODUCTION_API = 'https://fastapi.kevinlinportfolio.com/api/v1'

// Use environment variable or default to production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Build the API URL with all query parameters
    const apiUrl = new URL(`${API_BASE_URL}/products/`)
    
    // Forward all query parameters to the external API
    searchParams.forEach((value, key) => {
      apiUrl.searchParams.set(key, value)
    })

    console.log('Fetching products from:', apiUrl.toString())

    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch(apiUrl.toString(), {
        headers: {
          'accept': 'application/json',
        },
        signal: controller.signal,
        cache: 'no-store',
        next: { revalidate: 0 }
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        throw new Error(`API responded with status: ${response.status}`)
      }

      const products = await response.json()
      
      // Validate response is an array
      if (!Array.isArray(products)) {
        console.error('Invalid response format:', products)
        throw new Error('API returned invalid data format')
      }

      console.log(`✅ Successfully fetched ${products.length} products`)

      return NextResponse.json(products, {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Content-Type': 'application/json',
        }
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error('Request timeout - API took too long to respond')
      }
      throw fetchError
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error',
        api_url: API_BASE_URL
      },
      { status: 500 }
    )
  }
}
