import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { withCSRFProtection } from '@/lib/csrf'
import { auditLogger, getUserInfo } from '@/lib/audit-log'

async function authHandler(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // Use hashed password in production - no fallbacks for security
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
    const ADMIN_SECRET = process.env.ADMIN_SECRET
    
    if (!ADMIN_PASSWORD || !ADMIN_SECRET) {
      throw new Error('ADMIN_PASSWORD and ADMIN_SECRET environment variables must be set')
    }
    
    const userInfo = getUserInfo(request)
    
    // Security: No password logging in production
    if (process.env.NODE_ENV === 'development') {
      console.log('DEBUG - Login attempt for user:', userInfo.userIP)
      console.log('DEBUG - Received password length:', password?.length)
      console.log('DEBUG - Expected password:', ADMIN_PASSWORD)
      console.log('DEBUG - Password match:', password === ADMIN_PASSWORD)
      console.log('DEBUG - NODE_ENV:', process.env.NODE_ENV)
    }
    
    // For development, use plain text comparison
    // In production, hash the password: bcrypt.hashSync('gulfcoast2025!', 10)
    const isPasswordValid = process.env.NODE_ENV === 'production' 
      ? await bcrypt.compare(password, ADMIN_PASSWORD)
      : password === ADMIN_PASSWORD

    if (isPasswordValid) {
      // Log successful login
      auditLogger.log({
        action: 'admin_login_success',
        resource: 'admin_auth',
        ...userInfo,
        result: 'success',
        riskLevel: 'medium'
      })

      return NextResponse.json({
        success: true,
        secret: ADMIN_SECRET
      })
    } else {
      // Log failed login attempt
      auditLogger.log({
        action: 'admin_login_failed',
        resource: 'admin_auth',
        ...userInfo,
        result: 'failure',
        riskLevel: 'high'
      })
      
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

// Temporarily disable CSRF protection for debugging
// TODO: Re-enable after fixing CSRF token storage issue
export const POST = authHandler
// export const POST = withCSRFProtection(authHandler)
