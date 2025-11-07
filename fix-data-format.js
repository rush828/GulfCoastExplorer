const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing data format...');

// Read the current data
const dataPath = path.join(__dirname, 'src', 'data', 'businesses-fallback.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const businesses = JSON.parse(rawData);

console.log(`📊 Current data: ${businesses.length} businesses (direct array)`);

// Convert to the expected format
const formattedData = {
  businesses: businesses
};

// Save back in the correct format
fs.writeFileSync(dataPath, JSON.stringify(formattedData, null, 2));

console.log('✅ Data format fixed! Now has { "businesses": [...] } structure');
