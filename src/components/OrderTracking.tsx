'use client'

import { useState, useEffect, useCallback } from 'react'
import { Order, OrderStatus } from '@/types'
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface OrderTrackingProps {
  order: Order
  onComplete: () => void
}

export function OrderTracking({ order, onComplete }: OrderTrackingProps) {
  const [currentOrder, setCurrentOrder] = useState(order)
  const [isPolling, setIsPolling] = useState(true)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isFinalized, setIsFinalized] = useState(false)

  const finalizeOrder = useCallback((newStatus: OrderStatus, source: 'polling' | 'webhook') => {
    if (isFinalized) return ;
    
    console.log(`Order finalized via ${source}:`, newStatus)
    setIsFinalized(true)
    setIsPolling(false)
    setCurrentOrder(prev => ({ ...prev, status: newStatus }))
  }, [isFinalized])

  // Polling effect
  useEffect(() => {
    if (!isPolling || isFinalized) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/mock/orders/${order.order_id}`)
        if (response.ok) {
          const updatedOrder: Order = await response.json()
          setCurrentOrder(updatedOrder)
          
          if (updatedOrder.status === 'settled' || updatedOrder.status === 'failed') {
            finalizeOrder(updatedOrder.status, 'polling')
          }
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 3000) // Poll every 3 seconds

    return () => clearInterval(pollInterval)
  }, [isPolling, isFinalized, order.order_id, finalizeOrder])

  // Timeout effect
  useEffect(() => {
    const timeoutTimer = setTimeout(() => {
      if (!isFinalized) {
        setIsPolling(false)
        setCurrentOrder(prev => ({ ...prev, status: 'failed' }))
      }
    }, 60000) // 60 seconds timeout

    return () => clearTimeout(timeoutTimer)
  }, [isFinalized])

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Mock webhook listener effect
  useEffect(() => {
    // Simulate random webhook arrival for demonstration
    if (isFinalized) return

    const webhookDelay = Math.random() * 30000 + 10000 // 10-40 seconds
    const webhookTimer = setTimeout(() => {
      if (!isFinalized) {
        const webhookStatus = Math.random() < 0.8 ? 'settled' : 'failed'
        finalizeOrder(webhookStatus, 'webhook')
      }
    }, webhookDelay)

    return () => clearTimeout(webhookTimer)
  }, [isFinalized, finalizeOrder])

  const getStatusIcon = () => {
    switch (currentOrder.status) {
      case 'created':
        return <Clock className="w-8 h-8 text-blue-500 animate-pulse" />
      case 'processing':
        return <Clock className="w-8 h-8 text-yellow-500 animate-spin" />
      case 'settled':
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case 'failed':
        return <XCircle className="w-8 h-8 text-red-500" />
    }
  }

  const getStatusMessage = () => {
    switch (currentOrder.status) {
      case 'created':
        return 'Order created successfully'
      case 'processing':
        return 'Processing your order...'
      case 'settled':
        return 'Order completed successfully!'
      case 'failed':
        return timeElapsed >= 60 ? 'Order timed out - please try again' : 'Order failed'
    }
  }

  const getStatusColor = () => {
    switch (currentOrder.status) {
      case 'created':
        return 'border-blue-200 bg-blue-50'
      case 'processing':
        return 'border-yellow-200 bg-yellow-50'
      case 'settled':
        return 'border-green-200 bg-green-50'
      case 'failed':
        return 'border-red-200 bg-red-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Processing Modal */}
      {!isFinalized && (
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <div className="flex items-center justify-center mb-4">
            {getStatusIcon()}
          </div>
          
          <h3 className="text-lg font-semibold text-center mb-2">
            {getStatusMessage()}
          </h3>
          
          <div className="text-center text-gray-600 mb-4">
            <p>Order ID: {currentOrder.order_id}</p>
            <p>Time elapsed: {timeElapsed}s</p>
            {timeElapsed >= 60 && (
              <div className="flex items-center justify-center gap-2 text-orange-600 mt-2">
                <AlertCircle className="w-4 h-4" />
                <span>Timeout approaching...</span>
              </div>
            )}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((timeElapsed / 60) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Receipt Card */}
      <div className={`p-6 rounded-lg border-2 ${getStatusColor()}`}>
        <div className="flex items-center gap-3 mb-4">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-semibold">{getStatusMessage()}</h3>
            <p className="text-sm text-gray-600">
              {new Date(currentOrder.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Order ID</label>
              <p className="font-mono text-sm">{currentOrder.order_id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <p className="font-semibold capitalize">{currentOrder.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Amount</label>
              <p className="font-semibold">{currentOrder.amount} {currentOrder.currency}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Token</label>
              <p className="font-semibold">{currentOrder.token}</p>
            </div>
          </div>

          {currentOrder.note && (
            <div>
              <label className="text-sm font-medium text-gray-600">Note</label>
              <p className="text-sm">{currentOrder.note}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          {currentOrder.status === 'failed' && timeElapsed >= 60 && (
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Retry
            </button>
          )}
          
          <button
            onClick={onComplete}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Create New Order
          </button>
        </div>
      </div>
    </div>
  )
}