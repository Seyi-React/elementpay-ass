'use client'

import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { AlertCircle, RefreshCw } from 'lucide-react'

const supportedChains = [mainnet, sepolia]

export function ChainSwitcher() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()
  
  if (!isConnected) return null
  
  const currentChain = supportedChains.find(chain => chain.id === chainId)
  const isUnsupported = !currentChain

  if (!isUnsupported) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center gap-2 text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium">Connected to {currentChain.name}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
      <div className="flex items-center gap-2 text-red-800 mb-3">
        <AlertCircle className="w-5 h-5" />
        <span className="font-medium">Unsupported Network</span>
      </div>
      
      <p className="text-red-700 text-sm mb-4">
        Please switch to a supported network to continue.
      </p>
      
      <div className="space-y-2">
        {supportedChains.map((chain : any) => (
          <button
            key={chain.id}
            onClick={() => switchChain({ chainId: chain.id })}
            disabled={isPending}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Switching...
              </>
            ) : (
              `Switch to ${chain.name}`
            )}
          </button>
        ))}
      </div>
    </div>
  )
}