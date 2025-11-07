import { NextRequest, NextResponse } from 'next/server'
import { auditLogger } from '@/lib/audit-log'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const action = searchParams.get('action') || undefined
    const riskLevel = searchParams.get('riskLevel') || undefined
    
    let logs
    
    if (action || riskLevel) {
      logs = auditLogger.searchLogs({
        action,
        riskLevel,
      })
    } else {
      logs = auditLogger.getLogs(limit)
    }

    return NextResponse.json({
      success: true,
      logs,
      total: logs.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}
