'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { CreateOrderRequest, Order } from '@/types'
import { OrderTracking } from './OrderTracking'

export function OrderForm() {
  const { isConnected } = useAccount()
  const [formData, setFormData] = useState<CreateOrderRequest>({
    amount: 0,
    currency: 'KES',
    token: 'USDC',
    note: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }
    
    if (!formData.currency) {
      newErrors.currency = 'Currency is required'
    }
    
    if (!formData.token) {
      newErrors.token = 'Token is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/mock/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create order')
      }
      
      const order: Order = await response.json()
      setCurrentOrder(order)
      
      // Reset form
      setFormData({
        amount: 0,
        currency: 'KES',
        token: 'USDC',
        note: ''
      })
      setErrors({})
    } catch (error) {
      console.error('Order creation failed:', error)
      setErrors({ general: 'Failed to create order. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof CreateOrderRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (currentOrder) {
    return <OrderTracking order={currentOrder} onComplete={() => setCurrentOrder(null)} />
  }

  if (!isConnected) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-600 text-center">
          Please connect your wallet to create an order
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Create Order</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount *
          </label>
          <input
            type="number"
            value={formData.amount || ''}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter amount"
            min="0"
            step="0.01"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency *
          </label>
          <select
            value={formData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.currency ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="KES">KES</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          {errors.currency && (
            <p className="text-red-500 text-sm mt-1">{errors.currency}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Token *
          </label>
          <select
            value={formData.token}
            onChange={(e) => handleInputChange('token', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.token ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="USDC">USDC</option>
            <option value="USDT">USDT</option>
            <option value="ETH">ETH</option>
          </select>
          {errors.token && (
            <p className="text-red-500 text-sm mt-1">{errors.token}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note (optional)
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => handleInputChange('note', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a note..."
            rows={3}
          />
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {errors.general}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md transition-colors"
        >
          {isSubmitting ? 'Creating Order...' : 'Create Order'}
        </button>
      </form>
    </div>
  )
}