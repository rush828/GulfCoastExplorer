/**
 * Image Upload and Optimization Utility
 * Handles business image uploads with automatic optimization and unique ID generation
 */

import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'

export interface ImageUploadResult {
  success: boolean
  filePath?: string
  fileName?: string
  error?: string
}

/**
 * Generate unique business ID in the format: city_category_businessname_uniquenumber
 */
export function generateBusinessId(businessName: string, city: string, primaryCategory: string): string {
  // Normalize inputs
  const normalizedCity = city.toLowerCase().replace(/[^a-z0-9]/g, '_')
  const normalizedCategory = primaryCategory.toLowerCase().replace(/[^a-z0-9]/g, '_')
  const normalizedName = businessName.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars except spaces
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
  
  // Generate unique number (timestamp + random)
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  const uniqueNumber = `${timestamp}${random}`
  
  return `${normalizedCity}_${normalizedCategory}_${normalizedName}_${uniqueNumber}`
}

/**
 * Optimize and save uploaded image
 */
export async function optimizeAndSaveImage(
  imageBuffer: Buffer,
  businessId: string,
  originalName: string
): Promise<ImageUploadResult> {
  try {
    // Get file extension from original name
    const ext = path.extname(originalName).toLowerCase()
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp']
    
    if (!allowedExtensions.includes(ext)) {
      return {
        success: false,
        error: 'Invalid file type. Only JPG, PNG, and WebP files are allowed.'
      }
    }

    // Create filename with business ID
    const fileName = `${businessId}.jpg`
    const thumbnailsDir = path.join(process.cwd(), 'public', 'images', 'thumbnails')
    const filePath = path.join(thumbnailsDir, fileName)

    // Ensure thumbnails directory exists
    await fs.mkdir(thumbnailsDir, { recursive: true })

    // Optimize image using Sharp
    await sharp(imageBuffer)
      .resize({
        width: 400,
        height: 300,
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 85,
        progressive: true
      })
      .toFile(filePath)

    return {
      success: true,
      filePath: `/images/thumbnails/${fileName}`,
      fileName
    }
  } catch (error) {
    console.error('Image optimization error:', error)
    return {
      success: false,
      error: 'Failed to optimize and save image'
    }
  }
}

/**
 * Delete business image
 */
export async function deleteBusinessImage(businessId: string): Promise<boolean> {
  try {
    const fileName = `${businessId}.jpg`
    const filePath = path.join(process.cwd(), 'public', 'images', 'thumbnails', fileName)
    
    // Check if file exists before attempting to delete
    try {
      await fs.access(filePath)
      await fs.unlink(filePath)
      return true
    } catch (error) {
      // File doesn't exist, which is fine
      return true
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Maximum size is 5MB.'
    }
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPG, PNG, and WebP files are allowed.'
    }
  }

  return { valid: true }
}




