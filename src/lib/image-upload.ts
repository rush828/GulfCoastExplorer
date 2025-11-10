/**
 * Image Upload and Optimization Utility
 * Handles business image uploads with automatic optimization and unique ID generation
 * Images are uploaded to Cloudinary for production use
 */

import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary (only if credentials are available)
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
}

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
 * Optimize and save uploaded image to Cloudinary
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

    // Optimize image using Sharp
    const optimizedBuffer = await sharp(imageBuffer)
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
      .toBuffer()

    // Upload to Cloudinary if configured
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        // Convert buffer to base64 for Cloudinary upload
        const base64Image = `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`
        
        const result = await cloudinary.uploader.upload(base64Image, {
          folder: 'gulf-coast-directory/thumbnails',
          public_id: businessId,
          overwrite: true,
          resource_type: 'image'
        })

        console.log(`✅ Uploaded to Cloudinary: ${businessId}`)
        
        return {
          success: true,
          filePath: result.secure_url,
          fileName: businessId
        }
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError)
        // Fall back to local storage if Cloudinary fails
      }
    }

    // Fallback: Save locally (for development or if Cloudinary not configured)
    const thumbnailsDir = path.join(process.cwd(), 'public', 'images', 'thumbnails')
    const filePath = path.join(thumbnailsDir, fileName)
    await fs.mkdir(thumbnailsDir, { recursive: true })
    await fs.writeFile(filePath, optimizedBuffer)

    console.log(`ℹ️ Saved locally (Cloudinary not configured): ${businessId}`)

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
 * Delete business image from Cloudinary and local storage
 */
export async function deleteBusinessImage(businessId: string): Promise<boolean> {
  try {
    // Try to delete from Cloudinary if configured
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        await cloudinary.uploader.destroy(`gulf-coast-directory/thumbnails/${businessId}`)
        console.log(`✅ Deleted from Cloudinary: ${businessId}`)
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError)
        // Continue to try local delete even if Cloudinary fails
      }
    }

    // Also try to delete from local storage (if it exists)
    const fileName = `${businessId}.jpg`
    const filePath = path.join(process.cwd(), 'public', 'images', 'thumbnails', fileName)
    
    try {
      await fs.access(filePath)
      await fs.unlink(filePath)
      console.log(`✅ Deleted locally: ${businessId}`)
    } catch (error) {
      // File doesn't exist locally, which is fine
    }
    
    return true
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




