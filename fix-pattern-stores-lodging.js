const fs = require('fs');

// Read the data
const data = JSON.parse(fs.readFileSync('src/data/businesses-fallback.json', 'utf8'));
const businesses = data.businesses || data;

console.log('Fixing stores with specific patterns that should not have lodging...');

let fixedCount = 0;

// Get businesses with lodging that match specific store patterns
const patternStores = businesses.filter(b => {
  if (!b.categories || !b.categories.includes('lodging')) return false;
  
  const name = b.name.toLowerCase();
  
  // Check if it's clearly a hotel/accommodation
  const isHotel = name.includes('hotel') || name.includes('inn') || name.includes('resort') || 
                  name.includes('suites') || name.includes('lodge') || name.includes('bed') || 
                  name.includes('breakfast') || name.includes('accommodation') || 
                  name.includes('stay') || name.includes('overnight') || name.includes('room') || 
                  name.includes('guest') || name.includes('hostel') || name.includes('motel') || 
                  name.includes('villa') || name.includes('cabin') || name.includes('campsite') ||
                  name.includes('rv') || name.includes('campground') || name.includes('b&b') || 
                  name.includes('bnb') || name.includes('beachlodge') || name.includes('beach lodge') ||
                  name.includes('beach resort') || name.includes('beach hotel') || 
                  name.includes('beach inn') || name.includes('beach suites') ||
                  name.includes('casino') || name.includes('house') || name.includes('choice') ||
                  name.includes('marina') || name.includes('park') || name.includes('island') ||
                  name.includes('bay') || name.includes('harbor') || name.includes('cove') ||
                  name.includes('point') || name.includes('isle') || name.includes('square') ||
                  name.includes('grand') || name.includes('coastal') || name.includes('north') ||
                  name.includes('hillside') || name.includes('waterstreet') || name.includes('central') ||
                  name.includes('promenade') || name.includes('panama') || name.includes('pueblo') ||
                  name.includes('galvez') || name.includes('terrell') || name.includes('shoreline') ||
                  name.includes('paradise') || name.includes('florida') || name.includes('santa') ||
                  name.includes('rosa') || name.includes('white') || name.includes('sands') ||
                  name.includes('tarpon') || name.includes('heights') || name.includes('sugarland') ||
                  name.includes('baybrook') || name.includes('palm') || name.includes('ocean') ||
                  name.includes('410') || name.includes('coastal') || name.includes('north') ||
                  name.includes('hillside');
  
  // Check if it matches specific store patterns
  const isPatternStore = name.includes('outfitters') || name.includes('souvenirs') || 
                         name.includes('merchandise') || name.includes('gifts') || 
                         name.includes('trailers') || name.includes('sports') || 
                         name.includes('rentals') || name.includes('service') || 
                         name.includes('works') || name.includes('supply') || 
                         name.includes('goods') || name.includes('emporium') || 
                         name.includes('boutique') || name.includes('gallery') || 
                         name.includes('shoppe') || name.includes('market') || 
                         name.includes('store') || name.includes('shop') || 
                         name.includes('mall') || name.includes('plaza') || 
                         name.includes('center') || name.includes('outlet') || 
                         name.includes('village') || name.includes('station') ||
                         name.includes('watersports') || name.includes('charters') ||
                         name.includes('adventures') || name.includes('tours') ||
                         name.includes('rental') || name.includes('service') ||
                         name.includes('works') || name.includes('supply') ||
                         name.includes('goods') || name.includes('merchandise') ||
                         name.includes('souvenirs') || name.includes('gifts') ||
                         name.includes('liquor') || name.includes('wine') ||
                         name.includes('spirits') || name.includes('beer') ||
                         name.includes('alcohol') || name.includes('tobacco') ||
                         name.includes('smoke') || name.includes('carts') ||
                         name.includes('golf') || name.includes('jet') ||
                         name.includes('ski') || name.includes('kayak') ||
                         name.includes('paddle') || name.includes('surf') ||
                         name.includes('board') || name.includes('rental') ||
                         name.includes('charter') || name.includes('tour') ||
                         name.includes('adventure') || name.includes('service') ||
                         name.includes('works') || name.includes('sales') ||
                         name.includes('supply') || name.includes('goods') ||
                         name.includes('merchandise') || name.includes('souvenirs') ||
                         name.includes('gifts') || name.includes('liquor') ||
                         name.includes('wine') || name.includes('spirits') ||
                         name.includes('beer') || name.includes('alcohol') ||
                         name.includes('tobacco') || name.includes('smoke') ||
                         name.includes('carts') || name.includes('golf') ||
                         name.includes('jet') || name.includes('ski') ||
                         name.includes('kayak') || name.includes('paddle') ||
                         name.includes('surf') || name.includes('board') ||
                         name.includes('rental') || name.includes('charter') ||
                         name.includes('tour') || name.includes('adventure') ||
                         name.includes('service') || name.includes('works') ||
                         name.includes('sales') || name.includes('supply') ||
                         name.includes('goods') || name.includes('merchandise') ||
                         name.includes('souvenirs') || name.includes('gifts');
  
  // Only fix if it matches store patterns but is NOT a hotel
  return isPatternStore && !isHotel;
});

console.log(`Found ${patternStores.length} pattern stores with lodging that should be fixed`);

patternStores.forEach((business, index) => {
  const originalCategories = [...business.categories];
  business.categories = business.categories.filter(cat => cat !== 'lodging');
  
  // Update primary category if it was lodging
  if (business.primary_category === 'lodging') {
    if (business.categories.includes('shopping_mall')) {
      business.primary_category = 'shopping_mall';
    } else if (business.categories.includes('liquor_store')) {
      business.primary_category = 'liquor_store';
    } else if (business.categories.includes('clothing_store')) {
      business.primary_category = 'clothing_store';
    } else if (business.categories.includes('marina')) {
      business.primary_category = 'marina';
    } else if (business.categories.includes('convenience_store')) {
      business.primary_category = 'convenience_store';
    } else if (business.categories.includes('tour_agency')) {
      business.primary_category = 'tour_agency';
    } else if (business.categories.includes('fishing-charter')) {
      business.primary_category = 'fishing-charter';
    } else if (business.categories.includes('water_sports')) {
      business.primary_category = 'water_sports';
    } else if (business.categories.includes('car_rental')) {
      business.primary_category = 'car_rental';
    } else if (business.categories.includes('tourist_attraction')) {
      business.primary_category = 'tourist_attraction';
    } else {
      business.primary_category = 'shopping';
    }
  }
  
  fixedCount++;
  console.log(`FIXED: ${business.name} - Removed lodging`);
  console.log(`  Before: ${originalCategories.join(', ')}`);
  console.log(`  After: ${business.categories.join(', ')}`);
  console.log(`  Primary: ${business.primary_category}`);
  console.log('');
});

// Save the updated data
fs.writeFileSync('src/data/businesses-fallback.json', JSON.stringify(data, null, 2));

console.log('\n=== FIX SUMMARY ===');
console.log(`Fixed pattern stores with lodging: ${fixedCount}`);

// Verify the fix
const remaining = businesses.filter(b => {
  if (!b.categories || !b.categories.includes('lodging')) return false;
  const name = b.name.toLowerCase();
  const isStore = name.includes('store') || name.includes('shop') || name.includes('market') || 
                  name.includes('mall') || name.includes('plaza') || name.includes('center');
  return isStore;
});
console.log(`Remaining stores with lodging: ${remaining.length}`);

console.log('\nData has been updated and saved!');

