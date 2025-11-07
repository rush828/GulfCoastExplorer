import { promises as fs } from 'fs';
import path from 'path';

// Database interface for Google Places API data
export interface Business {
  id: string;
  name: string;
  business_name?: string;
  category: string; // Primary category for easy querying
  google_types: string[]; // Google's detailed business types
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  
  // Contact Information
  phone?: string;
  phone_international?: string;
  website?: string;
  website_url?: string;
  email?: string;
  
  // Location & Coordinates
  latitude?: number;
  longitude?: number;
  coordinates?: { lat: number; lng: number };
  formatted_address?: string;
  place_id?: string;
  
  // Business Details
  rating?: number;
  reviews_count?: number;
  price_level?: number;
  description?: string;
  types?: string[]; // Legacy field - keeping for compatibility
  
  // Hours & Status
  hours?: string;
  hours_formatted?: string;
  opening_hours?: any;
  is_open?: boolean;
  permanently_closed?: boolean;
  
  // Photos & Media
  photos?: string[];
  photos_array?: string[];
  photo_references?: string[];
  
  // Reviews & Ratings
  reviews?: any[];
  user_ratings_total?: number;
  
  // Additional Google Fields
  international_phone_number?: string;
  url?: string;
  vicinity?: string;
  scope?: string;
  icon?: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  
  // Business Features
  wheelchair_accessible_entrance?: boolean;
  delivery?: boolean;
  dine_in?: boolean;
  takeout?: boolean;
  reservable?: boolean;
  serves_beer?: boolean;
  serves_breakfast?: boolean;
  serves_brunch?: boolean;
  serves_dinner?: boolean;
  serves_lunch?: boolean;
  serves_vegetarian_food?: boolean;
  serves_wine?: boolean;
  
  // Payment & Accessibility
  accepts_credit_cards?: boolean;
  accepts_debit_cards?: boolean;
  accepts_cash_only?: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  last_validated?: string;
  last_google_update?: string;
}

// Validation tracking
export interface ValidationRecord {
  id: string;
  business_id: string;
  validation_date: string;
  fields_updated: string[];
  cost: number;
  api_calls: number;
  success: boolean;
  error_message?: string;
}

// Simple JSON-based database fallback
export class BusinessDatabaseFallback {
  private dataPath: string;
  private businesses: Map<string, Business> = new Map();
  private validationRecords: ValidationRecord[] = [];

  constructor() {
    this.dataPath = path.join(process.cwd(), 'data', 'businesses-from-excel-corrected-ids.json');
    // Initialize with empty data first
    this.businesses = new Map();
    this.validationRecords = [];
    
    // Load data synchronously to ensure it's available immediately
    this.loadDataSync();
  }

  private loadDataSync() {
    try {
      console.log('Loading database from:', this.dataPath);
      const fs = require('fs');
      const data = fs.readFileSync(this.dataPath, 'utf-8');
      const parsed = JSON.parse(data);
      
      if (parsed.businesses) {
        this.businesses = new Map(Object.entries(parsed.businesses));
        console.log(`Loaded ${this.businesses.size} businesses from database`);
      }
      
      if (parsed.validationRecords) {
        this.validationRecords = parsed.validationRecords;
        console.log(`Loaded ${this.validationRecords.length} validation records`);
      }
    } catch (error) {
      console.log('No existing fallback data found, starting fresh');
      // Load from the original businesses.json if it exists
      try {
        const fs = require('fs');
        const originalData = fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'businesses', 'businesses.json'), 'utf-8');
        const originalBusinesses = JSON.parse(originalData);
        
        // Convert to new format
        for (const [id, business] of Object.entries(originalBusinesses)) {
          const businessData = business as any;
          this.businesses.set(id, {
            id,
            name: businessData.name || businessData.business_name || 'Unknown Business',
            business_name: businessData.business_name,
            category: businessData.category || 'other',
            google_types: businessData.google_types || businessData.types || [],
            address: businessData.address || 'Unknown Address',
            city: businessData.city || 'Unknown City',
            state: businessData.state || 'Unknown State',
            zip_code: businessData.zip_code || businessData.zip || 'Unknown',
            country: businessData.country || 'USA',
            phone: businessData.phone,
            phone_international: businessData.phone_international,
            website: businessData.website || businessData.website_url,
            website_url: businessData.website_url || businessData.website,
            email: businessData.email,
            latitude: businessData.latitude,
            longitude: businessData.longitude,
            coordinates: businessData.coordinates,
            formatted_address: businessData.formatted_address,
            place_id: businessData.place_id,
            rating: businessData.rating,
            reviews_count: businessData.reviews_count,
            price_level: businessData.price_level,
            description: businessData.description,
            types: businessData.types,
            hours: businessData.hours,
            hours_formatted: businessData.hours_formatted,
            opening_hours: businessData.opening_hours,
            is_open: businessData.is_open,
            permanently_closed: businessData.permanently_closed,
            photos: businessData.photos || businessData.photos_array,
            photos_array: businessData.photos_array || businessData.photos,
            photo_references: businessData.photo_references,
            user_ratings_total: businessData.user_ratings_total,
            international_phone_number: businessData.international_phone_number,
            url: businessData.url,
            vicinity: businessData.vicinity,
            scope: businessData.scope,
            icon: businessData.icon,
            icon_background_color: businessData.icon_background_color,
            icon_mask_base_uri: businessData.icon_mask_base_uri,
            wheelchair_accessible_entrance: businessData.wheelchair_accessible_entrance,
            delivery: businessData.delivery,
            dine_in: businessData.dine_in,
            takeout: businessData.takeout,
            reservable: businessData.reservable,
            serves_beer: businessData.serves_beer,
            serves_breakfast: businessData.serves_breakfast,
            serves_brunch: businessData.serves_brunch,
            serves_dinner: businessData.serves_dinner,
            serves_lunch: businessData.serves_lunch,
            serves_vegetarian_food: businessData.serves_vegetarian_food,
            serves_wine: businessData.serves_wine,
            accepts_credit_cards: businessData.accepts_credit_cards,
            accepts_debit_cards: businessData.accepts_debit_cards,
            accepts_cash_only: businessData.accepts_cash_only,
            created_at: businessData.lastUpdated || new Date().toISOString(),
            updated_at: businessData.lastUpdated || new Date().toISOString(),
            last_validated: businessData.last_validated,
            last_google_update: businessData.last_google_update
          });
        }
        console.log(`Migrated ${this.businesses.size} businesses from original file`);
      } catch (loadError) {
        console.log('Could not load original businesses.json:', loadError instanceof Error ? loadError.message : String(loadError));
      }
    }
  }

  private async loadData() {
    try {
      console.log('Loading database from:', this.dataPath);
      const data = await fs.readFile(this.dataPath, 'utf-8');
      const parsed = JSON.parse(data);
      
      if (parsed.businesses) {
        this.businesses = new Map(Object.entries(parsed.businesses));
        console.log(`Loaded ${this.businesses.size} businesses from database`);
      }
      
      if (parsed.validationRecords) {
        this.validationRecords = parsed.validationRecords;
        console.log(`Loaded ${this.validationRecords.length} validation records`);
      }
    } catch (error) {
      console.log('No existing fallback data found, starting fresh');
      // Load from the original businesses.json if it exists
      try {
        const originalData = await fs.readFile(path.join(process.cwd(), 'src', 'data', 'businesses', 'businesses.json'), 'utf-8');
        const originalBusinesses = JSON.parse(originalData);
        
        // Convert to new format
        for (const [id, business] of Object.entries(originalBusinesses)) {
          const businessData = business as any;
          this.businesses.set(id, {
            id,
            name: businessData.name || businessData.business_name || 'Unknown Business',
            business_name: businessData.business_name,
            category: businessData.category || 'other',
            google_types: businessData.google_types || businessData.types || [],
            address: businessData.address || 'Unknown Address',
            city: businessData.city || 'Unknown City',
            state: businessData.state || 'Unknown State',
            zip_code: businessData.zip_code || businessData.zip || 'Unknown',
            country: businessData.country || 'USA',
            phone: businessData.phone,
            phone_international: businessData.phone_international,
            website: businessData.website || businessData.website_url,
            website_url: businessData.website_url || businessData.website,
            email: businessData.email,
            latitude: businessData.latitude,
            longitude: businessData.longitude,
            coordinates: businessData.coordinates,
            formatted_address: businessData.formatted_address,
            place_id: businessData.place_id,
            rating: businessData.rating,
            reviews_count: businessData.reviews_count,
            price_level: businessData.price_level,
            description: businessData.description,
            types: businessData.types,
            hours: businessData.hours,
            hours_formatted: businessData.hours_formatted,
            opening_hours: businessData.opening_hours,
            is_open: businessData.is_open,
            permanently_closed: businessData.permanently_closed,
            photos: businessData.photos || businessData.photos_array,
            photos_array: businessData.photos_array || businessData.photos,
            photo_references: businessData.photo_references,
            user_ratings_total: businessData.user_ratings_total,
            international_phone_number: businessData.international_phone_number,
            url: businessData.url,
            vicinity: businessData.vicinity,
            scope: businessData.scope,
            icon: businessData.icon,
            icon_background_color: businessData.icon_background_color,
            icon_mask_base_uri: businessData.icon_mask_base_uri,
            wheelchair_accessible_entrance: businessData.wheelchair_accessible_entrance,
            delivery: businessData.delivery,
            dine_in: businessData.dine_in,
            takeout: businessData.takeout,
            reservable: businessData.reservable,
            serves_beer: businessData.serves_beer,
            serves_breakfast: businessData.serves_breakfast,
            serves_brunch: businessData.serves_brunch,
            serves_dinner: businessData.serves_dinner,
            serves_lunch: businessData.serves_lunch,
            serves_vegetarian_food: businessData.serves_vegetarian_food,
            serves_wine: businessData.serves_wine,
            accepts_credit_cards: businessData.accepts_credit_cards,
            accepts_debit_cards: businessData.accepts_debit_cards,
            accepts_cash_only: businessData.accepts_cash_only,
            created_at: businessData.lastUpdated || new Date().toISOString(),
            updated_at: businessData.lastUpdated || new Date().toISOString(),
            last_validated: businessData.last_validated,
            last_google_update: businessData.last_google_update
          });
        }
      } catch (loadError) {
        console.log('Could not load original businesses.json:', loadError instanceof Error ? loadError.message : String(loadError));
      }
    }
  }

  private async saveData() {
    try {
      const data = {
        businesses: Object.fromEntries(this.businesses),
        validationRecords: this.validationRecords
      };
      
      await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Failed to save fallback data:', error);
    }
  }

  // Business CRUD operations
  async createBusiness(business: Omit<Business, 'created_at' | 'updated_at'>): Promise<Business> {
    const now = new Date().toISOString();
    const businessWithTimestamps = {
      ...business,
      created_at: now,
      updated_at: now
    };
    
    this.businesses.set(business.id, businessWithTimestamps);
    await this.saveData();
    
    return businessWithTimestamps;
  }

  async updateBusiness(id: string, updates: Partial<Business>): Promise<Business | null> {
    const business = this.businesses.get(id);
    if (!business) return null;
    
    const updatedBusiness = {
      ...business,
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    this.businesses.set(id, updatedBusiness);
    await this.saveData();
    
    return updatedBusiness;
  }

  async getBusinessById(id: string): Promise<Business | null> {
    return this.businesses.get(id) || null;
  }

  async getAllBusinesses(): Promise<Business[]> {
    return Array.from(this.businesses.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getBusinessesByCategory(category: string): Promise<Business[]> {
    return Array.from(this.businesses.values())
      .filter(b => b.category === category)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getBusinessesByLocation(city?: string, state?: string): Promise<Business[]> {
    let businesses = Array.from(this.businesses.values());
    
    if (city) {
      businesses = businesses.filter(b => b.city === city);
    }
    
    if (state) {
      businesses = businesses.filter(b => b.state === state);
    }
    
    return businesses.sort((a, b) => a.name.localeCompare(b.name));
  }

  async searchBusinesses(query: string): Promise<Business[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.businesses.values())
      .filter(b => 
        b.name.toLowerCase().includes(searchTerm) ||
        (b.description && b.description.toLowerCase().includes(searchTerm)) ||
        b.city.toLowerCase().includes(searchTerm) ||
        b.state.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async deleteBusiness(id: string): Promise<boolean> {
    const deleted = this.businesses.delete(id);
    if (deleted) {
      await this.saveData();
    }
    return deleted;
  }

  // Validation tracking
  async addValidationRecord(record: Omit<ValidationRecord, 'id'>): Promise<void> {
    const id = `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullRecord = { ...record, id };
    
    this.validationRecords.push(fullRecord);
    await this.saveData();
  }

  async getValidationStats(): Promise<{
    totalBusinesses: number;
    upToDate: number;
    needsUpdate: number;
    outOfBudget: number;
    monthlySpent: number;
    monthlyBudget: number;
    lastValidationRun: string | null;
  }> {
    const totalBusinesses = this.businesses.size;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const upToDate = Array.from(this.businesses.values())
      .filter(b => b.last_validated && new Date(b.last_validated) > thirtyDaysAgo)
      .length;
    
    const needsUpdate = totalBusinesses - upToDate;
    
    // Calculate monthly spent from validation records
    const monthlySpent = this.validationRecords
      .filter(r => new Date(r.validation_date) > thirtyDaysAgo)
      .reduce((sum, r) => sum + r.cost, 0);
    
    // Get last validation run
    const lastValidationRun = this.validationRecords.length > 0
      ? Math.max(...this.validationRecords.map(r => new Date(r.validation_date).getTime()))
      : null;
    
    return {
      totalBusinesses,
      upToDate,
      needsUpdate,
      outOfBudget: 0,
      monthlySpent,
      monthlyBudget: 10,
      lastValidationRun: lastValidationRun ? new Date(lastValidationRun).toISOString() : null
    };
  }

  // Enhanced category queries
  async getBusinessesByCategoryAndCity(category: string, city: string, state?: string): Promise<Business[]> {
    let businesses = Array.from(this.businesses.values())
      .filter(b => 
        (b.category === category || b.google_types.includes(category)) &&
        b.city === city
      );
    
    if (state) {
      businesses = businesses.filter(b => b.state === state);
    }
    
    return businesses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  async getCategoriesByCity(city: string, state?: string): Promise<{ category: string; count: number }[]> {
    let businesses = Array.from(this.businesses.values())
      .filter(b => b.city === city);
    
    if (state) {
      businesses = businesses.filter(b => b.state === state);
    }
    
    const categoryCounts = new Map<string, number>();
    businesses.forEach(b => {
      categoryCounts.set(b.category, (categoryCounts.get(b.category) || 0) + 1);
    });
    
    return Array.from(categoryCounts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }

  async searchBusinessesByCategory(category: string, city?: string, state?: string): Promise<Business[]> {
    let businesses = Array.from(this.businesses.values())
      .filter(b => 
        b.category === category ||
        b.google_types.includes(category) ||
        b.name.toLowerCase().includes(category.toLowerCase()) ||
        (b.description && b.description.toLowerCase().includes(category.toLowerCase()))
      );
    
    if (city) {
      businesses = businesses.filter(b => b.city === city);
    }
    
    if (state) {
      businesses = businesses.filter(b => b.state === state);
    }
    
    return businesses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  async getPopularCategories(limit: number = 20): Promise<{ category: string; count: number }[]> {
    const categoryCounts = new Map<string, number>();
    
    Array.from(this.businesses.values()).forEach(b => {
      categoryCounts.set(b.category, (categoryCounts.get(b.category) || 0) + 1);
    });
    
    return Array.from(categoryCounts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // Migration from JSON
  async migrateFromJSON(jsonData: any): Promise<void> {
    const businesses = Object.entries(jsonData).map(([id, business]: [string, any]) => ({
      id,
      ...business,
      created_at: business.lastUpdated || new Date().toISOString(),
      updated_at: business.lastUpdated || new Date().toISOString()
    }));

    for (const business of businesses) {
      try {
        await this.createBusiness(business);
      } catch (error) {
        console.error(`Error migrating business ${business.id}:`, error);
      }
    }
  }

  // Reload data from file
  async reloadData(): Promise<void> {
    console.log('Reloading database data...');
    await this.loadData();
    console.log(`Reloaded ${this.businesses.size} businesses`);
  }

  // Close database connection
  close(): void {
    // Nothing to close for in-memory fallback
  }
}

// Export singleton instance
export const businessDB = new BusinessDatabaseFallback();
