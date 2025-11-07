import { Metadata } from 'next'
import { advancedSchemaTemplates } from '@/lib/advanced-seo'

export const metadata: Metadata = {
  title: 'Gulf Coast Directory FAQ - Your Questions Answered | Travel Guide',
  description: 'Get answers to frequently asked questions about Gulf Coast tourism, businesses, activities, and travel planning. Expert advice for your perfect coastal vacation.',
  keywords: [
    'Gulf Coast FAQ',
    'Gulf Coast travel questions',
    'Gulf Coast tourism help',
    'coastal vacation planning',
    'Gulf Coast business questions',
    'beach vacation FAQ',
    'Gulf Coast travel guide questions',
    'coastal activities FAQ',
    'Gulf Coast dining questions',
    'beach accommodations FAQ'
  ],
  openGraph: {
    title: 'Gulf Coast Directory FAQ - Your Questions Answered',
    description: 'Get answers to frequently asked questions about Gulf Coast tourism, businesses, activities, and travel planning.',
    type: 'website',
    url: 'https://gulfcoastexplorer.com/faq',
    images: [
      {
        url: '/images/og/gulf-coast-faq.jpg',
        width: 1200,
        height: 630,
        alt: 'Gulf Coast FAQ - Answers to your travel questions'
      }
    ]
  }
}

const faqData = [
  {
    question: "What is the Gulf Coast Directory?",
    answer: "The Gulf Coast Directory is the most comprehensive online business directory for Gulf Coast destinations, featuring over 500+ verified local businesses across Texas, Louisiana, Mississippi, Alabama, and Florida. We provide detailed information about restaurants, hotels, attractions, water sports, and services to help tourists and locals find exactly what they need."
  },
  {
    question: "How do I find the best restaurants on the Gulf Coast?",
    answer: "To find the best restaurants on the Gulf Coast, use our search function to filter by 'restaurant' category and select your preferred city or state. You can also sort by rating to see the highest-rated dining establishments. Our directory includes detailed information about cuisine types, price ranges, and customer reviews to help you make the perfect choice."
  },
  {
    question: "What are the top water sports activities on the Gulf Coast?",
    answer: "The Gulf Coast offers incredible water sports including parasailing, jet ski rentals, boat tours, kayaking, paddleboarding, scuba diving, snorkeling, sailing, and fishing charters. Our directory features verified water sports providers with safety certifications, equipment details, and customer reviews to help you choose the best activities for your skill level."
  },
  {
    question: "How do I book accommodations through the Gulf Coast Directory?",
    answer: "While the Gulf Coast Directory provides comprehensive information about hotels, resorts, vacation rentals, and bed & breakfasts, you'll need to contact the properties directly to make reservations. We provide phone numbers, websites, and direct booking links for each accommodation to make your reservation process as easy as possible."
  },
  {
    question: "What cities are covered in the Gulf Coast Directory?",
    answer: "Our directory covers 50+ coastal cities across five states: Texas (Galveston, South Padre Island, Corpus Christi), Louisiana (New Orleans, Baton Rouge), Mississippi (Biloxi, Gulfport), Alabama (Gulf Shores, Mobile), and Florida (Pensacola, Destin, Panama City Beach, Naples, and many more). Each city page features local businesses, attractions, and travel information."
  },
  {
    question: "How can I verify if a business is legitimate?",
    answer: "All businesses in our directory go through a verification process. Look for verified badges, read customer reviews, check their official websites, and call directly to confirm services and pricing. We also provide business addresses, phone numbers, and operating hours to help you verify legitimacy before visiting."
  },
  {
    question: "What's the best time to visit the Gulf Coast?",
    answer: "The Gulf Coast is beautiful year-round, but the best time depends on your preferences. Spring (March-May) and Fall (September-November) offer mild temperatures and fewer crowds. Summer (June-August) is peak season with hot weather perfect for water activities. Winter (December-February) offers cooler temperatures and the lowest prices."
  },
  {
    question: "How do I find family-friendly activities on the Gulf Coast?",
    answer: "Search our directory using the 'family-friendly' filter or browse categories like 'attractions,' 'beaches,' 'parks and recreation,' and 'entertainment.' Many listings include age recommendations and family amenities. Popular family activities include beach visits, aquariums, mini golf, boat tours, and nature centers."
  },
  {
    question: "Can I add my business to the Gulf Coast Directory?",
    answer: "Yes! We offer business listing packages starting at $149/year for basic listings and $399/year for featured listings. Featured listings include enhanced visibility, premium placement, and additional promotional benefits. Visit our business listing page to learn more and submit your information."
  },
  {
    question: "How often is the business information updated?",
    answer: "We continuously update our business information through automated systems and manual verification. Business owners can update their information anytime, and we encourage customers to report any outdated information. Our goal is to maintain 95%+ accuracy across all listings."
  },
  {
    question: "What payment methods do Gulf Coast businesses typically accept?",
    answer: "Most Gulf Coast businesses accept major credit cards (Visa, Mastercard, American Express, Discover), debit cards, and cash. Many also accept mobile payments like Apple Pay and Google Pay. For specific payment options, check individual business listings or call ahead to confirm."
  },
  {
    question: "How do I report incorrect business information?",
    answer: "If you find incorrect information in our directory, please contact us immediately through our contact form. Include the business name, incorrect information, and the correct details if known. We typically update corrected information within 24-48 hours."
  }
]

export default function FAQPage() {
  return (
    <>
      {/* Enhanced FAQ Schema for Featured Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(advancedSchemaTemplates.faqSchema(faqData))
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(advancedSchemaTemplates.breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "FAQ", url: "/faq" }
          ]))
        }}
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get answers to the most common questions about Gulf Coast tourism, 
              businesses, and travel planning. Find everything you need for your perfect coastal vacation.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <a href="#directory-basics" className="text-blue-600 hover:text-blue-800">Directory Basics</a>
              <a href="#finding-businesses" className="text-blue-600 hover:text-blue-800">Finding Businesses</a>
              <a href="#travel-planning" className="text-blue-600 hover:text-blue-800">Travel Planning</a>
              <a href="#business-owners" className="text-blue-600 hover:text-blue-800">Business Owners</a>
              <a href="#technical-support" className="text-blue-600 hover:text-blue-800">Technical Support</a>
              <a href="#contact-info" className="text-blue-600 hover:text-blue-800">Contact Information</a>
            </div>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            
            {/* Directory Basics */}
            <section id="directory-basics" className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Directory Basics</h2>
              <div className="space-y-6">
                {faqData.slice(0, 3).map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Finding Businesses */}
            <section id="finding-businesses" className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Finding Businesses & Services</h2>
              <div className="space-y-6">
                {faqData.slice(3, 6).map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Travel Planning */}
            <section id="travel-planning" className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Travel Planning & Tips</h2>
              <div className="space-y-6">
                {faqData.slice(6, 9).map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Business Owners & Technical */}
            <section id="business-owners" className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Owners & Technical Support</h2>
              <div className="space-y-6">
                {faqData.slice(9, 12).map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Contact Section */}
          <section id="contact-info" className="bg-blue-50 rounded-lg p-8 mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our team is here to help you plan 
              the perfect Gulf Coast experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/search"
                className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
              >
                Search Directory
              </a>
            </div>
          </section>

          {/* Related Resources */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Helpful Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Travel Guides</h3>
                <p className="text-gray-600 mb-4">Comprehensive guides for each Gulf Coast destination.</p>
                <a href="/guides" className="text-blue-600 hover:text-blue-800 font-medium">
                  Browse Guides →
                </a>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Directory</h3>
                <p className="text-gray-600 mb-4">Search 500+ verified Gulf Coast businesses.</p>
                <a href="/search" className="text-blue-600 hover:text-blue-800 font-medium">
                  Start Searching →
                </a>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">List Your Business</h3>
                <p className="text-gray-600 mb-4">Get your business featured in our directory.</p>
                <a href="/business-listing" className="text-blue-600 hover:text-blue-800 font-medium">
                  Learn More →
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}
