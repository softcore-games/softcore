# Softcore - A Programming-Themed Visual Novel

Softcore is an interactive visual novel game that combines programming education with engaging storytelling. Built with Next.js, TypeScript, and MongoDB, it offers a unique learning experience through character interactions and story-driven programming challenges.

## Core Features

### 1. Visual Novel Engine
- Dynamic dialogue system with character expressions and animations
- Branching storylines based on player choices
- Background scene management
- Character sprite system with multiple emotions
- Smooth transitions and animations using Framer Motion

### 2. AI-Powered Dialogue Generation
- OpenAI integration for dynamic character responses
- Context-aware dialogue generation
- Caching system for performance optimization
- Fallback responses for offline functionality

### 3. User System
- Secure authentication with JWT
- Email and password registration
- Profile management
- Game progress saving/loading
- User settings persistence

### 4. Game Mechanics
- Choice-based narrative progression
- Character relationship system
- Multiple story paths
- Auto-save functionality
- Game settings customization:
  - Text speed control
  - Volume settings
  - Autoplay options

### 5. Admin Dashboard
- Comprehensive content management system
- Scene Management:
  - Create, edit, and delete scenes
  - Configure dialogue, choices, and transitions
  - Set scene backgrounds and character emotions
  - Enable/disable AI generation for responses
  
- Character Management:
  - Create and edit character profiles
  - Define personality traits and backgrounds
  - Manage character emotions and expressions
  - Configure character relationships
  
- Asset Management:
  - Upload and organize background images
  - Manage character sprites
  - Categorize assets by type
  - Track asset usage

### 6. Database Integration
- MongoDB with Prisma ORM
- Efficient data modeling for:
  - User profiles
  - Game states
  - Scenes
  - Characters
  - Assets
- Automatic schema validation
- Type-safe database operations

### 7. Technical Features
- Built with Next.js 14 and TypeScript
- Server-side rendering for optimal performance
- API routes for secure data handling
- Responsive design for all screen sizes
- Dark mode support
- Modern UI with Tailwind CSS and shadcn/ui

## Technology Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui Components
- Zustand (State Management)

### Backend
- Next.js API Routes
- MongoDB
- Prisma ORM
- JWT Authentication
- OpenAI API Integration

### Development Tools
- ESLint
- Prettier
- TypeScript
- Zod (Schema Validation)

## Security Features

### Authentication
- JWT-based authentication
- HTTP-only cookies
- Password hashing with bcrypt
- Protected API routes
- Admin role management

### Data Protection
- Input validation with Zod
- XSS protection
- CSRF protection
- Rate limiting
- Secure headers

## Game Features

### Character System
- Multiple characters with unique personalities
- Dynamic relationship tracking
- AI-powered dialogue generation
- Emotion system with visual representations

### Progress System
- Automatic save/load functionality
- Progress tracking across chapters
- Choice history
- Relationship status tracking

### Settings
- Text speed adjustment (slow/normal/fast)
- Volume control
- Autoplay toggle
- UI customization options

## Admin Features

### Scene Management
- Create and edit scenes
- Configure dialogue options
- Set up choice branches
- Manage scene backgrounds
- Control AI dialogue generation

### Character Management
- Create and edit characters
- Define personality traits
- Configure emotions and expressions
- Manage character relationships
- Upload character sprites

### Asset Management
- Upload and organize backgrounds
- Manage character images
- Categorize assets
- Track asset usage
- Bulk import/export

## Database Schema

### User Model
```prisma
model User {
  id        String     @id @default(auto()) @map("_id") @db.ObjectId
  email     String     @unique
  username  String     @unique
  password  String
  isAdmin   Boolean    @default(false)
  gameState GameState?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
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

### Scene Model
```prisma
model Scene {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  sceneId     String   @unique
  character   String
  emotion     String
  text        String
  next        String?
  choices     Json?
  context     String?
  requiresAI  Boolean  @default(false)
  background  String?
  type        String   @default("dialogue")
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Character Model
```prisma
model Character {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  characterId   String   @unique
  name          String
  personality   String
  background    String
  traits        String[]
  relationships Json?
  emotions      Json
  images        Json
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Asset Model
```prisma
model Asset {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  type      String
  name      String
  url       String
  category  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([type, name])
}
```

## Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB Database
- OpenAI API Key

### Environment Setup
Create a `.env.local` file with:
```env
DATABASE_URL="your_mongodb_url"
NEXTAUTH_SECRET="your_jwt_secret"
OPENAI_API_KEY="your_openai_api_key"
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

# Start development server
npm run dev
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.