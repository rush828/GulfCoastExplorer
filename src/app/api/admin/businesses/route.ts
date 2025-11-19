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
    const limit = parseInt(searchParams.get('limit') || '10000') // Increased to load all businesses
    const skip = (page - 1) * limit
    
    // Fetch businesses from database
    const [businesses, total] = await Promise.all([
      prisma.listing.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' } // Sort by name for easier searching
      }),
      prisma.listing.count()
    ])

    // Transform to match expected format
    const transformedBusinesses = businesses.map(b => ({
      id: b.id,
      name: b.name,
      primary_category: b.primaryCategory,
      categories_array: b.categoriesArray || [],
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
      thumbnails: b.thumbnails,
      placeId: b.placeId,
      createdAt: b.createdAt.toISOString(),
      contactName: b.contactName,
      contactEmail: b.contactEmail,
      contactPhone: b.contactPhone
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
    const updateData: any = {
      updatedAt: new Date()
    }
    
    // Only update fields that are provided
    if (business.primary_category !== undefined) updateData.primaryCategory = business.primary_category
    if (business.categories_array !== undefined) updateData.categoriesArray = business.categories_array
    if (business.priority_tier !== undefined) updateData.priorityTier = business.priority_tier
    if (business.name !== undefined) updateData.name = business.name
    if (business.address !== undefined) updateData.address = business.address
    if (business.city !== undefined) updateData.city = business.city
    if (business.state !== undefined) updateData.state = business.state
    if (business.rating !== undefined) updateData.rating = business.rating
    if (business.reviews_count !== undefined) updateData.reviewsCount = business.reviews_count
    if (business.website !== undefined) updateData.website = business.website
    if (business.phone !== undefined) updateData.phone = business.phone
    if (business.description !== undefined) updateData.description = business.description
    if (business.featured_until !== undefined) updateData.featuredUntil = business.featured_until ? new Date(business.featured_until) : null
    
    const updatedBusiness = await prisma.listing.update({
      where: { id: business.id },
      data: updateData
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Business updated successfully',
      business: {
        id: updatedBusiness.id,
        name: updatedBusiness.name,
        primary_category: updatedBusiness.primaryCategory,
        categories_array: updatedBusiness.categoriesArray || [],
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
