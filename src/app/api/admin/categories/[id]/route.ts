import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fastapi.kevinlinportfolio.com/api/v1'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const token = request.headers.get('authorization')
    const body = await request.json()

    console.log('=== API Proxy PUT Request (Category) ===')
    console.log('Category ID:', id)
    console.log('Request body:', JSON.stringify(body, null, 2))
    console.log('Token present:', !!token)

    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
      body: JSON.stringify(body),
    })

    console.log('=== API Proxy PUT Response (Category) ===')
    console.log('Status:', response.status)

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      console.log('Response data:', data)
      return NextResponse.json(data, { status: response.status })
    } else {
      const text = await response.text()
      console.error('Backend returned non-JSON:', text.substring(0, 500))
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
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const token = request.headers.get('authorization')

    console.log('=== API Proxy DELETE Request (Category) ===')
    console.log('Category ID:', id)
    console.log('Token present:', !!token)

    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { 'Authorization': token }),
      },
    })

    console.log('=== API Proxy DELETE Response (Category) ===')
    console.log('Status:', response.status)

    if (response.status === 204 || response.status === 200) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      return NextResponse.json(data, { status: response.status })
    } else {
      const text = await response.text()
      console.error('Backend returned non-JSON:', text.substring(0, 500))
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
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
