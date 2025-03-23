# 🌟 Moderia AI - Digital Deal Mediator

Moderia is an AI agent that mediates digital deals between service providers and clients, powered by Nillion DB's secure data storage.

> "Modern mediator for digital deals"

## 🌐 Core Concept

Moderia creates a secure marketplace where:

- Service providers list their availabilities and services
- Clients browse and book services
- The AI agent mediates the entire process
- Payments are held in escrow until successful completion
- The agent joins calls to take notes and mediate disputes

## 🔐 Secure Data Storage with Nillion DB

The platform uses Nillion DB for secure, encrypted data storage:

- Service listings are securely stored
- Bookings and transaction history are tracked
- Sensitive data is encrypted
- Meeting links and payment information are protected
- Review data and dispute information is securely managed

## 📊 Database Schema

### Service Collection
- Provider information
- Service details
- Availability
- Pricing information

### Booking Collection
- Service and client references
- Booking details
- Payment information
- Status tracking

### Review Collection
- Service ratings
- Client feedback
- Provider responses
- Dispute information

## 🤖 Mediation Features

### Service Management
- List and discover available services
- Real-time availability tracking
- Automatic scheduling

### Payment Handling
- Secure payment escrow
- Release upon completion
- Dispute resolution with partial refunds

### Meeting Participation
- AI joins service calls
- Takes objective notes
- Records key points for potential disputes
- Ensures quality standards

### Dispute Resolution
- Review meeting notes
- Compare against service claims
- Issue fair judgments
- Handle compensation when necessary

## 🚀 Operating Modes

The agent supports four operating modes:

1. **Chat Mode**: Interactive command-line interface for direct user interaction
2. **Autonomous Mode**: Bot operates independently, checking for disputes or upcoming bookings
3. **Telegram Mode**: Interface through Telegram messenger
4. **Demo Mode**: Run a guided demonstration of Moderia's capabilities

### 🎮 Demo Mode
The demo mode walks you through a complete service lifecycle:
- Creating a new service
- Browsing available services
- Booking a service
- Generating meeting links
- Completing bookings with reviews
- Handling disputes

You can access demo mode in two ways:
- Terminal: Select "demo" or "4" when choosing a mode
- Telegram: Use the `/demo` command

## 🛠️ Environment Setup

Required environment variables:
```
OPENAI_API_KEY=your_openai_api_key_here
WALLET_PRIVATE_KEY=your_wallet_private_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Nillion DB Configuration
SV_ORG_DID=your_organization_did_here
SV_PRIVATE_KEY=your_secret_vault_private_key_here
SV_PUBLIC_KEY=your_secret_vault_public_key_here

SV_NODE1_URL=your_node1_url_here
SV_NODE1_DID=your_node1_did_here
SV_NODE2_URL=your_node2_url_here
SV_NODE2_DID=your_node2_did_here
SV_NODE3_URL=your_node3_url_here
SV_NODE3_DID=your_node3_did_here

SCHEMA_ID_SERVICE=your_schema_id_here
SCHEMA_ID_BOOKING=your_schema_id_here
SCHEMA_ID_REVIEW=your_schema_id_here
```

## 🚀 Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your credentials
3. Install dependencies with `npm install`
4. Build the project with `npm run build`
5. Start the agent with `npm start`

## 🔄 Workflow Example

1. **Service Listing**: 
   - Provider creates service (e.g., French lesson on Monday at 3PM)
   - Details stored in Nillion DB

2. **Discovery & Booking**:
   - Client searches for available services
   - Books and pays for chosen service
   - Payment held in escrow
   - Meeting link generated

3. **Service Delivery**:
   - Moderia sends reminders to both parties
   - Agent joins the call to take notes
   - Service is delivered

4. **Completion & Payment**:
   - Client confirms completion
   - Provider receives payment
   - Optional reviews submitted

5. **Dispute Resolution** (if needed):
   - Agent reviews meeting notes
   - Makes fair judgment based on evidence
   - Issues appropriate compensation

## 📝 Development

To extend Moderia's capabilities:
1. Update the relevant action provider in `src/action-providers/nillion-db/`
2. Add new schemas if needed
3. Update environment variables accordingly
4. Test thoroughly before deployment

## 📋 License

MIT

## 📝 Available Commands

### Terminal Mode
- `exit`: Return to mode selection
- `help`: Display help information
- Natural language commands for all actions

### Telegram Commands
**Basic Commands:**
- `/start`: Initialize the bot
- `/menu`: Show all available commands
- `/help`: Get detailed help
- `/demo`: Run demo sequence
- `/exit`: Return to terminal
- `/kill`: Shut down application

**Service Provider Actions:**
- Create a new service
- Update service details
- List my services
- Set availability

**Client Actions:**
- Find services
- Book a service
- View my bookings
- Cancel booking

**Payment & Reviews:**
- Complete booking
- Leave review
- Check payment status

**Support & Disputes:**
- Report issue
- Open dispute
- Contact support

💡 All actions support natural language input - just describe what you want to do!
