import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import BusinessListings from '../../../components/BusinessListings'
import CategoryCounts from '../../../components/CategoryCounts'
import FeaturedBusinesses from '../../../components/FeaturedBusinesses'
import { statesAndCities } from '../../../data/cities'

// Standard categories for all cities - defined outside component to prevent re-creation
const categories = [
  { name: 'Lodging', slug: 'lodging', description: 'Hotels, resorts, inns, and vacation rentals', icon: '🏨' },
  { name: 'Food & Dining', slug: 'food-dining', description: 'Restaurants, cafes, and dining experiences', icon: '🍽️' },
  { name: 'Beaches & Outdoors', slug: 'beaches-outdoors', description: 'Beach access, parks, and outdoor activities', icon: '🏖️' },
  { name: 'Water Activities', slug: 'water-activities', description: 'Parasailing, boat rentals, fishing, and water adventures', icon: '🚤' },
  { name: 'Shopping & Retail', slug: 'shopping_mall', description: 'Malls, outlets, and retail stores', icon: '🛍️' },
  { name: 'Transportation', slug: 'car_rental', description: 'Car rentals and transportation services', icon: '🚗' },
  { name: 'Tours & Adventures', slug: 'tour_agency', description: 'Guided tours, adventures, and excursions', icon: '🗺️' },
  { name: 'History & Culture', slug: 'historic_landmark', description: 'Museums, historic sites, and cultural attractions', icon: '🏛️' },
  { name: 'Nightlife & Entertainment', slug: 'nightlife-entertainment', description: 'Bars, clubs, theaters, and entertainment venues', icon: '🎭' },
  { name: 'Health & Wellness', slug: 'spa_fitness', description: 'Spas, fitness centers, and wellness services', icon: '🧘' },
  { name: 'Sports & Recreation', slug: 'golf_course', description: 'Golf courses, sports complexes, and recreational activities', icon: '⛳' },
  { name: 'Convenience & Services', slug: 'liquor_store', description: 'Liquor stores, professional services, and conveniences', icon: '🏪' }
]

interface CityPageProps {
  params: Promise<{
    stateSlug: string
    citySlug: string
  }>
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { stateSlug, citySlug } = await params
  
  // Normalize the city slug to lowercase and replace spaces with hyphens for case-insensitive matching
  // Also handle URL-encoded spaces (%20) and other URL encoding
  const normalizedCitySlug = decodeURIComponent(citySlug).toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')
  
  // Find the state and city from the actual data (case-insensitive)
  const state = statesAndCities.find(s => s.slug === stateSlug.toLowerCase())
  if (!state) {
    return {
      title: 'State Not Found',
      description: 'The requested Gulf Coast state could not be found.'
    }
  }
  
  const city = state.cities.find(c => c.slug === normalizedCitySlug)
  if (!city) {
    return {
      title: 'City Not Found',
      description: 'The requested Gulf Coast city could not be found.'
    }
  }

  // All Gulf Coast cities are major water sports destinations for SEO
  const isMajorWaterSportsDestination = true;
  
  // Create optimized descriptions under 160 characters for Google best practices
  const createOptimizedDescription = () => {
    if (!isMajorWaterSportsDestination) {
      const baseDesc = `${city.description} Discover hotels, restaurants, beaches, and attractions in ${city.name}, ${state.name}.`;
      return baseDesc.length <= 160 ? baseDesc : `${city.description} Discover hotels, restaurants, and attractions in ${city.name}, ${state.name}.`;
    }
    
    // Balanced description for water sports destinations
    const shortDesc = `Premier water sports and fishing in ${city.name}, ${state.name}. Book parasailing, jet skis, fishing charters, and boat tours with local experts.`;
    
    // If still too long, use even shorter version
    if (shortDesc.length > 160) {
      return `Top water sports in ${city.name}, ${state.name}. Parasailing, jet skis, fishing charters & boat tours.`;
    }
    
    return shortDesc;
  };

  // Create optimized titles under 60 characters for Google best practices
  const createOptimizedTitle = () => {
    if (!isMajorWaterSportsDestination) {
      return `${city.name}, ${state.name} - Gulf Coast Tourist Destination`;
    }
    
    // Balanced titles for major water sports destinations (not just fishing)
    const waterSportsTitle = `${city.name} Water Sports & Fishing - ${state.name}`;
    
    // If still too long, use shorter version
    if (waterSportsTitle.length > 60) {
      return `${city.name} Water Sports - ${state.name} Gulf Coast`;
    }
    
    return waterSportsTitle;
  };

  return {
    title: createOptimizedTitle(),
    description: createOptimizedDescription(),
    keywords: [
      // Prioritize water sports keywords for major destinations (balanced approach)
      ...(isMajorWaterSportsDestination ? [
        `${city.name} water sports`,
        `${city.name} parasailing`,
        `${city.name} jet ski rental`,
        `${city.name} fishing charters`,
        `${city.name} boat tours`,
        `${city.name} deep sea fishing`,
        `${city.name} ${state.name} water sports`,
        `${city.name} Gulf Coast activities`,
      ] : []),
      `${city.name} ${state.name}`,
      `${city.name} Gulf Coast`,
      `${city.name} beaches`,
      `${city.name} hotels`,
      `${city.name} restaurants`,
      `${city.name} tourism`,
      `${city.name} vacation`,
      `${city.name} water sports`,
      `${city.name} parasailing`,
      `${city.name} surfing`,
      `${city.name} jet ski rental`,
      `${city.name} boat rental`,
      `${city.name} kayaking`,
      `${city.name} paddleboarding`,
      `${city.name} scuba diving`,
      `${city.name} snorkeling`,
      `${city.name} sailing`,
      `${city.name} deep sea fishing`,
      `${city.name} inshore fishing`,
      `${city.name} ${state.name} water sports`,
      `${city.name} ${state.name} parasailing`,
      `${city.name} ${state.name} surfing`,
      `${city.name} ${state.name} jet ski rental`,
      `${city.name} ${state.name} boat rental`,
      `${city.name} ${state.name} fishing`,
      `${city.name} ${state.name} kayaking`,
      `${city.name} ${state.name} paddleboarding`,
      `${city.name} ${state.name} scuba diving`,
      `${city.name} ${state.name} snorkeling`,
      `${city.name} ${state.name} sailing`,
      `${city.name} ${state.name} deep sea fishing`,
      `${city.name} ${state.name} inshore fishing`,
      `${city.name} Gulf Coast water sports`,
      `${city.name} Gulf Coast parasailing`,
      `${city.name} Gulf Coast surfing`,
      `${city.name} Gulf Coast jet ski rental`,
      `${city.name} Gulf Coast boat rental`,
      `${city.name} Gulf Coast fishing`,
      `${city.name} Gulf Coast kayaking`,
      `${city.name} Gulf Coast paddleboarding`,
      `${city.name} Gulf Coast scuba diving`,
      `${city.name} Gulf Coast snorkeling`,
      `${city.name} Gulf Coast sailing`,
      `${city.name} Gulf Coast deep sea fishing`,
      `${city.name} Gulf Coast inshore fishing`,
      `${state.name} Gulf Coast`,
      'Gulf Coast destinations',
      'coastal tourism',
      'beach vacations'
    ],
    openGraph: {
      title: createOptimizedTitle(),
      description: createOptimizedDescription(),
      url: `https://gulfcoastexplorer.com/${state.slug}/${normalizedCitySlug}`,
      siteName: 'Gulf Coast Tourist Directory',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${city.name}, ${state.name} - Beautiful Gulf Coast destination`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: createOptimizedTitle(),
      description: createOptimizedDescription(),
      images: ['/og-image.jpg'],
    },
    alternates: {
      canonical: `/${state.slug}/${normalizedCitySlug}`,
    },
    other: {
      'geo.region': 'US',
      'geo.placename': `${city.name}, ${state.name}`,
      'geo.position': citySlug === 'pensacola' ? '30.4213;-87.2169' : '29.7604;-95.3698',
      'ICBM': citySlug === 'pensacola' ? '30.4213, -87.2169' : '29.7604, -95.3698',
    },
  }
}



export default async function CityPage({ params }: CityPageProps) {
  const { stateSlug, citySlug } = await params

  // Normalize the city slug to lowercase and replace spaces with hyphens for case-insensitive matching
  // Also handle URL-encoded spaces (%20) and other URL encoding
  const normalizedCitySlug = decodeURIComponent(citySlug).toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')

  // Find the state and city from the actual data (case-insensitive)
  const state = statesAndCities.find(s => s.slug === stateSlug.toLowerCase())
  if (!state) {
    notFound()
  }
  
  const city = state.cities.find(c => c.slug === normalizedCitySlug)
  if (!city) {
    notFound()
  }

  // All Gulf Coast cities are major water sports destinations for SEO
  const isMajorWaterSportsDestination = true;

  return (
    <>
      {/* Enhanced Structured Data for City Page with Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `${city.name}, ${state.name} - Gulf Coast Tourist Destination`,
            "description": `${city.description} Discover hotels, restaurants, beaches, and attractions in ${city.name}, ${state.name}.`,
            "url": `https://gulfcoastexplorer.com/${state.slug}/${normalizedCitySlug}`,
            "mainEntity": {
              "@type": isMajorWaterSportsDestination ? "TouristDestination" : "City",
              "name": city.name,
              "description": isMajorWaterSportsDestination 
                ? `${city.description} Premier destination for water sports including parasailing, jet skiing, fishing charters, boat tours, and marine activities.`
                : city.description,
              ...(isMajorWaterSportsDestination && {
                "touristType": ["Fishing Enthusiasts", "Water Sports Enthusiasts", "Family Vacationers"],
                "availableLanguage": "English",
                "amenityFeature": [
                  {
                    "@type": "LocationFeatureSpecification",
                    "name": "Water Sports",
                    "value": true
                  },
                  {
                    "@type": "LocationFeatureSpecification", 
                    "name": "Parasailing",
                    "value": true
                  },
                  {
                    "@type": "LocationFeatureSpecification",
                    "name": "Jet Ski Rental",
                    "value": true
                  },
                  {
                    "@type": "LocationFeatureSpecification",
                    "name": "Fishing Charters",
                    "value": true
                  },
                  {
                    "@type": "LocationFeatureSpecification",
                    "name": "Boat Tours",
                    "value": true
                  }
                ]
              }),
              "address": {
                "@type": "PostalAddress",
                "addressLocality": city.name,
                "addressRegion": state.name,
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": citySlug === 'pensacola' ? "30.4213" : "29.7604",
                "longitude": citySlug === 'pensacola' ? "-87.2169" : "-95.3698"
              },
              "containedInPlace": {
                "@type": "State",
                "name": state.name
              }
            },
            "breadcrumb": {
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
                  "item": "https://gulfcoastexplorer.com/states"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": `${state.name} Gulf Coast`,
                  "item": `https://gulfcoastexplorer.com/states/${state.slug}`
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": city.name,
                  "item": `https://gulfcoastexplorer.com/${state.slug}/${city.slug}`
                }
              ]
            }
          })
        }}
      />

      {/* Local Business Directory for City */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": `${city.name} Gulf Coast Tourism Directory`,
            "description": `Complete directory of ${city.name}, ${state.name} businesses, attractions, and services`,
            "url": `https://gulfcoastexplorer.com/${state.slug}/${city.slug}`,
            "telephone": "+1-800-GULF-COAST",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": city.name,
              "addressRegion": state.name,
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": citySlug === 'pensacola' ? "30.4213" : "29.7604",
              "longitude": citySlug === 'pensacola' ? "-87.2169" : "-95.3698"
            },
            "areaServed": {
              "@type": "City",
              "name": city.name,
              "addressRegion": state.name
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": `${city.name} Gulf Coast Services`,
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Beach Information",
                    "description": "Local beach access and conditions"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Fishing Charters",
                    "description": "Local fishing guides and boat rentals"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Accommodations",
                    "description": "Hotels, resorts, and vacation rentals"
                  }
                }
              ]
            }
          })
        }}
      />
      
      <main className="min-h-screen bg-gray-50">
        {/* Categories Section */}
        <section className="pt-8 pb-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Explore {city.name} by Category
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Find the best places to stay, eat, and play in {city.name}
              </p>
            </div>
            
            <CategoryCounts city={city.name} state={state.name} categories={categories} />
          </div>
        </section>

        {/* Featured Businesses Section */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FeaturedBusinesses 
              city={city.name} 
              state={state.name} 
              limit={6}
            />
          </div>
        </section>

        {/* Popular Listings Preview */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Popular in {city.name}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover some of the most recommended places in {city.name}
              </p>
            </div>
            
            <BusinessListings city={city.name} state={state.name} limit={6} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Explore {city.name}?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Start planning your {city.name} adventure. Find the best places to stay, 
              eat, and play in this beautiful coastal city.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/search?city=${normalizedCitySlug}&state=${stateSlug}`} className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors">
                Search {city.name} Listings
              </Link>
              <Link href={`/states/${state.slug}`} className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors">
                Explore {state.name}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
