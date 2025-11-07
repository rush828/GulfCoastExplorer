import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const state = searchParams.get('state');

    // Read the data
    const existingDataFile = path.join(process.cwd(), 'data', 'businesses-from-excel-corrected-ids.json');
    const existingContent = await fs.readFile(existingDataFile, 'utf-8');
    const existingData = JSON.parse(existingContent);
    
    // Handle both old array format and new object format
    let businessArray: any[] = [];
    
    if (existingData.businesses) {
      if (Array.isArray(existingData.businesses)) {
        // Old format: { "businesses": [...] }
        businessArray = existingData.businesses;
      } else if (typeof existingData.businesses === 'object') {
        // New format: { "businesses": { "id1": {...}, "id2": {...} } }
        businessArray = Object.values(existingData.businesses);
      }
    } else if (Array.isArray(existingData)) {
      // Direct array format
      businessArray = existingData;
    }
    
    // Ensure we have an array of businesses
    if (Array.isArray(businessArray) && businessArray.length > 0) {
      let filteredBusinesses = businessArray;
      
      // FIRST: Filter by state (this should happen FIRST to limit scope)
      // If no state is specified, default to Gulf Coast states only
      const gulfCoastStates = ['florida', 'alabama', 'mississippi', 'louisiana', 'texas'];
      let stateFilter = state;
      
      if (!stateFilter) {
        // Default to Gulf Coast states when no state is specified
        stateFilter = gulfCoastStates.join(',');
      }
      
      if (stateFilter) {
        // Handle multiple states (comma-separated)
        const stateList = stateFilter.split(',').map(s => s.trim().toLowerCase());
        
        filteredBusinesses = filteredBusinesses.filter((business: any) => {
          const businessState = business.state?.toLowerCase().trim();
          
          // Check if business state matches any of the requested states
          const stateMatch = stateList.includes(businessState);
          
          return stateMatch;
        });
      }
      
      // SECOND: Filter by city/location (after state filtering)
      let cityFilter = city;
      
      // CRITICAL FIX: ALWAYS apply city filtering when we have a city parameter
      if (cityFilter && cityFilter.trim()) {
        // Normalize city filter to handle both hyphen and space formats, and remove periods
        const normalizedCityFilter = cityFilter.toLowerCase().trim().replace(/-/g, ' ').replace(/\./g, '');
        
        filteredBusinesses = filteredBusinesses.filter((business: any) => {
          // Normalize business city to handle periods and hyphens
          const businessCity = business.city?.toLowerCase().trim().replace(/\./g, '');
          
          // Check for exact match first
          let cityMatch = businessCity === normalizedCityFilter;
          
          // If no exact match, try fuzzy matching for common variations
          if (!cityMatch) {
            // Handle common city name variations
            const cityVariations = [
              normalizedCityFilter,
              normalizedCityFilter.replace(/\s+/g, '-'), // space to hyphen
              normalizedCityFilter.replace(/-/g, ' '),   // hyphen to space
              normalizedCityFilter.replace(/\s+/g, ''),  // remove spaces
            ];
            
            cityMatch = cityVariations.some(variation => 
              businessCity === variation || 
              businessCity?.includes(variation) ||
              variation.includes(businessCity || '')
            );
          }
          
          return cityMatch;
        });
      }
      
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
        
        categoryCount = filteredBusinesses.filter((business: any) => {
          const primaryCategory = business.primary_category?.toLowerCase().trim();
          const categoriesArray = business.categories_array || [];
          
          // Check if primary category matches
          if (primaryCategory && categoriesToMatch.includes(primaryCategory)) {
            return true;
          }
          
          // Check if any category in categories_array matches
          return categoriesArray.some((cat: string) => 
            categoriesToMatch.includes(cat.toLowerCase().trim())
          );
        }).length;
        
        counts[categorySlug] = categoryCount;
      }

      return NextResponse.json({
        success: true,
        counts: counts,
        total: filteredBusinesses.length,
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