import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
// Temporarily disable audit log to isolate the issue
// import { auditLog } from '../../../../lib/audit-log';

const dataFile = path.join(process.cwd(), 'data', 'businesses-from-excel-corrected-ids.json');

interface UpdatePriorityRequest {
  businessId: string;
  priority_tier: number;
  featured_until?: string; // ISO date string for premium tier expiration
}

export async function PUT(request: NextRequest) {
  try {
    console.log('=== BUSINESS PRIORITY UPDATE START ===');
    
    // Authentication check (middleware should handle this)
    const body: UpdatePriorityRequest = await request.json();
    const { businessId, priority_tier, featured_until } = body;
    
    console.log('Request body:', { businessId, priority_tier, featured_until });

    // Validate input
    if (!businessId || typeof priority_tier !== 'number') {
      console.log('Validation failed: Missing businessId or invalid priority_tier');
      return NextResponse.json({ 
        success: false, 
        error: 'Business ID and priority tier are required' 
      }, { status: 400 });
    }

    if (priority_tier < 1 || priority_tier > 3) {
      console.log('Validation failed: Invalid priority tier range');
      return NextResponse.json({ 
        success: false, 
        error: 'Priority tier must be between 1 and 3' 
      }, { status: 400 });
    }

    // Manual tier management - featured_until is for record keeping only
    console.log('Manual tier management - featured_until is informational only');

    // Read current data
    console.log('Reading data file:', dataFile);
    const data = JSON.parse(await fs.readFile(dataFile, 'utf8'));
    console.log('Data loaded successfully, checking for business...');
    
    if (!data.businesses || !data.businesses[businessId]) {
      console.log('Business not found:', businessId);
      console.log('Available business IDs (first 5):', Object.keys(data.businesses || {}).slice(0, 5));
      return NextResponse.json({ 
        success: false, 
        error: 'Business not found' 
      }, { status: 404 });
    }

    // Get current business data
    const business = data.businesses[businessId];
    const oldTier = business.priority_tier || 1;
    
    console.log('Business found:', business.name);
    console.log('Current tier:', oldTier, '-> New tier:', priority_tier);

    // Update priority tier
    business.priority_tier = priority_tier;
    business.tier_updated_at = new Date().toISOString();

    // Manual tier management - featured_until is informational only
    // Keep featured_until for record keeping, but don't use it for automatic changes
    if (priority_tier === 3 && featured_until) {
      business.featured_until = featured_until;
      console.log('Set featured_until for record keeping:', featured_until);
    } else if (priority_tier === 3 && !featured_until) {
      // If upgrading to premium without a date, set 1 year for reference
      business.featured_until = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      console.log('Set default 1-year featured_until for reference');
    } else if (priority_tier < 3) {
      // Remove featured_until when downgrading from premium
      delete business.featured_until;
      console.log('Removed featured_until (downgraded from premium)');
    }

    // Save updated data
    console.log('Saving updated data...');
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
    console.log('Data saved successfully');

    // Get client IP and User-Agent for audit log
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Log the priority change (temporarily disabled)
    console.log('Skipping audit log for debugging...');
    // Temporarily disabled to isolate the issue
    /*
    try {
      auditLog(
        'business_priority_updated',
        {
          businessId,
          businessName: business.name,
          oldTier,
          newTier: priority_tier,
          featuredUntil: featured_until || null,
          updatedBy: 'admin'
        },
        clientIP,
        userAgent
      );
      console.log('Audit log saved successfully');
    } catch (auditError) {
      console.error('Audit log failed (non-critical):', auditError);
    }
    */

    // Return success with updated business data
    console.log('=== BUSINESS PRIORITY UPDATE SUCCESS ===');
    return NextResponse.json({
      success: true,
      message: 'Business priority updated successfully',
      business: {
        id: businessId,
        name: business.name,
        priority_tier: business.priority_tier,
        featured_until: business.featured_until,
        tier_updated_at: business.tier_updated_at
      }
    });

  } catch (error) {
    console.error('=== BUSINESS PRIORITY UPDATE ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', (error as any).message);
    console.error('Error stack:', (error as any).stack);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && {
        debug: {
          message: (error as any).message,
          stack: (error as any).stack?.split('\n').slice(0, 5)
        }
      })
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    if (businessId) {
      // Get specific business priority info
      const data = JSON.parse(await fs.readFile(dataFile, 'utf8'));
      const business = data.businesses[businessId];

      if (!business) {
        return NextResponse.json({ 
          success: false, 
          error: 'Business not found' 
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        business: {
          id: businessId,
          name: business.name,
          priority_tier: business.priority_tier || 1,
          featured_until: business.featured_until,
          tier_updated_at: business.tier_updated_at
        }
      });
    }

    // Get all businesses with their priority tiers
    const data = JSON.parse(await fs.readFile(dataFile, 'utf8'));
    const businesses = Object.entries(data.businesses).map(([id, business]: [string, any]) => ({
      id,
      name: business.name,
      city: business.city,
      state: business.state,
      primary_category: business.primary_category,
      priority_tier: business.priority_tier || 1,
      featured_until: business.featured_until,
      tier_updated_at: business.tier_updated_at
    }));

    // Filter by tier if requested
    const tierFilter = searchParams.get('tier');
    const filteredBusinesses = tierFilter 
      ? businesses.filter(b => b.priority_tier === parseInt(tierFilter))
      : businesses;

    // Sort by tier (highest first), then by name
    filteredBusinesses.sort((a, b) => {
      if (a.priority_tier !== b.priority_tier) {
        return b.priority_tier - a.priority_tier;
      }
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({
      success: true,
      businesses: filteredBusinesses,
      counts: {
        total: businesses.length,
        free: businesses.filter(b => b.priority_tier === 1).length,
        basic: businesses.filter(b => b.priority_tier === 2).length,
        premium: businesses.filter(b => b.priority_tier === 3).length
      }
    });

  } catch (error) {
    console.error('Error fetching business priorities:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
