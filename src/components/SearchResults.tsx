'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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

import { getCategoryImageUrl } from '@/lib/category-image-mapping';

// Helper function to get Cloudinary thumbnail URL
function getCloudinaryThumbnailUrl(businessId: string) {
  // Get Cloudinary URL with auto-optimization
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dajhqvtxe';
  return `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto/gulf-coast-directory/thumbnails/${businessId}.jpg`;
}

// Helper function to get category fallback image URL
function getCategoryFallbackUrl(primaryCategory: string) {
  return getCategoryImageUrl(primaryCategory);
}

export default function SearchResults({ searchTerm, selectedState, selectedCategory, city }: SearchResultsProps) {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    // Fetch results when search parameters change
    if (searchTerm || selectedState || selectedCategory || city) {
      fetchResults()
    }
  }, [searchTerm, selectedState, selectedCategory, city]) // Re-run when search parameters change

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
        return 'water_sports,boat_tour,fishing_charter,scuba_diving,surf_shop,marina,water-activities'
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

  const fetchResults = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let url = '/api/google-data/retrieve?'
      const params = new URLSearchParams()
      
      if (searchTerm) params.append('search', searchTerm)
      if (selectedState) params.append('state', selectedState)
      if (selectedCategory) {
        // Expand the category to include underlying granular categories
        const expandedCategory = expandCategory(selectedCategory)
        params.append('category', expandedCategory)
      }
      if (city) params.append('city', city)
      
      url += params.toString()
      
      console.log('Fetching search results from:', url)
      console.log('Original category:', selectedCategory)
      console.log('Expanded category:', selectedCategory ? expandCategory(selectedCategory) : 'None')
      
      const response = await fetch(url)
      const data = await response.json()
      
      console.log('Search API response:', data)
      
      if (data.success) {
        setBusinesses(data.businesses)
        setTotalResults(data.businesses.length)
      } else {
        setError(data.message || 'Failed to load search results')
        console.error('Search API error:', data)
      }
    } catch (err) {
      setError('Error loading search results')
      console.error('Error fetching search results:', err)
    } finally {
      setLoading(false)
    }
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
      <div className="text-center py-8">
        <p className="text-gray-600">Unable to load search results at this time.</p>
      </div>
    )
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No businesses found matching your search criteria.</p>
        <p className="text-gray-500 text-sm mt-2">Try adjusting your search terms or filters.</p>
      </div>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food-dining': return '🍽️'
      case 'beaches-outdoors': return '🏖️'
      case 'shopping_mall': return '🛍️'
      case 'entertainment': return '🎭'
      case 'park_recreation': return '🌳'
      case 'historic_landmark': return '🏛️'
      case 'spa_fitness': return '💆‍♀️'
      case 'nightlife-entertainment': return '🌙'
      case 'tour_agency': return '🎫'
      case 'car_rental': return '🚗'
      case 'professional_services': return '🔧'
      case 'golf_course': return '⛳'
      case 'scuba_diving': return '🤿'
      case 'surf_shop': return '🏄‍♂️'
      case 'boat_tour': return '🚤'
      case 'coffee_shop': return '☕'
      case 'ice_cream': return '🍦'
      case 'souvenir_shop': return '🛍️'
      case 'farmers_market': return '🥬'
      case 'art_gallery': return '🎨'
      case 'music_venue': return '🎵'
      case 'winery_brewery': return '🍷'
      case 'liquor_store': return '🍷'
      case 'marina': return '⚓'
      case 'beach': return '🏖️'
      case 'nightclub': return '💃'
      case 'shopping': return '🛍️'
      default: return '🏢'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'food-dining': return 'Food & Dining'
      case 'beaches-outdoors': return 'Beaches & Outdoors'
      case 'shopping_mall': return 'Shopping Mall'
      case 'entertainment': return 'Entertainment'
      case 'park_recreation': return 'Parks & Recreation'
      case 'historic_landmark': return 'Historic Landmark'
      case 'spa_fitness': return 'Spas & Fitness'
      case 'nightlife-entertainment': return 'Nightlife & Entertainment'
      case 'tour_agency': return 'Tour Agency'
      case 'car_rental': return 'Car Rental'
      case 'professional_services': return 'Professional Services'
      case 'golf_course': return 'Golf Course'
      case 'scuba_diving': return 'Scuba Diving'
      case 'surf_shop': return 'Surf Shop'
      case 'boat_tour': return 'Boat Tour'
      case 'coffee_shop': return 'Coffee Shop'
      case 'ice_cream': return 'Ice Cream'
      case 'souvenir_shop': return 'Souvenir Shop'
      case 'farmers_market': return 'Farmers Market'
      case 'art_gallery': return 'Art Gallery'
      case 'music_venue': return 'Music Venue'
      case 'winery_brewery': return 'Wineries & Breweries'
      case 'liquor_store': return 'Liquor Store'
      case 'marina': return 'Marina'
      case 'beach': return 'Beach'
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

  const getPriceLevel = (level?: number) => {
    if (!level) return ''
    return '$'.repeat(level)
  }

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-2xl">
      <div className="flex items-center mb-2">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="flex-1 text-center text-base text-gray-600 font-medium sm:text-sm">
          Found {totalResults} business{totalResults !== 1 ? 'es' : ''} matching your search
        </div>
      </div>
      {businesses.map((business) => {
        const displayCategories = getDisplayCategories(business);
        const primaryCategory = business.primary_category || business.category;
        
        return (
          <article key={business.id} className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all duration-300 group shadow-sm">
            <div className="flex gap-4">
              {/* Category Icon */}
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
            </div>
          </article>
        );
      })}
    </div>
  );
}
