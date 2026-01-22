import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fastapi.kevinlinportfolio.com/api/v1'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    const { searchParams } = new URL(request.url)
    
    const apiUrl = new URL(`${API_BASE_URL}/products/`)
    searchParams.forEach((value, key) => {
      apiUrl.searchParams.append(key, value)
    })

    const response = await fetch(apiUrl.toString(), {
      headers: {
        ...(token && { 'Authorization': token }),
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    const body = await request.json()

    console.log('API Proxy: Creating product')
    console.log('API Proxy: Request body:', body)
    console.log('API Proxy: Token present:', !!token)
    console.log('API Proxy: Token value:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN')

    const response = await fetch(`${API_BASE_URL}/products/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
      body: JSON.stringify(body),
    })

    console.log('API Proxy: Backend response status:', response.status)
    console.log('API Proxy: Content-Type:', response.headers.get('content-type'))
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      console.log('API Proxy: Backend response data:', data)
      return NextResponse.json(data, { status: response.status })
    } else {
      // Non-JSON response (likely HTML error page)
      const text = await response.text()
      console.error('❌ API Proxy: Backend returned non-JSON!')
      console.error('Status Code:', response.status)
      console.error('Content-Type:', contentType)
      console.error('Full response text (first 1000 chars):', text.substring(0, 1000))
      
      return NextResponse.json(
        { 
          error: 'Backend returned non-JSON response',
          status: response.status,
          preview: text.substring(0, 500),
          contentType: contentType
        },
        { status: response.status || 500 }
      )
    }
  } catch (error) {
    console.error('API Proxy: Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
