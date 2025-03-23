# 🤖 ModerIA - AI Agent with Recall Network Integration

ModerIA is an intelligent agent that leverages the power of the Recall Network for decentralized data storage and management.

## 🔗 Supported Protocols

### 🔄 Recall Network
- Decentralized Data Storage Protocol
- Features:
  - 📦 Create and manage buckets for data organization
  - 💾 Store data with custom keys
  - 🔍 Retrieve data by key
  - 🔎 Query data using prefixes
  - 💰 Purchase and manage storage credits
  - 💼 Monitor account balances
  - 📋 Rich metadata support for improved data discovery

### 🛒 Service Marketplace
- Decentralized service marketplace built on Recall Network
- Features:
  - 📝 Create and manage service listings
  - 📅 Book services
  - 💸 Process payments
  - ⭐ Rate and review services
  - ✅ Track service completion
  - ⚖️ Dispute resolution
  - 📄 Human-readable data storage

### 🧪 Recall Test
- Testing functionality for Recall Network
- Features:
  - 🔄 Test basic Recall Network operations
  - 📊 Verify data storage and retrieval
  - 🧰 Validate bucket management
  - 🔬 Test metadata handling

## 🚀 Operating Modes

ModerIA supports three operating modes:

1. **💬 Chat Mode**: Interactive command-line interface for direct user interaction
2. **🤖 Autonomous Mode**: Bot operates independently, executing operations at set intervals
3. **📱 Telegram Mode**: Interface through Telegram messenger

## 🌐 Network Support

- 🧪 Recall Network Testnet
- ✅ Network validation before operations
- 🔄 Automatic network selection at startup
- 🔀 Support for multiple networks (Base Sepolia, Base Mainnet)

## 🛠️ Core Features

### 📊 Data Management
- 📁 Create and manage storage buckets
- 📥 Store data with custom keys
- 📤 Retrieve data by key
- 🔍 Query data using prefixes
- 📊 Monitor storage usage
- 🏷️ Rich metadata annotation for enhanced searchability
- 📝 Human-readable text format (JSON with indentation)

### 🏪 Service Marketplace
- 📋 List services with detailed descriptions
- 📝 Book services with custom requirements
- ✅ Complete services with ratings and reviews
- 💰 Process payments for completed services
- 📈 View service history and analytics
- 🤝 Resolve disputes between providers and clients

### 💳 Credit Management
- 💰 Purchase storage credits
- 💼 Monitor credit balance
- 📊 Track credit usage

### 🔐 Safety Features
- ✅ Network validation before operations
- 💰 Balance and credit checks
- ⚠️ Detailed error messages
- ⏳ Transaction confirmation waiting
- 🛡️ Custom error handling for common scenarios

## 🐛 Error Handling

ModerIA handles various error scenarios:
- ❌ Insufficient credits
- 🔗 Network mismatches
- ❌ Failed transactions
- ⚠️ Invalid input validation
- 📦 Storage quota exceeded

## 👨‍💻 Development

To add new features or modify existing ones:
1. Update the relevant action provider in `src/action-providers/`
2. Add new schemas if needed
3. Update the constants and error handlers
4. Test thoroughly on testnet first

## 🔧 Environment Setup

Required environment variables in `.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
NETWORK_ID=base-sepolia
NETWORK_ID_2=base-mainnet
RECALL_NETWORK="testnet"
# Original wallet for general use
WALLET_PRIVATE_KEY=your_wallet_private_key_here
# Service marketplace specific wallets
WALLET_PRIVATE_KEY_AGENT=your_agent_wallet_private_key_here
WALLET_PRIVATE_KEY_PROVIDER=your_provider_wallet_private_key_here
WALLET_PRIVATE_KEY_CLIENT=your_client_wallet_private_key_here
# Optional, for Telegram mode
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

## 📥 Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your details
4. Build the project: `npm run build`
5. Start the agent: `npm run start`

## 🧪 Testing

### 🛒 Service Marketplace Test
To test the service marketplace functionality:
```
node dist/action-providers/service-marketplace/test.js
```

This will simulate the complete lifecycle of a service:
1. Creating service listings
2. Booking services
3. Completing services
4. Processing payments
5. Viewing stored data in human-readable format

### 🔄 Recall Network Test
To test basic Recall Network functionality:
```
node dist/action-providers/recall-test/test.js
```

This will test core Recall Network operations:
1. Creating buckets
2. Storing data
3. Retrieving data
4. Testing metadata operations

## 📜 License

MIT
