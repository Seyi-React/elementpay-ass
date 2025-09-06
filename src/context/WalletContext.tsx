'use client'

import { createContext, useContext, ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/lib/wagmi'

const queryClient = new QueryClient()

interface WalletContextType {
  isConnected: boolean
  address?: string
  chainId?: number
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  address: undefined,
  chainId: undefined
})

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletContext.Provider value={{ isConnected: false }}>
          {children}
        </WalletContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export const useWallet = () => useContext(WalletContext)