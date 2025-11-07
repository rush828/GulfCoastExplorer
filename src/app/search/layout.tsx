import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gulf Coast Tourist Directory - Search Hotels, Restaurants, Beaches & Attractions',
  description: 'Search our comprehensive Gulf Coast tourist directory with 500+ verified local businesses. Find restaurants, hotels, attractions, and services across Texas, Louisiana, Mississippi, Alabama, and Florida with detailed reviews and contact information.',
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
    'Gulf Coast Directory Search',
    'Gulf Coast Local Directory',
    'Gulf Coast Restaurant Directory',
    'Gulf Coast Hotel Directory',
    'Gulf Coast Attractions Directory',
    'Gulf Coast search',
    'Gulf Coast hotels',
    'Gulf Coast restaurants',
    'Gulf Coast beaches',
    'Gulf Coast fishing',
    'Gulf Coast attractions',
    'coastal destinations',
    'beach vacations',
    'coastal tourism',
    'Gulf Coast water sports',
    'Gulf Coast parasailing',
    'Gulf Coast surfing',
    'Gulf Coast jet ski rental',
    'Gulf Coast boat rental',
    'Gulf Coast fishing charters'
  ],
  openGraph: {
    title: 'Gulf Coast Tourist Directory - Search Hotels, Restaurants, Beaches & Attractions',
    description: 'Search our comprehensive Gulf Coast tourist directory with 500+ verified local businesses. Find restaurants, hotels, attractions, and services with detailed reviews.',
    url: 'https://gulfcoastexplorer.com/search',
    siteName: 'Gulf Coast Tourist Directory',
    images: [
      {
        url: '/images/og/gulf_coast_explorer_og.jpg',
        width: 1200,
        height: 630,
        alt: 'Search Gulf Coast destinations and attractions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gulf Coast Tourist Directory - Search Hotels, Restaurants, Beaches & Attractions',
    description: 'Search our comprehensive Gulf Coast tourist directory with 500+ verified local businesses. Find restaurants, hotels, attractions, and services with detailed reviews.',
    images: ['/images/og/gulf_coast_explorer_og.jpg'],
  },
  alternates: {
    canonical: '/search',
  },
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Structured Data for Search Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Search Gulf Coast Tourist Destinations - Hotels, Restaurants, Beaches & More",
            "description": "Search and discover the best Gulf Coast tourist destinations, hotels, restaurants, beaches, fishing charters, and tourist attractions across Texas, Louisiana, Mississippi, Alabama, and Florida.",
            "url": "https://gulfcoastexplorer.com/search",
            "mainEntity": {
              "@type": "WebSite",
              "name": "Gulf Coast Tourist Directory",
              "url": "https://gulfcoastexplorer.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://gulfcoastexplorer.com/search?q={search_term_string}&state={state}&category={category}",
                "query-input": [
                  "required name=search_term_string",
                  "optional name=state",
                  "optional name=category"
                ]
              }
            }
          })
        }}
      />
      {children}
    </>
  )
}
