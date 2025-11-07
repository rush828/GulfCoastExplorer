import { randomBytes, createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

/**
 * CSRF Token Management
 * Prevents Cross-Site Request Forgery attacks
 */

// In-memory token storage (use Redis in production)
const tokenStore = new Map<string, { token: string, expires: number }>()

/**
 * Generate a CSRF token for a session
 */
export function generateCSRFToken(sessionId: string): string {
  const token = randomBytes(32).toString('hex')
  const expires = Date.now() + (60 * 60 * 1000) // 1 hour
  
  tokenStore.set(sessionId, { token, expires })
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Generate CSRF - Session ID:', sessionId)
    console.log('Generate CSRF - Generated token:', token)
    console.log('Generate CSRF - Stored in tokenStore:', tokenStore.has(sessionId))
    console.log('Generate CSRF - Token store size:', tokenStore.size)
  }
  
  // Clean up expired tokens
  cleanupExpiredTokens()
  
  return token
}

/**
 * Validate a CSRF token
 */
export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = tokenStore.get(sessionId)
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Validate CSRF - Session ID:', sessionId)
    console.log('Validate CSRF - Provided token:', token)
    console.log('Validate CSRF - Stored token:', stored?.token)
    console.log('Validate CSRF - Token match:', stored?.token === token)
    console.log('Validate CSRF - Token expired:', stored ? Date.now() > stored.expires : 'N/A')
  }
  
  if (!stored) {
    return false
  }
  
  if (Date.now() > stored.expires) {
    tokenStore.delete(sessionId)
    return false
  }
  
  return stored.token === token
}

/**
 * Get CSRF token for session (generate if doesn't exist)
 */
export function getCSRFToken(sessionId: string): string {
  const stored = tokenStore.get(sessionId)
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Get CSRF - Session ID:', sessionId)
    console.log('Get CSRF - Stored token exists:', !!stored)
    console.log('Get CSRF - Will generate new:', !stored || Date.now() >= stored.expires)
  }
  
  if (stored && Date.now() < stored.expires) {
    return stored.token
  }
  
  return generateCSRFToken(sessionId)
}

/**
 * Generate session ID from request
 */
export function getSessionId(request: NextRequest): string {
  // Use IP + User-Agent as session identifier
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 
            request.headers.get('x-real-ip') || 
            '127.0.0.1' // Default for local development
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  const sessionString = `${ip}:${userAgent}`
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Session ID Debug - IP:', ip)
    console.log('Session ID Debug - User-Agent:', userAgent)
    console.log('Session ID Debug - Session String:', sessionString)
  }
  
  return createHash('sha256')
    .update(sessionString)
    .digest('hex')
    .substring(0, 32)
}

/**
 * Clean up expired tokens
 */
function cleanupExpiredTokens() {
  const now = Date.now()
  for (const [sessionId, data] of tokenStore.entries()) {
    if (now > data.expires) {
      tokenStore.delete(sessionId)
    }
  }
}

/**
 * CSRF Protection Middleware for Next.js App Router
 */
export function withCSRFProtection(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async function(req: NextRequest): Promise<NextResponse> {
    // Only protect POST, PUT, DELETE requests
    if (!['POST', 'PUT', 'DELETE'].includes(req.method)) {
      return handler(req)
    }
    
    const sessionId = getSessionId(req)
    const csrfToken = req.headers.get('x-csrf-token')
    
    // For POST requests, also check body
    let bodyToken: string | null = null
    if (req.method === 'POST') {
      try {
        const body = await req.clone().json()
        bodyToken = body?.csrfToken
      } catch (e) {
        // Body might not be JSON, that's ok
      }
    }
    
    const token = csrfToken || bodyToken
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('CSRF Debug - Session ID:', sessionId)
      console.log('CSRF Debug - Token from header:', csrfToken)
      console.log('CSRF Debug - Token from body:', bodyToken)
      console.log('CSRF Debug - Final token:', token)
      console.log('CSRF Debug - Validation result:', token ? validateCSRFToken(sessionId, token) : 'No token')
    }
    
    if (!token || !validateCSRFToken(sessionId, token)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid CSRF token',
        code: 'CSRF_TOKEN_INVALID'
      }, { status: 403 })
    }
    
    return handler(req)
  }
}
