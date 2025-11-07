const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyBwUqHwxUZaIWuLJt_MiO3VjL6FJokmZ_w';
const MISSISSIPPI_DATA_FILE = './src/data/businesses-fallback.json';
const THUMBNAILS_DIR = './public/images/thumbnails';
const MAX_WIDTH = 400;

// Ensure thumbnails directory exists
if (!fs.existsSync(THUMBNAILS_DIR)) {
  fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
}

// Download function with redirect support
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    
    const makeRequest = (requestUrl) => {
      https.get(requestUrl, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        } else if (response.statusCode === 302 || response.statusCode === 301) {
          // Follow redirect
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            makeRequest(redirectUrl);
          } else {
            reject(new Error(`Redirect without location header: ${response.statusCode}`));
          }
        } else {
          reject(new Error(`Failed to download: ${response.statusCode}`));
        }
      }).on('error', (err) => {
        fs.unlink(filename, () => {}); // Delete the file on error
        reject(err);
      });
    };
    
    makeRequest(url);
  });
}

// Main function
async function downloadMississippiThumbnails() {
  try {
    console.log('Loading Mississippi businesses...');
    
    // Load the businesses data
    const data = JSON.parse(fs.readFileSync(MISSISSIPPI_DATA_FILE, 'utf8'));
    const businesses = data.businesses || [];
    
    // Filter for Dulac, Louisiana businesses
    const dulacBusinesses = businesses.filter(business => 
      business.state && business.state.toLowerCase() === 'louisiana' &&
      business.city && business.city.toLowerCase() === 'dulac'
    );
    
    console.log(`Found ${dulacBusinesses.length} Dulac, Louisiana businesses`);
    
    let downloaded = 0;
    let skipped = 0;
    let errors = 0;
    const results = [];
    
    for (const business of dulacBusinesses) {
      try {
        // Check if business has photos
        if (!business.photos || business.photos.length === 0) {
          console.log(`Skipping ${business.name} - no photos`);
          skipped++;
          continue;
        }
        
        // Get the first photo URL
        const photoUrl = business.photos[0];
        
        // Clean the business ID for filename (remove invalid characters)
        const cleanId = business.id.replace(/[<>:"/\\|?*]/g, '_');
        const filename = path.join(THUMBNAILS_DIR, `${cleanId}.jpg`);
        
        // Check if file already exists
        if (fs.existsSync(filename)) {
          console.log(`Skipping ${business.name} - already downloaded`);
          skipped++;
          continue;
        }
        
        console.log(`Downloading ${business.name}...`);
        console.log(`URL: ${photoUrl}`);
        
        // Download the image
        await downloadImage(photoUrl, filename);
        
        downloaded++;
        results.push({
          id: business.id,
          name: business.name,
          city: business.city,
          status: 'downloaded'
        });
        
        console.log(`✅ Downloaded ${business.name} (${downloaded}/${dulacBusinesses.length})`);
        
        // Add a small delay to be respectful to Google's API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Error downloading ${business.name}:`, error.message);
        errors++;
        results.push({
          id: business.id,
          name: business.name,
          city: business.city,
          status: 'error',
          error: error.message
        });
      }
    }
    
    // Save results to file
    const resultsFile = './mississippi-download-results.json';
    fs.writeFileSync(resultsFile, JSON.stringify({
      summary: {
        total: mississippiBusinesses.length,
        downloaded,
        skipped,
        errors,
        cost: downloaded * 0.007
      },
      results
    }, null, 2));
    
    console.log('\n=== DOWNLOAD COMPLETE ===');
    console.log(`Total businesses: ${dulacBusinesses.length}`);
    console.log(`Downloaded: ${downloaded}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Errors: ${errors}`);
    console.log(`Estimated cost: $${(downloaded * 0.007).toFixed(2)}`);
    console.log(`Results saved to: ${resultsFile}`);
    
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

// Run the script
downloadMississippiThumbnails();
