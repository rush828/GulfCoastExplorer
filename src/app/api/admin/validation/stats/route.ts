import { NextRequest, NextResponse } from 'next/server';
import { businessDB } from '../../../../../lib/database-fallback';

export async function GET() {
  try {
    const stats = await businessDB.getValidationStats();
    
    return NextResponse.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('Error getting validation stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get validation statistics'
    }, { status: 500 });
  }
}
