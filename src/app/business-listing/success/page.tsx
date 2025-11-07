'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackSubscriptionComplete } from '@/lib/analytics'

function SuccessContent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track conversion on page load
    const planType = searchParams.get('plan') as 'basic' | 'featured' || 'basic'
    const amount = planType === 'basic' ? 149 : 399
    const businessName = searchParams.get('business') || 'New Business'
    const transactionId = searchParams.get('tx') || `tx_${Date.now()}`

    // Track the successful subscription completion
    trackSubscriptionComplete(transactionId, planType, amount, businessName)
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-green-600">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your business listing subscription. Your listing will be reviewed and published within 24-48 hours.
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">What happens next?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              We'll review your business information
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Your listing will be published within 24-48 hours
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              You'll receive a confirmation email
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Your subscription will auto-renew annually
            </li>
          </ul>
        </div>
        
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
