import { NextRequest, NextResponse } from 'next/server'
import { orderStore } from '@/lib/store'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params
    const order = orderStore.get(orderId)
    
    if (!order) {
      return NextResponse.json(
        { 
          error: 'order_not_found', 
          message: `No order with id ${orderId}` 
        },
        { status: 404 }
      )
    }
    
    // Get time-based status
    const currentStatus = orderStore.getStatusByTime(orderId)
    const updatedOrder = orderStore.updateStatus(orderId, currentStatus)
    
    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json(
      { error: 'internal_error', message: 'Failed to get order' },
      { status: 500 }
    )
  }
}