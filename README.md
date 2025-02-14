# SoftCore - Blockchain-Powered Interactive Visual Novel

SoftCore is an innovative interactive visual novel game that combines blockchain technology, AI-powered characters, and dynamic storytelling. Built on Core Blockchain, it offers players a unique experience where their choices matter and interactions with characters are enhanced by artificial intelligence.

## 🎮 Features

### Core Gameplay
- **Interactive Storytelling**: Make choices that impact the narrative and shape your unique journey
- **Dynamic Characters**: Interact with AI-powered characters that remember your choices
- **Relationship System**: Build connections with characters through your decisions
- **Mystery Elements**: Uncover hidden storylines and secrets

### Blockchain Integration
- **NFT Characters & Items**: Own unique characters and items as NFTs
- **Token-Gated Content**: Access premium choices and storylines using Core tokens
- **On-Chain Progress**: Save key decisions on the blockchain
- **NFT Collectibles**: Earn limited-edition NFTs for completing story arcs

### NFT Mechanics
- **Unique Digital Assets**: Each NFT scene is a one-of-a-kind digital asset representing ownership
- **Transferability**: NFT scenes can be traded, collected, and shared between players
- **Verifiable Ownership**: Blockchain technology ensures authenticity and security of assets
- **Scene Creation**: Players can create and customize erotic scenes as NFTs
- **Private Sharing**: NFT scenes can be shared privately or publicly
- **Character Customization**: Personalize character traits and preferences

### Tokenomics
#### Token Allocation
| Category                          | Percentage | Vesting                        |
|----------------------------------|------------|--------------------------------|
| Liquidity                        | 40%        | -                              |
| Seed Sale                        | 25%        | -                              |
| Community, Strategic & Marketing  | 17.5%      | 25% at TGE, 3 Months Linear   |
| Private Sale, Advisors & Partners | 7.5%       | -                              |
| Treasury                         | 5%         | -                              |
| Team                             | 5%         | 0% at TGE, 3 Months Linear     |

#### Token Utility
- **In-Game Transactions**: Buy and sell digital assets, customizations, and premium content
- **Rewards & Incentives**: Token rewards for active engagement and content creation
- **Governance**: Community participation in decision-making processes
- **Staking**: Users can stake tokens for additional benefits and rewards

### AI-Powered Features
#### Free Mode
- Limited daily AI interactions
- Basic character responses
- Core storyline access

#### Premium Mode (Token-Powered)
- Enhanced AI conversations using GPT-4
- Deeper character memory and relationships
- Exclusive dialogue options and story branches
- Custom AI model selection

### Data Persistence (MongoDB)
- **Chat History**: Store all player-character interactions
- **Game Progress**: Save game state and choices
- **Relationship Tracking**: Monitor and persist character relationships
- **Player Inventory**: Track owned items and NFTs
- **Achievement System**: Record player milestones

## 🛠 Technical Stack

- **Frontend**: Next.js, Tailwind CSS, shadcn/ui
- **Blockchain**: Core Network (EVM-compatible)
- **Smart Contracts**: Solidity
- **Database**: MongoDB Atlas
- **AI Integration**: OpenAI API
- **Authentication**: Web3 Wallet (MetaMask, WalletConnect)

## 📦 Prerequisites

- Node.js 18+
- Core Wallet or MetaMask
- MongoDB Atlas account
- Core testnet CORE tokens for testing
- OpenAI API key
- WalletConnect Project ID (Get it from [WalletConnect Cloud](https://cloud.walletconnect.com/))

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/developla/softcore.git
   cd softcore
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXT_PUBLIC_GAME_TOKEN_ADDRESS`: Core token contract address
   - `NEXT_PUBLIC_GAME_ITEMS_ADDRESS`: NFT contract address
   - `NEXT_PUBLIC_OPENAI_API_KEY`: OpenAI API key for AI features
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Your WalletConnect Project ID from WalletConnect Cloud

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎮 Game Mechanics

### Story Progression
- Make choices that affect the narrative
- Build relationships with characters
- Collect items and NFTs
- Unlock premium content with tokens

### NFT System
- Mint character companions
- Collect special items
- Trade assets on the marketplace
- Stake tokens for premium features

### AI Interactions
- Chat with AI-powered characters
- Dynamic responses based on relationship levels
- Memory of previous interactions
- Premium dialogue options
- 

## 🔗 Smart Contracts

### GameToken (SCT)
- ERC20 token for premium features
- Staking mechanism
- Premium status tracking

### GameItems
- ERC721 NFT implementation
- Character and item minting
- Metadata storage
- Trading functionality

## 🛡 Security

- Row Level Security (RLS) for data protection
- Secure wallet integration
- Protected API endpoints
- Rate limiting for AI interactions
- MongoDB authentication and encryption

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@softcore.game or join our Discord community.

## 🙏 Acknowledgments

- Core DAO for blockchain infrastructure
- OpenAI for AI capabilities
- MongoDB Atlas for database services
- The amazing open-source community

---

Built with ❤️ for the Core DAO ecosystem