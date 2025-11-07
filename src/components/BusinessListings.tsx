'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCategoryImageUrl } from '@/lib/category-image-mapping'

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
  photos?: string[] // Added photos property
  priority_tier?: number // Business subscription tier (1=Free, 2=Basic, 3=Featured)
}

interface BusinessListingsProps {
  city: string
  state: string
  category?: string
  limit?: number
}

// Helper function to get local thumbnail URL
function getLocalThumbnailUrl(businessId: string) {
  // Clean the business ID to match our filename format
  const cleanId = businessId.replace(/[<>:"/\\|?*]/g, '_');
  return `/images/thumbnails/${cleanId}.jpg`;
}

// Helper function to get category fallback image URL
function getCategoryFallbackUrl(primaryCategory: string) {
  return getCategoryImageUrl(primaryCategory);
}

export default function BusinessListings({ city, state, category, limit = 6 }: BusinessListingsProps) {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true)
        let url = `/api/google-data/retrieve?city=${city}&state=${state}`
        if (category) {
          url += `&category=${category}`
        }
        
        const response = await fetch(url)
        const data = await response.json()
        
        if (data.success) {
          // API already sorts by priority tier, then rating - just filter and limit
          const filteredBusinesses = data.businesses
            .filter((b: Business) => b.rating && b.rating > 0)
            .slice(0, limit)
          
          setBusinesses(filteredBusinesses)
        } else {
          setError('Failed to load businesses')
        }
      } catch (err) {
        setError('Error loading businesses')
        console.error('Error fetching businesses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()
  }, [city, state, category, limit])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="card overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-300"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Unable to load business listings at this time.</p>
      </div>
    )
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No businesses found in this category.</p>
      </div>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food-dining': return '🍽️'
      case 'beach': return '🏖️'
      case 'marina': return '⚓'
      case 'shopping_mall': return '🛍️'
      case 'outlet_mall': return '🏪'
      case 'car_rental': return '🚗'
      case 'tour_agency': return '🎫'
      case 'historic_landmark': return '🏛️'
      case 'liquor_store': return '🍷'
      case 'nightlife-entertainment': return '🍺'
      case 'beaches-outdoors': return '🏖️'
      case 'park_recreation': return '🌳'
      case 'spa_fitness': return '🧘'
      case 'entertainment': return '🎭'
      case 'music_venue': return '🎵'
      case 'winery_brewery': return '🍷'
      case 'art_gallery': return '🎨'
      case 'golf_course': return '⛳'
      case 'scuba_diving': return '🤿'
      case 'surf_shop': return '🏄‍♂️'
      case 'boat_tour': return '🚤'
      case 'coffee_shop': return '☕'
      case 'ice_cream': return '🍦'
      case 'souvenir_shop': return '🛍️'
      case 'farmers_market': return '🥬'
      case 'professional_services': return '💼'
      case 'nightclub': return '💃'
      case 'shopping': return '🛍️'
      default: return '🏢'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'food-dining': return 'Food & Dining'
      case 'beach': return 'Beach'
      case 'marina': return 'Marina'
      case 'shopping_mall': return 'Shopping Center'
      case 'outlet_mall': return 'Outlet Mall'
      case 'car_rental': return 'Car Rental'
      case 'tour_agency': return 'Tour Agency'
      case 'historic_landmark': return 'Historic Site'
      case 'liquor_store': return 'Liquor Store'
      case 'nightlife-entertainment': return 'Nightlife & Entertainment'
      case 'beaches-outdoors': return 'Beaches & Outdoors'
      case 'park_recreation': return 'Parks & Recreation'
      case 'spa_fitness': return 'Spas & Fitness'
      case 'entertainment': return 'Entertainment'
      case 'music_venue': return 'Music Venue'
      case 'winery_brewery': return 'Wineries & Breweries'
      case 'art_gallery': return 'Art Gallery'
      case 'golf_course': return 'Golf Course'
      case 'scuba_diving': return 'Scuba Diving'
      case 'surf_shop': return 'Surf Shop'
      case 'boat_tour': return 'Boat Tour'
      case 'coffee_shop': return 'Coffee Shop'
      case 'ice_cream': return 'Ice Cream'
      case 'souvenir_shop': return 'Souvenir Shop'
      case 'farmers_market': return 'Farmers Market'
      case 'professional_services': return 'Professional Services'
      case 'nightclub': return 'Nightclub'
      case 'shopping': return 'Shopping'
      default: return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }

  // Helper function to get display categories for a business
  const getDisplayCategories = (business: Business) => {
    if (business.categories && business.categories.length > 0) {
      // Prioritize primary_category first, then other categories
      const primaryCategory = business.primary_category || business.categories[0];
      const otherCategories = business.categories.filter(cat => cat !== primaryCategory);
      return [primaryCategory, ...otherCategories];
    }
    return [business.primary_category || business.category];
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {businesses.map((business, index) => {
        const displayCategories = getDisplayCategories(business);
        const primaryCategory = business.primary_category || business.category;
        
        return (
          <article key={business.id} className="business-listing-card">
            <div className="w-full h-48 relative">
              <Image
                src={getLocalThumbnailUrl(business.id)} 
                alt={`${business.name} - ${primaryCategory}`}
                width={400}
                height={300}
                className="w-full h-48 object-cover rounded-t-lg"
                priority={index < 3} // Prioritize first 3 images
                loading={index < 3 ? "eager" : "lazy"}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
              <div className={`w-full h-full ${business.photos && business.photos.length > 0 ? 'hidden' : 'flex'} items-center justify-center relative overflow-hidden`} style={{ display: 'none' }}>
                 {/* Background pattern */}
                 <div className="absolute inset-0 opacity-10">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50"></div>
                   <div className="absolute top-0 left-0 w-full h-full" style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e0f2fe' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                   }}></div>
                 </div>
                 
                 {/* Category icon with background */}
                 <div className="relative z-10 text-center">
                   <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                     <span className="text-2xl">{getCategoryIcon(primaryCategory)}</span>
                   </div>
                   <div className="text-gray-700 font-semibold text-sm">{getCategoryName(primaryCategory)}</div>
                   <div className="text-gray-500 text-xs mt-1">Photo coming soon</div>
                 </div>
                 
                 {/* Decorative elements */}
                 <div className="absolute top-2 right-2 w-3 h-3 bg-blue-200 rounded-full opacity-60"></div>
                 <div className="absolute bottom-3 left-3 w-2 h-2 bg-cyan-200 rounded-full opacity-60"></div>
               </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
                  {/* Mobile: Show only primary category + more indicator */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium px-2 py-1 rounded-full text-blue-600 bg-blue-50 whitespace-nowrap">
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
                        className="text-xs font-medium px-2 py-1 rounded-full text-gray-600 bg-gray-50 whitespace-nowrap"
                      >
                        {getCategoryName(cat)}
                      </span>
                    ))}
                  </div>
                </div>
                {business.rating && (
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-gray-600 text-sm">{business.rating}</span>
                    {business.reviews_count && (
                      <span className="text-gray-500 text-xs ml-1">({business.reviews_count})</span>
                    )}
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{business.name}</h3>
              
              {business.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{business.description}</p>
              )}
              
              <div className="business-listing-address">
                {(() => {
                  // Remove "USA" from the end of the address
                  let formattedAddress = business.address;
                  if (formattedAddress.endsWith(', USA')) {
                    formattedAddress = formattedAddress.replace(', USA', '');
                  }
                  
                  // Split address into parts for better formatting
                  const addressParts = formattedAddress.split(', ');
                  if (addressParts.length >= 3) {
                    // Format as: Street Address\nCity, State ZIP
                    const streetAddress = addressParts[0];
                    // Filter out spelled-out state names to avoid duplication
                    const cityStateZip = addressParts.slice(1).filter(part => 
                      !part.trim().includes('Florida') && 
                      !part.trim().includes('Alabama') && 
                      !part.trim().includes('Mississippi') && 
                      !part.trim().includes('Louisiana') && 
                      !part.trim().includes('Texas')
                    ).join(', ');
                    return (
                      <div>
                        <div>{streetAddress}</div>
                        <div>{cityStateZip}</div>
                        {business.phone && (
                          <a 
                            href={`tel:${business.phone}`}
                            className="business-listing-phone"
                          >
                            {business.phone}
                          </a>
                        )}
                      </div>
                    );
                  }
                  
                  // Fallback for addresses that don't match expected format
                  return (
                    <div>
                      <div>{formattedAddress}</div>
                      {business.phone && (
                        <a 
                          href={`tel:${business.phone}`}
                          className="mt-1 font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {business.phone}
                        </a>
                      )}
                    </div>
                  );
                })()}
              </div>
              
              <div className="flex items-center gap-2">
                <Link
                  href={`/business/${encodeURIComponent(business.id)}`}
                  className="business-listing-button-primary"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  View Details
                </Link>
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="business-listing-button-secondary business-listing-button-website"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Website
                  </a>
                )}
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call
                  </a>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  )
}
