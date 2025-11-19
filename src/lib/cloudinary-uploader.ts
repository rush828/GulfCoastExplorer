/**
 * Cloudinary Image Uploader
 * Uploads images from URLs to Cloudinary for business imports
 */

import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary (only if credentials are available)
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
}

export interface CloudinaryUploadResult {
  success: boolean
  url?: string
  publicId?: string
  error?: string
}

/**
 * Upload image from URL to Cloudinary
 */
export async function uploadImageToCloudinary(
  imageUrl: string,
  businessId: string
): Promise<CloudinaryUploadResult> {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.log('Cloudinary not configured, using original URL')
      // Return the original Google URL if Cloudinary is not configured
      return {
        success: true,
        url: imageUrl,
        publicId: businessId
      }
    }

    console.log(`Uploading image to Cloudinary for: ${businessId}`)
    
    // Upload to Cloudinary from URL
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'gulf-coast-directory/thumbnails',
      public_id: businessId,
      overwrite: true,
      transformation: [
        { width: 400, height: 300, crop: 'fill', gravity: 'auto' },
        { quality: 'auto:good', fetch_format: 'auto' }
      ]
    })

    console.log(`✅ Image uploaded to Cloudinary: ${result.secure_url}`)

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    }
  } catch (error) {
    console.error(`❌ Failed to upload image to Cloudinary for ${businessId}:`, error)
    
    // Fallback: Return the original URL if Cloudinary upload fails
    return {
      success: true,
      url: imageUrl,
      error: error instanceof Error ? error.message : 'Cloudinary upload failed, using original URL'
    }
  }
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return false
    }

    await cloudinary.uploader.destroy(publicId)
    console.log(`✅ Image deleted from Cloudinary: ${publicId}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to delete image from Cloudinary:`, error)
    return false
  }
}

