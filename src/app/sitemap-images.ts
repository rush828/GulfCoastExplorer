import { MetadataRoute } from 'next';
import { statesAndCities } from '../data/cities';

export default function sitemapImages(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gulfcoastdirectory.com';
  const currentDate = new Date();
  
  // Hero images for each state
  const stateImages = statesAndCities.map((state) => ({
    url: `${baseUrl}/images/states/${state.slug}/hero.jpg`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // City images for each destination
  const cityImages = statesAndCities.flatMap((state) =>
    state.cities.map((city) => ({
      url: `${baseUrl}/images/cities/${state.slug}/${city.slug}/hero.jpg`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  // Category-specific images
  const categoryImages = [
    {
      url: `${baseUrl}/images/seo/gulf-coast-beaches.jpg`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/images/seo/gulf-coast-fishing.jpg`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/images/seo/gulf-coast-hotels.jpg`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/images/seo/gulf-coast-restaurants.jpg`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
  ];

  // Open Graph images
  const ogImages = [
    {
      url: `${baseUrl}/og-image.jpg`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/images/seo/gulf-coast-hero.jpg`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 1.0,
    },
  ];

  return [
    ...ogImages,
    ...categoryImages,
    ...stateImages,
    ...cityImages,
  ];
}
