import { NextRequest, NextResponse } from 'next/server'

// Simple admin authentication middleware
export function middleware(request: NextRequest) {
  // Allow search engine crawlers to access public pages without redirects
  const userAgent = request.headers.get('user-agent') || ''
  const isSearchEngineBot = /Googlebot|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Discordbot|PerplexityBot|GPTBot|ChatGPT-User|anthropic-ai|Claude-Web|ClaudeBot|Google-Extended|cohere-ai|Meta-ExternalAgent|FacebookBot|Grokbot|xAI-Grok|YouBot|CCBot|AI2Bot|Diffbot|Applebot-Extended|Amazonbot|Bytespider|brave-ai|Brave-Indexer/i.test(userAgent)
  
  // Check if the request is for admin routes (but not login page)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    // Check for admin session
    const adminSession = request.cookies.get('admin-session')
    const adminSecret = request.cookies.get('admin-secret')
    
    // Simple admin authentication - no fallbacks for security
    const ADMIN_SECRET = process.env.ADMIN_SECRET
    
    if (!ADMIN_SECRET) {
      throw new Error('ADMIN_SECRET environment variable must be set')
    }
    
    // Allow search engine bots to see 401 instead of redirect (prevents redirect loops)
    if (isSearchEngineBot) {
      if (!adminSession || !adminSecret || adminSecret.value !== ADMIN_SECRET) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    } else {
      if (!adminSession || !adminSecret || adminSecret.value !== ADMIN_SECRET) {
        // Redirect to admin login
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    }
  }

  // Check if request is for admin API routes (but not auth or csrf endpoints)
  if (request.nextUrl.pathname.startsWith('/api/admin') && 
      !request.nextUrl.pathname.startsWith('/api/admin/auth') &&
      !request.nextUrl.pathname.startsWith('/api/csrf')) {
    // Check for admin authentication (support both header and cookie-based auth)
    const adminAuth = request.headers.get('x-admin-auth')
    const adminSecret = request.cookies.get('admin-secret')
    const ADMIN_SECRET = process.env.ADMIN_SECRET
    
    if (!ADMIN_SECRET) {
      throw new Error('ADMIN_SECRET environment variable must be set')
    }
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Auth Check:', {
        path: request.nextUrl.pathname,
        hasHeaderAuth: !!adminAuth,
        hasCookieAuth: !!adminSecret,
        cookieValue: adminSecret?.value?.substring(0, 10) + '...',
        expectedSecret: ADMIN_SECRET?.substring(0, 10) + '...'
      })
    }
    
    // Allow either header auth OR cookie auth
    const isAuthenticated = (adminAuth && adminAuth === ADMIN_SECRET) || 
                           (adminSecret && adminSecret.value === ADMIN_SECRET)
    
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access', details: 'Please log in to the admin panel first' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/((?!login).)*',  // All admin routes except login
    '/api/admin/:path*'
  ]
}
