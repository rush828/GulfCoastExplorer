const fs = require('fs');

// Read the business data
const data = JSON.parse(fs.readFileSync('src/data/businesses-fallback.json', 'utf8'));
const businesses = data.businesses || data;

// Find businesses with "hotel" in their name
const hotelBusinesses = businesses.filter(business => {
  return business.name && business.name.toLowerCase().includes('hotel');
});

console.log(`Found ${hotelBusinesses.length} businesses with "hotel" in their name:`);
console.log('================================================\n');

// Filter to only show businesses that do NOT have lodging as primary (unless they have RV)
const needUpdate = hotelBusinesses.filter(business => {
  const name = business.name.toLowerCase();
  const hasRV = name.includes('rv');
  const hasLodging = business.primary_category === 'lodging';
  const hasRVCategory = business.primary_category === 'rv_park';
  
  // If it has RV, it should have rv_park as primary
  if (hasRV) {
    return !hasRVCategory;
  }
  // If it doesn't have RV, it should have lodging as primary
  else {
    return !hasLodging;
  }
});

console.log(`${needUpdate.length} need updating:`);
console.log('================================================\n');

needUpdate.forEach((business, index) => {
  const name = business.name.toLowerCase();
  const hasRV = name.includes('rv');
  const expectedPrimary = hasRV ? 'rv_park' : 'lodging';
  
  console.log(`${index + 1}. ${business.name}`);
  console.log(`   Has "RV": ${hasRV}`);
  console.log(`   Expected primary: ${expectedPrimary}`);
  console.log(`   Current primary: ${business.primary_category || 'Not set'}`);
  console.log(`   Categories: ${business.categories ? business.categories.join(', ') : 'None'}`);
  console.log(`   City: ${business.city}, ${business.state}`);
  console.log('');
});

console.log(`\nSummary:`);
console.log(`Total hotel businesses: ${hotelBusinesses.length}`);
console.log(`Need primary category update: ${needUpdate.length}`);

