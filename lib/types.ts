export interface GameState {
  userId: string;
  currentScene: string;
  inventory: string[];
  relationships: Record<string, number>;
  choices: string[];
  nfts: string[];
  isPremium: boolean;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  nftAddress?: string;
  traits?: CharacterTraits;
}

export interface CharacterTraits {
  personality: string[];
  interests: string[];
  background: string;
  speechPattern?: string;
}

export interface Scene {
  id: string;
  background: string;
  character?: Character;
  dialogue: string;
  choices: Choice[];
  requirements?: Requirements;
  metadata?: SceneMetadata;
}

export interface Choice {
  text: string;
  nextScene: string;
  requiresTokens?: boolean;
  tokenCost?: number;
  requiresNft?: string;
  relationshipEffect?: Record<string, number>;
  conditions?: ChoiceConditions;
}

export interface Requirements {
  nft?: string;
  tokens?: number;
  relationship?: Record<string, number>;
  items?: string[];
}

export interface ChoiceConditions {
  minRelationship?: Record<string, number>;
  hasItems?: string[];
  hasNfts?: string[];
  isPremium?: boolean;
}

export interface SceneMetadata {
  title?: string;
  chapter?: string;
  tags?: string[];
  music?: string;
  ambientSound?: string;
  timeOfDay?: string;
  location?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface GameProgress {
  userId: string;
  currentScene: string;
  inventory: string[];
  relationships: Record<string, number>;
  choices: GameChoice[];
  nfts: string[];
  isPremium: boolean;
  lastSaved: Date;
}

export interface GameChoice {
  sceneId: string;
  choiceText: string;
  timestamp: Date;
}
