# SoftCORE - Visual Novel Game Application Context

## Overview
SoftCORE is an AI-powered visual novel game built with Next.js, featuring interactive storytelling, NFT minting, and blockchain integration on the Core DAO network.

## Core Features

### 1. Authentication System
- Email/password-based authentication
- JWT token management
- Protected routes
- Admin privileges
- Age verification

### 2. Game Engine
- Visual novel progression system
- Character dialogue management
- Choice-based storytelling
- Scene transitions
- Background management
- Character sprite animations
- Text animation effects
- Auto-play support

### 3. AI Integration
#### Dialogue System (`lib/game/dialogue.ts`)
- OpenAI GPT-3.5 integration
- Dynamic response generation
- Context-aware conversations
- Character personality maintenance
- Response caching system
- Fallback handling

#### Scene Generation
- AI-powered scene variations
- Context-based responses
- Emotion and gesture inclusion
- Character consistency

### 4. Game State Management
- Progress tracking
- Relationship systems
- Choice history
- Settings persistence
- Save/load functionality

### 5. Blockchain Integration
#### Core DAO Network
- Mainnet and Testnet support
- Wallet connection (MetaMask)
- Network switching
- Transaction handling

#### NFT System
- Scene-based NFT minting
- Metadata generation
- IPFS integration
- Smart contract interaction
- Minting history

### 6. Stamina System
- Daily stamina limits
- Action costs
- Subscription tiers
- Automatic resets
- Usage tracking

### 7. Scene Management (`lib/game/script.ts`)
```typescript
interface Scene {
  id: string
  sceneId: string
  character: string
  emotion: string
  text: string
  next?: string
  choices?: { text: string; next: string }[]
  context?: string
  requiresAI: boolean
  background?: string
  type: string
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}
```

#### Features
- Scene sequencing
- Choice branching
- Character emotions
- Background management
- AI integration flags
- Metadata support

### 8. Character System
```typescript
interface Character {
  id: string
  characterId: string
  name: string
  personality: string
  background: string
  traits: string[]
  relationships?: Record<string, any>
  emotions: Record<string, string>
  images: Record<string, string>
}
```

#### Features
- Character profiles
- Emotion management
- Relationship tracking
- Image asset management
- Personality traits

### 9. Admin Dashboard
- Scene management
- Character management
- Asset management
- User management
- Content moderation

### 10. Subscription System
- Tier management (Free/Premium/Unlimited)
- Payment processing
- Feature access control
- Stamina limits
- Subscription expiration

## Database Schema

### Users
- Authentication data
- Profile information
- Game progress
- Stamina tracking
- Subscription status

### Game State
- Progress tracking
- Relationship data
- Choice history
- User settings

### Assets
- Character images
- Background images
- Scene assets
- Asset categorization

### Scenes
- Dialogue content
- Choice options
- Character references
- Background settings

### Characters
- Profile information
- Emotion mappings
- Relationship data
- Image references

## API Endpoints

### Authentication
- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/logout`

### Game
- `/api/game/scenes`
- `/api/dialogue`
- `/api/save`
- `/api/load`

### Admin
- `/api/admin/scenes`
- `/api/admin/characters`
- `/api/admin/assets`

### Blockchain
- `/api/nft/mint`
- `/api/scene/generate-image`

### User Management
- `/api/profile`
- `/api/subscription`
- `/api/user/stamina`

## Technology Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui
- Lucide Icons

### Backend
- Node.js
- Prisma ORM
- MongoDB
- OpenAI API
- Replicate API

### Blockchain
- Core DAO Network
- Ethers.js
- Web3React
- OpenZeppelin
- Hardhat

## Development Guidelines

### Code Organization
- Feature-based component structure
- Shared UI components
- Type-safe database queries
- API route handlers
- Blockchain utilities

### State Management
- Zustand for global state
- React hooks for local state
- Persistent storage
- Type-safe store

### Security
- JWT authentication
- Protected routes
- API validation
- Rate limiting
- Age verification

### Performance
- Response caching
- Image optimization
- Lazy loading
- State persistence
- Error boundaries

### Testing
- Unit tests
- Integration tests
- Smart contract tests
- Type checking

## Deployment

### Requirements
- Node.js 18+
- MongoDB database
- OpenAI API key
- Replicate API token
- Core DAO wallet
- Environment variables

### Environment Variables
```env
# Database
DATABASE_URL="mongodb_url"

# Authentication
NEXTAUTH_SECRET="jwt_secret"

# AI Services
OPENAI_API_KEY="openai_key"
REPLICATE_API_TOKEN="replicate_token"

# Core DAO Network
CORE_RPC_URL="https://rpc.coredao.org"
CORE_TESTNET_RPC_URL="https://rpc.test.btcs.network"
CORE_EXPLORER_API_KEY="explorer_key"
PRIVATE_KEY="wallet_private_key"

# Contract
NFT_CONTRACT_ADDRESS="contract_address"
```