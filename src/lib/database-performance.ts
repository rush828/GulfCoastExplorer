/**
 * Database Performance Analysis and Optimization
 * READ-ONLY analysis tools - does NOT modify any data files
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export interface DatabaseAnalysis {
  fileSize: number
  businessCount: number
  averageBusinessSize: number
  memoryUsage: number
  parseTime: number
  queryTime: number
  indexableFields: string[]
  duplicateFields: string[]
  unusedFields: string[]
  optimization_score: number
  recommendations: string[]
}

export interface QueryPerformance {
  operation: string
  executionTime: number
  memoryUsed: number
  resultsCount: number
  cacheHit?: boolean
}

class DatabasePerformanceAnalyzer {
  private dataFile: string
  private cachedData: any = null
  private performanceLog: QueryPerformance[] = []

  constructor() {
    // Use the main production dataset - READ ONLY
    this.dataFile = join(process.cwd(), 'data', 'businesses-from-excel-corrected-ids.json')
  }

  /**
   * Analyze database performance (READ ONLY)
   */
  async analyzeDatabase(): Promise<DatabaseAnalysis> {
    const startTime = performance.now()
    
    try {
      // Check file existence and size
      if (!existsSync(this.dataFile)) {
        throw new Error('Database file not found')
      }

      const stats = require('fs').statSync(this.dataFile)
      const fileSize = stats.size

      // Read and parse (measure time)
      const parseStart = performance.now()
      const content = readFileSync(this.dataFile, 'utf-8')
      const data = JSON.parse(content)
      const parseTime = performance.now() - parseStart

      // Extract businesses array
      let businesses: any[] = []
      if (data.businesses) {
        if (Array.isArray(data.businesses)) {
          businesses = data.businesses
        } else if (typeof data.businesses === 'object') {
          businesses = Object.values(data.businesses)
        }
      } else if (Array.isArray(data)) {
        businesses = data
      } else {
        businesses = Object.values(data)
      }

      const businessCount = businesses.length
      const averageBusinessSize = fileSize / businessCount

      // Analyze fields
      const fieldAnalysis = this.analyzeFields(businesses)
      
      // Calculate optimization score
      const optimizationScore = this.calculateOptimizationScore({
        fileSize,
        businessCount,
        parseTime,
        ...fieldAnalysis
      })

      // Generate recommendations
      const recommendations = this.generateRecommendations({
        fileSize,
        businessCount,
        parseTime,
        ...fieldAnalysis
      })

      return {
        fileSize,
        businessCount,
        averageBusinessSize: Math.round(averageBusinessSize),
        memoryUsage: process.memoryUsage().heapUsed,
        parseTime: Math.round(parseTime * 100) / 100,
        queryTime: 0, // Will be measured during actual queries
        indexableFields: fieldAnalysis.indexableFields,
        duplicateFields: fieldAnalysis.duplicateFields,
        unusedFields: fieldAnalysis.unusedFields,
        optimization_score: optimizationScore,
        recommendations
      }

    } catch (error) {
      console.error('Database analysis error:', error)
      throw error
    }
  }

  /**
   * Analyze database fields for optimization opportunities
   */
  private analyzeFields(businesses: any[]): {
    indexableFields: string[]
    duplicateFields: string[]
    unusedFields: string[]
  } {
    if (businesses.length === 0) {
      return { indexableFields: [], duplicateFields: [], unusedFields: [] }
    }

    const sampleSize = Math.min(100, businesses.length)
    const sample = businesses.slice(0, sampleSize)
    
    // Analyze field usage
    const fieldStats: { [key: string]: { count: number, uniqueValues: Set<any> } } = {}
    
    sample.forEach(business => {
      Object.keys(business).forEach(field => {
        if (!fieldStats[field]) {
          fieldStats[field] = { count: 0, uniqueValues: new Set() }
        }
        fieldStats[field].count++
        fieldStats[field].uniqueValues.add(business[field])
      })
    })

    // Identify indexable fields (frequently queried)
    const indexableFields = Object.keys(fieldStats).filter(field => {
      const stat = fieldStats[field]
      const usage = stat.count / sampleSize
      const uniqueness = stat.uniqueValues.size / stat.count
      
      return (
        ['city', 'state', 'primary_category', 'categories_array', 'rating'].includes(field) ||
        (usage > 0.8 && uniqueness > 0.1 && uniqueness < 0.9)
      )
    })

    // Identify duplicate fields (same data, different names)
    const duplicateFields: string[] = []
    const fieldPairs = [
      ['name', 'business_name'],
      ['address', 'formatted_address'],
      ['website', 'website_url'],
      ['phone', 'international_phone_number'],
      ['categories', 'categories_array'],
      ['reviews_count', 'user_ratings_total']
    ]

    fieldPairs.forEach(([field1, field2]) => {
      if (fieldStats[field1] && fieldStats[field2]) {
        duplicateFields.push(`${field1}/${field2}`)
      }
    })

    // Identify unused fields (empty or null in most records)
    const unusedFields = Object.keys(fieldStats).filter(field => {
      const stat = fieldStats[field]
      const emptyCount = Array.from(stat.uniqueValues).filter(value => 
        value === null || value === undefined || value === '' || 
        (Array.isArray(value) && value.length === 0)
      ).length
      
      return (emptyCount / stat.uniqueValues.size) > 0.7
    })

    return { indexableFields, duplicateFields, unusedFields }
  }

  /**
   * Calculate database optimization score (0-100)
   */
  private calculateOptimizationScore(analysis: any): number {
    let score = 100

    // File size penalty (large files are slower)
    if (analysis.fileSize > 50 * 1024 * 1024) score -= 20 // 50MB+
    else if (analysis.fileSize > 20 * 1024 * 1024) score -= 10 // 20MB+

    // Parse time penalty
    if (analysis.parseTime > 1000) score -= 20 // 1s+
    else if (analysis.parseTime > 500) score -= 10 // 500ms+

    // Duplicate fields penalty
    score -= analysis.duplicateFields.length * 5

    // Unused fields penalty
    score -= Math.min(analysis.unusedFields.length * 2, 20)

    // Business count efficiency
    const efficiency = analysis.businessCount / (analysis.fileSize / 1024) // businesses per KB
    if (efficiency < 0.1) score -= 15

    return Math.max(0, Math.min(100, score))
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(analysis: any): string[] {
    const recommendations: string[] = []

    if (analysis.fileSize > 30 * 1024 * 1024) {
      recommendations.push('Consider implementing data compression or splitting into multiple files')
    }

    if (analysis.parseTime > 500) {
      recommendations.push('Implement in-memory caching to reduce JSON parse time')
    }

    if (analysis.duplicateFields.length > 0) {
      recommendations.push(`Consolidate duplicate fields: ${analysis.duplicateFields.join(', ')}`)
    }

    if (analysis.unusedFields.length > 5) {
      recommendations.push('Remove unused fields to reduce file size and improve performance')
    }

    if (analysis.indexableFields.length > 0) {
      recommendations.push('Create indexes for frequently queried fields: ' + analysis.indexableFields.slice(0, 5).join(', '))
    }

    // Always include safe recommendations
    recommendations.push('Implement query result caching for better performance')
    recommendations.push('Use pagination for large result sets')
    recommendations.push('Consider lazy loading of detailed business data')

    return recommendations
  }

  /**
   * Benchmark query performance (READ ONLY testing)
   */
  async benchmarkQueries(): Promise<QueryPerformance[]> {
    const results: QueryPerformance[] = []

    try {
      // Load data once for all tests
      const content = readFileSync(this.dataFile, 'utf-8')
      const data = JSON.parse(content)
      
      let businesses: any[] = []
      if (data.businesses) {
        businesses = Array.isArray(data.businesses) ? data.businesses : Object.values(data.businesses)
      } else {
        businesses = Array.isArray(data) ? data : Object.values(data)
      }

      // Test 1: Full data load
      const loadStart = performance.now()
      const loadMemStart = process.memoryUsage().heapUsed
      const fullLoad = businesses.length
      const loadTime = performance.now() - loadStart
      const loadMemEnd = process.memoryUsage().heapUsed

      results.push({
        operation: 'Full Data Load',
        executionTime: Math.round(loadTime * 100) / 100,
        memoryUsed: loadMemEnd - loadMemStart,
        resultsCount: fullLoad
      })

      // Test 2: City filter
      const cityStart = performance.now()
      const cityMemStart = process.memoryUsage().heapUsed
      const cityResults = businesses.filter(b => b.city === 'Pensacola')
      const cityTime = performance.now() - cityStart
      const cityMemEnd = process.memoryUsage().heapUsed

      results.push({
        operation: 'City Filter (Pensacola)',
        executionTime: Math.round(cityTime * 100) / 100,
        memoryUsed: cityMemEnd - cityMemStart,
        resultsCount: cityResults.length
      })

      // Test 3: Category filter
      const categoryStart = performance.now()
      const categoryMemStart = process.memoryUsage().heapUsed
      const categoryResults = businesses.filter(b => b.primary_category === 'restaurant')
      const categoryTime = performance.now() - categoryStart
      const categoryMemEnd = process.memoryUsage().heapUsed

      results.push({
        operation: 'Category Filter (restaurant)',
        executionTime: Math.round(categoryTime * 100) / 100,
        memoryUsed: categoryMemEnd - categoryMemStart,
        resultsCount: categoryResults.length
      })

      // Test 4: Combined filter + sort
      const combinedStart = performance.now()
      const combinedMemStart = process.memoryUsage().heapUsed
      const combinedResults = businesses
        .filter(b => b.city === 'Pensacola' && b.primary_category === 'restaurant')
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 20)
      const combinedTime = performance.now() - combinedStart
      const combinedMemEnd = process.memoryUsage().heapUsed

      results.push({
        operation: 'Combined Filter + Sort + Limit',
        executionTime: Math.round(combinedTime * 100) / 100,
        memoryUsed: combinedMemEnd - combinedMemStart,
        resultsCount: combinedResults.length
      })

      // Test 5: Search by text
      const searchStart = performance.now()
      const searchMemStart = process.memoryUsage().heapUsed
      const searchResults = businesses.filter(b => 
        (b.name || '').toLowerCase().includes('beach') ||
        (b.description || '').toLowerCase().includes('beach')
      )
      const searchTime = performance.now() - searchStart
      const searchMemEnd = process.memoryUsage().heapUsed

      results.push({
        operation: 'Text Search (beach)',
        executionTime: Math.round(searchTime * 100) / 100,
        memoryUsed: searchMemEnd - searchMemStart,
        resultsCount: searchResults.length
      })

      return results

    } catch (error) {
      console.error('Benchmark error:', error)
      return []
    }
  }

  /**
   * Get database health metrics
   */
  getHealthMetrics(): {
    status: 'healthy' | 'warning' | 'critical'
    issues: string[]
    suggestions: string[]
  } {
    const issues: string[] = []
    const suggestions: string[] = []

    try {
      const stats = require('fs').statSync(this.dataFile)
      const fileSizeMB = stats.size / (1024 * 1024)

      if (fileSizeMB > 100) {
        issues.push(`Large file size: ${Math.round(fileSizeMB)}MB`)
        suggestions.push('Consider data compression or file splitting')
      }

      if (fileSizeMB > 50) {
        suggestions.push('Implement result caching for better performance')
      }

      const status = issues.length === 0 ? 'healthy' : 
                    fileSizeMB > 100 ? 'critical' : 'warning'

      return { status, issues, suggestions }

    } catch (error) {
      return {
        status: 'critical',
        issues: ['Database file not accessible'],
        suggestions: ['Check file permissions and path']
      }
    }
  }
}

// Export singleton instance
export const dbAnalyzer = new DatabasePerformanceAnalyzer()

/**
 * Quick database stats (safe, read-only)
 */
export async function getQuickStats(): Promise<{
  fileSize: string
  businessCount: number
  lastModified: string
  status: string
}> {
  try {
    const dataFile = join(process.cwd(), 'data', 'businesses-from-excel-corrected-ids.json')
    const stats = require('fs').statSync(dataFile)
    
    const content = readFileSync(dataFile, 'utf-8')
    const data = JSON.parse(content)
    
    let businessCount = 0
    if (data.businesses) {
      businessCount = Array.isArray(data.businesses) ? 
        data.businesses.length : 
        Object.keys(data.businesses).length
    } else {
      businessCount = Array.isArray(data) ? data.length : Object.keys(data).length
    }

    return {
      fileSize: `${Math.round(stats.size / 1024 / 1024 * 100) / 100} MB`,
      businessCount,
      lastModified: stats.mtime.toISOString(),
      status: stats.size > 50 * 1024 * 1024 ? 'Large' : 'Normal'
    }
  } catch (error) {
    return {
      fileSize: 'Unknown',
      businessCount: 0,
      lastModified: 'Unknown',
      status: 'Error'
    }
  }
}
