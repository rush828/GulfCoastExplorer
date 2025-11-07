import { NextRequest, NextResponse } from 'next/server';
import { processPayPalWebhook, verifyWebhookSignature } from '@/lib/paypal-webhook';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('paypal-transmission-sig') || '';
    const webhookId = process.env.PAYPAL_WEBHOOK_ID || '';
    
    // Verify webhook signature in production
    if (process.env.NODE_ENV === 'production' && !verifyWebhookSignature(body, signature, webhookId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }
    
    // Parse webhook event
    const event = JSON.parse(body);
    
    // Process the webhook event
    const result = await processPayPalWebhook(event, request);
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      action: result.action,
      eventId: event.id,
      eventType: event.event_type
    });
    
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Webhook processing failed',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'PayPal webhook endpoint is active' 
  });
}
