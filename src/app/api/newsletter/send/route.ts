import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getActiveSubscribers } from '../../../../lib/newsletter'
import { logNewsletterSend } from '../../../../lib/newsletter-history'

// Initialize Resend only when needed to avoid build-time errors
let resend: Resend | null = null

export async function POST(request: NextRequest) {
  try {
    const { subject, content, previewText } = await request.json()
    
    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: subject and content' },
        { status: 400 }
      )
    }

    const subscribers = await getActiveSubscribers()
    
    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers found' },
        { status: 400 }
      )
    }

    // Create newsletter HTML
    const newsletterHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0ea5e9, #1e40af); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Gulf Coast Explorer</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Gulf Coast Travel Newsletter</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          ${content}
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding: 20px; background: #f8fafc; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #6b7280;">
            You're receiving this because you subscribed to Gulf Coast Explorer newsletter.<br>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/newsletter/unsubscribe?token={{UNSUBSCRIBE_TOKEN}}" 
               style="color: #0ea5e9; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      </body>
      </html>
    `

    // Initialize Resend if needed
    if (!resend) {
      const apiKey = process.env.RESEND_API_KEY
      if (!apiKey) {
        throw new Error('RESEND_API_KEY is not configured')
      }
      resend = new Resend(apiKey)
    }

    // Send to each subscriber
    const results = []
    for (const subscriber of subscribers) {
      try {
        const personalizedHtml = newsletterHtml.replace('{{UNSUBSCRIBE_TOKEN}}', subscriber.unsubscribeToken)
        
        const { data, error } = await resend.emails.send({
          from: 'Gulf Coast Explorer <onboarding@resend.dev>',
          to: [subscriber.email],
          subject: subject,
          html: personalizedHtml,
        })

        if (error) {
          console.error(`Failed to send to ${subscriber.email}:`, error)
          results.push({ email: subscriber.email, success: false, error: error.message })
        } else {
          results.push({ email: subscriber.email, success: true })
        }
      } catch (error) {
        console.error(`Error sending to ${subscriber.email}:`, error)
        results.push({ email: subscriber.email, success: false, error: 'Unknown error' })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${successCount} subscribers${failureCount > 0 ? `, ${failureCount} failed` : ''}`,
      results: {
        total: subscribers.length,
        successful: successCount,
        failed: failureCount,
        details: results
      }
    })

  } catch (error) {
    console.error('Error sending newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    )
  }
}
