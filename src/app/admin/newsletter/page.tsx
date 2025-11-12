'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '../../../components/AdminLayout'

interface Subscriber {
  id: string
  email: string
  firstName: string
  lastName: string
  subscribedAt: string
  isActive: boolean
}

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [newsletterData, setNewsletterData] = useState({
    subject: '',
    content: '',
    previewText: ''
  })
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<any>(null)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/newsletter/subscribers')
      const data = await response.json()
      if (data.success) {
        setSubscribers(data.subscribers)
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendNewsletter = async () => {
    if (!newsletterData.subject || !newsletterData.content) {
      alert('Please fill in subject and content')
      return
    }

    setSending(true)
    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsletterData),
      })

      const result = await response.json()
      setSendResult(result)
      
      if (result.success) {
        setNewsletterData({ subject: '', content: '', previewText: '' })
      }
    } catch (error) {
      console.error('Error sending newsletter:', error)
      setSendResult({ success: false, error: 'Failed to send newsletter' })
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-8">Loading...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Newsletter Management</h1>
        
        {/* Subscribers List */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Subscribers ({subscribers.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            {subscribers.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                <p className="text-lg mb-2">No subscribers yet</p>
                <p className="text-sm">Subscribers will appear here when they sign up via the contact form.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribed
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {subscriber.firstName} {subscriber.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subscriber.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(subscriber.subscribedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Newsletter Composer */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Send Newsletter</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={newsletterData.subject}
                  onChange={(e) => setNewsletterData({...newsletterData, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Newsletter subject"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (HTML)
                </label>
                <textarea
                  value={newsletterData.content}
                  onChange={(e) => setNewsletterData({...newsletterData, content: e.target.value})}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your newsletter content in HTML format..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview Text
                </label>
                <input
                  type="text"
                  value={newsletterData.previewText}
                  onChange={(e) => setNewsletterData({...newsletterData, previewText: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional preview text"
                />
              </div>

              <button
                onClick={sendNewsletter}
                disabled={sending || !newsletterData.subject || !newsletterData.content || subscribers.length === 0}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : `Send to ${subscribers.length} subscribers`}
              </button>
            </div>

            {sendResult && (
              <div className={`mt-4 p-4 rounded-md ${
                sendResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                <p className="font-medium">
                  {sendResult.success ? 'Newsletter sent successfully!' : 'Failed to send newsletter'}
                </p>
                {sendResult.message && <p className="text-sm mt-1">{sendResult.message}</p>}
                {sendResult.error && <p className="text-sm mt-1">{sendResult.error}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
