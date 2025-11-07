import { Metadata } from 'next'
import Image from 'next/image'
import BusinessListingForm from '../../components/BusinessListingForm'

export const metadata: Metadata = {
  title: 'Business Listing - Gulf Coast Tourist Directory',
  description: 'Get your business listed in the Gulf Coast Tourist Directory. Choose between basic and featured listings with excellent SEO optimization.',
  keywords: [
    'Gulf Coast business listing',
    'business directory listing',
    'Gulf Coast tourism business',
    'coastal business directory',
    'business listing payment',
    'featured business listing'
  ],
  openGraph: {
    title: 'Business Listing - Gulf Coast Tourist Directory',
    description: 'Get your business listed in the Gulf Coast Tourist Directory. Choose between basic and featured listings with excellent SEO optimization.',
    url: 'https://gulfcoastdirectory.com/business-listing',
    siteName: 'Gulf Coast Tourist Directory',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Business Listing Gulf Coast Directory',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Listing - Gulf Coast Tourist Directory',
    description: 'Get your business listed in the Gulf Coast Tourist Directory. Choose between basic and featured listings with excellent SEO optimization.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/business-listing',
  },
}

export default function BusinessListingPage() {
  return (
    <>
      {/* Structured Data for Business Listing Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Business Listing - Gulf Coast Tourist Directory",
            "description": "Get your business listed in the Gulf Coast Tourist Directory with excellent SEO optimization",
            "url": "https://gulfcoastdirectory.com/business-listing",
            "mainEntity": {
              "@type": "Service",
              "name": "Business Directory Listing",
              "description": "Professional business listing services for Gulf Coast tourism businesses",
              "provider": {
                "@type": "Organization",
                "name": "Gulf Coast Tourist Directory"
              },
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Basic Business Listing",
                  "price": "149.00",
                  "priceCurrency": "USD",
                  "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "price": "149.00",
                    "priceCurrency": "USD",
                    "unitText": "year"
                  }
                },
                {
                  "@type": "Offer",
                  "name": "Featured Business Listing",
                  "price": "399.00",
                  "priceCurrency": "USD",
                  "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "price": "399.00",
                    "priceCurrency": "USD",
                    "unitText": "year"
                  }
                }
              ]
            }
          })
        }}
      />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section 
          className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12 sm:py-20 overflow-hidden"
          aria-labelledby="hero-heading"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=800&fit=crop&crop=center"
              alt="Beautiful Gulf Coast beach with turquoise waters, white sand, palm trees, and stunning sunset"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold mb-6">
              Get Your Business Listed
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Join the Gulf Coast Tourist Directory and connect with travelers. 
              Choose your listing level and start growing your business today.
            </p>
          </div>
        </section>

        {/* Pricing Section */}
        <section 
          className="py-16 px-4"
          aria-labelledby="pricing-heading"
        >
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-16">
              <h2 id="pricing-heading" className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Listing Level
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Select the perfect listing option for your business. All listings include excellent SEO optimization 
                and are designed to drive qualified traffic to your business.
              </p>
            </header>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Basic Listing */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
                                 <div className="text-center mb-8">
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Listing</h3>
                   <div className="text-4xl font-bold text-blue-600 mb-2">$149</div>
                   <div className="text-gray-600 mb-1">per year</div>
                   <div className="text-lg text-blue-500 font-semibold">Just $12.42/month</div>
                 </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Standard business profile</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>SEO-optimized listing</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Basic search visibility</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Annual renewal</span>
                  </li>
                </ul>

                                 <div className="text-center">
                   <button 
                     className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                   >
                     Select Basic Listing
                   </button>
                 </div>
              </div>

              {/* Featured Listing */}
              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-blue-500 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                
                                 <div className="text-center mb-8">
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Featured Listing</h3>
                   <div className="text-4xl font-bold text-blue-600 mb-2">$399</div>
                   <div className="text-gray-600 mb-1">per year</div>
                   <div className="text-lg text-blue-500 font-semibold">Just $33.25/month</div>
                 </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Everything in Basic, plus:</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Premium placement (top of results)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Enhanced profile with photos</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Featured on homepage & state pages</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Priority SEO optimization</span>
                  </li>
                </ul>

                                 <div className="text-center">
                   <button 
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                   >
                     Select Featured Listing
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Forms */}
        <section 
          className="py-16 px-4 bg-white"
          aria-labelledby="application-heading"
        >
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-16">
              <h2 id="application-heading" className="text-3xl font-bold text-gray-900 mb-4">
                Complete Your Application
              </h2>
              <p className="text-lg text-gray-600">
                Fill out the form below and complete payment to get your business listed.
              </p>
            </header>

            <BusinessListingForm />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Frequently Asked Questions
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  How long does it take to get listed?
                </h4>
                <p className="text-gray-600">
                  Basic listings are typically live within 24-48 hours. Featured listings may take 3-5 business days 
                  as we optimize your profile and placement.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Can I upgrade my listing later?
                </h4>
                <p className="text-gray-600">
                  Yes! You can upgrade from Basic to Featured at any time. We'll prorate the difference 
                  based on your remaining Basic listing time.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  What payment methods do you accept?
                </h4>
                                 <p className="text-gray-600">
                   We accept PayPal subscriptions for secure, convenient recurring payments. Your subscription 
                   automatically renews each year and you can cancel anytime through your PayPal account.
                 </p>
              </div>
                             <div className="bg-white rounded-lg shadow-md p-6">
                 <h4 className="font-semibold text-gray-900 mb-2">
                   Is there a setup fee?
                 </h4>
                 <p className="text-gray-600">
                   No setup fees! The annual price includes everything needed to get your business listed 
                   and optimized in our directory.
                 </p>
               </div>
               <div className="bg-white rounded-lg shadow-md p-6">
                 <h4 className="font-semibold text-gray-900 mb-2">
                   How do I cancel my subscription?
                 </h4>
                 <p className="text-gray-600">
                   You can cancel your subscription anytime through your PayPal account. Go to Settings → 
                   Payments → Manage pre-approved payments and cancel from there. No questions asked.
                 </p>
               </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
