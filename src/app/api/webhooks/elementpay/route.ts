import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/crypto'
import { WebhookPayload } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-webhook-signature')
    if (!signature) {
      return NextResponse.json(
        { error: 'missing_signature', message: 'X-Webhook-Signature header required' },
        { status: 401 }
      )
    }

    const body = await request.text()
    const secret = process.env.WEBHOOK_SECRET
    
    if (!secret) {
      console.error('WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'server_error', message: 'Webhook not configured' },
        { status: 500 }
      )
    }

    const verification = verifyWebhookSignature(signature, body, secret)
    
    if (!verification.valid) {
      const status = verification.expired ? 401 : 403
      const message = verification.expired ? 'Signature expired' : 'Invalid signature'
      
      return NextResponse.json(
        { error: 'verification_failed', message },
        { status }
      )
    }

    // Parse and process webhook
    const payload: WebhookPayload = JSON.parse(body)
    
 
    //  return success
    console.log('Webhook processed:', payload)
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'processing_error', message: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}