import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface NewsletterSubscriber {
  id: string
  email: string
  firstName: string
  lastName: string
  subscribedAt: Date
  isActive: boolean
  unsubscribeToken: string
}

export async function getSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' }
    })
    return subscribers.map(sub => ({
      ...sub,
      subscribedAt: sub.subscribedAt
    }))
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return []
  }
}

export async function addSubscriber(subscriber: Omit<NewsletterSubscriber, 'id' | 'subscribedAt' | 'isActive' | 'unsubscribeToken'>): Promise<NewsletterSubscriber> {
  try {
    // Check if subscriber already exists
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: subscriber.email }
    })

    if (existing) {
      // If they previously unsubscribed, reactivate them
      if (!existing.isActive) {
        const updated = await prisma.newsletterSubscriber.update({
          where: { email: subscriber.email },
          data: {
            isActive: true,
            subscribedAt: new Date()
          }
        })
        console.log('Newsletter: Reactivated subscriber:', subscriber.email)
        return updated as NewsletterSubscriber
      }
      console.log('Newsletter: Subscriber already exists:', subscriber.email)
      return existing as NewsletterSubscriber
    }

    // Create new subscriber
    const newSubscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: subscriber.email,
        firstName: subscriber.firstName,
        lastName: subscriber.lastName,
        unsubscribeToken: generateUnsubscribeToken()
      }
    })

    console.log('Newsletter: New subscriber added:', subscriber.email)
    return newSubscriber as NewsletterSubscriber
  } catch (error) {
    console.error('Error adding subscriber:', error)
    throw error
  }
}

export async function unsubscribeByToken(token: string): Promise<boolean> {
  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token }
    })

    if (!subscriber) {
      return false
    }

    await prisma.newsletterSubscriber.update({
      where: { unsubscribeToken: token },
      data: { isActive: false }
    })

    console.log('Newsletter: Unsubscribed:', subscriber.email)
    return true
  } catch (error) {
    console.error('Error unsubscribing:', error)
    return false
  }
}

export async function getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      orderBy: { subscribedAt: 'desc' }
    })
    return subscribers as NewsletterSubscriber[]
  } catch (error) {
    console.error('Error fetching active subscribers:', error)
    return []
  }
}

export async function updateSubscriber(
  id: string,
  data: Partial<Pick<NewsletterSubscriber, 'email' | 'firstName' | 'lastName' | 'isActive'>>
): Promise<NewsletterSubscriber | null> {
  try {
    const updated = await prisma.newsletterSubscriber.update({
      where: { id },
      data
    })
    console.log('Newsletter: Updated subscriber:', updated.email)
    return updated as NewsletterSubscriber
  } catch (error) {
    console.error('Error updating subscriber:', error)
    return null
  }
}

export async function deleteSubscriber(id: string): Promise<boolean> {
  try {
    await prisma.newsletterSubscriber.delete({
      where: { id }
    })
    console.log('Newsletter: Deleted subscriber:', id)
    return true
  } catch (error) {
    console.error('Error deleting subscriber:', error)
    return false
  }
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

function generateUnsubscribeToken(): string {
  return Math.random().toString(36).substr(2, 32)
}
