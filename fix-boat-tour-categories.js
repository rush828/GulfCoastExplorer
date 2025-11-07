const fs = require('fs').promises;
const path = require('path');

async function fixBoatTourCategories() {
  try {
    console.log('🔧 Fixing boat_tour businesses to include water-activities in categories array...');
    
    // Load data
    const dataFile = path.join(__dirname, 'src', 'data', 'businesses-fallback.json');
    const content = await fs.readFile(dataFile, 'utf-8');
    const data = JSON.parse(content);
    
    let businesses = [];
    if (data.businesses) {
      if (Array.isArray(data.businesses)) {
        businesses = data.businesses;
      } else if (typeof data.businesses === 'object') {
        businesses = Object.values(data.businesses);
      }
    } else if (Array.isArray(data)) {
      businesses = data;
    }

    // Create backup
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupPath = path.join(__dirname, 'src', 'data', `businesses-fallback-backup-before-boat-tour-fix-${timestamp}.json`);
    await fs.writeFile(backupPath, content, 'utf-8');
    console.log(`✅ Backup created: ${backupPath}`);

    let changesMade = 0;

    // Find businesses with boat_tour as primary category
    const boatTourBusinesses = businesses.filter(business => 
      business.primary_category === 'boat_tour'
    );

    console.log(`\n🔍 Found ${boatTourBusinesses.length} businesses with boat_tour as primary category`);

    boatTourBusinesses.forEach(business => {
      let businessChanged = false;

      // Add water-activities to categories array if not present
      if (!business.categories_array) {
        business.categories_array = [];
      }

      if (!business.categories_array.includes('water-activities')) {
        business.categories_array.push('water-activities');
        businessChanged = true;
        console.log(`🎯 Added water-activities to: ${business.name} (${business.city}, ${business.state})`);
      }

      if (businessChanged) {
        changesMade++;
      }
    });

    console.log(`\n📊 Summary:`);
    console.log(`- Businesses processed: ${boatTourBusinesses.length}`);
    console.log(`- Changes made: ${changesMade}`);

    if (changesMade > 0) {
      // Save updated data
      console.log('\n💾 Saving updated data...');
      if (data.businesses) {
        if (Array.isArray(data.businesses)) {
          data.businesses = businesses;
        } else {
          const updatedBusinessesObject = businesses.reduce((acc, b) => {
            acc[b.id] = b;
            return acc;
          }, {});
          data.businesses = updatedBusinessesObject;
        }
      } else {
        data = businesses;
      }
      
      await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf-8');
      console.log('✅ Data saved successfully!');

      // Verify the fix for Frisky Mermaid
      console.log('\n🔍 Verifying fix for Frisky Mermaid...');
      const frisky = businesses.find(b => b.name.includes('Frisky Mermaid'));
      if (frisky) {
        console.log(`- Name: ${frisky.name}`);
        console.log(`- Primary Category: ${frisky.primary_category}`);
        console.log(`- Categories Array: [${frisky.categories_array.join(', ')}]`);
      }
    } else {
      console.log('\nℹ️ No changes needed - all boat_tour businesses already have water-activities in their categories array.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixBoatTourCategories();
