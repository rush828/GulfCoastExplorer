const fs = require('fs');

// Read the business data
const data = JSON.parse(fs.readFileSync('src/data/businesses-fallback.json', 'utf8'));
const businesses = data.businesses || data;

// Create backup first
const backupData = JSON.parse(JSON.stringify(data));
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
fs.writeFileSync(`src/data/businesses-backup-hotel-fix-${timestamp}.json`, JSON.stringify(backupData, null, 2));
console.log('Backup created successfully');

// Find businesses with "hotel" in their name that need updating
const hotelBusinesses = businesses.filter(business => {
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

console.log(`Found ${hotelBusinesses.length} hotel businesses that need updating:`);
console.log('Updating according to rules...\n');

let updatedCount = 0;

hotelBusinesses.forEach(business => {
  const name = business.name.toLowerCase();
  let needsUpdate = false;
  let newPrimaryCategory = business.primary_category;
  let newCategories = [...(business.categories || [])];
  
  // Ensure lodging is in categories if not already there
  if (!newCategories.includes('lodging')) {
    newCategories.push('lodging');
    needsUpdate = true;
  }
  
  // Rule 1: If it has "RV" in the name, rv_park should be primary, lodging secondary
  if (name.includes('rv')) {
    if (business.primary_category !== 'rv_park') {
      // Move current primary category to categories array if not already there
      if (business.primary_category && !newCategories.includes(business.primary_category)) {
        newCategories.push(business.primary_category);
        needsUpdate = true;
      }
      
      newPrimaryCategory = 'rv_park';
      needsUpdate = true;
    }
    // Add rv_park to categories if not exists
    if (!newCategories.includes('rv_park')) {
      newCategories.push('rv_park');
      needsUpdate = true;
    }
  }
  // Rule 2: For others, lodging should be primary, move current primary to categories
  else {
    if (business.primary_category !== 'lodging') {
      // Move current primary category to categories array if not already there
      if (business.primary_category && !newCategories.includes(business.primary_category)) {
        newCategories.push(business.primary_category);
        needsUpdate = true;
      }
      
      newPrimaryCategory = 'lodging';
      needsUpdate = true;
    }
  }
  
  if (needsUpdate) {
    business.primary_category = newPrimaryCategory;
    business.categories = newCategories;
    updatedCount++;
    
    console.log(`Updated: ${business.name}`);
    console.log(`  New primary: ${newPrimaryCategory}`);
    console.log(`  Categories: ${newCategories.join(', ')}`);
    console.log(`  City: ${business.city}, ${business.state}`);
    console.log('');
  }
});

// Save the updated data
fs.writeFileSync('src/data/businesses-fallback.json', JSON.stringify(data, null, 2));

console.log(`\nUpdate complete!`);
console.log(`Total hotel businesses processed: ${hotelBusinesses.length}`);
console.log(`Businesses updated: ${updatedCount}`);
console.log(`Backup saved as: src/data/businesses-backup-hotel-fix-${timestamp}.json`);

