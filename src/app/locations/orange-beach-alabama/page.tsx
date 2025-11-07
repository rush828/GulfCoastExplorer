import { Metadata } from 'next'
import Link from 'next/link'
import { advancedSchemaTemplates } from '@/lib/advanced-seo'

export const metadata: Metadata = {
  title: 'Orange Beach Alabama Directory - Best Restaurants, Hotels & Activities | 2024 Guide',
  description: 'Complete Orange Beach Alabama business directory with 75+ verified local businesses. Find the best restaurants, beachfront hotels, fishing charters, and water sports activities in Orange Beach.',
  keywords: [
    'Orange Beach Alabama directory',
    'Orange Beach restaurants',
    'Orange Beach hotels',
    'Orange Beach fishing charters',
    'Orange Beach water sports',
    'Orange Beach attractions',
    'Orange Beach vacation rentals',
    'Orange Beach business directory',
    'Orange Beach Alabama guide',
    'Orange Beach dining',
    'Orange Beach accommodations',
    'Orange Beach activities',
    'Orange Beach deep sea fishing',
    'Orange Beach dolphin tours',
    'Orange Beach parasailing',
    'things to do Orange Beach',
    'best restaurants Orange Beach',
    'Orange Beach Alabama tourism',
    'Orange Beach vacation guide',
    'Orange Beach Alabama businesses'
  ],
  openGraph: {
    title: 'Orange Beach Alabama Directory - Best Local Businesses & Activities',
    description: 'Complete Orange Beach Alabama business directory with 75+ verified local businesses. Find restaurants, hotels, fishing charters, and water sports.',
    type: 'website',
    url: 'https://gulfcoastexplorer.com/locations/orange-beach-alabama',
    images: [
      {
        url: '/images/locations/orange-beach-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Orange Beach Alabama - Beautiful white sand beaches and emerald waters'
      }
    ]
  },
  other: {
    'geo.region': 'US-AL',
    'geo.placename': 'Orange Beach, Alabama',
    'geo.position': '30.2943;-87.5711',
    'ICBM': '30.2943, -87.5711',
  }
}

const orangeBeachBusinesses = {
  restaurants: [
    { name: 'The Wharf', category: 'Seafood Restaurant', specialty: 'Fresh Gulf seafood and steaks' },
    { name: 'Cobalt The Restaurant', category: 'Fine Dining', specialty: 'Upscale coastal cuisine' },
    { name: 'Fisher\'s at Orange Beach Marina', category: 'Seafood', specialty: 'Dockside dining and fresh catches' },
    { name: 'The Gulf', category: 'Casual Dining', specialty: 'Southern coastal fare' },
    { name: 'Voyagers', category: 'Seafood', specialty: 'Waterfront dining with marina views' }
  ],
  accommodations: [
    { name: 'The Lodge at Gulf State Park', category: 'Resort', specialty: 'Luxury beachfront resort' },
    { name: 'Hampton Inn & Suites Orange Beach', category: 'Hotel', specialty: 'Family-friendly beachfront hotel' },
    { name: 'Phoenix All Suites Hotel', category: 'All-Suites', specialty: 'Beachfront suites with kitchens' },
    { name: 'Turquoise Place', category: 'Luxury Condos', specialty: 'Ultra-luxury beachfront condominiums' },
    { name: 'Perdido Beach Resort', category: 'Resort', specialty: 'Full-service beachfront resort' }
  ],
  activities: [
    { name: 'Adventure Sailing', category: 'Sailing Tours', specialty: 'Sunset sailing and dolphin cruises' },
    { name: 'Orange Beach Fishing Charters', category: 'Deep Sea Fishing', specialty: 'Red snapper and grouper fishing' },
    { name: 'Coastal Segway Adventures', category: 'Tours', specialty: 'Guided Segway tours of Gulf State Park' },
    { name: 'SkyCoaster Orange Beach', category: 'Adventure', specialty: 'Extreme zipline and bungee jumping' },
    { name: 'Parafly Parasail', category: 'Water Sports', specialty: 'Parasailing over Gulf waters' }
  ]
}

export default function OrangeBeachPage() {
  return (
    <>
      {/* Enhanced Local Business Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            "name": "Orange Beach, Alabama",
            "description": "Premier Gulf Coast destination known for world-class fishing, beautiful white sand beaches, and luxury resorts",
            "url": "https://gulfcoastexplorer.com/locations/orange-beach-alabama",
            "image": "/images/locations/orange-beach-hero.jpg",
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "30.2943",
              "longitude": "-87.5711"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Orange Beach",
              "addressRegion": "AL",
              "addressCountry": "US"
            },
            "touristType": [
              "Families",
              "Couples", 
              "Fishing Enthusiasts",
              "Water Sports Lovers",
              "Luxury Travelers"
            ],
            "availableLanguage": "English",
            "hasMap": "https://maps.google.com/?q=Orange+Beach+Alabama",
            "maximumAttendeeCapacity": 50000,
            "isAccessibleForFree": true
          })
        }}
      />

      {/* ItemList Schema for Businesses */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Orange Beach Alabama Businesses",
            "description": "Complete directory of verified businesses in Orange Beach, Alabama",
            "numberOfItems": 75,
            "itemListElement": [
              ...orangeBeachBusinesses.restaurants.map((business, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Restaurant",
                  "name": business.name,
                  "description": business.specialty,
                  "servesCuisine": business.category,
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Orange Beach",
                    "addressRegion": "AL"
                  }
                }
              })),
              ...orangeBeachBusinesses.accommodations.map((business, index) => ({
                "@type": "ListItem", 
                "position": index + 6,
                "item": {
                  "@type": "LodgingBusiness",
                  "name": business.name,
                  "description": business.specialty,
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Orange Beach",
                    "addressRegion": "AL"
                  }
                }
              }))
            ]
          })
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(advancedSchemaTemplates.breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Locations", url: "/locations" },
            { name: "Alabama", url: "/locations?state=alabama" },
            { name: "Orange Beach", url: "/locations/orange-beach-alabama" }
          ]))
        }}
      />

      <div className="min-h-screen bg-gray-50">
        
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Orange Beach, Alabama
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                Premier Gulf Coast destination with world-class fishing, pristine beaches, 
                and luxury resorts. Discover 75+ verified local businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/search?city=Orange Beach&state=Alabama"
                  className="inline-flex items-center justify-center px-8 py-4 border border-white text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
                >
                  Browse All Businesses
                </Link>
                <Link
                  href="/search?city=Orange Beach&state=Alabama&category=restaurant"
                  className="inline-flex items-center justify-center px-8 py-4 border border-white text-lg font-medium rounded-md text-white hover:bg-blue-700 transition-colors"
                >
                  Find Restaurants
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">75+</div>
                <div className="text-gray-600">Verified Businesses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">25+</div>
                <div className="text-gray-600">Restaurants & Dining</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">15+</div>
                <div className="text-gray-600">Hotels & Resorts</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">20+</div>
                <div className="text-gray-600">Activities & Charters</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Business Categories */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            
            {/* Restaurants */}
            <section className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Top Orange Beach Restaurants</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                {orangeBeachBusinesses.restaurants.map((restaurant, index) => (
                  <div key={index} className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                    <p className="text-gray-600 text-sm">{restaurant.specialty}</p>
                    <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mt-1">
                      {restaurant.category}
                    </span>
                  </div>
                ))}
              </div>
              
              <Link
                href="/search?city=Orange Beach&state=Alabama&category=restaurant"
                className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium"
              >
                View All Orange Beach Restaurants
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </section>

            {/* Accommodations */}
            <section className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Orange Beach Hotels & Resorts</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                {orangeBeachBusinesses.accommodations.map((hotel, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900">{hotel.name}</h3>
                    <p className="text-gray-600 text-sm">{hotel.specialty}</p>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                      {hotel.category}
                    </span>
                  </div>
                ))}
              </div>
              
              <Link
                href="/search?city=Orange Beach&state=Alabama&category=lodging"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Orange Beach Hotels
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </section>

            {/* Activities */}
            <section className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Orange Beach Activities</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                {orangeBeachBusinesses.activities.map((activity, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-900">{activity.name}</h3>
                    <p className="text-gray-600 text-sm">{activity.specialty}</p>
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                      {activity.category}
                    </span>
                  </div>
                ))}
              </div>
              
              <Link
                href="/search?city=Orange Beach&state=Alabama&category=water-activities"
                className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
              >
                View All Orange Beach Activities
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </section>

          </div>

          {/* Orange Beach Travel Guide */}
          <section className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Complete Orange Beach Travel Guide</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Visit Orange Beach?</h3>
                <div className="prose text-gray-600">
                  <p className="mb-4">
                    Orange Beach, Alabama is renowned as one of the Gulf Coast's premier fishing destinations, 
                    boasting the largest fishing fleet in the Gulf of Mexico. This charming coastal city offers 
                    pristine white sand beaches, world-class fishing charters, and luxury accommodations.
                  </p>
                  <p className="mb-4">
                    From deep-sea fishing for red snapper and grouper to dolphin cruises and parasailing, 
                    Orange Beach provides endless water activities. The city is also home to award-winning 
                    restaurants serving fresh Gulf seafood and Southern coastal cuisine.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Best Time to Visit Orange Beach</h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900">Spring (March-May)</h4>
                    <p className="text-blue-700 text-sm">Perfect weather, fewer crowds, excellent fishing</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900">Summer (June-August)</h4>
                    <p className="text-green-700 text-sm">Peak season, warm waters, all activities available</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-900">Fall (September-November)</h4>
                    <p className="text-orange-700 text-sm">Great weather, lower prices, excellent fishing</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Search CTA */}
          <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Find the Perfect Orange Beach Business
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Search our comprehensive directory of 75+ verified Orange Beach businesses. 
              From world-class fishing charters to beachfront dining, we have everything you need.
            </p>
            <Link
              href="/search?city=Orange Beach&state=Alabama"
              className="inline-flex items-center justify-center px-8 py-4 border border-white text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Search Orange Beach Businesses
            </Link>
          </section>

        </div>
      </div>
    </>
  )
}
