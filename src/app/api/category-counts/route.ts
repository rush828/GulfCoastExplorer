import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

// Force this route to be dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const state = searchParams.get('state');

    // Build where clause with case-insensitive matching
    const where: any = {
      status: 'PUBLISHED'
    }
    
    if (city) {
      where.city = {
        equals: city,
        mode: 'insensitive'
      }
    }
    if (state) {
      where.state = {
        equals: state,
        mode: 'insensitive'
      }
    }

    // Fetch businesses from database
    const businesses = await prisma.listing.findMany({
      where,
      select: {
        primaryCategory: true
      }
    })
    
    // Count businesses by category
    if (businesses.length > 0) {
      // Now count businesses for each category using the EXACT same logic as search API
      // NOTE: These keys must match the slugs used in the city page categories
      const counts = {
        'lodging': 0,
        'food-dining': 0,
        'beaches-outdoors': 0,
        'water-activities': 0,
        'shopping_mall': 0,
        'nightlife-entertainment': 0,
        'historic_landmark': 0,
        'tour_agency': 0,
        'spa_fitness': 0,
        'golf_course': 0,
        'car_rental': 0,
        'liquor_store': 0
      };

      // Count businesses for each category directly (no internal API calls)
      const categorySlugs = Object.keys(counts) as Array<keyof typeof counts>;
      
      for (const categorySlug of categorySlugs) {
        let categoryCount = 0;
        
        // Define category mappings for counting - use actual data format
        const categoryMappings: { [key: string]: string[] } = {
          'lodging': ['accommodations', 'lodging'],
          'food-dining': ['restaurant', 'coffee_shop', 'seafood_market', 'food-dining', 'cafe', 'ice_cream', 'winery_brewery'], // Count all food-related businesses
          'beaches-outdoors': ['beach', 'water_sport', 'marina', 'park_recreation'],
          'water-activities': ['water-activities', 'boat_tour', 'fishing_charter', 'scuba_diving', 'surf_shop', 'marina'],
          'shopping_mall': ['shopping_mall', 'store', 'clothing_store', 'shopping'], // Count all retail/shopping businesses
          'nightlife-entertainment': ['bar', 'music_venue', 'nightclub', 'entertainment'],
          'historic_landmark': ['historic_landmark'],
          'tour_agency': ['tour_agency'],
          'spa_fitness': ['spa_fitness'],
          'golf_course': ['golf_course'],
          'car_rental': ['car_rental'],
          'liquor_store': ['liquor_store']
        };
        
        const categoriesToMatch = categoryMappings[categorySlug] || [categorySlug];
        
        categoryCount = businesses.filter((business) => {
          const primaryCategory = business.primaryCategory?.toLowerCase().trim();
          
          // Check if primary category matches
          if (primaryCategory && categoriesToMatch.includes(primaryCategory)) {
            return true;
          }
          
          return false;
        }).length;
        
        counts[categorySlug] = categoryCount;
      }

      return NextResponse.json({
        success: true,
        counts: counts,
        total: businesses.length,
        city: city || null,
        state: state || null,
        timestamp: new Date().toISOString()
      });
    }

      return NextResponse.json({
        success: true,
      counts: {},
      total: 0,
      city: city || null,
      state: state || null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Category counts API error:', error);
    return NextResponse.json(
      { 
      success: false,
        error: 'Failed to fetch category counts',
        counts: {},
        total: 0
      },
      { status: 500 }
    );
  }
}