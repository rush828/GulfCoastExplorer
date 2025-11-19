import { Metadata } from 'next'
import Image from 'next/image'
import ContactForm from '../../components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us - Gulf Coast Tourist Directory',
  description: 'Get in touch with the Gulf Coast Tourist Directory team. We\'re here to help with questions, suggestions, or partnership opportunities.',
  keywords: [
    'contact Gulf Coast Tourist Directory',
    'Gulf Coast tourism contact',
    'Gulf Coast directory support',
    'tourism information contact',
    'Gulf Coast travel help'
  ],
  openGraph: {
    title: 'Contact Us - Gulf Coast Tourist Directory',
    description: 'Get in touch with the Gulf Coast Tourist Directory team. We\'re here to help with questions, suggestions, or partnership opportunities.',
    url: 'https://gulfcoastexplorer.com/contact',
    siteName: 'Gulf Coast Tourist Directory',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Gulf Coast Tourist Directory',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Gulf Coast Tourist Directory',
    description: 'Get in touch with the Gulf Coast Tourist Directory team. We\'re here to help with questions, suggestions, or partnership opportunities.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
  return (
    <>
      {/* Structured Data for Contact Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Contact Us - Gulf Coast Tourist Directory",
            "description": "Get in touch with the Gulf Coast Tourist Directory team for questions, suggestions, or partnership opportunities",
            "url": "https://gulfcoastexplorer.com/contact",
            "mainEntity": {
              "@type": "ContactPage",
              "name": "Contact Gulf Coast Tourist Directory",
              "description": "Contact information and form for Gulf Coast Tourist Directory",
              "mainEntity": {
                "@type": "Organization",
                "name": "Gulf Coast Tourist Directory",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "customer service",
                  "areaServed": "US"
                }
              }
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
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Gulf Coast business partnerships available. Our directory connects coastal businesses with travelers. 
              Interested in growing your business? Want to be featured on our "Featured Destinations" list? Let's talk.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section 
          className="py-16 px-4"
          aria-labelledby="contact-form-heading"
        >
          <div className="max-w-2xl mx-auto">
            <header className="text-center mb-8 sm:mb-12">
              <h2 id="contact-form-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Send Us a Message
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </header>

            <ContactForm />

            {/* Alternative Contact Methods */}
            <div className="mt-8 sm:mt-12 grid md:grid-cols-2 gap-4 sm:gap-8">
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 text-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Email Us</h3>
                <p className="text-sm sm:text-base text-gray-600">Use the contact form above</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 text-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Response Time</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-3">We typically respond within</p>
                <p className="text-green-600 font-medium text-sm sm:text-base">24-48 hours</p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12 sm:mt-16">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
                    How can I get my business featured in your directory?
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600">
                    It's easy! Use the contact form above and select "Business Listing Request" as your subject. 
                    We'll get back to you with details about our listing process.
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
                    Do you offer advertising opportunities?
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600">
                    Yes! We offer various advertising and partnership opportunities. 
                    Select "Partnership Opportunity" as your subject on our contact form above to learn more.
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
                    What does it mean to be featured on your "Featured Destinations" list?
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600">
                    Featured destinations receive premium placement with enhanced visibility, excellent SEO optimization, 
                    detailed business profiles, priority search results, and dedicated promotional sections. 
                    It's our highest-tier listing that maximizes your exposure to Gulf Coast travelers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
