/**
 * Convert state names to 2-letter abbreviations
 */
export function getStateAbbreviation(stateName: string): string {
  const stateMap: { [key: string]: string } = {
    'texas': 'TX',
    'louisiana': 'LA',
    'mississippi': 'MS',
    'alabama': 'AL',
    'florida': 'FL'
  }
  
  const normalized = stateName.toLowerCase().trim()
  return stateMap[normalized] || stateName
}

/**
 * Format phone number to (XXX) XXX-XXXX
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return ''
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Check if we have a valid 10-digit US phone number
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`
  }
  
  // Check for 11-digit number starting with 1 (US country code)
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `(${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7)}`
  }
  
  // Return original if not a standard format
  return phone
}

/**
 * Clean phone number to digits only (for database storage)
 */
export function cleanPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return ''
  return phone.replace(/\D/g, '')
}

