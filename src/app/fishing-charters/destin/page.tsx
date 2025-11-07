import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Destin Fishing Charters - World\'s Luckiest Fishing Village | Florida Deep Sea Fishing',
  description: 'Premier Destin fishing charters in the "World\'s Luckiest Fishing Village." Book experienced captains for deep sea fishing, red snapper, grouper, and trophy fish with top-rated charter boats in Destin, Florida.',
  keywords: [
    'Destin fishing charters',
    'Destin deep sea fishing',
    'World\'s Luckiest Fishing Village',
    'Florida fishing charters',
    'Destin charter boats',
    'Destin Harbor fishing',
    'Destin fishing guides',
    'Emerald Coast fishing',
    'Destin sport fishing',
    'red snapper fishing Destin',
    'grouper fishing Destin',
    'Destin offshore fishing',
    'mahi mahi fishing Destin',
    'charter boat fishing Destin',
    'Destin fishing fleet'
  ],
  openGraph: {
    title: 'Destin Fishing Charters - World\'s Luckiest Fishing Village | Florida Deep Sea Fishing',
    description: 'Premier Destin fishing charters in the "World\'s Luckiest Fishing Village." Book experienced captains for deep sea fishing and trophy fish adventures.',
    url: 'https://gulfcoastexplorer.com/fishing-charters/destin',
    images: [
      {
        url: '/images/fishing-charters/destin-fishing.jpg',
        width: 1200,
        height: 630,
        alt: 'Destin fishing charter boat with anglers catching red snapper and grouper in the Gulf of Mexico',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Destin Fishing Charters - World\'s Luckiest Fishing Village',
    description: 'Premier Destin fishing charters for deep sea fishing adventures. Book experienced captains for trophy fish in Florida\'s Emerald Coast.',
  },
};

export default function DestinFishingChartersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Destin Fishing Charters
            </h1>
            <p className="text-xl md:text-2xl mb-6">
              The "World's Luckiest Fishing Village" - Premier Deep Sea Fishing Adventures
            </p>
            <Link
              href="/search?city=Destin&state=Florida&category=fishing-charter"
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
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
              World's Luckiest Fishing Village
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Destin earned its famous nickname "World's Luckiest Fishing Village" for good reason. Located on Florida's Emerald Coast, Destin offers some of the closest deep water access on the entire Gulf Coast, with 100-foot depths just 10 miles from shore. Home to the largest charter boat fishing fleet in Florida, Destin provides unmatched fishing opportunities year-round.
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Destin is Special</h3>
            <div className="space-y-4 mb-6">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-800 mb-2">🌊 Closest Deep Water Access</h4>
                <p className="text-sm text-gray-700">100-foot depths just 10 miles offshore - the shortest run to deep water on the Gulf Coast.</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <h4 className="font-semibold text-teal-800 mb-2">🚤 Largest Charter Fleet</h4>
                <p className="text-sm text-gray-700">Florida's largest charter boat fishing fleet with over 100 vessels ranging from 25 to 65+ feet.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🏆 Championship Waters</h4>
                <p className="text-sm text-gray-700">Host to major fishing tournaments including the Destin Fishing Rodeo and Emerald Coast Blue Marlin Classic.</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Trophy Fish Species</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Deep Sea Favorites</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Red Snapper</li>
                  <li>• Grouper (Gag, Red, Scamp)</li>
                  <li>• Mahi Mahi</li>
                  <li>• Amberjack</li>
                  <li>• King Mackerel</li>
                  <li>• Triggerfish</li>
                </ul>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-800 mb-2">Pelagic Species</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Blue Marlin</li>
                  <li>• White Marlin</li>
                  <li>• Sailfish</li>
                  <li>• Wahoo</li>
                  <li>• Blackfin Tuna</li>
                  <li>• Shark Species</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-teal-900 mb-4">🎣 Destin Charter Advantages</h3>
              <ul className="space-y-2 text-teal-800">
                <li>• 10 miles to 100-foot depths (shortest in Gulf)</li>
                <li>• Year-round fishing opportunities</li>
                <li>• Professional captains with decades of experience</li>
                <li>• Modern, well-equipped charter fleet</li>
                <li>• Destin Harbor - full-service marina facilities</li>
                <li>• Championship fishing tournaments</li>
                <li>• Emerald Coast's crystal-clear waters</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-900 mb-4">🌊 Prime Fishing Seasons</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-emerald-800">Spring (March-May)</h4>
                  <p className="text-sm text-emerald-700">Cobia migration, early red snapper, king mackerel, mahi mahi</p>
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-800">Summer (June-August)</h4>
                  <p className="text-sm text-emerald-700">Peak red snapper season, grouper, mahi mahi, marlin, amberjack</p>
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-800">Fall (September-November)</h4>
                  <p className="text-sm text-emerald-700">Extended red snapper, grouper, king mackerel, wahoo, triggerfish</p>
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-800">Winter (December-February)</h4>
                  <p className="text-sm text-emerald-700">Grouper, amberjack, vermillion snapper, winter kings</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-blue-900 mb-4">🚤 Charter Options</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-blue-800">Half Day (4-6 hours)</h4>
                  <p className="text-sm text-blue-700">Nearshore fishing, perfect for families and first-timers</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">Full Day (8-10 hours)</h4>
                  <p className="text-sm text-blue-700">Deep sea fishing for trophy species and limits</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">Extended/Overnight</h4>
                  <p className="text-sm text-blue-700">Multi-day trips to the deepest waters for the biggest fish</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Destin Harbor Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Destin Harbor - Heart of the Fishing Fleet</h2>
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">America's Most Famous Fishing Harbor</h3>
                <p className="text-gray-700 mb-4">
                  Destin Harbor is home to the largest charter boat fishing fleet in Florida, with over 100 vessels offering everything from half-day family trips to multi-day offshore adventures. The harbor features world-class marina facilities, restaurants, and the famous Destin Harbor Boardwalk.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>100+ Charter Boats:</strong> Largest fleet in Florida</li>
                  <li>• <strong>Full Marina Services:</strong> Fuel, ice, bait, tackle</li>
                  <li>• <strong>Professional Fish Cleaning:</strong> Package your catch</li>
                  <li>• <strong>Harbor Boardwalk:</strong> Dining and entertainment</li>
                  <li>• <strong>Easy Access:</strong> Just off Highway 98</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Popular Destin Charter Companies</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-emerald-500 pl-3">
                    <h5 className="font-medium text-gray-900">Harbor Walk Marina</h5>
                    <p className="text-sm text-gray-600">Premium charter destination</p>
                  </div>
                  <div className="border-l-4 border-teal-500 pl-3">
                    <h5 className="font-medium text-gray-900">Destin Harbor</h5>
                    <p className="text-sm text-gray-600">Historic fishing fleet headquarters</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-3">
                    <h5 className="font-medium text-gray-900">AJ's Seafood & Oyster Bar Dock</h5>
                    <p className="text-sm text-gray-600">Charter boats with dining</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Calendar */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Major Fishing Tournaments</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Destin Fishing Rodeo</h3>
              <p className="text-gray-600 text-sm mb-3">October - Month-long fishing festival</p>
              <div className="text-xs text-gray-500">
                <p>Largest fishing tournament in the Gulf</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Emerald Coast Blue Marlin Classic</h3>
              <p className="text-gray-600 text-sm mb-3">June - Premier billfish tournament</p>
              <div className="text-xs text-gray-500">
                <p>Big money marlin competition</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Destin Harborwalk Shootout</h3>
              <p className="text-gray-600 text-sm mb-3">April - Spring fishing tournament</p>
              <div className="text-xs text-gray-500">
                <p>Multiple species competition</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cobia Tournament</h3>
              <p className="text-gray-600 text-sm mb-3">March-April - Cobia migration</p>
              <div className="text-xs text-gray-500">
                <p>Target the spring cobia run</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Experience the World's Luckiest Fishing Village</h2>
          <p className="text-xl mb-6">Browse Destin's legendary charter fleet and book your deep sea fishing adventure</p>
          <Link
            href="/search?city=Destin&state=Florida&category=fishing-charter"
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 inline-block"
          >
            View Available Charters
          </Link>
        </div>

        {/* Related Links */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Link href="/fishing-charters/pensacola" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pensacola Fishing</h3>
            <p className="text-gray-600">Historic Florida fishing port adventures</p>
          </Link>
          <Link href="/fishing-charters/orange-beach" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Orange Beach Fishing</h3>
            <p className="text-gray-600">Alabama's premier fishing destination</p>
          </Link>
          <Link href="/search?state=Florida&category=water-activities" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Emerald Coast Water Sports</h3>
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
            "name": "Destin Fishing Charters - World's Luckiest Fishing Village",
            "description": "Premier deep sea fishing charters in Destin, Florida - the 'World's Luckiest Fishing Village.' Home to Florida's largest charter fleet with closest deep water access on the Gulf Coast.",
            "url": "https://gulfcoastexplorer.com/fishing-charters/destin",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Destin",
              "addressRegion": "Florida",
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "30.3935",
              "longitude": "-86.4958"
            },
            "touristType": "Fishing Enthusiasts",
            "availableLanguage": "English",
            "keywords": "Destin fishing charters, World's Luckiest Fishing Village, deep sea fishing, Florida charter boats, red snapper, grouper, marlin, Destin Harbor, Emerald Coast fishing"
          })
        }}
      />
    </div>
  );
}
