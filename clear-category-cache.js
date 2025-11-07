const fs = require('fs');
const path = require('path');

try {
  console.log('Clearing category counts cache...');
  
  // The cache is in memory, so we need to restart the server or clear it programmatically
  // Let's create a simple script that can be run to clear the cache
  
  console.log('Category counts cache is stored in memory and will be cleared when the server restarts.');
  console.log('To force a cache clear, you can:');
  console.log('1. Restart your development server (npm run dev)');
  console.log('2. Or wait 30 minutes for the cache to expire');
  
  // Let's also check what categories are actually being used in the data
  const dataFile = path.join(process.cwd(), 'src', 'data', 'businesses-fallback.json');
  const content = fs.readFileSync(dataFile, 'utf-8');
  const data = JSON.parse(content);
  
  console.log('\nAnalyzing actual categories in the data...');
  
  // Get all unique categories from the data
  const allCategories = new Set();
  Object.values(data.businesses).forEach(business => {
    if (business.categories && Array.isArray(business.categories)) {
      business.categories.forEach(cat => allCategories.add(cat));
    }
    if (business.category) {
      allCategories.add(business.category);
    }
  });
  
  console.log(`Found ${allCategories.size} unique categories in the data:`);
  Array.from(allCategories).sort().forEach(cat => {
    console.log(`  - ${cat}`);
  });
  
  // Check what categories are in the API
  const apiCategories = [
    'restaurant', 'bar', 'coffee_shop', 'ice_cream', 'seafood_market', 'winery_brewery',
    'lodging', 'accommodations', 'beach', 'beaches-outdoors', 'water_sports', 'boat_tour',
    'fishing_charter', 'scuba_diving', 'surf_shop', 'marina', 'tour_agency', 'historic_landmark',
    'entertainment', 'music_venue', 'nightclub', 'shopping_mall', 'outlet_mall', 'souvenir_shop',
    'farmers_market', 'spa_fitness', 'golf_course', 'car_rental', 'liquor_store'
  ];
  
  console.log(`\nAPI is checking for ${apiCategories.length} categories:`);
  apiCategories.forEach(cat => {
    console.log(`  - ${cat}`);
  });
  
  // Find missing categories
  const missingCategories = Array.from(allCategories).filter(cat => !apiCategories.includes(cat));
  console.log(`\nMissing categories in API (${missingCategories.length}):`);
  missingCategories.forEach(cat => {
    console.log(`  - ${cat}`);
  });
  
} catch (error) {
  console.error('Error:', error.message);
}

