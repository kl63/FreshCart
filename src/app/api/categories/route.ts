import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://fastapi.kevinlinportfolio.com/api/v1'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'

    const response = await fetch(`${API_BASE_URL}/categories/?page=${page}&limit=${limit}`, {
      headers: {
        'accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const categories = await response.json()

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
