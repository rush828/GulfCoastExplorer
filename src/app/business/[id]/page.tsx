import { Metadata } from 'next'
import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'
import GoogleMap from '../../../components/GoogleMap'
import ContextualNavigation from '../../../components/ContextualNavigation'

interface Business {
  id: string
  name: string
  category: string
  categories?: string[] // Multi-category support
  categories_array?: string[] // Original categories array from data
  primary_category?: string // Primary category for backward compatibility
  address: string
  city: string
  state: string
  rating?: number
  reviews_count?: number
  website?: string
  phone?: string
  description?: string
  photos?: string[]
  latitude?: number
  longitude?: number
  types?: string[]
}

interface BusinessPageProps {
  params: {
    id: string
  }
}

// Helper function to convert city name to slug
function getCitySlug(cityName: string, stateName: string): string {
  const statesAndCities = require('../../../data/cities').statesAndCities
  const state = statesAndCities.find((s: any) => s.name === stateName)
  if (state) {
    const city = state.cities.find((c: any) => c.name === cityName)
    if (city) {
      return city.slug
    }
  }
  // Fallback: convert to lowercase and replace spaces with hyphens
  return cityName.toLowerCase().replace(/\s+/g, '-')
}

import BusinessImage from '@/components/BusinessImage';
import { getCategoryImageUrl } from '@/lib/category-image-mapping';

// Helper functions for schema generation (server-side only)
function getLocalThumbnailUrl(businessId: string) {
  const cleanId = businessId.replace(/[<>:"/\\|?*]/g, '_');
  return `/images/thumbnails/${cleanId}.jpg`;
}

function getDefaultImageUrl() {
  return '/images/states/florida/hero.jpg';
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  try {
    const business = await getBusiness(params.id)
    
    if (!business) {
      return {
        title: 'Business Not Found | Gulf Coast Tourist Directory',
        description: 'The requested business could not be found.'
      }
    }

    return {
      title: `${business.name} - ${business.category} in ${business.city}, ${business.state} | Gulf Coast Tourist Directory`,
      description: business.description || `Visit ${business.name} in ${business.city}, ${business.state}. ${business.category} with ${business.rating ? `${business.rating} star rating` : 'great service'}.`,
      openGraph: {
        title: `${business.name} - ${business.category}`,
        description: business.description || `Visit ${business.name} in ${business.city}, ${business.state}`,
        type: 'website',
        locale: 'en_US',
        siteName: 'Gulf Coast Tourist Directory',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${business.name} - ${business.category}`,
        description: business.description || `Visit ${business.name} in ${business.city}, ${business.state}`,
      }
    }
  } catch (error) {
    return {
      title: 'Business Details | Gulf Coast Tourist Directory',
      description: 'View detailed information about Gulf Coast businesses and attractions.'
    }
  }
}

async function getBusiness(id: string): Promise<Business | null> {
  try {
    const dataFile = path.join(process.cwd(), 'data', 'businesses-from-excel-corrected-ids.json')
    const content = await fs.readFile(dataFile, 'utf-8')
    const data = JSON.parse(content)
    
    // Decode the ID in case it was URL encoded
    const decodedId = decodeURIComponent(id)
    let business: any = null
    
    // Handle both object and array formats
    if (data.businesses) {
      if (Array.isArray(data.businesses)) {
        business = data.businesses.find((b: any) => b.id === id || b.id === decodedId)
      } else if (typeof data.businesses === 'object') {
        // For object format, the ID is the key
        business = data.businesses[id] || data.businesses[decodedId]
        if (business) {
          business.id = id // Add the ID to the business object
        }
      }
    } else if (Array.isArray(data)) {
      business = data.find((b: any) => b.id === id || b.id === decodedId)
    }
    
    if (!business) return null
    
    return {
      id: business.id,
      name: business.name || business.business_name,
      category: business.primary_category || business.category || 'business',
      categories: business.categories_array || business.categories || [business.primary_category || business.category || 'business'],
      categories_array: business.categories_array || [],
      primary_category: business.primary_category || business.category || 'business',
      address: business.address || business.formatted_address || '',
      city: business.city || '',
      state: business.state || '',
      rating: business.rating || 0,
      reviews_count: business.reviews_count || business.user_ratings_total || 0,
      website: business.website || business.website_url || '',
      phone: business.phone || business.international_phone_number || '',
      description: business.description || '',
      photos: business.photos || business.photos_array || [],
      latitude: business.latitude || business.geometry?.location?.lat,
      longitude: business.longitude || business.geometry?.location?.lng,
      types: business.types || [business.category || 'business']
    }
  } catch (error) {
    console.error('Error loading business:', error)
    return null
  }
}

function getCategoryIcon(category: string) {
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

function getCategoryName(category: string) {
  switch (category) {
    case 'accommodations': return 'Lodging'
    case 'lodging': return 'Lodging'
    case 'food-dining': return 'Food & Dining'
    case 'restaurant': return 'Restaurant'
    case 'bar': return 'Bar'
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
    case 'water-activities': return 'Water Activities'
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
    case 'store': return 'Store'
    case '24_hours': return '24 Hours'
    case 'convenience_store': return 'Convenience Store'
    case 'meal_delivery': return 'Meal Delivery'
    case 'fishing_charter': return 'Fishing Charter'
    case 'tourist_attraction': return 'Tourist Attraction'
    case 'rv_park': return 'RV Park'
    case 'water_sports': return 'Water Sports'
    default: return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }
}

// Helper function to get display categories for a business
function getDisplayCategories(business: Business) {
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

// Helper function to determine the back URL based on search parameters
function getBackUrl(searchParams: { [key: string]: string | string[] | undefined }, business: Business) {
  const category = searchParams.category as string
  const city = searchParams.city as string
  const state = searchParams.state as string
  
  // If we have category and city/state, go back to search results
  if (category && city && state) {
    const searchUrl = new URLSearchParams()
    searchUrl.set('category', category)
    searchUrl.set('city', city)
    searchUrl.set('state', state)
    return `/search?${searchUrl.toString()}`
  }
  
  // If we have just city and state, go back to city page
  if (city && state) {
    const normalizedCity = decodeURIComponent(city).toLowerCase().replace(/\s+/g, '-')
    return `/${state}/${normalizedCity}`
  }
  
  // If we have just state, go to state page
  if (state) {
    return `/states/${state}`
  }
  
  // Default fallback to city page
  return `/${business.state.toLowerCase()}/${getCitySlug(business.city, business.state)}`
}

// Back Button Component
function BackButton({ searchParams, business }: { searchParams: { [key: string]: string | string[] | undefined }, business: Business }) {
  const category = searchParams.category as string
  const city = searchParams.city as string
  const state = searchParams.state as string
  
  // Determine what to show based on context
  let backText = 'Back'
  let backUrl = getBackUrl(searchParams, business)
  
  if (category && city && state) {
    backText = 'Back to Search Results'
  } else if (city && state) {
    backText = `Back to ${business.city}`
  } else if (state) {
    backText = `Back to ${business.state}`
  } else {
    backText = `Back to ${business.city}`
  }
  
  return (
    <Link
      href={backUrl}
      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 text-sm"
    >
      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {backText}
    </Link>
  )
}

export default async function BusinessPage({ params, searchParams }: BusinessPageProps & { searchParams: { [key: string]: string | string[] | undefined } }) {
  const business = await getBusiness(params.id)
  
  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Business Not Found</h1>
            <p className="text-gray-600 mb-8">The requested business could not be found.</p>
            <Link 
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Enhanced Structured Data for Individual Business with Reviews */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": business.name,
            "description": business.description || `${business.category} in ${business.city}, ${business.state}`,
            "url": `https://gulfcoastexplorer.com/business/${business.id}`,
            "telephone": business.phone || undefined,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": business.address,
              "addressLocality": business.city,
              "addressRegion": business.state,
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": business.latitude || "29.7604",
              "longitude": business.longitude || "-95.3698"
            },
            "openingHours": undefined,
            "priceRange": undefined,
            "image": business.photos && business.photos.length > 0 ? getLocalThumbnailUrl(business.id) : getDefaultImageUrl(),
            "sameAs": business.website ? [business.website] : undefined,
            "aggregateRating": business.rating ? {
              "@type": "AggregateRating",
              "ratingValue": business.rating,
              "reviewCount": business.reviews_count || 1,
              "bestRating": 5,
              "worstRating": 1
            } : undefined,
            "review": business.rating ? [{
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": "Gulf Coast Tourist Directory"
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": business.rating,
                "bestRating": 5,
                "worstRating": 1
              },
              "reviewBody": `Rated ${business.rating} stars based on verified reviews and local expertise. ${business.category} in ${business.city}, ${business.state}.`
            }] : undefined,
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": `${business.name} Services`,
              "itemListElement": [{
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": business.category,
                  "description": business.description || `Professional ${business.category} services in ${business.city}, ${business.state}`
                }
              }]
            }
          })
        }}
      />

      {/* Breadcrumb Schema for Business Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://gulfcoastexplorer.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "States",
                "item": "https://gulfcoastdirectory.com/states"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": `${business.state} Gulf Coast`,
                "item": `https://gulfcoastexplorer.com/states/${business.state.toLowerCase().replace(/\s+/g, '-')}`
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": business.city,
                "item": `https://gulfcoastexplorer.com/${business.state.toLowerCase().replace(/\s+/g, '-')}/${business.city.toLowerCase().replace(/\s+/g, '-')}`
              },
              {
                "@type": "ListItem",
                "position": 5,
                "name": business.name,
                "item": `https://gulfcoastexplorer.com/business/${business.id}`
              }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Contextual Navigation - Breadcrumbs for business pages */}
        <ContextualNavigation
          type="business"
          businessName={business.name}
          cityName={business.city}
          stateName={business.state}
          searchParams={searchParams}
        />

        {/* Back Button - Small and unobtrusive */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="container mx-auto px-4 sm:px-6 py-1">
            <div className="max-w-4xl mx-auto">
              <BackButton searchParams={searchParams} business={business} />
            </div>
          </div>
        </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden mb-4 sm:mb-8 border border-gray-100">
            <div className="h-40 sm:h-48 md:h-64 relative">
              <BusinessImage
                businessId={business.id}
                businessName={business.name}
                businessCategory={business.primary_category || business.category}
                hasPhotos={!!(business.photos && business.photos.length > 0)}
                className="w-full h-full object-cover"
              />
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <div className="flex flex-wrap gap-2">
                  {getDisplayCategories(business).map((cat, index) => (
                    <span 
                      key={index} 
                      className={`bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg border border-gray-100 ${
                        index === 0 
                          ? 'text-blue-600' 
                          : 'text-gray-600'
                      }`}
                    >
                      {getCategoryIcon(cat)} {getCategoryName(cat)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-[1.5rem] font-bold text-gray-900 mb-2">{business.name}</h1>
                  
                  <div className="text-gray-600">
                    <p className="text-sm font-medium">{business.address.split(',')[0]}</p>
                    <p className="text-sm font-medium">{business.address.split(',').slice(1).filter(part => 
                      !part.trim().includes('USA')
                    ).join(',').trim()}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-start gap-2 sm:gap-3">
                  {business.rating && (
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <span className="text-yellow-500 text-lg sm:text-xl mr-1">★</span>
                        <span className="text-lg sm:text-2xl font-bold text-gray-900">{business.rating}</span>
                      </div>
                      {business.reviews_count && (
                        <span className="text-gray-600 text-xs font-medium">({business.reviews_count} reviews)</span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-row gap-2 sm:gap-3">
                    {business.phone && (
                      <a 
                        href={`tel:${business.phone}`}
                        className="compact-button compact-button-desktop group relative inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium text-xs sm:text-sm rounded-md sm:rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all duration-200 ease-out border-0 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span className="relative z-10">Call Now</span>
                      </a>
                    )}
                    {business.website && (
                      <a 
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="compact-button group relative inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 bg-white text-gray-700 font-medium text-xs sm:text-sm border border-gray-200 rounded-md sm:rounded-lg shadow-md hover:shadow-lg hover:border-gray-300 hover:bg-gray-50 transform hover:-translate-y-0.5 transition-all duration-200 ease-out overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 105.656 5.656l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 5.656l1.5 1.5a1 1 0 101.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3a2 2 0 012.828 0z" clipRule="evenodd" />
                        </svg>
                        <span className="relative z-10">Visit Website</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Details - Updated spacing */}
          <div className={`grid grid-cols-1 gap-4 sm:gap-0 mb-4 sm:mb-8 ${business.description ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
            {/* Main Content */}
            <div className={`space-y-6 ${business.description ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
              {business.description && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 h-full border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                    <div className="w-1.5 h-5 sm:h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                    About
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{business.description}</p>
                </div>
              )}
            </div>
            
            {/* Contact Information - Full width when no description */}
            <div className={`${!business.description ? 'lg:col-span-1' : ''}`}>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-4 sm:h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                  Contact Information
                </h3>
                <div className={`${!business.description ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4' : 'space-y-2 sm:space-y-3'}`}>
                  <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors duration-200 ${!business.description ? 'p-2 sm:p-3' : 'p-2 sm:p-2.5'}`}>
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <div className={`bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 ${!business.description ? 'w-6 h-6 sm:w-8 sm:h-8' : 'w-5 h-5 sm:w-6 sm:h-6'}`}>
                        <svg className={`text-blue-600 ${!business.description ? 'w-3 h-3 sm:w-4 sm:h-4' : 'w-2.5 h-2.5 sm:w-3 sm:h-3'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-gray-700 font-medium truncate text-xs sm:text-sm`}>{business.address.split(',')[0]}</p>
                        <p className={`text-gray-700 truncate text-xs sm:text-sm`}>{business.address.split(',').slice(1).filter(part => 
                          !part.trim().includes('USA')
                        ).join(',').trim()}</p>
                      </div>
                    </div>
                  </div>
                  
                  {business.phone && (
                    <a 
                      href={`tel:${business.phone}`}
                      className={`bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:border-green-300 transition-colors duration-200 block ${!business.description ? 'p-2.5 sm:p-3' : 'p-2.5'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 ${!business.description ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-6 h-6'}`}>
                          <svg className={`text-green-600 ${!business.description ? 'w-3.5 h-3.5 sm:w-4 sm:h-4' : 'w-3 h-3'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-blue-600 font-semibold truncate hover:text-blue-800 transition-colors ${!business.description ? 'text-sm' : 'text-xs'}`}>
                            {business.phone}
                          </div>
                          <div className={`text-gray-500 ${!business.description ? 'text-xs' : 'text-xs'}`}>Tap to call</div>
                        </div>
                      </div>
                    </a>
                  )}
                  
                  {business.website && (
                    <a 
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors duration-200 block ${!business.description ? 'p-2.5 sm:p-3' : 'p-2.5'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 ${!business.description ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-6 h-6'}`}>
                          <svg className={`text-purple-600 ${!business.description ? 'w-3.5 h-3.5 sm:w-4 sm:h-4' : 'w-3 h-3'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 105.656 5.656l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 5.656l1.5 1.5a1 1 0 101.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3a2 2 0 012.828 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-blue-600 font-semibold truncate hover:text-blue-800 transition-colors ${!business.description ? 'text-sm' : 'text-xs'}`}>
                            Visit Website
                          </div>
                          <div className={`text-gray-500 ${!business.description ? 'text-xs' : 'text-xs'}`}>Opens in new tab</div>
                        </div>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Map Integration - Full Width */}
          {business.latitude && business.longitude && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
              {/* Development Mode: Disable Google Maps to avoid API calls */}
              {process.env.NODE_ENV === 'production' ? (
                <div className="mb-4">
                  <GoogleMap 
                    latitude={business.latitude} 
                    longitude={business.longitude} 
                    address={business.address} 
                    businessName={business.name}
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
                  />
                </div>
              ) : (
                <div className="w-full h-96 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center mb-4">
                  <div className="text-center p-4">
                    <div className="text-blue-500 text-6xl mb-4">🗺️</div>
                    <p className="text-gray-700 font-medium mb-2">Map Preview (Development Mode)</p>
                    <p className="text-gray-500 text-sm mb-4">
                      Google Maps disabled in development to prevent API charges
                    </p>
                    <div className="bg-white rounded-lg p-3 text-left">
                      <p className="text-sm text-gray-700">
                        <strong>{business.name}</strong><br/>
                        {business.address}<br/>
                        📍 {business.latitude}, {business.longitude}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-center">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100"
                >
                  🗺️ Open in Google Maps
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
