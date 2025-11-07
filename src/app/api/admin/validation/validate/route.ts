import { NextRequest, NextResponse } from 'next/server';
import { businessDB } from '../../../../../lib/database-fallback';

export async function POST(request: NextRequest) {
  try {
    const { businessIds, budget, apiKey } = await request.json();
    
    if (!businessIds || !Array.isArray(businessIds)) {
      return NextResponse.json({
        success: false,
        error: 'Business IDs array is required'
      }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Google API key is required for real validation'
      }, { status: 400 });
    }

    let updatedCount = 0;
    let totalCost = 0;
    let totalApiCalls = 0;

    // Process each business for validation using Google Places API
    for (const businessId of businessIds) {
      try {
        const business = await businessDB.getBusinessById(businessId);
        if (!business) continue;

        // Use Google Places API to get real data
        const placeData = await getPlaceDataFromGoogle(business, apiKey);
        
        if (placeData) {
          let wasUpdated = false;
          const fieldsUpdated: string[] = [];
          let apiCalls = 0;
          let cost = 0;

          // Update business with real Google data
          if (placeData.phone && !business.phone) {
            business.phone = placeData.phone;
            business.phone_international = placeData.phone;
            wasUpdated = true;
            fieldsUpdated.push('phone');
            cost += 0.017; // $17 per 1000 calls
            apiCalls += 1;
          }
          
          if (placeData.website && !business.website) {
            business.website = placeData.website;
            business.website_url = placeData.website;
            wasUpdated = true;
            fieldsUpdated.push('website');
            cost += 0.017;
            apiCalls += 1;
          }
          
          if (placeData.hours && !business.hours) {
            business.hours = placeData.hours;
            business.hours_formatted = placeData.hours;
            wasUpdated = true;
            fieldsUpdated.push('hours');
            cost += 0.017;
            apiCalls += 1;
          }
          
          if (placeData.rating && !business.rating) {
            business.rating = placeData.rating;
            wasUpdated = true;
            fieldsUpdated.push('rating');
            cost += 0.017;
            apiCalls += 1;
          }
          
          if (placeData.description && (!business.description || business.description.length < 10)) {
            business.description = placeData.description;
            wasUpdated = true;
            fieldsUpdated.push('description');
            cost += 0.017;
            apiCalls += 1;
          }
          
          if (placeData.photos && (!business.photos || business.photos.length === 0)) {
            business.photos = placeData.photos;
            business.photos_array = placeData.photos;
            wasUpdated = true;
            fieldsUpdated.push('photos');
            cost += 0.017;
            apiCalls += 1;
          }

          if (wasUpdated) {
            // Update last validated timestamp
            business.last_validated = new Date().toISOString();
            business.last_google_update = new Date().toISOString();

            // Update business in database
            await businessDB.updateBusiness(businessId, business);

            // Add validation record
            await businessDB.addValidationRecord({
              business_id: businessId,
              validation_date: new Date().toISOString(),
              fields_updated: fieldsUpdated,
              cost,
              api_calls: apiCalls,
              success: true
            });

            updatedCount++;
            totalCost += cost;
            totalApiCalls += apiCalls;
          }
        }
      } catch (apiError) {
        console.error(`Error updating business ${businessId}:`, apiError);
        
        // Record failed validation
        await businessDB.addValidationRecord({
          business_id: businessId,
          validation_date: new Date().toISOString(),
          fields_updated: [],
          cost: 0,
          api_calls: 0,
          success: false,
          error_message: apiError instanceof Error ? apiError.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Validation completed successfully using Google Places API`,
      updatedCount,
      totalCost: parseFloat(totalCost.toFixed(3)),
      totalApiCalls,
      budget: budget || 10
    });

  } catch (error) {
    console.error('Error during validation:', error);
    return NextResponse.json({
      success: false,
      error: 'Validation failed'
    }, { status: 500 });
  }
}

// Function to get real data from Google Places API
async function getPlaceDataFromGoogle(business: any, apiKey: string) {
  try {
    // First, search for the business by name and location
    const searchQuery = `${business.name} ${business.city} ${business.state}`;
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (searchData.status === 'OK' && searchData.results.length > 0) {
      const place = searchData.results[0];
      
      // Get detailed information for the place
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=formatted_phone_number,website,opening_hours,rating,reviews,photos&key=${apiKey}`;
      
      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();
      
      if (detailsData.status === 'OK') {
        const details = detailsData.result;
        
        return {
          phone: details.formatted_phone_number,
          website: details.website,
          hours: formatOpeningHours(details.opening_hours),
          rating: details.rating,
          description: business.description || `${business.name} in ${business.city}, ${business.state}`,
          photos: details.photos ? details.photos.map((p: any) => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photo_reference}&key=${apiKey}`) : []
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching from Google Places API:', error);
    return null;
  }
}

// Helper function to format opening hours
function formatOpeningHours(openingHours: any) {
  if (!openingHours || !openingHours.weekday_text) {
    return "Hours not available";
  }
  
  return openingHours.weekday_text.join(', ');
}
