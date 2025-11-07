import { promises as fs } from 'fs'
import path from 'path'

export interface NewsletterSubscriber {
  id: string
  email: string
  firstName: string
  lastName: string
  subscribedAt: string
  isActive: boolean
  unsubscribeToken: string
}

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'src/data/newsletter-subscribers.json')

export async function getSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

export async function addSubscriber(subscriber: Omit<NewsletterSubscriber, 'id' | 'subscribedAt' | 'isActive' | 'unsubscribeToken'>): Promise<NewsletterSubscriber> {
  const subscribers = await getSubscribers()
  
  // Check if email already exists
  const existingSubscriber = subscribers.find(s => s.email === subscriber.email)
  if (existingSubscriber) {
    // Reactivate if previously unsubscribed
    if (!existingSubscriber.isActive) {
      existingSubscriber.isActive = true
      existingSubscriber.subscribedAt = new Date().toISOString()
      await saveSubscribers(subscribers)
    }
    return existingSubscriber
  }

  const newSubscriber: NewsletterSubscriber = {
    ...subscriber,
    id: generateId(),
    subscribedAt: new Date().toISOString(),
    isActive: true,
    unsubscribeToken: generateUnsubscribeToken()
  }

  subscribers.push(newSubscriber)
  await saveSubscribers(subscribers)
  
  return newSubscriber
}

export async function unsubscribeByToken(token: string): Promise<boolean> {
  const subscribers = await getSubscribers()
  const subscriber = subscribers.find(s => s.unsubscribeToken === token)
  
  if (subscriber) {
    subscriber.isActive = false
    await saveSubscribers(subscribers)
    return true
  }
  
  return false
}

export async function getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
  const subscribers = await getSubscribers()
  return subscribers.filter(s => s.isActive)
}

async function saveSubscribers(subscribers: NewsletterSubscriber[]): Promise<void> {
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2))
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

function generateUnsubscribeToken(): string {
  return Math.random().toString(36).substr(2, 32)
}
