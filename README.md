# SoftCORE Games - AI-Powered Dating Experience on Core DAO

## 🌟 About SoftCORE Games

SoftCORE Games is a revolutionary AI-powered dating simulation platform built on Core DAO, developed for the Core DAO Hackathon. We create intimate stories that unfold with you, using AI to craft unique experiences that are yours alone.

### 🎯 Mission

"Where fantasy meets desire, we bring people together through immersive storytelling, fueled by AI and driven by passion."

## 🚀 Key Features

- **AI-Powered Storytelling**: Dynamic conversations and storylines that adapt to your choices
- **Character Interaction**: Engage with unique AI characters with distinct personalities and backgrounds
- **NFT Integration**: Mint and own your special moments as unique digital assets on Core DAO
- **Blockchain Security**: Leveraging Core DAO for secure transactions and asset ownership
- **Interactive Choices**: Shape your story through meaningful dialogue options
- **Emotional Expression System**: Characters display various moods and reactions
- **Save/Load System**: Preserve and revisit your favorite moments
- **Wallet Integration**: Seamless Core DAO wallet connection for NFT minting

## 🛠 Technologies

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **AI Integration**: OpenAI GPT-4
- **Blockchain**: Core DAO, Ethers.js
- **Authentication**: Custom wallet authentication
- **State Management**: React Query, Context API
- **UI Components**: Radix UI, Framer Motion
- **Database**: MongoDB with Prisma
- **Styling**: Tailwind CSS with custom theme

## 🏗 Architecture

- **Smart Contracts**: NFT minting and ownership management on Core DAO
- **Backend API**: Next.js API routes for scene generation and NFT management
- **Frontend**: Responsive React components with dark/light mode support
- **Database**: MongoDB for storing character data and game states
- **Wallet Integration**: Core DAO wallet connection for NFT transactions

## 🚀 Getting Started

1. Clone the repository

```bash
git clone https://github.com/developla/softcore-games.git
cd softcore-games
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a secret.json file in the root directory:

```json
{
  "PrivateKey": "your-private-key-here"
}
```

4. Set up environment variables:

```bash

DATABASE_URL=your_mongodb_url
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS_TESTNET=your_nft_contract_address_testnet
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS_MAINNET=your_nft_contract_address_mainnet
NEXT_PUBLIC_API_KEY=your_random_api_key
```

5. Deploy the SoftCoreNFT Smart Contract:

First, compile the contract:

```bash
npx hardhat compile
```

Then deploy to Core DAO testnet:

```bash
npx hardhat run scripts/deploy.js --network core_testnet
```

Or deploy to Core DAO mainnet:

```bash
npx hardhat run scripts/deploy.js --network coredao
```

Save the deployed contract address that appears in the console output.

6. Run the development server:

```bash
npm run dev
# or
yarn dev
```

7. Open [http://localhost:3000](http://localhost:3000) with your browser to start your journey.

## 📝 Smart Contract Details

### SoftCoreNFT Contract

The SoftCoreNFT contract is an ERC721 implementation that allows:

- Minting of special moments as NFTs
- Storage of metadata URIs for each token
- Transfer and management of NFT ownership

Key contract features:

```solidity
// Mint new NFTs (only contract owner)
function safeMint(address to, string memory uri) public onlyOwner

// Get token URI
function tokenURI(uint256 tokenId) public view returns (string memory)
```

### Deployment Configuration

The contract can be deployed to:

- Core DAO Testnet

  - RPC URL: https://rpc.test2.btcs.network
  - Chain ID: 1114
  - Explorer: https://scan.test2.btcs.network

- Core DAO Mainnet
  - RPC URL: https://rpc.coredao.org
  - Chain ID: 1116
  - Explorer: https://scan.coredao.org

### Contract Verification

After deployment, verify your contract on Core DAO Explorer:

```bash
npx hardhat verify --network core_testnet <DEPLOYED_CONTRACT_ADDRESS>
```

### API Routes

#### Authentication

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token

#### Game

- `POST /api/generate-scene` - Generate new game scene
- `POST /api/generate-characters` - Generate character data
- `POST /api/mint-nft` - Mint scene as NFT

### Authentication Flow

1. **Registration**:

   - User submits username, email, and password
   - Password is hashed using bcryptjs
   - User data is stored in MongoDB
   - JWT token is generated and returned

2. **Login**:

   - User provides username and password
   - Credentials are verified against database
   - JWT token is generated and returned

3. **Protected Routes**:
   - JWT token is verified using middleware
   - Invalid or expired tokens redirect to login
   - Token is automatically refreshed when needed

### Game State Management

- Game state is persisted in localStorage
- JWT token handles authentication state
- React Query manages API state and caching
- Automatic token verification on protected routes

## 🌐 Core DAO Integration

SoftCORE Games leverages Core DAO's blockchain infrastructure for:

- NFT minting of special moments
- Secure wallet connections
- Transaction processing
- Asset ownership verification
- Cross-chain compatibility

## 💎 NFT Features

- Mint special moments as unique NFTs
- View NFTs in your personal gallery
- Trade NFTs with other users
- Verify ownership on Core DAO blockchain
- Custom metadata for each minted moment

## 🔐 Security Features

- Secure wallet integration
- Private data encryption
- Age verification system
- Safe transaction handling
- Blockchain-based asset protection

## 🔐 Security Considerations

When deploying and interacting with the smart contract:

1. Never commit your private keys or secret.json to version control
2. Use a dedicated development wallet for testing
3. Always test on testnet before mainnet deployment
4. Verify contract source code on the blockchain explorer
5. Audit contract code before mainnet deployment

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Core DAO Hackathon

This project was developed for the Core DAO Hackathon, showcasing the potential of combining AI technology with blockchain infrastructure to create meaningful digital experiences.

## 🙏 Acknowledgments

- Core DAO Team for their amazing blockchain infrastructure
- OpenAI for their powerful language models
- The entire blockchain gaming community

For more information about Core DAO, visit [Core DAO Official Website](https://coredao.org)
