// Category Image Mapping
// This file maps business categories to default static images

export const CATEGORY_IMAGE_MAPPING: { [key: string]: string } = {
  'restaurant': '/images/categories/restaurant-default.jpg',
  'food-dining': '/images/categories/restaurant-default.jpg',
  'coffee_shop': '/images/categories/coffee-shop-default.jpg',
  'ice_cream': '/images/categories/ice-cream-default.jpg',
  'seafood_market': '/images/categories/seafood-market-default.jpg',
  'winery_brewery': '/images/categories/winery-default.jpg',
  'bar': '/images/categories/bar-default.jpg',
  'lodging': '/images/categories/hotel-default.jpg',
  'accommodations': '/images/categories/hotel-default.jpg',
  'hotel': '/images/categories/hotel-default.jpg',
  'water_sports': '/images/categories/water-sports-default.jpg',
  'water-activities': '/images/categories/water-sports-default.jpg',
  'marina': '/images/categories/marina-default.jpg',
  'beach': '/images/categories/beach-default.jpg',
  'boat_tour': '/images/categories/boat-tour-default.jpg',
  'fishing_charter': '/images/categories/fishing-charter-default.jpg',
  'scuba_diving': '/images/categories/scuba-diving-default.jpg',
  'surf_shop': '/images/categories/surf-shop-default.jpg',
  'store': '/images/categories/store-default.jpg',
  'shopping_mall': '/images/categories/shopping-mall-default.jpg',
  'souvenir_shop': '/images/categories/souvenir-shop-default.jpg',
  'farmers_market': '/images/categories/farmers-market-default.jpg',
  'art_gallery': '/images/categories/art-gallery-default.jpg',
  'outlet_mall': '/images/categories/outlet-mall-default.jpg',
  'nightlife-entertainment': '/images/categories/entertainment-default.jpg',
  'music_venue': '/images/categories/music-venue-default.jpg',
  'nightclub': '/images/categories/nightclub-default.jpg',
  'entertainment': '/images/categories/entertainment-default.jpg',
  'park_recreation': '/images/categories/park-default.jpg',
  'golf_course': '/images/categories/golf-course-default.jpg',
  'spa_fitness': '/images/categories/spa-default.jpg',
  'tourist_attraction': '/images/categories/attraction-default.jpg',
  'tour_agency': '/images/categories/tour-agency-default.jpg',
  'car_rental': '/images/categories/car-rental-default.jpg',
  'professional_services': '/images/categories/services-default.jpg',
  'liquor_store': '/images/categories/liquor-store-default.jpg',
  '24_hours': '/images/categories/24-hours-default.jpg',
  'historic_landmark': '/images/categories/historic-landmark-default.jpg',
  'rv_park': '/images/categories/rv-park-default.jpg',
};

// Helper function to get category image URL
export function getCategoryImageUrl(category: string): string {
  return CATEGORY_IMAGE_MAPPING[category] || '/images/categories/default-business.jpg';
}

// Helper function to get all available category images
export function getAllCategoryImages(): string[] {
  return Object.values(CATEGORY_IMAGE_MAPPING);
}

// Helper function to check if a category has a default image
export function hasCategoryImage(category: string): boolean {
  return category in CATEGORY_IMAGE_MAPPING;
}
