import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { generateBusinessId, optimizeAndSaveImage, deleteBusinessImage, validateImageFile } from '@/lib/image-upload'
import { withCSRFProtection } from '@/lib/csrf'
import { auditLogger, getUserInfo } from '@/lib/audit-log'

const prisma = new PrismaClient()

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

// GET - Fetch all businesses (for editing)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('id')

    // Check admin authentication via cookies (for client-side requests)
    const adminSession = request.cookies.get('admin-session')
    const adminSecret = request.cookies.get('admin-secret')
    const ADMIN_SECRET = process.env.ADMIN_SECRET
    
    if (!ADMIN_SECRET) {
      throw new Error('ADMIN_SECRET environment variable must be set')
    }
    
    if (!adminSession || !adminSecret || adminSecret.value !== ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    if (businessId) {
      // Return specific business
      const business = await prisma.listing.findUnique({
        where: { id: businessId }
      })
      
      if (!business) {
        return NextResponse.json(
          { success: false, error: 'Business not found' },
          { status: 404 }
        )
      }

      // Transform to match expected format
      return NextResponse.json({
        success: true,
        business: {
          id: business.id,
          name: business.name,
          primary_category: business.primaryCategory,
          categories: [], // Will be populated from categories relation if needed
          categories_array: [],
          address: business.address,
          city: business.city,
          state: business.state,
          latitude: business.latitude,
          longitude: business.longitude,
          rating: business.rating,
          reviews_count: business.reviewsCount,
          website: business.website,
          phone: business.phone,
          description: business.description,
          priority_tier: business.priorityTier,
          featured_until: business.featuredUntil?.toISOString(),
          google_types: business.googleTypes,
          thumbnails: business.thumbnails,
          contact_name: business.contactName,
          contact_email: business.contactEmail,
          contact_phone: business.contactPhone
        }
      })
    } else {
      // Return all businesses for listing
      const businesses = await prisma.listing.findMany({
        orderBy: { createdAt: 'desc' }
      })

      // Transform to match expected format
      const transformedBusinesses = businesses.map(business => ({
        id: business.id,
        name: business.name,
        primary_category: business.primaryCategory,
        categories: [],
        categories_array: [],
        address: business.address,
        city: business.city,
        state: business.state,
        latitude: business.latitude,
        longitude: business.longitude,
        rating: business.rating,
        reviews_count: business.reviewsCount,
        website: business.website,
        phone: business.phone,
        description: business.description,
        priority_tier: business.priorityTier,
        featured_until: business.featuredUntil?.toISOString(),
        google_types: business.googleTypes,
        thumbnails: business.thumbnails,
        contact_name: business.contactName,
        contact_email: business.contactEmail,
        contact_phone: business.contactPhone
      }))

      return NextResponse.json({
        success: true,
        businesses: transformedBusinesses,
        total: transformedBusinesses.length
      })
    }
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch businesses' },
      { status: 500 }
    )
  }
}

// POST - Create new business
async function createBusinessHandler(request: NextRequest) {
  try {
    const userInfo = getUserInfo(request)
    
    // Check admin authentication via cookies (for client-side requests)
    const adminSession = request.cookies.get('admin-session')
    const adminSecret = request.cookies.get('admin-secret')
    const ADMIN_SECRET = process.env.ADMIN_SECRET
    
    if (!ADMIN_SECRET) {
      throw new Error('ADMIN_SECRET environment variable must be set')
    }
    
    if (!adminSession || !adminSecret || adminSecret.value !== ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    
    // Extract business data
    const name = formData.get('name') as string
    const primaryCategory = formData.get('primary_category') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string
    const address = formData.get('address') as string

    // Validate required fields
    if (!name || !primaryCategory || !city || !state) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, primary_category, city, state' },
        { status: 400 }
      )
    }

    // Generate unique business ID and slug
    const businessId = generateBusinessId(name, city, primaryCategory)
    const slug = generateSlug(name, city)

    // Handle image upload if provided
    let thumbnails: string[] = []
    const imageFile = formData.get('image') as File | null
    if (imageFile && imageFile.size > 0) {
      const validation = validateImageFile(imageFile)
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        )
      }

      const imageBuffer = Buffer.from(await imageFile.arrayBuffer())
      const imageResult = await optimizeAndSaveImage(imageBuffer, businessId, imageFile.name)
      
      if (!imageResult.success) {
        return NextResponse.json(
          { success: false, error: imageResult.error },
          { status: 500 }
        )
      }

      thumbnails = [imageResult.filePath!]
    }

    // Create business in database
    const business = await prisma.listing.create({
      data: {
        id: businessId,
        name,
        slug,
        primaryCategory,
        categoriesArray: JSON.parse(formData.get('categories_array') as string || '[]'),
        address: address || '',
        city,
        state,
        latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : undefined,
        longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : undefined,
        rating: formData.get('rating') ? parseFloat(formData.get('rating') as string) : undefined,
        reviewsCount: formData.get('reviews_count') ? parseInt(formData.get('reviews_count') as string) : undefined,
        website: (formData.get('website') as string) || undefined,
        phone: (formData.get('phone') as string) || undefined,
        description: (formData.get('description') as string) || undefined,
        priorityTier: formData.get('priority_tier') ? parseInt(formData.get('priority_tier') as string) : 1,
        featuredUntil: formData.get('featured_until') ? new Date(formData.get('featured_until') as string) : undefined,
        googleTypes: JSON.parse(formData.get('google_types') as string || '["establishment"]'),
        thumbnails,
        contactName: (formData.get('contact_name') as string) || undefined,
        contactEmail: (formData.get('contact_email') as string) || undefined,
        contactPhone: (formData.get('contact_phone') as string) || undefined,
        status: 'PUBLISHED'
      }
    })

    // Log the action
    auditLogger.log({
      action: 'business_created',
      resource: 'business_data',
      ...userInfo,
      details: {
        businessId: business.id,
        businessName: business.name,
        city: business.city,
        state: business.state,
        category: business.primaryCategory,
        hasImage: thumbnails.length > 0
      },
      result: 'success',
      riskLevel: 'medium'
    })

    return NextResponse.json({
      success: true,
      businessId: business.id,
      business: {
        id: business.id,
        name: business.name,
        primary_category: business.primaryCategory,
        categories: [],
        categories_array: [],
        address: business.address,
        city: business.city,
        state: business.state,
        thumbnails: business.thumbnails
      },
      message: 'Business created successfully'
    })

  } catch (error) {
    console.error('Error creating business:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create business', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// PUT - Update existing business
async function updateBusinessHandler(request: NextRequest) {
  try {
    const userInfo = getUserInfo(request)
    
    // Check admin authentication via cookies (for client-side requests)
    const adminSession = request.cookies.get('admin-session')
    const adminSecret = request.cookies.get('admin-secret')
    const ADMIN_SECRET = process.env.ADMIN_SECRET
    
    if (!ADMIN_SECRET) {
      throw new Error('ADMIN_SECRET environment variable must be set')
    }
    
    if (!adminSession || !adminSecret || adminSecret.value !== ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const businessId = formData.get('id') as string

    if (!businessId) {
      return NextResponse.json(
        { success: false, error: 'Business ID is required' },
        { status: 400 }
      )
    }

    // Check if business exists
    const existingBusiness = await prisma.listing.findUnique({
      where: { id: businessId }
    })

    if (!existingBusiness) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    // Handle new image upload if provided
    let thumbnails = existingBusiness.thumbnails
    const imageFile = formData.get('image') as File | null
    if (imageFile && imageFile.size > 0) {
      const validation = validateImageFile(imageFile)
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        )
      }

      // Delete old image if it exists
      await deleteBusinessImage(businessId)

      const imageBuffer = Buffer.from(await imageFile.arrayBuffer())
      const imageResult = await optimizeAndSaveImage(imageBuffer, businessId, imageFile.name)
      
      if (!imageResult.success) {
        return NextResponse.json(
          { success: false, error: imageResult.error },
          { status: 500 }
        )
      }

      thumbnails = [imageResult.filePath!]
    }

    // Update business in database
    const updatedBusiness = await prisma.listing.update({
      where: { id: businessId },
      data: {
        name: formData.get('name') as string,
        primaryCategory: formData.get('primary_category') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : undefined,
        longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : undefined,
        rating: formData.get('rating') ? parseFloat(formData.get('rating') as string) : undefined,
        reviewsCount: formData.get('reviews_count') ? parseInt(formData.get('reviews_count') as string) : undefined,
        website: (formData.get('website') as string) || undefined,
        phone: (formData.get('phone') as string) || undefined,
        description: (formData.get('description') as string) || undefined,
        priorityTier: formData.get('priority_tier') ? parseInt(formData.get('priority_tier') as string) : 1,
        featuredUntil: formData.get('featured_until') ? new Date(formData.get('featured_until') as string) : undefined,
        googleTypes: JSON.parse(formData.get('google_types') as string || '["establishment"]'),
        thumbnails,
        contactName: (formData.get('contact_name') as string) || undefined,
        contactEmail: (formData.get('contact_email') as string) || undefined,
        contactPhone: (formData.get('contact_phone') as string) || undefined
      }
    })

    // Log the action
    auditLogger.log({
      action: 'business_updated',
      resource: 'business_data',
      ...userInfo,
      details: {
        businessId: updatedBusiness.id,
        businessName: updatedBusiness.name,
        city: updatedBusiness.city,
        state: updatedBusiness.state,
        category: updatedBusiness.primaryCategory,
        hasNewImage: !!imageFile
      },
      result: 'success',
      riskLevel: 'medium'
    })

    return NextResponse.json({
      success: true,
      business: {
        id: updatedBusiness.id,
        name: updatedBusiness.name,
        primary_category: updatedBusiness.primaryCategory,
        address: updatedBusiness.address,
        city: updatedBusiness.city,
        state: updatedBusiness.state
      },
      message: 'Business updated successfully'
    })

  } catch (error) {
    console.error('Error updating business:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update business' },
      { status: 500 }
    )
  }
}

// DELETE - Delete business
async function deleteBusinessHandler(request: NextRequest) {
  try {
    const userInfo = getUserInfo(request)
    
    // Check admin authentication via cookies (for client-side requests)
    const adminSession = request.cookies.get('admin-session')
    const adminSecret = request.cookies.get('admin-secret')
    const ADMIN_SECRET = process.env.ADMIN_SECRET
    
    if (!ADMIN_SECRET) {
      throw new Error('ADMIN_SECRET environment variable must be set')
    }
    
    if (!adminSession || !adminSecret || adminSecret.value !== ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('id')

    if (!businessId) {
      return NextResponse.json(
        { success: false, error: 'Business ID is required' },
        { status: 400 }
      )
    }

    // Get business for logging before deletion
    const business = await prisma.listing.findUnique({
      where: { id: businessId }
    })

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    // Delete associated image
    await deleteBusinessImage(businessId)

    // Delete business from database
    await prisma.listing.delete({
      where: { id: businessId }
    })

    // Log the action
    auditLogger.log({
      action: 'business_deleted',
      resource: 'business_data',
      ...userInfo,
      details: {
        businessId: business.id,
        businessName: business.name,
        city: business.city,
        state: business.state,
        category: business.primaryCategory
      },
      result: 'success',
      riskLevel: 'high'
    })

    return NextResponse.json({
      success: true,
      message: 'Business deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting business:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete business' },
      { status: 500 }
    )
  }
}

// Apply CSRF protection to state-changing operations
export const POST = withCSRFProtection(createBusinessHandler)
export const PUT = withCSRFProtection(updateBusinessHandler)
export const DELETE = withCSRFProtection(deleteBusinessHandler)
