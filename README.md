# SoftCORE Games - AI-Powered Intimate Fantasy Experience

## 🏆 Hackathon Submission Details

This project was created for the Core DAO Hackathon 2024. It represents an innovative combination of AI technology and blockchain capabilities to create a unique intimate storytelling platform.

### Innovation Highlights

- First-of-its-kind integration of AI storytelling with Core DAO blockchain
- Novel NFT mechanics for intimate scene ownership and sharing
- Unique token economics model for content creator incentivization
- Privacy-focused architecture using Core DAO's capabilities

### Core Chain Integration

- Smart contracts deployed on Core Chain for NFT minting and trading
- Token contract leveraging Core DAO's ERC-20 compatibility
- Integration with Core DAO wallet for seamless transactions
- Utilization of Core Chain's high performance and low fees

### Video Demo

### Presentation

## 🌟 Overview

SoftCORE Games is an immersive platform that creates personalized intimate stories using AI technology. Our platform combines blockchain technology, AI-driven storytelling, and NFT mechanics to provide a unique and secure experience.

## 🎯 Key Features

- AI-powered interactive storytelling
- Personalized character creation and customization
- Scene creation and NFT minting on Core Chain
- Private scene sharing and social features
- Blockchain-based ownership and trading
- Token-based economy and rewards

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB database
- OpenAI API key (for AI scene generation and story generation)
- Core DAO wallet with CORE tokens
- MetaMask or compatible Web3 wallet

### Environment Setup

Create a `.env` file with:

```env
# Database
DATABASE_URL="your_mongodb_url"

# Authentication
NEXTAUTH_SECRET="your_jwt_secret"

# AI Services
OPENAI_API_KEY="your_openai_api_key"

# Core DAO Network
CORE_RPC_URL="https://rpc.coredao.org"
CORE_TESTNET_RPC_URL="https://rpc.test.btcs.network"
CORE_EXPLORER_API_KEY="your_explorer_api_key"
PRIVATE_KEY="your_wallet_private_key"

# Contract (after deployment)
NFT_CONTRACT_ADDRESS="deployed_contract_address"
TOKEN_CONTRACT_ADDRESS="deployed_token_address"
```

### Installation

```bash
# Clone the repository
git clone https://github.com/developla/softcore.git
cd softcore

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate
```

### Smart Contract Deployment

1. Configure Network

   ```bash
   # Deploy to Core DAO testnet
   npm run deploy-contract -- --network testnet

   # Or deploy to Core DAO mainnet
   npm run deploy-contract -- --network core
   ```

2. Verify Contract

   ```bash
   # Verify on Core DAO Explorer
   npm run verify-contract -- <CONTRACT_ADDRESS> --network core
   ```

3. Update Environment Variables
   - Update `NFT_CONTRACT_ADDRESS` and `TOKEN_CONTRACT_ADDRESS` in `.env`

### Core DAO Network Configuration

#### Mainnet

- Network Name: Core DAO
- RPC URL: https://rpc.coredao.org
- Chain ID: 1116
- Symbol: CORE
- Block Explorer: https://scan.coredao.org

#### Testnet

- Network Name: Core DAO Testnet
- RPC URL: https://rpc.test.btcs.network
- Chain ID: 1115
- Symbol: tCORE
- Block Explorer: https://scan.test.btcs.network

## 💎 Token Economics

### Distribution

- Liquidity: 40%
- Seed Sale: 25%
- Community, Strategic & Marketing: 17.5%
- Private Sale, Advisors & Partners: 7.5%
- Treasury: 5%
- Team: 5%

### Token Utility

- In-game transactions
- Content creation rewards
- Governance participation
- Staking benefits

## 🔒 Security & Privacy

- End-to-end encryption for private content
- Blockchain-based verification
- Secure NFT minting and trading
- Private scene sharing options

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions to SoftCORE Games! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Previous Submissions

This project has not been submitted to any other hackathons or challenges.

## Project Status

- [x] Smart Contracts Deployed to Core Testnet
- [x] Frontend Development Complete
- [x] Backend Integration Complete
- [ ] Testing (Pending)
- [ ] Mainnet Deployment (Pending)

## Contact

For any queries regarding this hackathon submission or the project in general, please contact:

- Email: hello@softcore.games
- Discord: https://discord.gg/softcoregames
- Twitter: x.com/softcoregames
