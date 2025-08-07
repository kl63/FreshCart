import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://fastapi.kevinlinportfolio.com/api/v1'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Build the API URL with all query parameters
    const apiUrl = new URL(`${API_BASE_URL}/products/`)
    
    // Forward all query parameters to the external API
    searchParams.forEach((value, key) => {
      apiUrl.searchParams.set(key, value)
    })

    const response = await fetch(apiUrl.toString(), {
      headers: {
        'accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const products = await response.json()

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
