import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// GET - Fetch all businesses
export async function GET() {
  try {
    const dataFile = path.join(process.cwd(), 'data', 'businesses-from-excel-corrected-ids.json')
    const content = await fs.readFile(dataFile, 'utf-8')
    const data = JSON.parse(content)
    
    let businesses = []
    
    // Handle the new data structure from Excel conversion
    if (data.businesses) {
      if (Array.isArray(data.businesses)) {
        businesses = data.businesses
      } else if (typeof data.businesses === 'object') {
        // For object format where keys are business IDs
        businesses = Object.entries(data.businesses).map(([id, business]) => ({
          ...(business as any),
          id: id
        }))
      }
    } else if (Array.isArray(data)) {
      businesses = data
    } else {
      // Handle flat object structure where keys are business IDs
      businesses = Object.entries(data).map(([id, business]) => ({
        ...(business as any),
        id: id
      }))
    }

    return NextResponse.json({ 
      success: true, 
      businesses,
      total: businesses.length 
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

    const dataFile = path.join(process.cwd(), 'data', 'businesses-from-excel-corrected-ids.json')
    const content = await fs.readFile(dataFile, 'utf-8')
    const data = JSON.parse(content)
    
    let businesses = []
    let isObjectFormat = false
    
    // Handle the new data structure from Excel conversion
    if (data.businesses) {
      if (Array.isArray(data.businesses)) {
        businesses = data.businesses
      } else if (typeof data.businesses === 'object') {
        // For object format where keys are business IDs
        businesses = Object.entries(data.businesses).map(([id, business]) => ({
          ...(business as any),
          id: id
        }))
        isObjectFormat = true
      }
    } else if (Array.isArray(data)) {
      businesses = data
    } else {
      // Handle flat object structure where keys are business IDs
      businesses = Object.entries(data).map(([id, business]) => ({
        ...(business as any),
        id: id
      }))
      isObjectFormat = true
    }

    // Find and update the business
    const businessIndex = businesses.findIndex((b: any) => b.id === business.id)
    if (businessIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    // Update the business
    businesses[businessIndex] = {
      ...businesses[businessIndex],
      primary_category: business.primary_category,
      categories_array: business.categories_array,
      updated_at: new Date().toISOString()
    }

    // Create backup before saving
    const backupFile = path.join(process.cwd(), 'data', `businesses-backup-${new Date().toISOString().replace(/:/g, '-')}.json`)
    await fs.writeFile(backupFile, JSON.stringify(data, null, 2), 'utf-8')

    // Update the data structure - preserve original format
    if (isObjectFormat) {
      // Convert back to object format with business IDs as keys
      const businessObject: any = {}
      businesses.forEach((business: any) => {
        if (business.id) {
          businessObject[business.id] = { ...business }
          delete businessObject[business.id].id // Remove redundant id field
        }
      })
      
      if (data.businesses) {
        data.businesses = businessObject
      } else {
        // Flat object structure
        Object.keys(data).forEach(key => delete data[key])
        Object.assign(data, businessObject)
      }
    } else if (Array.isArray(data)) {
      // Data is already an array
      data.splice(0, data.length, ...businesses)
    } else if (data.businesses) {
      if (Array.isArray(data.businesses)) {
        data.businesses = businesses
      } else {
        // Convert object to array format
        data.businesses = businesses
      }
    } else {
      // No businesses property, create it
      data.businesses = businesses
    }

    // Save the updated data
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf-8')

    return NextResponse.json({ 
      success: true, 
      message: 'Business updated successfully',
      business: businesses[businessIndex]
    })
  } catch (error) {
    console.error('Error updating business:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update business' },
      { status: 500 }
    )
  }
}
