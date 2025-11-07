import { NextRequest, NextResponse } from 'next/server'
import { subscriptionManager } from '@/lib/subscription-management'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    if (action === 'stats') {
      const stats = subscriptionManager.getSubscriptionStats()
      return NextResponse.json({
        success: true,
        stats
      })
    }
    
    if (action === 'upcoming') {
      const days = parseInt(searchParams.get('days') || '7')
      const upcoming = subscriptionManager.getUpcomingRenewals(days)
      return NextResponse.json({
        success: true,
        upcoming
      })
    }
    
    // Default: return all active subscriptions
    const subscriptions = subscriptionManager.getActiveSubscriptions()
    return NextResponse.json({
      success: true,
      subscriptions,
      total: subscriptions.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { action, subscriptionId, updates } = data
    
    if (action === 'cancel') {
      const success = await subscriptionManager.cancelSubscription(subscriptionId)
      return NextResponse.json({
        success,
        message: success ? 'Subscription canceled' : 'Subscription not found'
      })
    }
    
    if (action === 'update') {
      const success = await subscriptionManager.updateSubscription(subscriptionId, updates)
      return NextResponse.json({
        success,
        message: success ? 'Subscription updated' : 'Subscription not found'
      })
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process subscription action' },
      { status: 500 }
    )
  }
}
