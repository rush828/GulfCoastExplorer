import { NextRequest, NextResponse } from 'next/server'
import { getActiveSubscribers, getSubscribers, addSubscriber, updateSubscriber, deleteSubscriber } from '../../../../lib/newsletter'

export async function GET(request: NextRequest) {
  try {
    // Check if this is an admin request (for admin panel)
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get('admin') === 'true'
    
    // For admin requests, check authentication
    if (isAdmin) {
      const adminSession = request.cookies.get('admin-session')
      const adminSecret = request.cookies.get('admin-secret')
      const ADMIN_SECRET = process.env.ADMIN_SECRET
      
      if (!ADMIN_SECRET) {
        throw new Error('ADMIN_SECRET environment variable must be set')
      }
      
      if (!adminSession || !adminSecret || adminSecret.value !== ADMIN_SECRET) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized access' },
          { status: 401 }
        )
      }
      
      // Return all subscribers for admin
      const subscribers = await getSubscribers()
      return NextResponse.json({ 
        success: true, 
        count: subscribers.length,
        subscribers 
      })
    }
    
    // Return only active subscribers for public requests
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

export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    const adminSession = request.cookies.get('admin-session')
    const adminSecret = request.cookies.get('admin-secret')
    const ADMIN_SECRET = process.env.ADMIN_SECRET
    
    if (!ADMIN_SECRET) {
      throw new Error('ADMIN_SECRET environment variable must be set')
    }
    
    if (!adminSession || !adminSecret || adminSecret.value !== ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    const { id, email, firstName, lastName, isActive } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing subscriber ID' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (email !== undefined) updateData.email = email
    if (firstName !== undefined) updateData.firstName = firstName
    if (lastName !== undefined) updateData.lastName = lastName
    if (isActive !== undefined) updateData.isActive = isActive

    const subscriber = await updateSubscriber(id, updateData)
    
    if (!subscriber) {
      return NextResponse.json(
        { error: 'Failed to update subscriber' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully updated subscriber',
      subscriber 
    })
  } catch (error) {
    console.error('Error updating subscriber:', error)
    return NextResponse.json(
      { error: 'Failed to update subscriber' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    const adminSession = request.cookies.get('admin-session')
    const adminSecret = request.cookies.get('admin-secret')
    const ADMIN_SECRET = process.env.ADMIN_SECRET
    
    if (!ADMIN_SECRET) {
      throw new Error('ADMIN_SECRET environment variable must be set')
    }
    
    if (!adminSession || !adminSecret || adminSecret.value !== ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing subscriber ID' },
        { status: 400 }
      )
    }

    const success = await deleteSubscriber(id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete subscriber' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully deleted subscriber'
    })
  } catch (error) {
    console.error('Error deleting subscriber:', error)
    return NextResponse.json(
      { error: 'Failed to delete subscriber' },
      { status: 500 }
    )
  }
}
