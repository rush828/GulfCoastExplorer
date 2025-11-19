import { MetadataRoute } from 'next';
import { statesAndCities } from '../data/cities';
import { categories } from '../data/categories';

// Helper function to escape XML entities in URLs
function escapeXmlUrl(url: string): string {
  return url.replace(/&/g, '&amp;');
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gulfcoastexplorer.com';
  const currentDate = new Date();
  
  // Static pages with high priority
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    // Fishing Charter Landing Pages - HIGHEST PRIORITY for SEO
    {
      url: `${baseUrl}/fishing-charters/orange-beach`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.98,
    },
    {
      url: `${baseUrl}/fishing-charters/pensacola`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.98,
    },
    {
      url: `${baseUrl}/fishing-charters/destin`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.98,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/states`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/business-listing`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // State pages with high priority
  const statePages = statesAndCities.map((state) => ({
    url: `${baseUrl}/states/${state.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // High-priority destination pages
  const premiumDestinations = [
    {
      url: `${baseUrl}/locations/orange-beach-alabama`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/locations/pensacola-florida`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/locations/destin-florida`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
  ];

  // City pages with medium-high priority
  const cityPages = statesAndCities.flatMap((state) =>
    state.cities.map((city) => ({
      url: `${baseUrl}/${state.slug}/${city.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  // Category pages with medium priority
  const categoryPages = categories.map((category) => ({
    url: escapeXmlUrl(`${baseUrl}/search?category=${category.slug}`),
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Subcategory pages with medium priority
  const subcategoryPages = categories.flatMap((category) =>
    (category.subcategories || []).map((sub) => ({
      url: escapeXmlUrl(`${baseUrl}/search?category=${category.slug}&subcategory=${sub.slug}`),
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))
  );

  // State-specific category pages (high value for SEO)
  const stateCategoryPages = statesAndCities.flatMap((state) =>
    categories.map((category) => ({
      url: escapeXmlUrl(`${baseUrl}/search?state=${state.slug}&category=${category.slug}`),
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  );

  // City-specific category pages (high value for local SEO)
  const cityCategoryPages = statesAndCities.flatMap((state) =>
    state.cities.flatMap((city) =>
      categories.map((category) => {
        // BOOST priority for fishing charter and water sports pages
        let priority = 0.6;
        if (category.slug === 'fishing-charter' || category.slug === 'water-activities') {
          priority = 0.9; // Higher priority for fishing and water sports
        }
        
        return {
          url: escapeXmlUrl(`${baseUrl}/search?city=${city.slug}&state=${state.slug}&category=${category.slug}`),
          lastModified: currentDate,
          changeFrequency: 'weekly' as const,
          priority: priority,
        };
      })
    )
  );

  // High-priority fishing charter and water sports search pages
  const fishingWaterSportsPages = [
    // Fishing charter searches for top destinations
    {
      url: escapeXmlUrl(`${baseUrl}/search?category=fishing-charter`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    {
      url: escapeXmlUrl(`${baseUrl}/search?state=florida&category=fishing-charter`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: escapeXmlUrl(`${baseUrl}/search?state=alabama&category=fishing-charter`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    // Water activities searches
    {
      url: escapeXmlUrl(`${baseUrl}/search?category=water-activities`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: escapeXmlUrl(`${baseUrl}/search?state=florida&category=water-activities`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
    {
      url: escapeXmlUrl(`${baseUrl}/search?state=alabama&category=water-activities`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
  ];

  // High-priority city + water sports combinations for local SEO  
  const cityWaterSportsPages = [
    // Top 3 destinations with highest priority
    {
      url: escapeXmlUrl(`${baseUrl}/search?city=orange-beach&state=alabama&category=fishing-charter`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.97,
    },
    {
      url: escapeXmlUrl(`${baseUrl}/search?city=pensacola&state=florida&category=fishing-charter`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.97,
    },
    {
      url: escapeXmlUrl(`${baseUrl}/search?city=destin&state=florida&category=fishing-charter`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.97,
    },
    // Other major fishing destinations
    {
      url: escapeXmlUrl(`${baseUrl}/search?city=gulf-shores&state=alabama&category=fishing-charter`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.92,
    },
    {
      url: escapeXmlUrl(`${baseUrl}/search?city=fort-walton-beach&state=florida&category=fishing-charter`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.92,
    },
    {
      url: escapeXmlUrl(`${baseUrl}/search?city=panama-city-beach&state=florida&category=fishing-charter`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: escapeXmlUrl(`${baseUrl}/search?city=galveston&state=texas&category=fishing-charter`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: escapeXmlUrl(`${baseUrl}/search?city=grand-isle&state=louisiana&category=fishing-charter`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.88,
    },
    {
      url: escapeXmlUrl(`${baseUrl}/search?city=biloxi&state=mississippi&category=fishing-charter`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.88,
    },
    {
      url: escapeXmlUrl(`${baseUrl}/search?city=south-padre-island&state=texas&category=fishing-charter`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
    // City + water activities combinations
    {
      url: escapeXmlUrl(`${baseUrl}/search?city=orange-beach&state=alabama&category=water-activities`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: escapeXmlUrl(`${baseUrl}/search?city=pensacola&state=florida&category=water-activities`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: escapeXmlUrl(`${baseUrl}/search?city=destin&state=florida&category=water-activities`),
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  return [
    ...staticPages,
    ...premiumDestinations,
    ...fishingWaterSportsPages,
    ...cityWaterSportsPages,
    ...statePages,
    ...cityPages,
    ...categoryPages,
    ...subcategoryPages,
    ...stateCategoryPages,
    ...cityCategoryPages,
  ];
}
