/**
 * Subscription Management System
 * Handles PayPal subscription tracking and business status
 */

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

export interface Subscription {
  id: string
  businessId: string
  businessName: string
  email: string
  subscriptionId: string
  status: 'active' | 'canceled' | 'expired' | 'suspended'
  plan: 'basic' | 'featured'
  amount: number
  startDate: string
  endDate: string
  nextBillingDate: string
  paypalCustomerId?: string
  lastPaymentDate?: string
  canceledDate?: string
  autoRenew: boolean
}

export interface SubscriptionStats {
  totalSubscriptions: number
  activeSubscriptions: number
  monthlyRevenue: number
  annualRevenue: number
  churnRate: number
  basicSubscriptions: number
  featuredSubscriptions: number
  recentSignups: number
  upcomingRenewals: number
}

class SubscriptionManager {
  private subscriptionsFile: string

  constructor() {
    this.subscriptionsFile = join(process.cwd(), 'data', 'subscriptions.json')
    this.ensureSubscriptionsFile()
  }

  /**
   * Add new subscription
   */
  async addSubscription(subscription: Omit<Subscription, 'id'>): Promise<Subscription> {
    const subscriptions = this.getSubscriptions()
    const newSubscription: Subscription = {
      id: this.generateId(),
      ...subscription
    }

    subscriptions.push(newSubscription)
    this.saveSubscriptions(subscriptions)
    
    return newSubscription
  }

  /**
   * Update subscription status
   */
  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<boolean> {
    const subscriptions = this.getSubscriptions()
    const index = subscriptions.findIndex(sub => sub.id === id)
    
    if (index === -1) return false
    
    subscriptions[index] = { ...subscriptions[index], ...updates }
    this.saveSubscriptions(subscriptions)
    
    return true
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(id: string): Promise<boolean> {
    return this.updateSubscription(id, {
      status: 'canceled',
      canceledDate: new Date().toISOString(),
      autoRenew: false
    })
  }

  /**
   * Get subscription by business ID
   */
  getSubscriptionByBusiness(businessId: string): Subscription | null {
    const subscriptions = this.getSubscriptions()
    return subscriptions.find(sub => sub.businessId === businessId) || null
  }

  /**
   * Get all active subscriptions
   */
  getActiveSubscriptions(): Subscription[] {
    const subscriptions = this.getSubscriptions()
    return subscriptions.filter(sub => sub.status === 'active')
  }

  /**
   * Get subscription statistics
   */
  getSubscriptionStats(): SubscriptionStats {
    const subscriptions = this.getSubscriptions()
    const active = subscriptions.filter(sub => sub.status === 'active')
    const basic = active.filter(sub => sub.plan === 'basic')
    const featured = active.filter(sub => sub.plan === 'featured')
    
    // Calculate monthly revenue (annual subscriptions / 12)
    const monthlyRevenue = active.reduce((total, sub) => total + (sub.amount / 12), 0)
    const annualRevenue = active.reduce((total, sub) => total + sub.amount, 0)
    
    // Recent signups (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentSignups = subscriptions.filter(sub => 
      new Date(sub.startDate) > thirtyDaysAgo
    ).length

    // Upcoming renewals (next 30 days)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    const upcomingRenewals = active.filter(sub => 
      new Date(sub.nextBillingDate) <= thirtyDaysFromNow
    ).length

    // Calculate churn rate (canceled / total * 100)
    const canceled = subscriptions.filter(sub => sub.status === 'canceled')
    const churnRate = subscriptions.length > 0 ? (canceled.length / subscriptions.length) * 100 : 0

    return {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: active.length,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      annualRevenue: Math.round(annualRevenue * 100) / 100,
      churnRate: Math.round(churnRate * 100) / 100,
      basicSubscriptions: basic.length,
      featuredSubscriptions: featured.length,
      recentSignups,
      upcomingRenewals
    }
  }

  /**
   * Check for expired subscriptions
   */
  checkExpiredSubscriptions(): Subscription[] {
    const subscriptions = this.getSubscriptions()
    const now = new Date()
    const expired: Subscription[] = []

    subscriptions.forEach(sub => {
      if (sub.status === 'active' && new Date(sub.endDate) < now) {
        sub.status = 'expired'
        expired.push(sub)
      }
    })

    if (expired.length > 0) {
      this.saveSubscriptions(subscriptions)
    }

    return expired
  }

  /**
   * Get upcoming renewals
   */
  getUpcomingRenewals(days: number = 7): Subscription[] {
    const subscriptions = this.getSubscriptions()
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() + days)

    return subscriptions.filter(sub => 
      sub.status === 'active' && 
      new Date(sub.nextBillingDate) <= cutoffDate
    )
  }

  private getSubscriptions(): Subscription[] {
    try {
      if (!existsSync(this.subscriptionsFile)) {
        return []
      }
      const content = readFileSync(this.subscriptionsFile, 'utf-8')
      return JSON.parse(content)
    } catch {
      return []
    }
  }

  private saveSubscriptions(subscriptions: Subscription[]): void {
    try {
      writeFileSync(this.subscriptionsFile, JSON.stringify(subscriptions, null, 2))
    } catch (error) {
      console.error('Failed to save subscriptions:', error)
    }
  }

  private ensureSubscriptionsFile(): void {
    try {
      const dataDir = join(process.cwd(), 'data')
      if (!existsSync(dataDir)) {
        require('fs').mkdirSync(dataDir, { recursive: true })
      }
      if (!existsSync(this.subscriptionsFile)) {
        writeFileSync(this.subscriptionsFile, '[]')
      }
    } catch (error) {
      console.error('Failed to ensure subscriptions file:', error)
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}

// Global subscription manager instance
export const subscriptionManager = new SubscriptionManager()

/**
 * Get revenue projection based on current subscriptions
 */
export function getRevenueProjection(months: number = 12): {
  basicRevenue: number
  featuredRevenue: number
  totalRevenue: number
} {
  const active = subscriptionManager.getActiveSubscriptions()
  const basic = active.filter(sub => sub.plan === 'basic')
  const featured = active.filter(sub => sub.plan === 'featured')
  
  const basicRevenue = basic.length * 149 * (months / 12)
  const featuredRevenue = featured.length * 399 * (months / 12)
  
  return {
    basicRevenue: Math.round(basicRevenue * 100) / 100,
    featuredRevenue: Math.round(featuredRevenue * 100) / 100,
    totalRevenue: Math.round((basicRevenue + featuredRevenue) * 100) / 100
  }
}
