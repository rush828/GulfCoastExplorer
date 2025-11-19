import { NextRequest, NextResponse } from 'next/server'
import { read, utils } from 'xlsx'
import { PrismaClient } from '@prisma/client'
import { transformGoogleBusiness, validateBusiness, type GoogleBusinessData, type TransformedBusiness } from '@/lib/import-transformer'
import { batchDetectDuplicates, type DuplicateMatch } from '@/lib/duplicate-detector'
import { uploadImageToCloudinary } from '@/lib/cloudinary-uploader'
import { generateBusinessId } from '@/lib/image-upload'
import { formatPhoneNumber } from '@/lib/format-utils'

const prisma = new PrismaClient()

// Force this route to be dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
    
    // Load existing businesses from database for duplicate detection
    const existingListings = await prisma.listing.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        phone: true,
        primaryCategory: true,
        categoriesArray: true
      }
    })
    
    // Transform to match expected format for duplicate detector
    const existingBusinesses: Record<string, any> = {}
    existingListings.forEach(listing => {
      existingBusinesses[listing.id] = {
        name: listing.name,
        address: listing.address,
        city: listing.city,
        state: listing.state,
        phone: listing.phone,
        primary_category: listing.primaryCategory,
        categories_array: listing.categoriesArray || []
      }
    })
    
    console.log(`Loaded ${Object.keys(existingBusinesses).length} existing businesses from database`)
    
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
    
    let addedCount = 0
    let imageUploadCount = 0
    const imageErrors: string[] = []
    
    // Process each approved business
    for (const business of approvedBusinesses) {
      // Generate unique business ID
      const businessId = generateBusinessId(business.name, business.city, business.primary_category)
      
      // Generate slug
      const slug = `${business.city}_${business.name}`
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        + `_${Date.now().toString().slice(-6)}`
      
      // Upload image to Cloudinary if available
      let thumbnails: string[] = []
      if (business.google_photo_url) {
        console.log(`Uploading image to Cloudinary for: ${business.name}`)
        const imageResult = await uploadImageToCloudinary(
          business.google_photo_url,
          businessId
        )
        
        if (imageResult.success && imageResult.url) {
          thumbnails = [imageResult.url]
          imageUploadCount++
          console.log(`✅ Image uploaded: ${businessId}`)
        } else {
          console.log(`⚠️  Image upload failed for ${business.name}: ${imageResult.error}`)
          imageErrors.push(`${business.name}: ${imageResult.error}`)
        }
      }
      
      // Create business in database
      try {
        await prisma.listing.create({
          data: {
            id: businessId,
            name: business.name,
            slug: slug,
            description: business.description || null,
            address: business.address || '',
            city: business.city,
            state: business.state,
            zipCode: business.zip_code || null,
            phone: business.phone ? formatPhoneNumber(business.phone) : null,
            website: business.website || null,
            email: business.email || null,
            latitude: business.latitude || null,
            longitude: business.longitude || null,
            placeId: business.place_id || null,
            status: 'PUBLISHED',
            primaryCategory: business.primary_category,
            categoriesArray: business.categories_array || [],
            rating: business.rating || null,
            reviewsCount: business.reviews_count || null,
            priorityTier: business.priority_tier || 1,
            featuredUntil: business.featured_until ? new Date(business.featured_until) : null,
            googleTypes: business.google_types || ['establishment'],
            thumbnails: thumbnails,
            contactName: null,
            contactEmail: null,
            contactPhone: null
          }
        })
        addedCount++
        console.log(`✅ Added to database: ${business.name}`)
      } catch (error) {
        console.error(`❌ Failed to add ${business.name} to database:`, error)
        imageErrors.push(`${business.name}: Database error - ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
    
    // Get total count
    const totalBusinesses = await prisma.listing.count()
    console.log(`✅ Import complete: ${addedCount} businesses added`)
    
    return NextResponse.json({
      success: true,
      message: `Successfully imported ${addedCount} businesses`,
      added_count: addedCount,
      images_uploaded: imageUploadCount,
      image_errors: imageErrors.length > 0 ? imageErrors : undefined,
      total_businesses: totalBusinesses
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
