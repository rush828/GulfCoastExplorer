import { NextRequest, NextResponse } from 'next/server';
import { initializeGoogleAPI, getGoogleAPIManager } from '../../../../lib/google-apis';

export async function POST(request: NextRequest) {
  try {
    const { action, apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google API key is required' },
        { status: 400 }
      );
    }

    // Initialize the Google API manager
    const apiManager = initializeGoogleAPI(apiKey);

    switch (action) {
      case 'collect-all':
        // Start comprehensive data collection
        apiManager.collectAllData().catch(console.error);
        
        return NextResponse.json({
          success: true,
          message: 'Data collection started successfully',
          status: 'collecting'
        });

      case 'collect-location':
        const { locationName } = await request.json();
        if (!locationName) {
          return NextResponse.json(
            { error: 'Location name is required' },
            { status: 400 }
          );
        }

        // Collect data for specific location
        const location = (apiManager as any)['GULF_COAST_LOCATIONS'].find(
          (loc: any) => loc.name.toLowerCase() === locationName.toLowerCase()
        );

        if (!location) {
          return NextResponse.json(
            { error: `Location '${locationName}' not found` },
            { status: 404 }
          );
        }

        // Collect data for this specific location
        apiManager.collectAllData().catch(console.error);

        return NextResponse.json({
          success: true,
          message: `Data collection started for ${locationName}`,
          status: 'collecting'
        });

      case 'cache-stats':
        const stats = apiManager.getCacheStats();
        return NextResponse.json({
          success: true,
          cacheStats: stats
        });

      case 'clear-cache':
        apiManager.clearCache();
        return NextResponse.json({
          success: true,
          message: 'Cache cleared successfully'
        });

      case 'status':
        return NextResponse.json({
          success: true,
          status: 'ready',
          message: 'Google API Manager is ready'
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in Google data collection API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const apiManager = getGoogleAPIManager();
    const stats = apiManager.getCacheStats();
    
    return NextResponse.json({
      success: true,
      cacheStats: stats,
      status: 'ready'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 'not-initialized',
      message: 'Google API Manager not initialized'
    });
  }
}
