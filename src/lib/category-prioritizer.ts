/**
 * Smart Category Prioritization System
 * 
 * This system intelligently determines the primary category for businesses
 * by analyzing business names, descriptions, and available categories
 * to avoid misclassifications like state parks being labeled as restaurants.
 */

// Priority order for primary category selection (lower number = higher priority)
const CATEGORY_PRIORITY: Record<string, number> = {
  'park_recreation': 1,      // Highest priority - parks, recreation areas
  'historic_landmark': 2,    // Historic sites, monuments, forts
  'museum': 3,               // Museums, cultural centers
  'beach': 4,                // Beaches, beach access points
  'marina': 5,               // Marinas, boat docks
  'water_sports': 6,         // Water activities, boat rentals
  'lodging': 7,              // Hotels, resorts, accommodations
  'tourist_attraction': 8,   // Tourist attractions, landmarks
  'restaurant': 9,           // Restaurants, cafes, food service
  'coffee_shop': 10,         // Coffee shops, cafes
  'bar': 11,                 // Bars, pubs, nightlife
  'shopping_mall': 12,       // Shopping centers, malls
  'car_rental': 13,          // Car rentals, transportation
  'tour_agency': 14,         // Tour companies, guides
  'spa_fitness': 15,         // Spas, fitness centers
  'liquor_store': 16,        // Liquor stores, retail
  'entertainment': 17,       // Entertainment venues
  'nightclub': 18,           // Nightclubs, clubs
  'rv_park': 19,             // RV parks, campgrounds
  'golf_course': 20,         // Golf courses, sports
  'ice_cream': 21,           // Ice cream shops
  'seafood_market': 22,      // Seafood markets
  'winery_brewery': 23,      // Wineries, breweries
  'food-dining': 24,         // Generic food category
  'beaches-outdoors': 25,    // Composite outdoor category
  'water-activities': 26,    // Composite water activities
  'nightlife-entertainment': 27, // Composite entertainment
  'accommodations': 28,      // Composite lodging
  'fishing_charter': 29,     // Fishing charters
  'convenience_store': 30,   // Convenience stores
  'clothing_store': 31,      // Clothing stores
  '24_hours': 32             // 24-hour businesses
};

// Keywords that indicate specific primary categories
const KEYWORD_OVERRIDES: Record<string, string> = {
  // Historic Sites (highest priority for forts)
  'fort': 'historic_landmark',
  'historic fort': 'historic_landmark',
  'taylor': 'historic_landmark',
  'zachary': 'historic_landmark',
  
  // Parks and Recreation
  'state park': 'park_recreation',
  'national park': 'park_recreation',
  'park': 'park_recreation',
  'recreation': 'park_recreation',
  'campground': 'park_recreation',
  'rv park': 'rv_park',
  
  // Historic Sites
  'historic': 'historic_landmark',
  'battleground': 'historic_landmark',
  'monument': 'historic_landmark',
  'historic site': 'historic_landmark',
  'historic district': 'historic_landmark',
  
  // Museums
  'museum': 'museum',
  'cultural center': 'museum',
  'art museum': 'museum',
  'history museum': 'museum',
  
  // Beaches
  'beach': 'beach',
  'beach access': 'beach',
  'public beach': 'beach',
  'beach park': 'beach',
  
  // Marinas (higher priority than RV parks)
  'marina': 'marina',
  'boat dock': 'marina',
  'harbor': 'marina',
  'boat ramp': 'marina',
  '& marina': 'marina',
  'marina &': 'marina',
  
  // Water Activities
  'charter': 'water_sports',
  'fishing charter': 'water_sports',
  'boat rental': 'water_sports',
  'jet ski': 'water_sports',
  'kayak': 'water_sports',
  'paddleboard': 'water_sports',
  'parasailing': 'water_sports',
  'scuba diving': 'water_sports',
  'sailing': 'water_sports',
  'water sports': 'water_sports',
  
  // Lodging
  'hotel': 'lodging',
  'resort': 'lodging',
  'inn': 'lodging',
  'motel': 'lodging',
  'vacation rental': 'lodging',
  'b&b': 'lodging',
  'bed and breakfast': 'lodging',
  'suite': 'lodging',
  'lodge': 'lodging',
  'beach house': 'lodging',
  'collection': 'lodging',
  'garden inn': 'lodging',
  'hilton': 'lodging',
  
  // Tourist Attractions
  'attraction': 'tourist_attraction',
  'landmark': 'tourist_attraction',
  'pier': 'tourist_attraction',
  'boardwalk': 'tourist_attraction',
  'aquarium': 'tourist_attraction',
  'zoo': 'tourist_attraction',
  
  // Entertainment
  'theater': 'entertainment',
  'cinema': 'entertainment',
  'bowling': 'entertainment',
  'arcade': 'entertainment',
  'mini golf': 'entertainment',
  'go kart': 'entertainment',
  'amusement': 'entertainment',
  
  // Nightlife
  'bar': 'bar',
  'pub': 'bar',
  'tavern': 'bar',
  'brewery': 'bar',
  'wine bar': 'bar',
  'cocktail bar': 'bar',
  'nightclub': 'nightclub',
  'club': 'nightclub',
  'dance club': 'nightclub',
  'music venue': 'nightclub',
  
  // Shopping
  'mall': 'shopping_mall',
  'shopping center': 'shopping_mall',
  'plaza': 'shopping_mall',
  'outlet': 'shopping_mall',
  'market': 'shopping_mall',
  
  // Transportation
  'car rental': 'car_rental',
  'rental car': 'car_rental',
  'taxi': 'car_rental',
  'uber': 'car_rental',
  'lyft': 'car_rental',
  
  // Tours
  'tour': 'tour_agency',
  'guided tour': 'tour_agency',
  'tour company': 'tour_agency',
  'adventure': 'tour_agency',
  'excursion': 'tour_agency',
  'guide': 'tour_agency',
  
  // Wellness
  'spa': 'spa_fitness',
  'massage': 'spa_fitness',
  'yoga': 'spa_fitness',
  'gym': 'spa_fitness',
  'fitness': 'spa_fitness',
  'wellness': 'spa_fitness',
  
  // Sports
  'golf': 'golf_course',
  'golf course': 'golf_course',
  'tennis': 'golf_course',
  'sports': 'golf_course',
  'stadium': 'golf_course',
  
  // Retail
  'liquor store': 'liquor_store',
  'wine shop': 'liquor_store',
  'beer store': 'liquor_store',
  'convenience': 'liquor_store',
  'store': 'liquor_store'
};

/**
 * Determines the best primary category for a business based on:
 * 1. Keyword analysis of business name and description
 * 2. Category priority ranking
 * 3. Available categories from Google Places API
 */
export function determinePrimaryCategory(
  businessName: string,
  businessDescription: string | null | undefined,
  availableCategories: string[]
): string {
  if (!availableCategories || availableCategories.length === 0) {
    return 'business'; // Fallback category
  }

  // Combine name and description for keyword analysis
  const searchText = `${businessName} ${businessDescription || ''}`.toLowerCase();
  
  // Check for keyword overrides first (highest priority)
  for (const [keyword, category] of Object.entries(KEYWORD_OVERRIDES)) {
    if (searchText.includes(keyword)) {
      // Verify this category is available in the business's categories
      if (availableCategories.includes(category)) {
        return category;
      }
    }
  }
  
  // If no keyword match, use priority-based selection
  const availableCategoriesWithPriority = availableCategories
    .map(category => ({
      category,
      priority: CATEGORY_PRIORITY[category] || 999 // Default low priority for unknown categories
    }))
    .sort((a, b) => a.priority - b.priority);
  
  // Return the highest priority available category
  return availableCategoriesWithPriority[0].category;
}

/**
 * Validates if a business is correctly categorized
 */
export function validateCategory(
  businessName: string,
  businessDescription: string | null | undefined,
  currentPrimaryCategory: string,
  availableCategories: string[]
): {
  isCorrect: boolean;
  suggestedCategory: string;
  reason: string;
} {
  const suggestedCategory = determinePrimaryCategory(
    businessName,
    businessDescription,
    availableCategories
  );
  
  const isCorrect = currentPrimaryCategory === suggestedCategory;
  
  let reason = '';
  if (!isCorrect) {
    const searchText = `${businessName} ${businessDescription || ''}`.toLowerCase();
    
    // Find the keyword that triggered the suggestion
    for (const [keyword, category] of Object.entries(KEYWORD_OVERRIDES)) {
      if (searchText.includes(keyword) && category === suggestedCategory) {
        reason = `Keyword "${keyword}" indicates this should be ${category}, not ${currentPrimaryCategory}`;
        break;
      }
    }
    
    if (!reason) {
      reason = `Priority-based selection suggests ${suggestedCategory} over ${currentPrimaryCategory}`;
    }
  }
  
  return {
    isCorrect,
    suggestedCategory,
    reason
  };
}

/**
 * Gets a list of all available categories with their priorities
 */
export function getCategoryPriorityList(): Array<{category: string, priority: number}> {
  return Object.entries(CATEGORY_PRIORITY)
    .map(([category, priority]) => ({ category, priority }))
    .sort((a, b) => a.priority - b.priority);
}
