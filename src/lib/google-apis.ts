// Google APIs Integration Module
// Handles data collection, caching, and fallback mechanisms

export interface GooglePlaceData {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  types: string[];
  business_status: string;
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  price_level?: number;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
  website?: string;
  international_phone_number?: string;
  url?: string;
}

export interface GulfCoastLocation {
  name: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  searchRadius: number; // in meters
  categories: string[];
}

// Gulf Coast locations with coordinates and search parameters
export const GULF_COAST_LOCATIONS: GulfCoastLocation[] = [
  // Texas Gulf Coast
  {
    name: 'Galveston',
    state: 'Texas',
    coordinates: { lat: 29.3013, lng: -94.7977 },
    searchRadius: 25000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'amusement_park', 'aquarium', 'marina', 'beach', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'fishing_charter', 'water_sport', 'water_sports_equipment_rental_service', 'shopping_mall', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'museum', 'historic_landmark', 'cemetery']
  },
  {
    name: 'Corpus Christi',
    state: 'Texas',
    coordinates: { lat: 27.8006, lng: -97.3964 },
    searchRadius: 30000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'natural_feature', 'park', 'marina', 'beach', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'water_sport', 'water_sports_equipment_rental_service', 'shopping_mall', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'museum', 'historic_landmark', 'cemetery']
  },
  {
    name: 'South Padre Island',
    state: 'Texas',
    coordinates: { lat: 26.1118, lng: -97.1681 },
    searchRadius: 20000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'natural_feature', 'amusement_park', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'fishing_charter', 'shopping_mall', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'museum', 'historic_landmark']
  },
  {
    name: 'Port Aransas',
    state: 'Texas',
    coordinates: { lat: 27.8339, lng: -97.0611 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'water_sport', 'water_sports_equipment_rental_service', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Rockport',
    state: 'Texas',
    coordinates: { lat: 28.0206, lng: -97.0544 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'water_sport', 'water_sports_equipment_rental_service', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'museum', 'historic_landmark']
  },
  {
    name: 'Port Lavaca',
    state: 'Texas',
    coordinates: { lat: 28.6150, lng: -96.6261 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'water_sport', 'water_sports_equipment_rental_service', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Freeport',
    state: 'Texas',
    coordinates: { lat: 28.9541, lng: -95.3597 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'water_sport', 'water_sports_equipment_rental_service', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Surfside Beach',
    state: 'Texas',
    coordinates: { lat: 28.9444, lng: -95.2877 },
    searchRadius: 10000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'water_sport', 'water_sports_equipment_rental_service', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency']
  },
  
  // Louisiana Gulf Coast
  {
    name: 'Grand Isle',
    state: 'Louisiana',
    coordinates: { lat: 29.2363, lng: -89.9867 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'water_sport', 'water_sports_equipment_rental_service', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Port Fourchon',
    state: 'Louisiana',
    coordinates: { lat: 29.1058, lng: -90.1995 },
    searchRadius: 10000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'water_sport', 'water_sports_equipment_rental_service', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency']
  },
  {
    name: 'Cocodrie',
    state: 'Louisiana',
    coordinates: { lat: 29.2477, lng: -90.6612 },
    searchRadius: 10000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'water_sport', 'water_sports_equipment_rental_service', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency']
  },
  
  // Mississippi Gulf Coast
  {
    name: 'Biloxi',
    state: 'Mississippi',
    coordinates: { lat: 30.3940, lng: -88.8853 },
    searchRadius: 20000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'casino', 'natural_feature', 'marina', 'beach', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'water_sport', 'water_sports_equipment_rental_service', 'shopping_mall', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'museum', 'historic_landmark', 'cemetery']
  },
  {
    name: 'Gulfport',
    state: 'Mississippi',
    coordinates: { lat: 30.3674, lng: -89.0928 },
    searchRadius: 20000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'natural_feature', 'park', 'marina', 'beach', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'fishing_charter', 'water_sport', 'water_sports_equipment_rental_service', 'shopping_mall', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'museum', 'historic_landmark', 'cemetery']
  },
  {
    name: 'Ocean Springs',
    state: 'Mississippi',
    coordinates: { lat: 30.4111, lng: -88.8278 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'water_sport', 'water_sports_equipment_rental_service', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'museum', 'historic_landmark']
  },
  {
    name: 'Pass Christian',
    state: 'Mississippi',
    coordinates: { lat: 30.3158, lng: -89.2478 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'water_sport', 'water_sports_equipment_rental_service', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Long Beach',
    state: 'Mississippi',
    coordinates: { lat: 30.3504, lng: -89.1528 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'water_sport', 'water_sports_equipment_rental_service', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Bay St. Louis',
    state: 'Mississippi',
    coordinates: { lat: 30.3088, lng: -89.3300 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'water_sport', 'water_sports_equipment_rental_service', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'museum', 'historic_landmark']
  },
  {
    name: 'Waveland',
    state: 'Mississippi',
    coordinates: { lat: 30.2869, lng: -89.3767 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'water_sport', 'water_sports_equipment_rental_service', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  
  // Alabama Gulf Coast
  {
    name: 'Gulf Shores',
    state: 'Alabama',
    coordinates: { lat: 30.2460, lng: -87.7008 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'natural_feature', 'amusement_park', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'shopping_mall', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'museum', 'historic_landmark', 'cemetery']
  },
  {
    name: 'Orange Beach',
    state: 'Alabama',
    coordinates: { lat: 30.2697, lng: -87.6411 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'natural_feature', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'shopping_mall', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'museum', 'historic_landmark', 'cemetery']
  },
  {
    name: 'Dauphin Island',
    state: 'Alabama',
    coordinates: { lat: 30.2525, lng: -88.1097 },
    searchRadius: 10000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'water_sport', 'water_sports_equipment_rental_service', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Fort Morgan',
    state: 'Alabama',
    coordinates: { lat: 30.2296, lng: -88.0228 },
    searchRadius: 10000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'water_sport', 'water_sports_equipment_rental_service', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Bon Secour',
    state: 'Alabama',
    coordinates: { lat: 30.3057, lng: -87.7286 },
    searchRadius: 10000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'water_sport', 'water_sports_equipment_rental_service', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  
  // Florida Gulf Coast
  {
    name: 'Pensacola',
    state: 'Florida',
    coordinates: { lat: 30.4213, lng: -87.2169 },
    searchRadius: 20000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'natural_feature', 'museum', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'shopping_mall', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark', 'cemetery', 'church']
  },
  {
    name: 'Pensacola Beach',
    state: 'Florida',
    coordinates: { lat: 30.3327, lng: -87.1372 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Gulf Breeze',
    state: 'Florida',
    coordinates: { lat: 30.3571, lng: -87.1636 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Navarre Beach',
    state: 'Florida',
    coordinates: { lat: 30.3785, lng: -86.8636 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Destin',
    state: 'Florida',
    coordinates: { lat: 30.3935, lng: -86.4955 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'natural_feature', 'amusement_park', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'shopping_mall', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'museum', 'historic_landmark', 'cemetery']
  },
  {
    name: 'Fort Walton Beach',
    state: 'Florida',
    coordinates: { lat: 30.4058, lng: -86.6188 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'shopping_mall', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'museum', 'historic_landmark']
  },
  {
    name: 'Okaloosa Island',
    state: 'Florida',
    coordinates: { lat: 30.3926, lng: -86.5927 },
    searchRadius: 10000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency']
  },
  {
    name: 'Miramar Beach',
    state: 'Florida',
    coordinates: { lat: 30.3835, lng: -86.3586 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'shopping_mall', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Seaside',
    state: 'Florida',
    coordinates: { lat: 30.3210, lng: -86.1386 },
    searchRadius: 10000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'WaterColor',
    state: 'Florida',
    coordinates: { lat: 30.3200, lng: -86.1350 },
    searchRadius: 10000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency']
  },
  {
    name: 'Grayton Beach',
    state: 'Florida',
    coordinates: { lat: 30.3297, lng: -86.1650 },
    searchRadius: 10000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Panama City Beach',
    state: 'Florida',
    coordinates: { lat: 30.1766, lng: -85.8055 },
    searchRadius: 20000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'natural_feature', 'amusement_park', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'shopping_mall', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'museum', 'historic_landmark', 'cemetery']
  },
  {
    name: 'Mexico Beach',
    state: 'Florida',
    coordinates: { lat: 29.9480, lng: -85.4180 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Port St. Joe',
    state: 'Florida',
    coordinates: { lat: 29.8119, lng: -85.3030 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'museum', 'historic_landmark']
  },
  {
    name: 'Apalachicola',
    state: 'Florida',
    coordinates: { lat: 29.7255, lng: -84.9824 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'museum', 'historic_landmark']
  },
  {
    name: 'St. George Island',
    state: 'Florida',
    coordinates: { lat: 29.6477, lng: -84.8752 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Cedar Key',
    state: 'Florida',
    coordinates: { lat: 29.1386, lng: -83.0351 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'museum', 'historic_landmark']
  },
  {
    name: 'Clearwater Beach',
    state: 'Florida',
    coordinates: { lat: 27.9781, lng: -82.8317 },
    searchRadius: 20000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'natural_feature', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'shopping_mall', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'museum', 'historic_landmark', 'cemetery']
  },
  {
    name: 'St. Petersburg Beach',
    state: 'Florida',
    coordinates: { lat: 27.7242, lng: -82.7412 },
    searchRadius: 20000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'natural_feature', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'shopping_mall', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'museum', 'historic_landmark', 'cemetery']
  },
  {
    name: 'Madeira Beach',
    state: 'Florida',
    coordinates: { lat: 27.7981, lng: -82.7973 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Redington Beach',
    state: 'Florida',
    coordinates: { lat: 27.8086, lng: -82.8115 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Indian Rocks Beach',
    state: 'Florida',
    coordinates: { lat: 27.8964, lng: -82.8465 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Belleair Beach',
    state: 'Florida',
    coordinates: { lat: 27.9228, lng: -82.8432 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Belleair Shores',
    state: 'Florida',
    coordinates: { lat: 27.9164, lng: -82.8512 },
    searchRadius: 10000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency']
  },
  {
    name: 'Sand Key',
    state: 'Florida',
    coordinates: { lat: 27.9436, lng: -82.8312 },
    searchRadius: 10000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency']
  },
  {
    name: 'Treasure Island',
    state: 'Florida',
    coordinates: { lat: 27.7692, lng: -82.7687 },
    searchRadius: 15000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  },
  {
    name: 'Pass-a-Grille',
    state: 'Florida',
    coordinates: { lat: 27.7086, lng: -82.7412 },
    searchRadius: 10000,
    categories: ['restaurant', 'lodging', 'tourist_attraction', 'marina', 'beach', 'water_sport', 'water_sports_equipment_rental_service', 'fishing_charter', 'hotel', 'resort', 'vacation_rental', 'bar', 'cafe', 'convenience_store', 'gas_station', 'car_rental', 'tour_agency', 'real_estate_agency', 'historic_landmark']
  }
];

export class GoogleAPIManager {
  private apiKey: string;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;
  private isCollecting: boolean = false;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.cache = new Map();
  }

  // Cache management
  private getCacheKey(location: string, category: string): string {
    return `${location}_${category}`;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    
    const now = Date.now();
    return (now - cached.timestamp) < cached.ttl;
  }

  private setCache(key: string, data: any, ttl: number = 24 * 60 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Google Places API calls
  async searchNearbyPlaces(location: GulfCoastLocation, category: string): Promise<GooglePlaceData[]> {
    const cacheKey = this.getCacheKey(location.name, category);
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      console.log(`Using cached data for ${location.name} - ${category}`);
      return this.cache.get(cacheKey)!.data;
    }

    try {
      const places = await this.fetchNearbyPlaces(location, category);
      
      // Cache the results for 24 hours
      this.setCache(cacheKey, places, 24 * 60 * 60 * 1000);
      
      return places;
    } catch (error) {
      console.error(`Error fetching places for ${location.name} - ${category}:`, error);
      
      // Return cached data if available, even if expired
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log(`Using expired cache for ${location.name} - ${category}`);
        return cached.data;
      }
      
      throw error;
    }
  }

  private async fetchNearbyPlaces(location: GulfCoastLocation, category: string): Promise<GooglePlaceData[]> {
    const { lat, lng } = location.coordinates;
    const radius = location.searchRadius;
    
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${category}&key=${this.apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`);
    }
    
    return data.results || [];
  }

  // Get detailed place information
  async getPlaceDetails(placeId: string): Promise<GooglePlaceData | null> {
    const cacheKey = `details_${placeId}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,formatted_address,geometry,rating,user_ratings_total,types,business_status,opening_hours,photos,price_level,reviews,website,international_phone_number,url&key=${this.apiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Google Places Details API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Google Places Details API error: ${data.status}`);
      }
      
      const placeData = data.result;
      
      // Cache for 7 days (details don't change often)
      this.setCache(cacheKey, placeData, 7 * 24 * 60 * 60 * 1000);
      
      return placeData;
    } catch (error) {
      console.error(`Error fetching place details for ${placeId}:`, error);
      return null;
    }
  }

  // Batch data collection for all locations
  async collectAllData(): Promise<void> {
    if (this.isCollecting) {
      console.log('Data collection already in progress');
      return;
    }

    this.isCollecting = true;
    console.log('Starting comprehensive data collection...');

    try {
      const allData: any = {};

      for (const location of GULF_COAST_LOCATIONS) {
        console.log(`Collecting data for ${location.name}, ${location.state}...`);
        
        allData[location.name] = {
          state: location.state,
          coordinates: location.coordinates,
          businesses: {}
        };

        for (const category of location.categories) {
          try {
            const places = await this.searchNearbyPlaces(location, category);
            
            // Get detailed information for each place
            const detailedPlaces = await Promise.all(
              places.map(async (place) => {
                const details = await this.getPlaceDetails(place.place_id);
                return details || place;
              })
            );

            allData[location.name].businesses[category] = detailedPlaces;
            
            // Rate limiting to avoid hitting API limits
            await this.delay(100);
          } catch (error) {
            console.error(`Error collecting ${category} data for ${location.name}:`, error);
            allData[location.name].businesses[category] = [];
          }
        }

        // Save location data to file
        await this.saveLocationData(location.name, allData[location.name]);
        
        console.log(`Completed data collection for ${location.name}`);
        
        // Rate limiting between locations
        await this.delay(500);
      }

      // Save comprehensive data
      await this.saveComprehensiveData(allData);
      
      console.log('Data collection completed successfully!');
    } catch (error) {
      console.error('Error during data collection:', error);
    } finally {
      this.isCollecting = false;
    }
  }

  // Save data to files
  private async saveLocationData(locationName: string, data: any): Promise<void> {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      const dataDir = path.join(process.cwd(), 'src', 'data', 'google-collected');
      await fs.mkdir(dataDir, { recursive: true });
      
      const filename = `${locationName.toLowerCase().replace(/\s+/g, '-')}.json`;
      const filepath = path.join(dataDir, filename);
      
      await fs.writeFile(filepath, JSON.stringify(data, null, 2));
      console.log(`Saved data for ${locationName} to ${filepath}`);
    } catch (error) {
      console.error(`Error saving data for ${locationName}:`, error);
    }
  }

  private async saveComprehensiveData(data: any): Promise<void> {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      const dataDir = path.join(process.cwd(), 'src', 'data', 'google-collected');
      await fs.mkdir(dataDir, { recursive: true });
      
      const filepath = path.join(dataDir, 'all-locations.json');
      await fs.writeFile(filepath, JSON.stringify(data, null, 2));
      
      console.log(`Saved comprehensive data to ${filepath}`);
    } catch (error) {
      console.error('Error saving comprehensive data:', error);
    }
  }

  // Utility methods
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    console.log('Cache cleared');
  }

  // Get cache status for a specific key
  getCacheStatus(key: string): { exists: boolean; valid: boolean; age: number | null } {
    const cached = this.cache.get(key);
    if (!cached) {
      return { exists: false, valid: false, age: null };
    }
    
    const age = Date.now() - cached.timestamp;
    return {
      exists: true,
      valid: this.isCacheValid(key),
      age
    };
  }
}

// Export singleton instance
export let googleAPIManager: GoogleAPIManager | null = null;

export function initializeGoogleAPI(apiKey: string): GoogleAPIManager {
  if (!googleAPIManager) {
    googleAPIManager = new GoogleAPIManager(apiKey);
  }
  return googleAPIManager;
}

export function getGoogleAPIManager(): GoogleAPIManager {
  if (!googleAPIManager) {
    throw new Error('Google API Manager not initialized. Call initializeGoogleAPI() first.');
  }
  return googleAPIManager;
}
