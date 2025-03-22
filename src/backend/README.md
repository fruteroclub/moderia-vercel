# ModerIA - AI Agent with Recall Network Integration

ModerIA is an intelligent agent that leverages the power of the Recall Network for decentralized data storage and management.

## Supported Protocols

### Recall Network
- Decentralized Data Storage Protocol
- Features:
  - Create and manage buckets for data organization
  - Store and retrieve data with key-value pairs
  - Query data using prefixes
  - Purchase and manage storage credits
  - Monitor account balances

## Operating Modes

ModerIA supports three operating modes:

1. **Chat Mode**: Interactive command-line interface for direct user interaction
2. **Autonomous Mode**: Bot operates independently, executing operations at set intervals
3. **Telegram Mode**: Interface through Telegram messenger

## Network Support

- Recall Network Testnet
- Network validation before operations
- Automatic network selection at startup

## Core Features

### Data Management
- Create and manage storage buckets
- Store data with custom keys
- Retrieve data by key
- Query data using prefixes
- Monitor storage usage

### Credit Management
- Purchase storage credits
- Monitor credit balance
- Track credit usage

### Safety Features
- Network validation before operations
- Balance and credit checks
- Detailed error messages
- Transaction confirmation waiting
- Custom error handling for common scenarios

## Error Handling

ModerIA handles various error scenarios:
- Insufficient credits
- Network mismatches
- Failed transactions
- Invalid input validation
- Storage quota exceeded

## Development

To add new features or modify existing ones:
1. Update the relevant action provider in `src/action-providers/`
2. Add new schemas if needed
3. Update the constants and error handlers
4. Test thoroughly on testnet first

## Environment Setup

Required environment variables in `.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
NETWORK_ID=recall-testnet
WALLET_PRIVATE_KEY=your_wallet_private_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here  # Optional, for Telegram mode
```

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your details
4. Build the project: `npm run build`
5. Start the agent: `npm run start`

## License

MIT
