/**
 * File Upload Security
 * Validates and secures file uploads
 */

// Allowed file types
const ALLOWED_TYPES = {
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  documents: ['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  all: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
}

// File size limits (in bytes)
const SIZE_LIMITS = {
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
  default: 2 * 1024 * 1024 // 2MB
}

// Dangerous file extensions to always block
const BLOCKED_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
  '.php', '.asp', '.aspx', '.jsp', '.pl', '.py', '.sh', '.ps1'
]

export interface FileValidationResult {
  isValid: boolean
  error?: string
  sanitizedName?: string
  fileType?: 'image' | 'document' | 'other'
}

/**
 * Validate uploaded file for security
 */
export function validateFile(file: File, allowedCategory: 'images' | 'documents' | 'all' = 'all'): FileValidationResult {
  // Check file size
  const sizeLimit = getSizeLimit(file.type)
  if (file.size > sizeLimit) {
    return {
      isValid: false,
      error: `File size too large. Maximum ${formatBytes(sizeLimit)} allowed.`
    }
  }

  // Check file type
  if (!ALLOWED_TYPES[allowedCategory].includes(file.type)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${ALLOWED_TYPES[allowedCategory].join(', ')}`
    }
  }

  // Check file extension
  const extension = getFileExtension(file.name).toLowerCase()
  if (BLOCKED_EXTENSIONS.includes(extension)) {
    return {
      isValid: false,
      error: 'File type blocked for security reasons.'
    }
  }

  // Validate file name
  const sanitizedName = sanitizeFileName(file.name)
  if (!sanitizedName) {
    return {
      isValid: false,
      error: 'Invalid file name.'
    }
  }

  // Determine file type category
  const fileType = getFileTypeCategory(file.type)

  return {
    isValid: true,
    sanitizedName,
    fileType
  }
}

/**
 * Sanitize file name to prevent path traversal
 */
export function sanitizeFileName(fileName: string): string {
  // Remove dangerous characters and path traversal attempts
  let sanitized = fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace unsafe chars with underscore
    .replace(/\.{2,}/g, '.') // Remove multiple dots
    .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
    .substring(0, 100) // Limit length

  // Ensure file has an extension
  if (!sanitized.includes('.')) {
    sanitized += '.txt'
  }

  // Add timestamp to prevent conflicts
  const timestamp = Date.now()
  const parts = sanitized.split('.')
  const extension = parts.pop()
  const nameWithoutExt = parts.join('.')
  
  return `${nameWithoutExt}_${timestamp}.${extension}`
}

/**
 * Get file extension from filename
 */
function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.')
  return lastDot > -1 ? fileName.substring(lastDot) : ''
}

/**
 * Get size limit for file type
 */
function getSizeLimit(mimeType: string): number {
  if (mimeType.startsWith('image/')) {
    return SIZE_LIMITS.image
  }
  if (mimeType.includes('pdf') || mimeType.includes('excel') || mimeType.includes('csv')) {
    return SIZE_LIMITS.document
  }
  return SIZE_LIMITS.default
}

/**
 * Get file type category
 */
function getFileTypeCategory(mimeType: string): 'image' | 'document' | 'other' {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.includes('pdf') || mimeType.includes('excel') || mimeType.includes('csv')) return 'document'
  return 'other'
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Check if file content matches its declared type (basic check)
 */
export function validateFileContent(buffer: ArrayBuffer, declaredType: string): boolean {
  const uint8Array = new Uint8Array(buffer.slice(0, 4))
  const header = Array.from(uint8Array).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()

  // Common file signatures
  const signatures: { [key: string]: string[] } = {
    'image/jpeg': ['FFD8FFE0', 'FFD8FFE1', 'FFD8FFE2', 'FFD8FFE3', 'FFD8FFE8'],
    'image/png': ['89504E47'],
    'image/gif': ['47494638'],
    'image/webp': ['52494646'], // RIFF header
    'application/pdf': ['25504446']
  }

  const expectedSignatures = signatures[declaredType]
  if (!expectedSignatures) {
    return true // Allow unknown types to pass basic check
  }

  return expectedSignatures.some(sig => header.startsWith(sig))
}
