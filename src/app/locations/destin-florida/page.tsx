import { Metadata } from 'next'
import Link from 'next/link'
import { advancedSchemaTemplates } from '@/lib/advanced-seo'

export const metadata: Metadata = {
  title: 'Destin Florida Directory - Best Restaurants, Resorts & Fishing Charters | 2024 Guide',
  description: 'Complete Destin Florida business directory with 125+ verified local businesses. Find the best restaurants, luxury resorts, fishing charters, and water sports in the World\'s Luckiest Fishing Village.',
  keywords: [
    'Destin Florida directory',
    'Destin restaurants',
    'Destin resorts',
    'Destin fishing charters',
    'Destin harbor',
    'Destin beach',
    'Destin business directory',
    'Destin Florida guide',
    'Destin dining',
    'Destin accommodations',
    'Destin activities',
    'Destin deep sea fishing',
    'Destin dolphin cruises',
    'Henderson Beach State Park',
    'things to do Destin',
    'best restaurants Destin',
    'Destin Florida tourism',
    'Destin vacation guide',
    'Destin Florida businesses',
    'Destin boardwalk',
    'Destin luxury resorts',
    'Destin water sports',
    'Destin nightlife',
    'Destin seafood restaurants',
    'Destin harbor activities'
  ],
  openGraph: {
    title: 'Destin Florida Directory - Best Local Businesses & Fishing Charters',
    description: 'Complete Destin Florida business directory with 125+ verified local businesses. Find restaurants, resorts, fishing charters, and activities.',
    type: 'website',
    url: 'https://gulfcoastexplorer.com/locations/destin-florida',
    images: [
      {
        url: '/images/locations/destin-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Destin Florida - World\'s Luckiest Fishing Village with emerald waters'
      }
    ]
  },
  other: {
    'geo.region': 'US-FL',
    'geo.placename': 'Destin, Florida',
    'geo.position': '30.3935;-86.4958',
    'ICBM': '30.3935, -86.4958',
  }
}

const destinBusinesses = {
  restaurants: [
    { name: 'The Boathouse Oyster Bar', category: 'Seafood Restaurant', specialty: 'Waterfront dining with fresh Gulf oysters' },
    { name: 'Marina Cafe', category: 'Fine Dining', specialty: 'Upscale waterfront dining with harbor views' },
    { name: 'Dewey Destin\'s Harborside', category: 'Seafood', specialty: 'Fresh catch and harbor atmosphere' },
    { name: 'Boshamps Seafood & Oyster House', category: 'Seafood', specialty: 'Casual waterfront dining since 1988' },
    { name: 'Flamingo Cafe', category: 'Contemporary American', specialty: 'Creative coastal cuisine' },
    { name: 'AJ\'s Seafood & Oyster Bar', category: 'Casual Dining', specialty: 'Local favorite with live music' }
  ],
  accommodations: [
    { name: 'Sandestin Golf and Beach Resort', category: 'Luxury Resort', specialty: '2,400-acre luxury resort with golf and spa' },
    { name: 'Henderson Park Inn', category: 'Boutique Hotel', specialty: 'Adults-only beachfront boutique inn' },
    { name: 'Hilton Sandestin Beach', category: 'Beachfront Resort', specialty: 'Family-friendly beachfront resort' },
    { name: 'Emerald Grande at HarborWalk Village', category: 'Luxury Hotel', specialty: 'Harbor-front luxury accommodations' },
    { name: 'Hotel Effie Sandestin', category: 'Autograph Collection', specialty: 'Luxury hotel with rooftop bar' }
  ],
  activities: [
    { name: 'Destin Harbor Boardwalk', category: 'Shopping & Dining', specialty: 'Waterfront entertainment complex' },
    { name: 'HarborWalk Village', category: 'Entertainment District', specialty: 'Shopping, dining, and nightlife' },
    { name: 'Destin-Fort Walton Beach Airport', category: 'Transportation', specialty: 'Regional airport serving the area' },
    { name: 'Big Kahuna\'s Water Park', category: 'Water Park', specialty: 'Family water park with slides and pools' },
    { name: 'The Track Family Recreation Center', category: 'Family Entertainment', specialty: 'Go-karts, mini golf, and arcade' },
    { name: 'Henderson Beach State Park', category: 'State Park', specialty: 'Nature preserve with pristine beaches' }
  ],
  fishing: [
    { name: 'Destin Charter Boat Association', category: 'Fishing Charter', specialty: 'Large fleet of deep-sea fishing boats' },
    { name: 'Charter Boat Buccaneer', category: 'Fishing Charter', specialty: 'Deep-sea fishing for red snapper and grouper' },
    { name: 'Destin Princess', category: 'Party Boat Fishing', specialty: 'Large party boat for group fishing trips' },
    { name: 'Miss Destin', category: 'Fishing Charter', specialty: 'Half-day and full-day fishing charters' }
  ]
}

export default function DestinPage() {
  return (
    <>
      {/* Enhanced Local Business Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            "name": "Destin, Florida",
            "alternateName": "World's Luckiest Fishing Village",
            "description": "Premier Gulf Coast fishing destination known for emerald waters, white sand beaches, luxury resorts, and world-class deep-sea fishing",
            "url": "https://gulfcoastexplorer.com/locations/destin-florida",
            "image": "/images/locations/destin-hero.jpg",
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "30.3935",
              "longitude": "-86.4958"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Destin",
              "addressRegion": "FL",
              "addressCountry": "US"
            },
            "touristType": [
              "Fishing Enthusiasts",
              "Luxury Travelers",
              "Beach Lovers",
              "Families",
              "Golf Enthusiasts"
            ],
            "availableLanguage": "English",
            "hasMap": "https://maps.google.com/?q=Destin+Florida",
            "maximumAttendeeCapacity": 75000,
            "isAccessibleForFree": true,
            "containsPlace": [
              {
                "@type": "Harbor",
                "name": "Destin Harbor",
                "description": "Famous fishing harbor with charter boat fleet"
              },
              {
                "@type": "Beach",
                "name": "Henderson Beach State Park",
                "description": "Pristine state park with white sand beaches"
              }
            ]
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
            "name": "Destin Florida Businesses",
            "description": "Complete directory of verified businesses in Destin, Florida",
            "numberOfItems": 125,
            "itemListElement": [
              ...destinBusinesses.restaurants.map((business, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Restaurant",
                  "name": business.name,
                  "description": business.specialty,
                  "servesCuisine": business.category,
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Destin",
                    "addressRegion": "FL"
                  }
                }
              })),
              ...destinBusinesses.fishing.map((business, index) => ({
                "@type": "ListItem",
                "position": index + 7,
                "item": {
                  "@type": "TouristAttraction",
                  "name": business.name,
                  "description": business.specialty,
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Destin",
                    "addressRegion": "FL"
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
            { name: "Florida", url: "/locations?state=florida" },
            { name: "Destin", url: "/locations/destin-florida" }
          ]))
        }}
      />

      <div className="min-h-screen bg-gray-50">
        
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-teal-600 to-emerald-700 text-white">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Destin, Florida
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                The World's Luckiest Fishing Village with emerald waters, luxury resorts, 
                and world-class deep-sea fishing. Explore 125+ local businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/search?city=Destin&state=Florida"
                  className="inline-flex items-center justify-center px-8 py-4 border border-white text-lg font-medium rounded-md text-teal-600 bg-white hover:bg-gray-50 transition-colors"
                >
                  Browse All Businesses
                </Link>
                <Link
                  href="/search?city=Destin&state=Florida&category=fishing_charter"
                  className="inline-flex items-center justify-center px-8 py-4 border border-white text-lg font-medium rounded-md text-white hover:bg-teal-700 transition-colors"
                >
                  Find Fishing Charters
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
                <div className="text-3xl font-bold text-teal-600">125+</div>
                <div className="text-gray-600">Verified Businesses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-600">45+</div>
                <div className="text-gray-600">Restaurants & Bars</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-600">20+</div>
                <div className="text-gray-600">Resorts & Hotels</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-600">35+</div>
                <div className="text-gray-600">Fishing Charters</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Business Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            
            {/* Restaurants */}
            <section className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Destin Restaurants</h2>
              </div>
              
              <div className="space-y-3 mb-4">
                {destinBusinesses.restaurants.slice(0, 4).map((restaurant, index) => (
                  <div key={index} className="border-l-3 border-orange-500 pl-3">
                    <h3 className="font-medium text-gray-900 text-sm">{restaurant.name}</h3>
                    <p className="text-gray-600 text-xs">{restaurant.specialty}</p>
                  </div>
                ))}
              </div>
              
              <Link
                href="/search?city=Destin&state=Florida&category=restaurant"
                className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium text-sm"
              >
                View All Restaurants
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </section>

            {/* Accommodations */}
            <section className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Destin Resorts</h2>
              </div>
              
              <div className="space-y-3 mb-4">
                {destinBusinesses.accommodations.slice(0, 4).map((hotel, index) => (
                  <div key={index} className="border-l-3 border-teal-500 pl-3">
                    <h3 className="font-medium text-gray-900 text-sm">{hotel.name}</h3>
                    <p className="text-gray-600 text-xs">{hotel.specialty}</p>
                  </div>
                ))}
              </div>
              
              <Link
                href="/search?city=Destin&state=Florida&category=lodging"
                className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium text-sm"
              >
                View All Hotels
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </section>

            {/* Fishing Charters */}
            <section className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Fishing Charters</h2>
              </div>
              
              <div className="space-y-3 mb-4">
                {destinBusinesses.fishing.map((charter, index) => (
                  <div key={index} className="border-l-3 border-blue-500 pl-3">
                    <h3 className="font-medium text-gray-900 text-sm">{charter.name}</h3>
                    <p className="text-gray-600 text-xs">{charter.specialty}</p>
                  </div>
                ))}
              </div>
              
              <Link
                href="/search?city=Destin&state=Florida&category=fishing_charter"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View All Charters
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </section>

            {/* Activities */}
            <section className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Destin Activities</h2>
              </div>
              
              <div className="space-y-3 mb-4">
                {destinBusinesses.activities.slice(0, 4).map((activity, index) => (
                  <div key={index} className="border-l-3 border-green-500 pl-3">
                    <h3 className="font-medium text-gray-900 text-sm">{activity.name}</h3>
                    <p className="text-gray-600 text-xs">{activity.specialty}</p>
                  </div>
                ))}
              </div>
              
              <Link
                href="/search?city=Destin&state=Florida&category=tourist_attraction"
                className="inline-flex items-center text-green-600 hover:text-green-800 font-medium text-sm"
              >
                View All Activities
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </section>

          </div>

          {/* Destin Travel Guide */}
          <section className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Complete Destin Travel Guide</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">World's Luckiest Fishing Village</h3>
                <div className="prose text-gray-600">
                  <p className="mb-4">
                    Destin earned its nickname as the "World's Luckiest Fishing Village" due to its location 
                    at the mouth of Choctawhatchee Bay and its proximity to the continental shelf. The area 
                    boasts the largest fishing fleet in the Gulf of Mexico with over 140 charter boats.
                  </p>
                  <p className="mb-4">
                    The emerald-green waters and sugar-white sand beaches make Destin a premier vacation 
                    destination. Luxury resorts, world-class golf courses, and upscale shopping complement 
                    the natural beauty and fishing heritage.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Destin Harbor & HarborWalk Village</h3>
                <div className="prose text-gray-600">
                  <p className="mb-4">
                    Destin Harbor is the heart of the city's fishing industry and tourist activities. 
                    The harbor boardwalk offers waterfront dining, shopping, and entertainment with 
                    stunning views of the fishing fleet and luxury yachts.
                  </p>
                  <p className="mb-4">
                    HarborWalk Village features upscale restaurants, boutique shopping, and nightlife 
                    venues. Visitors can watch the charter boats return with their daily catch while 
                    enjoying fresh seafood and Gulf Coast hospitality.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-teal-50 p-6 rounded-lg">
                <h4 className="font-semibold text-teal-900 mb-3">Top Fishing Experiences</h4>
                <ul className="text-teal-700 text-sm space-y-2">
                  <li>• Deep-sea red snapper fishing</li>
                  <li>• Grouper and amberjack charters</li>
                  <li>• Half-day and full-day trips</li>
                  <li>• Party boat fishing excursions</li>
                  <li>• Inshore bay fishing tours</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">Luxury Amenities</h4>
                <ul className="text-blue-700 text-sm space-y-2">
                  <li>• Championship golf courses</li>
                  <li>• Spa and wellness centers</li>
                  <li>• Luxury beachfront resorts</li>
                  <li>• Fine dining restaurants</li>
                  <li>• Designer shopping outlets</li>
                </ul>
              </div>
              <div className="bg-emerald-50 p-6 rounded-lg">
                <h4 className="font-semibold text-emerald-900 mb-3">Family Activities</h4>
                <ul className="text-emerald-700 text-sm space-y-2">
                  <li>• Henderson Beach State Park</li>
                  <li>• Dolphin watching cruises</li>
                  <li>• Big Kahuna's Water Park</li>
                  <li>• The Track adventure park</li>
                  <li>• Crab Island water activities</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Search CTA */}
          <section className="bg-gradient-to-r from-teal-600 to-emerald-700 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Experience the Best of Destin
            </h2>
            <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
              Search our comprehensive directory of 125+ verified Destin businesses. 
              From world-class fishing charters to luxury resorts, find everything for your perfect vacation.
            </p>
            <Link
              href="/search?city=Destin&state=Florida"
              className="inline-flex items-center justify-center px-8 py-4 border border-white text-lg font-medium rounded-md text-teal-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Search Destin Businesses
            </Link>
          </section>

        </div>
      </div>
    </>
  )
}
