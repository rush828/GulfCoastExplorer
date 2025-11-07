import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { generateBusinessId, optimizeAndSaveImage, deleteBusinessImage, validateImageFile } from '@/lib/image-upload'
import { withCSRFProtection } from '@/lib/csrf'
import { auditLogger, getUserInfo } from '@/lib/audit-log'

// Business interface matching your current structure
interface Business {
  name: string
  primary_category: string
  categories: string[]
  categories_array: string[]
  address: string
  city: string
  state: string
  latitude?: number
  longitude?: number
  rating?: number
  reviews_count?: number
  website?: string
  phone?: string
  description?: string
  priority_tier?: number
  featured_until?: string
  google_types?: string[]
  thumbnails?: string[]
  // Contact information (private - not displayed publicly)
  contact_name?: string
  contact_email?: string
  contact_phone?: string
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

    const dataFile = path.join(process.cwd(), 'data', 'businesses-from-excel-corrected-ids.json')
    const data = JSON.parse(await fs.readFile(dataFile, 'utf-8'))

    if (businessId) {
      // Return specific business
      const business = data.businesses[businessId]
      if (!business) {
        return NextResponse.json(
          { success: false, error: 'Business not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        business: { ...business, id: businessId }
      })
    } else {
      // Return all businesses for listing
      const businesses = Object.entries(data.businesses).map(([id, business]) => ({
        ...(business as any),
        id: id
      }))

      return NextResponse.json({
        success: true,
        businesses,
        total: businesses.length
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
    const businessData: Business = {
      name: formData.get('name') as string,
      primary_category: formData.get('primary_category') as string,
      categories: JSON.parse(formData.get('categories') as string || '[]'),
      categories_array: JSON.parse(formData.get('categories_array') as string || '[]'),
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : undefined,
      longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : undefined,
      rating: formData.get('rating') ? parseFloat(formData.get('rating') as string) : undefined,
      reviews_count: formData.get('reviews_count') ? parseInt(formData.get('reviews_count') as string) : undefined,
      website: formData.get('website') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      description: formData.get('description') as string || undefined,
      priority_tier: formData.get('priority_tier') ? parseInt(formData.get('priority_tier') as string) : 1,
      featured_until: formData.get('featured_until') as string || undefined,
      google_types: JSON.parse(formData.get('google_types') as string || '["establishment"]'),
      // Contact information (private)
      contact_name: formData.get('contact_name') as string || undefined,
      contact_email: formData.get('contact_email') as string || undefined,
      contact_phone: formData.get('contact_phone') as string || undefined,
    }

    // Validate required fields
    if (!businessData.name || !businessData.primary_category || !businessData.city || !businessData.state) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, primary_category, city, state' },
        { status: 400 }
      )
    }

    // Generate unique business ID
    const businessId = generateBusinessId(businessData.name, businessData.city, businessData.primary_category)

    // Handle image upload if provided
    const imageFile = formData.get('image') as File | null
    if (imageFile) {
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

      // Add thumbnail path to business data
      businessData.thumbnails = [imageResult.filePath!]
    }

    // Load current data
    const dataFile = path.join(process.cwd(), 'data', 'businesses-from-excel-corrected-ids.json')
    const data = JSON.parse(await fs.readFile(dataFile, 'utf-8'))

    // Create backup
    const backupFile = path.join(process.cwd(), 'data', `businesses-backup-${new Date().toISOString().replace(/:/g, '-')}.json`)
    await fs.writeFile(backupFile, JSON.stringify(data, null, 2), 'utf-8')

    // Add new business
    data.businesses[businessId] = businessData
    data.metadata.total_businesses = Object.keys(data.businesses).length
    data.metadata.updated_at = new Date().toISOString()

    // Save updated data
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf-8')

    // Log the action
    auditLogger.log({
      action: 'business_created',
      resource: 'business_data',
      ...userInfo,
      details: {
        businessId: businessId,
        businessName: businessData.name,
        city: businessData.city,
        state: businessData.state,
        category: businessData.primary_category,
        hasImage: !!imageFile
      },
      result: 'success',
      riskLevel: 'medium'
    })

    return NextResponse.json({
      success: true,
      businessId,
      business: { ...businessData, id: businessId },
      message: 'Business created successfully'
    })

  } catch (error) {
    console.error('Error creating business:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create business' },
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

    // Load current data
    const dataFile = path.join(process.cwd(), 'data', 'businesses-from-excel-corrected-ids.json')
    const data = JSON.parse(await fs.readFile(dataFile, 'utf-8'))

    if (!data.businesses[businessId]) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    // Extract updated business data
    const updatedBusiness: Business = {
      name: formData.get('name') as string,
      primary_category: formData.get('primary_category') as string,
      categories: JSON.parse(formData.get('categories') as string || '[]'),
      categories_array: JSON.parse(formData.get('categories_array') as string || '[]'),
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : undefined,
      longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : undefined,
      rating: formData.get('rating') ? parseFloat(formData.get('rating') as string) : undefined,
      reviews_count: formData.get('reviews_count') ? parseInt(formData.get('reviews_count') as string) : undefined,
      website: formData.get('website') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      description: formData.get('description') as string || undefined,
      priority_tier: formData.get('priority_tier') ? parseInt(formData.get('priority_tier') as string) : 1,
      featured_until: formData.get('featured_until') as string || undefined,
      google_types: JSON.parse(formData.get('google_types') as string || '["establishment"]'),
      // Contact information (private)
      contact_name: formData.get('contact_name') as string || undefined,
      contact_email: formData.get('contact_email') as string || undefined,
      contact_phone: formData.get('contact_phone') as string || undefined,
      // Preserve existing thumbnails
      thumbnails: data.businesses[businessId].thumbnails || []
    }

    // Handle new image upload if provided
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

      // Update thumbnail path
      updatedBusiness.thumbnails = [imageResult.filePath!]
    }

    // Create backup
    const backupFile = path.join(process.cwd(), 'data', `businesses-backup-${new Date().toISOString().replace(/:/g, '-')}.json`)
    await fs.writeFile(backupFile, JSON.stringify(data, null, 2), 'utf-8')

    // Update business
    data.businesses[businessId] = updatedBusiness
    data.metadata.updated_at = new Date().toISOString()

    // Save updated data
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf-8')

    // Log the action
    auditLogger.log({
      action: 'business_updated',
      resource: 'business_data',
      ...userInfo,
      details: {
        businessId: businessId,
        businessName: updatedBusiness.name,
        city: updatedBusiness.city,
        state: updatedBusiness.state,
        category: updatedBusiness.primary_category,
        hasNewImage: !!imageFile
      },
      result: 'success',
      riskLevel: 'medium'
    })

    return NextResponse.json({
      success: true,
      business: { ...updatedBusiness, id: businessId },
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

    // Load current data
    const dataFile = path.join(process.cwd(), 'data', 'businesses-from-excel-corrected-ids.json')
    const data = JSON.parse(await fs.readFile(dataFile, 'utf-8'))

    if (!data.businesses[businessId]) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    const businessToDelete = data.businesses[businessId]

    // Create backup
    const backupFile = path.join(process.cwd(), 'data', `businesses-backup-${new Date().toISOString().replace(/:/g, '-')}.json`)
    await fs.writeFile(backupFile, JSON.stringify(data, null, 2), 'utf-8')

    // Delete associated image
    await deleteBusinessImage(businessId)

    // Remove business from data
    delete data.businesses[businessId]
    data.metadata.total_businesses = Object.keys(data.businesses).length
    data.metadata.updated_at = new Date().toISOString()

    // Save updated data
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf-8')

    // Log the action
    auditLogger.log({
      action: 'business_deleted',
      resource: 'business_data',
      ...userInfo,
      details: {
        businessId: businessId,
        businessName: businessToDelete.name,
        city: businessToDelete.city,
        state: businessToDelete.state,
        category: businessToDelete.primary_category
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
