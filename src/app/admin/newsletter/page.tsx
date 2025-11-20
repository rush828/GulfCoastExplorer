'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import AdminLayout from '../../../components/AdminLayout'
import 'react-quill/dist/quill.snow.css'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Subscriber>>({})
  const [newsletterData, setNewsletterData] = useState({
    subject: '',
    content: '',
    previewText: ''
  })
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Calculate active subscribers count
  const activeSubscribersCount = subscribers.filter(s => s.isActive).length

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      setError(null)
      const response = await fetch('/api/newsletter/subscribers?admin=true')
      const data = await response.json()
      if (data.success) {
        setSubscribers(data.subscribers)
      } else {
        setError(data.error || 'Failed to fetch subscribers')
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error)
      setError('Failed to load subscribers. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (subscriber: Subscriber) => {
    setEditingId(subscriber.id)
    setEditForm({
      email: subscriber.email,
      firstName: subscriber.firstName,
      lastName: subscriber.lastName,
      isActive: subscriber.isActive
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleSaveEdit = async (id: string) => {
    try {
      setError(null)
      setSuccessMessage(null)
      
      // Validate form
      if (!editForm.email || !editForm.firstName || !editForm.lastName) {
        setError('Please fill in all required fields')
        return
      }

      const response = await fetch('/api/newsletter/subscribers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          ...editForm
        }),
      })

      const data = await response.json()
      if (data.success) {
        setSuccessMessage('Subscriber updated successfully')
        await fetchSubscribers()
        setEditingId(null)
        setEditForm({})
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setError(data.error || 'Failed to update subscriber')
      }
    } catch (error) {
      console.error('Error updating subscriber:', error)
      setError('Failed to update subscriber. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber? This action cannot be undone.')) {
      return
    }

    setDeletingId(id)
    setError(null)
    setSuccessMessage(null)
    try {
      const response = await fetch(`/api/newsletter/subscribers?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        setSuccessMessage('Subscriber deleted successfully')
        await fetchSubscribers()
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setError(data.error || 'Failed to delete subscriber')
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error)
      setError('Failed to delete subscriber. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const sendNewsletter = async () => {
    if (!newsletterData.subject || !newsletterData.content) {
      setError('Please fill in subject and content')
      return
    }

    setSending(true)
    setError(null)
    setSuccessMessage(null)
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
        setSuccessMessage(result.message || 'Newsletter sent successfully')
        setTimeout(() => {
          setSuccessMessage(null)
          setSendResult(null)
        }, 5000)
      } else {
        setError(result.error || 'Failed to send newsletter')
      }
    } catch (error) {
      console.error('Error sending newsletter:', error)
      setError('Failed to send newsletter. Please try again.')
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
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex text-red-400 hover:text-red-600"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="inline-flex text-green-400 hover:text-green-600"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className={!subscriber.isActive ? 'bg-gray-50' : ''}>
                      {editingId === subscriber.id ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editForm.firstName || ''}
                                onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                placeholder="First Name"
                              />
                              <input
                                type="text"
                                value={editForm.lastName || ''}
                                onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                placeholder="Last Name"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="email"
                              value={editForm.email || ''}
                              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              placeholder="Email"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={editForm.isActive ? 'true' : 'false'}
                              onChange={(e) => setEditForm({...editForm, isActive: e.target.value === 'true'})}
                              className="px-2 py-1 text-sm border border-gray-300 rounded"
                            >
                              <option value="true">Active</option>
                              <option value="false">Inactive</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(subscriber.subscribedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSaveEdit(subscriber.id)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {subscriber.firstName} {subscriber.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {subscriber.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              subscriber.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {subscriber.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(subscriber.subscribedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(subscriber)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(subscriber.id)}
                                disabled={deletingId === subscriber.id}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              >
                                {deletingId === subscriber.id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </>
                      )}
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
                  Content
                </label>
                <div className="bg-white rounded-md border border-gray-300 overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={newsletterData.content}
                    onChange={(value) => setNewsletterData({...newsletterData, content: value})}
                    placeholder="Enter your newsletter content..."
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'color': [] }, { 'background': [] }],
                        ['link', 'image'],
                        [{ 'align': [] }],
                        ['clean']
                      ]
                    }}
                    formats={[
                      'header',
                      'bold', 'italic', 'underline', 'strike',
                      'list', 'bullet',
                      'color', 'background',
                      'link', 'image',
                      'align'
                    ]}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Use the toolbar above to format your content. The content will be sent as HTML.
                </p>
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
                disabled={sending || !newsletterData.subject || !newsletterData.content || activeSubscribersCount === 0}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : `Send to ${activeSubscribersCount} active subscriber${activeSubscribersCount !== 1 ? 's' : ''}`}
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
