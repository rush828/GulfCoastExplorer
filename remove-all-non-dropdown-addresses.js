const fs = require('fs');
const path = require('path');

// Louisiana cities that ARE in the dropdown (keep these)
const dropdownCities = [
  'Grand Isle',
  'Lafitte', 
  'Port Fourchon',
  'Cocodrie',
  'Dulac',
  'Montegut',
  'Golden Meadow',
  'Cut Off',
  'Galliano'
];

console.log('Loading data...');
const dataFile = path.join(__dirname, 'data', 'businesses-fallback.json');
const content = fs.readFileSync(dataFile, 'utf-8');
const data = JSON.parse(content);

console.log(`Total businesses before cleanup: ${data.businesses.length}`);

// Get all Louisiana businesses
const louisianaBusinesses = data.businesses.filter(business => business.state === 'Louisiana');
console.log(`Louisiana businesses before cleanup: ${louisianaBusinesses.length}`);

// Find businesses to remove (those with addresses in cities not in dropdown)
const businessesToRemove = louisianaBusinesses.filter(business => {
  if (!business.address) return false;
  
  // Extract city from address (second part after comma)
  const addressParts = business.address.split(',');
  if (addressParts.length >= 2) {
    const addressCity = addressParts[1].trim();
    
    // Check if the address city is in our dropdown
    const isInDropdown = dropdownCities.some(dropdownCity => 
      addressCity.toLowerCase().includes(dropdownCity.toLowerCase()) ||
      dropdownCity.toLowerCase().includes(addressCity.toLowerCase())
    );
    
    return !isInDropdown;
  }
  return false;
});

console.log(`Louisiana businesses to remove: ${businessesToRemove.length}`);

// Show what we're removing (first 20)
console.log('\nFirst 20 businesses being removed:');
businessesToRemove.slice(0, 20).forEach(business => {
  const addressCity = business.address.split(',')[1]?.trim();
  console.log(`- ${business.name} | Assigned City: ${business.city} | Address City: ${addressCity}`);
});

if (businessesToRemove.length > 20) {
  console.log(`... and ${businessesToRemove.length - 20} more businesses`);
}

// Remove the businesses
const cleanedBusinesses = data.businesses.filter(business => 
  !(business.state === 'Louisiana' && 
    business.address && 
    (() => {
      const addressParts = business.address.split(',');
      if (addressParts.length >= 2) {
        const addressCity = addressParts[1].trim();
        return !dropdownCities.some(dropdownCity => 
          addressCity.toLowerCase().includes(dropdownCity.toLowerCase()) ||
          dropdownCity.toLowerCase().includes(addressCity.toLowerCase())
        );
      }
      return false;
    })())
);

console.log(`\nTotal businesses after cleanup: ${cleanedBusinesses.length}`);
console.log(`Businesses removed: ${data.businesses.length - cleanedBusinesses.length}`);

// Verify Louisiana businesses remaining
const remainingLouisiana = cleanedBusinesses.filter(b => b.state === 'Louisiana');
console.log(`Louisiana businesses remaining: ${remainingLouisiana.length}`);

// Update the data
data.businesses = cleanedBusinesses;

// Write the cleaned data
console.log('\nWriting cleaned data...');
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
console.log('All non-dropdown address businesses removal complete!');
