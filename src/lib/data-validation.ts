// Smart Data Validation System
// Stores data in database, validates periodically, minimal API usage

export interface BusinessValidationResult {
  businessId: string;
  isUpToDate: boolean;
  lastValidated: Date;
  needsUpdate: boolean;
  validationScore: number; // 0-100
  fieldsToUpdate: string[];
  estimatedUpdateCost: number;
}

export interface ValidationConfig {
  // How often to validate different types of data
  validationIntervals: {
    businessHours: number; // days
    contactInfo: number; // days
    ratings: number; // days
    photos: number; // days
    status: number; // days
  };
  
  // Cost thresholds for updates
  costThresholds: {
    maxMonthlySpend: number;
    maxPerUpdate: number;
    priorityUpdates: string[];
  };
  
  // Validation rules
  validationRules: {
    requirePhoneNumber: boolean;
    requireWebsite: boolean;
    requireHours: boolean;
    minRatingThreshold: number;
  };
}

export class SmartDataValidator {
  private config: ValidationConfig;
  private lastValidationRun: Date | null = null;
  private monthlyApiUsage: number = 0;
  private monthlyBudget: number;

  constructor(config: ValidationConfig) {
    this.config = config;
    this.monthlyBudget = config.costThresholds.maxMonthlySpend;
  }

  // Check if business data needs validation
  async needsValidation(businessId: string, lastValidated: Date): Promise<boolean> {
    const daysSinceValidation = this.daysBetween(lastValidated, new Date());
    
    // Check different validation intervals
    if (daysSinceValidation >= this.config.validationIntervals.businessHours) return true;
    if (daysSinceValidation >= this.config.validationIntervals.contactInfo) return true;
    if (daysSinceValidation >= this.config.validationIntervals.ratings) return true;
    
    return false;
  }

  // Smart validation that prioritizes important updates
  async validateBusinessData(businessId: string, currentData: any): Promise<BusinessValidationResult> {
    const validationResult: BusinessValidationResult = {
      businessId,
      isUpToDate: true,
      lastValidated: new Date(),
      needsUpdate: false,
      validationScore: 100,
      fieldsToUpdate: [],
      estimatedUpdateCost: 0
    };

    // Check if we have budget for validation
    if (this.monthlyApiUsage >= this.monthlyBudget) {
      validationResult.isUpToDate = false;
      validationResult.needsUpdate = true;
      validationResult.validationScore = 0;
      validationResult.fieldsToUpdate = ['all'];
      validationResult.estimatedUpdateCost = 0; // Can't afford updates
      return validationResult;
    }

    // Calculate validation score based on data quality
    validationResult.validationScore = this.calculateDataQualityScore(currentData);
    
    // Determine what needs updating
    const fieldsNeedingUpdate = this.identifyFieldsNeedingUpdate(currentData);
    validationResult.fieldsToUpdate = fieldsNeedingUpdate;
    
    if (fieldsNeedingUpdate.length > 0) {
      validationResult.needsUpdate = true;
      validationResult.isUpToDate = false;
      validationResult.estimatedUpdateCost = this.estimateUpdateCost(fieldsNeedingUpdate);
    }

    return validationResult;
  }

  // Calculate how "good" the current data is
  private calculateDataQualityScore(data: any): number {
    let score = 100;
    let totalFields = 0;
    let missingFields = 0;

    // Check essential fields
    const essentialFields = ['name', 'address', 'phone', 'website', 'hours', 'rating'];
    
    essentialFields.forEach(field => {
      totalFields++;
      if (!data[field] || data[field] === '') {
        missingFields++;
        score -= 15; // Big penalty for missing essential data
      }
    });

    // Check data freshness
    if (data.lastUpdated) {
      const daysOld = this.daysBetween(new Date(data.lastUpdated), new Date());
      if (daysOld > 30) score -= 20;
      else if (daysOld > 7) score -= 10;
    }

    // Check completeness
    if (data.photos && data.photos.length === 0) score -= 10;
    if (!data.description || data.description.length < 10) score -= 10;

    return Math.max(0, score);
  }

  // Identify which fields actually need updating
  private identifyFieldsNeedingUpdate(data: any): string[] {
    const fieldsToUpdate: string[] = [];
    
    // Check business hours (change frequently)
    if (!data.hours || this.isHoursOutdated(data.hours)) {
      fieldsToUpdate.push('hours');
    }

    // Check contact info (rarely changes)
    if (!data.phone || !data.website) {
      fieldsToUpdate.push('contact');
    }

    // Check ratings (change moderately)
    if (!data.rating || this.isRatingOutdated(data.rating)) {
      fieldsToUpdate.push('rating');
    }

    // Check business status (rarely changes)
    if (!data.status || data.status === 'UNKNOWN') {
      fieldsToUpdate.push('status');
    }

    return fieldsToUpdate;
  }

  // Estimate cost of updating specific fields
  private estimateUpdateCost(fields: string[]): number {
    let cost = 0;
    
    // Google Places API costs
    const costs: Record<string, number> = {
      'hours': 0.017, // $17 per 1000 requests
      'contact': 0.017,
      'rating': 0.017,
      'status': 0.017,
      'all': 0.034 // Details API call
    };

    fields.forEach(field => {
      if (field === 'all') {
        cost += costs.all;
      } else if (costs[field]) {
        cost += costs[field];
      }
    });

    return cost;
  }

  // Batch validation to minimize API calls
  async batchValidateBusinesses(businessIds: string[], currentData: any[]): Promise<BusinessValidationResult[]> {
    const results: BusinessValidationResult[] = [];
    const businessesToValidate: string[] = [];
    
    // First pass: identify which businesses need validation
    for (let i = 0; i < businessIds.length; i++) {
      const businessId = businessIds[i];
      const data = currentData[i];
      
      if (await this.needsValidation(businessId, data.lastValidated || new Date(0))) {
        businessesToValidate.push(businessId);
      } else {
        // Data is still fresh, no validation needed
        results.push({
          businessId,
          isUpToDate: true,
          lastValidated: new Date(),
          needsUpdate: false,
          validationScore: 100,
          fieldsToUpdate: [],
          estimatedUpdateCost: 0
        });
      }
    }

    // Second pass: validate only businesses that need it
    if (businessesToValidate.length > 0) {
      console.log(`Validating ${businessesToValidate.length} businesses out of ${businessIds.length} total`);
      
      // Group by priority to maximize budget efficiency
      const priorityBusinesses = this.prioritizeBusinesses(businessesToValidate, currentData);
      
      for (const businessId of priorityBusinesses) {
        if (this.monthlyApiUsage < this.monthlyBudget) {
          const result = await this.validateBusinessData(businessId, 
            currentData.find(d => d.id === businessId));
          results.push(result);
          
          // Track API usage
          this.monthlyApiUsage += result.estimatedUpdateCost;
        } else {
          // Out of budget, mark as needing update but can't afford
          results.push({
            businessId,
            isUpToDate: false,
            lastValidated: new Date(),
            needsUpdate: true,
            validationScore: 0,
            fieldsToUpdate: ['all'],
            estimatedUpdateCost: 0
          });
        }
      }
    }

    return results;
  }

  // Prioritize businesses for validation based on importance
  private prioritizeBusinesses(businessIds: string[], currentData: any[]): string[] {
    const businessScores = businessIds.map(id => {
      const data = currentData.find(d => d.id === id);
      if (!data) return { id, score: 0 };
      
      let score = 0;
      
      // Higher priority for businesses with missing essential data
      if (!data.phone || !data.website) score += 50;
      if (!data.hours) score += 30;
      if (!data.rating) score += 20;
      
      // Higher priority for recently popular businesses
      if (data.views && data.views > 100) score += 25;
      if (data.rating && data.rating > 4.0) score += 15;
      
      // Higher priority for businesses in popular locations
      if (data.city && ['Galveston', 'Destin', 'Panama City Beach'].includes(data.city)) {
        score += 20;
      }
      
      return { id, score };
    });

    // Sort by score (highest first)
    return businessScores
      .sort((a, b) => b.score - a.score)
      .map(item => item.id);
  }

  // Utility methods
  private daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  }

  private isHoursOutdated(hours: any): boolean {
    // Check if hours data is more than 7 days old
    if (!hours.lastUpdated) return true;
    return this.daysBetween(new Date(hours.lastUpdated), new Date()) > 7;
  }

  private isRatingOutdated(rating: any): boolean {
    // Check if rating data is more than 30 days old
    if (!rating.lastUpdated) return true;
    return this.daysBetween(new Date(rating.lastUpdated), new Date()) > 30;
  }

  // Reset monthly usage (call this monthly)
  resetMonthlyUsage(): void {
    this.monthlyApiUsage = 0;
    this.lastValidationRun = new Date();
  }

  // Get current usage statistics
  getUsageStats(): {
    monthlyApiUsage: number;
    monthlyBudget: number;
    remainingBudget: number;
    lastValidationRun: Date | null;
  } {
    return {
      monthlyApiUsage: this.monthlyApiUsage,
      monthlyBudget: this.monthlyBudget,
      remainingBudget: this.monthlyBudget - this.monthlyApiUsage,
      lastValidationRun: this.lastValidationRun
    };
  }

  // Update budget if needed
  updateBudget(newBudget: number): void {
    this.monthlyBudget = newBudget;
  }
}

// Default configuration for cost-conscious usage
export const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  validationIntervals: {
    businessHours: 7,    // Check hours weekly
    contactInfo: 90,     // Check contact info quarterly
    ratings: 30,         // Check ratings monthly
    photos: 180,         // Check photos every 6 months
    status: 365          // Check business status yearly
  },
  
  costThresholds: {
    maxMonthlySpend: 10,  // $10/month max
    maxPerUpdate: 0.05,   // $0.05 max per update
    priorityUpdates: ['hours', 'contact', 'rating']
  },
  
  validationRules: {
    requirePhoneNumber: true,
    requireWebsite: true,
    requireHours: true,
    minRatingThreshold: 3.0
  }
};
