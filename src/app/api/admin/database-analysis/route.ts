import { NextRequest, NextResponse } from 'next/server'
import { dbAnalyzer, getQuickStats } from '@/lib/database-performance'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'quick'

    if (type === 'quick') {
      // Quick stats - fast and safe
      const stats = await getQuickStats()
      return NextResponse.json({
        success: true,
        type: 'quick',
        stats
      })
    }

    if (type === 'full') {
      // Full analysis - more detailed but still read-only
      const analysis = await dbAnalyzer.analyzeDatabase()
      return NextResponse.json({
        success: true,
        type: 'full',
        analysis
      })
    }

    if (type === 'benchmark') {
      // Performance benchmarking
      const benchmarks = await dbAnalyzer.benchmarkQueries()
      return NextResponse.json({
        success: true,
        type: 'benchmark',
        benchmarks
      })
    }

    if (type === 'health') {
      // Health check
      const health = dbAnalyzer.getHealthMetrics()
      return NextResponse.json({
        success: true,
        type: 'health',
        health
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid analysis type' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Database analysis error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Analysis failed',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    )
  }
}
