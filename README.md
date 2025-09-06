ElementPay Frontend Assessment
A Next.js Web3 application that allows users to connect wallets, create orders, and track their status through polling and webhook notifications.

Features

Multi-wallet support: Connect via MetaMask or WalletConnect
Order creation: Form-based order creation with validation
Real-time tracking: Status updates via polling and webhooks
Race condition handling: First finalizer wins, duplicates ignored
Timeout handling: 60-second timeout with retry functionality


git clone https://github.com/Seyi-React/elementpay-ass
cd elementpay-frontend-assessment

npm install


# Required for webhook signature verification
WEBHOOK_SECRET=shh_super_secret


NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

npm run dev


API ENDPOINTS

POST /api/mock/orders/create
Content-Type: application/json

{
  "amount": 1500,
  "currency": "KES", 
  "token": "USDC",
  "note": "optional"
}


GET /api/mock/orders/:order_id


Webhooks Endpoints

POST /api/webhooks/elementpay
Content-Type: application/json
X-Webhook-Signature: t=<timestamp>,v1=<signature>

{
  "type": "order.settled",
  "data": {
    "order_id": "ord_0xabc123",
    "status": "settled"
  }
}

Webhook Testing

curl -X POST http://localhost:3000/api/webhooks/elementpay \
  -H 'Content-Type: application/json' \
  -H 'X-Webhook-Signature: t=1710000000,v1=3QXTcQv0m0h4QkQ0L0w9ZsH1YFhZgMGnF0d9Xz4P7nQ=' \
  -d '{"type":"order.settled","data":{"order_id":"ord_0xabc123","status":"settled"}}'

  Invalid Signature (should return 401/403)
  curl -X POST http://localhost:3000/api/webhooks/elementpay \
  -H 'Content-Type: application/json' \
  -H 'X-Webhook-Signature: t=1710000300,v1=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=' \
  -d '{"type":"order.failed","data":{"order_id":"ord_0xabc123","status":"failed"}}'


  