import React from 'react'

// Memoized business card component
export const BusinessCard = React.memo(function BusinessCard({ 
  business, 
  onBusinessClick 
}: { 
  business: any
  onBusinessClick?: (business: any) => void 
}) {
  return (
    <div 
      className="card cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onBusinessClick?.(business)}
    >
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{business.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{business.address}</p>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-medium">{business.primary_category}</span>
          {business.rating && (
            <span className="text-yellow-500">
              ⭐ {business.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
})

// Memoized pagination component
export const PaginationControls = React.memo(function PaginationControls({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange
}: {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  onPageChange: (page: number) => void
}) {
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
      >
        Previous
      </button>

      {getPageNumbers().map(pageNum => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`px-3 py-2 text-sm rounded-md ${
            pageNum === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {pageNum}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
      >
        Next
      </button>
    </div>
  )
})

// Memoized loading skeleton
export const LoadingSkeleton = React.memo(function LoadingSkeleton({ 
  count = 4,
  className = "card animate-pulse"
}: { 
  count?: number
  className?: string 
}) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={className}>
          <div className="flex items-start space-x-4">
            <div className="w-24 h-24 bg-gray-300 rounded-lg"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
})

// Memoized error display
export const ErrorDisplay = React.memo(function ErrorDisplay({
  message,
  onRetry,
  retryCount = 0
}: {
  message: string
  onRetry?: () => void
  retryCount?: number
}) {
  return (
    <div className="text-center py-12">
      <div className="text-red-600 mb-4">
        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Results</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again {retryCount > 0 && `(${retryCount})`}
        </button>
      )}
    </div>
  )
})

// Memoized empty state
export const EmptyState = React.memo(function EmptyState({
  title = "No Results Found",
  description = "Try adjusting your search criteria or browse by category.",
  icon = "🔍"
}: {
  title?: string
  description?: string
  icon?: string
}) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
})

