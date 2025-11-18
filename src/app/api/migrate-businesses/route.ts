import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { promises as fs } from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Force this route to be dynamic (not pre-rendered at build time)
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Helper function to generate URL-friendly slug
function generateSlug(name: string, city: string): string {
  const baseSlug = `${city}_${name}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
  
  // Add timestamp to ensure uniqueness
  const timestamp = Date.now().toString().slice(-6)
  return `${baseSlug}_${timestamp}`
}

export async function GET(request: NextRequest) {
  try {
    // Read the JSON file
    const dataFile = path.join(process.cwd(), 'data', 'businesses-from-excel-corrected-ids.json')
    const content = await fs.readFile(dataFile, 'utf-8')
    const data = JSON.parse(content)

    // Extract businesses array
    let businessArray: any[] = []
    
    if (data.businesses) {
      if (Array.isArray(data.businesses)) {
        businessArray = data.businesses
      } else if (typeof data.businesses === 'object') {
        // Convert object to array
        businessArray = Object.entries(data.businesses).map(([businessId, business]) => ({
          ...(business as object),
          id: businessId
        }))
      }
    } else if (Array.isArray(data)) {
      businessArray = data
    }

    console.log(`Found ${businessArray.length} businesses to migrate`)

    // Get existing business IDs to avoid duplicates
    const existingBusinesses = await prisma.listing.findMany({
      select: { id: true }
    })
    const existingIds = new Set(existingBusinesses.map(b => b.id))
    console.log(`Database already has ${existingIds.size} businesses`)

    // Filter out businesses that already exist
    const newBusinesses = businessArray.filter(b => !existingIds.has(b.id))
    console.log(`Will insert ${newBusinesses.length} new businesses`)

    let successCount = 0
    let errorCount = 0
    const errors: any[] = []

    // Insert businesses one by one (safer than bulk insert for large datasets)
    for (const business of newBusinesses) {
      try {
        // Generate slug
        const slug = generateSlug(business.name || 'unknown', business.city || 'unknown')

        await prisma.listing.create({
          data: {
            id: business.id,
            name: business.name || business.business_name || 'Unknown',
            slug: slug,
            primaryCategory: business.primary_category || business.category || 'business',
            address: business.address || business.formatted_address || '',
            city: business.city || '',
            state: business.state || '',
            zipCode: business.zip_code || business.zipCode || null,
            latitude: business.latitude ? parseFloat(business.latitude) : null,
            longitude: business.longitude ? parseFloat(business.longitude) : null,
            rating: business.rating ? parseFloat(business.rating) : null,
            reviewsCount: business.reviews_count || business.user_ratings_total || null,
            website: business.website || business.website_url || null,
            phone: business.phone || business.international_phone_number || null,
            email: business.email || null,
            description: business.description || null,
            priorityTier: business.priority_tier || 1,
            featuredUntil: business.featured_until ? new Date(business.featured_until) : null,
            googleTypes: business.types || business.google_types || ['establishment'],
            thumbnails: business.thumbnails || [],
            placeId: business.place_id || business.placeId || null,
            contactName: business.contact_name || null,
            contactEmail: business.contact_email || null,
            contactPhone: business.contact_phone || null,
            status: 'PUBLISHED'
          }
        })
        successCount++
        
        // Log progress every 100 businesses
        if (successCount % 100 === 0) {
          console.log(`Migrated ${successCount}/${newBusinesses.length} businesses...`)
        }
      } catch (error: any) {
        errorCount++
        errors.push({
          businessId: business.id,
          businessName: business.name,
          error: error.message
        })
        
        // Only log first 10 errors to avoid spam
        if (errors.length <= 10) {
          console.error(`Error migrating business ${business.id}:`, error.message)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Business migration completed',
      stats: {
        totalInFile: businessArray.length,
        alreadyInDatabase: existingIds.size,
        newBusinesses: newBusinesses.length,
        successfullyMigrated: successCount,
        errors: errorCount,
        errorDetails: errors.slice(0, 10) // Only return first 10 errors
      }
    })

  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

