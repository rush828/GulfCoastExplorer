import type { Metadata } from 'next';
import { Inter, Dancing_Script } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });
const dancingScript = Dancing_Script({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Gulf Coast Fishing Charters & Water Sports Directory - Deep Sea Fishing | Inshore Charters | Marine Adventures',
    template: '%s | Gulf Coast Fishing Charters & Water Sports'
  },
  description: 'Premier Gulf Coast Fishing Charters & Water Sports Directory - 500+ verified businesses across 50+ coastal cities from Texas to Florida. Book deep sea fishing, inshore charters, parasailing, jet ski rentals, boat tours, and water sports adventures with local experts.',
  keywords: [
    'Gulf Coast Fishing Charters',
    'Gulf Coast Deep Sea Fishing',
    'Gulf Coast Inshore Fishing',
    'Gulf Coast Water Sports',
    'Gulf Coast Fishing Charter Directory',
    'Gulf Coast Water Sports Directory',
    'Best Gulf Coast Fishing Charters',
    'Gulf Coast Charter Boat Fishing',
    'Gulf Coast Sport Fishing',
    'Gulf Coast Fishing Guides',
    'Gulf Coast Charter Fishing',
    'Gulf Coast Offshore Fishing',
    'Gulf Coast Nearshore Fishing',
    'Gulf Coast Bottom Fishing',
    'Gulf Coast Trolling Charters',
    'Gulf Coast Tourist Directory',
    'Gulf Coast Tourism Directory',
    'Gulf Coast Travel Directory',
    'Gulf Coast Tourist Guide',
    'Gulf Coast Vacation Directory',
    'Gulf Coast Travel Guide',
    'Gulf Coast Water Sports',
    'Gulf Coast Parasailing',
    'Gulf Coast Jet Ski Rental',
    'Gulf Coast Boat Tours',
    'Gulf Coast Boat Rental',
    'Gulf Coast Fishing Charters',
    'Gulf Coast Dolphin Tours',
    'Gulf Coast Sunset Cruises',
    'Gulf Coast Kayaking',
    'Gulf Coast Paddleboarding',
    'Gulf Coast Scuba Diving',
    'Gulf Coast Snorkeling',
    'Gulf Coast Sailing',
    'Gulf Coast Deep Sea Fishing',
    'Gulf Coast Inshore Fishing',
    'Gulf Coast Water Activities',
    'Gulf Coast Marine Activities',
    'Gulf Coast Ocean Sports',
    'Gulf Coast Coastal Activities',
    'Gulf Coast Directory',
    'Gulf Coast Business Directory',
    'Gulf Coast',
    'Gulf Coast tourism',
    'Gulf Coast vacation',
    'coastal destinations',
    'beach vacations',
    'coastal cities',
    'beach hotels',
    'seafood restaurants',
    'fishing charters',
    'coastal attractions',
    'Gulf Coast travel',
    'beach resorts',
    'coastal activities',
    'Gulf Coast water sports',
    'Gulf Coast parasailing',
    'Gulf Coast surfing',
    'Gulf Coast jet ski rental',
    'Gulf Coast boat rental',
    'Gulf Coast kayaking',
    'Gulf Coast paddleboarding',
    'Gulf Coast scuba diving',
    'Gulf Coast snorkeling',
    'Gulf Coast sailing',
    'Gulf Coast deep sea fishing',
    'Gulf Coast inshore fishing',
    'Florida Gulf Coast water sports',
    'Florida Gulf Coast parasailing',
    'Florida Gulf Coast surfing',
    'Florida Gulf Coast jet ski rental',
    'Florida Gulf Coast boat rental',
    'Texas Gulf Coast water sports',
    'Texas Gulf Coast fishing',
    'Texas Gulf Coast parasailing',
    'Louisiana Gulf Coast fishing',
    'Louisiana Gulf Coast boat rental',
    'Mississippi Gulf Coast water sports',
    'Mississippi Gulf Coast fishing',
    'Alabama Gulf Coast water sports',
    'Alabama Gulf Coast parasailing',
    'Alabama Gulf Coast surfing',
    'Destin water sports',
    'Destin parasailing',
    'Destin jet ski rental',
    'Panama City Beach water sports',
    'Panama City Beach parasailing',
    'Panama City Beach surfing',
    'Galveston water sports',
    'Galveston fishing',
    'Galveston boat rental',
    'Corpus Christi water sports',
    'Corpus Christi surfing',
    'Corpus Christi fishing',
    'Gulf Shores water sports',
    'Gulf Shores parasailing',
    'Gulf Shores surfing',
    'Orange Beach water sports',
    'Orange Beach parasailing',
    'Orange Beach jet ski rental',
    'Biloxi water sports',
    'Biloxi fishing',
    'Biloxi boat rental',
    'Gulfport water sports',
    'Gulfport fishing',
    'Grand Isle water sports',
    'Grand Isle fishing',
    'Grand Isle boat rental',
    'Texas Gulf Coast',
    'Louisiana Gulf Coast',
    'Mississippi Gulf Coast',
    'Alabama Gulf Coast',
    'Florida Gulf Coast'
  ],
  authors: [{ name: 'Gulf Coast Tourist Directory' }],
  creator: 'Gulf Coast Tourist Directory',
  publisher: 'Gulf Coast Tourist Directory',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://gulfcoastexplorer.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gulfcoastexplorer.com',
    title: 'Gulf Coast Fishing Charters & Water Sports Directory - Premier Coastal Adventures',
    description: 'Premier Gulf Coast fishing charters and water sports directory. Book deep sea fishing, inshore charters, parasailing, jet ski rentals, and water sports across 50+ coastal cities from Texas to Florida.',
    siteName: 'Gulf Coast Fishing Charters & Water Sports Directory',
    images: [
      {
        url: '/images/og/gulf_coast_explorer_og.jpg',
        width: 1200,
        height: 630,
        alt: 'Gulf Coast Fishing Charters & Water Sports Directory - Premier fishing and water sports adventures from Texas to Florida',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gulf Coast Fishing Charters & Water Sports Directory - Premier Coastal Adventures',
    description: 'Premier Gulf Coast fishing charters and water sports directory. Book deep sea fishing, inshore charters, parasailing, jet ski rentals, and water sports across 50+ coastal cities.',
    images: ['/images/og/gulf_coast_explorer_og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'travel',
  classification: 'tourism',
  other: {
    'geo.region': 'US',
    'geo.placename': 'Gulf Coast',
    'geo.position': '29.7604;-95.3698',
    'ICBM': '29.7604, -95.3698',
    'google-adsense-account': 'ca-pub-8279188739485299',
    // AI Search Engine Optimization
    'ai-content-declaration': 'original-human-created',
    'ai-indexing': 'allowed',
    'perplexity-indexing': 'allowed',
    'openai-indexing': 'allowed',
    'anthropic-indexing': 'allowed',
    'google-extended': 'allowed',
    'data-quality': 'verified',
    'content-freshness': 'daily-updated',
    'ai-metadata': 'https://gulfcoastexplorer.com/.well-known/ai.json',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8279188739485299"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "Gulf Coast Fishing Charters & Water Sports Directory",
              "description": "Premier Gulf Coast fishing charters and water sports directory featuring 500+ verified marine recreation businesses across 50+ coastal cities from Texas to Florida. Specializing in deep sea fishing, inshore fishing charters, parasailing, jet ski rentals, boat tours, and water sports adventures.",
              "url": "https://gulfcoastexplorer.com",
              "logo": "https://gulfcoastdirectory.com/logo.png",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US",
                "addressRegion": "Gulf Coast"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "areaServed": "US"
              },
              "areaServed": [
                {
                  "@type": "State",
                  "name": "Texas",
                  "description": "Gulf Coast region of Texas"
                },
                {
                  "@type": "State", 
                  "name": "Louisiana",
                  "description": "Gulf Coast region of Louisiana"
                },
                {
                  "@type": "State",
                  "name": "Mississippi", 
                  "description": "Gulf Coast region of Mississippi"
                },
                {
                  "@type": "State",
                  "name": "Alabama",
                  "description": "Gulf Coast region of Alabama"
                },
                {
                  "@type": "State",
                  "name": "Florida",
                  "description": "Gulf Coast region of Florida"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/gulfcoastdirectory",
                "https://www.twitter.com/gulfcoastdir",
                "https://www.instagram.com/gulfcoastdirectory"
              ]
            })
          }}
        />
        
        {/* Additional Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Gulf Coast Tourist Directory",
              "description": "The Gulf Coast's most comprehensive tourist directory featuring 500+ verified local businesses across 50+ coastal cities from Texas to Florida",
              "url": "https://gulfcoastexplorer.com",
              "telephone": "+1-800-GULF-COAST",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US",
                "addressRegion": "Gulf Coast"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "29.7604",
                "longitude": "-95.3698"
              },
              "openingHours": "Mo-Su 00:00-23:59",
              "priceRange": "$$",
              "areaServed": [
                "Texas Gulf Coast",
                "Louisiana Gulf Coast", 
                "Mississippi Gulf Coast",
                "Alabama Gulf Coast",
                "Florida Gulf Coast"
              ]
            })
          }}
        />

        {/* Enhanced Structured Data for WebPage with Breadcrumbs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Gulf Coast Tourist Directory",
              "description": "The Gulf Coast's most comprehensive tourist directory featuring 500+ verified local businesses across 50+ coastal cities from Texas to Florida",
              "url": "https://gulfcoastexplorer.com",
              "mainEntity": {
                "@type": "WebSite",
                "name": "Gulf Coast Tourist Directory",
                "url": "https://gulfcoastexplorer.com",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://gulfcoastexplorer.com/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://gulfcoastexplorer.com"
                  }
                ]
              }
            })
          }}
        />

        {/* Additional Structured Data for Tourism Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TouristInformationCenter",
              "name": "Gulf Coast Tourist Directory",
              "description": "The Gulf Coast's most comprehensive tourist directory featuring 500+ verified local businesses across 50+ coastal cities from Texas to Florida",
              "url": "https://gulfcoastexplorer.com",
              "telephone": "+1-800-GULF-COAST",
              // Email removed for security - use contact form instead
              "address": {
                "@type": "PostalAddress",
                "addressRegion": "Gulf Coast",
                "addressCountry": "US"
              },
              "serviceArea": [
                {
                  "@type": "State",
                  "name": "Texas"
                },
                {
                  "@type": "State",
                  "name": "Louisiana"
                },
                {
                  "@type": "State",
                  "name": "Mississippi"
                },
                {
                  "@type": "State",
                  "name": "Alabama"
                },
                {
                  "@type": "State",
                  "name": "Florida"
                }
              ],
              "knowsAbout": [
                "Gulf Coast tourism",
                "beach vacations",
                "fishing charters",
                "coastal accommodations",
                "seafood restaurants",
                "water sports",
                "family attractions"
              ]
            })
          }}
        />

        {/* FAQ Schema for Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is the Gulf Coast Tourist Directory?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The Gulf Coast Tourist Directory is the most comprehensive tourist directory featuring 500+ verified local businesses across 50+ coastal cities from Texas to Florida. We help travelers find the best restaurants, hotels, attractions, fishing charters, and water sports activities."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What states does the Gulf Coast Tourist Directory cover?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We cover all five Gulf Coast states: Texas, Louisiana, Mississippi, Alabama, and Florida. Our directory includes major coastal cities like Destin, Panama City Beach, Gulf Shores, Galveston, Corpus Christi, and many more."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What types of businesses are listed in the Gulf Coast Directory?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our directory includes restaurants, hotels, fishing charters, boat tours, parasailing companies, jet ski rentals, beach resorts, attractions, shopping centers, and other tourism-related businesses across the Gulf Coast region."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do I find the best fishing charters on the Gulf Coast?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Use our search function to filter by 'fishing charter' category and select your preferred state or city. We feature verified fishing charters with detailed information about services, pricing, and customer reviews to help you choose the best option."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What are the best water sports activities on the Gulf Coast?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The Gulf Coast offers parasailing, jet ski rentals, boat tours, kayaking, paddleboarding, scuba diving, snorkeling, sailing, and fishing. Our directory helps you find reputable water sports providers with safety certifications and excellent customer reviews."
                  }
                }
              ]
            })
          }}
        />

        {/* Review and Rating Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AggregateRating",
              "itemReviewed": {
                "@type": "WebSite",
                "name": "Gulf Coast Tourist Directory",
                "url": "https://gulfcoastdirectory.com"
              },
              "ratingValue": "4.8",
              "reviewCount": "500",
              "bestRating": "5",
              "worstRating": "1"
            })
          }}
        />

        {/* Enhanced Google Analytics 4 */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-BS586J74XZ`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              // Enhanced GA4 Configuration
              gtag('config', 'G-BS586J74XZ', {
                page_title: document.title,
                page_location: window.location.href,
                send_page_view: true,
                
                // Enhanced ecommerce and measurement
                allow_google_signals: true,
                allow_ad_personalization_signals: true,
                cookie_expires: 60 * 60 * 24 * 365, // 1 year
                
                // Custom dimensions
                custom_map: {
                  'custom_parameter_1': 'business_category',
                  'custom_parameter_2': 'search_location', 
                  'custom_parameter_3': 'subscription_plan'
                },
                
                // Enhanced measurement settings
                enhanced_measurement_settings: {
                  scroll_events: true,
                  outbound_clicks: true,
                  site_search: true,
                  video_engagement: true,
                  file_downloads: true
                }
              });
              
              // Track initial page performance
              window.addEventListener('load', function() {
                if (window.performance) {
                  const navigation = performance.getEntriesByType('navigation')[0];
                  if (navigation) {
                    gtag('event', 'page_load_time', {
                      event_category: 'Performance',
                      event_label: window.location.pathname,
                      value: Math.round(navigation.loadEventEnd - navigation.fetchStart)
                    });
                  }
                }
              });
            `,
          }}
        />
        
        {/* Core Web Vitals Optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" />
        
        {/* Additional DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Preload critical images */}
        <link rel="preload" href="/images/states/florida/hero.jpg" as="image" type="image/jpeg" />
        
        {/* Resource hints for better performance */}
        <link rel="prefetch" href="/search" />
        <link rel="prefetch" href="/fishing-charters" />
        
        {/* SEO enhancement links */}
        <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="Gulf Coast Directory Search" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Resource Hints for Performance */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//maps.googleapis.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        
        {/* Additional meta tags for better SEO */}
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Gulf Coast Tourist Directory" />
        <meta name="application-name" content="Gulf Coast Tourist Directory" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Performance and SEO optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Preload critical resources */}
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//maps.googleapis.com" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        
        {/* Social media and sharing optimizations */}
        <meta property="og:site_name" content="Gulf Coast Tourist Directory" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="en" />
        
        {/* Twitter Card optimizations */}
        <meta name="twitter:site" content="@gulfcoastdir" />
        <meta name="twitter:creator" content="@gulfcoastdir" />
        
        {/* Additional SEO meta tags */}
        <meta name="author" content="Gulf Coast Tourist Directory" />
        <meta name="copyright" content="Gulf Coast Tourist Directory" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Enhanced social media and sharing */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Gulf Coast Tourist Directory - Beautiful coastal destinations" />
        
        {/* Twitter Card enhancements */}
        <meta name="twitter:image:alt" content="Gulf Coast Tourist Directory - Beautiful coastal destinations" />
        
        {/* Additional business and location SEO */}
        <meta name="geo.country" content="US" />
        <meta name="geo.region" content="US-TX,US-LA,US-MS,US-AL,US-FL" />
        <meta name="geo.placename" content="Gulf Coast, Texas, Louisiana, Mississippi, Alabama, Florida" />
        
        {/* Content and language optimizations */}
        <meta name="language" content="English" />
        <meta name="content-language" content="en" />
        <meta name="content-type" content="text/html; charset=utf-8" />
        <meta name="content-script-type" content="text/javascript" />
        <meta name="content-style-type" content="text/css" />
        
        {/* Mobile and performance optimizations */}
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Security and verification */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        
        {/* Additional mobile app optimization */}
        <meta name="apple-mobile-web-app-title" content="Gulf Coast Directory" />
        <meta name="application-name" content="Gulf Coast Directory" />
        
        {/* Enhanced SEO tags */}
        <meta name="subject" content="Gulf Coast Tourism and Water Sports Directory" />
        <meta name="abstract" content="Complete directory of Gulf Coast businesses specializing in water sports, fishing charters, and coastal tourism from Texas to Florida." />
        <meta name="summary" content="Premier Gulf Coast business directory featuring verified water sports companies, fishing charters, restaurants, hotels, and attractions across 50+ coastal cities." />
        
        {/* Additional business information */}
        <meta name="business:contact_data:street_address" content="Gulf Coast" />
        <meta name="business:contact_data:locality" content="Gulf Coast" />
        <meta name="business:contact_data:region" content="Gulf Coast" />
        <meta name="business:contact_data:postal_code" content="00000" />
        <meta name="business:contact_data:country_name" content="United States" />
        <meta name="business:contact_data:phone_number" content="+1-800-GULF-COAST" />
        {/* Email removed for security - use contact form instead */}
        <meta name="business:contact_data:website" content="https://gulfcoastexplorer.com" />
        
        {/* Additional SEO meta tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="slurp" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Enhanced search engine directives */}
        <meta name="crawldelay" content="1" />
        <meta name="revisit" content="7 days" />
        <meta name="spiders" content="all" />
        <meta name="webcrawlers" content="all" />
        
        {/* Additional structured data for better SEO */}
        <meta name="generator" content="Next.js" />
        <meta name="build" content="2024" />
        <meta name="version" content="1.0" />
        
        {/* Local business and location SEO */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="Gulf Coast" />
        <meta name="geo.position" content="29.7604;-95.3698" />
        <meta name="ICBM" content="29.7604, -95.3698" />
        
        {/* Business and organization SEO */}
        <meta name="business:contact_data:street_address" content="Gulf Coast" />
        <meta name="business:contact_data:locality" content="Gulf Coast" />
        <meta name="business:contact_data:region" content="Gulf Coast" />
        <meta name="business:contact_data:postal_code" content="00000" />
        <meta name="business:contact_data:country_name" content="United States" />
        <meta name="business:contact_data:phone_number" content="+1-XXX-XXX-XXXX" />
        
        {/* Content and language optimizations */}
        <meta name="language" content="English" />
        <meta name="content-language" content="en" />
        <meta name="content-type" content="text/html; charset=utf-8" />
        
        {/* Mobile and performance optimizations */}
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <Header />
          <main role="main">{children}</main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
