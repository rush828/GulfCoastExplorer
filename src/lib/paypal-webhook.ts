/**
 * PayPal Webhook Processing
 * Handles subscription events and business listing management
 */

import { subscriptionDB } from './subscription-db'
import { SubscriptionStatus, SubscriptionPlan } from '@prisma/client'
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
  
  // Log the resource structure for debugging
  console.log('PayPal subscription created webhook resource:', JSON.stringify(resource, null, 2))
  
  // Get business ID from PayPal custom field (passed from form)
  // PayPal subscription buttons pass custom field in the resource
  const businessId = resource.custom_id || 
                     resource.custom || 
                     resource.plan?.custom_id ||
                     null
  
  if (!businessId) {
    console.error('No business ID found in PayPal webhook. Resource keys:', Object.keys(resource))
    console.error('Full resource:', JSON.stringify(resource, null, 2))
    return {
      success: false,
      message: 'Business ID not found in webhook custom field',
      action: 'subscription_created'
    }
  }
  
  console.log(`Processing subscription for business ID: ${businessId}`)

  // Determine plan and amount from item name or plan ID
  const itemName = resource.plan_id || resource.name || ''
  const isBasic = itemName.toLowerCase().includes('basic') || 
                  (resource.billing_cycle_sequence === 1 && resource.amount?.value === '149.00')
  const plan = isBasic ? SubscriptionPlan.BASIC : SubscriptionPlan.FEATURED
  const amount = isBasic ? 149 : 399

  // Get business details from database
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  
  const business = await prisma.listing.findUnique({
    where: { id: businessId }
  })

  if (!business) {
    console.error(`Business not found: ${businessId}`)
    return {
      success: false,
      message: `Business not found: ${businessId}`,
      action: 'subscription_created'
    }
  }

  // Create subscription in database
  const subscription = await subscriptionDB.createSubscription({
    paypalSubscriptionId: resource.id,
    businessId: business.id,
    businessName: business.name,
    email: business.contactEmail || resource.subscriber?.email_address || '',
    status: SubscriptionStatus.ACTIVE,
    plan,
    amount,
    startDate: new Date(resource.create_time || resource.start_time || new Date()),
    endDate: calculateEndDate(resource.create_time || resource.start_time || new Date().toISOString()),
    nextBillingDate: new Date(resource.billing_info?.next_billing_time || calculateNextBilling(resource.create_time || new Date().toISOString())),
    paypalCustomerId: resource.subscriber?.payer_id
  })

  // Activate the business (change status from PENDING to PUBLISHED)
  await subscriptionDB.activateBusiness(businessId)

  return {
    success: true,
    message: 'Subscription created and business activated successfully',
    action: 'subscription_created'
  }
}

/**
 * Handle subscription activation
 */
async function handleSubscriptionActivated(event: PayPalWebhookEvent) {
  const resource = event.resource
  
  const subscription = await subscriptionDB.getSubscriptionByPaypalId(resource.id)
  
  if (!subscription) {
    return {
      success: false,
      message: 'Subscription not found',
      action: 'subscription_activated'
    }
  }

  await subscriptionDB.updateSubscription(resource.id, {
    status: SubscriptionStatus.ACTIVE,
    lastPaymentDate: new Date()
  })

  // Activate the business if it's still pending
  if (subscription.business.status === 'PENDING') {
    await subscriptionDB.activateBusiness(subscription.businessId)
  }

  return {
    success: true,
    message: 'Subscription activated and business published',
    action: 'subscription_activated'
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancelled(event: PayPalWebhookEvent) {
  const resource = event.resource
  
  const result = await subscriptionDB.updateSubscription(resource.id, {
    status: SubscriptionStatus.CANCELED,
    canceledDate: new Date()
  })

  return {
    success: result.count > 0,
    message: result.count > 0 ? 'Subscription cancelled' : 'Subscription not found',
    action: 'subscription_cancelled'
  }
}

/**
 * Handle subscription suspension
 */
async function handleSubscriptionSuspended(event: PayPalWebhookEvent) {
  const resource = event.resource
  
  const result = await subscriptionDB.updateSubscription(resource.id, {
    status: SubscriptionStatus.SUSPENDED
  })

  return {
    success: result.count > 0,
    message: result.count > 0 ? 'Subscription suspended' : 'Subscription not found',
    action: 'subscription_suspended'
  }
}

/**
 * Handle subscription expiration
 */
async function handleSubscriptionExpired(event: PayPalWebhookEvent) {
  const resource = event.resource
  
  const result = await subscriptionDB.updateSubscription(resource.id, {
    status: SubscriptionStatus.EXPIRED
  })

  return {
    success: result.count > 0,
    message: result.count > 0 ? 'Subscription expired' : 'Subscription not found',
    action: 'subscription_expired'
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentCompleted(event: PayPalWebhookEvent) {
  const resource = event.resource
  
  // Find subscription by PayPal subscription ID
  const subscription = await subscriptionDB.getSubscriptionByPaypalId(resource.billing_agreement_id || resource.subscription_id)
  
  if (!subscription) {
    return {
      success: false,
      message: 'Subscription not found for payment',
      action: 'payment_completed'
    }
  }

  // Update last payment date and next billing date
  await subscriptionDB.updateSubscription(subscription.paypalSubscriptionId, {
    lastPaymentDate: new Date(resource.create_time || new Date()),
    nextBillingDate: new Date(calculateNextBilling(resource.create_time || new Date().toISOString()))
  })

  return {
    success: true,
    message: 'Payment recorded',
    action: 'payment_completed'
  }
}

/**
 * Handle denied payment
 */
async function handlePaymentDenied(event: PayPalWebhookEvent) {
  const resource = event.resource
  
  // Suspend subscription due to payment failure
  const result = await subscriptionDB.updateSubscription(resource.billing_agreement_id || resource.subscription_id, {
    status: SubscriptionStatus.SUSPENDED
  })

  return {
    success: result.count > 0,
    message: result.count > 0 ? 'Subscription suspended due to payment failure' : 'Subscription not found',
    action: 'payment_denied'
  }
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
