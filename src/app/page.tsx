import Link from 'next/link';
import { statesAndCities } from '../data/cities';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Gulf Coast Tourist Directory - Complete Travel Guide for 50+ Coastal Cities | Texas to Florida',
  description: 'The Gulf Coast\'s most comprehensive tourist directory featuring 500+ verified local businesses across 50+ coastal cities from Texas to Florida. Find restaurants, hotels, attractions, and services with expert travel recommendations.',
  keywords: [
    'Gulf Coast Tourist Directory',
    'Gulf Coast Tourism Directory',
    'Gulf Coast Travel Directory',
    'Gulf Coast Tourist Guide',
    'Gulf Coast Vacation Directory',
    'Gulf Coast Travel Guide',
    'Gulf Coast Tourist Information',
    'Gulf Coast Travel Information',
    'Gulf Coast Tourist Resources',
    'Gulf Coast Travel Resources',
    'Complete Gulf Coast Tourist Directory',
    'Gulf Coast Tourist Directory Website',
    'Gulf Coast Tourist Directory for Travelers',
    'Gulf Coast Tourist Directory with Reviews',
    'Gulf Coast Tourist Directory Texas to Florida',
    'Gulf Coast Directory',
    'Gulf Coast Business Directory',
    'Gulf Coast travel guide',
    'best Gulf Coast beaches',
    'Gulf Coast vacation planning',
    'coastal cities Texas to Florida',
    'Gulf Coast fishing charters',
    'beachfront hotels Gulf Coast',
    'Gulf Coast family vacation',
    'coastal attractions Gulf Coast',
    'Gulf Coast seafood restaurants',
    'beach vacation destinations',
    'Gulf Coast water sports',
    'coastal travel planning'
  ],
  openGraph: {
    title: 'Gulf Coast Tourist Directory - Complete Travel Guide for Coastal Cities',
    description: 'The Gulf Coast\'s most comprehensive tourist directory featuring 500+ verified local businesses across 50+ coastal cities from Texas to Florida.',
    images: [
      {
        url: '/images/og/gulf_coast_explorer_og.jpg',
        width: 1200,
        height: 630,
        alt: 'Beautiful Gulf Coast beaches from Texas to Florida - pristine white sand, turquoise waters, and palm trees',
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=800&fit=crop&crop=center"
              alt="Beautiful Gulf Coast beach with pristine white sand and turquoise waters - Gulf Coast Tourist Directory"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-4xl sm:text-4xl md:text-6xl font-bold mb-2 sm:mb-6">
              Gulf Coast Tourist Directory
            </h1>
            <p className="text-base sm:text-xl md:text-2xl max-w-4xl mx-auto mb-4 sm:mb-8">
              The Gulf Coast's most comprehensive tourist directory featuring 500+ verified local businesses across 50+ coastal cities from Texas to Florida. Find restaurants, hotels, attractions, and services with expert travel recommendations and local insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4 sm:gap-0 justify-center">
              <Link href="/search" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors">
                Search Gulf Coast Destinations
              </Link>
              <Link href="/states/florida" className="bg-blue-700 text-white hover:bg-blue-800 font-semibold py-3 px-8 rounded-lg transition-colors border border-white/20">
                Explore Florida Coast
              </Link>
            </div>
            
            {/* Quick Access Links */}
            <div className="mt-4 sm:mt-8 flex flex-wrap justify-center gap-3 md:gap-6 max-w-4xl mx-auto">
              <Link href="/search?state=texas" className="text-white/90 hover:text-white text-sm font-medium underline underline-offset-4 hover:underline-offset-2 transition-all whitespace-nowrap">
                Texas Coast
              </Link>
              <Link href="/search?state=louisiana" className="text-white/90 hover:text-white text-sm font-medium underline underline-offset-4 hover:underline-offset-2 transition-all whitespace-nowrap">
                Louisiana Bayou
              </Link>
              <Link href="/search?state=mississippi" className="text-white/90 hover:text-white text-sm font-medium underline underline-offset-4 hover:underline-offset-2 transition-all whitespace-nowrap">
                Mississippi Coast
              </Link>
              <Link href="/search?state=alabama" className="text-white/90 hover:text-white text-sm font-medium underline underline-offset-4 hover:underline-offset-2 transition-all whitespace-nowrap">
                Alabama Beaches
              </Link>
              <Link href="/search?state=florida&category=fishing_charter" className="text-white/90 hover:text-white text-sm font-medium underline underline-offset-4 hover:underline-offset-2 transition-all whitespace-nowrap">
                Florida Fishing
              </Link>
            </div>
          </div>
        </section>



        {/* States Section */}
        <section className="py-16" style={{paddingTop: '2rem'}} aria-labelledby="states-heading">
          <div className="container mx-auto px-4">

            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {statesAndCities.map((state) => (
                <article key={state.slug} className="card hover:shadow-xl transition-shadow overflow-hidden bg-white rounded-lg shadow-md">
                  {/* State Hero Image */}
                  <div className="relative h-48 w-full">
                    <Image
                      src={`/images/states/${state.slug}/hero.jpg`}
                      alt={`Beautiful ${state.name} Gulf Coast coastline with pristine beaches and turquoise waters - Gulf Coast Tourist Directory`}
                      fill
                      className="object-cover"
                      priority={state.slug === 'texas' || state.slug === 'florida'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold">
                        {state.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">
                      {state.description}
                    </p>
                    <div className="mb-4">
                      <span className="text-sm text-blue-600 font-medium">
                        {state.cities.length} Coastal Cities
                      </span>
                    </div>
          <div className="space-y-3">
            <Link 
              href={`/states/${state.slug}`}
              className="btn-primary w-full text-center block"
              aria-label={`Explore ${state.name} Gulf Coast destinations`}
            >
              Explore {state.name}
            </Link>
          </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Expert Recommendations Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Why Trust Our Gulf Coast Recommendations?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our travel experts have spent decades exploring the Gulf Coast, 
                from hidden fishing spots to luxury beachfront resorts. We curate and verify 
                every destination we recommend through extensive research and local expertise.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4">🏖️</div>
                <h3 className="text-xl font-semibold mb-4">50+ Best Beaches</h3>
                <p className="text-gray-600">Personally reviewed pristine beaches from Galveston to Key West, rated for families, couples, and water sports enthusiasts.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4">🎣</div>
                <h3 className="text-xl font-semibold mb-4">Expert Fishing Guides</h3>
                <p className="text-gray-600">Vetted fishing charters and local guides with extensive experience. Deep sea, inshore, and bay fishing specialists.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4">🏨</div>
                <h3 className="text-xl font-semibold mb-4">Verified Accommodations</h3>
                <p className="text-gray-600">Hand-picked hotels, resorts, and vacation rentals. Each property verified for quality and value through research and reviews.</p>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="bg-blue-50 p-8 rounded-lg">
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">Decades</div>
                  <div className="text-sm text-gray-600">of Expertise</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">50+</div>
                  <div className="text-sm text-gray-600">Coastal Cities Covered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-600">Verified Businesses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">Current</div>
                  <div className="text-sm text-gray-600">Updated Information</div>
                </div>
              </div>
            </div>

            {/* Featured Snippets Content */}
            <div className="mt-12 bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Best Gulf Coast Destinations</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">🏖️ Top 5 Gulf Coast Beaches:</h4>
                  <ol className="space-y-2 text-gray-700">
                    <li><Link href="/search?state=florida&city=destin&category=beach" className="text-blue-600 hover:text-blue-800 font-semibold">Destin, Florida</Link> - Crystal clear emerald waters and white sand</li>
                    <li><Link href="/search?state=alabama&city=gulf-shores&category=beach" className="text-blue-600 hover:text-blue-800 font-semibold">Gulf Shores, Alabama</Link> - Family-friendly with great amenities</li>
                    <li><Link href="/search?state=florida&city=panama-city-beach&category=beach" className="text-blue-600 hover:text-blue-800 font-semibold">Panama City Beach, Florida</Link> - 27 miles of pristine coastline</li>
                    <li><Link href="/search?state=texas&city=south-padre-island&category=beach" className="text-blue-600 hover:text-blue-800 font-semibold">South Padre Island, Texas</Link> - Perfect for water sports and fishing</li>
                    <li><Link href="/search?state=mississippi&city=biloxi&category=beach" className="text-blue-600 hover:text-blue-800 font-semibold">Biloxi, Mississippi</Link> - Historic charm with beautiful beaches</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">🎣 Best Fishing Spots:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li><Link href="/search?state=louisiana&city=venice&category=fishing_charter" className="text-blue-600 hover:text-blue-800 font-semibold">Venice, Louisiana</Link> - "Tuna Capital of the World"</li>
                    <li><Link href="/search?state=texas&city=port-aransas&category=fishing_charter" className="text-blue-600 hover:text-blue-800 font-semibold">Port Aransas, Texas</Link> - Redfish and trout fishing</li>
                    <li><Link href="/search?state=florida&city=destin&category=fishing_charter" className="text-blue-600 hover:text-blue-800 font-semibold">Destin, Florida</Link> - Deep sea fishing charters</li>
                    <li><Link href="/search?state=louisiana&city=grand-isle&category=fishing_charter" className="text-blue-600 hover:text-blue-800 font-semibold">Grand Isle, Louisiana</Link> - Inshore and offshore options</li>
                    <li><Link href="/search?state=alabama&city=orange-beach&category=fishing_charter" className="text-blue-600 hover:text-blue-800 font-semibold">Orange Beach, Alabama</Link> - Family fishing adventures</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Best Time to Visit Gulf Coast:</h4>
                <p className="text-gray-700 mb-4">
                  <strong>Peak Season:</strong> March through May and September through November offer the best weather with fewer crowds. 
                  <strong>Summer:</strong> June through August is hot but perfect for beach activities. 
                  <strong>Winter:</strong> December through February is mild and great for fishing.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Pro Tip:</strong> Book accommodations 2-3 months in advance for peak season, and check local fishing reports for the best catch times.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}