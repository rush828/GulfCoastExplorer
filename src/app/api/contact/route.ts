import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { addSubscriber } from '../../../lib/newsletter'

// Initialize Resend only when needed to avoid build-time errors
let resend: Resend | null = null

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Handle newsletter signup if requested
    if (formData.newsletter) {
      try {
        await addSubscriber({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName
        })
        console.log(`Newsletter signup recorded for: ${formData.email}`)
      } catch (newsletterError) {
        // Newsletter signups are logged but not persisted in production
        // This is expected behavior until database is set up
        console.log('Newsletter signup attempted:', formData.email)
      }
    }

    // Initialize Resend if needed
    if (!resend) {
      const apiKey = process.env.RESEND_API_KEY
      if (!apiKey) {
        throw new Error('RESEND_API_KEY is not configured')
      }
      resend = new Resend(apiKey)
    }

    // Send email using Resend
    // Use test domain until gulfcoastexplorer.com is verified
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Gulf Coast Explorer <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL || 'rush828@gmail.com'],
      subject: `Contact Form: ${formData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
            New Contact Form Submission - Gulf Coast Explorer
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${formData.email}</p>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${formData.subject}</p>
            <p style="margin: 5px 0;"><strong>Newsletter Signup:</strong> ${formData.newsletter ? 'Yes' : 'No'}</p>
            <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <h3 style="color: #374151; margin-top: 30px;">Message:</h3>
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <p style="white-space: pre-wrap; line-height: 1.6;">${formData.message}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #f0f9ff; border-left: 4px solid #0ea5e9; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #0369a1;">
              <strong>Reply to:</strong> ${formData.email}
            </p>
          </div>
        </div>
      `,
      replyTo: formData.email, // This allows you to reply directly to the sender
    })

    if (error) {
      console.error('Resend error:', error)
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
      return NextResponse.json(
        { 
          error: 'Failed to send email',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        },
        { status: 500 }
      )
    }

    console.log('Email sent successfully:', data)

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error'
    return NextResponse.json(
      { error: errorDetails, details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined },
      { status: 500 }
    )
  }
}
