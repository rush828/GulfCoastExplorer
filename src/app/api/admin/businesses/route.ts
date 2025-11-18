import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Force this route to be dynamic
export const dynamic = 'force-dynamic'

// GET - Fetch businesses with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const skip = (page - 1) * limit
    
    // Fetch businesses from database
    const [businesses, total] = await Promise.all([
      prisma.listing.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.listing.count()
    ])

    // Transform to match expected format
    const transformedBusinesses = businesses.map(b => ({
      id: b.id,
      name: b.name,
      primary_category: b.primaryCategory,
      categories_array: [],
      address: b.address,
      city: b.city,
      state: b.state,
      latitude: b.latitude,
      longitude: b.longitude,
      rating: b.rating,
      reviews_count: b.reviewsCount,
      website: b.website,
      phone: b.phone,
      description: b.description,
      priority_tier: b.priorityTier,
      featured_until: b.featuredUntil?.toISOString(),
      thumbnails: b.thumbnails
    }))

    return NextResponse.json({ 
      success: true, 
      businesses: transformedBusinesses,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error loading businesses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load businesses' },
      { status: 500 }
    )
  }
}

// PUT - Update a business
export async function PUT(request: NextRequest) {
  try {
    const business = await request.json()
    
    if (!business.id) {
      return NextResponse.json(
        { success: false, error: 'Business ID is required' },
        { status: 400 }
      )
    }

    // Update business in database
    const updatedBusiness = await prisma.listing.update({
      where: { id: business.id },
      data: {
        primaryCategory: business.primary_category,
        // categories_array would be updated via the categories relation if needed
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Business updated successfully',
      business: {
        id: updatedBusiness.id,
        name: updatedBusiness.name,
        primary_category: updatedBusiness.primaryCategory,
        categories_array: [],
        updated_at: updatedBusiness.updatedAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Error updating business:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update business' },
      { status: 500 }
    )
  }
}
