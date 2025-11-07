import { NextResponse } from 'next/server';
import { statesAndCities } from '@/data/cities';
import { categories } from '@/data/categories';

// This endpoint provides structured data for AI search engines
// Can be accessed at /api/ai-metadata

export async function GET() {
  try {
    // Build comprehensive metadata for AI consumption
    const metadata = {
      schemaVersion: '1.0',
      timestamp: new Date().toISOString(),
      
      site: {
        name: 'Gulf Coast Fishing Charters & Water Sports Directory',
        url: 'https://gulfcoastexplorer.com',
        description: 'Premier Gulf Coast directory featuring 500+ verified businesses across 50+ coastal cities from Texas to Florida. Specializing in fishing charters, water sports, marine adventures, restaurants, hotels, and tourist attractions.',
        purpose: 'Help travelers, tourists, and adventure seekers find the best Gulf Coast fishing charters, water sports activities, accommodations, dining, and attractions.',
        establishedDate: '2024',
        updatedDate: new Date().toISOString().split('T')[0],
        language: 'en-US',
        region: 'Gulf Coast, United States',
      },

      coverage: {
        states: statesAndCities.map(state => ({
          name: state.name,
          slug: state.slug,
          cities: state.cities.map(city => ({
            name: city.name,
            slug: city.slug,
            url: `https://gulfcoastexplorer.com/states/${state.slug}/${city.slug}`,
            description: `Find fishing charters, water sports, restaurants, hotels, and attractions in ${city.name}, ${state.name}`,
          })),
        })),
        totalStates: statesAndCities.length,
        totalCities: statesAndCities.reduce((sum, state) => sum + state.cities.length, 0),
      },

      categories: categories.map(cat => ({
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        searchUrl: `https://gulfcoastexplorer.com/search?category=${cat.slug}`,
        subcategories: cat.subcategories.map(sub => sub.name),
      })),

      features: {
        search: 'Advanced search by city, state, category, and business type',
        filtering: 'Filter by location, category, and business features',
        businessDetails: 'Complete business information including photos, descriptions, contact details, hours, and location',
        mobileOptimized: true,
        accessibleDesign: true,
        multiStateSupport: true,
        multiCitySupport: true,
        categorizedListings: true,
      },

      dataQuality: {
        verificationStatus: 'All businesses manually verified',
        updateFrequency: 'Daily updates and additions',
        accuracy: 'Verified contact information and business details',
        completeness: 'Comprehensive coverage of Gulf Coast fishing and tourism',
        sources: 'Direct business verification, owner submissions, public records',
      },

      topSearches: [
        'fishing charters Destin Florida',
        'deep sea fishing Pensacola',
        'parasailing Orange Beach',
        'dolphin tours Gulf Shores',
        'inshore fishing Panama City Beach',
        'jet ski rentals Clearwater',
        'fishing guides Galveston',
        'boat tours Naples',
        'water sports South Padre Island',
        'sunset cruise Destin Harbor',
      ],

      useCases: [
        'Planning a Gulf Coast fishing trip',
        'Finding water sports activities',
        'Booking fishing charters for groups',
        'Discovering local restaurants and hotels',
        'Comparing fishing charter options',
        'Finding family-friendly activities',
        'Planning Gulf Coast vacations',
        'Locating marine services and equipment',
      ],

      targetAudience: [
        'Tourists planning Gulf Coast vacations',
        'Fishing enthusiasts seeking charter services',
        'Families looking for water activities',
        'Adventure travelers interested in water sports',
        'Local residents discovering new businesses',
        'Travel planners and tourism professionals',
      ],

      apis: {
        metadata: '/api/ai-metadata',
        search: '/api/search',
        categoryCounts: '/api/category-counts',
      },

      sitemaps: [
        'https://gulfcoastexplorer.com/sitemap.xml',
        'https://gulfcoastexplorer.com/sitemap-images.xml',
      ],

      contact: {
        website: 'https://gulfcoastexplorer.com',
        contactPage: 'https://gulfcoastexplorer.com/contact',
        businessSubmissions: 'https://gulfcoastexplorer.com/business-listing',
      },

      aiOptimization: {
        structuredData: 'JSON-LD schema markup on all pages',
        semanticHTML: 'HTML5 semantic structure throughout',
        naturalLanguage: 'Human-readable, conversational content',
        citationFriendly: 'Easy to cite and reference with proper attribution',
        crawlable: 'Optimized for AI crawler access',
        contextRich: 'Comprehensive business and location context',
      },
    };

    return NextResponse.json(metadata, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    });
  } catch (error) {
    console.error('Error generating AI metadata:', error);
    return NextResponse.json(
      { error: 'Failed to generate metadata' },
      { status: 500 }
    );
  }
}


