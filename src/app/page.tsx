import { WalletConnect } from '@/components/WalletConnect'
import { OrderForm } from '@/components/OrderForm'

export default function Home() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Wallet Section */}
      <div className="space-y-6">
        <WalletConnect />
      </div>
      
      {/* Order Section */}
      <div className="space-y-6">
        <OrderForm />
      </div>
    </div>
  )
}