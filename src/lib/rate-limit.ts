/**
 * Simple in-memory rate limiting
 * In production, use Redis or similar distributed cache
 */

interface RateLimitRecord {
  count: number
  resetTime: number
}

class RateLimiter {
  private requests = new Map<string, RateLimitRecord>()
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Clean up expired records every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      for (const [key, record] of this.requests.entries()) {
        if (now > record.resetTime) {
          this.requests.delete(key)
        }
      }
    }, 5 * 60 * 1000)
  }

  /**
   * Check if request is allowed
   * @param identifier - IP address or user identifier
   * @param limit - Number of requests allowed
   * @param windowMs - Time window in milliseconds
   */
  isAllowed(identifier: string, limit: number, windowMs: number): boolean {
    const now = Date.now()
    const record = this.requests.get(identifier)

    if (!record) {
      // First request from this identifier
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      })
      return true
    }

    if (now > record.resetTime) {
      // Window has expired, reset counter
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      })
      return true
    }

    if (record.count >= limit) {
      // Rate limit exceeded
      return false
    }

    // Increment counter
    record.count++
    return true
  }

  /**
   * Get remaining requests for identifier
   */
  getRemaining(identifier: string, limit: number): number {
    const record = this.requests.get(identifier)
    if (!record || Date.now() > record.resetTime) {
      return limit
    }
    return Math.max(0, limit - record.count)
  }

  /**
   * Get reset time for identifier
   */
  getResetTime(identifier: string): number {
    const record = this.requests.get(identifier)
    return record?.resetTime || Date.now()
  }

  cleanup() {
    clearInterval(this.cleanupInterval)
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter()

export default rateLimiter

/**
 * Rate limiting middleware for API routes
 */
export function withRateLimit(
  handler: Function,
  options: {
    requests: number
    windowMs: number
    message?: string
  } = {
    requests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests, please try again later'
  }
) {
  return async function(req: any, res: any) {
    // Get client IP
    const ip = req.headers['x-forwarded-for'] || 
              req.headers['x-real-ip'] || 
              req.connection?.remoteAddress || 
              req.socket?.remoteAddress ||
              'unknown'

    const identifier = Array.isArray(ip) ? ip[0] : ip

    if (!rateLimiter.isAllowed(identifier, options.requests, options.windowMs)) {
      const remaining = rateLimiter.getRemaining(identifier, options.requests)
      const resetTime = rateLimiter.getResetTime(identifier)

      return res.status(429).json({
        success: false,
        error: options.message,
        rateLimitExceeded: true,
        remaining,
        resetTime: new Date(resetTime).toISOString()
      })
    }

    return handler(req, res)
  }
}
