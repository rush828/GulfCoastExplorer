/**
 * PayPal Webhook Processing
 * Handles subscription events and business listing management
 */

import { subscriptionManager } from './subscription-management'
import { auditLogger, getUserInfo } from './audit-log'

export interface PayPalWebhookEvent {
  id: string
  event_type: string
  resource_type: string
  resource: any
  summary: string
  create_time: string
  event_version: string
}

/**
 * Process PayPal webhook events
 */
export async function processPayPalWebhook(event: PayPalWebhookEvent, request: any): Promise<{
  success: boolean
  message: string
  action?: string
}> {
  const userInfo = getUserInfo(request)
  
  try {
    // Log the webhook event
    auditLogger.log({
      action: 'paypal_webhook_received',
      resource: 'payment_processing',
      ...userInfo,
      details: {
        eventType: event.event_type,
        eventId: event.id,
        resourceType: event.resource_type
      },
      result: 'success',
      riskLevel: 'medium'
    })

    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.CREATED':
        return await handleSubscriptionCreated(event)
      
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        return await handleSubscriptionActivated(event)
      
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        return await handleSubscriptionCancelled(event)
      
      case 'BILLING.SUBSCRIPTION.SUSPENDED':
        return await handleSubscriptionSuspended(event)
      
      case 'BILLING.SUBSCRIPTION.EXPIRED':
        return await handleSubscriptionExpired(event)
      
      case 'PAYMENT.SALE.COMPLETED':
        return await handlePaymentCompleted(event)
      
      case 'PAYMENT.SALE.DENIED':
        return await handlePaymentDenied(event)
      
      default:
        console.log(`Unhandled PayPal event type: ${event.event_type}`)
        return {
          success: true,
          message: `Event ${event.event_type} logged but not processed`
        }
    }
  } catch (error) {
    // Log the error
    auditLogger.log({
      action: 'paypal_webhook_error',
      resource: 'payment_processing',
      ...userInfo,
      details: {
        eventType: event.event_type,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      result: 'failure',
      riskLevel: 'high'
    })

    throw error
  }
}

/**
 * Handle new subscription creation
 */
async function handleSubscriptionCreated(event: PayPalWebhookEvent) {
  const resource = event.resource
  
  // Extract subscription details
  const subscriptionData = {
    businessId: generateBusinessId(),
    businessName: resource.custom || 'Unknown Business',
    email: resource.subscriber?.email_address || '',
    subscriptionId: resource.id,
    status: 'active' as const,
    plan: resource.plan_id?.includes('basic') ? 'basic' as const : 'featured' as const,
    amount: resource.plan_id?.includes('basic') ? 149 : 399,
    startDate: resource.create_time,
    endDate: calculateEndDate(resource.create_time),
    nextBillingDate: resource.billing_info?.next_billing_time || calculateNextBilling(resource.create_time),
    autoRenew: true
  }

  await subscriptionManager.addSubscription(subscriptionData)

  return {
    success: true,
    message: 'Subscription created successfully',
    action: 'subscription_created'
  }
}

/**
 * Handle subscription activation
 */
async function handleSubscriptionActivated(event: PayPalWebhookEvent) {
  const resource = event.resource
  
  const updated = await subscriptionManager.updateSubscription(resource.id, {
    status: 'active',
    lastPaymentDate: new Date().toISOString()
  })

  return {
    success: updated,
    message: updated ? 'Subscription activated' : 'Subscription not found',
    action: 'subscription_activated'
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancelled(event: PayPalWebhookEvent) {
  const resource = event.resource
  
  const updated = await subscriptionManager.cancelSubscription(resource.id)

  return {
    success: updated,
    message: updated ? 'Subscription cancelled' : 'Subscription not found',
    action: 'subscription_cancelled'
  }
}

/**
 * Handle subscription suspension
 */
async function handleSubscriptionSuspended(event: PayPalWebhookEvent) {
  const resource = event.resource
  
  const updated = await subscriptionManager.updateSubscription(resource.id, {
    status: 'suspended'
  })

  return {
    success: updated,
    message: updated ? 'Subscription suspended' : 'Subscription not found',
    action: 'subscription_suspended'
  }
}

/**
 * Handle subscription expiration
 */
async function handleSubscriptionExpired(event: PayPalWebhookEvent) {
  const resource = event.resource
  
  const updated = await subscriptionManager.updateSubscription(resource.id, {
    status: 'expired'
  })

  return {
    success: updated,
    message: updated ? 'Subscription expired' : 'Subscription not found',
    action: 'subscription_expired'
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentCompleted(event: PayPalWebhookEvent) {
  const resource = event.resource
  
  // Update last payment date
  const updated = await subscriptionManager.updateSubscription(resource.billing_agreement_id, {
    lastPaymentDate: resource.create_time,
    nextBillingDate: calculateNextBilling(resource.create_time)
  })

  return {
    success: updated,
    message: updated ? 'Payment recorded' : 'Subscription not found',
    action: 'payment_completed'
  }
}

/**
 * Handle denied payment
 */
async function handlePaymentDenied(event: PayPalWebhookEvent) {
  const resource = event.resource
  
  // Suspend subscription due to payment failure
  const updated = await subscriptionManager.updateSubscription(resource.billing_agreement_id, {
    status: 'suspended'
  })

  return {
    success: updated,
    message: updated ? 'Subscription suspended due to payment failure' : 'Subscription not found',
    action: 'payment_denied'
  }
}

/**
 * Generate unique business ID
 */
function generateBusinessId(): string {
  return 'biz_' + Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Calculate subscription end date (1 year from start)
 */
function calculateEndDate(startDate: string): string {
  const date = new Date(startDate)
  date.setFullYear(date.getFullYear() + 1)
  return date.toISOString()
}

/**
 * Calculate next billing date (1 year from last payment)
 */
function calculateNextBilling(lastPayment: string): string {
  const date = new Date(lastPayment)
  date.setFullYear(date.getFullYear() + 1)
  return date.toISOString()
}

/**
 * Verify PayPal webhook signature (implement in production)
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  webhookId: string
): boolean {
  // In production, implement actual PayPal signature verification
  // https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature
  
  // For now, return true for development
  return process.env.NODE_ENV === 'development' ? true : false
}
