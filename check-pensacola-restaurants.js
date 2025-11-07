const fs = require('fs');
const path = require('path');

try {
  // Read the current business data
  const dataFile = path.join(process.cwd(), 'src', 'data', 'businesses-fallback.json');
  const content = fs.readFileSync(dataFile, 'utf-8');
  const data = JSON.parse(content);
  
  console.log('Total businesses in database:', Object.keys(data.businesses).length);
  
  // Check Pensacola restaurants specifically
  const pensacolaRestaurants = Object.values(data.businesses).filter(business => 
    business.city && business.city.toLowerCase() === 'pensacola' &&
    business.categories && business.categories.includes('restaurant')
  );
  
  console.log('Pensacola restaurants:', pensacolaRestaurants.length);
  
  // Show first few
  pensacolaRestaurants.slice(0, 5).forEach((business, index) => {
    console.log(`${index + 1}. ${business.name}`);
    console.log(`   City: ${business.city}, State: ${business.state}`);
    console.log(`   Categories: ${business.categories.join(', ')}`);
    console.log('');
  });
  
  // Check if there are restaurants from other cities
  const allRestaurants = Object.values(data.businesses).filter(business => 
    business.categories && business.categories.includes('restaurant')
  );
  
  console.log('Total restaurants in database:', allRestaurants.length);
  
  // Check city distribution of restaurants
  const cityCounts = {};
  allRestaurants.forEach(business => {
    const city = business.city || 'unknown';
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });
  
  console.log('Restaurant distribution by city:');
  Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([city, count]) => {
      console.log(`  ${city}: ${count}`);
    });
  
} catch (error) {
  console.error('Error:', error.message);
}

