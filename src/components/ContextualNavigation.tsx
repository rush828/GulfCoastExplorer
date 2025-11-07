'use client'

import Link from 'next/link'

interface ContextualNavigationProps {
  type: 'search' | 'business' | 'city' | 'state'
  businessName?: string
  cityName?: string
  stateName?: string
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function ContextualNavigation({ 
  type, 
  businessName, 
  cityName, 
  stateName, 
  searchParams 
}: ContextualNavigationProps) {
  
  // Build breadcrumb trail based on context
  const getBreadcrumbs = () => {
    const breadcrumbs: Array<{ label: string; href: string; isActive?: boolean }> = [
      { label: 'Home', href: '/' }
    ]

    if (stateName) {
      breadcrumbs.push({
        label: stateName,
        href: `/states/${stateName.toLowerCase().replace(/\s+/g, '-')}`
      })
    }

    if (cityName) {
      breadcrumbs.push({
        label: cityName,
        href: `/${stateName?.toLowerCase().replace(/\s+/g, '-')}/${cityName.toLowerCase().replace(/\s+/g, '-')}`
      })
    }

    if (businessName) {
      breadcrumbs.push({
        label: businessName,
        href: '#',
        isActive: true
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  // Only show breadcrumbs for business pages (deep hierarchy)
  if (type !== 'business') {
    return null
  }

  return (
    <nav className="hidden lg:block bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40" aria-label="Breadcrumb">
      <div className="container mx-auto px-4 sm:px-6 py-2">
        <div className="max-w-4xl mx-auto">
          <ol className="flex items-center space-x-1 text-sm">
            {breadcrumbs.map((item, index) => (
              <li key={item.href} className="flex items-center">
                {index > 0 && (
                  <svg 
                    className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {item.isActive ? (
                  <span className="text-gray-900 font-medium truncate max-w-[200px]">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 truncate max-w-[200px]"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </nav>
  )
}
