import { Metadata } from 'next'
import Link from 'next/link'
import { advancedSchemaTemplates } from '@/lib/advanced-seo'

export const metadata: Metadata = {
  title: 'Pensacola Florida Directory - Best Restaurants, Hotels & Attractions | 2024 Guide',
  description: 'Complete Pensacola Florida business directory with 150+ verified local businesses. Find the best restaurants, historic attractions, beachfront hotels, and water sports in Pensacola.',
  keywords: [
    'Pensacola Florida directory',
    'Pensacola restaurants',
    'Pensacola hotels',
    'Pensacola attractions',
    'Pensacola beach',
    'Pensacola fishing',
    'Pensacola business directory',
    'Pensacola Florida guide',
    'Pensacola dining',
    'Pensacola accommodations',
    'Pensacola activities',
    'Pensacola historic district',
    'Pensacola Blue Angels',
    'Pensacola Naval Aviation Museum',
    'things to do Pensacola',
    'best restaurants Pensacola',
    'Pensacola Florida tourism',
    'Pensacola vacation guide',
    'Pensacola Florida businesses',
    'downtown Pensacola',
    'Pensacola Beach hotels',
    'Pensacola fishing charters',
    'Pensacola nightlife',
    'Pensacola seafood restaurants'
  ],
  openGraph: {
    title: 'Pensacola Florida Directory - Best Local Businesses & Attractions',
    description: 'Complete Pensacola Florida business directory with 150+ verified local businesses. Find restaurants, hotels, attractions, and activities.',
    type: 'website',
    url: 'https://gulfcoastexplorer.com/locations/pensacola-florida',
    images: [
      {
        url: '/images/locations/pensacola-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Pensacola Florida - Historic city with emerald waters and white sand beaches'
      }
    ]
  },
  other: {
    'geo.region': 'US-FL',
    'geo.placename': 'Pensacola, Florida',
    'geo.position': '30.4118;-87.2169',
    'ICBM': '30.4118, -87.2169',
  }
}

const pensacolaBusinesses = {
  restaurants: [
    { name: 'The Fish House', category: 'Seafood Restaurant', specialty: 'Waterfront dining with fresh Gulf seafood' },
    { name: 'Jackson\'s Steakhouse', category: 'Fine Dining', specialty: 'Upscale steakhouse in historic downtown' },
    { name: 'McGuire\'s Irish Pub', category: 'Irish Pub', specialty: 'Famous for steaks and Irish atmosphere' },
    { name: 'Dharma Blue', category: 'Contemporary American', specialty: 'Creative cuisine with local ingredients' },
    { name: 'The Grand Marlin', category: 'Seafood', specialty: 'Pensacola Beach waterfront dining' },
    { name: 'Carmen\'s Lunch Bar', category: 'Cuban', specialty: 'Authentic Cuban sandwiches since 1950' }
  ],
  accommodations: [
    { name: 'Hilton Pensacola Beach', category: 'Beachfront Resort', specialty: 'Luxury beachfront resort on Gulf Islands' },
    { name: 'Hampton Inn & Suites Pensacola Beach', category: 'Hotel', specialty: 'Family-friendly beachfront hotel' },
    { name: 'Margaritaville Beach Hotel', category: 'Resort', specialty: 'Tropical-themed beachfront resort' },
    { name: 'DoubleTree by Hilton Pensacola', category: 'Hotel', specialty: 'Downtown hotel near historic district' },
    { name: 'Pensacola Grand Hotel', category: 'Historic Hotel', specialty: 'Historic downtown luxury hotel' }
  ],
  attractions: [
    { name: 'National Naval Aviation Museum', category: 'Museum', specialty: 'World\'s largest naval aviation museum' },
    { name: 'Pensacola Beach', category: 'Beach', specialty: 'Sugar-white sand beaches and emerald waters' },
    { name: 'Historic Pensacola Village', category: 'Historic Site', specialty: '19th-century living history museum' },
    { name: 'Blue Angels Practice', category: 'Air Show', specialty: 'Free Blue Angels practice flights' },
    { name: 'Pensacola Lighthouse', category: 'Historic Landmark', specialty: '1859 lighthouse with panoramic views' },
    { name: 'Gulf Islands National Seashore', category: 'National Park', specialty: 'Pristine barrier island beaches' }
  ]
}

export default function PensacolaPage() {
  return (
    <>
      {/* Enhanced Local Business Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            "name": "Pensacola, Florida",
            "description": "Historic Gulf Coast city known for emerald waters, white sand beaches, rich naval history, and vibrant downtown district",
            "url": "https://gulfcoastexplorer.com/locations/pensacola-florida",
            "image": "/images/locations/pensacola-hero.jpg",
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "30.4118",
              "longitude": "-87.2169"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Pensacola",
              "addressRegion": "FL",
              "addressCountry": "US"
            },
            "touristType": [
              "History Enthusiasts",
              "Beach Lovers",
              "Families",
              "Military History Buffs",
              "Food Lovers"
            ],
            "availableLanguage": "English",
            "hasMap": "https://maps.google.com/?q=Pensacola+Florida",
            "maximumAttendeeCapacity": 100000,
            "isAccessibleForFree": true,
            "containsPlace": [
              {
                "@type": "Museum",
                "name": "National Naval Aviation Museum",
                "description": "World's largest naval aviation museum"
              },
              {
                "@type": "Beach",
                "name": "Pensacola Beach",
                "description": "Sugar-white sand beaches with emerald waters"
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
            "name": "Pensacola Florida Businesses",
            "description": "Complete directory of verified businesses in Pensacola, Florida",
            "numberOfItems": 150,
            "itemListElement": [
              ...pensacolaBusinesses.restaurants.map((business, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Restaurant",
                  "name": business.name,
                  "description": business.specialty,
                  "servesCuisine": business.category,
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Pensacola",
                    "addressRegion": "FL"
                  }
                }
              })),
              ...pensacolaBusinesses.accommodations.map((business, index) => ({
                "@type": "ListItem", 
                "position": index + 7,
                "item": {
                  "@type": "LodgingBusiness",
                  "name": business.name,
                  "description": business.specialty,
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Pensacola",
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
            { name: "Pensacola", url: "/locations/pensacola-florida" }
          ]))
        }}
      />

      <div className="min-h-screen bg-gray-50">
        
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-emerald-600 to-blue-700 text-white">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Pensacola, Florida
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                Historic Gulf Coast city with emerald waters, white sand beaches, 
                and America's naval aviation heritage. Explore 150+ local businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/search?city=Pensacola&state=Florida"
                  className="inline-flex items-center justify-center px-8 py-4 border border-white text-lg font-medium rounded-md text-emerald-600 bg-white hover:bg-gray-50 transition-colors"
                >
                  Browse All Businesses
                </Link>
                <Link
                  href="/search?city=Pensacola&state=Florida&category=restaurant"
                  className="inline-flex items-center justify-center px-8 py-4 border border-white text-lg font-medium rounded-md text-white hover:bg-emerald-700 transition-colors"
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
                <div className="text-3xl font-bold text-emerald-600">150+</div>
                <div className="text-gray-600">Verified Businesses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600">60+</div>
                <div className="text-gray-600">Restaurants & Bars</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600">25+</div>
                <div className="text-gray-600">Hotels & Resorts</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600">35+</div>
                <div className="text-gray-600">Attractions & Activities</div>
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
                <h2 className="text-2xl font-bold text-gray-900">Best Pensacola Restaurants</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                {pensacolaBusinesses.restaurants.map((restaurant, index) => (
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
                href="/search?city=Pensacola&state=Florida&category=restaurant"
                className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium"
              >
                View All Pensacola Restaurants
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </section>

            {/* Accommodations */}
            <section className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Pensacola Hotels & Resorts</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                {pensacolaBusinesses.accommodations.map((hotel, index) => (
                  <div key={index} className="border-l-4 border-emerald-500 pl-4">
                    <h3 className="font-semibold text-gray-900">{hotel.name}</h3>
                    <p className="text-gray-600 text-sm">{hotel.specialty}</p>
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full mt-1">
                      {hotel.category}
                    </span>
                  </div>
                ))}
              </div>
              
              <Link
                href="/search?city=Pensacola&state=Florida&category=lodging"
                className="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-medium"
              >
                View All Pensacola Hotels
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </section>

            {/* Attractions */}
            <section className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Top Pensacola Attractions</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                {pensacolaBusinesses.attractions.map((attraction, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900">{attraction.name}</h3>
                    <p className="text-gray-600 text-sm">{attraction.specialty}</p>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                      {attraction.category}
                    </span>
                  </div>
                ))}
              </div>
              
              <Link
                href="/search?city=Pensacola&state=Florida&category=tourist_attraction"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Pensacola Attractions
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </section>

          </div>

          {/* Pensacola Travel Guide */}
          <section className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Complete Pensacola Travel Guide</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Historic Downtown Pensacola</h3>
                <div className="prose text-gray-600">
                  <p className="mb-4">
                    Pensacola's historic downtown district features beautifully preserved 19th-century 
                    architecture, world-class museums, and vibrant nightlife. The Historic Pensacola Village 
                    offers living history demonstrations, while the T.T. Wentworth Jr. Florida State Museum 
                    showcases local heritage.
                  </p>
                  <p className="mb-4">
                    The area is home to award-winning restaurants, craft breweries, and unique shopping 
                    experiences. Don't miss the Pensacola Opera House and the Rex Theatre for live entertainment.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Pensacola Beach & Blue Angels</h3>
                <div className="prose text-gray-600">
                  <p className="mb-4">
                    Pensacola Beach features sugar-white sand beaches consistently ranked among America's best. 
                    The crystal-clear emerald waters of the Gulf of Mexico provide perfect conditions for swimming, 
                    fishing, and water sports.
                  </p>
                  <p className="mb-4">
                    Home to the famous Blue Angels Navy flight demonstration squadron, visitors can watch 
                    practice flights for free at Naval Air Station Pensacola and explore the world's largest 
                    naval aviation museum.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-emerald-50 p-6 rounded-lg">
                <h4 className="font-semibold text-emerald-900 mb-3">Must-Visit Attractions</h4>
                <ul className="text-emerald-700 text-sm space-y-2">
                  <li>• National Naval Aviation Museum</li>
                  <li>• Pensacola Beach Boardwalk</li>
                  <li>• Historic Pensacola Village</li>
                  <li>• Pensacola Lighthouse</li>
                  <li>• Gulf Islands National Seashore</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">Best Dining Experiences</h4>
                <ul className="text-blue-700 text-sm space-y-2">
                  <li>• Waterfront seafood restaurants</li>
                  <li>• Historic downtown dining</li>
                  <li>• Craft breweries & gastropubs</li>
                  <li>• Fresh Gulf Coast seafood</li>
                  <li>• International cuisine options</li>
                </ul>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-3">Water Activities</h4>
                <ul className="text-orange-700 text-sm space-y-2">
                  <li>• Deep-sea fishing charters</li>
                  <li>• Dolphin watching tours</li>
                  <li>• Parasailing & jet skiing</li>
                  <li>• Kayaking & paddleboarding</li>
                  <li>• Snorkeling & scuba diving</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Search CTA */}
          <section className="bg-gradient-to-r from-emerald-600 to-blue-700 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Discover Everything Pensacola Has to Offer
            </h2>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Search our comprehensive directory of 150+ verified Pensacola businesses. 
              From historic attractions to beachfront dining, find exactly what you're looking for.
            </p>
            <Link
              href="/search?city=Pensacola&state=Florida"
              className="inline-flex items-center justify-center px-8 py-4 border border-white text-lg font-medium rounded-md text-emerald-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Search Pensacola Businesses
            </Link>
          </section>

        </div>
      </div>
    </>
  )
}
