/**
 * Google/Outscraper Data Import Transformer
 * Converts Google Places API data to our database format
 */

// Valid categories from our database - only these will be accepted
const VALID_CATEGORIES = new Set([
  "24_hours",
  "art_gallery",
  "bakery",
  "bar",
  "beach",
  "campground",
  "car_rental",
  "clothing_store",
  "coffee_shop",
  "convenience_store",
  "entertainment",
  "farmers_market",
  "fishing_charter",
  "golf_course",
  "historic_landmark",
  "ice_cream",
  "liquor_store",
  "lodging",
  "marina",
  "meal_delivery",
  "museum",
  "music_venue",
  "nightclub",
  "park_recreation",
  "professional_services",
  "restaurant",
  "rv_park",
  "scuba_diving",
  "spa",
  "spa_fitness",
  "store",
  "tour_agency",
  "tourist_attraction",
  "water_sports",
  "water_sports_equipment_rental_service",
  "winery_brewery"
]);

export interface GoogleBusinessData {
  query?: string
  name: string
  site?: string
  subtypes?: string
  category: string
  type?: string
  phone?: string
  full_address?: string
  city: string
  state: string
  latitude: number
  longitude: number
  rating?: number
  reviews?: number
  working_hours?: string
  working_hours_old_format?: string
  photo?: string
  about?: string
  [key: string]: any
}

export interface TransformedBusiness {
  name: string
  primary_category: string
  categories: string[]
  categories_array: string[]
  address: string
  city: string
  state: string
  latitude: number
  longitude: number
  rating: number
  reviews_count: number
  website: string
  phone: string
  description: string
  google_types: string[]
  opening_hours: string
  photos: string[]
  thumbnails?: string[]  // Local optimized image paths
  priority_tier: number
  created_at: string
  updated_at: string
  tier_updated_at: string
  // Category mapping metadata
  unmapped_categories?: string[]  // Google categories that couldn't be mapped
  needs_manual_categorization?: boolean  // Flag for manual review
  // Image metadata
  google_photo_url?: string  // Original Google photo URL for download
}

/**
 * Smart category mapping from Google categories to our database categories
 */
const GOOGLE_CATEGORY_MAPPING: Record<string, string> = {
  // Music & Entertainment Venues
  'jazz_club': 'music_venue',
  'live_music_bar': 'music_venue',
  'live_music_venue': 'music_venue',
  'karaoke_bar': 'music_venue',
  'dance_club': 'nightclub',
  'night_club': 'nightclub',
  
  // Bars & Nightlife
  'cocktail_bar': 'bar',
  'sports_bar': 'bar',
  'wine_bar': 'bar',
  'tiki_bar': 'bar',
  'oyster_bar_restaurant': 'bar',
  'poke_bar': 'bar',
  'stand_bar': 'bar',
  'dart_bar': 'bar',
  'tapas_bar': 'bar',
  'irish_pub': 'bar',
  'pub': 'bar',
  'gastropub': 'bar',
  'brewpub': 'winery_brewery',
  'brewery': 'winery_brewery',
  'beer_hall': 'bar',
  'beer_garden': 'bar',
  'lounge': 'bar',
  'pool_hall': 'bar',
  
  // Restaurants - All types map to restaurant
  'american_restaurant': 'restaurant',
  'asian_restaurant': 'restaurant',
  'barbecue_restaurant': 'restaurant',
  'breakfast_restaurant': 'restaurant',
  'brunch_restaurant': 'restaurant',
  'californian_restaurant': 'restaurant',
  'caribbean_restaurant': 'restaurant',
  'chicken_restaurant': 'restaurant',
  'chicken_wings_restaurant': 'restaurant',
  'chophouse_restaurant': 'restaurant',
  'colombian_restaurant': 'restaurant',
  'cuban_restaurant': 'restaurant',
  'delivery_restaurant': 'meal_delivery',  // Keep: This is explicitly a delivery-focused business
  'diner': 'restaurant',
  'family_restaurant': 'restaurant',
  'fast_food_restaurant': 'restaurant',
  'fine_dining_restaurant': 'restaurant',
  'fish_chips_restaurant': 'restaurant',
  'fish__chips_restaurant': 'restaurant',  // Variant (& becomes empty, creates double underscore)
  'fischchips_restaurant': 'restaurant',  // Variant (& removed completely)
  'fish_restaurant': 'restaurant',
  'floridian_restaurant': 'restaurant',
  'french_restaurant': 'restaurant',
  'fried_chicken_takeaway': 'restaurant',  // Fixed: takeaway spots are still restaurants
  'gluten_free_restaurant': 'restaurant',
  'grill': 'restaurant',
  'hamburger_restaurant': 'restaurant',
  'hawaiian_restaurant': 'restaurant',
  'health_food_restaurant': 'restaurant',
  'indian_restaurant': 'restaurant',
  'italian_restaurant': 'restaurant',
  'izakaya_restaurant': 'restaurant',
  'japanese_restaurant': 'restaurant',
  'jewish_restaurant': 'restaurant',
  'korean_restaurant': 'restaurant',
  'kosher_restaurant': 'restaurant',
  'kushiyaki_restaurant': 'restaurant',
  'latin_american_restaurant': 'restaurant',
  'lunch_restaurant': 'restaurant',
  'mediterranean_restaurant': 'restaurant',
  'mexican_restaurant': 'restaurant',
  'middle_eastern_restaurant': 'restaurant',
  'modern_french_restaurant': 'restaurant',
  'new_american_restaurant': 'restaurant',
  'peruvian_restaurant': 'restaurant',
  'pizza_restaurant': 'restaurant',
  'pizza_takeout': 'restaurant',  // Fixed: pizza takeout is still a restaurant
  'puerto_rican_restaurant': 'restaurant',
  'ramen_restaurant': 'restaurant',
  'seafood_restaurant': 'restaurant',
  'small_plates_restaurant': 'restaurant',
  'soul_food_restaurant': 'restaurant',
  'soup_restaurant': 'restaurant',
  'southern_restaurant_us': 'restaurant',
  'spanish_restaurant': 'restaurant',
  'steak_house': 'restaurant',
  'sushi_restaurant': 'restaurant',
  'taco_restaurant': 'restaurant',
  'takeout_restaurant': 'restaurant',  // Fixed: takeout restaurant is still a restaurant
  'tapas_restaurant': 'restaurant',
  'tex_mex_restaurant': 'restaurant',
  'texmex_restaurant': 'restaurant',  // Variant without underscore
  'traditional_american_restaurant': 'restaurant',
  'vegan_restaurant': 'restaurant',
  'vegetarian_restaurant': 'restaurant',
  'yakitori_restaurant': 'restaurant',
  'bar__grill': 'restaurant',
  'bistro': 'restaurant',
  
  // Coffee & Cafes
  'cafe': 'coffee_shop',
  'coffee_shop': 'coffee_shop',
  'coffee_store': 'coffee_shop',
  'espresso_bar': 'coffee_shop',
  'internet_cafe': 'coffee_shop',
  'dog_cafe': 'coffee_shop',
  'vegetarian_cafe_and_deli': 'coffee_shop',
  
  // Food Shops & Delis
  'bagel_shop': 'bakery',
  'creperie': 'bakery',
  'deli': 'restaurant',
  'sandwich_shop': 'restaurant',
  'salad_shop': 'restaurant',
  'juice_shop': 'coffee_shop',
  'pasta_shop': 'restaurant',  // Fixed: pasta shops are restaurants, not convenience stores
  'snack_bar': 'restaurant',
  
  // Retail Stores
  'beer_store': 'liquor_store',
  'wine_store': 'liquor_store',
  'wine_cellar': 'liquor_store',
  'liquor_store': 'liquor_store',
  'cigar_shop': 'store',
  'gift_basket_store': 'store',
  'mens_clothing_store': 'clothing_store',
  'womens_clothing_store': 'clothing_store',
  'video_game_store': 'store',
  
  // Entertainment & Attractions
  'amusement_center': 'entertainment',
  'video_arcade': 'entertainment',
  'winery': 'winery_brewery',
  
  // Services (map to professional_services or filter out)
  'caterer': 'professional_services',
  'catering_food_and_drink_supplier': 'professional_services',
  'mobile_caterer': 'professional_services',
  'dj_service': 'professional_services',
  'event_planner': 'professional_services',
  'event_venue': 'entertainment',
  'wedding_buffet': 'professional_services',
  'wedding_service': 'professional_services',
  'service_establishment': 'professional_services',
  
  // Bait & Marina
  'bait_shop': 'marina',
  
  // Plural forms
  'bars': 'bar',
  'restaurants': 'restaurant',
  'cafes': 'coffee_shop',
  'coffee_shops': 'coffee_shop',
  'attractions': 'tourist_attraction',
  'hotels': 'lodging',
  'lodgings': 'lodging',
  'stores': 'store',
  'marinas': 'marina',
  'beaches': 'beach',
  'parks': 'park_recreation',
}

/**
 * Normalize category names to database format
 * Returns null if category is not in our whitelist
 */
export function normalizeCategory(category: string): string | null {
  // Handle null/undefined/empty categories
  if (!category || typeof category !== 'string') {
    return null
  }
  
  const normalized = category
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
  
  // First, check if there's a smart mapping
  if (GOOGLE_CATEGORY_MAPPING[normalized]) {
    return GOOGLE_CATEGORY_MAPPING[normalized]
  }
  
  // If no mapping, check if it's already valid
  if (VALID_CATEGORIES.has(normalized)) {
    return normalized
  }
  
  // Not found in mapping or whitelist
  return null
}

/**
 * Keyword-based category detection
 * Analyzes business name, description, and type for keywords
 * Now includes smart mappings for common unmapped Google categories
 */
const KEYWORD_CATEGORY_MAPPING: Record<string, string[]> = {
  // Water Sports & Activities
  'water_sports': ['parasailing', 'jet ski', 'kayak', 'paddleboard', 'snorkel', 'surf', 'kiteboard', 'wakeboard', 'water sports', 'waterski', 'boat rental', 'watercraft'],
  'fishing_charter': ['fishing', 'charter', 'deep sea', 'offshore', 'inshore', 'angling', 'fish'],
  'scuba_diving': ['scuba', 'dive', 'diving', 'snorkel'],
  'marina': ['marina', 'dock', 'boat slip', 'harbor', 'yacht club', 'boat ramp', 'yacht', 'sailing'],
  
  // Beaches & Outdoors
  'beach': ['beach', 'shore', 'coastline', 'beachfront'],
  'park_recreation': ['park', 'recreation', 'nature', 'trail', 'playground'],
  'campground': ['campground', 'camping', 'camp site'],
  'rv_park': ['rv park', 'rv resort', 'motorhome'],
  'golf_course': ['golf', 'country club', 'golf course'],
  
  // Nightlife & Entertainment
  'music_venue': ['live music', 'concert', 'jazz', 'blues', 'band', 'acoustic', 'open mic', 'karaoke', 'dj service', 'dj', 'live band', 'music venue'],
  'nightclub': ['night club', 'dance club', 'nightlife', 'club', 'dance'],
  'bar': ['bar', 'pub', 'tavern', 'lounge', 'cocktail', 'beer', 'wine', 'spirits', 'draft', 'tap', 'sports bar', 'dive bar', 'wine bar', 'tiki bar', 'oyster bar'],
  'winery_brewery': ['winery', 'brewery', 'brewpub', 'craft beer', 'microbrewery', 'distillery', 'vineyard', 'beer hall', 'beer garden'],
  'entertainment': ['arcade', 'bowling', 'mini golf', 'go kart', 'amusement', 'family fun', 'pool hall', 'billiards'],
  
  // Food & Dining
  'restaurant': ['restaurant', 'grill', 'diner', 'bistro', 'eatery', 'dining', 'cuisine', 'steakhouse', 'seafood', 'mexican', 'italian', 'chinese', 'sushi', 'barbecue', 'bbq', 'chophouse', 'gastropub'],
  'coffee_shop': ['coffee', 'cafe', 'espresso', 'latte', 'cappuccino', 'coffee shop', 'internet cafe'],
  'bakery': ['bakery', 'pastry', 'donuts', 'bagel', 'bread', 'dessert', 'patisserie'],
  'ice_cream': ['ice cream', 'gelato', 'frozen yogurt', 'smoothie'],
  'meal_delivery': ['takeout', 'delivery', 'to-go', 'carryout', 'pickup', 'take out', 'take-out'],
  
  // Shopping & Retail
  'store': ['store', 'shop', 'boutique', 'retail', 'gift shop'],
  'clothing_store': ['clothing', 'apparel', 'fashion', 'wear', 'dress', "men's clothing", "women's clothing"],
  'liquor_store': ['liquor', 'wine shop', 'beer store', 'package store', 'wine store', 'wine cellar'],
  'convenience_store': ['convenience', 'corner store', 'market', 'deli', 'sandwich', 'salad shop'],
  
  // Lodging & Accommodations
  'lodging': ['hotel', 'motel', 'inn', 'resort', 'lodge', 'accommodation', 'suite', 'vacation rental', 'bed & breakfast', 'b&b'],
  
  // Attractions & Culture
  'tourist_attraction': ['attraction', 'landmark', 'monument', 'viewpoint', 'scenic', 'sightseeing'],
  'historic_landmark': ['historic', 'museum', 'fort', 'heritage', 'memorial', 'battlefield'],
  'museum': ['museum', 'gallery', 'exhibit', 'art center'],
  'art_gallery': ['art', 'gallery', 'artwork', 'artist'],
  
  // Services & Tours
  'tour_agency': ['tour', 'excursion', 'guided', 'sightseeing', 'adventure'],
  'spa_fitness': ['spa', 'massage', 'wellness', 'yoga', 'fitness', 'gym', 'salon', 'health club'],
  'car_rental': ['car rental', 'rent a car', 'vehicle rental'],
  'professional_services': ['service', 'professional', 'consulting', 'event planner', 'catering', 'caterer', 'event venue', 'wedding'],
}

/**
 * Analyze text for category keywords
 */
function detectCategoriesFromKeywords(text: string): Set<string> {
  const detected = new Set<string>()
  const lowerText = text.toLowerCase()
  
  for (const [category, keywords] of Object.entries(KEYWORD_CATEGORY_MAPPING)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        detected.add(category)
        break // Found a match for this category, move to next
      }
    }
  }
  
  return detected
}

/**
 * Parse subtypes and create categories array
 * Returns both mapped categories and unmapped ones for manual review
 */
export function parseSubtypes(
  subtypes: string | undefined, 
  primaryCategory: string, 
  workingHours: string | undefined,
  businessName?: string,
  description?: string,
  googleType?: string
): { categories: string[]; unmapped: string[] } {
  const categories: Set<string> = new Set()
  const unmapped: string[] = []
  
  // Parse subtypes if provided
  if (subtypes) {
    const types = subtypes.split(',').map(t => t.trim())
    for (const type of types) {
      const normalized = normalizeCategory(type)
      
      if (!normalized) {
        // Could not map this category - flag for manual review
        unmapped.push(type)
      } else if (normalized !== primaryCategory) {
        // Successfully mapped and different from primary
        categories.add(normalized)
      }
      // If normalized === primaryCategory, we skip it (no duplicate)
    }
  }
  
  // TEMPORARILY DISABLED: Keyword detection was too aggressive
  // Analyze business name for keywords
  // if (businessName) {
  //   const nameCategories = detectCategoriesFromKeywords(businessName)
  //   nameCategories.forEach(cat => {
  //     if (cat !== primaryCategory) {
  //       categories.add(cat)
  //     }
  //   })
  // }
  
  // Analyze description for keywords
  // if (description) {
  //   const descCategories = detectCategoriesFromKeywords(description)
  //   descCategories.forEach(cat => {
  //     if (cat !== primaryCategory) {
  //       categories.add(cat)
  //     }
  //   })
  // }
  
  // Analyze Google type for keywords
  // if (googleType) {
  //   const typeCategories = detectCategoriesFromKeywords(googleType)
  //   typeCategories.forEach(cat => {
  //     if (cat !== primaryCategory) {
  //       categories.add(cat)
  //     }
  //   })
  // }
  
  // Check for 24 hours operation
  if (workingHours && workingHours.includes('Open 24 hours')) {
    categories.add('24_hours')
  }
  
  // Always include the primary category in the array
  categories.add(primaryCategory)
  
  return {
    categories: Array.from(categories),
    unmapped
  }
}

/**
 * Convert Google working hours format to our format
 */
export function convertWorkingHours(workingHoursOldFormat: string | undefined): string {
  if (!workingHoursOldFormat) return ''
  
  // Convert from: "Monday:12PM-2AM|Tuesday:12PM-2AM"
  // To: "Monday: 12PM-2AM; Tuesday: 12PM-2AM"
  return workingHoursOldFormat
    .split('|')
    .map(day => {
      const [dayName, hours] = day.split(':')
      return `${dayName}: ${hours}`
    })
    .join('; ')
}

/**
 * Generate description from Google's "about" JSON
 */
export function generateDescription(about: string | undefined, subtypes: string | undefined): string {
  if (!about) {
    return subtypes || ''
  }
  
  try {
    const aboutObj = JSON.parse(about)
    const highlights: string[] = []
    
    // Extract highlights
    if (aboutObj.Highlights) {
      const highlightKeys = Object.keys(aboutObj.Highlights).filter(k => aboutObj.Highlights[k] === true)
      highlights.push(...highlightKeys.slice(0, 3)) // Take top 3
    }
    
    // Extract service options
    if (aboutObj['Service options']) {
      const serviceKeys = Object.keys(aboutObj['Service options']).filter(k => aboutObj['Service options'][k] === true)
      highlights.push(...serviceKeys.slice(0, 2)) // Take top 2
    }
    
    if (highlights.length > 0) {
      return highlights.join(', ').replace(/_/g, ' ')
    }
    
    return subtypes || ''
  } catch (e) {
    return subtypes || ''
  }
}

/**
 * Extract first photo URL from Google photos field
 */
function extractPhotoUrl(photos: string | string[] | undefined): string | null {
  if (!photos) return null
  
  // Handle string (semicolon or comma-separated URLs)
  if (typeof photos === 'string') {
    const urls = photos.split(/[;,]/).map(url => url.trim()).filter(url => url.length > 0)
    return urls[0] || null
  }
  
  // Handle array
  if (Array.isArray(photos) && photos.length > 0) {
    return photos[0]
  }
  
  return null
}

/**
 * Transform a single Google business to our database format
 * Returns null if primary category is not in our whitelist
 */
export function transformGoogleBusiness(googleData: GoogleBusinessData): TransformedBusiness | null {
  const now = new Date().toISOString()
  
  // Normalize primary category
  const primaryCategory = normalizeCategory(googleData.category)
  
  // If primary category is not valid, reject this business
  if (!primaryCategory) {
    console.log(`❌ Rejected business "${googleData.name}" - invalid primary category: "${googleData.category}"`)
    return null
  }
  
  // Parse categories array and get unmapped categories
  // Pass name, description, and type for keyword analysis
  const parsedResult = parseSubtypes(
    googleData.subtypes, 
    primaryCategory, 
    googleData.working_hours,
    googleData.name,
    googleData.about,
    googleData.type
  )
  const unmappedCategories = parsedResult.unmapped
  
  // Flag for manual review if there are unmapped categories
  const needsManualCategorization = unmappedCategories.length > 0
  
  if (needsManualCategorization) {
    console.log(`⚠️  Business "${googleData.name}" has unmapped categories: ${unmappedCategories.join(', ')}`)
  }
  
  // Extract photo URL for download
  const photoUrl = extractPhotoUrl(googleData.photo)
  
  return {
    name: googleData.name,
    primary_category: primaryCategory,
    categories: parsedResult.categories, // Legacy field (same as categories_array)
    categories_array: parsedResult.categories,
    address: googleData.full_address || '',
    city: googleData.city,
    state: googleData.state,
    latitude: googleData.latitude,
    longitude: googleData.longitude,
    rating: googleData.rating || 0,
    reviews_count: googleData.reviews || 0,
    website: googleData.site || '',
    phone: googleData.phone || '',
    description: generateDescription(googleData.about, googleData.subtypes),
    google_types: googleData.type ? [googleData.type.toLowerCase()] : [],
    opening_hours: convertWorkingHours(googleData.working_hours_old_format),
    photos: [], // Don't store Google photo URLs in photos array
    google_photo_url: photoUrl || undefined, // Store for download processing
    priority_tier: 1, // Free tier
    created_at: now,
    updated_at: now,
    tier_updated_at: now,
    // Metadata for manual review
    unmapped_categories: needsManualCategorization ? unmappedCategories : undefined,
    needs_manual_categorization: needsManualCategorization,
  }
}

/**
 * Validate transformed business data
 */
export function validateBusiness(business: TransformedBusiness): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Required fields
  if (!business.name) errors.push('Missing name')
  if (!business.city) errors.push('Missing city')
  if (!business.state) errors.push('Missing state')
  if (!business.primary_category) errors.push('Missing primary_category')
  
  // Valid coordinates
  if (typeof business.latitude !== 'number' || business.latitude === 0) {
    errors.push('Invalid latitude')
  }
  if (typeof business.longitude !== 'number' || business.longitude === 0) {
    errors.push('Invalid longitude')
  }
  
  // Valid rating
  if (business.rating < 0 || business.rating > 5) {
    errors.push('Invalid rating (must be 0-5)')
  }
  
  // Gulf Coast region check (basic)
  const gulfCoastStates = ['Florida', 'Alabama', 'Mississippi', 'Louisiana', 'Texas']
  if (!gulfCoastStates.includes(business.state)) {
    errors.push(`Not in Gulf Coast region: ${business.state}`)
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
