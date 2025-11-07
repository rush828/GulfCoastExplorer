/**
 * Google Image Downloader for Business Imports
 * Downloads, optimizes, and saves business images from Google photo URLs
 */

import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'
import https from 'https'
import http from 'http'

export interface ImageDownloadResult {
  success: boolean
  filePath?: string
  fileName?: string
  error?: string
}

/**
 * Download image from URL
 */
async function downloadImageFromUrl(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`))
        return
      }
      
      const chunks: Buffer[] = []
      
      response.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })
      
      response.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
    }).on('error', (error) => {
      reject(error)
    })
  })
}

/**
 * Download, optimize, and save Google business image
 */
export async function downloadAndOptimizeBusinessImage(
  imageUrl: string,
  businessId: string
): Promise<ImageDownloadResult> {
  try {
    console.log(`Downloading image for business: ${businessId}`)
    
    // Download image from URL
    const imageBuffer = await downloadImageFromUrl(imageUrl)
    
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

    console.log(`✅ Image saved: ${fileName}`)

    return {
      success: true,
      filePath: `/images/thumbnails/${fileName}`,
      fileName
    }
  } catch (error) {
    console.error(`❌ Failed to download/optimize image for ${businessId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to download and optimize image'
    }
  }
}

/**
 * Extract first valid image URL from Google photos array or string
 */
export function extractImageUrl(photos: string | string[] | undefined): string | null {
  if (!photos) return null
  
  // Handle string (semicolon-separated URLs)
  if (typeof photos === 'string') {
    const urls = photos.split(';').map(url => url.trim()).filter(url => url.length > 0)
    return urls[0] || null
  }
  
  // Handle array
  if (Array.isArray(photos) && photos.length > 0) {
    return photos[0]
  }
  
  return null
}

/**
 * Batch download images for multiple businesses
 */
export async function batchDownloadBusinessImages(
  businesses: Array<{ id: string; imageUrl: string | null }>
): Promise<Map<string, ImageDownloadResult>> {
  const results = new Map<string, ImageDownloadResult>()
  
  console.log(`Starting batch download for ${businesses.length} businesses...`)
  
  for (const business of businesses) {
    if (!business.imageUrl) {
      results.set(business.id, {
        success: false,
        error: 'No image URL provided'
      })
      continue
    }
    
    const result = await downloadAndOptimizeBusinessImage(business.imageUrl, business.id)
    results.set(business.id, result)
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  const successCount = Array.from(results.values()).filter(r => r.success).length
  console.log(`✅ Batch download complete: ${successCount}/${businesses.length} successful`)
  
  return results
}




