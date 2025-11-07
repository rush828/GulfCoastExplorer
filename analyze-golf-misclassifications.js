const fs = require('fs');
const path = require('path');

// Read the businesses data
const dataPath = path.join(__dirname, 'src', 'data', 'businesses-fallback.json');
console.log('Reading data from:', dataPath);
const businesses = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
console.log('Total businesses loaded:', Object.keys(businesses).length);

console.log('=== GOLF BUSINESS MISCLASSIFICATION ANALYSIS ===\n');

// Find all businesses with "golf" in their name
const golfBusinesses = Object.values(businesses).filter(business => 
  business && business.name && business.name.toLowerCase().includes('golf')
);

console.log(`Found ${golfBusinesses.length} businesses with "golf" in their name:\n`);

// Categorize them by their current classification
const misclassified = [];
const correctlyClassified = [];

golfBusinesses.forEach(business => {
  const name = business.name;
  const category = business.category;
  const primaryCategory = business.primary_category;
  
  // Check if it's correctly classified as golf_course
  if (category === 'golf_course' || primaryCategory === 'golf_course') {
    correctlyClassified.push({
      name,
      category,
      primaryCategory,
      id: business.id
    });
  } else {
    // Check if it should be golf_course based on name patterns
    const golfKeywords = ['golf club', 'golf course', 'golf center', 'golf resort', 'country club'];
    const shouldBeGolf = golfKeywords.some(keyword => 
      name.toLowerCase().includes(keyword)
    );
    
    if (shouldBeGolf) {
      misclassified.push({
        name,
        category,
        primaryCategory,
        id: business.id,
        address: business.address,
        city: business.city,
        state: business.state
      });
    }
  }
});

console.log('=== CORRECTLY CLASSIFIED GOLF BUSINESSES ===');
correctlyClassified.forEach(business => {
  console.log(`✓ ${business.name}`);
  console.log(`  Category: ${business.category}, Primary: ${business.primaryCategory}`);
  console.log(`  ID: ${business.id}\n`);
});

console.log('\n=== MISCLASSIFIED GOLF BUSINESSES ===');
misclassified.forEach(business => {
  console.log(`✗ ${business.name}`);
  console.log(`  Current Category: ${business.category}`);
  console.log(`  Current Primary: ${business.primaryCategory}`);
  console.log(`  Should be: golf_course`);
  console.log(`  Address: ${business.address}`);
  console.log(`  City: ${business.city}, ${business.state}`);
  console.log(`  ID: ${business.id}\n`);
});

console.log(`\nSUMMARY:`);
console.log(`- Correctly classified: ${correctlyClassified.length}`);
console.log(`- Misclassified: ${misclassified.length}`);
console.log(`- Total golf businesses: ${golfBusinesses.length}`);

// Also check for businesses that might be golf-related but don't have "golf" in the name
console.log('\n=== CHECKING FOR OTHER GOLF-RELATED BUSINESSES ===');
const otherGolfRelated = Object.values(businesses).filter(business => {
  if (!business || !business.name) return false;
  const name = business.name.toLowerCase();
  const description = (business.description || '').toLowerCase();
  
  return (
    name.includes('country club') ||
    name.includes('pga') ||
    name.includes('putting') ||
    name.includes('driving range') ||
    description.includes('golf course') ||
    description.includes('golf club')
  ) && business.category !== 'golf_course' && business.primary_category !== 'golf_course';
});

if (otherGolfRelated.length > 0) {
  console.log(`Found ${otherGolfRelated.length} other golf-related businesses:`);
  otherGolfRelated.forEach(business => {
    console.log(`- ${business.name} (${business.category}/${business.primary_category})`);
  });
} else {
  console.log('No other golf-related businesses found.');
}
