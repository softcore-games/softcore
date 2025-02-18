# SoftCORE - AI-Powered Intimate Fantasy Experience

[Previous content remains unchanged until the Installation section]

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB database
- OpenAI API key
- Replicate API token
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
REPLICATE_API_TOKEN="your_replicate_token"

# Core DAO Network
CORE_RPC_URL="https://rpc.coredao.org"
CORE_TESTNET_RPC_URL="https://rpc.test.btcs.network"
CORE_EXPLORER_API_KEY="your_explorer_api_key"
PRIVATE_KEY="your_wallet_private_key"

# Contract (after deployment)
NFT_CONTRACT_ADDRESS="deployed_contract_address"
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
   - For testnet deployment:
     ```bash
     # Deploy to Core DAO testnet
     npm run deploy-contract -- --network testnet
     ```
   - For mainnet deployment:
     ```bash
     # Deploy to Core DAO mainnet
     npm run deploy-contract -- --network core
     ```

2. Verify Contract (optional)
   ```bash
   # Verify on Core DAO Explorer
   npm run verify-contract -- <CONTRACT_ADDRESS> --network core
   ```

3. Update Environment
   - Copy the deployed contract address
   - Update `NFT_CONTRACT_ADDRESS` in your `.env` file

4. Test Minting
   ```bash
   # Start the development server
   npm run dev
   
   # Navigate to /test/mint to try minting
   ```

### Core DAO Network Details

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

[Rest of the README remains unchanged]
```