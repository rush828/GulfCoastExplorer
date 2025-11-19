import { Metadata } from 'next'
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Gulf Coast Tourist Directory - Expert Travel Guide Since 2015',
  description: 'Learn about our mission to provide the most comprehensive Gulf Coast travel guide. Decades of expertise, 500+ verified businesses, and local recommendations you can trust.',
  keywords: [
    'about Gulf Coast directory',
    'Gulf Coast travel experts',
    'local travel recommendations',
    'Gulf Coast tourism guide',
    'verified business directory',
    'coastal travel expertise',
    'Gulf Coast local knowledge',
    'travel planning assistance'
  ],
  openGraph: {
    title: 'About Gulf Coast Tourist Directory - Your Trusted Travel Guide',
    description: 'Discover our story, mission, and commitment to providing the best Gulf Coast travel recommendations. Expert-curated since 2015.',
    images: [
      {
        url: '/images/seo/about-gulf-coast-directory-2025.jpg',
        width: 1200,
        height: 630,
        alt: 'Gulf Coast Tourist Directory team and mission - expert travel guidance',
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Structured Data for About Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Gulf Coast Tourist Directory",
            "description": "Learn about our mission to provide comprehensive Gulf Coast travel guidance",
            "url": "https://gulfcoastexplorer.com/about",
            "mainEntity": {
              "@type": "Organization",
              "name": "Gulf Coast Tourist Directory",
              "description": "Expert-curated travel guide for Gulf Coast destinations from Texas to Florida",
              "foundingDate": "2015",
              "url": "https://gulfcoastexplorer.com",
              "logo": "https://gulfcoastexplorer.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-800-GULF-COAST",
                "contactType": "customer service",
                "availableLanguage": "English"
              },
              "areaServed": [
                { "@type": "State", "name": "Texas" },
                { "@type": "State", "name": "Louisiana" },
                { "@type": "State", "name": "Mississippi" },
                { "@type": "State", "name": "Alabama" },
                { "@type": "State", "name": "Florida" }
              ],
              "knowsAbout": [
                "Gulf Coast tourism",
                "beach destinations",
                "fishing charters",
                "coastal accommodations",
                "seafood restaurants",
                "water sports",
                "family attractions"
              ]
            }
          })
        }}
      />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=800&fit=crop&crop=center"
              alt="Gulf Coast Tourist Directory team and mission"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Gulf Coast Tourist Directory
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8">
              Your trusted guide to Gulf Coast destinations since 2015. 
              Expert-curated recommendations from Texas to Florida.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Story
                </h2>
                <p className="text-lg text-gray-600">
                  Born from a passion for Gulf Coast travel and local expertise
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-6">
                  Founded in 2015, Gulf Coast Tourist Directory began as a passion project by local travel 
                  enthusiasts who wanted to share the hidden gems and best-kept secrets of the Gulf Coast 
                  region. What started as a small collection of personal recommendations has grown into 
                  the most comprehensive directory of Gulf Coast destinations, businesses, and attractions.
                </p>
                
                <p className="text-gray-700 mb-6">
                  Our team of local experts has spent decades exploring the Gulf Coast, 
                  from the pristine beaches of Destin, Florida, to the historic charm of Galveston, Texas. 
                  We curate and verify every destination we recommend through extensive research and local expertise, 
                  ensuring that our users get authentic, reliable information they can trust.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600">
                  To provide the most comprehensive and trustworthy Gulf Coast travel guidance
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Accuracy First</h3>
                  <p className="text-gray-600">
                    Every business and destination is personally verified by our local experts. 
                    We visit, review, and update information regularly to ensure accuracy.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Local Expertise</h3>
                  <p className="text-gray-600">
                    Our team lives and breathes Gulf Coast culture. We know the best fishing spots, 
                    hidden beaches, and local restaurants that tourists often miss.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl mb-4">💡</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">User-Focused</h3>
                  <p className="text-gray-600">
                    We design every feature with our users in mind. From mobile optimization to 
                    voice search compatibility, we make finding Gulf Coast destinations effortless.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Expertise */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Expertise
                </h2>
                <p className="text-lg text-gray-600">
                  What makes us the Gulf Coast travel authority
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Areas We Cover</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                      <strong>50+ Coastal Cities</strong> from Texas to Florida
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                      <strong>500+ Verified Businesses</strong> personally reviewed
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                      <strong>15+ Business Categories</strong> from fishing to fine dining
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                      <strong>Seasonal Travel Guidance</strong> year-round recommendations
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Our Process</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm mr-4 mt-1">1</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Discovery</h4>
                        <p className="text-gray-600 text-sm">We identify new businesses and destinations through local networks and user recommendations.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm mr-4 mt-1">2</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Verification</h4>
                        <p className="text-gray-600 text-sm">Our team verifies each location through research, local contacts, and quality checks.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm mr-4 mt-1">3</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Documentation</h4>
                        <p className="text-gray-600 text-sm">We create detailed profiles with photos, contact info, and expert insights.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm mr-4 mt-1">4</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Maintenance</h4>
                        <p className="text-gray-600 text-sm">Regular updates ensure information stays current and accurate.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Trusted by Thousands of Travelers
              </h2>
              
              <div className="grid md:grid-cols-4 gap-8 mb-12">
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">10+</div>
                  <div className="text-gray-600">Years of Expertise</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-600">Verified Businesses</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-gray-600">Coastal Cities</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                  <div className="text-gray-600">Locally Verified</div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Ready to Explore the Gulf Coast?
                </h3>
                <p className="text-gray-600 mb-6">
                  Start planning your perfect Gulf Coast vacation with our expert recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/search" className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 px-8 rounded-lg transition-colors">
                    Search Destinations
                  </Link>
                  <Link href="/contact" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
