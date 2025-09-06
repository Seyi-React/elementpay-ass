'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'
import { Wallet, Unplug } from 'lucide-react'

export function WalletConnect() {
  const { address, isConnected, chain } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Wallet Connected</h2>
          <Wallet className="w-6 h-6 text-green-600" />
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600">Address:</label>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
              {address}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Chain:</label>
            <p className="text-sm text-gray-800">
              {chain?.name || 'Unknown'} (ID: {chain?.id})
            </p>
          </div>
        </div>
        
        <button
          onClick={() => disconnect()}
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <Unplug className="w-4 h-4" />
          Disconnect Wallet
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Connect Wallet</h2>
        <Wallet className="w-6 h-6 text-gray-600" />
      </div>
      
      <p className="text-gray-600 mb-6">
        Connect your wallet to create orders and manage transactions.
      </p>
      
      <div className="space-y-3">
        <button
          onClick={() => connect({ connector: injected() })}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          <img src="/metamask-icon.svg" alt="MetaMask" className="w-5 h-5" onError={(e) => e.currentTarget.style.display = 'none'} />
          Connect MetaMask
        </button>
        
        <button
          onClick={() => connect({ 
            connector: walletConnect({ 
              projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id' 
            }) 
          })}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">W</span>
          Connect WalletConnect
        </button>
      </div>
    </div>
  )
}