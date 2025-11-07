const fs = require('fs');
const path = require('path');

try {
  // Read the current business data
  const dataFile = path.join(process.cwd(), 'src', 'data', 'businesses-fallback.json');
  const content = fs.readFileSync(dataFile, 'utf-8');
  const data = JSON.parse(content);
  
  console.log('Testing Pensacola category counts...');
  
  // Filter businesses by city and state (like the API does)
  const searchState = 'florida';
  const searchCity = 'pensacola';
  
  let filteredBusinesses = data.businesses.filter((business) => {
    // Quick state check first (most selective)
    if (business.state?.toLowerCase().trim() !== searchState) return false;
    
    // Then city check
    return business.city?.toLowerCase().trim() === searchCity;
  });

  console.log(`Found ${filteredBusinesses.length} businesses for Pensacola, Florida`);

  // Calculate counts for all categories (using the updated list)
  const categoryCounts = {};

  // Initialize all categories to 0 - using the updated list from the API
  const allCategories = [
    'restaurant', 'bar', 'coffee_shop', 'ice_cream', 'seafood_market', 'winery_brewery',
    'lodging', 'accommodations', 'beach', 'beaches-outdoors', 'water_sports', 'boat_tour',
    'fishing_charter', 'scuba_diving', 'surf_shop', 'marina', 'tour_agency', 'historic_landmark',
    'entertainment', 'music_venue', 'nightclub', 'shopping_mall', 'outlet_mall', 'souvenir_shop',
    'farmers_market', 'spa_fitness', 'golf_course', 'car_rental', 'liquor_store',
    // Additional categories found in data
    '24_hours', 'water-activities', 'store', 'meal_delivery', 'bakery', 'clothing_store',
    'food-dining', 'park_recreation', 'tourist_attraction', 'water_sport', 'fishing-charter',
    'professional_services', 'rv_park', 'museum', 'campground', 'convenience_store',
    'art_gallery', 'spa', 'water_sports_equipment_rental_service', 'cafe', 'boat_rental',
    'tours', 'sports_recreation', 'beaches_parks', 'shopping', 'wedding_services', 'automotive'
  ];

  allCategories.forEach(cat => {
    categoryCounts[cat] = 0;
  });

  // Count businesses by their categories
  filteredBusinesses.forEach((business) => {
    if (business.categories && Array.isArray(business.categories)) {
      business.categories.forEach((cat) => {
        if (categoryCounts.hasOwnProperty(cat)) {
          categoryCounts[cat]++;
        }
      });
    } else if (business.category) {
      if (categoryCounts.hasOwnProperty(business.category)) {
        categoryCounts[business.category]++;
      }
    }
  });

  // Show the counts
  console.log('\nCategory counts for Pensacola:');
  Object.entries(categoryCounts)
    .filter(([cat, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

} catch (error) {
  console.error('Error:', error.message);
}

