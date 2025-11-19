import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Best Time to Visit Gulf Coast - Seasonal Travel Guide | Weather & Activities',
  description: 'Discover the best time to visit Gulf Coast beaches, fishing seasons, and seasonal activities. Complete guide to weather, crowds, and optimal travel times.',
  keywords: [
    'best time to visit Gulf Coast',
    'Gulf Coast weather by month',
    'Gulf Coast fishing seasons',
    'Gulf Coast peak season',
    'Gulf Coast off season',
    'Gulf Coast hurricane season',
    'Gulf Coast spring break',
    'Gulf Coast summer vacation',
    'Gulf Coast winter travel',
    'Gulf Coast fall activities'
  ],
  openGraph: {
    title: 'Best Time to Visit Gulf Coast - Complete Seasonal Guide',
    description: 'Plan your perfect Gulf Coast vacation with our seasonal travel guide. Weather, activities, and optimal times for beaches, fishing, and family fun.',
    images: [
      {
        url: '/images/seo/gulf-coast-seasonal.jpg',
        width: 1200,
        height: 630,
        alt: 'Gulf Coast seasonal activities - spring beaches, summer fishing, fall festivals, winter birding',
      },
    ],
  },
};

export default function SeasonalPage() {
  const seasons = [
    {
      name: 'Spring (March - May)',
      description: 'Perfect weather, fewer crowds, ideal for families',
      weather: '70-80°F, low humidity',
      activities: ['Beach relaxation', 'Fishing charters', 'Golf courses', 'Spring festivals'],
      crowds: 'Moderate',
      bestFor: 'Families, couples, outdoor enthusiasts',
      color: 'bg-green-50 border-green-200',
      icon: '🌸'
    },
    {
      name: 'Summer (June - August)',
      description: 'Peak season with hot weather and beach activities',
      weather: '85-95°F, high humidity',
      activities: ['Water sports', 'Beach parties', 'Deep sea fishing', 'Water parks'],
      crowds: 'High',
      bestFor: 'Beach lovers, water sports enthusiasts',
      color: 'bg-blue-50 border-blue-200',
      icon: '☀️'
    },
    {
      name: 'Fall (September - November)',
      description: 'Hurricane season but great fishing and festivals',
      weather: '75-85°F, moderate humidity',
      activities: ['Fishing tournaments', 'Food festivals', 'Golf', 'Bird watching'],
      crowds: 'Low to Moderate',
      bestFor: 'Fishing enthusiasts, food lovers, golfers',
      color: 'bg-orange-50 border-orange-200',
      icon: '🍂'
    },
    {
      name: 'Winter (December - February)',
      description: 'Mild weather, great for fishing and birding',
      weather: '60-70°F, low humidity',
      activities: ['Deep sea fishing', 'Bird watching', 'Golf', 'Museums'],
      crowds: 'Low',
      bestFor: 'Fishing enthusiasts, snowbirds, golfers',
      color: 'bg-purple-50 border-purple-200',
      icon: '❄️'
    }
  ];

  return (
    <>
      {/* Structured Data for Seasonal Content */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Best Time to Visit Gulf Coast 2025 - Complete Seasonal Guide",
            "description": "Comprehensive guide to Gulf Coast seasonal travel, weather patterns, and optimal activities by month",
            "author": {
              "@type": "Organization",
              "name": "Gulf Coast Tourist Directory"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Gulf Coast Tourist Directory"
            },
            "datePublished": "2025-01-01",
            "dateModified": "2025-01-01",
            "mainEntityOfPage": "https://gulfcoastexplorer.com/seasonal"
          })
        }}
      />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=800&fit=crop&crop=center"
              alt="Gulf Coast seasonal activities throughout the year"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Best Time to Visit Gulf Coast
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8">
              Complete seasonal guide to Gulf Coast weather, activities, and optimal travel times. 
              Expert recommendations for every season from Texas to Florida.
            </p>
          </div>
        </section>

        {/* Seasonal Guide */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Gulf Coast Seasonal Travel Guide
                </h2>
                <p className="text-lg text-gray-600">
                  Plan your perfect Gulf Coast vacation with our month-by-month breakdown of weather, 
                  activities, crowds, and expert recommendations.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {seasons.map((season, index) => (
                  <div key={season.name} className={`${season.color} border-2 rounded-lg p-6`}>
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{season.icon}</span>
                      <h3 className="text-2xl font-bold text-gray-900">{season.name}</h3>
                    </div>
                    
                    <p className="text-gray-700 mb-4 font-medium">{season.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold text-gray-900">Weather: </span>
                        <span className="text-gray-700">{season.weather}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">Crowds: </span>
                        <span className="text-gray-700">{season.crowds}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">Best For: </span>
                        <span className="text-gray-700">{season.bestFor}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Top Activities:</h4>
                      <ul className="grid grid-cols-2 gap-1 text-sm text-gray-700">
                        {season.activities.map((activity, i) => (
                          <li key={i} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pro Tips Section */}
              <div className="mt-12 bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Expert Travel Tips</h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl mb-3">🏖️</div>
                    <h4 className="font-semibold text-gray-900 mb-2">Beach Season</h4>
                    <p className="text-sm text-gray-600">
                      March-May and September-November offer the best beach weather with comfortable temperatures and fewer crowds.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl mb-3">🎣</div>
                    <h4 className="font-semibold text-gray-900 mb-2">Fishing Season</h4>
                    <p className="text-sm text-gray-600">
                      Fall and winter provide the best fishing opportunities, especially for deep sea and offshore species.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl mb-3">💰</div>
                    <h4 className="font-semibold text-gray-900 mb-2">Budget Travel</h4>
                    <p className="text-sm text-gray-600">
                      Winter months offer the best deals on accommodations and activities, with 30-50% savings.
                    </p>
                  </div>
                </div>
              </div>

              {/* Hurricane Season Warning */}
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Hurricane Season (June 1 - November 30)</h4>
                <p className="text-yellow-700 text-sm">
                  While hurricanes are possible during this period, they're most common in August and September. 
                  Always check weather forecasts and have a backup plan. Many travelers find great deals during 
                  hurricane season with flexible cancellation policies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Plan Your Gulf Coast Trip?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Use our comprehensive directory to find the perfect accommodations, 
              activities, and dining for your chosen season.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors">
                Search Destinations
              </Link>
              <Link href="/states" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg transition-colors">
                Browse by State
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
