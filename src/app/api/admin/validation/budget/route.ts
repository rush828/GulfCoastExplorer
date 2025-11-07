import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { monthlyBudget } = await request.json();
    
    if (typeof monthlyBudget !== 'number' || monthlyBudget < 0) {
      return NextResponse.json({
        success: false,
        error: 'Valid monthly budget is required'
      }, { status: 400 });
    }

    // In a real system, this would save to a database or config file
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: 'Budget updated successfully',
      monthlyBudget
    });

  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update budget'
    }, { status: 500 });
  }
}
