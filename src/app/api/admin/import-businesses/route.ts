import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { read, utils } from 'xlsx'
import { transformGoogleBusiness, validateBusiness, type GoogleBusinessData, type TransformedBusiness } from '@/lib/import-transformer'
import { batchDetectDuplicates, type DuplicateMatch } from '@/lib/duplicate-detector'
import { downloadAndOptimizeBusinessImage } from '@/lib/google-image-downloader'
import { generateBusinessId } from '@/lib/image-upload'

const DATA_FILE = path.join(process.cwd(), 'data', 'businesses-from-excel-corrected-ids.json')

interface ImportPreviewResponse {
  success: boolean
  total: number
  valid: number
  invalid: number
  duplicates: number
  businesses: Array<{
    index: number
    business: TransformedBusiness
    validation: { valid: boolean; errors: string[] }
    duplicate: DuplicateMatch | null
  }>
  errors?: string[]
}

/**
 * POST - Parse Excel file and return preview with duplicate detection
 */
export async function POST(request: NextRequest) {
  try {
    console.log('=== Import API called ===')
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      console.error('No file provided in request')
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }
    
    console.log('File received:', file.name, file.size, 'bytes')
    
    // Read file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('Buffer created, size:', buffer.length)
    
    // Parse Excel file
    const workbook = read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const googleData: GoogleBusinessData[] = utils.sheet_to_json(worksheet)
    
    console.log(`Parsed ${googleData.length} businesses from Excel`)
    
    // Load existing businesses for duplicate detection
    const dataContent = await fs.readFile(DATA_FILE, 'utf-8')
    const data = JSON.parse(dataContent)
    const existingBusinesses = data.businesses || {}
    
    console.log(`Loaded ${Object.keys(existingBusinesses).length} existing businesses`)
    
    // Transform and validate each business
    const transformedBusinesses: (TransformedBusiness | null)[] = []
    const validationResults: Array<{ valid: boolean; errors: string[] }> = []
    
    for (const googleBusiness of googleData) {
      try {
        const transformed = transformGoogleBusiness(googleBusiness)
        
        if (!transformed) {
          // Business was rejected due to invalid primary category
          transformedBusinesses.push(null)
          validationResults.push({
            valid: false,
            errors: [`Invalid category: "${googleBusiness.category}" not in allowed list`]
          })
          continue
        }
        
        const validation = validateBusiness(transformed)
        
        transformedBusinesses.push(transformed)
        validationResults.push(validation)
      } catch (error) {
        console.error('Error transforming business:', error)
        transformedBusinesses.push(null)
        validationResults.push({
          valid: false,
          errors: [`Transformation error: ${(error as Error).message}`]
        })
      }
    }
    
    // Detect duplicates
    console.log('Detecting duplicates...')
    const duplicates = batchDetectDuplicates(transformedBusinesses, existingBusinesses)
    console.log(`Found ${duplicates.size} potential duplicates`)
    
    // Build response (filter out null businesses for display)
    const businesses = transformedBusinesses.map((business, index) => ({
      index,
      business: business || {} as TransformedBusiness, // Provide empty object for null businesses
      validation: validationResults[index],
      duplicate: duplicates.get(index) || null
    }))
    
    const validCount = validationResults.filter(v => v.valid).length
    const invalidCount = validationResults.filter(v => !v.valid).length
    
    const response: ImportPreviewResponse = {
      success: true,
      total: googleData.length,
      valid: validCount,
      invalid: invalidCount,
      duplicates: duplicates.size,
      businesses
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('=== Import preview error ===')
    console.error('Error:', error)
    console.error('Stack:', (error as Error).stack)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process import',
        details: (error as Error).message,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    )
  }
}

/**
 * PUT - Execute import with approved businesses (create backup first)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { approvedBusinesses } = body as { approvedBusinesses: TransformedBusiness[] }
    
    if (!approvedBusinesses || !Array.isArray(approvedBusinesses)) {
      return NextResponse.json(
        { success: false, error: 'Invalid approved businesses' },
        { status: 400 }
      )
    }
    
    console.log(`Starting import of ${approvedBusinesses.length} businesses...`)
    
    // Debug: Log what we received
    console.log('=== SERVER RECEIVED ===')
    approvedBusinesses.forEach(biz => {
      console.log(`${biz.name}: primary=${biz.primary_category}, categories=[${biz.categories_array?.join(', ')}], categories_legacy=[${biz.categories?.join(', ')}]`)
    })
    
    // Load current data
    const dataContent = await fs.readFile(DATA_FILE, 'utf-8')
    const data = JSON.parse(dataContent)
    
    // Create backup
    const backupFile = path.join(
      process.cwd(), 
      'data', 
      `businesses-backup-import-${Date.now()}.json`
    )
    await fs.writeFile(backupFile, dataContent)
    console.log(`✅ Created backup: ${path.basename(backupFile)}`)
    
    let addedCount = 0
    let imageDownloadCount = 0
    const imageErrors: string[] = []
    
    // Process each approved business
    for (const business of approvedBusinesses) {
      // Generate unique business ID
      const businessId = generateBusinessId(business.name, business.city, business.primary_category)
      
      // Download and optimize image if available
      if (business.google_photo_url) {
        console.log(`Downloading image for: ${business.name}`)
        const imageResult = await downloadAndOptimizeBusinessImage(
          business.google_photo_url,
          businessId
        )
        
        if (imageResult.success && imageResult.filePath) {
          business.thumbnails = [imageResult.filePath]
          imageDownloadCount++
          console.log(`✅ Image saved: ${businessId}`)
        } else {
          console.log(`⚠️  Image download failed for ${business.name}: ${imageResult.error}`)
          imageErrors.push(`${business.name}: ${imageResult.error}`)
        }
      }
      
      // Remove google_photo_url from final data (temporary field)
      delete business.google_photo_url
      
      // Add business to database
      data.businesses[businessId] = business
      addedCount++
    }
    
    // Update metadata
    data.metadata = data.metadata || {}
    data.metadata.total_businesses = Object.keys(data.businesses).length
    data.metadata.updated_at = new Date().toISOString()
    data.metadata.last_import = {
      timestamp: new Date().toISOString(),
      added_count: addedCount,
      images_downloaded: imageDownloadCount,
      backup_file: path.basename(backupFile)
    }
    
    // Save updated data
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
    console.log(`✅ Import complete: ${addedCount} businesses added`)
    
    return NextResponse.json({
      success: true,
      message: `Successfully imported ${addedCount} businesses`,
      added_count: addedCount,
      images_downloaded: imageDownloadCount,
      image_errors: imageErrors.length > 0 ? imageErrors : undefined,
      backup_file: path.basename(backupFile),
      total_businesses: Object.keys(data.businesses).length
    })
    
  } catch (error) {
    console.error('Import execution error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to execute import',
        details: (error as Error).message 
      },
      { status: 500 }
    )
  }
}
