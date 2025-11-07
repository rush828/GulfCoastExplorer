import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Gulf Coast Fishing Charters Directory - Deep Sea & Inshore Fishing | Texas to Florida',
  description: 'Comprehensive Gulf Coast fishing charters directory featuring 500+ verified captains from Texas to Florida. Book deep sea fishing, inshore charters, and sport fishing adventures with experienced guides.',
  keywords: [
    'Gulf Coast fishing charters',
    'Gulf Coast deep sea fishing',
    'Gulf Coast inshore fishing',
    'fishing charter directory',
    'charter boat fishing',
    'Gulf Coast fishing guides',
    'sport fishing charters',
    'offshore fishing charters',
    'nearshore fishing charters',
    'Texas fishing charters',
    'Louisiana fishing charters',
    'Mississippi fishing charters',
    'Alabama fishing charters',
    'Florida fishing charters',
    'red snapper fishing',
    'grouper fishing',
    'mahi mahi fishing',
    'Gulf of Mexico fishing'
  ],
  openGraph: {
    title: 'Gulf Coast Fishing Charters Directory - Deep Sea & Inshore Fishing | Texas to Florida',
    description: 'Comprehensive Gulf Coast fishing charters directory featuring 500+ verified captains from Texas to Florida. Book fishing adventures with experienced guides.',
    url: 'https://gulfcoastexplorer.com/fishing-charters',
    images: [
      {
        url: '/images/fishing-charters/gulf-coast-fishing.jpg',
        width: 1200,
        height: 630,
        alt: 'Gulf Coast fishing charter boats with anglers catching fish in the Gulf of Mexico',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gulf Coast Fishing Charters Directory - Deep Sea & Inshore Fishing',
    description: 'Comprehensive Gulf Coast fishing charters directory. Book fishing adventures with 500+ verified captains from Texas to Florida.',
  },
};

export default function FishingChartersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Gulf Coast Fishing Charters
            </h1>
            <p className="text-xl md:text-2xl mb-6">
              500+ Verified Captains | Deep Sea & Inshore Fishing | Texas to Florida
            </p>
            <Link
              href="/search?category=fishing-charter"
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              Find Fishing Charters
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Premier Destinations */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Premier Fishing Destinations
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/fishing-charters/orange-beach" className="group">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 relative">
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold">Orange Beach</h3>
                    <p className="text-orange-100">Alabama's Premier Fishing Port</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    World-class deep sea and inshore fishing with experienced Alabama captains. Close proximity to deep water makes Orange Beach a top choice for trophy fish.
                  </p>
                  <div className="flex items-center text-orange-600 font-semibold">
                    <span>Explore Charters</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/fishing-charters/pensacola" className="group">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-emerald-400 to-emerald-600 relative">
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold">Pensacola</h3>
                    <p className="text-emerald-100">Historic Florida Fishing Port</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    450+ years of fishing tradition with expert local captains. Multiple marinas and quick access to the productive Gulf waters of the Emerald Coast.
                  </p>
                  <div className="flex items-center text-emerald-600 font-semibold">
                    <span>Explore Charters</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/fishing-charters/destin" className="group">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-teal-400 to-teal-600 relative">
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold">Destin</h3>
                    <p className="text-teal-100">World's Luckiest Fishing Village</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    Home to Florida's largest charter fleet with the closest deep water access on the Gulf Coast. 100-foot depths just 10 miles offshore.
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold">
                    <span>Explore Charters</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Fishing Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Types of Fishing Charters
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
              <div className="text-4xl mb-4">🌊</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Deep Sea Fishing</h3>
              <p className="text-blue-800 mb-4">
                Venture 20-100+ miles offshore for trophy fish like red snapper, grouper, mahi mahi, and marlin in the deep Gulf waters.
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 8-12 hour trips</li>
                <li>• Trophy species fishing</li>
                <li>• Experienced crews</li>
                <li>• All equipment included</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-lg">
              <div className="text-4xl mb-4">🏖️</div>
              <h3 className="text-xl font-bold text-emerald-900 mb-3">Nearshore Fishing</h3>
              <p className="text-emerald-800 mb-4">
                Fish the productive waters 3-20 miles offshore for king mackerel, Spanish mackerel, cobia, and reef fish.
              </p>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• 4-8 hour trips</li>
                <li>• Great for beginners</li>
                <li>• Family-friendly</li>
                <li>• Variety of species</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
              <div className="text-4xl mb-4">🏞️</div>
              <h3 className="text-xl font-bold text-green-900 mb-3">Inshore Fishing</h3>
              <p className="text-green-800 mb-4">
                Target redfish, speckled trout, and flounder in the protected bays, sounds, and marsh areas.
              </p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 4-6 hour trips</li>
                <li>• Calm water fishing</li>
                <li>• Light tackle action</li>
                <li>• Year-round fishing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* State-by-State Guide */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Fishing Charters by State
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Link href="/search?state=texas&category=fishing-charter" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">Texas</h3>
              <p className="text-gray-600 text-sm mb-3">Galveston, Port Arthur, Beaumont fishing charters</p>
              <div className="text-xs text-gray-500">
                <div>• Red snapper</div>
                <div>• King mackerel</div>
                <div>• Redfish</div>
              </div>
            </Link>

            <Link href="/search?state=louisiana&category=fishing-charter" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">Louisiana</h3>
              <p className="text-gray-600 text-sm mb-3">Grand Isle, Venice, Empire fishing charters</p>
              <div className="text-xs text-gray-500">
                <div>• Yellowfin tuna</div>
                <div>• Red snapper</div>
                <div>• Redfish</div>
              </div>
            </Link>

            <Link href="/search?state=mississippi&category=fishing-charter" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">Mississippi</h3>
              <p className="text-gray-600 text-sm mb-3">Biloxi, Gulfport, Pass Christian charters</p>
              <div className="text-xs text-gray-500">
                <div>• Red snapper</div>
                <div>• Grouper</div>
                <div>• Speckled trout</div>
              </div>
            </Link>

            <Link href="/search?state=alabama&category=fishing-charter" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">Alabama</h3>
              <p className="text-gray-600 text-sm mb-3">Orange Beach, Gulf Shores, Mobile Bay</p>
              <div className="text-xs text-gray-500">
                <div>• Red snapper</div>
                <div>• Grouper</div>
                <div>• King mackerel</div>
              </div>
            </Link>

            <Link href="/search?state=florida&category=fishing-charter" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">Florida</h3>
              <p className="text-gray-600 text-sm mb-3">Pensacola, Destin, Panama City Beach</p>
              <div className="text-xs text-gray-500">
                <div>• Red snapper</div>
                <div>• Mahi mahi</div>
                <div>• Grouper</div>
              </div>
            </Link>
          </div>
        </div>

        {/* What to Expect */}
        <div className="mb-16 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            What to Expect on Your Charter
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">✅ Included in Most Charters</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Professional fishing equipment and tackle</li>
                <li>• Experienced USCG licensed captain</li>
                <li>• Ice and coolers for your catch</li>
                <li>• Bait and fishing licenses</li>
                <li>• Safety equipment and emergency gear</li>
                <li>• GPS fish finders and navigation</li>
                <li>• Fish cleaning and packaging services</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 What to Bring</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Sunscreen and protective clothing</li>
                <li>• Snacks and non-alcoholic beverages</li>
                <li>• Motion sickness medication (if needed)</li>
                <li>• Camera for trophy photos</li>
                <li>• Cash for crew tips (15-20% customary)</li>
                <li>• Valid ID for verification</li>
                <li>• Cooler if you want to take fish home</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Booking CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Gulf Coast Fishing Adventure?</h2>
          <p className="text-xl mb-6">Browse 500+ verified fishing charter captains across the Gulf Coast</p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Link
              href="/search?category=fishing-charter"
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 inline-block"
            >
              Search All Charters
            </Link>
            <Link
              href="/search?category=water-activities"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 inline-block"
            >
              Water Sports & Activities
            </Link>
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Gulf Coast Fishing Charters Directory",
            "description": "Comprehensive directory of Gulf Coast fishing charters featuring 500+ verified captains from Texas to Florida. Deep sea fishing, inshore charters, and sport fishing adventures.",
            "url": "https://gulfcoastexplorer.com/fishing-charters",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Gulf Coast Fishing Charter Destinations",
              "itemListElement": [
                {
                  "@type": "TouristDestination",
                  "position": 1,
                  "name": "Orange Beach Fishing Charters",
                  "url": "https://gulfcoastexplorer.com/fishing-charters/orange-beach",
                  "description": "Alabama's premier fishing destination with world-class deep sea and inshore fishing"
                },
                {
                  "@type": "TouristDestination",
                  "position": 2,
                  "name": "Pensacola Fishing Charters",
                  "url": "https://gulfcoastexplorer.com/fishing-charters/pensacola",
                  "description": "Historic Florida fishing port with 450+ years of fishing tradition"
                },
                {
                  "@type": "TouristDestination",
                  "position": 3,
                  "name": "Destin Fishing Charters",
                  "url": "https://gulfcoastexplorer.com/fishing-charters/destin",
                  "description": "World's Luckiest Fishing Village with Florida's largest charter fleet"
                }
              ]
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
                  "name": "Fishing Charters",
                  "item": "https://gulfcoastexplorer.com/fishing-charters"
                }
              ]
            }
          })
        }}
      />
    </div>
  );
}
