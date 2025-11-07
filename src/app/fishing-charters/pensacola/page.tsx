import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Pensacola Fishing Charters - Deep Sea & Inshore Fishing | Florida Gulf Coast',
  description: 'Premier Pensacola fishing charters for deep sea and inshore fishing adventures. Book experienced captains for red snapper, grouper, and trophy fish with top-rated charter boats in Pensacola, Florida.',
  keywords: [
    'Pensacola fishing charters',
    'Pensacola deep sea fishing',
    'Pensacola inshore fishing',
    'Florida fishing charters',
    'Pensacola charter boats',
    'Pensacola Beach fishing charters',
    'Pensacola fishing guides',
    'Florida Gulf Coast fishing',
    'Pensacola sport fishing',
    'red snapper fishing Pensacola',
    'grouper fishing Pensacola',
    'Pensacola offshore fishing',
    'Pensacola nearshore fishing',
    'charter boat fishing Pensacola'
  ],
  openGraph: {
    title: 'Pensacola Fishing Charters - Deep Sea & Inshore Fishing | Florida Gulf Coast',
    description: 'Premier Pensacola fishing charters for deep sea and inshore fishing adventures. Book experienced captains for red snapper, grouper, and trophy fish.',
    url: 'https://gulfcoastexplorer.com/fishing-charters/pensacola',
    images: [
      {
        url: '/images/fishing-charters/pensacola-fishing.jpg',
        width: 1200,
        height: 630,
        alt: 'Pensacola fishing charter boat with anglers catching red snapper in the Gulf of Mexico',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pensacola Fishing Charters - Deep Sea & Inshore Fishing',
    description: 'Premier Pensacola fishing charters for deep sea and inshore fishing adventures. Book experienced captains for trophy fish.',
  },
};

export default function PensacolaFishingChartersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Pensacola Fishing Charters
            </h1>
            <p className="text-xl md:text-2xl mb-6">
              Florida's Historic Fishing Port with World-Class Deep Sea & Inshore Adventures
            </p>
            <Link
              href="/search?city=Pensacola&state=Florida&category=fishing-charter"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              Book Your Charter Today
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Historic Pensacola - Gateway to Gulf Fishing
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Pensacola has been a fishing hub for over 450 years, with some of the most experienced charter captains on the Gulf Coast. From the historic downtown waterfront to Pensacola Beach, you'll find world-class fishing opportunities in the emerald waters of the Gulf of Mexico.
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Prime Fishing Locations</h3>
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🌊 Deep Sea (20-100+ miles)</h4>
                <p className="text-sm text-gray-700">Red snapper, grouper, amberjack, mahi mahi, and pelagic species in the deep Gulf waters.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-800 mb-2">🏖️ Nearshore (3-20 miles)</h4>
                <p className="text-sm text-gray-700">King mackerel, Spanish mackerel, cobia, and reef fish in the productive nearshore waters.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🏞️ Inshore Bays & Sound</h4>
                <p className="text-sm text-gray-700">Redfish, speckled trout, flounder in Pensacola Bay, Santa Rosa Sound, and surrounding waters.</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Charter Fleet Options</h3>
            <div className="space-y-4 mb-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900">Sport Fishing Boats (25-35 ft)</h4>
                <p className="text-gray-700">Perfect for small groups and families. Nearshore and some offshore fishing.</p>
              </div>
              <div className="border-l-4 border-emerald-500 pl-4">
                <h4 className="font-semibold text-gray-900">Offshore Charters (35-55 ft)</h4>
                <p className="text-gray-700">Comfortable boats for deep sea adventures with full amenities.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-gray-900">Head Boats & Party Boats</h4>
                <p className="text-gray-700">Large vessels accommodating groups for shared fishing experiences.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-900 mb-4">🎣 Pensacola Fishing Advantages</h3>
              <ul className="space-y-2 text-emerald-800">
                <li>• Historic fishing port with 450+ years of tradition</li>
                <li>• Multiple marinas and departure points</li>
                <li>• Quick access to deep water (15-20 miles)</li>
                <li>• Year-round fishing opportunities</li>
                <li>• USCG licensed and insured captains</li>
                <li>• Full-service fish cleaning and packaging</li>
                <li>• Pensacola Beach proximity for lodging</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-blue-900 mb-4">🌊 Top Target Species by Season</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-blue-800">Spring (March-May)</h4>
                  <p className="text-sm text-blue-700">Cobia runs, Spanish mackerel, king mackerel, early red snapper</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">Summer (June-August)</h4>
                  <p className="text-sm text-blue-700">Red snapper season, mahi mahi, grouper, amberjack, shark</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">Fall (September-November)</h4>
                  <p className="text-sm text-blue-700">Extended red snapper, grouper, king mackerel, triggerfish</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">Winter (December-February)</h4>
                  <p className="text-sm text-blue-700">Grouper, amberjack, vermillion snapper, winter kings</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-orange-900 mb-4">🏆 Charter Amenities</h3>
              <ul className="space-y-2 text-orange-800 text-sm">
                <li>• Professional fishing equipment and tackle</li>
                <li>• Ice, bait, and fishing licenses included</li>
                <li>• GPS fish finders and navigation equipment</li>
                <li>• Safety equipment and emergency gear</li>
                <li>• Coolers for your catch</li>
                <li>• Restroom facilities on larger boats</li>
                <li>• Experienced crew and mate services</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Popular Marinas Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Pensacola Fishing Marinas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pensacola Bay Marina</h3>
              <p className="text-gray-600 text-sm mb-3">Downtown Pensacola's premier fishing charter destination</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Full-service marina</li>
                <li>• Restaurant and fuel dock</li>
                <li>• Easy highway access</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pensacola Beach Marina</h3>
              <p className="text-gray-600 text-sm mb-3">Beach-side departure point with quick Gulf access</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Beach location convenience</li>
                <li>• Closer to offshore waters</li>
                <li>• Multiple charter options</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Half Hitch Tackle</h3>
              <p className="text-gray-600 text-sm mb-3">Legendary fishing center and charter hub</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Historic fishing destination</li>
                <li>• Tackle shop and supplies</li>
                <li>• Local fishing expertise</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Pensacola's Best Fishing?</h2>
          <p className="text-xl mb-6">Browse our verified fishing charter captains and book your Gulf Coast adventure</p>
          <Link
            href="/search?city=Pensacola&state=Florida&category=fishing-charter"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 inline-block"
          >
            View Available Charters
          </Link>
        </div>

        {/* Related Links */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Link href="/fishing-charters/orange-beach" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Orange Beach Fishing</h3>
            <p className="text-gray-600">Explore Alabama's premier fishing destination</p>
          </Link>
          <Link href="/fishing-charters/destin" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Destin Fishing Charters</h3>
            <p className="text-gray-600">The "World's Luckiest Fishing Village"</p>
          </Link>
          <Link href="/search?state=Florida&category=water-activities" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Florida Water Sports</h3>
            <p className="text-gray-600">Parasailing, jet skis, and more adventures</p>
          </Link>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            "name": "Pensacola Fishing Charters",
            "description": "Historic Pensacola fishing charters offering deep sea and inshore fishing adventures in Florida's Gulf Coast waters. Expert captains, trophy fish, and 450+ years of fishing tradition.",
            "url": "https://gulfcoastexplorer.com/fishing-charters/pensacola",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Pensacola",
              "addressRegion": "Florida",
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "30.4213",
              "longitude": "-87.2169"
            },
            "touristType": "Fishing Enthusiasts",
            "availableLanguage": "English",
            "keywords": "Pensacola fishing charters, deep sea fishing, inshore fishing, Florida Gulf Coast, charter boats, red snapper, grouper, fishing guides, historic fishing port"
          })
        }}
      />
    </div>
  );
}
