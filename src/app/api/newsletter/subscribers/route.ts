import { NextRequest, NextResponse } from 'next/server'
import { getActiveSubscribers, addSubscriber } from '../../../../lib/newsletter'

export async function GET() {
  try {
    const subscribers = await getActiveSubscribers()
    return NextResponse.json({ 
      success: true, 
      count: subscribers.length,
      subscribers 
    })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json()
    
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const subscriber = await addSubscriber({ email, firstName, lastName })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter',
      subscriber 
    })
  } catch (error) {
    console.error('Error adding subscriber:', error)
    return NextResponse.json(
      { error: 'Failed to add subscriber' },
      { status: 500 }
    )
  }
}
