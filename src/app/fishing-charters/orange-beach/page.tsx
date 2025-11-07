import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Orange Beach Fishing Charters - Deep Sea & Inshore Fishing | Alabama Gulf Coast',
  description: 'Premier Orange Beach fishing charters for deep sea and inshore fishing adventures. Book experienced captains for red snapper, grouper, and trophy fish with top-rated charter boats in Orange Beach, Alabama.',
  keywords: [
    'Orange Beach fishing charters',
    'Orange Beach deep sea fishing',
    'Orange Beach inshore fishing',
    'Alabama fishing charters',
    'Orange Beach charter boats',
    'Gulf Shores fishing charters',
    'Orange Beach fishing guides',
    'Alabama Gulf Coast fishing',
    'Orange Beach sport fishing',
    'red snapper fishing Orange Beach',
    'grouper fishing Orange Beach',
    'Orange Beach offshore fishing',
    'Orange Beach nearshore fishing',
    'charter boat fishing Orange Beach'
  ],
  openGraph: {
    title: 'Orange Beach Fishing Charters - Deep Sea & Inshore Fishing | Alabama Gulf Coast',
    description: 'Premier Orange Beach fishing charters for deep sea and inshore fishing adventures. Book experienced captains for red snapper, grouper, and trophy fish.',
    url: 'https://gulfcoastexplorer.com/fishing-charters/orange-beach',
    images: [
      {
        url: '/images/fishing-charters/orange-beach-fishing.jpg',
        width: 1200,
        height: 630,
        alt: 'Orange Beach fishing charter boat with anglers catching red snapper in the Gulf of Mexico',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orange Beach Fishing Charters - Deep Sea & Inshore Fishing',
    description: 'Premier Orange Beach fishing charters for deep sea and inshore fishing adventures. Book experienced captains for trophy fish.',
  },
};

export default function OrangeBeachFishingChartersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Orange Beach Fishing Charters
            </h1>
            <p className="text-xl md:text-2xl mb-6">
              Deep Sea & Inshore Fishing Adventures in Alabama's Premier Fishing Destination
            </p>
            <Link
              href="/search?city=Orange Beach&state=Alabama&category=fishing-charter"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
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
              World-Class Fishing in Orange Beach, Alabama
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Orange Beach is renowned as one of the Gulf Coast's premier fishing destinations, offering some of the best deep sea and inshore fishing opportunities in the United States. Our experienced charter captains know these waters like the back of their hand, ensuring you have the best chance at landing trophy fish.
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Target Species</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Deep Sea</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Red Snapper</li>
                  <li>• Grouper</li>
                  <li>• Mahi Mahi</li>
                  <li>• King Mackerel</li>
                  <li>• Amberjack</li>
                  <li>• Shark</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Inshore</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Redfish</li>
                  <li>• Speckled Trout</li>
                  <li>• Flounder</li>
                  <li>• Spanish Mackerel</li>
                  <li>• Sheepshead</li>
                  <li>• Cobia</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Charter Options</h3>
            <div className="space-y-4 mb-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900">Half Day (4-6 hours)</h4>
                <p className="text-gray-700">Perfect for families and beginners. Inshore and nearshore fishing.</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-gray-900">Full Day (8-10 hours)</h4>
                <p className="text-gray-700">Deep sea adventures targeting trophy fish and multiple species.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-gray-900">Extended Trips (12+ hours)</h4>
                <p className="text-gray-700">Serious fishing excursions to the deepest offshore waters.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-blue-900 mb-4">🎣 Why Choose Orange Beach?</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• Close proximity to deep water (30 miles)</li>
                <li>• Year-round fishing opportunities</li>
                <li>• Experienced local captains</li>
                <li>• State-of-the-art charter boats</li>
                <li>• Excellent fish cleaning facilities</li>
                <li>• Multiple marina options</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-orange-900 mb-4">🌊 Best Fishing Seasons</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-orange-800">Spring (March-May)</h4>
                  <p className="text-sm text-orange-700">Cobia, Spanish Mackerel, Red Snapper (when in season)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-800">Summer (June-August)</h4>
                  <p className="text-sm text-orange-700">Red Snapper, Mahi Mahi, King Mackerel, Grouper</p>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-800">Fall (September-November)</h4>
                  <p className="text-sm text-orange-700">Red Snapper, Amberjack, Grouper, Triggerfish</p>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-800">Winter (December-February)</h4>
                  <p className="text-sm text-orange-700">Grouper, Amberjack, Vermillion Snapper</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Orange Beach Fishing Charter?</h2>
          <p className="text-xl mb-6">Browse our verified fishing charter captains and book your next adventure</p>
          <Link
            href="/search?city=Orange Beach&state=Alabama&category=fishing-charter"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 inline-block"
          >
            View Available Charters
          </Link>
        </div>

        {/* Related Links */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Link href="/fishing-charters/pensacola" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pensacola Fishing Charters</h3>
            <p className="text-gray-600">Explore fishing opportunities in nearby Pensacola, Florida</p>
          </Link>
          <Link href="/fishing-charters/destin" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Destin Fishing Charters</h3>
            <p className="text-gray-600">Discover the "World's Luckiest Fishing Village"</p>
          </Link>
          <Link href="/search?state=Alabama&category=water-activities" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Alabama Water Sports</h3>
            <p className="text-gray-600">Parasailing, jet skis, and more water adventures</p>
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
            "name": "Orange Beach Fishing Charters",
            "description": "Premier deep sea and inshore fishing charters in Orange Beach, Alabama. Expert captains, trophy fish, and unforgettable Gulf Coast fishing adventures.",
            "url": "https://gulfcoastexplorer.com/fishing-charters/orange-beach",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Orange Beach",
              "addressRegion": "Alabama",
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "30.2941",
              "longitude": "-87.5961"
            },
            "touristType": "Fishing Enthusiasts",
            "availableLanguage": "English",
            "keywords": "Orange Beach fishing charters, deep sea fishing, inshore fishing, Alabama Gulf Coast, charter boats, red snapper, grouper, fishing guides"
          })
        }}
      />
    </div>
  );
}
