import { NextRequest, NextResponse } from 'next/server'

// Support both local and production APIs
const PRODUCTION_API = 'https://fastapi.kevinlinportfolio.com/api/v1'
const LOCAL_API = 'http://localhost:8000/api/v1'

// Use environment variable or default to local for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || LOCAL_API

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

    const response = await fetch(apiUrl.toString(), {
      headers: {
        'accept': 'application/json',
      },
      // Add cache control for development
      cache: process.env.NODE_ENV === 'development' ? 'no-store' : 'default',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error response:', errorText)
      throw new Error(`API responded with status: ${response.status}`)
    }

    const products = await response.json()

    return NextResponse.json(products)
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
