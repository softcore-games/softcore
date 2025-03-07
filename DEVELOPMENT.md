# SoftCORE - Technical Development Guide 🛠

## Tech Stack Overview

### Frontend

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- WalletConnect v2

### Backend

- MongoDB + Prisma
- NextAuth.js
- Server Actions
- Night API Integration

### Blockchain

- Core DAO Network
- Ethers.js
- Smart Contracts (Solidity)

## 📁 Project Structure

```
/app
├── api/                  # API routes
│   ├── auth/            # Authentication endpoints
│   ├── characters/      # Character management
│   └── scenes/          # Scene management
├── components/          # Reusable components
├── lib/                 # Utility functions
└── pages/              # App routes

/builder                # Smart Contract Builder
├── contracts/          # Solidity contracts
├── scripts/            # Deployment scripts
└── test/              # Contract tests

/prisma
└── schema.prisma      # Database schema
```

## 🚀 Development Setup

1. **Clone Repository**

```bash
git clone https://github.com/your-username/softcore-game.git
cd softcore-game
```

2. **Install Dependencies**

```bash
npm install
```

3. **Environment Setup**

```bash
cp .env.example .env
```

Required Environment Variables:

```env
# Database
DATABASE_URL="mongodb://..."

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# APIs
NIGHT_API_KEY="your-night-api-key"

# Blockchain
CORE_DAO_RPC="your-rpc-url"
PRIVATE_KEY="your-private-key"
CONTRACT_ADDRESS="your-contract-address"
```

4. **Database Setup**

```bash
npx prisma generate
npx prisma db push
```

5. **Run Development Server**

```bash
npm run dev
```

## 🔧 Smart Contract Development

### Setup

```bash
cd builder
npm install
```

### Deploy Contracts

```bash
npx hardhat run scripts/deploy.ts --network core
```

### Test Contracts

```bash
npx hardhat test
```

### Verify Contracts

```bash
npx hardhat verify --network core [CONTRACT_ADDRESS]
```

## 🔄 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Session verification

### Characters

- `POST /api/characters/generate` - Generate new characters
- `GET /api/characters` - Get user's characters
- `PUT /api/characters/select` - Select active character

### Scenes

- `GET /api/scenes` - Get available scenes
- `POST /api/scenes/mint` - Mint scene as NFT

## 💾 Database Schema

### User

```prisma
model User {
  id            String      @id @default(auto()) @map("_id") @db.ObjectId
  email         String      @unique
  passwordHash  String
  characters    Character[]
  ownedScenes   Scene[]
  stamina       Int         @default(3)
  walletAddress String?
}
```

### Character

```prisma
model Character {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  userId      String   @db.ObjectId
  name        String
  personality String
  imageUrl    String
  user        User     @relation(fields: [userId], references: [id])
}
```

## 🔐 Security Considerations

- Implement rate limiting for API routes
- Validate all user inputs
- Secure storage of private keys
- Protected API routes with authentication
- Wallet signature verification
- Data validation middleware

## 🧪 Testing

### Run Tests

```bash
# Frontend/Backend Tests
npm run test

# Smart Contract Tests
cd builder && npx hardhat test
```

### Test Coverage

```bash
npm run test:coverage
```

## 📦 Build and Deploy

### Production Build

```bash
npm run build
```

### Deploy to Production

```bash
npm run deploy
```

## 🔍 Monitoring

- Use Sentry for error tracking
- MongoDB Atlas monitoring
- Core DAO network monitoring
- API endpoint health checks

## 📚 Additional Resources

- [Core DAO Documentation](https://docs.coredao.org)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Hardhat Documentation](https://hardhat.org/getting-started)

## 🐛 Common Issues and Solutions

1. **Prisma Generate Errors**

   - Run `npx prisma generate` after schema changes
   - Ensure DATABASE_URL is correct

2. **Smart Contract Deployment Failures**

   - Check PRIVATE_KEY and RPC URL
   - Ensure sufficient Core DAO tokens for gas

3. **Character Generation Issues**
   - Verify NIGHT_API_KEY
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
