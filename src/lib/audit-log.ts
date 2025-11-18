/**
 * Audit Logging System
 * Tracks admin actions for security monitoring
 */

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

export interface AuditLogEntry {
  id: string
  timestamp: string
  action: string
  resource: string
  userId: string
  userIP: string
  userAgent: string
  details?: any
  result: 'success' | 'failure' | 'blocked'
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
}

class AuditLogger {
  private logFile: string

  constructor() {
    this.logFile = join(process.cwd(), 'logs', 'audit.json')
    this.ensureLogFile()
  }

  /**
   * Log an admin action
   */
  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const logEntry: AuditLogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      ...entry
    }

    try {
      // In production (Vercel), only log to console - filesystem is read-only
      if (process.env.NODE_ENV === 'production') {
        console.log(`[AUDIT] ${entry.action} - ${entry.result} - ${entry.riskLevel}`, JSON.stringify(logEntry))
      } else {
        // In development, write to file
        const logs = this.readLogs()
        logs.push(logEntry)

        // Keep only last 1000 entries
        if (logs.length > 1000) {
          logs.splice(0, logs.length - 1000)
        }

        writeFileSync(this.logFile, JSON.stringify(logs, null, 2))
        console.log(`[AUDIT] ${entry.action} - ${entry.result} - ${entry.riskLevel}`)
      }

      // Alert on high-risk actions
      if (entry.riskLevel === 'critical' || entry.riskLevel === 'high') {
        this.alertHighRiskAction(logEntry)
      }
    } catch (error) {
      console.error('Failed to write audit log:', error)
    }
  }

  /**
   * Get recent audit logs
   */
  getLogs(limit: number = 100): AuditLogEntry[] {
    try {
      const logs = this.readLogs()
      return logs.slice(-limit).reverse() // Most recent first
    } catch (error) {
      console.error('Failed to read audit logs:', error)
      return []
    }
  }

  /**
   * Search logs by criteria
   */
  searchLogs(criteria: {
    action?: string
    userId?: string
    riskLevel?: string
    startDate?: string
    endDate?: string
  }): AuditLogEntry[] {
    try {
      const logs = this.readLogs()
      
      return logs.filter(log => {
        if (criteria.action && !log.action.includes(criteria.action)) return false
        if (criteria.userId && log.userId !== criteria.userId) return false
        if (criteria.riskLevel && log.riskLevel !== criteria.riskLevel) return false
        if (criteria.startDate && log.timestamp < criteria.startDate) return false
        if (criteria.endDate && log.timestamp > criteria.endDate) return false
        return true
      })
    } catch (error) {
      console.error('Failed to search audit logs:', error)
      return []
    }
  }

  private readLogs(): AuditLogEntry[] {
    try {
      if (!existsSync(this.logFile)) {
        return []
      }
      const content = readFileSync(this.logFile, 'utf-8')
      return JSON.parse(content)
    } catch {
      return []
    }
  }

  private ensureLogFile(): void {
    try {
      const logDir = join(process.cwd(), 'logs')
      if (!existsSync(logDir)) {
        require('fs').mkdirSync(logDir, { recursive: true })
      }
      if (!existsSync(this.logFile)) {
        writeFileSync(this.logFile, '[]')
      }
    } catch (error) {
      console.error('Failed to ensure log file:', error)
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private alertHighRiskAction(entry: AuditLogEntry): void {
    // In production, send alerts via email, Slack, etc.
    console.warn(`🚨 HIGH RISK ACTION: ${entry.action} by ${entry.userId} from ${entry.userIP}`)
  }
}

// Global audit logger instance
export const auditLogger = new AuditLogger()

/**
 * Helper function to get user info from request
 */
export function getUserInfo(request: any): { userId: string, userIP: string, userAgent: string } {
  const ip = request.headers?.['x-forwarded-for'] || 
            request.headers?.['x-real-ip'] || 
            request.ip || 'unknown'
  
  return {
    userId: 'admin', // In production, get from session
    userIP: Array.isArray(ip) ? ip[0] : ip,
    userAgent: request.headers?.['user-agent'] || 'unknown'
  }
}

/**
 * Audit logging middleware
 */
export function withAuditLogging(
  action: string,
  resource: string,
  riskLevel: AuditLogEntry['riskLevel'] = 'medium'
) {
  return function(handler: Function) {
    return async function(req: any, res: any) {
      const userInfo = getUserInfo(req)
      let result: AuditLogEntry['result'] = 'success'
      let details: any = {}

      try {
        const response = await handler(req, res)
        
        // Check if response indicates failure
        if (response?.status >= 400) {
          result = 'failure'
        }

        return response
      } catch (error) {
        result = 'failure'
        details.error = error instanceof Error ? error.message : 'Unknown error'
        throw error
      } finally {
        // Log the action
        auditLogger.log({
          action,
          resource,
          ...userInfo,
          details,
          result,
          riskLevel
        })
      }
    }
  }
}
