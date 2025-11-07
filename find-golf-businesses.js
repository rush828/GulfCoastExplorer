const fs = require('fs');
const path = require('path');

try {
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
  
  // Check which ones are NOT assigned to sports and recreation category
  const incorrectGolfBusinesses = golfBusinesses.filter(business => {
    const categories = business.categories || [];
    const hasSportsRecreation = categories.some(cat => 
      cat.toLowerCase().includes('sport') || 
      cat.toLowerCase().includes('recreation') ||
      cat.toLowerCase().includes('golf')
    );
    
    return !hasSportsRecreation;
  });
  
  console.log('Golf businesses NOT assigned to sports/recreation:', incorrectGolfBusinesses.length);
  console.log('\n=== INCORRECTLY CATEGORIZED GOLF BUSINESSES ===\n');
  
  incorrectGolfBusinesses.forEach((business, index) => {
    console.log(`${index + 1}. ${business.name}`);
    console.log(`   ID: ${business.id}`);
    console.log(`   Current Category: ${business.category}`);
    console.log(`   Primary Category: ${business.primary_category || 'N/A'}`);
    console.log(`   Categories: ${business.categories ? business.categories.join(', ') : 'N/A'}`);
    console.log(`   City: ${business.city}, ${business.state}`);
    console.log(`   Address: ${business.address}`);
    console.log('');
  });
  
  // Also show correctly categorized golf businesses for comparison
  const correctGolfBusinesses = golfBusinesses.filter(business => {
    const categories = business.categories || [];
    const hasSportsRecreation = categories.some(cat => 
      cat.toLowerCase().includes('sport') || 
      cat.toLowerCase().includes('recreation') ||
      cat.toLowerCase().includes('golf')
    );
    
    return hasSportsRecreation;
  });
  
  console.log('\n=== CORRECTLY CATEGORIZED GOLF BUSINESSES ===\n');
  console.log(`Count: ${correctGolfBusinesses.length}`);
  
  correctGolfBusinesses.forEach((business, index) => {
    console.log(`${index + 1}. ${business.name}`);
    console.log(`   Categories: ${business.categories ? business.categories.join(', ') : 'N/A'}`);
    console.log('');
  });
  
} catch (error) {
  console.error('Error:', error.message);
}

