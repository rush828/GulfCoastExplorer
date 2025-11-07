import { NextRequest, NextResponse } from 'next/server'
import { getCSRFToken, getSessionId } from '@/lib/csrf'

/**
 * CSRF Token API - Provides tokens for forms
 */
export async function GET(request: NextRequest) {
  try {
    const sessionId = getSessionId(request)
    const csrfToken = getCSRFToken(sessionId)
    
    return NextResponse.json({
      success: true,
      csrfToken,
      sessionId
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}
