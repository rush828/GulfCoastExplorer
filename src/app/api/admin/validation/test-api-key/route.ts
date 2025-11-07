import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'API key is required'
      }, { status: 400 });
    }

    // Make a simple test call to Google Places API
    // Search for a restaurant in Pensacola to test the key
    const testQuery = 'restaurant in Pensacola, FL';
    const encodedQuery = encodeURIComponent(testQuery);
    
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' || data.status === 'ZERO_RESULTS') {
      return NextResponse.json({
        success: true,
        status: data.status,
        message: 'API key is working! Google Places API connection successful.',
        results: data.results?.length || 0
      });
    } else {
      return NextResponse.json({
        success: false,
        status: data.status,
        error_message: data.error_message || 'Unknown error',
        message: `API key test failed: ${data.status}`
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Error testing API key:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to test API key',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
