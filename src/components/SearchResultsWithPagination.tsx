'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCategoryImageUrl } from '@/lib/category-image-mapping'
import { api, networkUtils } from '@/lib/api-utils'
import { trackSearch, trackBusinessView } from '@/lib/analytics'
import { getStateAbbreviation, formatPhoneNumber } from '@/lib/format-utils'

interface Business {
  id: string
  name: string
  category: string
  categories?: string[] // Multi-category support
  primary_category?: string // Primary category for backward compatibility
  address: string
  city: string
  state: string
  rating?: number
  reviews_count?: number
  website?: string
  phone?: string
  description?: string
  price_level?: number
  photos?: string[] // Added photos to the interface
  latitude?: number
  longitude?: number
}

interface SearchResultsProps {
  searchTerm?: string
  selectedState?: string
  selectedCategory?: string
  city?: string
}

// Helper function to generate business URL with search parameters
function getBusinessUrl(businessId: string, selectedCategory?: string, city?: string, selectedState?: string) {
  const params = new URLSearchParams()
  if (selectedCategory) params.set('category', selectedCategory)
  if (city) params.set('city', city)
  if (selectedState) params.set('state', selectedState)
  
  const queryString = params.toString()
  return `/business/${encodeURIComponent(businessId)}${queryString ? `?${queryString}` : ''}`
}

export default function SearchResultsWithPagination({ searchTerm, selectedState, selectedCategory, city }: SearchResultsProps) {
  // Helper function to get category name (moved to top to avoid hoisting issues)
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'accommodations': return 'Lodging'
      case 'restaurant': return 'Restaurant'
      case 'lodging': return 'Lodging'
      case 'marina': return 'Marina'
      case 'beach': return 'Beach'
      case 'bar': return 'Bar'
      case 'store': return 'Store'
      case 'tour_agency': return 'Tour Agency'
      case 'fishing-charter': return 'Fishing Charter'
      case 'fishing_charter': return 'Fishing Charter'
      case 'water-activities': return 'Water Activities'
      case 'water_sports': return 'Water Sports'
      case 'water_sport': return 'Water Activities'
      case 'water-sports': return 'Water Activities'
      case 'parks-recreation': return 'Parks & Recreation'
      case 'park_recreation': return 'Parks & Recreation'
      case 'beaches-outdoors': return 'Beaches & Outdoors'
      case 'shopping_mall': return 'Shopping & Retail'
      case 'spa_fitness': return 'Health & Wellness'
      case 'tourist_attraction': return 'Tourist Attraction'
      case 'rv_park': return 'RV Park'
      case '24_hours': return '24 Hours'
      case 'convenience_store': return 'Convenience Store'
      case 'entertainment': return 'Entertainment'
      case 'coffee_shop': return 'Coffee Shop'
      case 'historic_landmark': return 'Historic Landmark'
      case 'liquor_store': return 'Liquor Store'
      case 'car_rental': return 'Car Rental'
      case 'meal_delivery': return 'Meal Delivery'
      case 'clothing_store': return 'Clothing Store'
      case 'campground': return 'Campground'
      case 'boat_tour': return 'Boat Tour'
      case 'scuba_diving': return 'Scuba Diving'
      case 'surf_shop': return 'Surf Shop'
      case 'nightlife-entertainment': return 'Nightlife & Entertainment'
      case 'golf_course': return 'Golf Course'
      case 'winery_brewery': return 'Wineries & Breweries'
      case 'art_gallery': return 'Art Gallery'
      case 'music_venue': return 'Music Venue'
      case 'nightclub': return 'Nightclub'
      case 'professional_services': return 'Professional Services'
      case 'souvenir_shop': return 'Souvenir Shop'
      case 'farmers_market': return 'Farmers Market'
      case 'ice_cream': return 'Ice Cream'
      case 'outlet_mall': return 'Outlet Mall'
      case 'food-dining': return 'Food & Dining'
      default: return category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ')
    }
  }

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryAttempt, setRetryAttempt] = useState(0)
  const [isOffline, setIsOffline] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPrevPage, setHasPrevPage] = useState(false)
  const [resultsPerPage, setResultsPerPage] = useState(20)

  // Helper function to get Cloudinary thumbnail URL
  const getCloudinaryThumbnailUrl = (businessId: string) => {
    // Get Cloudinary URL with auto-optimization
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dajhqvtxe';
    return `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto/gulf-coast-directory/thumbnails/${businessId}.jpg`;
  }

  // Helper function to get category fallback image URL
  const getCategoryFallbackUrl = (primaryCategory: string) => {
    return getCategoryImageUrl(primaryCategory);
  }

  useEffect(() => {
    // Reset to page 1 when search parameters change
    setCurrentPage(1)
    // Fetch results when search parameters change (only if they have actual values)
    if ((searchTerm && searchTerm.trim()) || (selectedState && selectedState.trim()) || (selectedCategory && selectedCategory.trim()) || (city && city.trim())) {
      fetchResults(1)
    }
  }, [searchTerm, selectedState, selectedCategory, city]) // Re-run when search parameters change

  // Generate business schema when businesses are loaded
  useEffect(() => {
    if (businesses && businesses.length > 0) {
      // Clear existing business schemas
      const existingSchemas = document.querySelectorAll('script[data-business-schema]');
      existingSchemas.forEach(schema => schema.remove());

      // Generate schema for each business
      businesses.forEach((business, index) => {
        const businessSchema = {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": business.name,
          "description": business.description || `${business.name} - ${getCategoryName(business.primary_category || business.category)} in ${business.city}, ${business.state}`,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": business.address,
            "addressLocality": business.city,
            "addressRegion": business.state,
            "addressCountry": "US"
          },
          "telephone": business.phone,
          "url": business.website,
          "geo": business.latitude && business.longitude ? {
            "@type": "GeoCoordinates",
            "latitude": business.latitude,
            "longitude": business.longitude
          } : undefined,
          "priceRange": business.price_level ? '$'.repeat(business.price_level) : undefined,
          "aggregateRating": business.rating ? {
            "@type": "AggregateRating",
            "ratingValue": business.rating,
            "reviewCount": business.reviews_count || 0,
            "bestRating": 5,
            "worstRating": 1
          } : undefined,
          "image": business.photos && business.photos.length > 0 ? business.photos[0] : undefined,
          "category": getCategoryName(business.primary_category || business.category)
        };

        // Add schema to page head
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-business-schema', 'true');
        script.textContent = JSON.stringify(businessSchema);
        document.head.appendChild(script);
      });
    }
  }, [businesses]);

  useEffect(() => {
    // Reset to page 1 when results per page changes
    setCurrentPage(1)
    // Fetch results when results per page changes (only if they have actual values)
    if ((searchTerm && searchTerm.trim()) || (selectedState && selectedState.trim()) || (selectedCategory && selectedCategory.trim()) || (city && city.trim())) {
      fetchResults(1)
    }
  }, [resultsPerPage]) // Re-run when results per page changes

  // Function to expand display category slugs to underlying granular categories
  // NOTE: This should match the CategoryCounts component exactly
  const expandCategory = (categorySlug: string) => {
    // If the category already contains commas, it's already expanded (from CategoryCounts links)
    if (categorySlug.includes(',')) {
      return categorySlug;
    }
    
    // Otherwise, expand single category slugs
    switch (categorySlug) {
      case 'food-dining':
        return 'restaurant,coffee_shop,ice_cream,seafood_market,winery_brewery,food-dining'
      case 'beaches-outdoors':
        return 'beach,park_recreation,historic_landmark,tourist_attraction,marina'
      case 'water-activities':
        return 'water-activities,boat_tour,fishing_charter,scuba_diving,surf_shop,marina'
      case 'accommodations':
        return 'lodging,accommodations'
      case 'shopping_mall':
        return 'store,convenience_store,clothing_store,shopping_mall,outlet_mall,souvenir_shop,farmers_market,shopping-retail'
      case 'parks-recreation':
      case 'park_recreation':
        return 'park_recreation,park,campground,rv_park,tourist_attraction'
      case 'nightlife-entertainment':
        return 'bar,music_venue,nightclub,entertainment'
      case 'history-culture':
        return 'historic_landmark,history-culture,museum'
      case 'tours-adventures':
        return 'tour_agency,tours-adventures'
      case 'spa_fitness':
        return 'spa,spa_fitness,wellness,health'
      case 'golf_course':
        return 'golf_course,golf'
      case 'car_rental':
        return 'car_rental,transportation'
      case 'liquor_store':
        return 'liquor_store,winery_brewery'
      default:
        return categorySlug
    }
  }

  const fetchResults = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      // Check network status
      if (!networkUtils.isOnline()) {
        setIsOffline(true)
        setError('No internet connection. Please check your network and try again.')
        setLoading(false)
        return
      }
      
      const params: Record<string, string> = {
        page: page.toString(),
        limit: resultsPerPage.toString()
      }
      
      if (searchTerm) params.search = searchTerm
      if (selectedState) params.state = selectedState
      if (selectedCategory) {
        // Expand the category to include underlying granular categories
        const expandedCategory = expandCategory(selectedCategory)
        params.category = expandedCategory
      }
      if (city) params.city = city
      
      const response = await api.getBusinesses(params)
      
      if (response.success) {
        setBusinesses((response as any).businesses || [])
        setTotalResults((response as any).total || 0)
        setCurrentPage((response as any).page || 1)
        setTotalPages((response as any).totalPages || 0)
        setHasNextPage((response as any).hasNextPage || false)
        setHasPrevPage((response as any).hasPrevPage || false)
        setRetryAttempt(0) // Reset retry count on success
        
        // Track search analytics
        trackSearch({
          query: searchTerm || '',
          category: selectedCategory || '',
          city: city || '',
          state: selectedState || '',
          resultsCount: (response as any).total || 0
        })
      } else {
        setError(response.error || 'Failed to load search results')
        console.error('Search API error:', response)
      }
    } catch (err) {
      setError('Unexpected error loading search results')
      console.error('Error fetching search results:', err)
    } finally {
      setLoading(false)
      setIsOffline(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    fetchResults(newPage)
    // Scroll to search results section
    const resultsElement = document.getElementById('search-results')
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      // Fallback to scrolling to top if element not found
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    
    // Calculate start and end page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    if (hasPrevPage) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 hover:text-gray-700"
        >
          Previous
        </button>
      )
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium border-t border-b ${
            i === currentPage
              ? 'bg-blue-50 border-blue-500 text-blue-600'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          {i}
        </button>
      )
    }

    // Next button
    if (hasNextPage) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 hover:text-gray-700"
        >
          Next
        </button>
      )
    }

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-8">
        <div className="flex flex-1 justify-between sm:hidden">
          {hasPrevPage && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          <div className="flex items-center">
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          {hasNextPage && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          )}
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * resultsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * resultsPerPage, totalResults)}</span> of{' '}
              <span className="font-medium">{totalResults}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              {pages}
            </nav>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
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
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className={`mb-4 ${isOffline ? 'text-orange-600' : 'text-red-600'}`}>
          {isOffline ? (
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          ) : (
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isOffline ? 'Connection Lost' : 'Error Loading Results'}
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => {
            setRetryAttempt(prev => prev + 1)
            fetchResults(currentPage)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again {retryAttempt > 0 && `(${retryAttempt})`}
        </button>
      </div>
    )
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or browse by category.</p>
      </div>
    )
  }

  // Helper function to get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'restaurant': return '🍽️'
      case 'lodging': return '🏨'
      case 'marina': return '⚓'
      case 'beach': return '🏖️'
      case 'bar': return '🍺'
      case 'store': return '🛍️'
      case 'tour_agency': return '🗺️'
      case 'fishing-charter': return '🎣'
      case 'water-sports': return '🏊‍♂️'
      case 'entertainment': return '🎭'
      case 'coffee_shop': return '☕'
      case 'shopping_mall': return '🏬'
      case 'historic_landmark': return '🏛️'
      case '24_hours': return '🕐'
      case 'tourist_attraction': return '🎪'
      case 'park_recreation': return '🌳'
      case 'liquor_store': return '🍷'
      case 'car_rental': return '🚗'
      case 'meal_delivery': return '🍕'
      case 'clothing_store': return '👕'
      case 'campground': return '⛺'
      default: return '🏢'
    }
  }


  // Helper function to get display categories for a business
  const getDisplayCategories = (business: Business) => {
    const allCategories = business.categories || [];
    const primaryCategory = business.primary_category || business.category;
    
    // Create a set to track unique categories, using a normalized version for accommodations/lodging
    const uniqueCategories = new Set<string>();
    
    // Helper function to normalize category (accommodations -> lodging)
    const normalizeCategory = (cat: string) => {
      return cat === 'accommodations' ? 'lodging' : cat;
    };
    
    // Add primary category first
    if (primaryCategory) {
      uniqueCategories.add(normalizeCategory(primaryCategory));
    }
    
    // Add all categories from array, but skip if they're duplicates of primary
    allCategories.forEach(cat => {
      const normalized = normalizeCategory(cat);
      if (normalized !== normalizeCategory(primaryCategory)) {
        uniqueCategories.add(normalized);
      }
    });
    
    return Array.from(uniqueCategories);
  }

  // Don't render anything if no search parameters are provided
  if (!searchTerm && !selectedState && !selectedCategory && !city) {
    return null
  }

  return (
    <div id="search-results" className="space-y-4 bg-gray-50 p-4 rounded-2xl">
      {/* Header with Results Summary and Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 font-medium">
            Found {totalResults} business{totalResults !== 1 ? 'es' : ''}
            {totalPages > 1 && (
              <span> • <span className="font-bold">Page {currentPage} of {totalPages}</span></span>
            )}
            {totalResults >= 10 && (
              <div className="mt-2 text-xs text-gray-500">
                Use filters above to narrow down results
              </div>
            )}
          </div>
        </div>
        
        {/* Results per page selector */}
        <div className="flex items-center space-x-2">
          <label htmlFor="results-per-page" className="text-sm text-gray-600">
            Show:
          </label>
          <select
            id="results-per-page"
            value={resultsPerPage}
            onChange={(e) => setResultsPerPage(parseInt(e.target.value))}
            className="compact-button border border-gray-300 rounded px-1 py-0 text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:px-3 sm:py-1 sm:text-sm sm:rounded-md"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-600">per page</span>
        </div>
      </div>

      {/* Business Listings */}
      <div className="space-y-4">
        {businesses.map((business) => {
          const displayCategories = getDisplayCategories(business);
          const primaryCategory = business.primary_category || business.category;
          
          return (
            <article key={business.id} className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all duration-300 group shadow-sm">
              <div className="flex gap-4">
                {/* Category Icon/Photo */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md">
                    <img 
                      src={getCloudinaryThumbnailUrl(business.id)} 
                      alt={`${business.name}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // First fallback: try category image
                        const target = e.currentTarget as HTMLImageElement;
                        if (!target.src.includes('categories/')) {
                          target.src = getCategoryFallbackUrl(primaryCategory);
                        } else {
                          // Final fallback: show category icon
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }
                      }}
                    />
                    {/* Final fallback category icon (hidden by default) */}
                    <div 
                      className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md"
                      style={{ display: 'none' }}
                    >
                      <div className="text-xl text-white">{getCategoryIcon(primaryCategory)}</div>
                    </div>
                  </div>
                </div>
                
                {/* Business Content */}
                <div className="flex-1 min-w-0">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 transition-colors duration-200">
                        <Link 
                          href={getBusinessUrl(business.id, selectedCategory, city, selectedState)} 
                          className="hover:text-blue-600"
                          onClick={() => trackBusinessView({
                            id: business.id,
                            name: business.name,
                            category: business.primary_category || business.category,
                            city: business.city,
                            state: business.state,
                            rating: business.rating
                          })}
                        >
                          {business.name}
                        </Link>
                      </h3>
                      
                      {/* Category Badges & Rating */}
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <div className="flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
                          {/* Mobile: Show only primary category + more indicator */}
                          <div className="flex items-center gap-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 whitespace-nowrap">
                              {getCategoryName(displayCategories[0])}
                            </span>
                            {displayCategories.length > 1 && (
                              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                                +{displayCategories.length - 1} more
                              </span>
                            )}
                          </div>
                          
                          {/* Desktop: Show all categories */}
                          <div className="hidden sm:flex flex-wrap gap-1">
                            {displayCategories.slice(1).map((cat, index) => (
                              <span 
                                key={index + 1} 
                                className="inline-flex items-center px-2 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 whitespace-nowrap"
                              >
                                {getCategoryName(cat)}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {business.rating && (
                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < Math.floor(business.rating!) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-600 ml-1">
                              {business.rating}
                              {business.reviews_count && (
                                <span className="text-gray-500 ml-1">({business.reviews_count})</span>
                              )}
                            </span>
                          </div>
                        )}
                        
                        {business.price_level && (
                          <div className="text-sm font-medium text-gray-600">
                            {'$'.repeat(business.price_level)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Address and Description */}
                  <div className="text-gray-600 text-xs sm:text-sm mb-3">
                    {(() => {
                      // Get state abbreviation
                      const stateAbbr = getStateAbbreviation(business.state);
                      
                      // Remove "USA" from the end of the address
                      let formattedAddress = business.address;
                      
                      // If address doesn't include city/state, append them with abbreviation
                      const hasCity = formattedAddress.toLowerCase().includes(business.city?.toLowerCase() || '');
                      if (!hasCity && business.city && business.state) {
                        formattedAddress = `${formattedAddress}, ${business.city}, ${stateAbbr}`;
                      }
                      
                      if (formattedAddress.endsWith(', USA')) {
                        formattedAddress = formattedAddress.replace(', USA', '');
                      }
                      
                      // Replace full state names with abbreviations
                      formattedAddress = formattedAddress
                        .replace(/, Florida/gi, `, FL`)
                        .replace(/, Alabama/gi, `, AL`)
                        .replace(/, Mississippi/gi, `, MS`)
                        .replace(/, Louisiana/gi, `, LA`)
                        .replace(/, Texas/gi, `, TX`);
                      
                      // Split address into parts for better formatting
                      const addressParts = formattedAddress.split(', ');
                      if (addressParts.length >= 3) {
                        // Format as: Street Address\nCity, State ZIP
                        const streetAddress = addressParts[0];
                        const cityStateZip = addressParts.slice(1).join(', ');
                        return (
                          <div>
                            <div className="block sm:hidden">{streetAddress}, {cityStateZip}</div>
                            <div className="hidden sm:block">
                              <div>{streetAddress}</div>
                              <div>{cityStateZip}</div>
                            </div>
                            {business.phone && (
                              <div className="mt-1.5">
                                <a 
                                  href={`tel:${business.phone}`}
                                  className="font-medium text-blue-600 hover:text-blue-800 transition-colors text-xs sm:text-sm"
                                >
                                  {formatPhoneNumber(business.phone)}
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      }
                      
                      // Fallback for addresses that don't match expected format
                      return (
                        <div>
                          <div>{formattedAddress}</div>
                          {business.phone && (
                            <div className="mt-1.5">
                              <a 
                                href={`tel:${business.phone}`}
                                className="font-medium text-blue-600 hover:text-blue-800 transition-colors text-xs sm:text-sm"
                              >
                                {formatPhoneNumber(business.phone)}
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  
                  {business.description && (
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-3">{business.description}</p>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={getBusinessUrl(business.id, selectedCategory, city, selectedState)}
                      className="compact-button inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-sm sm:font-semibold sm:rounded-lg"
                    >
                      <svg className="w-2.5 h-2.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      View Details
                    </Link>
                    {business.website && (
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="compact-button inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200 sm:gap-1 sm:px-2 sm:py-1.5 sm:text-sm sm:rounded-lg"
                      >
                        <svg className="w-2.5 h-2.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Website
                      </a>
                    )}
                    {business.phone && (
                      <a
                        href={`tel:${business.phone}`}
                        className="compact-button inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors duration-200 sm:gap-1 sm:px-2 sm:py-1.5 sm:text-sm sm:rounded-lg"
                      >
                        <svg className="w-2.5 h-2.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  )
}
