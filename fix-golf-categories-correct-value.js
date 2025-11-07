const fs = require('fs');
const path = require('path');

try {
  console.log('Reading business data...');
  
  // Read the current business data
  const dataFile = path.join(process.cwd(), 'src', 'data', 'businesses-fallback.json');
  const content = fs.readFileSync(dataFile, 'utf-8');
  const data = JSON.parse(content);
  
  console.log('Total businesses in database:', Object.keys(data.businesses).length);
  
  // Find businesses with "golf" in the name
  const golfBusinesses = Object.values(data.businesses).filter(business => 
    business.name && business.name.toLowerCase().includes('golf')
  );
  
  console.log('Businesses with "golf" in name:', golfBusinesses.length);
  
  let updatedCount = 0;
  const changes = [];
  
  // Process each golf business
  golfBusinesses.forEach(business => {
    const originalCategories = business.categories ? [...business.categories] : [];
    const originalPrimaryCategory = business.primary_category;
    
    // Remove 'recreation' if it exists and add 'golf_course' instead
    if (!business.categories) {
      business.categories = [];
    }
    
    // Remove recreation if it exists
    business.categories = business.categories.filter(cat => cat !== 'recreation');
    
    // Add golf_course if not already present
    if (!business.categories.includes('golf_course')) {
      business.categories.push('golf_course');
    }
    
    // If golf is in the business name, set golf_course as primary category
    if (business.name && business.name.toLowerCase().includes('golf')) {
      business.primary_category = 'golf_course';
    }
    
    // Track changes
    changes.push({
      id: business.id,
      name: business.name,
      originalCategories: originalCategories,
      newCategories: business.categories,
      originalPrimaryCategory: originalPrimaryCategory,
      newPrimaryCategory: business.primary_category
    });
    
    updatedCount++;
  });
  
  // Write the updated data back to file
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  
  console.log(`✅ Successfully updated ${updatedCount} golf businesses`);
  console.log('\n=== CHANGES MADE ===\n');
  
  changes.forEach((change, index) => {
    console.log(`${index + 1}. ${change.name}`);
    console.log(`   ID: ${change.id}`);
    console.log(`   Original Categories: ${change.originalCategories.join(', ')}`);
    console.log(`   New Categories: ${change.newCategories.join(', ')}`);
    console.log(`   Original Primary: ${change.originalPrimaryCategory || 'N/A'}`);
    console.log(`   New Primary: ${change.newPrimaryCategory}`);
    console.log('');
  });
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

