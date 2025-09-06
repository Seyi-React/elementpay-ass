import { createHmac } from 'crypto'

export function verifyWebhookSignature(
  signature: string,
  body: string,
  secret: string
): { valid: boolean; expired?: boolean } {
  try {
    // signature header: t=<timestamp>,v1=<signature>
    const parts = signature.split(',')
    let timestamp: string | undefined
    let sig: string | undefined

    for (const part of parts) {
      const [key, value] = part.split('=')
      if (key === 't') timestamp = value
      if (key === 'v1') sig = value
    }

    if (!timestamp || !sig) {
      return { valid: false }
    }

    // Check freshness (within 5 minutes)
    const now = Math.floor(Date.now() / 1000)
    const ts = parseInt(timestamp, 10)
    if (Math.abs(now - ts) > 300) {
      return { valid: false, expired: true }
    }

    // Compute expected signature
    const payload = `${timestamp}.${body}`
    const expectedSig = createHmac('sha256', secret)
      .update(payload)
      .digest('base64')

    // Constant-time comparison
    const valid = constantTimeEqual(sig, expectedSig)
    
    return { valid }
  } catch (error) {
    console.error('Webhook signature verification error:', error)
    return { valid: false }
  }
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}