/**
 * Simple in-memory cache for API responses
 * In production, you'd want to use Redis or similar
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class InMemoryCache {
  private cache = new Map<string, CacheEntry<any>>()
  private maxSize = 1000 // Maximum number of cached entries
  
  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    // Clean old entries if cache is getting too large
    if (this.cache.size >= this.maxSize) {
      this.cleanup()
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    })
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }
    
    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data as T
  }
  
  delete(key: string): boolean {
    return this.cache.delete(key)
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  private cleanup(): void {
    const now = Date.now()
    const entriesToDelete: string[] = []
    
    // Find expired entries
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        entriesToDelete.push(key)
      }
    }
    
    // Delete expired entries
    entriesToDelete.forEach(key => this.cache.delete(key))
    
    // If still too large, remove oldest entries
    if (this.cache.size >= this.maxSize) {
      const entries = Array.from(this.cache.entries())
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
      
      const toRemove = entries.slice(0, Math.floor(this.maxSize * 0.2)) // Remove 20%
      toRemove.forEach(([key]) => this.cache.delete(key))
    }
  }
  
  getStats() {
    const now = Date.now()
    let validEntries = 0
    let expiredEntries = 0
    
    for (const entry of this.cache.values()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredEntries++
      } else {
        validEntries++
      }
    }
    
    return {
      total: this.cache.size,
      valid: validEntries,
      expired: expiredEntries,
      maxSize: this.maxSize
    }
  }
}

// Global cache instance
export const cache = new InMemoryCache()

/**
 * Generate cache key for API requests
 */
export const generateCacheKey = (endpoint: string, params: Record<string, any> = {}): string => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')
  
  return `${endpoint}?${sortedParams}`
}

/**
 * Cache decorator for API functions
 */
export function withCache<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyGenerator: (...args: T) => string,
  ttlSeconds: number = 300
) {
  return async (...args: T): Promise<R> => {
    const cacheKey = keyGenerator(...args)
    
    // Try to get from cache first
    const cached = cache.get<R>(cacheKey)
    if (cached) {
      return cached
    }
    
    // If not in cache, call the function
    const result = await fn(...args)
    
    // Cache the result
    cache.set(cacheKey, result, ttlSeconds)
    
    return result
  }
}

/**
 * Cache middleware for Next.js API routes
 */
export function cacheMiddleware(ttlSeconds: number = 300) {
  return function(handler: Function) {
    return async function(req: any, res: any) {
      const cacheKey = generateCacheKey(req.url || '', req.query || {})
      
      // Check cache first
      const cached = cache.get(cacheKey)
      if (cached) {
        res.setHeader('X-Cache', 'HIT')
        res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}`)
        return res.json(cached)
      }
      
      // Intercept res.json to cache the response
      const originalJson = res.json
      res.json = function(data: any) {
        // Only cache successful responses
        if (data.success !== false) {
          cache.set(cacheKey, data, ttlSeconds)
        }
        
        res.setHeader('X-Cache', 'MISS')
        res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}`)
        return originalJson.call(this, data)
      }
      
      return handler(req, res)
    }
  }
}

/**
 * Prefetch and cache common data
 */
export async function prefetchCommonData() {
  try {
    // Prefetch popular searches
    const popularSearches = [
      { category: 'food-dining', limit: 20 },
      { category: 'lodging', limit: 20 },
      { category: 'water-activities', limit: 20 },
      { category: 'beaches-outdoors', limit: 20 }
    ]
    
    for (const search of popularSearches) {
      const cacheKey = generateCacheKey('/api/google-data/retrieve', search)
      
      // Only prefetch if not already cached
      if (!cache.get(cacheKey)) {
        try {
          const response = await fetch(`/api/google-data/retrieve?${new URLSearchParams(search as any).toString()}`)
          const data = await response.json()
          
          if (data.success) {
            cache.set(cacheKey, data, 600) // 10 minutes for prefetched data
          }
        } catch (error) {
          console.warn('Failed to prefetch data for:', search, error)
        }
      }
    }
  } catch (error) {
    console.warn('Failed to prefetch common data:', error)
  }
}

// Performance monitoring
export const cacheMetrics = {
  hits: 0,
  misses: 0,
  
  recordHit() {
    this.hits++
  },
  
  recordMiss() {
    this.misses++
  },
  
  getHitRate() {
    const total = this.hits + this.misses
    return total > 0 ? (this.hits / total) * 100 : 0
  },
  
  reset() {
    this.hits = 0
    this.misses = 0
  }
}

