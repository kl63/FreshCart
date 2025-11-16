import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    const token = request.headers.get('authorization')

    if (!token) {
      return NextResponse.json(
        { detail: 'Authorization required' },
        { status: 401 }
      )
    }

    console.log('Creating payment intent for order:', orderId)

    const response = await fetch(
      `${API_BASE_URL}/orders/${orderId}/create-payment-intent`,
      {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Backend payment intent failed:', response.status)
      console.error('❌ Backend URL:', `${API_BASE_URL}/orders/${orderId}/create-payment-intent`)
      console.error('❌ Backend response:', errorText)
      
      let errorDetail
      try {
        errorDetail = JSON.parse(errorText)
      } catch {
        errorDetail = { detail: errorText }
      }
      
      return NextResponse.json(
        errorDetail,
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      {
        error: 'Failed to create payment intent',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
