# Softcore - A Programming-Themed Visual Novel

Softcore is an interactive visual novel game that combines programming education with engaging storytelling. Built with Next.js, TypeScript, and MongoDB, it offers a unique learning experience through character interactions and story-driven programming challenges.


## Features

- 🎮 Interactive Visual Novel Gameplay
- 👥 Character Relationship System
- 💾 Automatic Save/Load Progress
- 🔐 Secure Authentication System
- ⚡ Real-time Dialogue Generation
- 🎨 Beautiful UI with Custom Gradient Buttons
- 🌙 Dark Mode Support
- 📱 Responsive Design

## Tech Stack

- **Frontend:**
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - shadcn/ui Components
  - Zustand (State Management)

- **Backend:**
  - MongoDB (Database)
  - Prisma (ORM)
  - JWT Authentication
  - OpenAI API Integration

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB Database
- OpenAI API Key

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
DATABASE_URL="your_mongodb_url"
NEXTAUTH_SECRET="your_jwt_secret"
OPENAI_API_KEY="your_openai_api_key"
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/developla/softcore.git
cd softcore
```

2. Install dependencies:
```bash
npm install
```

3. Generate Prisma client:
```bash
npx prisma generate
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
softcore/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── game/              # Game pages
│   └── settings/          # Settings pages
├── components/            # React components
│   ├── game/             # Game-specific components
│   └── ui/               # UI components
├── lib/                   # Utility functions
├── prisma/               # Database schema
└── store/                # State management
```

## Game Features

### Character System
- Multiple characters with unique personalities
- Relationship tracking
- Dynamic dialogue generation using OpenAI

### Progress System
- Automatic save/load functionality
- Progress tracking across chapters
- Choice history

### Settings
- Volume control
- Text speed adjustment
- Autoplay options

## Authentication

The game uses a JWT-based authentication system with:
- Secure password hashing
- Refresh token rotation
- HTTP-only cookies
- Protected API routes

## Database Schema

### User Model
```prisma
model User {
  id            String         @id @default(auto()) @map("_id") @db.ObjectId
  email         String         @unique
  username      String         @unique
  password      String
  refreshTokens RefreshToken[]
  gameState     GameState?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}
```

### Game State Model
```prisma
model GameState {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  userId        String   @unique @db.ObjectId
  user          User     @relation(fields: [userId], references: [id])
  progress      Json
  relationships Json
  choices       Json
  settings      Json
  lastSaved     DateTime @default(now())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Character artwork and backgrounds (Add credits for your assets)
- OpenAI for dialogue generation
- shadcn/ui for the component library