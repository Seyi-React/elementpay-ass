# ElementPay Assessment Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# WalletConnect Project ID
# Get your project ID from https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id-here

# Optional: Custom RPC URLs for better performance
# NEXT_PUBLIC_MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key
# NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
```

## Getting WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up or log in
3. Create a new project
4. Copy the Project ID and add it to your `.env.local` file

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- Connect MetaMask wallet
- Connect via WalletConnect
- Create orders with amount, currency, and token selection
- Track order status in real-time
- Mock order processing with time-based status updates

## Troubleshooting

- Make sure you have MetaMask installed in your browser
- Ensure your `.env.local` file has the correct WalletConnect Project ID
- Check the browser console for any error messages
