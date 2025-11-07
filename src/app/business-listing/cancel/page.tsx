export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-600">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Cancelled
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your payment was cancelled. No charges have been made to your account.
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Need help?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Try again with a different payment method
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Contact us if you're experiencing technical issues
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Check your PayPal account settings
            </li>
          </ul>
        </div>
        
        <div className="text-center space-y-4">
          <a
            href="/business-listing"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </a>
          <div>
            <a
              href="/contact"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
