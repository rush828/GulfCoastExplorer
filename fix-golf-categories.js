const fs = require('fs');
const path = require('path');

try {
  console.log('Reading business data...');
  
  // Read the current business data
  const dataFile = path.join(process.cwd(), 'src', 'data', 'businesses-fallback.json');
  const content = fs.readFileSync(dataFile, 'utf-8');
  const data = JSON.parse(content);
  
  console.log('Total businesses in database:', Object.keys(data.businesses).length);
  
  // List of businesses with golf in name that need fixing
  const golfBusinessesToFix = [
    'crystal_beach_beach_golf_of_america_pizza_at_the_gulf_range_589',
    'dauphin_island_beach_kiva_dunes_resort_and_golf_671',
    'destin_lodging_sandestin_golf_and_beach_resort_consolidated',
    'diamondhead_beach_diamondhead_golf_course_816',
    'pensacola_lodging_lost_key_golf_club_904',
    'fairhope_lodging_grand_hotel_golf_resort_&_spa,_autograph_collection_1024',
    'pensacola_golf_course_pensacola_golf_center_3205',
    'pensacola_golf_course_marcus_pointe_golf_club_3207',
    'pensacola_golf_course_osceola_municipal_golf_course_3208',
    'pensacola_golf_course_scenic_hills_country_club_-_golf_•_restaurant_•_events_3209',
    'pensacola_golf_course_nas_penscola_golf_course_3210',
    'pensacola_golf_course_perdido_bay_golf_course_3211',
    'pensacola_golf_course_pensacola_golf_club_3212',
    'bolivar_peninsula_car_rental_crystal_beach_golf_carts_consolidated',
    'bolivar_peninsula_tour_agency_it\'s_a_beach_thing:_golf_cart_rental_consolidated',
    'bolivar_peninsula_car_rental_west_canal_beach_buggies:_golf_cart_rental_and_service_consolidated',
    'bolivar_peninsula_car_rental_jay\'s_golf_carts_consolidated',
    'cut_off_entertainment_tidelands_golf_and_country_club_consolidated',
    'pirate_s_island_adventure_golf_gulf_shores_entertainment',
    'sage_golf_cart_rentals_navarre_beach_water_sport',
    'golfcarts2you_orange_beach_car_rental',
    'rainforest_black_light_golf___arcade_panama_city_beach_entertainment',
    'island_outfitters__port_aransas_golf_carts_port_aransas_car_rental',
    'paradise_fun_rentals___golf_cart__slingshot___bicycle_rentals_spi__d__south_padre_island_car_rental',
    'paradise_fun_rentals___golf_cart__slingshot___bicycle_rentals_spi__c__south_padre_island_car_rental',
    'paradise_fun_rentals___golf_cart__slingshot___bicycle_rentals_spi__b__south_padre_island_car_rental',
    'paradise_fun_rentals___golf_cart__slingshot___bicycle_rentals_spi_south_padre_island_car_rental'
  ];
  
  let updatedCount = 0;
  const changes = [];
  
  // Process each business
  golfBusinessesToFix.forEach(businessId => {
    const business = data.businesses[businessId];
    if (business) {
      const originalCategories = business.categories ? [...business.categories] : [];
      const originalPrimaryCategory = business.primary_category;
      
      // Add recreation to categories if not already present
      if (!business.categories) {
        business.categories = [];
      }
      
      if (!business.categories.includes('recreation')) {
        business.categories.push('recreation');
      }
      
      // If golf is in the business name, set recreation as primary category
      if (business.name && business.name.toLowerCase().includes('golf')) {
        business.primary_category = 'recreation';
      }
      
      // Track changes
      changes.push({
        id: businessId,
        name: business.name,
        originalCategories: originalCategories,
        newCategories: business.categories,
        originalPrimaryCategory: originalPrimaryCategory,
        newPrimaryCategory: business.primary_category
      });
      
      updatedCount++;
    } else {
      console.log(`Business not found: ${businessId}`);
    }
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

