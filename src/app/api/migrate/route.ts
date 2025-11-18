import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Force this route to be dynamic (not pre-rendered at build time)
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    // Run Prisma DB push to create/update tables
    const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss')
    
    return NextResponse.json({
      success: true,
      message: 'Database migration completed',
      output: stdout,
      errors: stderr || null
    })
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      output: error.stdout,
      stderr: error.stderr
    }, { status: 500 })
  }
}

