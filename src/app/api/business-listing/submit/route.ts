import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { generateBusinessId } from '@/lib/image-upload'
import { withCSRFProtection } from '@/lib/csrf'

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

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST - Save business listing before PayPal redirect
 * Creates a business with PENDING status, returns business ID for PayPal custom field
 */
async function submitBusinessListing(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form data
    const businessName = formData.get('businessName') as string
    const businessType = formData.get('businessType') as string
    const contactName = formData.get('contactName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string
    const zipCode = formData.get('zipCode') as string
    const website = formData.get('website') as string
    const description = formData.get('description') as string
    const listingType = formData.get('listingType') as 'basic' | 'featured'
    
    // Validate required fields
    if (!businessName || !businessType || !contactName || !email || !phone || 
        !address || !city || !state || !zipCode || !description || !listingType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Generate business ID and slug
    const businessId = generateBusinessId(businessName, city, businessType)
    const slug = generateSlug(businessName, city)
    
    // Check if business already exists
    const existing = await prisma.listing.findUnique({
      where: { id: businessId }
    })
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Business already exists' },
        { status: 400 }
      )
    }
    
    // Create business with PENDING status
    const business = await prisma.listing.create({
      data: {
        id: businessId,
        name: businessName,
        slug,
        primaryCategory: businessType,
        categoriesArray: [businessType],
        address,
        city,
        state,
        zipCode,
        phone,
        website: website || undefined,
        description,
        status: 'PENDING',
        contactName,
        contactEmail: email,
        contactPhone: phone,
        priorityTier: listingType === 'featured' ? 2 : 1,
        featuredUntil: listingType === 'featured' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : undefined,
        googleTypes: ['establishment'],
        thumbnails: []
      }
    })
    
    return NextResponse.json({
      success: true,
      businessId: business.id,
      businessName: business.name,
      listingType
    })
    
  } catch (error) {
    console.error('Error creating business listing:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create business listing',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    )
  }
}

export const POST = withCSRFProtection(submitBusinessListing)

