const http = require('http');

// Test the category counts API directly
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/category-counts?city=pensacola&state=florida',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Raw API Response:');
    console.log(data);
    
    try {
      const result = JSON.parse(data);
      console.log('\nParsed Response:');
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error parsing response:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error.message);
});

req.end();

