const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

try {
  console.log('Reading Pensacola business data...');
  
  // Read the current business data
  const dataFile = path.join(process.cwd(), 'src', 'data', 'businesses-fallback.json');
  const content = fs.readFileSync(dataFile, 'utf-8');
  const data = JSON.parse(content);
  
  console.log('Total businesses in database:', Object.keys(data.businesses).length);
  
  // Filter Pensacola businesses
  const pensacolaBusinesses = Object.values(data.businesses).filter(business => 
    business.city && business.city.toLowerCase() === 'pensacola'
  );
  
  console.log('Pensacola businesses found:', pensacolaBusinesses.length);
  
  if (pensacolaBusinesses.length === 0) {
    console.log('No Pensacola businesses found!');
    process.exit(1);
  }
  
  // Convert businesses to Excel format matching the reference file exactly
  const excelData = pensacolaBusinesses.map(business => {
    return {
      'ID': business.id || '',
      'Name': business.name || '',
      'Category': business.category || '',
      'Primary Category': business.primary_category || '',
      'Categories': business.categories ? business.categories.join(', ') : '',
      'Categories (Array)': business.categories ? JSON.stringify(business.categories) : '',
      'Address': business.address || '',
      'City': business.city || '',
      'State': business.state || '',
      'Latitude': business.latitude || '',
      'Longitude': business.longitude || '',
      'Rating': business.rating || '',
      'Reviews Count': business.reviews_count || '',
      'Website': business.website || '',
      'Phone': business.phone || '',
      'Description': business.description || '',
      'Google Types': business.types ? business.types.join(', ') : '',
      'Opening Hours': business.opening_hours ? business.opening_hours.join('; ') : '',
      'Price Level': business.price_level || '',
      'Photos': business.photos ? business.photos.join('; ') : '',
      'Created At': business.created_at || '',
      'Updated At': business.updated_at || ''
    };
  });
  
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Pensacola Businesses');
  
  // Generate filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `pensacola-businesses-${timestamp}.xlsx`;
  const outputPath = path.join(process.cwd(), 'data', filename);
  
  // Write file
  XLSX.writeFile(wb, outputPath);
  
  console.log(`✅ Successfully exported ${pensacolaBusinesses.length} Pensacola businesses to: ${outputPath}`);
  console.log('✅ Used exact format with all 22 columns from reference file');
  
  // Show summary of categories
  const categoryCounts = {};
  pensacolaBusinesses.forEach(business => {
    const cat = business.category || 'unknown';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  
  console.log('\nCategory breakdown:');
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

