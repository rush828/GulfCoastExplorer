'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'

interface Subscription {
  id: string
  paypalSubscriptionId: string
  businessId: string
  businessName: string
  email: string
  status: 'ACTIVE' | 'CANCELED' | 'EXPIRED' | 'SUSPENDED'
  plan: 'BASIC' | 'FEATURED'
  amount: number
  startDate: string
  endDate: string
  nextBillingDate: string
  lastPaymentDate: string | null
  canceledDate: string | null
  autoRenew: boolean
  createdAt: string
  business: {
    id: string
    name: string
    city: string
    state: string
    phone: string | null
    website: string | null
    status: string
  }
}

export default function SubscriptionsAdmin() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'canceled' | 'expired' | 'suspended'>('all')

  useEffect(() => {
    loadSubscriptions()
    loadStats()
  }, [filter])

  const loadSubscriptions = async () => {
    try {
      setLoading(true)
      // Always fetch all subscriptions, then filter client-side for better UX
      const response = await fetch('/api/admin/subscriptions?action=all', {
        credentials: 'include'
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to login if unauthorized
          window.location.href = '/admin/login'
          return
        }
        throw new Error(`Failed to load subscriptions: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        let subs = data.subscriptions || []
        
        // Apply filtering based on selected filter
        if (filter === 'active') {
          subs = subs.filter((sub: Subscription) => sub.status === 'ACTIVE')
        } else if (filter === 'canceled') {
          subs = subs.filter((sub: Subscription) => sub.status === 'CANCELED')
        } else if (filter === 'expired') {
          subs = subs.filter((sub: Subscription) => sub.status === 'EXPIRED')
        } else if (filter === 'suspended') {
          subs = subs.filter((sub: Subscription) => sub.status === 'SUSPENDED')
        }
        // 'all' shows everything, no filtering needed
        
        setSubscriptions(subs)
        setError(null)
      } else {
        const errorMsg = data.error || 'Failed to load subscriptions'
        console.error('API returned error:', errorMsg)
        setError(errorMsg)
        setSubscriptions([])
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load subscriptions'
      console.error('Failed to load subscriptions:', error)
      setError(errorMsg)
      setSubscriptions([])
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/subscriptions?action=stats', {
        credentials: 'include'
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/admin/login'
          return
        }
        throw new Error(`Failed to load stats: ${response.statusText}`)
      }
      
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      } else {
        console.error('API returned error:', data.error)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      CANCELED: 'bg-gray-100 text-gray-800',
      EXPIRED: 'bg-red-100 text-red-800',
      SUSPENDED: 'bg-yellow-100 text-yellow-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    )
  }

  const getPlanBadge = (plan: string) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        plan === 'FEATURED' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {plan}
      </span>
    )
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading subscriptions...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscriptions</h1>
            <p className="text-gray-600">Manage business listing subscriptions and payments</p>
          </div>
          <button
            onClick={() => {
              setLoading(true)
              loadSubscriptions()
              loadStats()
            }}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-600">Total Subscriptions</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">{stats.totalSubscriptions}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-600">Active</div>
              <div className="text-3xl font-bold text-green-600 mt-2">{stats.activeSubscriptions}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-600">Monthly Revenue</div>
              <div className="text-3xl font-bold text-blue-600 mt-2">{formatCurrency(stats.monthlyRevenue || 0)}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-600">Upcoming Renewals</div>
              <div className="text-3xl font-bold text-orange-600 mt-2">{stats.upcomingRenewals || 0}</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('canceled')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'canceled' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Canceled
            </button>
            <button
              onClick={() => setFilter('expired')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'expired' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Expired
            </button>
            <button
              onClick={() => setFilter('suspended')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'suspended' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Suspended
            </button>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscription ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Billing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Payment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      {loading ? 'Loading subscriptions...' : `No ${filter === 'all' ? '' : filter} subscriptions found`}
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((subscription) => (
                    <tr key={subscription.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {subscription.businessName}
                            {subscription.business && (
                              <Link 
                                href={`/business/${subscription.business.id}`}
                                className="ml-2 text-blue-600 hover:text-blue-800 text-xs"
                                target="_blank"
                              >
                                (View)
                              </Link>
                            )}
                          </div>
                          {subscription.business ? (
                            <div className="text-sm text-gray-500">
                              {subscription.business.city}, {subscription.business.state}
                            </div>
                          ) : (
                            <div className="text-sm text-red-500 italic">Business not found</div>
                          )}
                          <div className="text-xs text-gray-400">{subscription.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPlanBadge(subscription.plan)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-500 font-mono">
                          {subscription.paypalSubscriptionId.substring(0, 20)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(subscription.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(subscription.amount)}/year
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(subscription.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(subscription.nextBillingDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(subscription.lastPaymentDate)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Showing {subscriptions.length} subscription{subscriptions.length !== 1 ? 's' : ''}
        </div>
      </div>
    </AdminLayout>
  )
}

