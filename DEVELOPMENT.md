# SoftCORE - Technical Development Guide 🛠

## Tech Stack Overview

### Frontend

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- Ethers.js v6

### Backend

- MongoDB + Prisma
- JWT Authentication
- Server Actions
- OpenAI Integration
- fal.ai Integration

### Blockchain

- Core DAO Network
- OpenZeppelin Contracts
- Hardhat

## 📁 Project Structure

```
/app                    # Next.js app directory
├── /character/         # Character selection page
├── /game/[characterId] # Game page for each character
├── /about/             # About page
├── /faq/               # FAQ page
├── /nft-gallery        # NFT gallery page
├── /contact            # Contact page/       # NFT gallery page
└── /page.tsx           # Home page

/builder              # Smart Contract Builder
├── contracts/        # Solidity contracts
├── scripts/          # Deployment scripts
└── test/             # Contract tests

/lib                 # Utility functions
├── auth.ts          # Authentication logic
├── open-ai.ts       # OpenAI integration
├── fal-ai.ts        # AI integration
├── prisma.ts        # Prisma client
└── constants.ts     # App constants

/prisma
└── schema.prisma    # Database schema
```

## 🚀 Development Setup

- NOTE: Make sure MetaMask is installed and connected to Core DAO network [Core DAO Documentation](https://docs.coredao.org/docs/Learn/introduction/quickstart)

1. **Clone Repository**

```bash
git clone https://github.com/softcore-games/softcore.git
cd softcore
```

2. **Install Dependencies**

```bash
yarn install
```

3. **Environment Setup**

```bash
cp .example-env .env
```

Required Environment Variables:

```env
# Next.js
NEXT_PUBLIC_URL="your-domain.com"

# Database
DATABASE_URL="mongodb://..."

# Authentication
JWT_SECRET="your-secret"

# APIs
OPENAI_API_KEY="your-openai-key"
FAL_AI_KEY="your-fal-ai-key"
NIGHT_API_KEY="your-night-api-key"

# Blockchain
NEXT_PUBLIC_CORE_DAO_RPC="your-rpc-url"
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS="your-contract-address"

# Additional Transaction Variables
NEXT_PUBLIC_TREASURY_ADDRESS="your-treasury-address"
NEXT_PUBLIC_CORE_DAO_SCAN="https://scan.coredao.org"
```

4. **Database Setup**

```bash
npx prisma generate
npx prisma db push
```

5. **Run Development Server**

```bash
yarn dev
```

## 🔧 Smart Contract Development

### Setup

```bash
cd builder
yarn install
```

### Deploy Contracts

```bash
npx hardhat compile
```

### Build Contracts

```bash
yarn build
```

## 🔄 API Endpoints

### Authentication

- User registration and login using JWT
- Session verification
- Wallet address linking

### Characters

- AI character generation using fal.ai
- Character selection and management
- Character state persistence

### Scenes

- Scene generation and progression
- NFT minting integration
- Scene history tracking

### Transactions

- Stamina purchase transaction tracking
- Transaction history management
- Core DAO blockchain verification
- Transaction status updates

## 💾 Database Schema

### User

```prisma
model User {
  id            String      @id @default(auto()) @map("_id") @db.ObjectId
  username      String      @unique
  email         String      @unique
  walletAddress String?     @unique
  password      String
  stamina       Int         @default(3)
  characters    Character[]
  scenes        Scene[]
  selectedCharacterId String? @db.ObjectId
}
```

### StaminaTransaction

```prisma
model StaminaTransaction {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  userId          String    @db.ObjectId
  user            User      @relation(fields: [userId], references: [id])
  amount          Int
  price           String
  transactionHash String
  status          String    @default("completed")
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

## 🔐 Security Considerations

- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes
- Wallet signature verification
- Input validation

## 🧪 Testing

```bash
# Run tests
npm run test

# Smart Contract Tests
cd builder && npx hardhat test
```

## 📦 Deployment

```bash
# Production build
npm run build

# Deploy
vercel deploy
```

## 🔍 Monitoring

- Vercel Analytics
- MongoDB Atlas monitoring
- Core DAO network monitoring
- Transaction status tracking
- Core DAO transaction verification
- Treasury balance monitoring

## 📚 Additional Resources

- [Open AI Documentation](https://platform.openai.com/)
- [Core DAO Documentation](https://developer.coredao.org/)
- [fal.ai Documentation](https://fal.ai/models/fal-ai/flux/dev/image-to-image)
- [Prisma Documentation](https://www.prisma.io/docs/getting-started)
- [Hardhat Documentation](https://hardhat.org/hardhat-runner/docs/getting-started)

## 🐛 Common Issues and Solutions

1. **Prisma Issues**

   - Run `npx prisma generate` after schema changes
   - Verify MongoDB connection string

2. **Smart Contract Deployment**

   - Check network configuration in hardhat.config.js
   - Ensure sufficient Core DAO tokens for gas

3. **Image Generation Issues**
   - Verify FAL_AI_KEY
   - Check API rate limits

## 👥 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📝 License

MIT

---

Built for the Core DAO Hackathon
