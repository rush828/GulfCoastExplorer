import { Metadata } from 'next'
import Link from 'next/link'
import { advancedSchemaTemplates } from '@/lib/advanced-seo'

export const metadata: Metadata = {
  title: 'Gulf Coast Locations Directory - 50+ Coastal Cities | Travel Guide',
  description: 'Explore 50+ Gulf Coast destinations across Texas, Louisiana, Mississippi, Alabama, and Florida. Find local businesses, attractions, and travel information for each coastal city.',
  keywords: [
    'Gulf Coast destinations',
    'Gulf Coast cities',
    'coastal locations Texas to Florida', 
    'Gulf Coast travel destinations',
    'beach cities Gulf Coast',
    'coastal towns directory',
    'Gulf Coast vacation spots',
    'beach destinations guide',
    'Gulf Coast city guide',
    'coastal communities'
  ],
  openGraph: {
    title: 'Gulf Coast Locations Directory - 50+ Coastal Cities',
    description: 'Explore 50+ Gulf Coast destinations across Texas, Louisiana, Mississippi, Alabama, and Florida.',
    type: 'website',
    url: 'https://gulfcoastexplorer.com/locations',
    images: [
      {
        url: '/images/og/gulf-coast-locations.jpg',
        width: 1200,
        height: 630,
        alt: 'Gulf Coast Locations - Beautiful coastal destinations'
      }
    ]
  }
}

const gulfCoastLocations = {
  'Texas': [
    { name: 'Galveston', slug: 'galveston-texas', description: 'Historic island city with Victorian architecture and beautiful beaches' },
    { name: 'South Padre Island', slug: 'south-padre-island-texas', description: 'Premier beach destination with world-class water sports' },
    { name: 'Corpus Christi', slug: 'corpus-christi-texas', description: 'Sparkling City by the Sea with family attractions' },
    { name: 'Port Aransas', slug: 'port-aransas-texas', description: 'Charming fishing village with pristine beaches' },
    { name: 'Rockport', slug: 'rockport-texas', description: 'Art colony and birding capital of Texas' }
  ],
  'Louisiana': [
    { name: 'New Orleans', slug: 'new-orleans-louisiana', description: 'Cultural hub with world-famous cuisine and music' },
    { name: 'Grand Isle', slug: 'grand-isle-louisiana', description: 'Barrier island paradise for fishing enthusiasts' },
    { name: 'Cameron', slug: 'cameron-louisiana', description: 'Authentic Cajun culture and exceptional seafood' }
  ],
  'Mississippi': [
    { name: 'Biloxi', slug: 'biloxi-mississippi', description: 'Casino capital with rich maritime history' },
    { name: 'Gulfport', slug: 'gulfport-mississippi', description: 'Second largest city with beautiful beaches' },
    { name: 'Pass Christian', slug: 'pass-christian-mississippi', description: 'Historic beach town with antebellum charm' },
    { name: 'Bay St. Louis', slug: 'bay-st-louis-mississippi', description: 'Artist community with stunning sunsets' }
  ],
  'Alabama': [
    { name: 'Gulf Shores', slug: 'gulf-shores-alabama', description: 'Premier beach destination with sugar-white sand' },
    { name: 'Orange Beach', slug: 'orange-beach-alabama', description: 'World-class fishing and luxury resorts' },
    { name: 'Mobile', slug: 'mobile-alabama', description: 'Historic port city with antebellum mansions' },
    { name: 'Fort Morgan', slug: 'fort-morgan-alabama', description: 'Historic fort with secluded beaches' }
  ],
  'Florida': [
    { name: 'Pensacola', slug: 'pensacola-florida', description: 'Historic city with emerald waters and white sand' },
    { name: 'Destin', slug: 'destin-florida', description: 'World-famous fishing village with luxury amenities' },
    { name: 'Panama City Beach', slug: 'panama-city-beach-florida', description: 'Spring break capital with family attractions' },
    { name: 'Apalachicola', slug: 'apalachicola-florida', description: 'Historic oyster town with Victorian charm' },
    { name: 'St. Petersburg', slug: 'st-petersburg-florida', description: 'Arts and culture hub with beautiful beaches' },
    { name: 'Clearwater', slug: 'clearwater-florida', description: 'Award-winning beaches and family fun' },
    { name: 'Tampa', slug: 'tampa-florida', description: 'Vibrant city with world-class dining and nightlife' },
    { name: 'Naples', slug: 'naples-florida', description: 'Upscale destination with pristine beaches' },
    { name: 'Fort Myers', slug: 'fort-myers-florida', description: 'City of Palms with historic downtown' },
    { name: 'Sarasota', slug: 'sarasota-florida', description: 'Cultural capital with stunning beaches' }
  ]
}

export default function LocationsPage() {
  const totalCities = Object.values(gulfCoastLocations).reduce((total, cities) => total + cities.length, 0)

  return (
    <>
      {/* Enhanced Schema for Location Directory */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Gulf Coast Locations Directory",
            "description": `Complete directory of ${totalCities} Gulf Coast destinations across 5 states`,
            "url": "https://gulfcoastexplorer.com/locations",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Gulf Coast Cities and Destinations",
              "numberOfItems": totalCities,
              "itemListElement": Object.entries(gulfCoastLocations).flatMap(([state, cities], stateIndex) =>
                cities.map((city, cityIndex) => ({
                  "@type": "ListItem",
                  "position": stateIndex * 10 + cityIndex + 1,
                  "item": {
                    "@type": "Place",
                    "name": `${city.name}, ${state}`,
                    "description": city.description,
                    "url": `https://gulfcoastexplorer.com/locations/${city.slug}`,
                    "containedInPlace": {
                      "@type": "State",
                      "name": state
                    }
                  }
                }))
              )
            }
          })
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(advancedSchemaTemplates.breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Locations", url: "/locations" }
          ]))
        }}
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Gulf Coast Destinations Directory
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Discover {totalCities}+ beautiful coastal destinations across Texas, Louisiana, 
              Mississippi, Alabama, and Florida. Each location features local businesses, 
              attractions, dining, and accommodation options.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {Object.entries(gulfCoastLocations).map(([state, cities]) => (
              <div key={state} className="bg-white rounded-lg shadow-sm border p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{cities.length}</div>
                <div className="text-sm text-gray-600">{state} Cities</div>
              </div>
            ))}
          </div>

          {/* Location Grid by State */}
          <div className="space-y-12">
            {Object.entries(gulfCoastLocations).map(([state, cities]) => (
              <section key={state} className="bg-white rounded-lg shadow-sm border p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">{state} Gulf Coast</h2>
                  <div className="text-sm text-gray-500">{cities.length} destinations</div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cities.map((city) => (
                    <div key={city.slug} className="group relative">
                      <Link 
                        href={`/locations/${city.slug}`}
                        className="block bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 border hover:shadow-md"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {city.name}
                          </h3>
                          <svg 
                            className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {city.description}
                        </p>

                        <div className="flex items-center text-blue-600 text-sm font-medium">
                          Explore {city.name}
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* State-specific call-to-action */}
                <div className="mt-8 text-center">
                  <Link
                    href={`/search?state=${state}`}
                    className="inline-flex items-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
                  >
                    View All {state} Businesses
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </Link>
                </div>
              </section>
            ))}
          </div>

          {/* Popular Categories by Region */}
          <section className="bg-white rounded-lg shadow-sm border p-8 mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Popular Categories by Region
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Water Sports</h3>
                <p className="text-gray-600 text-sm">Parasailing, jet skis, boat tours</p>
                <Link href="/search?category=water-activities" className="text-blue-600 text-sm font-medium">
                  Explore →
                </Link>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Accommodations</h3>
                <p className="text-gray-600 text-sm">Hotels, resorts, vacation rentals</p>
                <Link href="/search?category=lodging" className="text-blue-600 text-sm font-medium">
                  Explore →
                </Link>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Dining</h3>
                <p className="text-gray-600 text-sm">Seafood, casual, fine dining</p>
                <Link href="/search?category=restaurant" className="text-blue-600 text-sm font-medium">
                  Explore →
                </Link>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Attractions</h3>
                <p className="text-gray-600 text-sm">Museums, parks, entertainment</p>
                <Link href="/search?category=tourist_attraction" className="text-blue-600 text-sm font-medium">
                  Explore →
                </Link>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-center text-white mt-12">
            <h2 className="text-2xl font-bold mb-4">
              Plan Your Perfect Gulf Coast Getaway
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              With {totalCities}+ destinations and 500+ verified businesses, 
              we have everything you need to create unforgettable coastal memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
              >
                Start Exploring
              </Link>
              <Link
                href="/business-listing"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-800 transition-colors"
              >
                List Your Business
              </Link>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}
