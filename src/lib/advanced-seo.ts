/**
 * Advanced SEO Enhancement Library
 * Next-level SEO features for dominating search rankings
 */

// JSON-LD Schema Templates for Enhanced Rich Snippets
export const advancedSchemaTemplates = {
  
  // FAQ Schema for Enhanced SERP Features
  faqSchema: (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }),

  // How-To Schema for Process Pages
  howToSchema: (title: string, steps: Array<{ name: string; text: string }>) => ({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": `Complete guide: ${title}`,
    "image": "/images/how-to/gulf-coast-guide.jpg",
    "totalTime": "PT15M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Internet connection"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Web browser"
      }
    ],
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "image": `/images/steps/step-${index + 1}.jpg`
    }))
  }),

  // Enhanced LocalBusiness with detailed info
  enhancedLocalBusinessSchema: (business: any) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "description": business.description || `Premium ${business.category} in ${business.city}, ${business.state}. Highly rated Gulf Coast business with excellent customer service.`,
    "url": `https://gulfcoastexplorer.com/business/${business.id}`,
    "telephone": business.phone,
    "email": business.email,
    "image": [
      `/images/businesses/thumbnails/${business.id}.jpg`,
      `/images/businesses/gallery/${business.id}-1.jpg`,
      `/images/businesses/gallery/${business.id}-2.jpg`
    ],
    "logo": `/images/businesses/logos/${business.id}-logo.jpg`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address,
      "addressLocality": business.city,
      "addressRegion": business.state,
      "postalCode": business.zipCode,
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": business.latitude,
      "longitude": business.longitude
    },
    "openingHoursSpecification": business.hours ? [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification", 
        "dayOfWeek": ["Saturday", "Sunday"],
        "opens": "10:00",
        "closes": "16:00"
      }
    ] : undefined,
    "priceRange": business.priceRange || "$$",
    "currenciesAccepted": "USD",
    "paymentAccepted": "Cash, Credit Card, Debit Card",
    "aggregateRating": business.rating ? {
      "@type": "AggregateRating",
      "ratingValue": business.rating,
      "reviewCount": business.reviews_count || 1,
      "bestRating": 5,
      "worstRating": 1
    } : undefined,
    "review": business.reviews || [],
    "sameAs": [
      business.website,
      business.facebook,
      business.instagram,
      business.twitter
    ].filter(Boolean),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${business.name} Services`,
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": `${business.category} Services`,
            "description": `Professional ${business.category} services in ${business.city}`
          }
        }
      ]
    },
    "areaServed": {
      "@type": "City",
      "name": business.city,
      "containedInPlace": {
        "@type": "State",
        "name": business.state
      }
    }
  }),

  // Breadcrumb Schema for Navigation
  breadcrumbSchema: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://gulfcoastexplorer.com${item.url}`
    }))
  }),

  // Enhanced Website Schema with Search Action
  websiteSearchSchema: () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Gulf Coast Tourist Directory",
    "description": "The most comprehensive Gulf Coast business directory with 500+ verified local businesses",
    "url": "https://gulfcoastexplorer.com",
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://gulfcoastexplorer.com/search?q={search_term_string}&category={category}&city={city}&state={state}"
        },
        "query-input": [
          "required name=search_term_string",
          "name=category",
          "name=city", 
          "name=state"
        ]
      }
    ],
    "mainEntity": {
      "@type": "ItemList",
      "name": "Gulf Coast Business Categories",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Restaurants & Dining",
          "url": "https://gulfcoastexplorer.com/search?category=restaurant"
        },
        {
          "@type": "ListItem", 
          "position": 2,
          "name": "Hotels & Lodging",
          "url": "https://gulfcoastexplorer.com/search?category=lodging"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Water Sports & Activities",
          "url": "https://gulfcoastexplorer.com/search?category=water-activities"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Beaches & Outdoors",
          "url": "https://gulfcoastexplorer.com/search?category=beaches-outdoors"
        }
      ]
    }
  }),

  // Event Schema for Tourism Events
  eventSchema: (event: any) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.name,
    "description": event.description,
    "startDate": event.startDate,
    "endDate": event.endDate,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": event.venueName,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": event.address,
        "addressLocality": event.city,
        "addressRegion": event.state,
        "addressCountry": "US"
      }
    },
    "image": event.image,
    "organizer": {
      "@type": "Organization",
      "name": event.organizer,
      "url": event.organizerWebsite
    }
  })
}

// Advanced Meta Tag Generators
export const advancedMetaTags = {
  
  // Generate dynamic keywords based on content
  generateDynamicKeywords: (
    primaryCategory: string,
    city: string,
    state: string,
    businessCount: number
  ) => {
    const baseKeywords = [
      `${primaryCategory} ${city} ${state}`,
      `best ${primaryCategory} ${city}`,
      `top ${primaryCategory} Gulf Coast`,
      `${city} ${primaryCategory} directory`,
      `${state} ${primaryCategory} guide`,
      `Gulf Coast ${primaryCategory} reviews`,
      `${primaryCategory} near ${city}`,
      `${city} tourism ${primaryCategory}`,
      `${state} coastal ${primaryCategory}`,
      `Gulf Coast travel ${primaryCategory}`
    ]

    if (businessCount > 10) {
      baseKeywords.push(`${businessCount}+ ${primaryCategory} options ${city}`)
    }

    return baseKeywords
  },

  // Generate location-specific meta descriptions
  generateLocationDescription: (
    city: string,
    state: string,
    categories: string[],
    businessCount: number
  ) => {
    const topCategories = categories.slice(0, 3).join(', ')
    return `Discover ${businessCount}+ verified businesses in ${city}, ${state}. Find the best ${topCategories} and more in our comprehensive Gulf Coast directory with reviews and contact information.`
  },

  // Generate category-specific meta descriptions
  generateCategoryDescription: (
    category: string,
    locations: string[],
    businessCount: number
  ) => {
    const topLocations = locations.slice(0, 3).join(', ')
    return `Find the best ${category} across ${topLocations} and the entire Gulf Coast. Browse ${businessCount}+ verified ${category} businesses with reviews, photos, and contact details.`
  }
}

// Advanced Internal Linking Strategy
export const internalLinkingStrategy = {
  
  // Generate contextual internal links
  generateContextualLinks: (currentPage: {
    type: 'business' | 'category' | 'location' | 'home'
    category?: string
    city?: string
    state?: string
  }) => {
    const links: Array<{ text: string; url: string; relevance: number }> = []

    if (currentPage.type === 'business' && currentPage.category && currentPage.city) {
      links.push(
        {
          text: `More ${currentPage.category} in ${currentPage.city}`,
          url: `/search?category=${currentPage.category}&city=${currentPage.city}`,
          relevance: 10
        },
        {
          text: `${currentPage.city} Business Directory`,
          url: `/location/${currentPage.city.toLowerCase().replace(' ', '-')}`,
          relevance: 8
        },
        {
          text: `Gulf Coast ${currentPage.category} Guide`,
          url: `/category/${currentPage.category}`,
          relevance: 9
        }
      )
    }

    return links.sort((a, b) => b.relevance - a.relevance)
  },

  // Generate semantic anchor text variations
  generateAnchorTextVariations: (keyword: string) => [
    keyword,
    `best ${keyword}`,
    `top ${keyword}`,
    `${keyword} guide`,
    `${keyword} directory`,
    `find ${keyword}`,
    `${keyword} reviews`,
    `popular ${keyword}`,
    `${keyword} recommendations`,
    `${keyword} listings`
  ]
}

// Core Web Vitals and Performance SEO
export const performanceSEO = {
  
  // Generate preload hints for critical resources
  generatePreloadHints: (pageType: string) => {
    const hints = []

    // Critical fonts
    hints.push({
      rel: 'preload',
      href: '/fonts/inter-var.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    })

    // Critical images based on page type
    if (pageType === 'home') {
      hints.push({
        rel: 'preload',
        href: '/images/hero/gulf-coast-hero.webp',
        as: 'image',
        type: 'image/webp'
      })
    }

    return hints
  },

  // Generate resource hints for better performance
  generateResourceHints: () => [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//images.unsplash.com' },
    { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    { rel: 'preconnect', href: 'https://images.unsplash.com', crossOrigin: 'anonymous' }
  ]
}

// Advanced Schema Injection for Pages
export const injectAdvancedSchema = (
  schemaType: keyof typeof advancedSchemaTemplates,
  data: any
) => {
  if (typeof window !== 'undefined') {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    const schemaFunction = advancedSchemaTemplates[schemaType] as any
    script.textContent = JSON.stringify(schemaFunction(data))
    document.head.appendChild(script)
  }
}

// SEO Analytics and Monitoring
export const seoAnalytics = {
  
  // Track SEO-specific events
  trackSEOEvent: (eventType: string, data: any) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'seo_interaction', {
        event_category: 'SEO',
        event_label: eventType,
        custom_parameter_1: data.category || '',
        custom_parameter_2: data.location || '',
        value: data.position || 0
      })
    }
  },

  // Track SERP click-through rates
  trackSERPClick: (source: string, position: number, query: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'serp_click', {
        event_category: 'SERP',
        event_label: source,
        search_term: query,
        position: position,
        value: position
      })
    }
  },

  // Track internal link clicks for SEO value
  trackInternalLinkClick: (fromPage: string, toPage: string, anchorText: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'internal_link_click', {
        event_category: 'Internal Linking',
        event_label: `${fromPage} -> ${toPage}`,
        anchor_text: anchorText,
        from_page: fromPage,
        to_page: toPage
      })
    }
  }
}

// Local SEO Enhancements
export const localSEO = {
  
  // Generate local business hours schema
  generateBusinessHours: (hours: any) => {
    const dayMapping = {
      'monday': 'Monday',
      'tuesday': 'Tuesday', 
      'wednesday': 'Wednesday',
      'thursday': 'Thursday',
      'friday': 'Friday',
      'saturday': 'Saturday',
      'sunday': 'Sunday'
    }

    return Object.entries(hours).map(([day, times]: [string, any]) => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": (dayMapping as any)[day],
      "opens": times.open,
      "closes": times.close
    }))
  },

  // Generate local area served schema
  generateAreaServed: (city: string, state: string, radius?: number) => ({
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": "29.7604", // Will be dynamic based on city
      "longitude": "-95.3698"
    },
    "geoRadius": radius || 25000, // 25km default radius
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressRegion": state,
      "addressCountry": "US"
    }
  })
}

// Content Optimization Utilities
export const contentOptimization = {
  
  // Calculate content readability score
  calculateReadabilityScore: (text: string) => {
    const sentences = text.split(/[.!?]+/).length
    const words = text.split(/\s+/).length
    const syllables = text.split(/[aeiouAEIOU]/).length - 1
    
    // Flesch Reading Ease Score
    const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words))
    return Math.max(0, Math.min(100, score))
  },

  // Generate semantic keyword variations
  generateSemanticKeywords: (primaryKeyword: string) => {
    const synonyms = {
      'restaurant': ['dining', 'eatery', 'bistro', 'cafe', 'grill'],
      'hotel': ['lodging', 'accommodation', 'resort', 'inn', 'motel'],
      'beach': ['shore', 'coast', 'waterfront', 'seaside', 'oceanfront'],
      'activity': ['experience', 'attraction', 'adventure', 'tour', 'excursion']
    }

    const variations: string[] = []
    Object.entries(synonyms).forEach(([key, values]) => {
      if (primaryKeyword.toLowerCase().includes(key)) {
        values.forEach(synonym => {
          variations.push(primaryKeyword.replace(key, synonym))
        })
      }
    })

    return variations
  },

  // Optimize content for featured snippets
  optimizeForFeaturedSnippets: (content: string, questionType: 'what' | 'how' | 'where' | 'when' | 'why') => {
    const optimizationPatterns = {
      'what': 'A [term] is [definition]. [Additional context].',
      'how': 'To [action], follow these steps: 1. [step1] 2. [step2] 3. [step3]',
      'where': '[Location] is located [specific address/area]. [Additional details].',
      'when': '[Event/Activity] occurs [time/date]. [Additional timing info].',
      'why': '[Subject] is important because [reason]. [Supporting details].'
    }

    return {
      pattern: optimizationPatterns[questionType],
      wordCount: content.split(' ').length,
      hasNumberedList: /\d+\./.test(content),
      hasBulletPoints: /[•\-\*]/.test(content)
    }
  }
}
