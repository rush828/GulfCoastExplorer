import { NextRequest, NextResponse } from 'next/server';
import { businessDB, Business } from '../../../../../lib/database-fallback';

export async function GET() {
  try {
    const businesses = await businessDB.getAllBusinesses();

    // Transform business data into validation format
    const validationBusinesses = businesses.map((business: Business) => {
      // Calculate validation score based on data completeness
      let validationScore = 100;
      let fieldsToUpdate: string[] = [];

      // Check essential fields
      if (!business.phone || !business.phone_international) {
        validationScore -= 20;
        fieldsToUpdate.push('phone');
      }

      if (!business.website || !business.website_url) {
        validationScore -= 20;
        fieldsToUpdate.push('website');
      }

      if (!business.hours || !business.hours_formatted) {
        validationScore -= 15;
        fieldsToUpdate.push('hours');
      }

      if (!business.rating) {
        validationScore -= 15;
        fieldsToUpdate.push('rating');
      }

      if (!business.description || business.description.length < 10) {
        validationScore -= 10;
        fieldsToUpdate.push('description');
      }

      if (!business.photos || business.photos.length === 0) {
        validationScore -= 10;
        fieldsToUpdate.push('photos');
      }

      // Determine priority
      let priority: 'high' | 'medium' | 'low' = 'low';
      if (fieldsToUpdate.length >= 3) priority = 'high';
      else if (fieldsToUpdate.length >= 1) priority = 'medium';

      // Estimate cost (rough calculation)
      const estimatedCost = fieldsToUpdate.length * 0.017; // $17 per 1000 calls

      return {
        id: business.id,
        name: business.name || business.business_name || 'Unknown Business',
        city: business.city || 'Unknown City',
        state: business.state || 'Unknown State',
        validationScore: Math.max(0, validationScore),
        lastValidated: business.last_validated || new Date().toISOString(),
        needsUpdate: fieldsToUpdate.length > 0,
        fieldsToUpdate,
        estimatedCost,
        priority
      };
    });

    return NextResponse.json({
      success: true,
      businesses: validationBusinesses
    });

  } catch (error) {
    console.error('Error fetching businesses for validation:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch businesses for validation'
    }, { status: 500 });
  }
}
