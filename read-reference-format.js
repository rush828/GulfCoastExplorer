const XLSX = require('xlsx');

try {
  // Read the reference Excel file
  const referenceFile = 'X:\\WebProjects\\GulfCoastDirectory\\data\\businesses-current-data-2025-09-05T20-45-36.xlsx';
  const workbook = XLSX.readFile(referenceFile);
  
  // Get the first worksheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON to see the structure
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log('Reference file columns (first row):');
  if (data.length > 0) {
    data[0].forEach((col, index) => {
      console.log(`${index + 1}. ${col}`);
    });
  }
  
  console.log('\nTotal columns:', data[0] ? data[0].length : 0);
  console.log('Total rows:', data.length);
  
  // Show a sample row to understand the data structure
  if (data.length > 1) {
    console.log('\nSample data row:');
    const sampleRow = data[1];
    data[0].forEach((col, index) => {
      console.log(`${col}: ${sampleRow[index] || ''}`);
    });
  }
  
} catch (error) {
  console.error('Error reading reference file:', error.message);
}

