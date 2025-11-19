import { NextRequest, NextResponse } from 'next/server'
import { subscriptionDB } from '@/lib/subscription-db'
import { SubscriptionStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    if (action === 'stats') {
      const stats = await subscriptionDB.getStats()
      return NextResponse.json({
        success: true,
        stats
      })
    }
    
    if (action === 'upcoming') {
      // Get subscriptions renewing in next 7 days
      const allActive = await subscriptionDB.getActiveSubscriptions()
      const sevenDaysFromNow = new Date()
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
      const upcoming = allActive.filter(sub => 
        sub.nextBillingDate <= sevenDaysFromNow && sub.nextBillingDate >= new Date()
      )
      return NextResponse.json({
        success: true,
        upcoming
      })
    }
    
    if (action === 'all') {
      // Return all subscriptions
      const subscriptions = await subscriptionDB.getAllSubscriptions()
      return NextResponse.json({
        success: true,
        subscriptions,
        total: subscriptions.length
      })
    }
    
    // Default: return all active subscriptions
    const subscriptions = await subscriptionDB.getActiveSubscriptions()
    return NextResponse.json({
      success: true,
      subscriptions,
      total: subscriptions.length
    })
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { action, paypalSubscriptionId, updates } = data
    
    if (action === 'cancel') {
      const result = await subscriptionDB.updateSubscription(paypalSubscriptionId, {
        status: SubscriptionStatus.CANCELED,
        canceledDate: new Date()
      })
      return NextResponse.json({
        success: result.count > 0,
        message: result.count > 0 ? 'Subscription canceled' : 'Subscription not found'
      })
    }
    
    if (action === 'update') {
      const result = await subscriptionDB.updateSubscription(paypalSubscriptionId, updates)
      return NextResponse.json({
        success: result.count > 0,
        message: result.count > 0 ? 'Subscription updated' : 'Subscription not found'
      })
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error processing subscription action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process subscription action' },
      { status: 500 }
    )
  }
}
