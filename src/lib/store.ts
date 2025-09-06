import { Order, OrderStatus } from '@/types'

// In-memory store for orders
export class OrderStore {
  private orders = new Map<string, Order>()

  create(order: Order): void {
    this.orders.set(order.order_id, order)
  }

  get(orderId: string): Order | undefined {
    return this.orders.get(orderId)
  }

  updateStatus(orderId: string, status: OrderStatus): Order | undefined {
    const order = this.orders.get(orderId)
    if (!order) return undefined

    const updatedOrder = { ...order, status }
    this.orders.set(orderId, updatedOrder)
    return updatedOrder
  }

  getStatusByTime(orderId: string): OrderStatus {
    const order = this.orders.get(orderId)
    if (!order) throw new Error('Order not found')

    const now = Date.now()
    const createdAt = new Date(order.created_at).getTime()
    const elapsedSeconds = Math.floor((now - createdAt) / 1000)

    if (elapsedSeconds <= 7) return 'created'
    if (elapsedSeconds <= 17) return 'processing'
    
    // 80% settled, 20% failed
    return Math.random() < 0.8 ? 'settled' : 'failed'
  }
}

export const orderStore = new OrderStore()