import { NextRequest, NextResponse } from 'next/server'

// Support both local and production APIs
const PRODUCTION_API = 'https://fastapi.kevinlinportfolio.com/api/v1'
const LOCAL_API = 'http://localhost:8000/api/v1'

// Use environment variable or default to local for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || LOCAL_API

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'

    console.log('Fetching categories from:', `${API_BASE_URL}/categories/`)

    const response = await fetch(`${API_BASE_URL}/categories/?page=${page}&limit=${limit}`, {
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

    const categories = await response.json()

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error',
        api_url: API_BASE_URL
      },
      { status: 500 }
    )
  }
}
