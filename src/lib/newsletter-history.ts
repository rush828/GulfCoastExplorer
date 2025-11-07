import fs from 'fs/promises'
import path from 'path'

const HISTORY_FILE = path.join(process.cwd(), 'data', 'newsletter-history.json')

export interface NewsletterMessage {
  id: string
  subject: string
  content: string
  sentAt: string
  recipientCount: number
  successCount: number
  failureCount: number
  sentBy: string
}

async function ensureHistoryFile(): Promise<void> {
  try {
    await fs.access(HISTORY_FILE)
  } catch {
    await fs.writeFile(HISTORY_FILE, JSON.stringify([], null, 2))
  }
}

export async function logNewsletterSend(message: Omit<NewsletterMessage, 'id'>): Promise<void> {
  await ensureHistoryFile()
  
  const history = await getNewsletterHistory()
  const newMessage: NewsletterMessage = {
    id: generateId(),
    ...message
  }
  
  history.unshift(newMessage) // Add to beginning
  
  // Keep only last 100 messages
  if (history.length > 100) {
    history.splice(100)
  }
  
  await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2))
}

export async function getNewsletterHistory(): Promise<NewsletterMessage[]> {
  await ensureHistoryFile()
  
  try {
    const content = await fs.readFile(HISTORY_FILE, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error('Error reading newsletter history:', error)
    return []
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}




