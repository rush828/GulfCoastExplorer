import { NextRequest, NextResponse } from 'next/server'
import { unsubscribeByToken } from '../../../../lib/newsletter'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json(
        { error: 'Missing unsubscribe token' },
        { status: 400 }
      )
    }

    const success = await unsubscribeByToken(token)
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Successfully unsubscribed from newsletter' 
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error unsubscribing:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    )
  }
}
