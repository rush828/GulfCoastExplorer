import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cache, generateCacheKey } from '@/lib/cache';
import rateLimiter from '@/lib/rate-limit';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Rate limiting - 60 requests per 15 minutes per IP
    const ip = request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown';
    const clientIP = Array.isArray(ip) ? ip[0] : ip;

    if (!rateLimiter.isAllowed(clientIP, 60, 15 * 60 * 1000)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Please try again later.',
          rateLimitExceeded: true
        },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || searchParams.get('city'); // Handle both parameters
    const category = searchParams.get('category');
    const state = searchParams.get('state');
    const search = searchParams.get('search'); // Add search term parameter
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Generate cache key
    const cacheKey = generateCacheKey('/api/google-data/retrieve', {
      location,
      category,
      state,
      search,
      page,
      limit
    });

    // Check cache first (5 minute TTL for search results)
    const cached = cache.get(cacheKey);
    if (cached) {
      const response = NextResponse.json(cached);
      response.headers.set('X-Cache', 'HIT');
      response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
      return response;
    }


    try {
      // Fetch businesses from database
      const businesses = await prisma.listing.findMany({
        where: {
          status: 'PUBLISHED'
        },
        orderBy: [
          { priorityTier: 'desc' },
          { rating: 'desc' }
        ]
      });

      // Transform database results to expected format
      const businessesData = businesses.map(b => ({
        id: b.id,
        name: b.name,
        primary_category: b.primaryCategory,
        categories_array: b.categoriesArray || [],
        categories: b.categoriesArray || [], // Also add for UI compatibility
        address: b.address,
        city: b.city,
        state: b.state,
        latitude: b.latitude,
        longitude: b.longitude,
        rating: b.rating,
        reviews_count: b.reviewsCount,
        website: b.website,
        phone: b.phone,
        description: b.description,
        priority_tier: b.priorityTier,
        featured_until: b.featuredUntil?.toISOString(),
        thumbnails: b.thumbnails
      }));

      // Transform data to match Google data format
      const transformedData = transformExistingData({ businesses: businessesData }, location, category, state, search, page, limit);

      const responseData = {
        success: true,
        businesses: transformedData.businesses,
        total: transformedData.total,
        page: transformedData.page,
        limit: transformedData.limit,
        totalPages: transformedData.totalPages,
        hasNextPage: transformedData.hasNextPage,
        hasPrevPage: transformedData.hasPrevPage,
        source: 'consolidated-database',
        timestamp: new Date().toISOString()
      };

      // Cache the response (5 minute TTL)
      cache.set(cacheKey, responseData, 300);

      const response = NextResponse.json(responseData);
      response.headers.set('X-Cache', 'MISS');
      response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
      return response;

    } catch (fallbackError) {
      console.error('Fallback database unavailable:', fallbackError);
      
      return NextResponse.json({
        success: false,
        error: 'No data available',
        message: 'Business database is not available'
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Error retrieving data:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error';
    let statusCode = 500;
    
    if (error instanceof SyntaxError) {
      errorMessage = 'Invalid data format in database';
      statusCode = 500;
    } else if ((error as any).code === 'ENOENT') {
      errorMessage = 'Business database file not found';
      statusCode = 404;
    } else if ((error as any).code === 'EACCES') {
      errorMessage = 'Database access denied';
      statusCode = 403;
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { 
        debug: {
          message: (error as any).message,
          code: (error as any).code,
          stack: (error as any).stack?.split('\n').slice(0, 3)
        }
      })
    }, { status: statusCode });
  }
}

// Transform existing business data to match Google data format
function transformExistingData(existingData: any, location?: string | null, category?: string | null, state?: string | null, search?: string | null, page: number = 1, limit: number = 20) {
  try {
    // Handle both old array format and new object format
    let businessArray: any[] = [];
    
    if (existingData.businesses) {
      if (Array.isArray(existingData.businesses)) {
        // Old format: { "businesses": [...] }
        businessArray = existingData.businesses;
      } else if (typeof existingData.businesses === 'object') {
        // New format: { "businesses": { "id1": {...}, "id2": {...} } }
        // Convert to array and preserve the business ID from the key
        businessArray = Object.entries(existingData.businesses).map(([businessId, business]) => ({
          ...(business as object),
          id: businessId // Use the key as the business ID
        }));
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
      // This is CRITICAL - we MUST filter by city when a city parameter is provided
      let cityFilter = location; // location already handles both 'location' and 'city' parameters
      
      // Also check if search term is a city name and auto-filter by it
      if (!cityFilter && search) {
        // Check if search term matches a known city name
        const searchLower = search.toLowerCase().trim();
        const knownCities = [
          'pensacola', 'destin', 'panama city beach', 'fort walton beach', 'perdido key', 'navarre beach',
          'gulf shores', 'orange beach', 'biloxi', 'gulfport', 'ocean springs', 'pass christian',
          'bay st louis', 'waveland', 'long beach', 'diamondhead', 'moss point', 'pascagoula',
          'galveston', 'corpus christi', 'port aransas', 'rockport', 'port lavaca', 'bolivar peninsula',
          'crystal beach', 'surfside beach', 'south padre island', 'port fourchon', 'grand isle',
          'cut off', 'galliano', 'golden meadow', 'montegut', 'dulac', 'cocodrie', 'lafitte',
          'naples', 'fort myers beach', 'sanibel island', 'captiva island', 'marco island',
          'sarasota', 'key west', 'everglades city', 'cedar key', 'st george island',
          'apalachicola', 'port st joe', 'panama city', 'dauphin island', 'gulf shores',
          'fairhope', 'elberta', 'lillian', 'bon secour', 'gulf state park'
        ];
        
        if (knownCities.includes(searchLower)) {
          cityFilter = searchLower;
        }
      }
      
      // CRITICAL FIX: ALWAYS apply city filtering when we have a city parameter
      // This prevents businesses from other cities appearing in search results
      if (cityFilter && cityFilter.trim()) {
        
        // Normalize city filter to handle both hyphen and space formats, and remove periods
        const normalizedCityFilter = cityFilter.toLowerCase().trim().replace(/-/g, ' ').replace(/\./g, '');
        
        filteredBusinesses = filteredBusinesses.filter((business: any) => {
          // Normalize business city to handle periods and hyphens
          const businessCity = business.city?.toLowerCase().trim().replace(/\./g, '');
          
          // SPECIAL CASE: For Destin fishing charters, include Destin area businesses
          if (normalizedCityFilter === 'destin' && category === 'fishing-charter' && business.destin_area) {
            return true;
          }
          
          // STRICT MATCH: Only businesses with exact city match (normalized)
          const cityMatch = businessCity === normalizedCityFilter;
          
          return cityMatch;
        });
        
      } else if (location && location.trim()) {
        // Fallback: if location parameter exists but cityFilter wasn't set, use it directly
        
        // Normalize location to handle both hyphen and space formats
        const normalizedLocation = location.toLowerCase().trim().replace(/-/g, ' ');
        
        filteredBusinesses = filteredBusinesses.filter((business: any) => {
          const businessCity = business.city?.toLowerCase().trim();
          
          const cityMatch = businessCity === normalizedLocation;
          
          return cityMatch;
        });
      }
      

      
      // THIRD: Filter by search term
      if (search && search.trim()) {
        const searchLower = search.toLowerCase().trim();
        
        filteredBusinesses = filteredBusinesses.filter((business: any) => {
          const nameMatch = business.name?.toLowerCase().includes(searchLower);
          const descriptionMatch = business.description?.toLowerCase().includes(searchLower);
          const addressMatch = business.address?.toLowerCase().includes(searchLower);
          
          // Additional validation: Check for data consistency
          // If business has state and address, verify they match
          if (business.state && business.address) {
            const addressState = business.address.match(/\b(AL|Alabama|FL|Florida|MS|Mississippi|TX|Texas|LA|Louisiana)\b/i);
            const businessState = business.state.toLowerCase();
            
            if (addressState) {
              const addressStateName = addressState[0].toLowerCase();
              const stateMap: { [key: string]: string } = {
                'al': 'alabama', 'alabama': 'alabama',
                'fl': 'florida', 'florida': 'florida', 
                'ms': 'mississippi', 'mississippi': 'mississippi',
                'tx': 'texas', 'texas': 'texas',
                'la': 'louisiana', 'louisiana': 'louisiana'
              };
              
              const expectedState = stateMap[addressStateName];
              if (expectedState && businessState !== expectedState) {
                return false;
              }
            }
          }
          
          return nameMatch || descriptionMatch || addressMatch;
        });
        
      }
      
      // FOURTH: Filter by category (after all other filters)
      if (category) {
        
        // Handle multiple categories (comma-separated) and expand composite categories
        let categoryList = category.split(',').map(cat => cat.trim().toLowerCase());
        
        // Expand composite categories to their underlying categories
        const expandedCategories: string[] = [];
        categoryList.forEach(cat => {
          switch (cat) {
            case 'beach':
              expandedCategories.push('beach');
              break;
            case 'beaches-outdoors':
              expandedCategories.push('beach', 'park_recreation', 'historic_landmark', 'tourist_attraction', 'marina');
              break;
            case 'water-activities':
              expandedCategories.push('water_sports', 'water-activities', 'boat_tour', 'fishing_charter', 'scuba_diving', 'surf_shop', 'marina');
              break;
            case 'food-dining':
              expandedCategories.push('restaurant', 'coffee_shop', 'ice_cream', 'seafood_market', 'winery_brewery', 'food-dining');
              break;
            case 'lodging':
              expandedCategories.push('lodging', 'accommodations');
              break;
            case 'spa_fitness':
              expandedCategories.push('spa', 'spa_fitness', 'wellness', 'health');
              break;
            case 'shopping_mall':
              expandedCategories.push('store', 'convenience_store', 'clothing_store', 'shopping_mall', 'outlet_mall', 'souvenir_shop', 'farmers_market', 'shopping-retail');
              break;
            case 'parks-recreation':
            case 'park_recreation':
              expandedCategories.push('park_recreation', 'park', 'campground', 'rv_park', 'tourist_attraction');
              break;
            case 'nightlife-entertainment':
              expandedCategories.push('bar', 'music_venue', 'nightclub', 'entertainment');
              break;
            case 'history-culture':
              expandedCategories.push('historic_landmark', 'history-culture', 'museum');
              break;
            case 'tours-adventures':
              expandedCategories.push('tour_agency', 'tours-adventures');
              break;
            case 'golf_course':
              expandedCategories.push('golf_course', 'golf');
              break;
            case 'car_rental':
              expandedCategories.push('car_rental', 'transportation');
              break;
            case 'liquor_store':
              expandedCategories.push('liquor_store', 'winery_brewery');
              break;
            case 'fishing-charter':
              expandedCategories.push('fishing_charter');
              break;
            default:
              expandedCategories.push(cat);
          }
        });
        
        categoryList = Array.from(new Set(expandedCategories)); // Remove duplicates
        
        filteredBusinesses = filteredBusinesses.filter((business: any) => {
          // Check if business matches ANY of the requested categories
          const categoryMatches = categoryList.some(searchCategory => {
            // Handle common category mappings
            let mappedCategory = searchCategory;
            if (searchCategory === 'fishing-charter') {
              mappedCategory = 'fishing_charter';
            } else if (searchCategory === 'beaches-parks') {
              mappedCategory = 'beaches_parks';
            } else if (searchCategory === 'water-sports') {
              mappedCategory = 'water_sports';
            } else if (searchCategory === 'wedding-services') {
              mappedCategory = 'wedding_services';
            } else if (searchCategory === 'sports-recreation') {
              mappedCategory = 'sports_recreation';
            } else if (searchCategory === 'boat-rental') {
              mappedCategory = 'boat_rental';
            } else if (searchCategory === 'boat-tour') {
              mappedCategory = 'boat_tour';
            } else if (searchCategory === 'tour-agency') {
              mappedCategory = 'tour_agency';
            } else if (searchCategory === 'tourist-attraction') {
              mappedCategory = 'tourist_attraction';
            } else if (searchCategory === 'food-dining') {
              mappedCategory = 'restaurant';
            } else if (searchCategory === 'beach') {
              mappedCategory = 'beach';
            } else if (searchCategory === 'water-activities') {
              mappedCategory = 'water-activities';
            } else if (searchCategory === 'park-recreation') {
              mappedCategory = 'park_recreation';
            } else if (searchCategory === 'spa-fitness') {
              mappedCategory = 'spa_fitness';
            } else if (searchCategory === 'art-gallery') {
              mappedCategory = 'art_gallery';
            } else if (searchCategory === 'car-rental') {
              mappedCategory = 'car_rental';
            } else if (searchCategory === 'transportation') {
              mappedCategory = 'transportation';
            } else if (searchCategory === 'coffee-shop') {
              mappedCategory = 'coffee_shop';
            } else if (searchCategory === 'convenience-store') {
              mappedCategory = 'convenience_store';
            } else if (searchCategory === 'golf-course') {
              mappedCategory = 'golf_course';
            } else if (searchCategory === 'historic-landmark') {
              mappedCategory = 'historic_landmark';
            } else if (searchCategory === 'liquor-store') {
              mappedCategory = 'liquor_store';
            } else if (searchCategory === 'meal-delivery') {
              mappedCategory = 'meal_delivery';
            } else if (searchCategory === 'music-venue') {
              mappedCategory = 'music_venue';
            } else if (searchCategory === 'outlet-mall') {
              mappedCategory = 'outlet_mall';
            } else if (searchCategory === 'professional-services') {
              mappedCategory = 'professional_services';
            } else if (searchCategory === 'rv-park') {
              mappedCategory = 'rv_park';
            } else if (searchCategory === 'scuba-diving') {
              mappedCategory = 'scuba_diving';
            } else if (searchCategory === 'shopping-mall') {
              mappedCategory = 'shopping_mall';
            } else if (searchCategory === 'tour-agency') {
              mappedCategory = 'tour_agency';
            } else if (searchCategory === 'tourist-attraction') {
              mappedCategory = 'tourist_attraction';
            } else if (searchCategory === 'water-activities') {
              mappedCategory = 'water-activities';
            } else if (searchCategory === 'water-sports') {
              mappedCategory = 'water_sports';
            } else if (searchCategory === 'wedding-services') {
              mappedCategory = 'wedding_services';
            } else if (searchCategory === 'tours-adventures') {
              mappedCategory = 'tours-adventures';
            } else if (searchCategory === 'history-culture') {
              mappedCategory = 'history-culture';
            } else if (searchCategory === 'shopping-retail') {
              mappedCategory = 'shopping-retail';
            } else if (searchCategory === 'wellness') {
              mappedCategory = 'wellness';
            } else if (searchCategory === 'health') {
              mappedCategory = 'health';
            }
            
            // Check multi-category array (primary method)
            const multiCategoryMatch = business.categories_array?.some((cat: string) => 
              cat.toLowerCase().trim() === mappedCategory
            );
            
            // Check primary category as fallback
            const primaryCategoryMatch = business.primary_category?.toLowerCase().trim() === mappedCategory;
            
            return multiCategoryMatch || primaryCategoryMatch;
          });
          
          // Exclude restaurants from water-activities searches
          // Even if they have marina or other water categories
          // Check if original category param includes water-activities
          if (category && category.includes('water-activities') && business.primary_category === 'restaurant') {
            if (process.env.NODE_ENV === 'development') {
              console.log('EXCLUDING RESTAURANT from water-activities:', business.name);
            }
            return false;
          }
          
          return categoryMatches;
        });
        
      }
      
      // Transform the filtered businesses
      const transformedBusinesses = filteredBusinesses.map((business, index) => transformBusiness(business, index));
      
      // Sort the results for better user experience
      const sortedBusinesses = sortBusinessResults(transformedBusinesses, search, category);
      
      // Apply pagination
      const totalResults = sortedBusinesses.length;
      const totalPages = Math.ceil(totalResults / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBusinesses = sortedBusinesses.slice(startIndex, endIndex);
      
      return {
        businesses: paginatedBusinesses,
        total: totalResults,
        page: page,
        limit: limit,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      };
    }
    
    return {
      businesses: [],
      total: 0
    };
    
  } catch (error) {
    console.error('Error transforming existing data:', error);
    return {
      businesses: [],
      total: 0
    };
  }
}

// Sort business results for optimal user experience
function sortBusinessResults(businesses: any[], searchTerm?: string | null, category?: string | null) {
  if (!businesses || businesses.length === 0) return businesses;
  
  return businesses.sort((a, b) => {
    // 0. TOP PRIORITY: Business subscription tier (Premium subscribers first)
    const tierA = a.priority_tier || 1; // Default to 1 (free tier)
    const tierB = b.priority_tier || 1;
    if (tierA !== tierB) {
      return tierB - tierA; // Higher tier numbers (premium) first
    }
    
    // 1. SECOND PRIORITY: Businesses with selected category as primary category
    if (category && category.trim()) {
      const categoryLower = category.toLowerCase().trim();
      
      // Handle composite categories by checking if primary category matches any of the search categories
      let aHasPrimaryCategory = a.primary_category?.toLowerCase().trim() === categoryLower;
      let bHasPrimaryCategory = b.primary_category?.toLowerCase().trim() === categoryLower;
      
      // For composite categories, check if primary category matches any of the underlying categories
      // Check water-activities FIRST
      if (categoryLower.includes('water-activities') || categoryLower.includes('water-sports')) {
        const waterCategories = ['water_sports'];
        aHasPrimaryCategory = waterCategories.includes(a.primary_category?.toLowerCase().trim() || '');
        bHasPrimaryCategory = waterCategories.includes(b.primary_category?.toLowerCase().trim() || '');
      } else if (categoryLower === 'food-dining' || categoryLower.includes('restaurant') || categoryLower.includes('coffee_shop') || categoryLower.includes('ice_cream') || categoryLower.includes('seafood_market') || categoryLower.includes('winery_brewery')) {
        const foodCategories = ['restaurant', 'coffee_shop', 'ice_cream', 'seafood_market', 'winery_brewery'];
        aHasPrimaryCategory = foodCategories.includes(a.primary_category?.toLowerCase().trim() || '');
        bHasPrimaryCategory = foodCategories.includes(b.primary_category?.toLowerCase().trim() || '');
        
        // Within food-dining, prioritize restaurant > coffee_shop > winery_brewery > seafood_market > ice_cream
        if (aHasPrimaryCategory && bHasPrimaryCategory) {
          const aCategory = a.primary_category?.toLowerCase().trim() || '';
          const bCategory = b.primary_category?.toLowerCase().trim() || '';
          
          const foodPriority: { [key: string]: number } = { 'restaurant': 5, 'coffee_shop': 4, 'winery_brewery': 3, 'seafood_market': 2, 'ice_cream': 1 };
          const aPriority = foodPriority[aCategory] || 0;
          const bPriority = foodPriority[bCategory] || 0;
          
          if (aPriority !== bPriority) {
            return bPriority - aPriority; // Higher priority first
          }
        }
      } else if (categoryLower === 'lodging' || categoryLower.includes('accommodations')) {
        const lodgingCategories = ['lodging'];
        aHasPrimaryCategory = lodgingCategories.includes(a.primary_category?.toLowerCase().trim() || '');
        bHasPrimaryCategory = lodgingCategories.includes(b.primary_category?.toLowerCase().trim() || '');
      } else if (categoryLower === 'beaches-outdoors' || categoryLower.includes('beach') || categoryLower.includes('park_recreation') || categoryLower.includes('historic_landmark')) {
        const beachCategories = ['beach', 'park_recreation', 'historic_landmark', 'tourist_attraction'];
        aHasPrimaryCategory = beachCategories.includes(a.primary_category?.toLowerCase().trim() || '');
        bHasPrimaryCategory = beachCategories.includes(b.primary_category?.toLowerCase().trim() || '');
        
        
        // Within beaches-outdoors, prioritize beach > park_recreation > historic_landmark > tourist_attraction
        if (aHasPrimaryCategory && bHasPrimaryCategory) {
          const aCategory = a.primary_category?.toLowerCase().trim() || '';
          const bCategory = b.primary_category?.toLowerCase().trim() || '';
          
          const beachPriority: { [key: string]: number } = { 'beach': 4, 'park_recreation': 3, 'historic_landmark': 2, 'tourist_attraction': 1 };
          const aPriority = beachPriority[aCategory] || 0;
          const bPriority = beachPriority[bCategory] || 0;
          
          if (aPriority !== bPriority) {
            return bPriority - aPriority; // Higher priority first
          }
        }
      } else if (categoryLower === 'spa_fitness' || categoryLower.includes('spa') || categoryLower.includes('wellness') || categoryLower.includes('health')) {
        const spaCategories = ['spa', 'spa_fitness', 'wellness', 'health'];
        aHasPrimaryCategory = spaCategories.includes(a.primary_category?.toLowerCase().trim() || '');
        bHasPrimaryCategory = spaCategories.includes(b.primary_category?.toLowerCase().trim() || '');
        
        // Within spa_fitness, prioritize spa > spa_fitness > wellness > health
        if (aHasPrimaryCategory && bHasPrimaryCategory) {
          const aCategory = a.primary_category?.toLowerCase().trim() || '';
          const bCategory = b.primary_category?.toLowerCase().trim() || '';
          
          const spaPriority: { [key: string]: number } = { 'spa': 4, 'spa_fitness': 3, 'wellness': 2, 'health': 1 };
          const aPriority = spaPriority[aCategory] || 0;
          const bPriority = spaPriority[bCategory] || 0;
          
          if (aPriority !== bPriority) {
            return bPriority - aPriority; // Higher priority first
          }
        }
      } else if (categoryLower === 'parks-recreation' || categoryLower === 'park_recreation' || categoryLower.includes('park') || categoryLower.includes('recreation')) {
        const parkCategories = ['park_recreation', 'park', 'campground', 'rv_park', 'tourist_attraction'];
        
        // Check if primary category is in park categories
        const aPrimaryCategory = a.primary_category?.toLowerCase().trim() || '';
        const bPrimaryCategory = b.primary_category?.toLowerCase().trim() || '';
        
        aHasPrimaryCategory = parkCategories.includes(aPrimaryCategory);
        bHasPrimaryCategory = parkCategories.includes(bPrimaryCategory);
        
        // Within parks-recreation, prioritize park_recreation > park > campground > rv_park > tourist_attraction
        if (aHasPrimaryCategory && bHasPrimaryCategory) {
          const aCategory = aPrimaryCategory;
          const bCategory = bPrimaryCategory;
          
          const parkPriority: { [key: string]: number } = { 
            'park_recreation': 5,
            'park': 4, 
            'campground': 3, 
            'rv_park': 2, 
            'tourist_attraction': 1
          };
          
          const aPriority = parkPriority[aCategory] || 0;
          const bPriority = parkPriority[bCategory] || 0;
          
          if (aPriority !== bPriority) {
            return bPriority - aPriority; // Higher priority first
          }
        }
      } else if (categoryLower === 'shopping_mall' || categoryLower.includes('store') || categoryLower.includes('shopping') || categoryLower.includes('mall')) {
        const shoppingCategories = ['store', 'convenience_store', 'clothing_store', 'shopping_mall', 'outlet_mall', 'souvenir_shop', 'farmers_market', 'shopping-retail'];
        
        // Check if primary category contains "store" or "mall" or is in our known list
        const aPrimaryCategory = a.primary_category?.toLowerCase().trim() || '';
        const bPrimaryCategory = b.primary_category?.toLowerCase().trim() || '';
        
        aHasPrimaryCategory = shoppingCategories.includes(aPrimaryCategory) || 
                            aPrimaryCategory.includes('store') || 
                            aPrimaryCategory.includes('mall');
        bHasPrimaryCategory = shoppingCategories.includes(bPrimaryCategory) || 
                            bPrimaryCategory.includes('store') || 
                            bPrimaryCategory.includes('mall');
        
        // Within shopping_mall, prioritize store > convenience_store > clothing_store > shopping_mall > outlet_mall > souvenir_shop > farmers_market
        if (aHasPrimaryCategory && bHasPrimaryCategory) {
          const aCategory = aPrimaryCategory;
          const bCategory = bPrimaryCategory;
          
          const shoppingPriority: { [key: string]: number } = { 
            'store': 7,
            'convenience_store': 6, 
            'clothing_store': 5,
            'shopping_mall': 4, 
            'outlet_mall': 3, 
            'souvenir_shop': 2, 
            'farmers_market': 1,
            'shopping-retail': 1
          };
          
          // Get priority, with bonus for categories containing "store" or "mall"
          const getPriority = (category: string) => {
            if (shoppingPriority[category]) {
              return shoppingPriority[category];
            }
            // Give bonus priority to any category with "store" or "mall"
            if (category.includes('store')) {
              return 5; // Similar to clothing_store
            }
            if (category.includes('mall')) {
              return 3; // Similar to outlet_mall
            }
            return 0;
          };
          
          const aPriority = getPriority(aCategory);
          const bPriority = getPriority(bCategory);
          
          if (aPriority !== bPriority) {
            return bPriority - aPriority; // Higher priority first
          }
        }
      } else if (categoryLower === 'nightlife-entertainment' || categoryLower.includes('bar') || categoryLower.includes('music_venue') || categoryLower.includes('nightclub') || categoryLower.includes('entertainment')) {
        const nightlifeCategories = ['bar', 'music_venue', 'nightclub', 'entertainment'];
        aHasPrimaryCategory = nightlifeCategories.includes(a.primary_category?.toLowerCase().trim() || '');
        bHasPrimaryCategory = nightlifeCategories.includes(b.primary_category?.toLowerCase().trim() || '');
      }
      
      // Primary category matches get highest priority
      if (aHasPrimaryCategory && !bHasPrimaryCategory) return -1;
      if (!aHasPrimaryCategory && bHasPrimaryCategory) return 1;
      
      // If both have primary category match, continue to other sorting criteria
      if (aHasPrimaryCategory && bHasPrimaryCategory) {
        // Within primary category matches, sort by review count
        const aReviews = a.reviews_count || 0;
        const bReviews = b.reviews_count || 0;
        const reviewDiff = bReviews - aReviews;
        if (reviewDiff !== 0) return reviewDiff;
        
        // Then by rating
        const aRating = a.rating || 0;
        const bRating = b.rating || 0;
        const ratingDiff = bRating - aRating;
        if (Math.abs(ratingDiff) >= 0.2) return ratingDiff;
        
        // Finally alphabetical
        return (a.name || '').localeCompare(b.name || '');
      }
    }
    
    // 2. PRIORITY: Exact name matches first (if searching)
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      const aNameMatch = a.name?.toLowerCase().includes(searchLower);
      const bNameMatch = b.name?.toLowerCase().includes(searchLower);
      
      // Exact name matches get priority
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      
      // If both match, check for exact word matches
      const aExactWord = a.name?.toLowerCase().split(/\s+/).includes(searchLower);
      const bExactWord = b.name?.toLowerCase().split(/\s+/).includes(searchLower);
      if (aExactWord && !bExactWord) return -1;
      if (!aExactWord && bExactWord) return 1;
    }
    
    // 3. RELIABILITY: Review count (more reviews = more reliable and popular)
    const aReviews = a.reviews_count || 0;
    const bReviews = b.reviews_count || 0;
    const reviewDiff = bReviews - aReviews;
    
    // Use review count as primary sorting factor
    if (reviewDiff !== 0) {
      return reviewDiff;
    }
    
    // 4. QUALITY: Rating (higher is better, but only if significant difference)
    const aRating = a.rating || 0;
    const bRating = b.rating || 0;
    const ratingDiff = bRating - aRating;
    
    // Only use rating if difference is significant (0.2+ stars)
    if (Math.abs(ratingDiff) >= 0.2) {
      return ratingDiff;
    }
    
    // 5. FALLBACK: Alphabetical by name for consistency
    return (a.name || '').localeCompare(b.name || '');
  });
}

// Transform individual business to the format expected by BusinessListings component
function transformBusiness(business: any, index: number = 0, businessKey?: string) {
  // Use the existing ID from the business object (which should match thumbnail filename)
  const uniqueId = business.id || businessKey || `unknown_${index}`;
  
  return {
    id: uniqueId,
    name: business.name || business.business_name,
    category: business.category || 'business',
    categories: business.categories || business.categories_array || [business.category || 'business'],
    primary_category: business.primary_category || business.category || 'business',
    address: business.address || business.formatted_address || '',
    city: business.city || '',
    state: business.state || '',
    rating: business.rating || 0,
    reviews_count: business.reviews_count || business.user_ratings_total || 0,
    website: business.website || business.website_url || '',
    phone: business.phone || business.international_phone_number || '',
    description: business.description || '',
    photos: business.photos || business.photos_array || [],
    priority_tier: business.priority_tier || 1, // Business subscription tier (1=Free, 2=Basic, 3=Featured)
    featured_until: business.featured_until, // Premium tier expiration date
    // Keep some additional fields for future use
    latitude: business.latitude || business.geometry?.location?.lat,
    longitude: business.longitude || business.geometry?.location?.lng,
    types: business.types || [business.category || 'business']
  };
}
