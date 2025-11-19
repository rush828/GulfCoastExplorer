/**
 * Database-based Subscription Management
 * Replaces filesystem-based subscription management for production use
 */

import { PrismaClient, SubscriptionStatus, SubscriptionPlan } from '@prisma/client'

const prisma = new PrismaClient()

export interface CreateSubscriptionData {
  paypalSubscriptionId: string
  businessId: string
  businessName: string
  email: string
  status: SubscriptionStatus
  plan: SubscriptionPlan
  amount: number
  startDate: Date
  endDate: Date
  nextBillingDate: Date
  paypalCustomerId?: string
}

export interface UpdateSubscriptionData {
  status?: SubscriptionStatus
  lastPaymentDate?: Date
  nextBillingDate?: Date
  canceledDate?: Date
  autoRenew?: boolean
}

export class SubscriptionDB {
  /**
   * Create a new subscription
   */
  async createSubscription(data: CreateSubscriptionData) {
    return await prisma.subscription.create({
      data: {
        paypalSubscriptionId: data.paypalSubscriptionId,
        businessId: data.businessId,
        businessName: data.businessName,
        email: data.email,
        status: data.status,
        plan: data.plan,
        amount: data.amount,
        startDate: data.startDate,
        endDate: data.endDate,
        nextBillingDate: data.nextBillingDate,
        paypalCustomerId: data.paypalCustomerId,
        autoRenew: true
      },
      include: {
        business: true
      }
    })
  }

  /**
   * Update subscription by PayPal subscription ID
   */
  async updateSubscription(paypalSubscriptionId: string, updates: UpdateSubscriptionData) {
    return await prisma.subscription.updateMany({
      where: { paypalSubscriptionId },
      data: {
        ...updates,
        updatedAt: new Date()
      }
    })
  }

  /**
   * Get subscription by PayPal subscription ID
   */
  async getSubscriptionByPaypalId(paypalSubscriptionId: string) {
    return await prisma.subscription.findUnique({
      where: { paypalSubscriptionId },
      include: {
        business: true
      }
    })
  }

  /**
   * Get subscription by business ID
   */
  async getSubscriptionByBusinessId(businessId: string) {
    return await prisma.subscription.findUnique({
      where: { businessId },
      include: {
        business: true
      }
    })
  }

  /**
   * Get all active subscriptions
   */
  async getActiveSubscriptions() {
    return await prisma.subscription.findMany({
      where: { status: 'ACTIVE' },
      include: {
        business: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  /**
   * Get all subscriptions
   */
  async getAllSubscriptions() {
    return await prisma.subscription.findMany({
      include: {
        business: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  /**
   * Get subscription statistics
   */
  async getStats() {
    const [total, active, basic, featured] = await Promise.all([
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.subscription.count({ where: { plan: 'BASIC', status: 'ACTIVE' } }),
      prisma.subscription.count({ where: { plan: 'FEATURED', status: 'ACTIVE' } })
    ])

    const activeSubscriptions = await prisma.subscription.findMany({
      where: { status: 'ACTIVE' },
      select: { amount: true }
    })

    const monthlyRevenue = activeSubscriptions.reduce((sum, sub) => sum + sub.amount, 0) / 12

    // Recent signups (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentSignups = await prisma.subscription.count({
      where: {
        createdAt: { gte: thirtyDaysAgo }
      }
    })

    // Upcoming renewals (next 7 days)
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
    const upcomingRenewals = await prisma.subscription.count({
      where: {
        status: 'ACTIVE',
        nextBillingDate: {
          lte: sevenDaysFromNow,
          gte: new Date()
        }
      }
    })

    return {
      totalSubscriptions: total,
      activeSubscriptions: active,
      monthlyRevenue,
      basicSubscriptions: basic,
      featuredSubscriptions: featured,
      recentSignups,
      upcomingRenewals
    }
  }

  /**
   * Activate business when subscription is created/activated
   */
  async activateBusiness(businessId: string) {
    return await prisma.listing.update({
      where: { id: businessId },
      data: {
        status: 'PUBLISHED'
      }
    })
  }
}

export const subscriptionDB = new SubscriptionDB()

