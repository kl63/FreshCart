import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fastapi.kevinlinportfolio.com/api/v1'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('authorization')

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: {
        ...(token && { 'Authorization': token }),
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('authorization')
    const body = await request.json()

    console.log('=== API Proxy PUT Request ===')
    console.log('Product ID:', id)
    console.log('Request body:', JSON.stringify(body, null, 2))
    console.log('Token present:', !!token)
    console.log('API URL:', `${API_BASE_URL}/products/${id}`)

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
      body: JSON.stringify(body),
    })

    console.log('=== API Proxy PUT Response ===')
    console.log('Status:', response.status)
    console.log('Status Text:', response.statusText)
    console.log('Headers:', Object.fromEntries(response.headers.entries()))
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      console.log('API Proxy: Backend response data:', data)
      return NextResponse.json(data, { status: response.status })
    } else {
      // Non-JSON response (likely HTML error page)
      const text = await response.text()
      console.error('API Proxy: Backend returned non-JSON:', text.substring(0, 500))
      return NextResponse.json(
        { 
          error: 'Backend returned non-JSON response',
          status: response.status,
          preview: text.substring(0, 200)
        },
        { status: response.status || 500 }
      )
    }
  } catch (error) {
    console.error('API Proxy: Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('authorization')

    console.log('=== DELETE Product Request ===')
    console.log('Product ID:', id)
    console.log('Token present:', !!token)
    console.log('API URL:', `${API_BASE_URL}/products/${id}`)

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { 'Authorization': token }),
      },
    })

    console.log('=== DELETE Response ===')
    console.log('Status:', response.status)
    console.log('Status Text:', response.statusText)

    if (response.status === 204) {
      console.log('✅ Product deleted successfully (204 No Content)')
      return new NextResponse(null, { status: 204 })
    }

    // Try to parse error response
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      console.log('❌ Backend error response:', data)
      return NextResponse.json(data, { status: response.status })
    } else {
      const text = await response.text()
      console.error('❌ Non-JSON response:', text.substring(0, 500))
      return NextResponse.json(
        { 
          error: 'Backend returned non-JSON response',
          detail: text.substring(0, 200)
        },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('❌ Error deleting product:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete product',
        detail: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
