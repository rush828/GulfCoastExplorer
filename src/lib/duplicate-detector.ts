/**
 * Duplicate Detection for Business Import
 * Detects potential duplicates using multiple strategies
 */

export interface Business {
  name: string
  city: string
  state: string
  phone?: string
  address?: string
  latitude: number
  longitude: number
  [key: string]: any
}

export interface DuplicateMatch {
  existingBusiness: Business
  existingId: string
  confidence: 'high' | 'medium' | 'low'
  matchReasons: string[]
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const s1 = str1.toLowerCase()
  const s2 = str2.toLowerCase()
  
  const matrix: number[][] = []
  
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[s2.length][s1.length]
}

/**
 * Normalize phone number for comparison
 */
function normalizePhone(phone: string | undefined): string {
  if (!phone) return ''
  return phone.replace(/[^0-9]/g, '')
}

/**
 * Check if coordinates are very close (within ~10 meters)
 */
function coordinatesMatch(lat1: number, lon1: number, lat2: number, lon2: number): boolean {
  const threshold = 0.0001 // approximately 10 meters
  return Math.abs(lat1 - lat2) < threshold && Math.abs(lon1 - lon2) < threshold
}

/**
 * Normalize address for fuzzy matching
 */
function normalizeAddress(address: string | undefined): string {
  if (!address) return ''
  return address
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

/**
 * Detect if a new business is a duplicate of an existing one
 */
export function detectDuplicate(
  newBusiness: Business,
  existingBusinesses: Record<string, Business>
): DuplicateMatch | null {
  const matches: DuplicateMatch[] = []
  
  for (const [id, existing] of Object.entries(existingBusinesses)) {
    const matchReasons: string[] = []
    let confidence: 'high' | 'medium' | 'low' = 'low'
    
    // Skip if different city
    if (existing.city?.toLowerCase() !== newBusiness.city?.toLowerCase()) {
      continue
    }
    
    // 1. Exact name match in same city
    if (existing.name.toLowerCase() === newBusiness.name.toLowerCase()) {
      matchReasons.push('Exact name match')
      confidence = 'high'
    }
    
    // 2. Phone number match
    const existingPhone = normalizePhone(existing.phone)
    const newPhone = normalizePhone(newBusiness.phone)
    if (existingPhone && newPhone && existingPhone === newPhone) {
      matchReasons.push('Same phone number')
      confidence = 'high'
    }
    
    // 3. Very similar coordinates
    if (coordinatesMatch(existing.latitude, existing.longitude, newBusiness.latitude, newBusiness.longitude)) {
      matchReasons.push('Same location (coordinates)')
      if (confidence !== 'high') {
        confidence = 'medium'
      }
    }
    
    // 4. Similar address
    const existingAddr = normalizeAddress(existing.address)
    const newAddr = normalizeAddress(newBusiness.address)
    if (existingAddr && newAddr && existingAddr === newAddr) {
      matchReasons.push('Same address')
      confidence = 'high'
    }
    
    // 5. Very similar name (Levenshtein distance < 3)
    const nameDistance = levenshteinDistance(existing.name, newBusiness.name)
    if (nameDistance > 0 && nameDistance <= 3) {
      matchReasons.push(`Similar name (distance: ${nameDistance})`)
      if (confidence === 'low') {
        confidence = 'medium'
      }
    }
    
    // If we have any match reasons, add to matches
    if (matchReasons.length > 0) {
      matches.push({
        existingBusiness: existing,
        existingId: id,
        confidence,
        matchReasons
      })
    }
  }
  
  // Return the highest confidence match, or null if no matches
  if (matches.length === 0) return null
  
  // Sort by confidence (high > medium > low) and number of reasons
  matches.sort((a, b) => {
    const confidenceOrder = { high: 3, medium: 2, low: 1 }
    const confDiff = confidenceOrder[b.confidence] - confidenceOrder[a.confidence]
    if (confDiff !== 0) return confDiff
    return b.matchReasons.length - a.matchReasons.length
  })
  
  return matches[0]
}

/**
 * Batch detect duplicates for multiple businesses
 */
export function batchDetectDuplicates(
  newBusinesses: (Business | null)[],
  existingBusinesses: Record<string, Business>
): Map<number, DuplicateMatch> {
  const duplicates = new Map<number, DuplicateMatch>()
  
  for (let i = 0; i < newBusinesses.length; i++) {
    const business = newBusinesses[i]
    
    // Skip null businesses (rejected during transformation)
    if (!business) {
      continue
    }
    
    const duplicate = detectDuplicate(business, existingBusinesses)
    if (duplicate) {
      duplicates.set(i, duplicate)
    }
  }
  
  return duplicates
}
