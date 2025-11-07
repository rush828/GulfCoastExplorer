const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyBwUqHwxUZaIWuLJt_MiO3VjL6FJokmZ_w';
const DATA_FILE = './src/data/businesses-fallback.json';
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
async function downloadAllThumbnails() {
  try {
    console.log('Loading all businesses...');
    
    // Load the businesses data
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const businesses = data.businesses || [];
    
    console.log(`Found ${businesses.length} total businesses`);
    
    let downloaded = 0;
    let skipped = 0;
    let errors = 0;
    const results = [];
    
    // Process businesses in batches to avoid overwhelming the API
    const batchSize = 50;
    const totalBatches = Math.ceil(businesses.length / batchSize);
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const startIndex = batchIndex * batchSize;
      const endIndex = Math.min(startIndex + batchSize, businesses.length);
      const batch = businesses.slice(startIndex, endIndex);
      
      console.log(`\n=== Processing Batch ${batchIndex + 1}/${totalBatches} (${startIndex + 1}-${endIndex}) ===`);
      
      for (const business of batch) {
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
          
          console.log(`Downloading ${business.name} (${business.city}, ${business.state})...`);
          
          // Download the image
          await downloadImage(photoUrl, filename);
          
          downloaded++;
          results.push({
            id: business.id,
            name: business.name,
            city: business.city,
            state: business.state,
            status: 'downloaded'
          });
          
          console.log(`✅ Downloaded ${business.name} (${downloaded} total downloaded)`);
          
          // Add a small delay to be respectful to Google's API
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error(`❌ Error downloading ${business.name}:`, error.message);
          errors++;
          results.push({
            id: business.id,
            name: business.name,
            city: business.city,
            state: business.state,
            status: 'error',
            error: error.message
          });
        }
      }
      
      // Save progress after each batch
      const progressFile = './download-progress.json';
      fs.writeFileSync(progressFile, JSON.stringify({
        batch: batchIndex + 1,
        totalBatches,
        downloaded,
        skipped,
        errors,
        cost: downloaded * 0.007
      }, null, 2));
      
      console.log(`Batch ${batchIndex + 1} complete. Downloaded: ${downloaded}, Skipped: ${skipped}, Errors: ${errors}`);
      
      // Longer delay between batches
      if (batchIndex < totalBatches - 1) {
        console.log('Waiting 2 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Save final results to file
    const resultsFile = './all-thumbnails-download-results.json';
    fs.writeFileSync(resultsFile, JSON.stringify({
      summary: {
        total: businesses.length,
        downloaded,
        skipped,
        errors,
        cost: downloaded * 0.007
      },
      results
    }, null, 2));
    
    console.log('\n=== DOWNLOAD COMPLETE ===');
    console.log(`Total businesses: ${businesses.length}`);
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
downloadAllThumbnails();
