const fs = require('fs');
const path = require('path');

// Read the businesses data
const dataPath = path.join(__dirname, 'src', 'data', 'businesses-fallback.json');
const businesses = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log(`Starting with ${businesses.length} businesses`);

// Filter out any business that has "New Orleans" anywhere in their data
const filteredBusinesses = businesses.filter(business => {
  // Convert business object to string and check if it contains "New Orleans" (case insensitive)
  const businessString = JSON.stringify(business).toLowerCase();
  return !businessString.includes('new orleans');
});

console.log(`After removing New Orleans businesses: ${filteredBusinesses.length} businesses`);
console.log(`Removed ${businesses.length - filteredBusinesses.length} businesses`);

// Write the filtered data back
fs.writeFileSync(dataPath, JSON.stringify(filteredBusinesses, null, 2));

console.log('New Orleans businesses successfully removed!');
